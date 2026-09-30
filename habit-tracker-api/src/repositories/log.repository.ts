import { Database } from 'better-sqlite3';
import { HabitLog } from '../types/index.js';
import { LogQueryInput } from '../schemas/habit.schema.js';

export class LogRepository {
  constructor(private db: Database) {}

  private mapRowToLog(row: any): HabitLog {
    return {
      id: row.id,
      habit_id: row.habit_id,
      date: row.date,
      completed_at: row.completed_at,
      value: row.value,
      target_met: Boolean(row.target_met),
      notes: row.notes,
      mood: row.mood,
      rating: row.rating,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  create(log: HabitLog): HabitLog {
    const stmt = this.db.prepare(`
      INSERT INTO habit_logs (
        id, habit_id, date, completed_at, value, target_met, notes, mood, rating, created_at, updated_at
      ) VALUES (
        @id, @habit_id, @date, @completed_at, @value, @target_met, @notes, @mood, @rating, @created_at, @updated_at
      )
    `);

    stmt.run({
      id: log.id,
      habit_id: log.habit_id,
      date: log.date,
      completed_at: log.completed_at,
      value: log.value,
      target_met: log.target_met ? 1 : 0,
      notes: log.notes ?? null,
      mood: log.mood ?? null,
      rating: log.rating ?? null,
      created_at: log.created_at,
      updated_at: log.updated_at,
    });

    return log;
  }

  upsert(log: HabitLog): HabitLog {
    const stmt = this.db.prepare(`
      INSERT INTO habit_logs (
        id, habit_id, date, completed_at, value, target_met, notes, mood, rating, created_at, updated_at
      ) VALUES (
        @id, @habit_id, @date, @completed_at, @value, @target_met, @notes, @mood, @rating, @created_at, @updated_at
      )
      ON CONFLICT(habit_id, date) DO UPDATE SET
        completed_at = excluded.completed_at,
        value = excluded.value,
        target_met = excluded.target_met,
        notes = excluded.notes,
        mood = excluded.mood,
        rating = excluded.rating,
        updated_at = excluded.updated_at
    `);

    stmt.run({
      id: log.id,
      habit_id: log.habit_id,
      date: log.date,
      completed_at: log.completed_at,
      value: log.value,
      target_met: log.target_met ? 1 : 0,
      notes: log.notes ?? null,
      mood: log.mood ?? null,
      rating: log.rating ?? null,
      created_at: log.created_at,
      updated_at: log.updated_at,
    });

    return this.findByHabitAndDate(log.habit_id, log.date)!;
  }

  findById(id: string): HabitLog | null {
    const stmt = this.db.prepare('SELECT * FROM habit_logs WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    return this.mapRowToLog(row);
  }

  findByHabitAndDate(habitId: string, date: string): HabitLog | null {
    const stmt = this.db.prepare('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?');
    const row = stmt.get(habitId, date);
    if (!row) return null;
    return this.mapRowToLog(row);
  }

  findByHabitId(habitId: string, query?: LogQueryInput): { logs: HabitLog[]; total: number } {
    const conditions = ['habit_id = ?'];
    const params: any[] = [habitId];

    if (query?.from_date) {
      conditions.push('date >= ?');
      params.push(query.from_date);
    }
    if (query?.to_date) {
      conditions.push('date <= ?');
      params.push(query.to_date);
    }

    const where = conditions.join(' AND ');
    const countSql = `SELECT COUNT(*) as count FROM habit_logs WHERE ${where}`;
    const totalRow = this.db.prepare(countSql).get(...params) as { count: number };

    let sql = `SELECT * FROM habit_logs WHERE ${where} ORDER BY date DESC`;
    if (query?.limit) {
      sql += ' LIMIT ? OFFSET ?';
      params.push(query.limit, query.offset || 0);
    }

    const rows = this.db.prepare(sql).all(...params);
    return {
      logs: rows.map((r: any) => this.mapRowToLog(r)),
      total: totalRow.count,
    };
  }

  findLogsByDate(date: string): HabitLog[] {
    const stmt = this.db.prepare('SELECT * FROM habit_logs WHERE date = ?');
    const rows = stmt.all(date);
    return rows.map((r: any) => this.mapRowToLog(r));
  }

  getAllLogsForHabit(habitId: string): HabitLog[] {
    const stmt = this.db.prepare('SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY date ASC');
    const rows = stmt.all(habitId);
    return rows.map((r: any) => this.mapRowToLog(r));
  }

  getAllLogs(): HabitLog[] {
    const stmt = this.db.prepare('SELECT * FROM habit_logs ORDER BY date ASC');
    const rows = stmt.all();
    return rows.map((r: any) => this.mapRowToLog(r));
  }

  update(id: string, updates: Partial<HabitLog>): HabitLog | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated: HabitLog = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const stmt = this.db.prepare(`
      UPDATE habit_logs SET
        value = @value,
        target_met = @target_met,
        notes = @notes,
        mood = @mood,
        rating = @rating,
        updated_at = @updated_at
      WHERE id = @id
    `);

    stmt.run({
      id: updated.id,
      value: updated.value,
      target_met: updated.target_met ? 1 : 0,
      notes: updated.notes ?? null,
      mood: updated.mood ?? null,
      rating: updated.rating ?? null,
      updated_at: updated.updated_at,
    });

    return updated;
  }

  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM habit_logs WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  deleteByHabitAndDate(habitId: string, date: string): boolean {
    const stmt = this.db.prepare('DELETE FROM habit_logs WHERE habit_id = ? AND date = ?');
    const result = stmt.run(habitId, date);
    return result.changes > 0;
  }

  getTotalLogCount(): number {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM habit_logs');
    const row = stmt.get() as { count: number };
    return row.count;
  }
}
