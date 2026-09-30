"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyticsRouter = createAnalyticsRouter;
const express_1 = require("express");
const validate_js_1 = require("../middleware/validate.js");
const habit_schema_js_1 = require("../schemas/habit.schema.js");
function createAnalyticsRouter(analyticsController) {
    const router = (0, express_1.Router)();
    router.get('/overview', analyticsController.getOverview);
    router.get('/daily-summary', (0, validate_js_1.validateQuery)(habit_schema_js_1.dailySummaryQuerySchema), analyticsController.getDailySummary);
    return router;
}
