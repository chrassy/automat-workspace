import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { initSchema } from '../src/db/database.js';

describe('Habit Logs API', () => {
  let app: any;
  let db: any;
  let habitId: string;

  beforeEach(async () => {
    db = new Database(':memory:');
    initSchema(db);
    app = createApp({ db });

    const res = await request(app).post('/api/habits').send({
      name: 'Drink Water',
      category: 'Health',
      target_count: 8,
      unit: 'glasses',
    });
    habitId = res.body.data.id;
  });

  it('should log a habit completion today', async () => {
    const res = await request(app)
      .post(`/api/habits/${habitId}/logs`)
      .send({
        value: 8,
        notes: 'Felt very hydrated!',
        mood: 'great',
        rating: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.habit_id).toBe(habitId);
    expect(res.body.data.value).toBe(8);
    expect(res.body.data.target_met).toBe(true);
    expect(res.body.data.mood).toBe('great');
  });

  it('should support check-in alias route', async () => {
    const res = await request(app)
      .post(`/api/habits/${habitId}/check-in`)
      .send({
        value: 8,
        date: '2025-01-10',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.date).toBe('2025-01-10');
  });

  it('should update log when logging same date (upsert behavior)', async () => {
    await request(app)
      .post(`/api/habits/${habitId}/logs`)
      .send({
        date: '2025-01-15',
        value: 4,
        notes: 'Halfway done',
      });

    const secondRes = await request(app)
      .post(`/api/habits/${habitId}/logs`)
      .send({
        date: '2025-01-15',
        value: 8,
        notes: 'All 8 glasses finished!',
      });

    expect(secondRes.status).toBe(201);
    expect(secondRes.body.data.value).toBe(8);
    expect(secondRes.body.data.target_met).toBe(true);
    expect(secondRes.body.data.notes).toBe('All 8 glasses finished!');

    // Verify only 1 log exists for this date
    const listRes = await request(app).get(`/api/habits/${habitId}/logs`);
    expect(listRes.body.data.length).toBe(1);
  });

  it('should filter logs by date range', async () => {
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: '2025-01-01', value: 8 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: '2025-01-05', value: 8 });
    await request(app).post(`/api/habits/${habitId}/logs`).send({ date: '2025-01-10', value: 8 });

    const rangeRes = await request(app)
      .get(`/api/habits/${habitId}/logs?from_date=2025-01-02&to_date=2025-01-08`);

    expect(rangeRes.status).toBe(200);
    expect(rangeRes.body.data.length).toBe(1);
    expect(rangeRes.body.data[0].date).toBe('2025-01-05');
  });

  it('should update an existing log by logId', async () => {
    const createRes = await request(app)
      .post(`/api/habits/${habitId}/logs`)
      .send({
        date: '2025-01-20',
        value: 4,
        mood: 'neutral',
      });

    const logId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/habits/${habitId}/logs/${logId}`)
      .send({
        value: 8,
        mood: 'great',
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.value).toBe(8);
    expect(updateRes.body.data.target_met).toBe(true);
    expect(updateRes.body.data.mood).toBe('great');
  });

  it('should delete a log by logId', async () => {
    const createRes = await request(app)
      .post(`/api/habits/${habitId}/logs`)
      .send({ date: '2025-01-20', value: 8 });

    const logId = createRes.body.data.id;

    const delRes = await request(app).delete(`/api/habits/${habitId}/logs/${logId}`);
    expect(delRes.status).toBe(200);

    const getRes = await request(app).get(`/api/habits/${habitId}/logs/${logId}`);
    expect(getRes.status).toBe(404);
  });

  it('should delete a log by date', async () => {
    await request(app)
      .post(`/api/habits/${habitId}/logs`)
      .send({ date: '2025-01-22', value: 8 });

    const delRes = await request(app).delete(`/api/habits/${habitId}/logs/date/2025-01-22`);
    expect(delRes.status).toBe(200);

    const logsRes = await request(app).get(`/api/habits/${habitId}/logs`);
    expect(logsRes.body.data.length).toBe(0);
  });
});
