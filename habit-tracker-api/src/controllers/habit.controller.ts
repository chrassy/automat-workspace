import { Request, Response, NextFunction } from 'express';
import { HabitService } from '../services/habit.service.js';
import { sendSuccess } from '../utils/response.js';

export class HabitController {
  constructor(private habitService: HabitService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habit = this.habitService.createHabit(req.body);
      sendSuccess(res, habit, 'Habit created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { habits, total } = this.habitService.listHabits(req.query as any);
      sendSuccess(res, habits, 'Habits retrieved successfully', 200, { total, count: habits.length });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const habit = this.habitService.getHabitWithStats(habitId);
      sendSuccess(res, habit, 'Habit retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const habit = this.habitService.updateHabit(habitId, req.body);
      sendSuccess(res, habit, 'Habit updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      this.habitService.deleteHabit(habitId);
      sendSuccess(res, { id: habitId }, 'Habit deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  archive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const habit = this.habitService.archiveHabit(habitId);
      sendSuccess(res, habit, 'Habit archived successfully');
    } catch (error) {
      next(error);
    }
  };

  unarchive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const habit = this.habitService.unarchiveHabit(habitId);
      sendSuccess(res, habit, 'Habit unarchived successfully');
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const habit = this.habitService.getHabitById(habitId);
      const stats = this.habitService.calculateHabitStats(habit);
      sendSuccess(res, stats, 'Habit stats calculated successfully');
    } catch (error) {
      next(error);
    }
  };
}
