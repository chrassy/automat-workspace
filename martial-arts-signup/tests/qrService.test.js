const QRService = require('../src/services/qrService');

describe('QRService', () => {
  test('generateDataUrl creates a valid base64 PNG data URL', async () => {
    const dataUrl = await QRService.generateDataUrl('https://apexmartialarts.example.com');
    expect(dataUrl).toBeDefined();
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  test('generateSvg creates an SVG string', async () => {
    const svg = await QRService.generateSvg('TEST_MARTIAL_ARTS');
    expect(svg).toBeDefined();
    expect(svg).toContain('<svg');
  });

  test('generateStudentPassQR returns QR code and student payload', async () => {
    const mockSignup = {
      id: 'reg_test123',
      passCode: 'BJJ-9999',
      fullName: 'Bruce Lee',
      discipline: 'bjj'
    };

    const result = await QRService.generateStudentPassQR(mockSignup, 'http://localhost:3000');
    expect(result.passCode).toBe('BJJ-9999');
    expect(result.qrDataUrl).toMatch(/^data:image\/png;base64,/);
    expect(result.verifyUrl).toContain('/api/qr/verify/BJJ-9999');

    const parsed = JSON.parse(result.payload);
    expect(parsed.type).toBe('MARTIAL_ARTS_PASS');
    expect(parsed.code).toBe('BJJ-9999');
    expect(parsed.name).toBe('Bruce Lee');
  });

  test('generatePosterQR generates poster metadata with query parameters', async () => {
    const poster = await QRService.generatePosterQR({
      discipline: 'muay-thai',
      program: 'starter-pass',
      promoCode: 'SUMMER2025',
      source: 'flyer',
      baseUrl: 'http://localhost:3000'
    });

    expect(poster.targetUrl).toContain('discipline=muay-thai');
    expect(poster.targetUrl).toContain('program=starter-pass');
    expect(poster.targetUrl).toContain('promo=SUMMER2025');
    expect(poster.targetUrl).toContain('utm_source=flyer');
    expect(poster.qrDataUrl).toMatch(/^data:image\/png;base64,/);
    expect(poster.discipline.name).toBe('Muay Thai Kickboxing');
  });
});
