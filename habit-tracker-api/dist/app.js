"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const database_js_1 = require("./db/database.js");
const habit_repository_js_1 = require("./repositories/habit.repository.js");
const log_repository_js_1 = require("./repositories/log.repository.js");
const habit_service_js_1 = require("./services/habit.service.js");
const log_service_js_1 = require("./services/log.service.js");
const analytics_service_js_1 = require("./services/analytics.service.js");
const habit_controller_js_1 = require("./controllers/habit.controller.js");
const log_controller_js_1 = require("./controllers/log.controller.js");
const analytics_controller_js_1 = require("./controllers/analytics.controller.js");
const backup_controller_js_1 = require("./controllers/backup.controller.js");
const index_js_1 = require("./routes/index.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
function createApp(options) {
    const app = (0, express_1.default)();
    const db = options?.db || (0, database_js_1.getDatabase)();
    // Middleware
    app.use(express_1.default.json());
    // Repositories
    const habitRepo = new habit_repository_js_1.HabitRepository(db);
    const logRepo = new log_repository_js_1.LogRepository(db);
    // Services
    const habitService = new habit_service_js_1.HabitService(habitRepo, logRepo);
    const logService = new log_service_js_1.LogService(habitRepo, logRepo);
    const analyticsService = new analytics_service_js_1.AnalyticsService(habitRepo, logRepo, habitService);
    // Controllers
    const habitController = new habit_controller_js_1.HabitController(habitService);
    const logController = new log_controller_js_1.LogController(logService);
    const analyticsController = new analytics_controller_js_1.AnalyticsController(analyticsService);
    const backupController = new backup_controller_js_1.BackupController(analyticsService, habitRepo);
    // Health check on root
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Mount API router
    app.use('/api', (0, index_js_1.createApiRouter)(habitController, logController, analyticsController, backupController));
    // 404 & Global Error Handling
    app.use(errorHandler_js_1.notFoundHandler);
    app.use(errorHandler_js_1.errorHandler);
    return app;
}
