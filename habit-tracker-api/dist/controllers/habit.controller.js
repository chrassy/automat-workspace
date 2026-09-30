"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitController = void 0;
const response_js_1 = require("../utils/response.js");
class HabitController {
    habitService;
    constructor(habitService) {
        this.habitService = habitService;
    }
    create = async (req, res, next) => {
        try {
            const habit = this.habitService.createHabit(req.body);
            (0, response_js_1.sendSuccess)(res, habit, 'Habit created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const { habits, total } = this.habitService.listHabits(req.query);
            (0, response_js_1.sendSuccess)(res, habits, 'Habits retrieved successfully', 200, { total, count: habits.length });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const habit = this.habitService.getHabitWithStats(habitId);
            (0, response_js_1.sendSuccess)(res, habit, 'Habit retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const habit = this.habitService.updateHabit(habitId, req.body);
            (0, response_js_1.sendSuccess)(res, habit, 'Habit updated successfully');
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            this.habitService.deleteHabit(habitId);
            (0, response_js_1.sendSuccess)(res, { id: habitId }, 'Habit deleted successfully');
        }
        catch (error) {
            next(error);
        }
    };
    archive = async (req, res, next) => {
        try {
            const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const habit = this.habitService.archiveHabit(habitId);
            (0, response_js_1.sendSuccess)(res, habit, 'Habit archived successfully');
        }
        catch (error) {
            next(error);
        }
    };
    unarchive = async (req, res, next) => {
        try {
            const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const habit = this.habitService.unarchiveHabit(habitId);
            (0, response_js_1.sendSuccess)(res, habit, 'Habit unarchived successfully');
        }
        catch (error) {
            next(error);
        }
    };
    getStats = async (req, res, next) => {
        try {
            const habitId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const habit = this.habitService.getHabitById(habitId);
            const stats = this.habitService.calculateHabitStats(habit);
            (0, response_js_1.sendSuccess)(res, stats, 'Habit stats calculated successfully');
        }
        catch (error) {
            next(error);
        }
    };
}
exports.HabitController = HabitController;
