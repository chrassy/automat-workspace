import { Database } from 'better-sqlite3';
import { Habit } from '../types/index.js';
import { HabitQueryInput } from '../schemas/habit.schema.js';

export class HabitRepository {
  constructor(private db: Database) {}

  private mapRowToHabit(row: any): Habit {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      frequency_type: row.frequency_type,
      target_days: JSON.parse(row.target_days || '[]'),
      target_count: row.target_count,
      unit: row.unit,
      color: row.color,
      tags: JSON.parse(row.tags || '[]'),
      archived: Boolean(row.archived),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  create(habit: Habit): Habit {
    const stmt = this.db.prepare(`
      INSERT INTO habits (
        id, name, description, category, frequency_type, target_days,
        target_count, unit, color, tags, archived, created_at, updated_at
      ) VALUES (
        @id, @name, @description, @category, @frequency_type, @target_days,
        @target_count, @unit, @color, @tags, @archived, @created_at, @updated_at
      )
    `);

    stmt.run({
      id: habit.id,
      name: habit.name,
      description: habit.description ?? null,
      category: habit.category,
      frequency_type: habit.frequency_type,
      target_days: JSON.stringify(habit.target_days),
      target_count: habit.target_count,
      unit: habit.unit,
      color: habit.color,
      tags: JSON.stringify(habit.tags),
      archived: habit.archived ? 1 : 0,
      created_at: habit.created_at,
      updated_at: habit.updated_at,
    });

    return habit;
  }

  findById(id: string): Habit | null {
    const stmt = this.db.prepare('SELECT * FROM habits WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    return this.mapRowToHabit(row);
  }

  findAll(query: Partial<HabitQueryInput> = {}): { habits: Habit[]; total: number } {
    const conditions: string[] = [];
    const params: any[] = [];

    if (query.archived !== undefined) {
      conditions.push('archived = ?');
      params.push(query.archived ? 1 : 0);
    }

    if (query.category) {
      conditions.push('LOWER(category) = LOWER(?)');
      params.push(query.category);
    }

    if (query.frequency_type) {
      conditions.push('frequency_type = ?');
      params.push(query.frequency_type);
    }

    if (query.search) {
      conditions.push('(LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))');
      params.push(`%${query.search}%`, `%${query.search}%`);
    }

    let sql = 'SELECT * FROM habits';
    let countSql = 'SELECT COUNT(*) as count FROM habits';

    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      sql += whereClause;
      countSql += whereClause;
    }

    const sortColumn = query.sort_by && ['name', 'created_at', 'category', 'updated_at'].includes(query.sort_by)
      ? query.sort_by
      : 'created_at';
    const sortOrder = query.order === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const totalRow = this.db.prepare(countSql).get(...params) as { count: number };
    const rows = this.db.prepare(sql).all(...params);

    let habits = rows.map((r: any) => this.mapRowToHabit(r));

    if (query.tag) {
      const filterTag = query.tag.toLowerCase();
      habits = habits.filter(h => h.tags.some(t => t.toLowerCase() === filterTag));
    }

    return {
      habits,
      total: query.tag ? habits.length : totalRow.count,
    };
  }

  update(id: string, updates: Partial<Habit>): Habit | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated: Habit = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const stmt = this.db.prepare(`
      UPDATE habits SET
        name = @name,
        description = @description,
        category = @category,
        frequency_type = @frequency_type,
        target_days = @target_days,
        target_count = @target_count,
        unit = @unit,
        color = @color,
        tags = @tags,
        archived = @archived,
        updated_at = @updated_at
      WHERE id = @id
    `);

    stmt.run({
      id: updated.id,
      name: updated.name,
      description: updated.description ?? null,
      category: updated.category,
      frequency_type: updated.frequency_type,
      target_days: JSON.stringify(updated.target_days),
      target_count: updated.target_count,
      unit: updated.unit,
      color: updated.color,
      tags: JSON.stringify(updated.tags),
      archived: updated.archived ? 1 : 0,
      updated_at: updated.updated_at,
    });

    return updated;
  }

  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM habits WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  getAllCategories(): string[] {
    const stmt = this.db.prepare('SELECT DISTINCT category FROM habits WHERE archived = 0 ORDER BY category ASC');
    const rows = stmt.all() as { category: string }[];
    return rows.map(r => r.category);
  }

  getAllTags(): string[] {
    const stmt = this.db.prepare('SELECT tags FROM habits');
    const rows = stmt.all() as { tags: string }[];
    const tagSet = new Set<string>();
    for (const row of rows) {
      try {
        const tags = JSON.parse(row.tags || '[]');
        tags.forEach((t: string) => tagSet.add(t));
      } catch {
        // ignore invalid json
      }
    }
    return Array.from(tagSet).sort();
  }
}
