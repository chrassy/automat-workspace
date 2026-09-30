import express, { Express } from 'express';
import { Database } from 'better-sqlite3';
import { getDatabase } from './db/database.js';
import { HabitRepository } from './repositories/habit.repository.js';
import { LogRepository } from './repositories/log.repository.js';
import { HabitService } from './services/habit.service.js';
import { LogService } from './services/log.service.js';
import { AnalyticsService } from './services/analytics.service.js';
import { HabitController } from './controllers/habit.controller.js';
import { LogController } from './controllers/log.controller.js';
import { AnalyticsController } from './controllers/analytics.controller.js';
import { BackupController } from './controllers/backup.controller.js';
import { createApiRouter } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export interface AppOptions {
  db?: Database;
}

export function createApp(options?: AppOptions): Express {
  const app = express();
  const db = options?.db || getDatabase();

  // Middleware
  app.use(express.json());

  // Repositories
  const habitRepo = new HabitRepository(db);
  const logRepo = new LogRepository(db);

  // Services
  const habitService = new HabitService(habitRepo, logRepo);
  const logService = new LogService(habitRepo, logRepo);
  const analyticsService = new AnalyticsService(habitRepo, logRepo, habitService);

  // Controllers
  const habitController = new HabitController(habitService);
  const logController = new LogController(logService);
  const analyticsController = new AnalyticsController(analyticsService);
  const backupController = new BackupController(analyticsService, habitRepo);

  // Health check on root
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API router
  app.use('/api', createApiRouter(habitController, logController, analyticsController, backupController));

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
