import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { initSchema } from '../src/db/database.js';

describe('Habits API Extended', () => {
  let app: any;
  let db: any;

  beforeEach(() => {
    db = new Database(':memory:');
    initSchema(db);
    app = createApp({ db });
  });

  it('should reject invalid color hex', async () => {
    const res = await request(app).post('/api/habits').send({
      name: 'Invalid Color Habit',
      color: 'red', // Not hex
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should search habits by description', async () => {
    await request(app).post('/api/habits').send({
      name: 'Read',
      description: 'Finish reading atomic habits book',
      category: 'learning',
    });

    await request(app).post('/api/habits').send({
      name: 'Sleep',
      description: 'Rest for 8 hours',
      category: 'health',
    });

    const res = await request(app).get('/api/habits?search=atomic');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Read');
  });

  it('should sort habits by name ascending and descending', async () => {
    await request(app).post('/api/habits').send({ name: 'Zumba' });
    await request(app).post('/api/habits').send({ name: 'Archery' });

    const ascRes = await request(app).get('/api/habits?sort_by=name&order=asc');
    expect(ascRes.status).toBe(200);
    expect(ascRes.body.data[0].name).toBe('Archery');
    expect(ascRes.body.data[1].name).toBe('Zumba');

    const descRes = await request(app).get('/api/habits?sort_by=name&order=desc');
    expect(descRes.status).toBe(200);
    expect(descRes.body.data[0].name).toBe('Zumba');
    expect(descRes.body.data[1].name).toBe('Archery');
  });

  it('should return 404 when updating a non-existent habit', async () => {
    const res = await request(app).put('/api/habits/non-existent').send({ name: 'New Name' });
    expect(res.status).toBe(404);
  });

  it('should return 404 when deleting a non-existent habit', async () => {
    const res = await request(app).delete('/api/habits/non-existent');
    expect(res.status).toBe(404);
  });

  it('should return 404 when archiving a non-existent habit', async () => {
    const res = await request(app).post('/api/habits/non-existent/archive');
    expect(res.status).toBe(404);
  });
});
