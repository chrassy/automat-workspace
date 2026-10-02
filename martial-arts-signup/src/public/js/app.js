// Apex Martial Arts Academy - Client Application & QR Engine

// Default Configuration & Data Seed
const DEFAULT_CONFIG = {
  school: {
    name: 'Apex Martial Arts Academy',
    tagline: 'Strength • Honor • Discipline',
    address: '742 Bushido Way, Suite 100, San Francisco, CA 94103',
    phone: '(415) 888-DOJO',
    email: 'info@apexmartialarts.com',
    website: 'https://apexmartialarts.example.com'
  },
  disciplines: [
    {
      id: 'bjj',
      name: 'Brazilian Jiu-Jitsu',
      category: 'Grappling & Groundwork',
      icon: '🥋',
      image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=600&q=80',
      description: 'Master positional control, leverage, and submissions for self-defense and sport.',
      schedule: 'Mon / Wed 6:00 PM • Sat 10:00 AM (Open Mat)',
      whatToBring: 'Clean Gi or Rashguard & athletic shorts. Water bottle.'
    },
    {
      id: 'muay-thai',
      name: 'Muay Thai Kickboxing',
      category: 'Striking & Combatives',
      icon: '🥊',
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80',
      description: 'The Art of 8 Limbs: punches, kicks, knees, and elbows for intense conditioning.',
      schedule: 'Mon / Wed / Fri 7:00 PM • Sat 11:30 AM',
      whatToBring: 'Hand wraps & 16oz gloves (loaner gear provided for trials).'
    },
    {
      id: 'karate',
      name: 'Traditional Karate',
      category: 'Traditional Martial Arts',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      description: 'Shotokan Karate focusing on crisp forms (Kata), sparring, and mental discipline.',
      schedule: 'Tue / Thu 5:30 PM • Sun 10:00 AM',
      whatToBring: 'White Gi uniform or comfortable workout clothing.'
    },
    {
      id: 'taekwondo',
      name: 'Taekwondo',
      category: 'Olympic & High-Kicking',
      icon: '🥋',
      image: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&w=600&q=80',
      description: 'Dynamic aerial kicks, speed, flexibility, and Olympic sparring techniques.',
      schedule: 'Mon / Wed 5:00 PM • Fri 6:00 PM',
      whatToBring: 'Dobok uniform or flexible sports attire.'
    },
    {
      id: 'mma',
      name: 'Mixed Martial Arts',
      category: 'Comprehensive Combat',
      icon: '🔥',
      image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=600&q=80',
      description: 'Unified striking, wrestling cage control, and submission grappling.',
      schedule: 'Mon / Wed 8:00 PM • Fri 7:30 PM',
      whatToBring: 'MMA gloves, mouthguard, athletic compression shorts.'
    },
    {
      id: 'judo',
      name: 'Judo',
      category: 'Throws & Takedowns',
      icon: '🥋',
      image: 'https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&fit=crop&w=600&q=80',
      description: 'The Gentle Way: explosive throws, joint locks, trips, and balance disruption.',
      schedule: 'Tue / Thu 7:00 PM • Sat 2:00 PM',
      whatToBring: 'Heavyweight Judo Gi.'
    },
    {
      id: 'krav-maga',
      name: 'Krav Maga',
      category: 'Tactical Self-Defense',
      icon: '🛡️',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
      description: 'Instinctive defense against common street threats and situational awareness.',
      schedule: 'Tue / Thu 6:30 PM • Sat 11:00 AM',
      whatToBring: 'Comfortable cross-training shoes and workout clothes.'
    },
    {
      id: 'kids',
      name: 'Kids Bullyproof & Karate',
      category: 'Youth (Ages 5-13)',
      icon: '🌟',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      description: 'Confidence building, anti-bullying verbal boundaries, focus, and agility.',
      schedule: 'Mon / Wed 4:00 PM • Tue / Thu 4:15 PM',
      whatToBring: 'T-shirt and sweatpants or martial arts uniform.'
    }
  ],
  programs: [
    { id: 'free-trial', name: 'Free Introductory Trial Class', price: 0, popular: true, description: '1 Free class + full dojo tour & coach evaluation' },
    { id: 'starter-pass', name: '2-Week Beginner Quick-Start', price: 49, popular: true, description: '14 Days unlimited training + Free Academy T-Shirt' },
    { id: 'monthly-unlimited', name: 'Monthly Unlimited Membership', price: 159, popular: false, description: 'Full access to all disciplines, open mats & gym' },
    { id: 'kids-monthly', name: 'Kids Junior Champion Program', price: 129, popular: false, description: '2 classes/week + character development badges' }
  ]
};

// Initial Seed Signups for rich demo
const SEED_SIGNUPS = [
  {
    id: 'reg-bjj-01',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '(415) 555-0192',
    discipline: 'bjj',
    program: 'free-trial',
    experienceLevel: 'Beginner',
    preferredSchedule: 'Mon / Wed 6:00 PM',
    uniformSize: 'A2',
    passCode: 'APX-9281',
    status: 'confirmed',
    checkInCount: 1,
    lastCheckInAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'reg-mt-02',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '(415) 555-4821',
    discipline: 'muay-thai',
    program: 'starter-pass',
    experienceLevel: 'Intermediate',
    preferredSchedule: 'Mon / Wed / Fri 7:00 PM',
    uniformSize: 'M',
    passCode: 'APX-4712',
    status: 'checked_in',
    checkInCount: 3,
    lastCheckInAt: new Date(Date.now() - 1800000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'reg-kids-03',
    fullName: 'Liam & Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '(415) 555-8319',
    discipline: 'kids',
    program: 'kids-monthly',
    experienceLevel: 'Beginner',
    preferredSchedule: 'Mon / Wed 4:00 PM',
    uniformSize: 'K-M',
    passCode: 'APX-1934',
    status: 'confirmed',
    checkInCount: 0,
    lastCheckInAt: null,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// App State
let state = {
  config: DEFAULT_CONFIG,
  signups: [],
  emails: [],
  currentStep: 1,
  selectedDiscipline: 'bjj',
  selectedProgram: 'free-trial',
  latestCreatedSignup: null
};

// Initialize State
function initState() {
  try {
    const savedSignups = localStorage.getItem('apex_signups');
    state.signups = savedSignups ? JSON.parse(savedSignups) : [...SEED_SIGNUPS];
  } catch (e) {
    state.signups = [...SEED_SIGNUPS];
  }

  try {
    const savedEmails = localStorage.getItem('apex_emails');
    state.emails = savedEmails ? JSON.parse(savedEmails) : [];
  } catch (e) {
    state.emails = [];
  }

  // Pre-generate emails for seed signups if empty
  if (state.emails.length === 0) {
    state.signups.forEach(s => {
      generateMockEmailRecord(s);
    });
  }
}

// Generate QR Code data URL (pure client-side)
async function generateClientQRCode(text, color = '#0f172a', bgColor = '#ffffff') {
  if (typeof QRCode !== 'undefined' && QRCode.toDataURL) {
    try {
      return await QRCode.toDataURL(text, {
        margin: 2,
        scale: 8,
        color: {
          dark: color,
          light: bgColor
        }
      });
    } catch (err) {
      console.warn('QRCode generator failed, using fallback', err);
    }
  }

  // Fallback direct SVG Data URI
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&color=${color.replace('#','')}&bgcolor=${bgColor.replace('#','')}`;
}

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  initState();
  renderDisciplines();
  renderPrograms();
  setupGoalChips();
  initUrlParams();
  await updatePosterPreview();
  renderStats();
  renderMatFeed();
});

// Switch Navigation Tabs
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-content').forEach(s => {
    s.classList.toggle('active', s.id === `tab-${tabId}`);
  });

  if (tabId === 'admin') {
    renderAdminTable();
    renderStats();
  } else if (tabId === 'emails') {
    renderEmailLogs();
  } else if (tabId === 'qr') {
    updatePosterPreview();
  } else if (tabId === 'scanner') {
    renderMatFeed();
  }
}

// Render Discipline Cards
function renderDisciplines() {
  const container = document.getElementById('discipline-options');
  if (!container) return;

  container.innerHTML = state.config.disciplines.map(d => `
    <div class="discipline-card ${d.id === state.selectedDiscipline ? 'selected' : ''}" 
         onclick="selectDiscipline('${d.id}')" id="disc-card-${d.id}">
      <div class="discipline-image-wrap">
        <img src="${d.image}" alt="${d.name}" class="discipline-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'">
        <div class="discipline-image-overlay"></div>
        <div class="discipline-icon-badge">${d.icon}</div>
        <div class="discipline-check-badge">✓</div>
      </div>
      <div class="discipline-info">
        <div class="discipline-name">${d.name}</div>
        <div class="discipline-category">${d.category}</div>
        <div class="discipline-desc">${d.description}</div>
        <div class="discipline-schedule-tag">🕒 ${d.schedule}</div>
      </div>
    </div>
  `).join('');
}

function selectDiscipline(id) {
  state.selectedDiscipline = id;
  const input = document.getElementById('selected-discipline');
  if (input) input.value = id;

  document.querySelectorAll('.discipline-card').forEach(card => {
    card.classList.remove('selected');
  });
  const active = document.getElementById(`disc-card-${id}`);
  if (active) active.classList.add('selected');
}

// Render Program Cards
function renderPrograms() {
  const container = document.getElementById('program-options');
  if (!container) return;

  container.innerHTML = state.config.programs.map(p => `
    <div class="program-card ${p.id === state.selectedProgram ? 'selected' : ''}" 
         onclick="selectProgram('${p.id}')" id="prog-card-${p.id}">
      ${p.popular ? '<div class="program-popular-ribbon">⭐ Most Popular</div>' : ''}
      <div class="program-header">
        <span class="program-title">${p.name}</span>
        <span class="program-price">${p.price === 0 ? 'FREE' : `$${p.price}`}</span>
      </div>
      <div class="program-desc">${p.description}</div>
    </div>
  `).join('');
}

function selectProgram(id) {
  state.selectedProgram = id;
  const input = document.getElementById('selected-program');
  if (input) input.value = id;

  document.querySelectorAll('.program-card').forEach(card => {
    card.classList.remove('selected');
  });
  const active = document.getElementById(`prog-card-${id}`);
  if (active) active.classList.add('selected');
}

// Goal Chips
function setupGoalChips() {
  document.querySelectorAll('.goal-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const selected = Array.from(document.querySelectorAll('.goal-chip.active')).map(c => c.dataset.goal);
      const input = document.getElementById('training-goals-input');
      if (input) input.value = selected.join(', ');
    });
  });
}

// Stepper Navigation
function setFormStep(step) {
  state.currentStep = step;

  // Update Stepper
  document.querySelectorAll('.step-item').forEach(item => {
    const s = parseInt(item.dataset.step, 10);
    item.classList.toggle('active', s === step);
    item.classList.toggle('completed', s < step);
  });

  // Update Form Step views
  document.querySelectorAll('.form-step').forEach(stepDiv => {
    stepDiv.classList.toggle('active', stepDiv.id === `step-${step}`);
  });

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

function validateAndProceedStep(fromStep) {
  if (fromStep === 1) {
    if (!state.selectedDiscipline) {
      showToast('Please select a martial arts discipline.', 'error');
      return;
    }
    setFormStep(2);
  } else if (fromStep === 2) {
    const fullName = document.getElementById('student-name').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const phone = document.getElementById('student-phone').value.trim();
    const waiver = document.getElementById('waiver-agreed').checked;

    if (!fullName || !email || !phone) {
      showToast('Please fill in your name, email, and phone number.', 'error');
      return;
    }
    if (!waiver) {
      showToast('Please agree to the liability waiver & dojo rules.', 'error');
      return;
    }

    // Submit and generate pass!
    handleSignupSubmit();
  }
}

// Handle Form Submission
async function handleSignupSubmit() {
  const fullName = document.getElementById('student-name').value.trim();
  const email = document.getElementById('student-email').value.trim();
  const phone = document.getElementById('student-phone').value.trim();
  const age = document.getElementById('student-age').value || '18+';
  const uniformSize = document.getElementById('uniform-size').value || 'A2';
  const experienceLevel = document.getElementById('experience-level').value || 'Beginner';
  const emergencyName = document.getElementById('emergency-name').value.trim() || 'Parent/Guardian';
  const emergencyPhone = document.getElementById('emergency-phone').value.trim() || phone;
  const goals = document.getElementById('training-goals-input').value || 'Self-Defense, Fitness';

  const disc = state.config.disciplines.find(d => d.id === state.selectedDiscipline) || state.config.disciplines[0];
  const prog = state.config.programs.find(p => p.id === state.selectedProgram) || state.config.programs[0];

  const passCode = `APX-${Math.floor(1000 + Math.random() * 9000)}`;
  const signupId = `reg-${Date.now().toString(36)}`;

  const newRecord = {
    id: signupId,
    fullName,
    email,
    phone,
    age,
    uniformSize,
    discipline: disc.id,
    program: prog.id,
    experienceLevel,
    preferredSchedule: disc.schedule,
    emergencyContactName: emergencyName,
    emergencyContactPhone: emergencyPhone,
    trainingGoals: goals,
    passCode,
    status: 'confirmed',
    checkInCount: 0,
    lastCheckInAt: null,
    createdAt: new Date().toISOString()
  };

  // Generate QR Code Payload
  const qrPayload = JSON.stringify({
    type: 'MARTIAL_ARTS_PASS',
    passCode,
    name: fullName,
    discipline: disc.name
  });

  const qrDataUrl = await generateClientQRCode(qrPayload, '#881337', '#ffffff');
  newRecord.passQR = qrDataUrl;

  // Save to State
  state.signups.unshift(newRecord);
  try {
    localStorage.setItem('apex_signups', JSON.stringify(state.signups));
  } catch (e) {}

  // Generate confirmation email record
  generateMockEmailRecord(newRecord, qrDataUrl);

  state.latestCreatedSignup = newRecord;

  // Render Pass Card in Step 3
  renderGeneratedPass(newRecord, disc, prog, qrDataUrl);
  setFormStep(3);
  showToast(`Oss, ${fullName}! Your pass is ready.`, 'success');
}

// Render Instant Pass Card
function renderGeneratedPass(record, disc, prog, qrDataUrl) {
  const container = document.getElementById('confirmation-pass-container');
  if (!container) return;

  container.innerHTML = `
    <div class="dojo-pass-card">
      <div class="pass-card-header">
        <div>
          <div class="pass-academy-name">🥋 Apex Martial Arts</div>
          <div style="font-size: 0.72rem; color: #fda4af;">Strength • Honor • Discipline</div>
        </div>
        <span class="pass-tier-badge">${prog.name}</span>
      </div>

      <div class="pass-qr-box">
        <img src="${qrDataUrl}" alt="Student Pass QR" class="pass-qr-img">
      </div>

      <div class="pass-code-tag">${record.passCode}</div>

      <div class="pass-meta-grid">
        <div>
          <div class="pass-meta-label">Student</div>
          <div class="pass-meta-val">${record.fullName}</div>
        </div>
        <div>
          <div class="pass-meta-label">Discipline</div>
          <div class="pass-meta-val">${disc.name}</div>
        </div>
        <div>
          <div class="pass-meta-label">Uniform / Gi</div>
          <div class="pass-meta-val">${record.uniformSize}</div>
        </div>
        <div>
          <div class="pass-meta-label">Schedule Slot</div>
          <div class="pass-meta-val" style="font-size: 0.75rem;">${disc.schedule}</div>
        </div>
      </div>
    </div>
  `;
}

// Reset Sign-up Form for another registration
function resetSignupForm() {
  document.getElementById('signup-form').reset();
  selectDiscipline('bjj');
  selectProgram('free-trial');
  document.querySelectorAll('.goal-chip').forEach(c => c.classList.remove('active'));
  setFormStep(1);
}

// Generate Mock Email Log
function generateMockEmailRecord(signup, qrUrl) {
  const disc = state.config.disciplines.find(d => d.id === signup.discipline) || state.config.disciplines[0];
  const prog = state.config.programs.find(p => p.id === signup.program) || state.config.programs[0];

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 580px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
      <div style="background: linear-gradient(135deg, #881337 0%, #4c0519 100%); padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; color: #fff;">🥋 Apex Martial Arts Academy</h1>
        <p style="margin: 4px 0 0; color: #fecdd3; font-size: 13px;">Welcome to Your Martial Arts Journey</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 16px; margin-top: 0;"><strong>Oss, ${signup.fullName}!</strong></p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">Your registration for <strong>${disc.name}</strong> (${prog.name}) is officially confirmed.</p>
        
        <div style="background: #1e293b; border: 2px dashed #f43f5e; border-radius: 10px; padding: 18px; text-align: center; margin: 20px 0;">
          <div style="font-size: 12px; color: #fda4af; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Your Digital Check-In Pass</div>
          <div style="font-family: monospace; font-size: 22px; font-weight: 800; color: #f43f5e; margin: 8px 0;">${signup.passCode}</div>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Present this pass or scan at our Front Desk Kiosk upon arrival.</p>
        </div>

        <div style="background: #182235; border-radius: 8px; padding: 14px; margin-bottom: 18px; font-size: 13px; color: #cbd5e1;">
          <div style="font-weight: 700; color: #fff; margin-bottom: 6px;">🥋 What to Bring to Class:</div>
          <div>${disc.whatToBring}</div>
        </div>

        <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 14px;">
          📍 <strong>Apex Martial Arts Academy</strong> &bull; 742 Bushido Way, San Francisco, CA<br>
          📞 (415) 888-DOJO &bull; ✉️ info@apexmartialarts.com
        </div>
      </div>
    </div>
  `;

  const emailRecord = {
    id: `mail-${Math.random().toString(36).substr(2, 8)}`,
    signupId: signup.id,
    to: signup.email,
    recipientName: signup.fullName,
    subject: `🥋 Welcome to Apex Martial Arts - Pass #${signup.passCode}`,
    html,
    passCode: signup.passCode,
    status: 'delivered',
    sentAt: new Date().toISOString()
  };

  state.emails.unshift(emailRecord);
  try {
    localStorage.setItem('apex_emails', JSON.stringify(state.emails));
  } catch (e) {}
}

// QR Poster Generator Hub
async function updatePosterPreview() {
  const disciplineId = document.getElementById('poster-discipline')?.value || 'bjj';
  const theme = document.getElementById('poster-theme')?.value || 'dark';
  const promoCode = document.getElementById('poster-promo')?.value || 'TRIAL2026';

  const disc = state.config.disciplines.find(d => d.id === disciplineId) || state.config.disciplines[0];
  const posterUrl = `${window.location.origin}${window.location.pathname}?discipline=${disciplineId}&promo=${promoCode}&utm_source=kiosk`;

  const qrDataUrl = await generateClientQRCode(
    posterUrl,
    theme === 'dark' ? '#be123c' : '#0f172a',
    '#ffffff'
  );

  const sheet = document.getElementById('poster-sheet-preview');
  if (!sheet) return;

  sheet.className = `poster-sheet theme-${theme}`;
  sheet.innerHTML = `
    <div class="poster-header-emblem">${disc.icon}</div>
    <div class="poster-academy-title">APEX MARTIAL ARTS</div>
    <div class="poster-tagline">${disc.name} ACADEMY</div>

    <div class="poster-qr-frame">
      <img src="${qrDataUrl}" alt="Dynamic QR Poster" style="width: 100%; height: 100%; object-fit: contain;">
    </div>

    <div class="poster-scan-callout">📱 SCAN TO CLAIM FREE TRIAL</div>
    <div class="poster-instructions">Scan with your smartphone camera to claim instant introductory Dojo Pass & class orientation guide.</div>

    ${promoCode ? `<div style="background: rgba(190, 18, 60, 0.2); border: 1px solid rgba(190, 18, 60, 0.4); border-radius: 6px; padding: 6px; font-weight: 800; font-size: 0.85rem; margin-bottom: 1rem;">🔥 Promo Code: ${promoCode} Applied</div>` : ''}

    <div class="poster-footer-info">
      📍 742 Bushido Way, SF &bull; 📞 (415) 888-DOJO &bull; apexmartialarts.example.com
    </div>
  `;
}

// Front Desk Check-in Scanner
async function processCheckIn(codeToUse) {
  const input = document.getElementById('scanner-input');
  const code = (codeToUse || input.value).trim().toUpperCase();

  if (!code) {
    showToast('Please enter a valid pass code.', 'error');
    return;
  }

  const student = state.signups.find(s => s.passCode.toUpperCase() === code || s.id === code);

  const banner = document.getElementById('checkin-result-banner');
  if (!student) {
    banner.style.display = 'block';
    banner.innerHTML = `
      <div style="background: rgba(220, 38, 38, 0.2); border: 2px solid #ef4444; border-radius: 10px; padding: 1.25rem; text-align: center;">
        <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">❌ Invalid Pass Code</div>
        <div style="color: #fca5a5; font-size: 0.9rem;">No student found with code <strong>${code}</strong>. Please check in with front desk.</div>
      </div>
    `;
    showToast('Pass code not recognized.', 'error');
    return;
  }

  // Update check-in record
  student.status = 'checked_in';
  student.checkInCount = (student.checkInCount || 0) + 1;
  student.lastCheckInAt = new Date().toISOString();

  try {
    localStorage.setItem('apex_signups', JSON.stringify(state.signups));
  } catch (e) {}

  const disc = state.config.disciplines.find(d => d.id === student.discipline) || { name: student.discipline, icon: '🥋' };

  banner.style.display = 'block';
  banner.innerHTML = `
    <div style="background: rgba(22, 163, 74, 0.2); border: 2px solid #22c55e; border-radius: 10px; padding: 1.25rem; text-align: center; animation: fadeIn 0.3s ease;">
      <div style="font-size: 2rem; margin-bottom: 0.25rem;">${disc.icon}</div>
      <div style="font-size: 1.35rem; font-weight: 900; color: #86efac;">Welcome to the Mat, ${student.fullName}!</div>
      <div style="color: #cbd5e1; font-size: 0.9rem; margin: 0.35rem 0;">Pass Code: <strong>${student.passCode}</strong> &bull; Discipline: <strong>${disc.name}</strong></div>
      <div style="display: inline-block; background: #166534; color: #dcfce7; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 800;">
        🥋 Total Visits: ${student.checkInCount}
      </div>
    </div>
  `;

  if (input) input.value = '';
  showToast(`Check-in successful! Welcome, ${student.fullName}.`, 'success');
  renderMatFeed();
  renderStats();
}

function quickCheckIn(passCode) {
  const input = document.getElementById('scanner-input');
  if (input) input.value = passCode;
  processCheckIn(passCode);
}

// Render Live Mat Feed
function renderMatFeed() {
  const container = document.getElementById('mat-feed-container');
  if (!container) return;

  const checkedIn = state.signups.filter(s => s.lastCheckInAt).sort((a, b) => new Date(b.lastCheckInAt) - new Date(a.lastCheckInAt));

  if (checkedIn.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 1.5rem;">No check-ins logged on the mats today yet.</div>`;
    return;
  }

  container.innerHTML = checkedIn.map(s => {
    const disc = state.config.disciplines.find(d => d.id === s.discipline) || { name: s.discipline, icon: '🥋' };
    const timeAgo = s.lastCheckInAt ? new Date(s.lastCheckInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return `
      <div class="mat-student-card">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="font-size: 1.5rem;">${disc.icon}</div>
          <div>
            <div style="font-weight: 800; color: #fff;">${s.fullName}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">${disc.name} &bull; Pass ${s.passCode}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-checked_in">Checked In</span>
          <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.2rem;">🕒 ${timeAgo}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Staff Dashboard Table
function renderAdminTable() {
  const tbody = document.getElementById('registrations-tbody');
  if (!tbody) return;

  const search = (document.getElementById('admin-search')?.value || '').toLowerCase();
  const discFilter = document.getElementById('filter-discipline')?.value || 'all';
  const statusFilter = document.getElementById('filter-status')?.value || 'all';

  const filtered = state.signups.filter(s => {
    const matchSearch = !search || s.fullName.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || s.passCode.toLowerCase().includes(search);
    const matchDisc = discFilter === 'all' || s.discipline === discFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchDisc && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No student registrations matching your filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const disc = state.config.disciplines.find(d => d.id === s.discipline) || { name: s.discipline, icon: '🥋' };
    const prog = state.config.programs.find(p => p.id === s.program) || { name: s.program };

    return `
      <tr>
        <td>
          <div style="font-weight: 800; color: #fff;">${s.fullName}</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">Size: ${s.uniformSize || 'N/A'} &bull; ${s.experienceLevel || 'Beginner'}</div>
        </td>
        <td>
          <div style="font-size: 0.85rem;">${s.email}</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">${s.phone}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: #fda4af;">${disc.icon} ${disc.name}</div>
          <div style="font-size: 0.75rem; color: #cbd5e1;">${prog.name}</div>
        </td>
        <td>
          <code style="font-weight: 800; color: #f43f5e; background: rgba(190, 18, 60, 0.2); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(190, 18, 60, 0.4);">
            ${s.passCode}
          </code>
        </td>
        <td>
          <span class="badge badge-${s.status}">${s.status.replace('_', ' ')}</span>
        </td>
        <td style="font-weight: 700; text-align: center;">
          ${s.checkInCount || 0}
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-outline btn-sm" onclick="viewStudentPassModal('${s.id}')">🥋 Pass</button>
            <button class="btn btn-secondary btn-sm" onclick="quickCheckIn('${s.passCode}')">✓ Check-in</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Render Stats
function renderStats() {
  const total = state.signups.length;
  const checkedInToday = state.signups.filter(s => s.checkInCount > 0).length;
  const emailsSent = state.emails.length;

  const totalEl = document.getElementById('stat-total-signups');
  const checkinsEl = document.getElementById('stat-checkins');
  const emailsEl = document.getElementById('stat-emails');

  if (totalEl) totalEl.textContent = total;
  if (checkinsEl) checkinsEl.textContent = checkedInToday;
  if (emailsEl) emailsEl.textContent = emailsSent;
}

// View Student Pass Modal
async function viewStudentPassModal(id) {
  const s = state.signups.find(item => item.id === id);
  if (!s) return;

  const disc = state.config.disciplines.find(d => d.id === s.discipline) || { name: s.discipline, icon: '🥋' };
  const prog = state.config.programs.find(p => p.id === s.program) || { name: s.program };

  let qrDataUrl = s.passQR;
  if (!qrDataUrl) {
    const payload = JSON.stringify({ type: 'MARTIAL_ARTS_PASS', passCode: s.passCode, name: s.fullName });
    qrDataUrl = await generateClientQRCode(payload, '#881337', '#ffffff');
  }

  const modalBody = document.getElementById('pass-modal-body');
  modalBody.innerHTML = `
    <div class="dojo-pass-card" style="margin: 0 auto;">
      <div class="pass-card-header">
        <div>
          <div class="pass-academy-name">🥋 Apex Martial Arts</div>
          <div style="font-size: 0.72rem; color: #fda4af;">Strength • Honor • Discipline</div>
        </div>
        <span class="pass-tier-badge">${prog.name}</span>
      </div>

      <div class="pass-qr-box">
        <img src="${qrDataUrl}" alt="Pass QR" class="pass-qr-img">
      </div>

      <div class="pass-code-tag">${s.passCode}</div>

      <div class="pass-meta-grid">
        <div>
          <div class="pass-meta-label">Student</div>
          <div class="pass-meta-val">${s.fullName}</div>
        </div>
        <div>
          <div class="pass-meta-label">Discipline</div>
          <div class="pass-meta-val">${disc.name}</div>
        </div>
        <div>
          <div class="pass-meta-label">Gi / Attire Size</div>
          <div class="pass-meta-val">${s.uniformSize || 'Standard'}</div>
        </div>
        <div>
          <div class="pass-meta-label">Total Check-Ins</div>
          <div class="pass-meta-val">${s.checkInCount || 0} Visits</div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center; gap: 0.75rem; margin-top: 1.5rem;">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Print Dojo Pass</button>
      <button class="btn btn-secondary" onclick="closeModal('pass-modal')">Close</button>
    </div>
  `;

  openModal('pass-modal');
}

// Render Email Logs
function renderEmailLogs() {
  const tbody = document.getElementById('emails-tbody');
  if (!tbody) return;

  if (state.emails.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 2rem;">No emails dispatched yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.emails.map(m => `
    <tr>
      <td style="font-size: 0.8rem; white-space: nowrap; color: #94a3b8;">
        ${new Date(m.sentAt).toLocaleString()}
      </td>
      <td>
        <div style="font-weight: 800; color: #fff;">${m.recipientName}</div>
        <div style="font-size: 0.75rem; color: #94a3b8;">${m.to}</div>
      </td>
      <td style="font-size: 0.85rem; font-weight: 700; color: #fecdd3;">
        ${m.subject}
      </td>
      <td>
        <code style="font-weight: 800; color: #f43f5e; background: rgba(190, 18, 60, 0.2); padding: 2px 6px; border-radius: 4px;">
          ${m.passCode || 'APX'}
        </code>
      </td>
      <td>
        <span class="badge badge-checked_in">✓ Delivered</span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="previewEmail('${m.id}')">👁️ View Email</button>
      </td>
    </tr>
  `).join('');
}

function previewEmail(emailId) {
  const m = state.emails.find(e => e.id === emailId);
  if (!m) return;

  document.getElementById('email-modal-subject').textContent = m.subject;
  document.getElementById('email-modal-meta').innerHTML = `
    <strong>To:</strong> ${m.recipientName} &lt;${m.to}&gt; &bull; 
    <strong>Sent:</strong> ${new Date(m.sentAt).toLocaleString()} &bull; 
    <strong>Status:</strong> Delivered (Instant Notification)
  `;

  const iframe = document.getElementById('email-preview-iframe');
  iframe.srcdoc = m.html;

  openModal('email-preview-modal');
}

// Export CSV
function exportCsvData() {
  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Discipline', 'Program', 'Pass Code', 'Status', 'Visits', 'Created At'];
  const rows = state.signups.map(s => [
    s.id,
    `"${s.fullName}"`,
    s.email,
    s.phone,
    s.discipline,
    s.program,
    s.passCode,
    s.status,
    s.checkInCount || 0,
    s.createdAt
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `apex_dojo_roster_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Roster exported to CSV successfully.', 'success');
}

// URL Params
function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const disc = params.get('discipline');
  const prog = params.get('program');
  const promo = params.get('promo');

  if (disc && state.config.disciplines.some(d => d.id === disc)) {
    selectDiscipline(disc);
  }
  if (prog && state.config.programs.some(p => p.id === prog)) {
    selectProgram(prog);
  }
  if (promo) {
    showToast(`Promo Applied: ${promo}`, 'success');
  }
}

// Modal Helpers
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// Toast
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '🥋' : (type === 'error' ? '⚠️' : 'ℹ️')}</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
