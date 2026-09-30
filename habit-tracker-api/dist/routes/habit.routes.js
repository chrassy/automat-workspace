"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHabitRouter = createHabitRouter;
const express_1 = require("express");
const validate_js_1 = require("../middleware/validate.js");
const habit_schema_js_1 = require("../schemas/habit.schema.js");
function createHabitRouter(habitController, logController) {
    const router = (0, express_1.Router)();
    // Habit CRUD
    router.post('/', (0, validate_js_1.validateBody)(habit_schema_js_1.createHabitSchema), habitController.create);
    router.get('/', (0, validate_js_1.validateQuery)(habit_schema_js_1.habitQuerySchema), habitController.list);
    router.get('/:id', habitController.getById);
    router.put('/:id', (0, validate_js_1.validateBody)(habit_schema_js_1.updateHabitSchema), habitController.update);
    router.delete('/:id', habitController.delete);
    // Archive / Unarchive
    router.post('/:id/archive', habitController.archive);
    router.post('/:id/unarchive', habitController.unarchive);
    // Habit Stats
    router.get('/:id/stats', habitController.getStats);
    // Sub-resource: Habit Logs / Check-ins
    router.post('/:id/logs', (0, validate_js_1.validateBody)(habit_schema_js_1.createLogSchema), logController.logHabit);
    router.post('/:id/check-in', (0, validate_js_1.validateBody)(habit_schema_js_1.createLogSchema), logController.logHabit);
    router.get('/:id/logs', (0, validate_js_1.validateQuery)(habit_schema_js_1.logQuerySchema), logController.getLogs);
    router.get('/:id/logs/:logId', logController.getLogById);
    router.put('/:id/logs/:logId', (0, validate_js_1.validateBody)(habit_schema_js_1.updateLogSchema), logController.updateLog);
    router.delete('/:id/logs/:logId', logController.deleteLog);
    router.delete('/:id/logs/date/:date', logController.deleteLogByDate);
    return router;
}
