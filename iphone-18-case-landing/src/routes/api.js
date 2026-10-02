const express = require('express');
const router = express.Router();
const CONFIG = require('../config');
const { calculateDropMetrics } = require('../services/drop-simulator');
const { calculateOrderTotal, createPreOrder, getPreOrder } = require('../services/order-service');

// In-memory reviews array (initialized from config)
let userReviews = [...CONFIG.reviews];

// GET /api/config
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      product: CONFIG.product,
      currencies: CONFIG.currencies,
      accessories: CONFIG.accessories,
      faqs: CONFIG.faqs
    }
  });
});

// POST /api/calculate
router.post('/calculate', (req, res) => {
  try {
    const { items, couponCode, currency, shippingType } = req.body;
    const calculation = calculateOrderTotal(items, couponCode, currency, shippingType);
    res.json({ success: true, data: calculation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/preorder
router.post('/preorder', (req, res) => {
  try {
    const order = createPreOrder(req.body);
    res.status(201).json({
      success: true,
      message: 'Pre-order successfully placed! Your launch day batch allocation is reserved.',
      data: order
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/track/:orderId
router.get('/track/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = getPreOrder(orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      error: `Order with ID "${orderId}" was not found. Try searching for sample order "AERO-18-99421".`
    });
  }
  res.json({ success: true, data: order });
});

// POST /api/simulate-drop
router.post('/simulate-drop', (req, res) => {
  try {
    const { heightFeet, surface, caseType } = req.body;
    const metrics = calculateDropMetrics(
      Number(heightFeet) || 10,
      surface || 'concrete',
      caseType || 'aero-shield'
    );
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/coupon/validate
router.post('/coupon/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Coupon code is required.' });
  }
  const cleanCode = String(code).toUpperCase().trim();
  const coupon = CONFIG.coupons[cleanCode];
  if (!coupon) {
    return res.status(404).json({ success: false, valid: false, error: 'Invalid or expired coupon code.' });
  }
  res.json({
    success: true,
    valid: true,
    data: {
      code: cleanCode,
      type: coupon.type,
      value: coupon.value,
      label: coupon.label
    }
  });
});

// GET /api/reviews
router.get('/reviews', (req, res) => {
  const { model, rating } = req.query;
  let filtered = [...userReviews];

  if (model && model !== 'all') {
    filtered = filtered.filter(r => r.model.toLowerCase().includes(model.toLowerCase()));
  }
  if (rating && rating !== 'all') {
    const minRating = parseInt(rating, 10);
    if (!isNaN(minRating)) {
      filtered = filtered.filter(r => r.rating >= minRating);
    }
  }

  const averageRating = (
    userReviews.reduce((sum, r) => sum + r.rating, 0) / (userReviews.length || 1)
  ).toFixed(2);

  res.json({
    success: true,
    data: {
      reviews: filtered,
      totalReviews: userReviews.length,
      averageRating: Number(averageRating)
    }
  });
});

// POST /api/reviews
router.post('/reviews', (req, res) => {
  const { author, rating, model, title, content } = req.body;
  if (!author || !rating || !title || !content) {
    return res.status(400).json({
      success: false,
      error: 'Author, rating, title, and content are required fields.'
    });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    author: String(author).trim(),
    role: 'Verified iPhone 18 Buyer',
    rating: Math.max(1, Math.min(5, parseInt(rating, 10) || 5)),
    model: model || 'iPhone 18 Pro',
    date: 'Just now',
    verified: true,
    title: String(title).trim(),
    content: String(content).trim()
  };

  userReviews.unshift(newReview);

  res.status(201).json({
    success: true,
    message: 'Thank you for your verified review!',
    data: newReview
  });
});

// POST /api/newsletter
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }
  res.json({
    success: true,
    message: 'Welcome to the VIP Early Access Club! Use coupon VIPEARLY at checkout for 25% off.',
    promoCode: 'VIPEARLY'
  });
});

module.exports = router;
