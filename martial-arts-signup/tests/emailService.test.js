const { EmailService } = require('../src/services/emailService');
const { db } = require('../src/db');

describe('EmailService', () => {
  let emailService;

  beforeEach(() => {
    db.clearAll();
    emailService = new EmailService();
  });

  test('generateWelcomeEmailHtml generates styled HTML containing student details and QR code', () => {
    const signup = {
      id: 'reg_123',
      fullName: 'Chuck Norris',
      email: 'chuck@example.com',
      discipline: 'karate',
      program: 'free-trial',
      passCode: 'KAR-1001',
      experienceLevel: 'Advanced / Black Belt',
      preferredSchedule: 'Saturday Morning'
    };
    const qrDataUrl = 'data:image/png;base64,mockqr';

    const html = emailService.generateWelcomeEmailHtml(signup, qrDataUrl);
    expect(html).toContain('Chuck Norris');
    expect(html).toContain('KAR-1001');
    expect(html).toContain('Traditional Karate');
    expect(html).toContain('data:image/png;base64,mockqr');
    expect(html).toContain('Dojo Etiquette');
  });

  test('sendWelcomeEmail logs the email in mock mode', async () => {
    const signup = {
      id: 'reg_abc',
      fullName: 'Ronda Rousey',
      email: 'ronda@example.com',
      discipline: 'judo',
      program: 'monthly-unlimited',
      passCode: 'JUDO-2002'
    };

    const result = await emailService.sendWelcomeEmail(signup, 'data:image/png;base64,mock');
    expect(result.id).toBeDefined();
    expect(result.to).toBe('ronda@example.com');
    expect(result.passCode).toBe('JUDO-2002');
    expect(result.status).toBe('delivered (mock)');

    const emails = db.getAllEmails();
    expect(emails.length).toBe(1);
    expect(emails[0].to).toBe('ronda@example.com');
  });
});
