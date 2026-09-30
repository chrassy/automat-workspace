import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500).optional().nullable(),
  category: z.string().min(1).max(50).default('general'),
  frequency_type: z.enum(['daily', 'weekly', 'custom_days']).default('daily'),
  target_days: z.array(z.number().int().min(0).max(6)).default([]),
  target_count: z.number().int().positive().default(1),
  unit: z.string().min(1).max(30).default('times'),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').default('#3B82F6'),
  tags: z.array(z.string().min(1).max(30)).default([]),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  category: z.string().min(1).max(50).optional(),
  frequency_type: z.enum(['daily', 'weekly', 'custom_days']).optional(),
  target_days: z.array(z.number().int().min(0).max(6)).optional(),
  target_count: z.number().int().positive().optional(),
  unit: z.string().min(1).max(30).optional(),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
  archived: z.boolean().optional(),
});

export const habitQuerySchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  archived: z.enum(['true', 'false']).optional().transform(v => v === undefined ? undefined : v === 'true'),
  frequency_type: z.enum(['daily', 'weekly', 'custom_days']).optional(),
  search: z.string().optional(),
  sort_by: z.enum(['name', 'created_at', 'category', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const createLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  completed_at: z.string().datetime().optional(),
  value: z.number().positive().default(1),
  target_met: z.boolean().optional(),
  notes: z.string().max(500).optional().nullable(),
  mood: z.enum(['great', 'good', 'neutral', 'hard', 'terrible']).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
});

export const updateLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  completed_at: z.string().datetime().optional(),
  value: z.number().positive().optional(),
  target_met: z.boolean().optional(),
  notes: z.string().max(500).optional().nullable(),
  mood: z.enum(['great', 'good', 'neutral', 'hard', 'terrible']).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
});

export const logQuerySchema = z.object({
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'from_date must be in YYYY-MM-DD format').optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'to_date must be in YYYY-MM-DD format').optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const dailySummaryQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export const importSchema = z.object({
  habits: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    category: z.string().default('general'),
    frequency_type: z.enum(['daily', 'weekly', 'custom_days']).default('daily'),
    target_days: z.array(z.number().int().min(0).max(6)).default([]),
    target_count: z.number().int().positive().default(1),
    unit: z.string().default('times'),
    color: z.string().default('#3B82F6'),
    tags: z.array(z.string()).default([]),
    archived: z.boolean().default(false),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })),
  logs: z.array(z.object({
    id: z.string().optional(),
    habit_id: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    completed_at: z.string().optional(),
    value: z.number().positive().default(1),
    target_met: z.boolean().default(true),
    notes: z.string().nullable().optional(),
    mood: z.enum(['great', 'good', 'neutral', 'hard', 'terrible']).nullable().optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })).default([]),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type HabitQueryInput = z.infer<typeof habitQuerySchema>;
export type CreateLogInput = z.infer<typeof createLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
export type LogQueryInput = z.infer<typeof logQuerySchema>;
export type ImportInput = z.infer<typeof importSchema>;
