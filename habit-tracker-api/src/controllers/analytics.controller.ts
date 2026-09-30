import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { sendSuccess } from '../utils/response.js';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  getOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const overview = this.analyticsService.getOverview();
      sendSuccess(res, overview, 'Analytics overview retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getDailySummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const date = req.query.date as string | undefined;
      const summary = this.analyticsService.getDailySummary(date);
      sendSuccess(res, summary, 'Daily summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
