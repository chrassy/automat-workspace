'use strict';

const express = require('express');
const router = express.Router();
const calculatorService = require('../services/calculatorService');
const leadService = require('../services/leadService');
const simulationService = require('../services/simulationService');

// System Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'pulse-gym-software',
    timestamp: new Date().toISOString()
  });
});

// Calculate ROI & Financial Value
router.post('/roi-calculator', (req, res) => {
  try {
    const { memberCount, avgMonthlyFee, monthlyChurnPct, failedPaymentPct } = req.body || {};
    const result = calculatorService.calculateRoi({
      memberCount,
      avgMonthlyFee,
      monthlyChurnPct,
      failedPaymentPct
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Migration timeline & savings estimation
router.get('/migration-estimate', (req, res) => {
  try {
    const { competitor = 'mindbody', memberCount = 200 } = req.query;
    const estimate = calculatorService.estimateMigration(competitor, memberCount);
    res.status(200).json({ success: true, data: estimate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit Lead / Demo Request
router.post('/leads', (req, res) => {
  try {
    const lead = leadService.createLead(req.body);
    res.status(201).json({
      success: true,
      message: 'Demo request successfully received. Our gym specialist will contact you within 2 business hours.',
      data: lead
    });
  } catch (err) {
    if (err.validationErrors) {
      return res.status(400).json({
        success: false,
        error: err.message,
        details: err.validationErrors
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Leads list
router.get('/leads', (req, res) => {
  try {
    const leads = leadService.getAllLeads();
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Interactive Simulation Endpoints
router.get('/simulation/members', (req, res) => {
  res.status(200).json({
    success: true,
    data: simulationService.getMembers()
  });
});

router.post('/simulation/checkin', (req, res) => {
  try {
    const { barcodeOrId } = req.body || {};
    if (!barcodeOrId) {
      return res.status(400).json({
        success: false,
        error: 'barcodeOrId is required'
      });
    }
    const result = simulationService.processCheckIn(barcodeOrId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/simulation/classes', (req, res) => {
  res.status(200).json({
    success: true,
    data: simulationService.getClasses()
  });
});

router.post('/simulation/book-class', (req, res) => {
  try {
    const { classId, memberName } = req.body || {};
    if (!classId) {
      return res.status(400).json({ success: false, error: 'classId is required' });
    }
    const result = simulationService.bookClassSpot(classId, memberName);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/simulation/telemetry', (req, res) => {
  res.status(200).json({
    success: true,
    data: simulationService.getDashboardTelemetry()
  });
});

module.exports = router;
