import { Router } from 'express';
import { HabitController } from '../controllers/habit.controller.js';
import { LogController } from '../controllers/log.controller.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createHabitSchema,
  createLogSchema,
  habitQuerySchema,
  logQuerySchema,
  updateHabitSchema,
  updateLogSchema,
} from '../schemas/habit.schema.js';

export function createHabitRouter(
  habitController: HabitController,
  logController: LogController
): Router {
  const router = Router();

  // Habit CRUD
  router.post('/', validateBody(createHabitSchema), habitController.create);
  router.get('/', validateQuery(habitQuerySchema), habitController.list);
  router.get('/:id', habitController.getById);
  router.put('/:id', validateBody(updateHabitSchema), habitController.update);
  router.delete('/:id', habitController.delete);

  // Archive / Unarchive
  router.post('/:id/archive', habitController.archive);
  router.post('/:id/unarchive', habitController.unarchive);

  // Habit Stats
  router.get('/:id/stats', habitController.getStats);

  // Sub-resource: Habit Logs / Check-ins
  router.post('/:id/logs', validateBody(createLogSchema), logController.logHabit);
  router.post('/:id/check-in', validateBody(createLogSchema), logController.logHabit);
  router.get('/:id/logs', validateQuery(logQuerySchema), logController.getLogs);
  router.get('/:id/logs/:logId', logController.getLogById);
  router.put('/:id/logs/:logId', validateBody(updateLogSchema), logController.updateLog);
  router.delete('/:id/logs/:logId', logController.deleteLog);
  router.delete('/:id/logs/date/:date', logController.deleteLogByDate);

  return router;
}
