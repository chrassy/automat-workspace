import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { HabitRepository } from '../repositories/habit.repository.js';
import { sendSuccess } from '../utils/response.js';

export class BackupController {
  constructor(
    private analyticsService: AnalyticsService,
    private habitRepo: HabitRepository
  ) {}

  exportData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = this.analyticsService.exportData();
      sendSuccess(res, data, 'Data exported successfully');
    } catch (error) {
      next(error);
    }
  };

  importData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = this.analyticsService.importData(req.body);
      sendSuccess(res, result, 'Data imported successfully');
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = this.habitRepo.getAllCategories();
      sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tags = this.habitRepo.getAllTags();
      sendSuccess(res, tags, 'Tags retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
