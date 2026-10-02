const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const QRService = require('./qrService');
const { emailService } = require('./emailService');
const config = require('../config');

class SignupService {
  /**
   * Generates a human-friendly unique Pass Code
   */
  static generatePassCode(discipline = 'MA') {
    const prefix = (discipline || 'MA').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix || 'DOJO'}-${randomDigits}`;
  }

  /**
   * Validates signup payload
   */
  static validateSignupData(data) {
    const errors = [];

    if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    }

    if (!data.email || typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      errors.push('A valid email address is required.');
    }

    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 7) {
      errors.push('A valid phone number is required.');
    }

    const validDisciplineIds = config.disciplines.map(d => d.id);
    if (!data.discipline || !validDisciplineIds.includes(data.discipline)) {
      errors.push(`Discipline is required. Choose from: ${validDisciplineIds.join(', ')}`);
    }

    const validProgramIds = config.programs.map(p => p.id);
    if (!data.program || !validProgramIds.includes(data.program)) {
      errors.push(`Program is required. Choose from: ${validProgramIds.join(', ')}`);
    }

    if (data.waiverAccepted !== true && data.waiverAccepted !== 'true') {
      errors.push('You must accept the liability waiver and safety terms.');
    }

    if (data.age && (isNaN(Number(data.age)) || Number(data.age) < 4 || Number(data.age) > 100)) {
      errors.push('Age must be a realistic number between 4 and 100.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a new student signup
   */
  static async registerStudent(data) {
    const validation = this.validateSignupData(data);
    if (!validation.isValid) {
      const err = new Error('Validation failed');
      err.errors = validation.errors;
      err.statusCode = 400;
      throw err;
    }

    const id = `reg_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const passCode = this.generatePassCode(data.discipline);

    const signupRecord = {
      id,
      passCode,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      age: data.age ? Number(data.age) : null,
      discipline: data.discipline,
      program: data.program,
      experienceLevel: data.experienceLevel || 'Beginner',
      preferredSchedule: data.preferredSchedule || '',
      emergencyContactName: data.emergencyContactName ? data.emergencyContactName.trim() : '',
      emergencyContactPhone: data.emergencyContactPhone ? data.emergencyContactPhone.trim() : '',
      uniformSize: data.uniformSize || 'Adult M',
      goals: Array.isArray(data.goals) ? data.goals : (data.goals ? [data.goals] : []),
      medicalNotes: data.medicalNotes ? data.medicalNotes.trim() : '',
      waiverAccepted: true,
      waiverSignedAt: new Date().toISOString(),
      status: 'confirmed',
      checkInCount: 0,
      lastCheckInAt: null,
      source: data.source || 'web_form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to database
    db.createSignup(signupRecord);

    // Generate QR Pass
    const qrInfo = await QRService.generateStudentPassQR(signupRecord);

    // Trigger welcome email
    let emailResult = null;
    try {
      emailResult = await emailService.sendWelcomeEmail(signupRecord, qrInfo.qrDataUrl);
    } catch (mailErr) {
      console.error('Failed to send welcome email:', mailErr.message);
    }

    return {
      signup: signupRecord,
      passQR: qrInfo.qrDataUrl,
      passCode: signupRecord.passCode,
      emailSent: Boolean(emailResult)
    };
  }

  /**
   * Process Check-in by QR code or Pass Code
   */
  static async checkInStudent(rawInput) {
    let passCodeToFind = '';

    if (!rawInput) {
      const err = new Error('Pass code or QR code payload is required');
      err.statusCode = 400;
      throw err;
    }

    // Check if input is a JSON string from QR code scanner
    if (typeof rawInput === 'string' && rawInput.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(rawInput);
        passCodeToFind = parsed.code || parsed.passCode || '';
      } catch (e) {
        passCodeToFind = rawInput.trim();
      }
    } else {
      passCodeToFind = String(rawInput).trim();
    }

    const student = db.getSignupByPassCode(passCodeToFind);
    if (!student) {
      const err = new Error(`Student pass "${passCodeToFind}" not found. Please verify the QR code or sign up.`);
      err.statusCode = 404;
      throw err;
    }

    const now = new Date().toISOString();
    const updated = db.updateSignup(student.id, {
      status: 'checked_in',
      checkInCount: (student.checkInCount || 0) + 1,
      lastCheckInAt: now
    });

    const checkInRecord = {
      id: `chk_${uuidv4().slice(0, 8)}`,
      signupId: student.id,
      passCode: student.passCode,
      studentName: student.fullName,
      discipline: student.discipline,
      program: student.program,
      timestamp: now
    };
    db.recordCheckIn(checkInRecord);

    return {
      success: true,
      message: `Welcome back, ${student.fullName}! Check-in confirmed for ${student.discipline.toUpperCase()}.`,
      student: updated,
      checkIn: checkInRecord
    };
  }

  /**
   * Resend confirmation email
   */
  static async resendEmail(id) {
    const signup = db.getSignupById(id);
    if (!signup) {
      const err = new Error('Signup record not found');
      err.statusCode = 404;
      throw err;
    }

    const qrInfo = await QRService.generateStudentPassQR(signup);
    const emailResult = await emailService.sendWelcomeEmail(signup, qrInfo.qrDataUrl);

    return {
      success: true,
      emailId: emailResult.id,
      sentTo: signup.email
    };
  }

  /**
   * Export all signups to CSV
   */
  static exportCsv() {
    const signups = db.getAllSignups();
    const headers = [
      'ID',
      'Pass Code',
      'Full Name',
      'Email',
      'Phone',
      'Age',
      'Discipline',
      'Program',
      'Experience Level',
      'Preferred Schedule',
      'Emergency Contact',
      'Emergency Phone',
      'Uniform Size',
      'Status',
      'Check-in Count',
      'Last Check-in',
      'Created At'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = signups.map(s => [
      escapeCsv(s.id),
      escapeCsv(s.passCode),
      escapeCsv(s.fullName),
      escapeCsv(s.email),
      escapeCsv(s.phone),
      escapeCsv(s.age),
      escapeCsv(s.discipline),
      escapeCsv(s.program),
      escapeCsv(s.experienceLevel),
      escapeCsv(s.preferredSchedule),
      escapeCsv(s.emergencyContactName),
      escapeCsv(s.emergencyContactPhone),
      escapeCsv(s.uniformSize),
      escapeCsv(s.status),
      escapeCsv(s.checkInCount),
      escapeCsv(s.lastCheckInAt),
      escapeCsv(s.createdAt)
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
}

module.exports = SignupService;
