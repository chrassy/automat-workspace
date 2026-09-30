"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = void 0;
const response_js_1 = require("../utils/response.js");
class LogController {
    logService;
    constructor(logService) {
        this.logService = logService;
    }
    param(req, key) {
        const val = req.params[key];
        return Array.isArray(val) ? val[0] : val;
    }
    logHabit = async (req, res, next) => {
        try {
            const habitId = this.param(req, 'id');
            const log = this.logService.logHabit(habitId, req.body);
            (0, response_js_1.sendSuccess)(res, log, 'Habit logged successfully', 201);
        }
        catch (error) {
            next(error);
        }
    };
    getLogs = async (req, res, next) => {
        try {
            const habitId = this.param(req, 'id');
            const { logs, total } = this.logService.getLogsByHabit(habitId, req.query);
            (0, response_js_1.sendSuccess)(res, logs, 'Habit logs retrieved successfully', 200, { total, count: logs.length });
        }
        catch (error) {
            next(error);
        }
    };
    getLogById = async (req, res, next) => {
        try {
            const habitId = this.param(req, 'id');
            const logId = this.param(req, 'logId');
            const log = this.logService.getLogById(habitId, logId);
            (0, response_js_1.sendSuccess)(res, log, 'Habit log retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    updateLog = async (req, res, next) => {
        try {
            const habitId = this.param(req, 'id');
            const logId = this.param(req, 'logId');
            const log = this.logService.updateLog(habitId, logId, req.body);
            (0, response_js_1.sendSuccess)(res, log, 'Habit log updated successfully');
        }
        catch (error) {
            next(error);
        }
    };
    deleteLog = async (req, res, next) => {
        try {
            const habitId = this.param(req, 'id');
            const logId = this.param(req, 'logId');
            this.logService.deleteLog(habitId, logId);
            (0, response_js_1.sendSuccess)(res, { id: logId }, 'Habit log deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
    deleteLogByDate = async (req, res, next) => {
        try {
            const habitId = this.param(req, 'id');
            const date = this.param(req, 'date');
            this.logService.deleteLogByDate(habitId, date);
            (0, response_js_1.sendSuccess)(res, { habit_id: habitId, date }, 'Habit log for date deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LogController = LogController;
