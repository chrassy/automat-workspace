import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { initSchema } from '../src/db/database.js';

describe('Habits API', () => {
  let app: any;
  let db: any;

  beforeEach(() => {
    db = new Database(':memory:');
    initSchema(db);
    app = createApp({ db });
  });

  it('should return health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should create a habit with default values', async () => {
    const res = await request(app)
      .post('/api/habits')
      .send({
        name: 'Read Books',
        category: 'Learning',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      name: 'Read Books',
      category: 'learning',
      frequency_type: 'daily',
      target_count: 1,
      unit: 'times',
      archived: false,
    });
    expect(res.body.data.id).toBeDefined();
  });

  it('should validate habit creation body', async () => {
    const res = await request(app)
      .post('/api/habits')
      .send({
        category: 'learning',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Validation error');
  });

  it('should retrieve a habit by ID with stats', async () => {
    const createRes = await request(app)
      .post('/api/habits')
      .send({
        name: 'Morning Meditation',
        category: 'Mindfulness',
        tags: ['mind', 'morning'],
      });

    const habitId = createRes.body.data.id;

    const res = await request(app).get(`/api/habits/${habitId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(habitId);
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.stats.current_streak).toBe(0);
    expect(res.body.data.stats.total_completions).toBe(0);
  });

  it('should return 404 for non-existent habit', async () => {
    const res = await request(app).get('/api/habits/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should update habit details', async () => {
    const createRes = await request(app)
      .post('/api/habits')
      .send({
        name: 'Drink Water',
        target_count: 8,
        unit: 'glasses',
      });

    const habitId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/habits/${habitId}`)
      .send({
        name: 'Drink More Water',
        target_count: 10,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.name).toBe('Drink More Water');
    expect(updateRes.body.data.target_count).toBe(10);
    expect(updateRes.body.data.unit).toBe('glasses');
  });

  it('should archive and unarchive a habit', async () => {
    const createRes = await request(app)
      .post('/api/habits')
      .send({ name: 'Old Habit' });

    const habitId = createRes.body.data.id;

    const archiveRes = await request(app).post(`/api/habits/${habitId}/archive`);
    expect(archiveRes.status).toBe(200);
    expect(archiveRes.body.data.archived).toBe(true);

    const unarchiveRes = await request(app).post(`/api/habits/${habitId}/unarchive`);
    expect(unarchiveRes.status).toBe(200);
    expect(unarchiveRes.body.data.archived).toBe(false);
  });

  it('should delete a habit and cascade remove logs', async () => {
    const createRes = await request(app)
      .post('/api/habits')
      .send({ name: 'Temporary Habit' });

    const habitId = createRes.body.data.id;

    await request(app).post(`/api/habits/${habitId}/logs`).send({ value: 1 });

    const deleteRes = await request(app).delete(`/api/habits/${habitId}`);
    expect(deleteRes.status).toBe(200);

    const fetchRes = await request(app).get(`/api/habits/${habitId}`);
    expect(fetchRes.status).toBe(404);
  });

  it('should filter habits by category and tag', async () => {
    await request(app).post('/api/habits').send({
      name: 'Run 5k',
      category: 'Fitness',
      tags: ['cardio', 'outdoors'],
    });

    await request(app).post('/api/habits').send({
      name: 'Yoga',
      category: 'Fitness',
      tags: ['flexibility', 'mind'],
    });

    await request(app).post('/api/habits').send({
      name: 'Coding',
      category: 'Work',
      tags: ['dev'],
    });

    const fitRes = await request(app).get('/api/habits?category=fitness');
    expect(fitRes.status).toBe(200);
    expect(fitRes.body.data.length).toBe(2);

    const tagRes = await request(app).get('/api/habits?tag=cardio');
    expect(tagRes.status).toBe(200);
    expect(tagRes.body.data.length).toBe(1);
    expect(tagRes.body.data[0].name).toBe('Run 5k');
  });

  it('should retrieve distinct categories and tags', async () => {
    await request(app).post('/api/habits').send({
      name: 'Run',
      category: 'Fitness',
      tags: ['cardio'],
    });

    await request(app).post('/api/habits').send({
      name: 'Read',
      category: 'Learning',
      tags: ['book', 'cardio'],
    });

    const catRes = await request(app).get('/api/categories');
    expect(catRes.status).toBe(200);
    expect(catRes.body.data).toContain('fitness');
    expect(catRes.body.data).toContain('learning');

    const tagsRes = await request(app).get('/api/tags');
    expect(tagsRes.status).toBe(200);
    expect(tagsRes.body.data).toEqual(['book', 'cardio']);
  });
});
