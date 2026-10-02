const express = require('express');
const router = express.Router();
const config = require('../config');
const { db } = require('../db');
const SignupService = require('../services/signupService');
const QRService = require('../services/qrService');

// Config endpoint for client apps
router.get('/config', (req, res) => {
  res.json({
    school: config.school,
    disciplines: config.disciplines,
    programs: config.programs,
    emailMockMode: config.email.mockMode
  });
});

// Create signup
router.post('/signups', async (req, res) => {
  try {
    const result = await SignupService.registerStudent(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful! Confirmation email has been dispatched with your check-in pass.',
      data: result
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message,
      details: err.errors || null
    });
  }
});

// Get all signups with filter & search
router.get('/signups', (req, res) => {
  try {
    const filters = {
      search: req.query.search || '',
      discipline: req.query.discipline || 'all',
      program: req.query.program || 'all',
      status: req.query.status || 'all',
      experience: req.query.experience || 'all'
    };
    const signups = db.getAllSignups(filters);
    res.json({
      success: true,
      count: signups.length,
      data: signups
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single signup with personal QR pass
router.get('/signups/:id', async (req, res) => {
  try {
    const signup = db.getSignupById(req.params.id);
    if (!signup) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    const qrInfo = await QRService.generateStudentPassQR(signup);
    res.json({
      success: true,
      data: {
        ...signup,
        passQR: qrInfo.qrDataUrl,
        verifyUrl: qrInfo.verifyUrl
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update signup status
router.patch('/signups/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'checked_in', 'pending', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = db.updateSignup(req.params.id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete signup
router.delete('/signups/:id', (req, res) => {
  try {
    const deleted = db.deleteSignup(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Resend confirmation email
router.post('/signups/:id/resend-email', async (req, res) => {
  try {
    const result = await SignupService.resendEmail(req.params.id);
    res.json({
      success: true,
      message: `Confirmation email re-sent successfully to ${result.sentTo}!`,
      data: result
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

// Check-in via QR / Pass Code
router.post('/check-in', async (req, res) => {
  try {
    const { code, rawScan } = req.body;
    const input = code || rawScan;
    const result = await SignupService.checkInStudent(input);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  }
});

// Verify pass code endpoint (used by QR scanner / camera link)
router.get('/qr/verify/:code', async (req, res) => {
  try {
    const student = db.getSignupByPassCode(req.params.code);
    if (!student) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid pass code. No registered student found.'
      });
    }

    const qrInfo = await QRService.generateStudentPassQR(student);
    res.json({
      success: true,
      valid: true,
      student: {
        id: student.id,
        fullName: student.fullName,
        discipline: student.discipline,
        program: student.program,
        status: student.status,
        passCode: student.passCode,
        checkInCount: student.checkInCount || 0,
        lastCheckInAt: student.lastCheckInAt
      },
      passQR: qrInfo.qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate poster QR code
router.get('/qr/poster', async (req, res) => {
  try {
    const poster = await QRService.generatePosterQR({
      discipline: req.query.discipline || 'all',
      program: req.query.program || 'free-trial',
      promoCode: req.query.promoCode || '',
      source: req.query.source || 'poster',
      baseUrl: `${req.protocol}://${req.get('host')}`
    });
    res.json({ success: true, data: poster });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Email Logs
router.get('/emails', (req, res) => {
  try {
    const emails = db.getAllEmails();
    res.json({ success: true, count: emails.length, data: emails });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/emails/:id', (req, res) => {
  try {
    const email = db.getEmailById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email log not found' });
    }
    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Stats
router.get('/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export CSV
router.get('/export', (req, res) => {
  try {
    const csvData = SignupService.exportCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="apex_dojo_signups_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
