const request = require('supertest');
const app = require('../src/app');

describe('Borealis Cold IPA — Backend API Suite', () => {
  describe('GET /health', () => {
    it('should return service health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('borealis-craft-beer');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/specs', () => {
    it('should return detailed craft beer specifications', async () => {
      const res = await request(app).get('/api/specs');
      expect(res.status).toBe(200);
      expect(res.body.product).toBeDefined();
      expect(res.body.product.name).toBe('Borealis Cold IPA');
      expect(res.body.product.specs.abv).toBe('6.5%');
      expect(res.body.product.specs.ibu).toBe(48);
      expect(res.body.product.ingredients.hops).toBeInstanceOf(Array);
      expect(res.body.product.ingredients.malts).toBeInstanceOf(Array);
      expect(res.body.product.flavorProfile.crispness).toBeGreaterThan(9);
    });
  });

  describe('GET /api/faq', () => {
    it('should return list of product FAQs', async () => {
      const res = await request(app).get('/api/faq');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(3);
      expect(res.body[0]).toHaveProperty('q');
      expect(res.body[0]).toHaveProperty('a');
    });
  });

  describe('GET /api/batch-status', () => {
    it('should return real-time allocation status for Batch #001', async () => {
      const res = await request(app).get('/api/batch-status');
      expect(res.status).toBe(200);
      expect(res.body.totalAllocation).toBe(2500);
      expect(res.body.claimed).toBeGreaterThan(1800);
      expect(res.body.remaining).toBeLessThan(700);
      expect(res.body.percentageClaimed).toBeGreaterThan(70);
    });
  });

  describe('POST /api/waitlist', () => {
    it('should reject requests with invalid email address', async () => {
      const res = await request(app)
        .post('/api/waitlist')
        .send({ email: 'invalid-email', packPreference: '4-pack' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid email address');
    });

    it('should accept valid pre-order reservation and assign reservation ID', async () => {
      const testEmail = `hophead_${Date.now()}@testbrewing.com`;
      const res = await request(app)
        .post('/api/waitlist')
        .send({
          email: testEmail,
          packPreference: '4-pack',
          location: 'Direct Ship'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.reservation).toBeDefined();
      expect(res.body.reservation.reservationId).toMatch(/^BOR-\d{5}$/);
      expect(res.body.reservation.email).toBe(testEmail.toLowerCase());
      expect(res.body.reservation.isComingSoon).toBe(true);
      expect(res.body.reservation.paymentRequired).toBe(false);
    });

    it('should handle duplicate reservation idempotently without error', async () => {
      const dupEmail = `firstrun_${Date.now()}@coldipa.com`;
      const firstRes = await request(app)
        .post('/api/waitlist')
        .send({ email: dupEmail, packPreference: 'case-16' });

      expect(firstRes.status).toBe(201);
      const firstId = firstRes.body.reservation.reservationId;

      const secondRes = await request(app)
        .post('/api/waitlist')
        .send({ email: dupEmail, packPreference: 'case-16' });

      expect(secondRes.status).toBe(200);
      expect(secondRes.body.alreadyReserved).toBe(true);
      expect(secondRes.body.reservationId).toBe(firstId);
    });
  });

  describe('POST /api/quiz-results', () => {
    it('should calculate flavor match compatibility', async () => {
      const res = await request(app)
        .post('/api/quiz-results')
        .send({
          stylePreference: 'crisp_lager',
          hopPreference: 'citrus_tropical',
          occasion: 'bbq_patio'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.match.score).toBeDefined();
      expect(res.body.match.verdict).toBeDefined();
      expect(res.body.match.headline).toBeDefined();
    });

    it('should reject missing quiz parameters', async () => {
      const res = await request(app)
        .post('/api/quiz-results')
        .send({ stylePreference: 'crisp_lager' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing quiz answers');
    });
  });
});
