const SignupService = require('../src/services/signupService');
const { db } = require('../src/db');

describe('SignupService', () => {
  beforeEach(() => {
    db.clearAll();
  });

  describe('validateSignupData', () => {
    test('rejects missing or short full name', () => {
      const res = SignupService.validateSignupData({
        fullName: 'A',
        email: 'test@example.com',
        phone: '1234567890',
        discipline: 'bjj',
        program: 'free-trial',
        waiverAccepted: true
      });
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toContain('Full name is required');
    });

    test('rejects invalid email address', () => {
      const res = SignupService.validateSignupData({
        fullName: 'Georges St-Pierre',
        email: 'invalid-email',
        phone: '1234567890',
        discipline: 'mma',
        program: 'free-trial',
        waiverAccepted: true
      });
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toContain('valid email address is required');
    });

    test('rejects unaccepted waiver', () => {
      const res = SignupService.validateSignupData({
        fullName: 'Georges St-Pierre',
        email: 'gsp@example.com',
        phone: '1234567890',
        discipline: 'mma',
        program: 'free-trial',
        waiverAccepted: false
      });
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toContain('liability waiver');
    });

    test('accepts valid signup data', () => {
      const res = SignupService.validateSignupData({
        fullName: 'Georges St-Pierre',
        email: 'gsp@example.com',
        phone: '1234567890',
        discipline: 'mma',
        program: 'free-trial',
        waiverAccepted: true,
        age: 35
      });
      expect(res.isValid).toBe(true);
      expect(res.errors.length).toBe(0);
    });
  });

  describe('registerStudent', () => {
    test('creates student, generates QR pass, and dispatches email', async () => {
      const payload = {
        fullName: 'Anderson Silva',
        email: 'spider@example.com',
        phone: '555-123-4567',
        age: 38,
        discipline: 'muay-thai',
        program: 'starter-pass',
        experienceLevel: 'Advanced / Black Belt',
        uniformSize: 'Adult A3 (5\'10 - 6\'1)',
        emergencyContactName: 'Minotauro Nogueira',
        emergencyContactPhone: '555-987-6543',
        waiverAccepted: true
      };

      const result = await SignupService.registerStudent(payload);

      expect(result.signup).toBeDefined();
      expect(result.signup.id).toMatch(/^reg_/);
      expect(result.signup.fullName).toBe('Anderson Silva');
      expect(result.signup.discipline).toBe('muay-thai');
      expect(result.signup.passCode).toBeDefined();
      expect(result.passQR).toMatch(/^data:image\/png;base64,/);
      expect(result.emailSent).toBe(true);

      // Verify db storage
      const stored = db.getSignupById(result.signup.id);
      expect(stored).not.toBeNull();
      expect(stored.email).toBe('spider@example.com');
    });
  });

  describe('exportCsv', () => {
    test('exports CSV formatted string of all students', async () => {
      await SignupService.registerStudent({
        fullName: 'Royce Gracie',
        email: 'royce@example.com',
        phone: '555-000-1111',
        discipline: 'bjj',
        program: 'free-trial',
        waiverAccepted: true
      });

      const csv = SignupService.exportCsv();
      expect(csv).toContain('Royce Gracie');
      expect(csv).toContain('royce@example.com');
      expect(csv).toContain('bjj');
      expect(csv).toContain('Pass Code');
    });
  });
});
