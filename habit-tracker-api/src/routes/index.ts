import { Router } from 'express';
import { HabitController } from '../controllers/habit.controller.js';
import { LogController } from '../controllers/log.controller.js';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { BackupController } from '../controllers/backup.controller.js';
import { createHabitRouter } from './habit.routes.js';
import { createAnalyticsRouter } from './analytics.routes.js';
import { validateBody } from '../middleware/validate.js';
import { importSchema } from '../schemas/habit.schema.js';

export function createApiRouter(
  habitController: HabitController,
  logController: LogController,
  analyticsController: AnalyticsController,
  backupController: BackupController
): Router {
  const router = Router();

  // Root healthcheck & info
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Habit routes
  router.use('/habits', createHabitRouter(habitController, logController));

  // Analytics routes
  router.use('/analytics', createAnalyticsRouter(analyticsController));

  // Metadata routes
  router.get('/categories', backupController.getCategories);
  router.get('/tags', backupController.getTags);

  // Backup / Export / Import routes
  router.get('/export', backupController.exportData);
  router.post('/import', validateBody(importSchema), backupController.importData);

  return router;
}
