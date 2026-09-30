"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const response_js_1 = require("../utils/response.js");
class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getOverview = async (req, res, next) => {
        try {
            const overview = this.analyticsService.getOverview();
            (0, response_js_1.sendSuccess)(res, overview, 'Analytics overview retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    getDailySummary = async (req, res, next) => {
        try {
            const date = req.query.date;
            const summary = this.analyticsService.getDailySummary(date);
            (0, response_js_1.sendSuccess)(res, summary, 'Daily summary retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AnalyticsController = AnalyticsController;
