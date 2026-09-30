import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { initSchema } from '../src/db/database.js';

describe('Backup & Export/Import API', () => {
  let app: any;
  let db: any;

  beforeEach(() => {
    db = new Database(':memory:');
    initSchema(db);
    app = createApp({ db });
  });

  it('should export all habits and logs', async () => {
    const habitRes = await request(app).post('/api/habits').send({
      name: 'Sleep 8 Hours',
      category: 'Health',
    });
    const habitId = habitRes.body.data.id;

    await request(app).post(`/api/habits/${habitId}/logs`).send({
      date: '2025-01-20',
      value: 8,
      notes: 'Good rest',
    });

    const exportRes = await request(app).get('/api/export');
    expect(exportRes.status).toBe(200);
    expect(exportRes.body.success).toBe(true);
    expect(exportRes.body.data.habits.length).toBe(1);
    expect(exportRes.body.data.habits[0].name).toBe('Sleep 8 Hours');
    expect(exportRes.body.data.logs.length).toBe(1);
    expect(exportRes.body.data.logs[0].notes).toBe('Good rest');
  });

  it('should import habits and logs successfully', async () => {
    const importPayload = {
      habits: [
        {
          name: 'Morning Stretch',
          category: 'wellness',
          frequency_type: 'daily',
          target_count: 1,
          unit: 'times',
          color: '#10B981',
          tags: ['morning', 'stretch'],
          archived: false,
        },
      ],
      logs: [],
    };

    const importRes = await request(app).post('/api/import').send(importPayload);
    expect(importRes.status).toBe(200);
    expect(importRes.body.success).toBe(true);
    expect(importRes.body.data.habits_imported).toBe(1);

    const listRes = await request(app).get('/api/habits');
    expect(listRes.body.data.length).toBe(1);
    expect(listRes.body.data[0].name).toBe('Morning Stretch');
  });

  it('should handle malformed json gracefully', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Content-Type', 'application/json')
      .send('{ bad json ');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
