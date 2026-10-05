const request = require('supertest');
const app = require('../src/app');
const waitlistService = require('../src/services/waitlistService');

describe('REST API Endpoints Integration Tests', () => {
  beforeEach(() => {
    waitlistService.resetWaitlist();
    waitlistService.seedBaselineLeads();
  });

  test('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('chess-course-validation');
  });

  test('GET /api/validation-data returns complete payload for all 4 agents', async () => {
    const res = await request(app).get('/api/validation-data');
    expect(res.status).toBe(200);
    expect(res.body.agent1_CompetitorAnalysis).toBeDefined();
    expect(res.body.agent2_IcpPositioning).toBeDefined();
    expect(res.body.agent3_LandingPageCopy).toBeDefined();
    expect(res.body.agent4_DistributionPlaybook).toBeDefined();
    expect(res.body.liveWaitlistMetrics).toBeDefined();
  });

  test('GET /api/puzzles returns list of interactive puzzles', async () => {
    const res = await request(app).get('/api/puzzles');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(3);
    expect(Array.isArray(res.body.puzzles)).toBe(true);
  });

  test('POST /api/puzzle/verify validates move accurately', async () => {
    const res = await request(app)
      .post('/api/puzzle/verify')
      .send({
        puzzleId: 'puzzle-1',
        from: 'c1',
        to: 'g5'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Tactical radar confirmed');
  });

  test('POST /api/puzzle/verify returns 400 when missing parameters', async () => {
    const res = await request(app)
      .post('/api/puzzle/verify')
      .send({ puzzleId: 'puzzle-1' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Missing required/);
  });

  test('POST /api/waitlist accepts valid submission and updates stats', async () => {
    const initialStats = waitlistService.getWaitlistStats();

    const res = await request(app)
      .post('/api/waitlist')
      .send({
        email: 'newuser@testing.com',
        rating: '400 - 600',
        frustration: 'Blundering against Scholar Mate',
        pricingTolerance: '$19 One-Time (Lifetime Early Bird)',
        source: 'reddit_chessbeginners'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.entry.email).toBe('newuser@testing.com');
    expect(res.body.stats.totalWaitlist).toBe(initialStats.totalWaitlist + 1);
  });

  test('POST /api/waitlist rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/waitlist')
      .send({
        email: 'invalid-email',
        rating: '400 - 600'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/valid email/i);
  });

  test('GET /api/waitlist/stats returns aggregate metrics', async () => {
    const res = await request(app).get('/api/waitlist/stats');
    expect(res.status).toBe(200);
    expect(res.body.totalWaitlist).toBeGreaterThanOrEqual(1);
    expect(res.body.paidWillingnessPercentage).toBeDefined();
  });

  test('POST /api/icp-quiz computes match percentage and recommendation', async () => {
    const res = await request(app)
      .post('/api/icp-quiz')
      .send({
        ratingRange: '400 - 600',
        blunderFrequency: 'frequent',
        studyMethod: 'passive_video',
        dailyTimeMinutes: 15
      });

    expect(res.status).toBe(200);
    expect(res.body.matchPercentage).toBeGreaterThanOrEqual(75);
    expect(res.body.archetype).toBeDefined();
    expect(res.body.recommendation).toBeDefined();
  });
});
