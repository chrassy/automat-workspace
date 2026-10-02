const QRCode = require('qrcode');
const config = require('../config');

class QRService {
  /**
   * Generates a QR code data URL (PNG)
   */
  static async generateDataUrl(text, options = {}) {
    const opts = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 2,
      scale: options.scale || 8,
      color: {
        dark: options.darkColor || '#0f172a',
        light: options.lightColor || '#ffffff'
      },
      ...options
    };
    return QRCode.toDataURL(text, opts);
  }

  /**
   * Generates a QR code as SVG string
   */
  static async generateSvg(text, options = {}) {
    const opts = {
      errorCorrectionLevel: 'M',
      margin: 2,
      color: {
        dark: options.darkColor || '#0f172a',
        light: options.lightColor || '#ffffff'
      },
      ...options
    };
    return QRCode.toString(text, { type: 'svg', ...opts });
  }

  /**
   * Generates a QR code for a student's personal Dojo Pass
   */
  static async generateStudentPassQR(signup, baseUrl = config.baseUrl) {
    // We encode a structured payload that can be scanned by the front desk camera or barcode scanner
    const payload = JSON.stringify({
      type: 'MARTIAL_ARTS_PASS',
      code: signup.passCode,
      id: signup.id,
      name: signup.fullName,
      discipline: signup.discipline,
      verifyUrl: `${baseUrl}/api/qr/verify/${signup.passCode}`
    });

    const qrDataUrl = await this.generateDataUrl(payload, {
      darkColor: '#881337', // Martial Arts deep crimson
      lightColor: '#ffffff'
    });

    return {
      passCode: signup.passCode,
      payload,
      qrDataUrl,
      verifyUrl: `${baseUrl}/api/qr/verify/${signup.passCode}`
    };
  }

  /**
   * Generates a QR code for a marketing poster / front-desk quick signup flyer
   */
  static async generatePosterQR({
    discipline = 'all',
    program = 'free-trial',
    promoCode = '',
    source = 'kiosk',
    baseUrl = config.baseUrl
  } = {}) {
    const url = new URL(baseUrl);
    if (discipline && discipline !== 'all') {
      url.searchParams.set('discipline', discipline);
    }
    if (program && program !== 'all') {
      url.searchParams.set('program', program);
    }
    if (promoCode) {
      url.searchParams.set('promo', promoCode);
    }
    url.searchParams.set('utm_source', source);

    const targetUrl = url.toString();
    const qrDataUrl = await this.generateDataUrl(targetUrl, {
      darkColor: '#0f172a',
      lightColor: '#ffffff',
      scale: 10
    });

    const disciplineObj = config.disciplines.find(d => d.id === discipline);
    const programObj = config.programs.find(p => p.id === program);

    return {
      targetUrl,
      qrDataUrl,
      discipline: disciplineObj || null,
      program: programObj || null,
      promoCode,
      source,
      school: config.school
    };
  }
}

module.exports = QRService;
