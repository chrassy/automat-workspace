import Database from 'better-sqlite3';
import path from 'path';

let dbInstance: Database.Database | null = null;

export function getDatabase(dbPath?: string): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const databasePath = dbPath || process.env.DATABASE_PATH || ':memory:';
  
  dbInstance = new Database(databasePath);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  initSchema(dbInstance);

  return dbInstance;
}

export function resetDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'general',
      frequency_type TEXT NOT NULL DEFAULT 'daily',
      target_days TEXT NOT NULL DEFAULT '[]',
      target_count INTEGER NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT 'times',
      color TEXT NOT NULL DEFAULT '#3B82F6',
      tags TEXT NOT NULL DEFAULT '[]',
      archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);
    CREATE INDEX IF NOT EXISTS idx_habits_archived ON habits(archived);

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      value REAL NOT NULL DEFAULT 1,
      target_met INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      mood TEXT,
      rating INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_logs_habit_id ON habit_logs(habit_id);
    CREATE INDEX IF NOT EXISTS idx_logs_date ON habit_logs(date);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_logs_habit_date ON habit_logs(habit_id, date);
  `);
}
