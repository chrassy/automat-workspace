'use strict';

const request = require('supertest');
const app = require('../src/app');
const leadService = require('../src/services/leadService');
const simulationService = require('../src/services/simulationService');

describe('PulseGym API Endpoints', () => {
  beforeEach(() => {
    leadService.clearLeads();
    simulationService.resetState();
  });

  describe('GET /api/health', () => {
    test('returns status 200 ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('pulse-gym-software');
    });
  });

  describe('POST /api/roi-calculator', () => {
    test('calculates ROI from payload', async () => {
      const res = await request(app)
        .post('/api/roi-calculator')
        .send({
          memberCount: 300,
          avgMonthlyFee: 130,
          monthlyChurnPct: 5,
          failedPaymentPct: 4
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics.mrr).toBe(39000);
      expect(res.body.data.metrics.recommendedPlan.name).toBe('Growth');
      expect(res.body.data.metrics.totalAnnualFinancialGain).toBeGreaterThan(0);
    });
  });

  describe('GET /api/migration-estimate', () => {
    test('returns migration timeline and cost comparison', async () => {
      const res = await request(app)
        .get('/api/migration-estimate?competitor=mindbody&memberCount=250');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.competitor).toBe('Mindbody');
      expect(res.body.data.migrationTimelineHours).toBe(48);
    });
  });

  describe('POST and GET /api/leads', () => {
    test('submits valid demo lead and returns 201', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          gymName: 'Iron Vault Athletics',
          ownerName: 'Marcus Steel',
          email: 'marcus@ironvault.com',
          phone: '555-987-6543',
          facilityType: '247_access',
          memberCount: 420,
          currentSoftware: 'glofox'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toMatch(/^LEAD-/);
      expect(res.body.data.gymName).toBe('Iron Vault Athletics');
    });

    test('rejects invalid lead submission with 400 and validation errors', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          gymName: 'A', // too short
          ownerName: '',
          email: 'invalid-email',
          memberCount: -5
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details.length).toBeGreaterThanOrEqual(3);
    });

    test('retrieves leads list', async () => {
      await request(app)
        .post('/api/leads')
        .send({
          gymName: 'Studio Flow',
          ownerName: 'Chloe Bennett',
          email: 'chloe@studioflow.com',
          memberCount: 120
        });

      const res = await request(app).get('/api/leads');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].gymName).toBe('Studio Flow');
    });
  });

  describe('Simulation Endpoints', () => {
    test('GET /api/simulation/members returns member list', async () => {
      const res = await request(app).get('/api/simulation/members');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });

    test('POST /api/simulation/checkin simulates door scan', async () => {
      const res = await request(app)
        .post('/api/simulation/checkin')
        .send({ barcodeOrId: 'BAR-1001' });

      expect(res.statusCode).toBe(200);
      expect(res.body.accessGranted).toBe(true);
      expect(res.body.status).toBe('GRANTED');
    });

    test('POST /api/simulation/checkin validates empty barcode', async () => {
      const res = await request(app)
        .post('/api/simulation/checkin')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('GET and POST /api/simulation/classes tests booking', async () => {
      const resClasses = await request(app).get('/api/simulation/classes');
      expect(resClasses.statusCode).toBe(200);
      expect(resClasses.body.data.length).toBeGreaterThan(0);

      const resBook = await request(app)
        .post('/api/simulation/book-class')
        .send({ classId: 'CLS-01', memberName: 'Test Athlete' });

      expect(resBook.statusCode).toBe(200);
      expect(resBook.body.success).toBe(true);
    });

    test('GET /api/simulation/telemetry returns telemetry', async () => {
      const res = await request(app).get('/api/simulation/telemetry');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.retentionRatePct).toBeDefined();
    });
  });

  describe('Frontend route', () => {
    test('serves index.html on root GET /', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
    });
  });
});
