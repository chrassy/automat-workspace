"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitService = void 0;
const uuid_1 = require("uuid");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const date_js_1 = require("../utils/date.js");
class HabitService {
    habitRepo;
    logRepo;
    constructor(habitRepo, logRepo) {
        this.habitRepo = habitRepo;
        this.logRepo = logRepo;
    }
    createHabit(input) {
        const now = new Date().toISOString();
        const habit = {
            id: (0, uuid_1.v4)(),
            name: input.name.trim(),
            description: input.description?.trim() || null,
            category: input.category.trim().toLowerCase(),
            frequency_type: input.frequency_type,
            target_days: input.target_days || [],
            target_count: input.target_count || 1,
            unit: input.unit.trim(),
            color: input.color,
            tags: (input.tags || []).map(t => t.trim().toLowerCase()),
            archived: false,
            created_at: now,
            updated_at: now,
        };
        return this.habitRepo.create(habit);
    }
    getHabitById(id) {
        const habit = this.habitRepo.findById(id);
        if (!habit) {
            throw new errorHandler_js_1.AppError(`Habit with id ${id} not found`, 404);
        }
        return habit;
    }
    getHabitWithStats(id) {
        const habit = this.getHabitById(id);
        const stats = this.calculateHabitStats(habit);
        return {
            ...habit,
            stats,
        };
    }
    listHabits(query) {
        const { habits, total } = this.habitRepo.findAll(query);
        const habitsWithStats = habits.map(h => ({
            ...h,
            stats: this.calculateHabitStats(h),
        }));
        return { habits: habitsWithStats, total };
    }
    updateHabit(id, input) {
        this.getHabitById(id); // Ensure exists
        const updates = {};
        if (input.name !== undefined)
            updates.name = input.name.trim();
        if (input.description !== undefined)
            updates.description = input.description?.trim() || null;
        if (input.category !== undefined)
            updates.category = input.category.trim().toLowerCase();
        if (input.frequency_type !== undefined)
            updates.frequency_type = input.frequency_type;
        if (input.target_days !== undefined)
            updates.target_days = input.target_days;
        if (input.target_count !== undefined)
            updates.target_count = input.target_count;
        if (input.unit !== undefined)
            updates.unit = input.unit.trim();
        if (input.color !== undefined)
            updates.color = input.color;
        if (input.tags !== undefined)
            updates.tags = input.tags.map(t => t.trim().toLowerCase());
        if (input.archived !== undefined)
            updates.archived = input.archived;
        const updated = this.habitRepo.update(id, updates);
        if (!updated) {
            throw new errorHandler_js_1.AppError(`Failed to update habit with id ${id}`, 500);
        }
        return updated;
    }
    archiveHabit(id) {
        return this.updateHabit(id, { archived: true });
    }
    unarchiveHabit(id) {
        return this.updateHabit(id, { archived: false });
    }
    deleteHabit(id) {
        this.getHabitById(id); // Ensure exists
        this.habitRepo.delete(id);
    }
    calculateHabitStats(habit) {
        const logs = this.logRepo.getAllLogsForHabit(habit.id);
        const completedLogs = logs.filter(l => l.target_met && l.value >= habit.target_count);
        const today = (0, date_js_1.getTodayDateString)();
        const yesterday = (0, date_js_1.getYesterdayDateString)();
        const completedDates = new Set(completedLogs.map(l => l.date));
        const totalCompletions = completedLogs.length;
        const totalValue = logs.reduce((sum, l) => sum + l.value, 0);
        const isCompletedToday = completedDates.has(today);
        // Last completed date
        const sortedCompletedDates = Array.from(completedDates).sort();
        const lastCompletedDate = sortedCompletedDates.length > 0
            ? sortedCompletedDates[sortedCompletedDates.length - 1]
            : null;
        // Calculate streaks based on frequency type
        let currentStreak = 0;
        let longestStreak = 0;
        if (habit.frequency_type === 'daily') {
            const streaks = this.calculateDailyStreaks(completedDates, today, yesterday);
            currentStreak = streaks.current;
            longestStreak = streaks.longest;
        }
        else if (habit.frequency_type === 'custom_days') {
            const streaks = this.calculateCustomDaysStreaks(habit.target_days, completedDates, today, yesterday);
            currentStreak = streaks.current;
            longestStreak = streaks.longest;
        }
        else {
            // weekly
            const streaks = this.calculateDailyStreaks(completedDates, today, yesterday);
            currentStreak = streaks.current;
            longestStreak = streaks.longest;
        }
        // Completion rate for last 7 days
        const last7Days = (0, date_js_1.getDatesInRange)((0, date_js_1.addDays)(today, -6), today);
        const scheduled7Days = last7Days.filter(d => (0, date_js_1.isHabitScheduledForDate)(habit.frequency_type, habit.target_days, d));
        const completed7Days = scheduled7Days.filter(d => completedDates.has(d)).length;
        const rate7d = scheduled7Days.length > 0 ? Math.round((completed7Days / scheduled7Days.length) * 100) : 0;
        // Completion rate for last 30 days
        const last30Days = (0, date_js_1.getDatesInRange)((0, date_js_1.addDays)(today, -29), today);
        const scheduled30Days = last30Days.filter(d => (0, date_js_1.isHabitScheduledForDate)(habit.frequency_type, habit.target_days, d));
        const completed30Days = scheduled30Days.filter(d => completedDates.has(d)).length;
        const rate30d = scheduled30Days.length > 0 ? Math.round((completed30Days / scheduled30Days.length) * 100) : 0;
        // All-time completion rate
        const createdDate = (0, date_js_1.formatDate)(new Date(habit.created_at));
        const allDaysSinceCreated = (0, date_js_1.getDatesInRange)(createdDate, today);
        const scheduledAllDays = allDaysSinceCreated.filter(d => (0, date_js_1.isHabitScheduledForDate)(habit.frequency_type, habit.target_days, d));
        const completedAllDays = scheduledAllDays.filter(d => completedDates.has(d)).length;
        const rateAllTime = scheduledAllDays.length > 0 ? Math.round((completedAllDays / scheduledAllDays.length) * 100) : 0;
        return {
            habit_id: habit.id,
            current_streak: currentStreak,
            longest_streak: longestStreak,
            total_completions: totalCompletions,
            total_value: Math.round(totalValue * 100) / 100,
            completion_rate_7d: rate7d,
            completion_rate_30d: rate30d,
            completion_rate_all_time: rateAllTime,
            last_completed_date: lastCompletedDate,
            is_completed_today: isCompletedToday,
        };
    }
    calculateDailyStreaks(completedDates, today, yesterday) {
        if (completedDates.size === 0) {
            return { current: 0, longest: 0 };
        }
        const sortedDates = Array.from(completedDates).sort();
        // Longest streak calculation
        let longest = 0;
        let currentSequence = 0;
        let prevDate = null;
        for (const d of sortedDates) {
            if (!prevDate) {
                currentSequence = 1;
            }
            else {
                const diff = (0, date_js_1.daysBetween)(prevDate, d);
                if (diff === 1) {
                    currentSequence++;
                }
                else if (diff > 1) {
                    currentSequence = 1;
                }
            }
            if (currentSequence > longest) {
                longest = currentSequence;
            }
            prevDate = d;
        }
        // Current streak calculation
        let current = 0;
        let checkDate = null;
        if (completedDates.has(today)) {
            checkDate = today;
        }
        else if (completedDates.has(yesterday)) {
            checkDate = yesterday;
        }
        else {
            checkDate = null;
        }
        if (checkDate) {
            let d = checkDate;
            while (completedDates.has(d)) {
                current++;
                d = (0, date_js_1.addDays)(d, -1);
            }
        }
        return { current, longest: Math.max(longest, current) };
    }
    calculateCustomDaysStreaks(targetDays, completedDates, today, yesterday) {
        if (completedDates.size === 0 || targetDays.length === 0) {
            return { current: 0, longest: 0 };
        }
        const sortedDates = Array.from(completedDates).sort();
        let longest = 0;
        let currentSeq = 0;
        // Find all scheduled dates in range of first logged to today
        const firstDate = sortedDates[0];
        const allDates = (0, date_js_1.getDatesInRange)(firstDate, today);
        const scheduledDates = allDates.filter(d => targetDays.includes((0, date_js_1.getDayOfWeek)(d)));
        for (const d of scheduledDates) {
            if (completedDates.has(d)) {
                currentSeq++;
                if (currentSeq > longest)
                    longest = currentSeq;
            }
            else {
                currentSeq = 0;
            }
        }
        // Current streak
        let current = 0;
        // Walk back scheduled dates from today/last scheduled
        const reversedScheduled = [...scheduledDates].reverse();
        let started = false;
        for (const d of reversedScheduled) {
            const isCompleted = completedDates.has(d);
            if (!started) {
                // If today is scheduled and completed, start
                // If today is scheduled and not completed, but it's today, we can check previous scheduled date
                if (d === today && !isCompleted) {
                    continue; // today not completed yet is fine, streak holds from prior scheduled day
                }
                if (isCompleted) {
                    started = true;
                    current++;
                }
                else {
                    break; // missed scheduled day
                }
            }
            else {
                if (isCompleted) {
                    current++;
                }
                else {
                    break;
                }
            }
        }
        return { current, longest: Math.max(longest, current) };
    }
}
exports.HabitService = HabitService;
