import { Request, Response, NextFunction } from 'express';
import { LogService } from '../services/log.service.js';
import { sendSuccess } from '../utils/response.js';

export class LogController {
  constructor(private logService: LogService) {}

  private param(req: Request, key: string): string {
    const val = req.params[key];
    return Array.isArray(val) ? val[0] : (val as string);
  }

  logHabit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = this.param(req, 'id');
      const log = this.logService.logHabit(habitId, req.body);
      sendSuccess(res, log, 'Habit logged successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = this.param(req, 'id');
      const { logs, total } = this.logService.getLogsByHabit(habitId, req.query as any);
      sendSuccess(res, logs, 'Habit logs retrieved successfully', 200, { total, count: logs.length });
    } catch (error) {
      next(error);
    }
  };

  getLogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = this.param(req, 'id');
      const logId = this.param(req, 'logId');
      const log = this.logService.getLogById(habitId, logId);
      sendSuccess(res, log, 'Habit log retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = this.param(req, 'id');
      const logId = this.param(req, 'logId');
      const log = this.logService.updateLog(habitId, logId, req.body);
      sendSuccess(res, log, 'Habit log updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = this.param(req, 'id');
      const logId = this.param(req, 'logId');
      this.logService.deleteLog(habitId, logId);
      sendSuccess(res, { id: logId }, 'Habit log deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteLogByDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const habitId = this.param(req, 'id');
      const date = this.param(req, 'date');
      this.logService.deleteLogByDate(habitId, date);
      sendSuccess(res, { habit_id: habitId, date }, 'Habit log for date deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
