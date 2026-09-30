import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { initSchema } from '../src/db/database.js';
import { addDays, getTodayDateString } from '../src/utils/date.js';

describe('Analytics API', () => {
  let app: any;
  let db: any;

  beforeEach(() => {
    db = new Database(':memory:');
    initSchema(db);
    app = createApp({ db });
  });

  it('should return analytics overview across habits', async () => {
    const habit1 = await request(app).post('/api/habits').send({
      name: 'Habit 1',
      category: 'Health',
    });
    const habit2 = await request(app).post('/api/habits').send({
      name: 'Habit 2',
      category: 'Work',
    });

    const today = getTodayDateString();
    const yesterday = addDays(today, -1);

    // Habit 1 logged yesterday & today
    await request(app).post(`/api/habits/${habit1.body.data.id}/logs`).send({ date: yesterday, value: 1 });
    await request(app).post(`/api/habits/${habit1.body.data.id}/logs`).send({ date: today, value: 1 });

    // Habit 2 logged yesterday only (at risk!)
    await request(app).post(`/api/habits/${habit2.body.data.id}/logs`).send({ date: addDays(today, -2), value: 1 });
    await request(app).post(`/api/habits/${habit2.body.data.id}/logs`).send({ date: yesterday, value: 1 });

    const res = await request(app).get('/api/analytics/overview');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const data = res.body.data;
    expect(data.total_habits).toBe(2);
    expect(data.active_habits).toBe(2);
    expect(data.archived_habits).toBe(0);
    expect(data.total_logs).toBe(4);
    expect(data.today_completion_rate).toBe(50); // 1 of 2 completed today
    expect(data.longest_active_streak?.streak).toBe(2);
    expect(data.habits_at_risk.length).toBe(1);
    expect(data.habits_at_risk[0].id).toBe(habit2.body.data.id);
    expect(data.category_distribution).toEqual({ health: 1, work: 1 });
  });

  it('should return daily summary digest for given date', async () => {
    const habit1 = await request(app).post('/api/habits').send({
      name: 'Hydrate',
      target_count: 8,
    });
    const habit2 = await request(app).post('/api/habits').send({
      name: 'Meditate',
      target_count: 1,
    });

    const testDate = '2025-01-15';
    await request(app).post(`/api/habits/${habit1.body.data.id}/logs`).send({
      date: testDate,
      value: 8,
      notes: 'Drank 8 glasses',
    });

    const res = await request(app).get(`/api/analytics/daily-summary?date=${testDate}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.date).toBe(testDate);
    expect(res.body.data.total_scheduled).toBe(2);
    expect(res.body.data.total_completed).toBe(1);
    expect(res.body.data.completion_rate).toBe(50);
  });
});
