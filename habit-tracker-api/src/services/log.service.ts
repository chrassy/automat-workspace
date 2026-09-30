import { v4 as uuidv4 } from 'uuid';
import { HabitRepository } from '../repositories/habit.repository.js';
import { LogRepository } from '../repositories/log.repository.js';
import { HabitLog } from '../types/index.js';
import { CreateLogInput, LogQueryInput, UpdateLogInput } from '../schemas/habit.schema.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTodayDateString } from '../utils/date.js';

export class LogService {
  constructor(
    private habitRepo: HabitRepository,
    private logRepo: LogRepository
  ) {}

  logHabit(habitId: string, input: CreateLogInput): HabitLog {
    const habit = this.habitRepo.findById(habitId);
    if (!habit) {
      throw new AppError(`Habit with id ${habitId} not found`, 404);
    }

    const date = input.date || getTodayDateString();
    const now = new Date().toISOString();
    const completedAt = input.completed_at || now;
    const value = input.value !== undefined ? input.value : 1;
    const targetMet = input.target_met !== undefined 
      ? input.target_met 
      : value >= habit.target_count;

    const log: HabitLog = {
      id: uuidv4(),
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

  getLogsByHabit(habitId: string, query?: LogQueryInput): { logs: HabitLog[]; total: number } {
    const habit = this.habitRepo.findById(habitId);
    if (!habit) {
      throw new AppError(`Habit with id ${habitId} not found`, 404);
    }
    return this.logRepo.findByHabitId(habitId, query);
  }

  getLogById(habitId: string, logId: string): HabitLog {
    const habit = this.habitRepo.findById(habitId);
    if (!habit) {
      throw new AppError(`Habit with id ${habitId} not found`, 404);
    }

    const log = this.logRepo.findById(logId);
    if (!log || log.habit_id !== habitId) {
      throw new AppError(`Log with id ${logId} not found for this habit`, 404);
    }
    return log;
  }

  updateLog(habitId: string, logId: string, input: UpdateLogInput): HabitLog {
    const log = this.getLogById(habitId, logId);
    const habit = this.habitRepo.findById(habitId)!;

    const value = input.value !== undefined ? input.value : log.value;
    const targetMet = input.target_met !== undefined 
      ? input.target_met 
      : (input.value !== undefined ? input.value >= habit.target_count : log.target_met);

    const updates: Partial<HabitLog> = {
      ...(input.value !== undefined && { value }),
      target_met: targetMet,
      ...(input.notes !== undefined && { notes: input.notes?.trim() || null }),
      ...(input.mood !== undefined && { mood: input.mood }),
      ...(input.rating !== undefined && { rating: input.rating }),
    };

    const updated = this.logRepo.update(logId, updates);
    if (!updated) {
      throw new AppError(`Failed to update log ${logId}`, 500);
    }
    return updated;
  }

  deleteLog(habitId: string, logId: string): void {
    this.getLogById(habitId, logId);
    this.logRepo.delete(logId);
  }

  deleteLogByDate(habitId: string, date: string): void {
    const habit = this.habitRepo.findById(habitId);
    if (!habit) {
      throw new AppError(`Habit with id ${habitId} not found`, 404);
    }
    const deleted = this.logRepo.deleteByHabitAndDate(habitId, date);
    if (!deleted) {
      throw new AppError(`No log found for habit on date ${date}`, 404);
    }
  }
}
