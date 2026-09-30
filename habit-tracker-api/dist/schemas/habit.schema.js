"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importSchema = exports.dailySummaryQuerySchema = exports.logQuerySchema = exports.updateLogSchema = exports.createLogSchema = exports.habitQuerySchema = exports.updateHabitSchema = exports.createHabitSchema = void 0;
const zod_1 = require("zod");
exports.createHabitSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
    description: zod_1.z.string().max(500).optional().nullable(),
    category: zod_1.z.string().min(1).max(50).default('general'),
    frequency_type: zod_1.z.enum(['daily', 'weekly', 'custom_days']).default('daily'),
    target_days: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).default([]),
    target_count: zod_1.z.number().int().positive().default(1),
    unit: zod_1.z.string().min(1).max(30).default('times'),
    color: zod_1.z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').default('#3B82F6'),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(30)).default([]),
});
exports.updateHabitSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(500).optional().nullable(),
    category: zod_1.z.string().min(1).max(50).optional(),
    frequency_type: zod_1.z.enum(['daily', 'weekly', 'custom_days']).optional(),
    target_days: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).optional(),
    target_count: zod_1.z.number().int().positive().optional(),
    unit: zod_1.z.string().min(1).max(30).optional(),
    color: zod_1.z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(30)).optional(),
    archived: zod_1.z.boolean().optional(),
});
exports.habitQuerySchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
    archived: zod_1.z.enum(['true', 'false']).optional().transform(v => v === undefined ? undefined : v === 'true'),
    frequency_type: zod_1.z.enum(['daily', 'weekly', 'custom_days']).optional(),
    search: zod_1.z.string().optional(),
    sort_by: zod_1.z.enum(['name', 'created_at', 'category', 'updated_at']).default('created_at'),
    order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.createLogSchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    completed_at: zod_1.z.string().datetime().optional(),
    value: zod_1.z.number().positive().default(1),
    target_met: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().max(500).optional().nullable(),
    mood: zod_1.z.enum(['great', 'good', 'neutral', 'hard', 'terrible']).optional().nullable(),
    rating: zod_1.z.number().int().min(1).max(5).optional().nullable(),
});
exports.updateLogSchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    completed_at: zod_1.z.string().datetime().optional(),
    value: zod_1.z.number().positive().optional(),
    target_met: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().max(500).optional().nullable(),
    mood: zod_1.z.enum(['great', 'good', 'neutral', 'hard', 'terrible']).optional().nullable(),
    rating: zod_1.z.number().int().min(1).max(5).optional().nullable(),
});
exports.logQuerySchema = zod_1.z.object({
    from_date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'from_date must be in YYYY-MM-DD format').optional(),
    to_date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'to_date must be in YYYY-MM-DD format').optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(50),
    offset: zod_1.z.coerce.number().int().nonnegative().default(0),
});
exports.dailySummaryQuerySchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});
exports.importSchema = zod_1.z.object({
    habits: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().nullable().optional(),
        category: zod_1.z.string().default('general'),
        frequency_type: zod_1.z.enum(['daily', 'weekly', 'custom_days']).default('daily'),
        target_days: zod_1.z.array(zod_1.z.number().int().min(0).max(6)).default([]),
        target_count: zod_1.z.number().int().positive().default(1),
        unit: zod_1.z.string().default('times'),
        color: zod_1.z.string().default('#3B82F6'),
        tags: zod_1.z.array(zod_1.z.string()).default([]),
        archived: zod_1.z.boolean().default(false),
        created_at: zod_1.z.string().optional(),
        updated_at: zod_1.z.string().optional(),
    })),
    logs: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().optional(),
        habit_id: zod_1.z.string(),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        completed_at: zod_1.z.string().optional(),
        value: zod_1.z.number().positive().default(1),
        target_met: zod_1.z.boolean().default(true),
        notes: zod_1.z.string().nullable().optional(),
        mood: zod_1.z.enum(['great', 'good', 'neutral', 'hard', 'terrible']).nullable().optional(),
        rating: zod_1.z.number().int().min(1).max(5).nullable().optional(),
        created_at: zod_1.z.string().optional(),
        updated_at: zod_1.z.string().optional(),
    })).default([]),
});
