"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const date_js_1 = require("../utils/date.js");
const uuid_1 = require("uuid");
class AnalyticsService {
    habitRepo;
    logRepo;
    habitService;
    constructor(habitRepo, logRepo, habitService) {
        this.habitRepo = habitRepo;
        this.logRepo = logRepo;
        this.habitService = habitService;
    }
    getOverview() {
        const { habits: allHabits } = this.habitRepo.findAll({});
        const activeHabits = allHabits.filter(h => !h.archived);
        const archivedHabits = allHabits.filter(h => h.archived);
        const totalLogs = this.logRepo.getTotalLogCount();
        const today = (0, date_js_1.getTodayDateString)();
        const yesterday = (0, date_js_1.getYesterdayDateString)();
        const habitStatsList = activeHabits.map(h => ({
            habit: h,
            stats: this.habitService.calculateHabitStats(h),
        }));
        // Scheduled today
        const scheduledToday = activeHabits.filter(h => (0, date_js_1.isHabitScheduledForDate)(h.frequency_type, h.target_days, today));
        const completedToday = scheduledToday.filter(h => {
            const stat = habitStatsList.find(s => s.habit.id === h.id);
            return stat?.stats.is_completed_today;
        });
        const todayCompletionRate = scheduledToday.length > 0
            ? Math.round((completedToday.length / scheduledToday.length) * 100)
            : 0;
        // Longest active streak
        let longestActiveStreak = null;
        let maxStreak = 0;
        for (const item of habitStatsList) {
            if (item.stats.current_streak > maxStreak) {
                maxStreak = item.stats.current_streak;
                longestActiveStreak = {
                    habit_id: item.habit.id,
                    habit_name: item.habit.name,
                    streak: item.stats.current_streak,
                };
            }
        }
        // Top habits
        const topHabits = [...habitStatsList]
            .sort((a, b) => b.stats.current_streak - a.stats.current_streak || b.stats.completion_rate_30d - a.stats.completion_rate_30d)
            .slice(0, 5)
            .map(item => ({
            id: item.habit.id,
            name: item.habit.name,
            category: item.habit.category,
            current_streak: item.stats.current_streak,
            completion_rate_30d: item.stats.completion_rate_30d,
        }));
        // Habits at risk: habits with active streak >= 2 that were completed yesterday but not yet today, and scheduled today
        const habitsAtRisk = habitStatsList
            .filter(item => {
            const isScheduled = (0, date_js_1.isHabitScheduledForDate)(item.habit.frequency_type, item.habit.target_days, today);
            return (isScheduled &&
                !item.stats.is_completed_today &&
                item.stats.current_streak > 0 &&
                item.stats.last_completed_date === yesterday);
        })
            .map(item => ({
            id: item.habit.id,
            name: item.habit.name,
            last_completed_date: item.stats.last_completed_date,
            streak_lost_potential: item.stats.current_streak,
        }));
        // Category distribution
        const categoryDistribution = {};
        for (const h of activeHabits) {
            categoryDistribution[h.category] = (categoryDistribution[h.category] || 0) + 1;
        }
        return {
            total_habits: allHabits.length,
            active_habits: activeHabits.length,
            archived_habits: archivedHabits.length,
            total_logs: totalLogs,
            today_completion_rate: todayCompletionRate,
            longest_active_streak: longestActiveStreak,
            top_habits: topHabits,
            habits_at_risk: habitsAtRisk,
            category_distribution: categoryDistribution,
        };
    }
    getDailySummary(dateStr) {
        const targetDate = dateStr || (0, date_js_1.getTodayDateString)();
        const { habits } = this.habitRepo.findAll({ archived: false });
        const logsForDate = this.logRepo.findLogsByDate(targetDate);
        const logsMap = new Map();
        logsForDate.forEach(l => logsMap.set(l.habit_id, l));
        const habitStatuses = habits.map(h => {
            const isScheduled = (0, date_js_1.isHabitScheduledForDate)(h.frequency_type, h.target_days, targetDate);
            const log = logsMap.get(h.id);
            const isCompleted = Boolean(log && log.target_met && log.value >= h.target_count);
            return {
                habit: h,
                is_scheduled: isScheduled,
                is_completed: isCompleted,
                total_value_today: log ? log.value : 0,
                target_count: h.target_count,
                logs: log ? [log] : [],
            };
        });
        const scheduledHabits = habitStatuses.filter(s => s.is_scheduled);
        const completedScheduledHabits = scheduledHabits.filter(s => s.is_completed);
        const completionRate = scheduledHabits.length > 0
            ? Math.round((completedScheduledHabits.length / scheduledHabits.length) * 100)
            : 0;
        return {
            date: targetDate,
            total_scheduled: scheduledHabits.length,
            total_completed: completedScheduledHabits.length,
            completion_rate: completionRate,
            habits: habitStatuses,
        };
    }
    exportData() {
        const { habits } = this.habitRepo.findAll({});
        const logs = this.logRepo.getAllLogs();
        return {
            exported_at: new Date().toISOString(),
            habits,
            logs,
        };
    }
    importData(input) {
        let habitsCount = 0;
        let logsCount = 0;
        const now = new Date().toISOString();
        for (const h of input.habits) {
            const habit = {
                id: h.id || (0, uuid_1.v4)(),
                name: h.name.trim(),
                description: h.description?.trim() || null,
                category: h.category.trim().toLowerCase(),
                frequency_type: h.frequency_type,
                target_days: h.target_days || [],
                target_count: h.target_count || 1,
                unit: h.unit.trim(),
                color: h.color,
                tags: (h.tags || []).map(t => t.trim().toLowerCase()),
                archived: h.archived || false,
                created_at: h.created_at || now,
                updated_at: h.updated_at || now,
            };
            const existing = this.habitRepo.findById(habit.id);
            if (existing) {
                this.habitRepo.update(habit.id, habit);
            }
            else {
                this.habitRepo.create(habit);
            }
            habitsCount++;
        }
        for (const l of input.logs) {
            const log = {
                id: l.id || (0, uuid_1.v4)(),
                habit_id: l.habit_id,
                date: l.date,
                completed_at: l.completed_at || now,
                value: l.value || 1,
                target_met: l.target_met !== undefined ? l.target_met : true,
                notes: l.notes?.trim() || null,
                mood: l.mood || null,
                rating: l.rating ?? null,
                created_at: l.created_at || now,
                updated_at: l.updated_at || now,
            };
            this.logRepo.upsert(log);
            logsCount++;
        }
        return { habits_imported: habitsCount, logs_imported: logsCount };
    }
}
exports.AnalyticsService = AnalyticsService;
