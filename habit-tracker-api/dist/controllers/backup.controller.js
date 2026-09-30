"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupController = void 0;
const response_js_1 = require("../utils/response.js");
class BackupController {
    analyticsService;
    habitRepo;
    constructor(analyticsService, habitRepo) {
        this.analyticsService = analyticsService;
        this.habitRepo = habitRepo;
    }
    exportData = async (req, res, next) => {
        try {
            const data = this.analyticsService.exportData();
            (0, response_js_1.sendSuccess)(res, data, 'Data exported successfully');
        }
        catch (error) {
            next(error);
        }
    };
    importData = async (req, res, next) => {
        try {
            const result = this.analyticsService.importData(req.body);
            (0, response_js_1.sendSuccess)(res, result, 'Data imported successfully');
        }
        catch (error) {
            next(error);
        }
    };
    getCategories = async (req, res, next) => {
        try {
            const categories = this.habitRepo.getAllCategories();
            (0, response_js_1.sendSuccess)(res, categories, 'Categories retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    getTags = async (req, res, next) => {
        try {
            const tags = this.habitRepo.getAllTags();
            (0, response_js_1.sendSuccess)(res, tags, 'Tags retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.BackupController = BackupController;
