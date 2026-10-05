const competitors = require('../src/content/competitors.json');
const hero = require('../src/content/hero.json');
const pricing = require('../src/content/pricing.json');
const features = require('../src/content/features.json');
const competitorAnalysis = require('../src/content/competitor-analysis.json');
const icpPositioning = require('../src/content/icp-positioning.json');
const landingCopy = require('../src/content/landing-copy.json');
const { scoreIcpProfile } = require('../src/services/icpScorer');
const request = require('supertest');
const app = require('../src/app');

describe('Issue #16 Research Findings Integration Tests', () => {
  describe('Competitors Research Verification', () => {
    test('competitors.json contains verified competitor benchmarks', () => {
      expect(competitors.competitors).toBeDefined();
      expect(competitors.competitors.length).toBeGreaterThanOrEqual(4);

      // Chessable: Video courses $100-$300+, MoveTrainer free/pro $60/yr ($9.99/mo)
      const chessable = competitors.competitors.find(c => c.id === 'chessable');
      expect(chessable).toBeDefined();
      expect(chessable.pricing.videoCourses).toContain('$100');
      expect(chessable.pricing.moveTrainerProAnnual).toContain('$60');
      expect(chessable.pricing.moveTrainerProMonthly).toContain('$9.99');

      // Chessly (GothamChess): $89.99/yr subscription or $19.99/mo
      const chessly = competitors.competitors.find(c => c.id === 'chessly');
      expect(chessly).toBeDefined();
      expect(chessly.pricing.annualSubscription).toContain('89.99');
      expect(chessly.pricing.monthlySubscription).toContain('19.99');

      // Chess.com: Diamond $120/yr
      const chessCom = competitors.competitors.find(c => c.id === 'chess-com-diamond');
      expect(chessCom).toBeDefined();
      expect(chessCom.pricing.diamondAnnual).toContain('120');

      // Aimchess: $8-$15/mo
      const aimchess = competitors.competitors.find(c => c.id === 'aimchess');
      expect(aimchess).toBeDefined();
      expect(aimchess.pricing.monthly).toMatch(/8.*15/);
    });

    test('competitor-analysis.json incorporates verified competitors and pricing landscape', () => {
      const chessable = competitorAnalysis.competitors.find(c => c.id === 'chessable');
      expect(chessable.weaknesses.some(w => w.toLowerCase().includes('40-hour') || w.toLowerCase().includes('theory'))).toBe(true);

      const chessly = competitorAnalysis.competitors.find(c => c.id === 'chessly');
      expect(chessly.pricingTiers.some(t => t.verifiedPrice === '$89.99/yr')).toBe(true);
      expect(chessly.pricingTiers.some(t => t.verifiedPrice === '$19.99/mo')).toBe(true);
    });
  });

  describe('Target ICP & CCT Methodology Verification', () => {
    test('target ICP profile addresses Adult Improvers (800-1600 Elo)', () => {
      const { demographics, psychographics } = icpPositioning.icpProfile;
      expect(demographics.ratingRange).toContain('800');
      expect(demographics.ratingRange).toContain('1600');
      expect(demographics.timeCommitment).toContain('15');

      // Checks-Captures-Threats (CCT) routine in psychographics and curriculum
      const cctMentioned = psychographics.aspirations.some(a => a.includes('CCT') || a.includes('Checks-Captures-Threats'));
      expect(cctMentioned).toBe(true);
    });

    test('features.json defines CCT and plateau breaking without 40-hr opening courses', () => {
      expect(features.features.length).toBeGreaterThanOrEqual(5);

      const cctFeature = features.features.find(f => f.id === 'cct-routine');
      expect(cctFeature).toBeDefined();
      expect(cctFeature.title).toContain('Checks-Captures-Threats');

      const plateauFeature = features.features.find(f => f.id === 'plateau-breaking');
      expect(plateauFeature).toBeDefined();
      expect(plateauFeature.description).toMatch(/40-hour|opening/i);
    });

    test('icpScorer correctly scores adult improvers in 800-1600 Elo bracket', () => {
      const improverInput = {
        ratingRange: '1001 - 1200',
        blunderFrequency: 'frequent',
        studyMethod: 'passive_video',
        dailyTimeMinutes: 15
      };

      const result = scoreIcpProfile(improverInput);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(80);
      expect(result.archetype).toContain('Adult Improver');
      expect(result.recommendation).toContain('Strongest fit');
    });
  });

  describe('Pricing Validation Tier Verification', () => {
    test('pricing.json offers accessible validation tiers: $49-$69 one-time and $7.99/mo', () => {
      expect(pricing.tiers.oneTime).toBeDefined();
      const earlyBird = pricing.tiers.oneTime.find(t => t.id === 'early-bird-lifetime');
      expect(earlyBird).toBeDefined();
      expect(earlyBird.priceUSD).toBe(49);

      const standard = pricing.tiers.oneTime.find(t => t.id === 'standard-lifetime');
      expect(standard).toBeDefined();
      expect(standard.priceUSD).toBe(69);

      expect(pricing.tiers.monthly).toBeDefined();
      const monthly = pricing.tiers.monthly.find(t => t.id === 'light-monthly');
      expect(monthly).toBeDefined();
      expect(monthly.priceUSD).toBe(7.99);
    });

    test('hero.json highlights CCT, adult improvers, and early bird $49 access', () => {
      expect(hero.headline).toBeDefined();
      expect(hero.subheadline).toMatch(/800–1600|Adult Improvers/);
      expect(hero.subheadline).toMatch(/Checks-Captures-Threats|CCT/);
      expect(hero.primaryCta).toContain('$49');
    });
  });

  describe('REST Endpoints for Modular Content Files', () => {
    test('GET /api/competitors returns verified competitor list', async () => {
      const res = await request(app).get('/api/competitors');
      expect(res.status).toBe(200);
      expect(res.body.competitors.length).toBeGreaterThanOrEqual(4);
    });

    test('GET /api/hero returns hero copy', async () => {
      const res = await request(app).get('/api/hero');
      expect(res.status).toBe(200);
      expect(res.body.headline).toBeDefined();
    });

    test('GET /api/pricing returns pricing tiers', async () => {
      const res = await request(app).get('/api/pricing');
      expect(res.status).toBe(200);
      expect(res.body.tiers.oneTime.length).toBeGreaterThanOrEqual(2);
      expect(res.body.tiers.monthly.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/features returns core methodology features', async () => {
      const res = await request(app).get('/api/features');
      expect(res.status).toBe(200);
      expect(res.body.features.length).toBeGreaterThanOrEqual(4);
    });
  });
});
