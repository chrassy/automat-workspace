import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { initSchema } from '../src/db/database.js';

describe('Habit Logs Extended', () => {
  let app: any;
  let db: any;
  let habitId: string;

  beforeEach(async () => {
    db = new Database(':memory:');
    initSchema(db);
    app = createApp({ db });

    const res = await request(app).post('/api/habits').send({
      name: 'Journaling',
      target_count: 1,
    });
    habitId = res.body.data.id;
  });

  it('should reject invalid rating (> 5 or < 1)', async () => {
    const highRes = await request(app).post(`/api/habits/${habitId}/logs`).send({
      rating: 6,
    });
    expect(highRes.status).toBe(400);

    const lowRes = await request(app).post(`/api/habits/${habitId}/logs`).send({
      rating: 0,
    });
    expect(lowRes.status).toBe(400);
  });

  it('should reject invalid date format for logs', async () => {
    const res = await request(app).post(`/api/habits/${habitId}/logs`).send({
      date: '01-15-2025', // Invalid format
    });
    expect(res.status).toBe(400);
  });

  it('should return 404 when logging to non-existent habit', async () => {
    const res = await request(app).post('/api/habits/non-existent-habit/logs').send({
      value: 1,
    });
    expect(res.status).toBe(404);
  });

  it('should return 404 when querying logs for non-existent habit', async () => {
    const res = await request(app).get('/api/habits/non-existent-habit/logs');
    expect(res.status).toBe(404);
  });

  it('should paginate logs list with limit and offset', async () => {
    for (let i = 1; i <= 5; i++) {
      const day = String(i).padStart(2, '0');
      await request(app).post(`/api/habits/${habitId}/logs`).send({
        date: `2025-02-${day}`,
        value: 1,
      });
    }

    const page1 = await request(app).get(`/api/habits/${habitId}/logs?limit=2&offset=0`);
    expect(page1.status).toBe(200);
    expect(page1.body.data.length).toBe(2);
    expect(page1.body.meta.total).toBe(5);

    const page2 = await request(app).get(`/api/habits/${habitId}/logs?limit=2&offset=2`);
    expect(page2.status).toBe(200);
    expect(page2.body.data.length).toBe(2);
  });
});
