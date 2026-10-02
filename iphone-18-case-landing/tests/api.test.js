const request = require('supertest');
const app = require('../src/app');

describe('API Route Endpoints', () => {
  test('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('iphone-18-case-landing');
  });

  test('GET /api/config returns full product catalog and currencies', async () => {
    const res = await request(app).get('/api/config');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product.models.length).toBeGreaterThan(0);
    expect(res.body.data.product.finishes.length).toBeGreaterThan(0);
    expect(res.body.data.currencies.USD).toBeDefined();
  });

  test('POST /api/calculate computes pricing with coupon', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({
        items: [
          {
            modelId: 'iphone-18-pro',
            finishId: 'stealth-obsidian',
            accentId: 'cyber-blue',
            addons: ['sapphire-lens-guard'],
            quantity: 2
          }
        ],
        couponCode: 'LAUNCH18',
        currency: 'USD',
        shippingType: 'express'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.appliedCoupon.code).toBe('LAUNCH18');
    expect(res.body.data.items[0].quantity).toBe(2);
  });

  test('POST /api/preorder creates order and returns order confirmation', async () => {
    const res = await request(app)
      .post('/api/preorder')
      .send({
        name: 'John Connor',
        email: 'john@resistance.io',
        address: '100 SkyNet Blvd, LA',
        modelId: 'iphone-18-pro',
        finishId: 'stealth-obsidian',
        accentId: 'ruby-crimson',
        engraving: 'TERMINATOR-18',
        couponCode: 'LAUNCH18',
        currency: 'USD'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBeDefined();
    expect(res.body.data.warrantyToken).toBeDefined();

    // Verify order can be looked up
    const trackRes = await request(app).get(`/api/track/${res.body.data.orderId}`);
    expect(trackRes.status).toBe(200);
    expect(trackRes.body.data.customerName).toBe('John Connor');
  });

  test('GET /api/track/:orderId returns seeded order', async () => {
    const res = await request(app).get('/api/track/AERO-18-99421');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBe('AERO-18-99421');
  });

  test('GET /api/track/:orderId returns 404 for unknown order', async () => {
    const res = await request(app).get('/api/track/UNKNOWN-999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/simulate-drop calculates physics telemetry', async () => {
    const res = await request(app)
      .post('/api/simulate-drop')
      .send({
        heightFeet: 25,
        surface: 'concrete',
        caseType: 'aero-shield'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.velocityMph).toBeDefined();
    expect(res.body.data.peakGForce).toBeGreaterThan(0);
  });

  test('POST /api/coupon/validate validates valid and invalid coupon', async () => {
    const validRes = await request(app)
      .post('/api/coupon/validate')
      .send({ code: 'LAUNCH18' });
    expect(validRes.status).toBe(200);
    expect(validRes.body.valid).toBe(true);

    const invalidRes = await request(app)
      .post('/api/coupon/validate')
      .send({ code: 'FAKECODE99' });
    expect(invalidRes.status).toBe(404);
    expect(invalidRes.body.valid).toBe(false);
  });

  test('GET /api/reviews and POST /api/reviews', async () => {
    const listRes = await request(app).get('/api/reviews');
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.reviews.length).toBeGreaterThan(0);

    const createRes = await request(app)
      .post('/api/reviews')
      .send({
        author: 'Linus B.',
        rating: 5,
        model: 'iPhone 18 Pro',
        title: 'Insane build quality',
        content: 'Drop tested onto asphalt, zero damage. The tactile buttons are stellar.'
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.author).toBe('Linus B.');
  });

  test('POST /api/newsletter returns VIP coupon', async () => {
    const res = await request(app)
      .post('/api/newsletter')
      .send({ email: 'backer@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.promoCode).toBe('VIPEARLY');
  });
});
