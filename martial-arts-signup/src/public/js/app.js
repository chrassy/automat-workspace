// State store
let appConfig = {
  school: {},
  disciplines: [],
  programs: []
};
let currentStep = 1;
let currentPosterData = null;
let searchTimeout = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  await fetchConfig();
  renderDisciplinesList();
  renderProgramsList();
  setupGoalChips();
  initUrlParams();
  updatePosterPreview();
  loadStats();
});

// Fetch system config
async function fetchConfig() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    appConfig = data;
  } catch (err) {
    console.error('Failed to load config:', err);
  }
}

// Check URL params for pre-selected discipline/program/campaign
function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const disciplineParam = params.get('discipline');
  const programParam = params.get('program');
  const promoParam = params.get('promo');

  if (disciplineParam) {
    selectDiscipline(disciplineParam);
  }
  if (programParam) {
    selectProgram(programParam);
  }
  if (promoParam) {
    showToast(`Promo applied: ${promoParam}`, 'success');
  }
}

// Switch between navigation tabs
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.toggle('active', section.id === `tab-${tabId}`);
  });

  if (tabId === 'admin') {
    loadRegistrationsTable();
    loadStats();
  } else if (tabId === 'emails') {
    loadEmailLogs();
  } else if (tabId === 'qr') {
    updatePosterPreview();
  }
}

// Render visual discipline choices
function renderDisciplinesList() {
  const container = document.getElementById('discipline-options');
  if (!container || !appConfig.disciplines) return;

  const currentSelected = document.getElementById('selected-discipline').value;

  container.innerHTML = appConfig.disciplines.map(d => `
    <div class="discipline-card ${d.id === currentSelected ? 'selected' : ''}" 
         onclick="selectDiscipline('${d.id}')" id="disc-card-${d.id}">
      <div class="discipline-icon">${d.icon}</div>
      <div class="discipline-name">${d.name}</div>
      <div class="discipline-category">${d.category}</div>
      <div class="discipline-desc">${d.description}</div>
    </div>
  `).join('');
}

// Select a discipline
function selectDiscipline(id) {
  const input = document.getElementById('selected-discipline');
  if (input) input.value = id;

  document.querySelectorAll('.discipline-card').forEach(card => {
    card.classList.remove('selected');
  });
  const activeCard = document.getElementById(`disc-card-${id}`);
  if (activeCard) activeCard.classList.add('selected');
}

// Render membership programs
function renderProgramsList() {
  const container = document.getElementById('program-options');
  if (!container || !appConfig.programs) return;

  const currentSelected = document.getElementById('selected-program').value;

  container.innerHTML = appConfig.programs.map(p => `
    <div class="program-card ${p.id === currentSelected ? 'selected' : ''}" 
         onclick="selectProgram('${p.id}')" id="prog-card-${p.id}">
      <div class="program-header">
        <span class="program-title">${p.name}</span>
        <span class="program-price">${p.price === 0 ? 'FREE' : `$${p.price}`}</span>
      </div>
      <div class="program-desc">${p.description}</div>
    </div>
  `).join('');
}

// Select a program
function selectProgram(id) {
  const input = document.getElementById('selected-program');
  if (input) input.value = id;

  document.querySelectorAll('.program-card').forEach(card => {
    card.classList.remove('selected');
  });
  const activeCard = document.getElementById(`prog-card-${id}`);
  if (activeCard) activeCard.classList.add('selected');
}

// Interactive Goal Chips
function setupGoalChips() {
  document.querySelectorAll('.goal-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const checkbox = chip.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        chip.classList.toggle('active', checkbox.checked);
      }
    });
  });
}

// Step navigation
function goToStep(stepNumber) {
  currentStep = stepNumber;

  // Update step indicators
  document.querySelectorAll('.step-item').forEach(item => {
    const s = parseInt(item.dataset.step, 10);
    item.classList.toggle('active', s === currentStep);
    item.classList.toggle('completed', s < currentStep);
  });

  // Update form steps
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.toggle('active', step.id === `step-${currentStep}`);
  });

  // Scroll to top of form smoothly
  const stepper = document.getElementById('signup-stepper');
  if (stepper) {
    stepper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Step 2 validation before proceeding to Step 3
function validateAndGoToStep3() {
  const name = document.getElementById('full-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || name.length < 2) {
    showToast('Please enter your full name.', 'error');
    document.getElementById('full-name').focus();
    return;
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    document.getElementById('email').focus();
    return;
  }
  if (!phone || phone.length < 7) {
    showToast('Please enter a valid phone number.', 'error');
    document.getElementById('phone').focus();
    return;
  }

  goToStep(3);
}

// Handle Form Submission
async function handleSignupSubmit(event) {
  event.preventDefault();

  const waiverChecked = document.getElementById('waiver-agree').checked;
  if (!waiverChecked) {
    showToast('You must agree to the safety waiver before completing registration.', 'error');
    return;
  }

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Processing Registration...';

  // Gather form data
  const selectedGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(cb => cb.value);

  const payload = {
    fullName: document.getElementById('full-name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    age: document.getElementById('age').value || null,
    discipline: document.getElementById('selected-discipline').value,
    program: document.getElementById('selected-program').value,
    experienceLevel: document.getElementById('experience-level').value,
    uniformSize: document.getElementById('uniform-size').value,
    emergencyContactName: document.getElementById('emergency-name').value.trim(),
    emergencyContactPhone: document.getElementById('emergency-phone').value.trim(),
    goals: selectedGoals,
    preferredSchedule: document.getElementById('preferred-schedule').value,
    medicalNotes: document.getElementById('medical-notes').value.trim(),
    waiverAccepted: true
  };

  try {
    const res = await fetch('/api/signups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || (data.details && data.details.join(', ')) || 'Registration failed');
    }

    // Success: Populate Step 5 pass
    const signup = data.data.signup;
    document.getElementById('success-email').textContent = signup.email;
    document.getElementById('pass-student-name').textContent = signup.fullName;
    document.getElementById('pass-discipline-badge').textContent = `🥋 ${signup.discipline.toUpperCase()} • ${signup.program.toUpperCase()}`;
    document.getElementById('pass-code-text').textContent = signup.passCode;
    document.getElementById('pass-qr-image').src = data.data.passQR;

    showToast('Registration complete! Check your email for your welcome pass.', 'success');
    goToStep(5);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🥋 Complete Registration & Get QR Pass';
  }
}

// Reset form for next registration
function resetSignupForm() {
  document.getElementById('signup-form').reset();
  selectDiscipline('bjj');
  selectProgram('free-trial');
  goToStep(1);
}

// ==============================================
// TAB 2: QR POSTER & FLYER GENERATOR
// ==============================================

async function updatePosterPreview() {
  const discSelect = document.getElementById('poster-discipline-select');
  const progSelect = document.getElementById('poster-program-select');
  const promoInput = document.getElementById('poster-promo-input');

  const discipline = discSelect ? discSelect.value : 'all';
  const program = progSelect ? progSelect.value : 'free-trial';
  const promoCode = promoInput ? promoInput.value.trim() : '';

  try {
    const url = `/api/qr/poster?discipline=${encodeURIComponent(discipline)}&program=${encodeURIComponent(program)}&promoCode=${encodeURIComponent(promoCode)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      currentPosterData = data.data;
      document.getElementById('poster-qr-image').src = data.data.qrDataUrl;
      document.getElementById('poster-url-display').textContent = data.data.targetUrl;

      // Update poster text dynamically
      if (discipline !== 'all' && data.data.discipline) {
        document.getElementById('poster-headline-text').textContent = `START TRAINING ${data.data.discipline.name.toUpperCase()}`;
        document.getElementById('poster-sub-text').textContent = `${data.data.discipline.category} • Claim your trial pass today!`;
      } else {
        document.getElementById('poster-headline-text').textContent = 'SCAN TO CLAIM YOUR FREE MARTIAL ARTS PASS';
        document.getElementById('poster-sub-text').textContent = 'Join BJJ, Muay Thai, Karate & MMA. All experience levels welcome!';
      }

      if (promoCode) {
        document.getElementById('poster-badge-text').textContent = `🔥 SPECIAL PROMO: ${promoCode}`;
      } else {
        document.getElementById('poster-badge-text').textContent = `🥋 ${appConfig.school.name || 'Apex Martial Arts'}`;
      }
    }
  } catch (err) {
    console.error('Failed to update poster:', err);
  }
}

function togglePosterTheme() {
  const theme = document.getElementById('poster-style-select').value;
  const sheet = document.getElementById('poster-sheet-element');
  if (theme === 'light') {
    sheet.classList.remove('poster-sheet-dark');
  } else {
    sheet.classList.add('poster-sheet-dark');
  }
}

function copyPosterUrl() {
  if (currentPosterData && currentPosterData.targetUrl) {
    navigator.clipboard.writeText(currentPosterData.targetUrl).then(() => {
      showToast('Registration scan URL copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Copy failed, please select URL manually.', 'error');
    });
  }
}

// ==============================================
// TAB 3: FRONT DESK SCANNER & CHECK-IN
// ==============================================

async function handleCheckInSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('checkin-code-input');
  const code = input.value.trim();
  if (!code) return;

  const resultContainer = document.getElementById('checkin-result');
  resultContainer.style.display = 'block';
  resultContainer.innerHTML = '<div style="color: #64748b; text-align: center;">Checking database...</div>';

  try {
    const res = await fetch('/api/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      resultContainer.innerHTML = `
        <div style="background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; padding: 1rem; color: #991b1b;">
          <strong>❌ Check-In Error:</strong> ${data.error || 'Student not found.'}
        </div>
      `;
      showToast(data.error || 'Check-in failed', 'error');
      return;
    }

    const s = data.student;
    resultContainer.innerHTML = `
      <div style="background: #dcfce7; border: 1px solid #22c55e; border-radius: 8px; padding: 1.25rem; color: #166534;">
        <div style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.25rem;">
          🥋 Check-In Confirmed! Oss!
        </div>
        <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">${s.fullName}</div>
        <div style="font-size: 0.85rem; color: #15803d; margin-top: 0.2rem;">
          Discipline: <strong>${(s.discipline || '').toUpperCase()}</strong> • Total Check-ins: <strong>${s.checkInCount}</strong>
        </div>
        <div style="font-size: 0.75rem; color: #475569; margin-top: 0.4rem;">
          Pass Code: ${s.passCode} &bull; Timestamp: ${new Date().toLocaleTimeString()}
        </div>
      </div>
    `;

    showToast(`Checked in: ${s.fullName}`, 'success');
    input.value = '';
    input.focus();

    // Add to recent check-ins list
    addRecentCheckIn(data.checkIn);
  } catch (err) {
    resultContainer.innerHTML = `
      <div style="background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; padding: 1rem; color: #991b1b;">
        <strong>❌ Error:</strong> ${err.message}
      </div>
    `;
  }
}

function addRecentCheckIn(checkIn) {
  const container = document.getElementById('recent-checkins-list');
  if (!container) return;

  if (container.querySelector('div[style*="text-align: center"]')) {
    container.innerHTML = '';
  }

  const item = document.createElement('div');
  item.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;';
  item.innerHTML = `
    <div>
      <div style="font-weight: 700; color: #0f172a; font-size: 0.9rem;">🥋 ${checkIn.studentName}</div>
      <div style="font-size: 0.75rem; color: #64748b;">${checkIn.passCode} &bull; ${(checkIn.discipline || '').toUpperCase()}</div>
    </div>
    <div style="font-size: 0.75rem; font-weight: 600; color: #16a34a; background: #dcfce7; padding: 0.2rem 0.5rem; border-radius: 4px;">
      ${new Date(checkIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  `;

  container.prepend(item);
}

// ==============================================
// TAB 4: STAFF DASHBOARD & REGISTRATIONS
// ==============================================

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      const stats = data.data;
      document.getElementById('stat-total-signups').textContent = stats.totalSignups;
      document.getElementById('stat-checked-in').textContent = stats.checkedInCount;
      document.getElementById('stat-emails-sent').textContent = stats.totalEmailsSent;

      // Calculate top discipline
      let topDisc = 'BJJ';
      let maxCount = -1;
      for (const [key, count] of Object.entries(stats.byDiscipline || {})) {
        if (count > maxCount) {
          maxCount = count;
          topDisc = key.toUpperCase();
        }
      }
      document.getElementById('stat-top-discipline').textContent = topDisc;
    }
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadRegistrationsTable();
  }, 300);
}

async function loadRegistrationsTable() {
  const search = document.getElementById('filter-search').value;
  const discipline = document.getElementById('filter-discipline').value;
  const status = document.getElementById('filter-status').value;

  const url = `/api/signups?search=${encodeURIComponent(search)}&discipline=${encodeURIComponent(discipline)}&status=${encodeURIComponent(status)}`;
  const tbody = document.getElementById('registrations-tbody');

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success || data.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">
            No student registrations found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.data.map(s => `
      <tr>
        <td>
          <div style="font-weight: 700; color: #0f172a;">${s.fullName}</div>
          <div style="font-size: 0.75rem; color: #64748b;">Age: ${s.age || 'N/A'} &bull; ${s.experienceLevel || 'Beginner'}</div>
        </td>
        <td>
          <div style="font-size: 0.85rem;">✉️ ${s.email}</div>
          <div style="font-size: 0.75rem; color: #64748b;">📞 ${s.phone}</div>
        </td>
        <td>
          <div style="font-weight: 600; text-transform: capitalize;">${s.discipline}</div>
          <div style="font-size: 0.75rem; color: #64748b;">${s.program}</div>
        </td>
        <td>
          <code style="font-weight: 700; color: #be123c; background: #fff1f2; padding: 2px 6px; border-radius: 4px;">
            ${s.passCode}
          </code>
        </td>
        <td>
          <span class="badge badge-${s.status}">${s.status.replace('_', ' ')}</span>
        </td>
        <td>
          <div style="font-weight: 600;">${s.checkInCount || 0} times</div>
          <div style="font-size: 0.7rem; color: #94a3b8;">${s.lastCheckInAt ? new Date(s.lastCheckInAt).toLocaleDateString() : 'Never'}</div>
        </td>
        <td>
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" title="View Pass QR" onclick="viewStudentPass('${s.id}')">
              🎫 Pass
            </button>
            <button class="btn btn-outline btn-sm" title="Resend Welcome Email" onclick="resendWelcomeEmail('${s.id}')">
              ✉️ Resend
            </button>
            <button class="btn btn-sm ${s.status === 'checked_in' ? 'btn-secondary' : 'btn-success'}" 
                    title="Toggle Check-In" 
                    onclick="quickCheckIn('${s.passCode}')">
              ✓ In
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color: #dc2626; text-align: center; padding: 1.5rem;">Failed to load data: ${err.message}</td></tr>`;
  }
}

async function quickCheckIn(passCode) {
  try {
    const res = await fetch('/api/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: passCode })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadRegistrationsTable();
      loadStats();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function resendWelcomeEmail(id) {
  try {
    const res = await fetch(`/api/signups/${id}/resend-email`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadStats();
    } else {
      showToast(data.error || 'Failed to resend email', 'error');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function viewStudentPass(id) {
  try {
    const res = await fetch(`/api/signups/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    const s = data.data;
    const body = document.getElementById('pass-modal-body');
    body.innerHTML = `
      <div class="pass-card-container" style="box-shadow: none; margin: 0 auto;">
        <div class="pass-header">🥋 ${appConfig.school.name || 'Apex Martial Arts'}</div>
        <div style="font-size: 1.35rem; font-weight: 800; color: #0f172a;">${s.fullName}</div>
        <div style="font-size: 0.85rem; font-weight: 700; color: #be123c; margin-bottom: 0.5rem; text-transform: uppercase;">
          ${s.discipline} • ${s.program}
        </div>
        <img src="${s.passQR}" style="width: 200px; height: 200px; margin: 0.5rem auto; display: block; border-radius: 8px; border: 1px solid #fecdd3;" alt="Pass QR">
        <div style="font-size: 0.75rem; color: #64748b;">PASS CODE</div>
        <div class="pass-code-display">${s.passCode}</div>
        <div style="font-size: 0.8rem; color: #475569;">
          Emergency Contact: ${s.emergencyContactName || 'N/A'} (${s.emergencyContactPhone || 'N/A'})
        </div>
      </div>
      <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 0.5rem;">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Print Pass</button>
        <button class="btn btn-secondary" onclick="closeModal('pass-modal')">Close</button>
      </div>
    `;
    openModal('pass-modal');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==============================================
// TAB 5: EMAIL LOGS & HTML PREVIEW
// ==============================================

async function loadEmailLogs() {
  const tbody = document.getElementById('emails-tbody');
  try {
    const res = await fetch('/api/emails');
    const data = await res.json();

    if (!data.success || data.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: #64748b; padding: 2rem;">
            No confirmation emails have been sent yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.data.map(m => `
      <tr>
        <td style="font-size: 0.8rem; white-space: nowrap;">
          ${new Date(m.sentAt).toLocaleString()}
        </td>
        <td>
          <div style="font-weight: 700; color: #0f172a;">${m.recipientName || 'Student'}</div>
          <div style="font-size: 0.75rem; color: #64748b;">${m.to}</div>
        </td>
        <td style="font-size: 0.85rem; font-weight: 600;">
          ${m.subject}
        </td>
        <td>
          <code style="font-weight: 700; color: #be123c; background: #fff1f2; padding: 2px 6px; border-radius: 4px;">
            ${m.passCode || 'N/A'}
          </code>
        </td>
        <td>
          <span style="font-size: 0.75rem; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 0.2rem 0.5rem; border-radius: 9999px;">
            ✓ ${m.status}
          </span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="previewEmail('${m.id}')">
            👁️ View HTML
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: #dc2626; text-align: center;">Failed to load emails: ${err.message}</td></tr>`;
  }
}

async function previewEmail(emailId) {
  try {
    const res = await fetch(`/api/emails/${emailId}`);
    const data = await res.json();
    if (!data.success) throw new Error('Email not found');

    const m = data.data;
    document.getElementById('email-modal-subject').textContent = m.subject;
    document.getElementById('email-modal-meta').innerHTML = `
      <strong>To:</strong> ${m.recipientName} &lt;${m.to}&gt; &bull; 
      <strong>Sent:</strong> ${new Date(m.sentAt).toLocaleString()} &bull; 
      <strong>Mode:</strong> ${m.mockMode ? 'Preview / Mock Engine' : 'SMTP Server'}
    `;

    const iframe = document.getElementById('email-preview-iframe');
    iframe.srcdoc = m.html;

    openModal('email-preview-modal');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
