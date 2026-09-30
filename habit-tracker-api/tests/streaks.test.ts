import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { initSchema } from '../src/db/database.js';
import { addDays, getTodayDateString } from '../src/utils/date.js';

describe('Streak Calculation & Analytics', () => {
  let app: any;
  let db: any;

  beforeEach(() => {
    db = new Database(':memory:');
    initSchema(db);
    app = createApp({ db });
  });

  it('should compute current streak and longest streak accurately for daily habits', async () => {
    const habitRes = await request(app).post('/api/habits').send({
      name: 'Workout',
      frequency_type: 'daily',
    });
    const habitId = habitRes.body.data.id;

    const today = getTodayDateString();
    const dMinus1 = addDays(today, -1);
    const dMinus2 = addDays(today, -2);
    const dMinus5 = addDays(today, -5);
    const dMinus6 = addDays(today, -6);
    const dMinus7 = addDays(today, -7);
    const dMinus8 = addDays(today, -8);

    // Old streak: 4 consecutive days (-8, -7, -6, -5)
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus8, value: 1 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus7, value: 1 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus6, value: 1 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus5, value: 1 });

    // Current streak before today: (-2, -1) -> 2 days (since today is not logged yet, yesterday sustains streak)
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus2, value: 1 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus1, value: 1 });

    let statsRes = await request(app).get(`/api/habits/${habitId}/stats`);
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.data.current_streak).toBe(2);
    expect(statsRes.body.data.longest_streak).toBe(4);
    expect(statsRes.body.data.is_completed_today).toBe(false);

    // Now log today -> current streak becomes 3
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: today, value: 1 });

    statsRes = await request(app).get(`/api/habits/${habitId}/stats`);
    expect(statsRes.body.data.current_streak).toBe(3);
    expect(statsRes.body.data.longest_streak).toBe(4);
    expect(statsRes.body.data.is_completed_today).toBe(true);
    expect(statsRes.body.data.last_completed_date).toBe(today);
  });

  it('should reset current streak to 0 if yesterday was missed and today not done', async () => {
    const habitRes = await request(app).post('/api/habits').send({
      name: 'Read',
      frequency_type: 'daily',
    });
    const habitId = habitRes.body.data.id;

    const today = getTodayDateString();
    const dMinus3 = addDays(today, -3);
    const dMinus4 = addDays(today, -4);

    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus4, value: 1 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: dMinus3, value: 1 });

    const statsRes = await request(app).get(`/api/habits/${habitId}/stats`);
    expect(statsRes.body.data.current_streak).toBe(0);
    expect(statsRes.body.data.longest_streak).toBe(2);
  });

  it('should compute custom days streak correctly', async () => {
    // Custom days: Monday (1), Wednesday (3), Friday (5)
    const habitRes = await request(app).post('/api/habits').send({
      name: 'Gym',
      frequency_type: 'custom_days',
      target_days: [1, 3, 5],
    });
    const habitId = habitRes.body.data.id;

    // Fixed test dates: Monday 2025-01-06, Wednesday 2025-01-08, Friday 2025-01-10
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: '2025-01-06', value: 1 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: '2025-01-08', value: 1 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: '2025-01-10', value: 1 });

    const statsRes = await request(app).get(`/api/habits/${habitId}/stats`);
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.data.longest_streak).toBe(3);
    expect(statsRes.body.data.total_completions).toBe(3);
  });
});
