const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { db } = require('../db');

class EmailService {
  constructor(customTransporter = null) {
    this.transporter = customTransporter;
    this.initTransporter();
  }

  initTransporter() {
    if (this.transporter) return;

    if (!config.email.mockMode && config.email.smtp.host) {
      this.transporter = nodemailer.createTransport({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.secure,
        auth: {
          user: config.email.smtp.auth.user,
          pass: config.email.smtp.auth.pass
        }
      });
    }
  }

  /**
   * Builds the HTML email for a new martial arts signup confirmation
   */
  generateWelcomeEmailHtml(signup, qrDataUrl) {
    const disc = config.disciplines.find(d => d.id === signup.discipline) || {
      name: signup.discipline || 'Martial Arts',
      whatToBring: 'Clean workout gear and water bottle.',
      schedule: ['Check with front desk']
    };
    const prog = config.programs.find(p => p.id === signup.program) || {
      name: signup.program || 'Trial Class'
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${config.school.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; color: #1f2937; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #881337 0%, #4c0519 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0 0 8px; font-size: 26px; letter-spacing: -0.5px; }
    .header p { margin: 0; opacity: 0.9; font-size: 15px; color: #fecdd3; }
    .content { padding: 28px 24px; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .pass-card { background: #fff1f2; border: 2px dashed #e11d48; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0; }
    .pass-code { font-family: monospace; font-size: 24px; font-weight: 700; color: #881337; letter-spacing: 2px; margin: 8px 0; }
    .qr-image { width: 180px; height: 180px; margin: 12px auto; display: block; border-radius: 8px; border: 1px solid #fda4af; }
    .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px; }
    .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .details-row:last-child { border-bottom: none; }
    .details-label { font-weight: 600; color: #475569; }
    .details-value { font-weight: 500; color: #0f172a; text-align: right; }
    .dojo-rules { background: #fefce8; border-left: 4px solid #eab308; padding: 14px 16px; border-radius: 4px; margin: 20px 0; font-size: 13px; color: #713f12; }
    .footer { background: #0f172a; color: #94a3b8; padding: 24px; text-align: center; font-size: 12px; }
    .footer a { color: #f43f5e; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🥋 ${config.school.name}</h1>
      <p>${config.school.tagline}</p>
    </div>

    <div class="content">
      <div class="greeting">Oss, ${signup.fullName}! Welcome to the Academy.</div>
      <p>Your registration for <strong>${disc.name}</strong> (${prog.name}) has been confirmed. We are thrilled to guide you on your martial arts journey.</p>

      <!-- Digital Pass Card -->
      <div class="pass-card">
        <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #9f1239; font-weight: 700;">Your Dojo Check-In Pass</div>
        <div class="pass-code">${signup.passCode}</div>
        <img src="${qrDataUrl}" alt="Check-In QR Code" class="qr-image" />
        <p style="margin: 6px 0 0; font-size: 12px; color: #64748b;">Show this QR code at the front desk tablet when you arrive for instant check-in.</p>
      </div>

      <!-- Registration Summary -->
      <div class="details-box">
        <div class="details-row">
          <span class="details-label">Program</span>
          <span class="details-value">${prog.name}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Discipline</span>
          <span class="details-value">${disc.name}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Experience Level</span>
          <span class="details-value">${signup.experienceLevel || 'Beginner'}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Preferred Class Slot</span>
          <span class="details-value">${signup.preferredSchedule || 'Flexible'}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Waiver Signed</span>
          <span class="details-value" style="color: #16a34a;">✓ Signed Electronically</span>
        </div>
      </div>

      <!-- Preparation Checklist -->
      <div style="margin: 20px 0;">
        <h3 style="font-size: 15px; margin-bottom: 8px; color: #0f172a;">🥋 What to Bring to Your First Class</h3>
        <p style="font-size: 14px; margin: 4px 0; color: #334155;">${disc.whatToBring}</p>
        <ul style="font-size: 13px; color: #475569; padding-left: 20px; margin-top: 8px;">
          <li>Arrive 10–15 minutes early for orientation and tour.</li>
          <li>Remove jewelry, watches, and piercings before stepping on the tatami mats.</li>
          <li>Trim finger and toenails for safety.</li>
          <li>Bring a water bottle and sweat towel.</li>
        </ul>
      </div>

      <!-- Dojo Etiquette -->
      <div class="dojo-rules">
        <strong>🥋 Dojo Etiquette:</strong> Bow slightly upon entering and stepping off the mats. Respect your training partners, instructors, and yourself. Leave your ego at the door.
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px;"><strong>${config.school.name}</strong></p>
      <p style="margin: 0 0 6px;">📍 ${config.school.address}</p>
      <p style="margin: 0 0 10px;">📞 ${config.school.phone} &bull; ✉️ <a href="mailto:${config.school.email}">${config.school.email}</a></p>
      <p style="margin: 0; font-size: 11px; opacity: 0.7;">© ${new Date().getFullYear()} ${config.school.name}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Builds the plain text version of the confirmation email
   */
  generateWelcomeEmailText(signup) {
    const disc = config.disciplines.find(d => d.id === signup.discipline) || { name: signup.discipline };
    const prog = config.programs.find(p => p.id === signup.program) || { name: signup.program };

    return `
Welcome to ${config.school.name}!

Hi ${signup.fullName},

Your registration for ${disc.name} (${prog.name}) is confirmed!

YOUR DOJO PASS CODE: ${signup.passCode}
Please present this code or your QR pass when checking in at the front desk.

REGISTRATION DETAILS:
- Discipline: ${disc.name}
- Program: ${prog.name}
- Experience: ${signup.experienceLevel || 'Beginner'}
- Preferred Slot: ${signup.preferredSchedule || 'Flexible'}

DOJO LOCATION:
${config.school.name}
${config.school.address}
Phone: ${config.school.phone}
Email: ${config.school.email}

We look forward to seeing you on the mats!
    `.trim();
  }

  /**
   * Sends confirmation email and logs it
   */
  async sendWelcomeEmail(signup, qrDataUrl) {
    const subject = `🥋 Welcome to ${config.school.name} - Your Pass & First Class Guide!`;
    const html = this.generateWelcomeEmailHtml(signup, qrDataUrl);
    const text = this.generateWelcomeEmailText(signup);

    const emailRecord = {
      id: `mail-${uuidv4().slice(0, 8)}`,
      signupId: signup.id,
      to: signup.email,
      recipientName: signup.fullName,
      from: config.email.from,
      subject,
      html,
      text,
      passCode: signup.passCode,
      status: 'sent',
      sentAt: new Date().toISOString(),
      mockMode: config.email.mockMode || !this.transporter
    };

    if (this.transporter && !config.email.mockMode) {
      try {
        await this.transporter.sendMail({
          from: config.email.from,
          to: signup.email,
          subject,
          text,
          html
        });
        emailRecord.status = 'delivered';
      } catch (err) {
        console.error('SMTP Delivery error:', err.message);
        emailRecord.status = 'failed';
        emailRecord.error = err.message;
      }
    } else {
      emailRecord.status = 'delivered (mock)';
    }

    db.logEmail(emailRecord);
    return emailRecord;
  }
}

const emailService = new EmailService();

module.exports = {
  EmailService,
  emailService
};
