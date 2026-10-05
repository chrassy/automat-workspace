const express = require('express');
const router = express.Router();

const competitorAnalysis = require('../content/competitor-analysis.json');
const icpPositioning = require('../content/icp-positioning.json');
const landingCopy = require('../content/landing-copy.json');
const distributionPlaybook = require('../content/distribution-playbook.json');

const competitorsData = require('../content/competitors.json');
const heroData = require('../content/hero.json');
const pricingData = require('../content/pricing.json');
const featuresData = require('../content/features.json');

const puzzleEngine = require('../services/puzzleEngine');
const waitlistService = require('../services/waitlistService');
const icpScorer = require('../services/icpScorer');

// Comprehensive Agent Deliverables Payload
router.get('/validation-data', (req, res) => {
  res.json({
    project: 'Interactive Beginner & Adult Improver Chess Course Market Validation',
    generatedBy: 'Autonomous Market Validation Agent Team (Agents 1-4)',
    status: 'ACTIVE_VALIDATION',
    researchBasis: 'GitHub Issue #16 Verified Market Research Report',
    agent1_CompetitorAnalysis: competitorAnalysis,
    agent2_IcpPositioning: icpPositioning,
    agent3_LandingPageCopy: landingCopy,
    agent4_DistributionPlaybook: distributionPlaybook,
    competitors: competitorsData,
    hero: heroData,
    pricing: pricingData,
    features: featuresData,
    liveWaitlistMetrics: waitlistService.getWaitlistStats()
  });
});

router.get('/competitors', (req, res) => {
  res.json(competitorsData);
});

router.get('/hero', (req, res) => {
  res.json(heroData);
});

router.get('/pricing', (req, res) => {
  res.json(pricingData);
});

router.get('/features', (req, res) => {
  res.json(featuresData);
});

router.get('/competitor-analysis', (req, res) => {
  res.json(competitorAnalysis);
});

router.get('/icp-positioning', (req, res) => {
  res.json(icpPositioning);
});

router.get('/landing-copy', (req, res) => {
  res.json(landingCopy);
});

router.get('/distribution-playbook', (req, res) => {
  res.json(distributionPlaybook);
});

// Interactive Puzzles
router.get('/puzzles', (req, res) => {
  res.json({
    count: puzzleEngine.getAllPuzzles().length,
    puzzles: puzzleEngine.getAllPuzzles()
  });
});

router.post('/puzzle/verify', (req, res) => {
  const { puzzleId, from, to } = req.body;

  if (!puzzleId || !from || !to) {
    return res.status(400).json({
      error: 'Missing required parameters: puzzleId, from, and to are required.'
    });
  }

  try {
    const result = puzzleEngine.verifyMove(puzzleId, from, to);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Waitlist & Intent Capture
router.post('/waitlist', (req, res) => {
  const { email, rating, frustration, pricingTolerance, source } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  try {
    const entry = waitlistService.addWaitlistEntry({
      email,
      rating,
      frustration,
      pricingTolerance,
      source
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for early bird pioneer access and free survival pack!',
      entry,
      stats: waitlistService.getWaitlistStats()
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/waitlist/stats', (req, res) => {
  res.json(waitlistService.getWaitlistStats());
});

// ICP Self-Assessment Quiz
router.post('/icp-quiz', (req, res) => {
  const { ratingRange, blunderFrequency, studyMethod, dailyTimeMinutes } = req.body;

  if (!ratingRange || !blunderFrequency) {
    return res.status(400).json({ error: 'ratingRange and blunderFrequency are required.' });
  }

  const assessment = icpScorer.scoreIcpProfile({
    ratingRange,
    blunderFrequency,
    studyMethod,
    dailyTimeMinutes: Number(dailyTimeMinutes) || 15
  });

  res.json(assessment);
});

module.exports = router;
