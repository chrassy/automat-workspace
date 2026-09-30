"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const uuid_1 = require("uuid");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
const date_js_1 = require("../utils/date.js");
class LogService {
    habitRepo;
    logRepo;
    constructor(habitRepo, logRepo) {
        this.habitRepo = habitRepo;
        this.logRepo = logRepo;
    }
    logHabit(habitId, input) {
        const habit = this.habitRepo.findById(habitId);
        if (!habit) {
            throw new errorHandler_js_1.AppError(`Habit with id ${habitId} not found`, 404);
        }
        const date = input.date || (0, date_js_1.getTodayDateString)();
        const now = new Date().toISOString();
        const completedAt = input.completed_at || now;
        const value = input.value !== undefined ? input.value : 1;
        const targetMet = input.target_met !== undefined
            ? input.target_met
            : value >= habit.target_count;
        const log = {
            id: (0, uuid_1.v4)(),
            habit_id: habitId,
            date,
            completed_at: completedAt,
            value,
            target_met: targetMet,
            notes: input.notes?.trim() || null,
            mood: input.mood || null,
            rating: input.rating ?? null,
            created_at: now,
            updated_at: now,
        };
        return this.logRepo.upsert(log);
    }
    getLogsByHabit(habitId, query) {
        const habit = this.habitRepo.findById(habitId);
        if (!habit) {
            throw new errorHandler_js_1.AppError(`Habit with id ${habitId} not found`, 404);
        }
        return this.logRepo.findByHabitId(habitId, query);
    }
    getLogById(habitId, logId) {
        const habit = this.habitRepo.findById(habitId);
        if (!habit) {
            throw new errorHandler_js_1.AppError(`Habit with id ${habitId} not found`, 404);
        }
        const log = this.logRepo.findById(logId);
        if (!log || log.habit_id !== habitId) {
            throw new errorHandler_js_1.AppError(`Log with id ${logId} not found for this habit`, 404);
        }
        return log;
    }
    updateLog(habitId, logId, input) {
        const log = this.getLogById(habitId, logId);
        const habit = this.habitRepo.findById(habitId);
        const value = input.value !== undefined ? input.value : log.value;
        const targetMet = input.target_met !== undefined
            ? input.target_met
            : (input.value !== undefined ? input.value >= habit.target_count : log.target_met);
        const updates = {
            ...(input.value !== undefined && { value }),
            target_met: targetMet,
            ...(input.notes !== undefined && { notes: input.notes?.trim() || null }),
            ...(input.mood !== undefined && { mood: input.mood }),
            ...(input.rating !== undefined && { rating: input.rating }),
        };
        const updated = this.logRepo.update(logId, updates);
        if (!updated) {
            throw new errorHandler_js_1.AppError(`Failed to update log ${logId}`, 500);
        }
        return updated;
    }
    deleteLog(habitId, logId) {
        this.getLogById(habitId, logId);
        this.logRepo.delete(logId);
    }
    deleteLogByDate(habitId, date) {
        const habit = this.habitRepo.findById(habitId);
        if (!habit) {
            throw new errorHandler_js_1.AppError(`Habit with id ${habitId} not found`, 404);
        }
        const deleted = this.logRepo.deleteByHabitAndDate(habitId, date);
        if (!deleted) {
            throw new errorHandler_js_1.AppError(`No log found for habit on date ${date}`, 404);
        }
    }
}
exports.LogService = LogService;
