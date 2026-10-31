const express = require('express');
const cors = require('cors');
const path = require('path');
const beerSpecs = require('./content/beer-specs.json');
const faqData = require('./content/faq.json');

const app = express();

app.use(cors());
app.use(express.json());

// In-memory reservations storage
const reservations = new Map();
// Seed initial simulated community reservations to reflect realistic batch allocation
let initialReserved = 1842;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'borealis-craft-beer', timestamp: new Date().toISOString() });
});

// API: Beer Specifications
app.get('/api/specs', (req, res) => {
  res.json(beerSpecs);
});

// API: FAQ Data
app.get('/api/faq', (req, res) => {
  res.json(faqData);
});

// API: Live Batch Allocation Status
app.get('/api/batch-status', (req, res) => {
  const currentReserved = initialReserved + reservations.size;
  const total = beerSpecs.product.totalAllocation;
  const remaining = Math.max(0, total - currentReserved);
  const percentageClaimed = Math.min(100, Math.round((currentReserved / total) * 100));

  res.json({
    batch: beerSpecs.product.batch,
    status: beerSpecs.product.status,
    totalAllocation: total,
    claimed: currentReserved,
    remaining,
    percentageClaimed,
    targetRelease: beerSpecs.product.targetRelease
  });
});

// Email validation helper
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// API: Waitlist / Pre-Order Reservation
app.post('/api/waitlist', (req, res) => {
  const { email, packPreference, location } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email address',
      message: 'Please provide a valid email address to reserve your batch allocation.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (reservations.has(normalizedEmail)) {
    const existing = reservations.get(normalizedEmail);
    return res.status(200).json({
      success: true,
      alreadyReserved: true,
      reservationId: existing.reservationId,
      message: 'You already have an active reservation for Batch #001! We will email you once canning begins.',
      reservation: existing
    });
  }

  const reservationCount = initialReserved + reservations.size + 1;
  const reservationId = `BOR-${String(reservationCount).padStart(5, '0')}`;
  const record = {
    reservationId,
    email: normalizedEmail,
    packPreference: packPreference || '4-pack',
    location: location || 'Direct Ship',
    tier: 'Batch #001 VIP Allocation',
    reservedAt: new Date().toISOString(),
    isComingSoon: true,
    paymentRequired: false
  };

  reservations.set(normalizedEmail, record);

  res.status(201).json({
    success: true,
    message: 'Reservation secured! Batch #001 is coming soon. No payment was collected today.',
    reservation: record
  });
});

// API: Beer Flavor Matcher Quiz Evaluation
app.post('/api/quiz-results', (req, res) => {
  const { stylePreference, hopPreference, occasion } = req.body;

  if (!stylePreference || !hopPreference || !occasion) {
    return res.status(400).json({
      error: 'Missing quiz answers',
      message: 'Please provide stylePreference, hopPreference, and occasion.'
    });
  }

  // Calculate compatibility score with Borealis Cold IPA
  let score = 75; // base score

  if (stylePreference === 'crisp_lager' || stylePreference === 'west_coast_ipa') score += 15;
  else if (stylePreference === 'hazy_ipa') score += 10;
  else score += 5;

  if (hopPreference === 'citrus_tropical') score += 10;
  else if (hopPreference === 'crisp_pine') score += 8;
  else score += 5;

  score = Math.min(99, score);

  let recommendation = {
    score: `${score}%`,
    verdict: score >= 90 ? 'Perfect Palate Match' : 'Highly Recommended Discovery',
    headline: 'Borealis Cold IPA is your exact ideal sweet spot.',
    summary: 'You crave vibrant hop saturation without heavy cloying malt or palate fatigue. Borealis provides laser-sharp citrus and pine notes on an ultra-crisp, cold-fermented foundation.',
    suggestedPour: 'Stemmed tulip at 42°F',
    curatedPairing: 'Artisan grilled burger or woodfired margherita pizza'
  };

  res.json({ success: true, match: recommendation });
});

module.exports = app;
