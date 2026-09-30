"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiRouter = createApiRouter;
const express_1 = require("express");
const habit_routes_js_1 = require("./habit.routes.js");
const analytics_routes_js_1 = require("./analytics.routes.js");
const validate_js_1 = require("../middleware/validate.js");
const habit_schema_js_1 = require("../schemas/habit.schema.js");
function createApiRouter(habitController, logController, analyticsController, backupController) {
    const router = (0, express_1.Router)();
    // Root healthcheck & info
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Habit routes
    router.use('/habits', (0, habit_routes_js_1.createHabitRouter)(habitController, logController));
    // Analytics routes
    router.use('/analytics', (0, analytics_routes_js_1.createAnalyticsRouter)(analyticsController));
    // Metadata routes
    router.get('/categories', backupController.getCategories);
    router.get('/tags', backupController.getTags);
    // Backup / Export / Import routes
    router.get('/export', backupController.exportData);
    router.post('/import', (0, validate_js_1.validateBody)(habit_schema_js_1.importSchema), backupController.importData);
    return router;
}
