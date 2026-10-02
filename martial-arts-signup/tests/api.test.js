const request = require('supertest');
const { app } = require('../src/server');
const { db } = require('../src/db');

describe('Martial Arts API Endpoints', () => {
  beforeEach(() => {
    db.clearAll();
  });

  describe('GET /api/config', () => {
    test('returns academy details, disciplines, and programs', async () => {
      const res = await request(app).get('/api/config');
      expect(res.status).toBe(200);
      expect(res.body.school).toBeDefined();
      expect(res.body.disciplines.length).toBeGreaterThan(0);
      expect(res.body.programs.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/signups and GET /api/signups', () => {
    test('creates a signup successfully', async () => {
      const payload = {
        fullName: 'Demian Maia',
        email: 'demian@example.com',
        phone: '555-999-0000',
        discipline: 'bjj',
        program: 'monthly-unlimited',
        waiverAccepted: true
      };

      const res = await request(app)
        .post('/api/signups')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.signup.fullName).toBe('Demian Maia');
      expect(res.body.data.passQR).toMatch(/^data:image\/png;base64,/);
    });

    test('validates required fields', async () => {
      const res = await request(app)
        .post('/api/signups')
        .send({ fullName: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    test('retrieves signup list with filtering', async () => {
      // Create two signups
      await request(app).post('/api/signups').send({
        fullName: 'Student One',
        email: 's1@example.com',
        phone: '555-111-2222',
        discipline: 'bjj',
        program: 'free-trial',
        waiverAccepted: true
      });

      await request(app).post('/api/signups').send({
        fullName: 'Student Two',
        email: 's2@example.com',
        phone: '555-333-4444',
        discipline: 'karate',
        program: 'starter-pass',
        waiverAccepted: true
      });

      const resAll = await request(app).get('/api/signups');
      expect(resAll.status).toBe(200);
      expect(resAll.body.count).toBe(2);

      const resFilter = await request(app).get('/api/signups?discipline=karate');
      expect(resFilter.body.count).toBe(1);
      expect(resFilter.body.data[0].fullName).toBe('Student Two');
    });
  });

  describe('GET /api/signups/:id & PATCH /api/signups/:id/status', () => {
    test('gets single signup with pass QR', async () => {
      const createRes = await request(app).post('/api/signups').send({
        fullName: 'Jose Aldo',
        email: 'aldo@example.com',
        phone: '555-888-7777',
        discipline: 'muay-thai',
        program: 'free-trial',
        waiverAccepted: true
      });

      const signupId = createRes.body.data.signup.id;
      const res = await request(app).get(`/api/signups/${signupId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(signupId);
      expect(res.body.data.passQR).toBeDefined();
    });

    test('updates student status', async () => {
      const createRes = await request(app).post('/api/signups').send({
        fullName: 'Israel Adesanya',
        email: 'stylebender@example.com',
        phone: '555-222-3333',
        discipline: 'muay-thai',
        program: 'starter-pass',
        waiverAccepted: true
      });

      const signupId = createRes.body.data.signup.id;
      const res = await request(app)
        .patch(`/api/signups/${signupId}/status`)
        .send({ status: 'checked_in' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('checked_in');
    });
  });

  describe('POST /api/check-in', () => {
    test('verifies and checks in student', async () => {
      const createRes = await request(app).post('/api/signups').send({
        fullName: 'Alexander Volkanovski',
        email: 'alex@example.com',
        phone: '555-444-1111',
        discipline: 'mma',
        program: 'free-trial',
        waiverAccepted: true
      });

      const passCode = createRes.body.data.signup.passCode;
      const checkInRes = await request(app)
        .post('/api/check-in')
        .send({ code: passCode });

      expect(checkInRes.status).toBe(200);
      expect(checkInRes.body.success).toBe(true);
      expect(checkInRes.body.student.status).toBe('checked_in');
    });
  });

  describe('GET /api/qr/poster', () => {
    test('generates dynamic poster data with QR code', async () => {
      const res = await request(app)
        .get('/api/qr/poster?discipline=bjj&promoCode=WELCOME50');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.qrDataUrl).toMatch(/^data:image\/png;base64,/);
      expect(res.body.data.targetUrl).toContain('discipline=bjj');
      expect(res.body.data.targetUrl).toContain('promo=WELCOME50');
    });
  });

  describe('GET /api/emails & GET /api/emails/:id', () => {
    test('retrieves sent email logs and individual preview', async () => {
      await request(app).post('/api/signups').send({
        fullName: 'Valentina Shevchenko',
        email: 'bullet@example.com',
        phone: '555-999-4444',
        discipline: 'muay-thai',
        program: 'starter-pass',
        waiverAccepted: true
      });

      const listRes = await request(app).get('/api/emails');
      expect(listRes.status).toBe(200);
      expect(listRes.body.count).toBeGreaterThan(0);

      const emailId = listRes.body.data[0].id;
      const getRes = await request(app).get(`/api/emails/${emailId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.html).toContain('Valentina Shevchenko');
    });
  });

  describe('GET /api/stats and GET /api/export', () => {
    test('retrieves academy stats and exports CSV', async () => {
      await request(app).post('/api/signups').send({
        fullName: 'Stipe Miocic',
        email: 'stipe@example.com',
        phone: '555-555-5555',
        discipline: 'mma',
        program: 'monthly-unlimited',
        waiverAccepted: true
      });

      const statsRes = await request(app).get('/api/stats');
      expect(statsRes.status).toBe(200);
      expect(statsRes.body.data.totalSignups).toBe(1);

      const exportRes = await request(app).get('/api/export');
      expect(exportRes.status).toBe(200);
      expect(exportRes.headers['content-type']).toContain('text/csv');
      expect(exportRes.text).toContain('Stipe Miocic');
    });
  });
});
