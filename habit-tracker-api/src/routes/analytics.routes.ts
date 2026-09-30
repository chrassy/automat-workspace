import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { validateQuery } from '../middleware/validate.js';
import { dailySummaryQuerySchema } from '../schemas/habit.schema.js';

export function createAnalyticsRouter(analyticsController: AnalyticsController): Router {
  const router = Router();

  router.get('/overview', analyticsController.getOverview);
  router.get('/daily-summary', validateQuery(dailySummaryQuerySchema), analyticsController.getDailySummary);

  return router;
}
