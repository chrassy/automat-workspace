'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. ROI Calculator Logic ---
  const sliderMembers = document.getElementById('sliderMembers');
  const sliderFee = document.getElementById('sliderFee');
  const sliderChurn = document.getElementById('sliderChurn');
  const sliderFailed = document.getElementById('sliderFailed');

  const valMembers = document.getElementById('valMembers');
  const valFee = document.getElementById('valFee');
  const valChurn = document.getElementById('valChurn');
  const valFailed = document.getElementById('valFailed');

  const calcTotalGain = document.getElementById('calcTotalGain');
  const calcRoiMultiplier = document.getElementById('calcRoiMultiplier');
  const calcRetentionGain = document.getElementById('calcRetentionGain');
  const calcMembersSaved = document.getElementById('calcMembersSaved');
  const calcDunningGain = document.getElementById('calcDunningGain');
  const calcAdminGain = document.getElementById('calcAdminGain');
  const calcAdminHours = document.getElementById('calcAdminHours');
  const calcPlanName = document.getElementById('calcPlanName');
  const calcPlanCost = document.getElementById('calcPlanCost');

  function updateRoiCalculations() {
    const members = parseInt(sliderMembers.value, 10);
    const fee = parseFloat(sliderFee.value);
    const churn = parseFloat(sliderChurn.value);
    const failed = parseFloat(sliderFailed.value);

    valMembers.textContent = members.toLocaleString();
    valFee.textContent = `$${fee}`;
    valChurn.textContent = `${churn}%`;
    valFailed.textContent = `${failed}%`;

    const mrr = members * fee;
    const monthlyChurned = Math.round(members * (churn / 100));
    const annualChurned = monthlyChurned * 12;

    const membersSaved = Math.round(annualChurned * 0.36);
    const retentionGain = Math.round(membersSaved * fee * 6);

    const monthlyFailedAmt = mrr * (failed / 100);
    const dunningGain = Math.round(monthlyFailedAmt * 0.74 * 12);

    const adminHoursWeekly = Math.min(30, Math.max(4, Math.round(members / 25)));
    const adminGain = adminHoursWeekly * 50 * 22;

    const totalGain = retentionGain + dunningGain + adminGain;

    let plan = 'Starter Plan';
    let planMonthly = 99;
    if (members > 600) {
      plan = 'Scale / Multi-Club';
      planMonthly = 349;
    } else if (members > 150) {
      plan = 'Growth Plan';
      planMonthly = 199;
    }

    const annualSoftwareCost = planMonthly * 12;
    const roiMult = (totalGain / annualSoftwareCost).toFixed(1);

    calcTotalGain.textContent = `$${totalGain.toLocaleString()}`;
    calcRoiMultiplier.textContent = `${roiMult}x Annual Software ROI`;
    calcRetentionGain.textContent = `$${retentionGain.toLocaleString()}`;
    calcMembersSaved.textContent = `~${membersSaved} members retained longer`;
    calcDunningGain.textContent = `$${dunningGain.toLocaleString()}`;
    calcAdminGain.textContent = `$${adminGain.toLocaleString()}`;
    calcAdminHours.textContent = `${adminHoursWeekly} hrs/week saved on billing & check-in`;
    calcPlanName.textContent = plan;
    calcPlanCost.textContent = `$${planMonthly}/month ($${annualSoftwareCost.toLocaleString()}/yr)`;
  }

  [sliderMembers, sliderFee, sliderChurn, sliderFailed].forEach(slider => {
    if (slider) slider.addEventListener('input', updateRoiCalculations);
  });
  updateRoiCalculations();

  // --- 2. Interactive Sandbox Logic ---
  const tabButtons = document.querySelectorAll('.sandbox-tab-btn');
  const panels = document.querySelectorAll('.sandbox-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Load Member Roster for Simulation
  const memberRosterContainer = document.getElementById('memberRosterContainer');
  const manualBarcodeInput = document.getElementById('manualBarcodeInput');
  const btnRunManualScan = document.getElementById('btnRunManualScan');
  const scanResultOutput = document.getElementById('scanResultOutput');
  const recentAccessLogs = document.getElementById('recentAccessLogs');

  async function loadSimulationMembers() {
    try {
      const res = await fetch('/api/simulation/members');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        renderRoster(json.data);
      }
    } catch (err) {
      // Fallback local members if offline
      renderRoster([
        { id: 'MEM-101', name: 'Marcus Vance', barcode: 'BAR-1001', membership: 'Unlimited All-Access', status: 'active' },
        { id: 'MEM-102', name: 'Sarah Chen', barcode: 'BAR-1002', membership: 'Standard Gym & Locker', status: 'payment_past_due' },
        { id: 'MEM-103', name: 'David Miller', barcode: 'BAR-1003', membership: 'CrossFit & Open Floor', status: 'waiver_required' },
        { id: 'MEM-104', name: 'Elena Rostova', barcode: 'BAR-1004', membership: 'VIP Executive & Recovery', status: 'active' },
        { id: 'MEM-105', name: 'Jordan Hayes', barcode: 'BAR-1005', membership: 'Monthly Flex', status: 'frozen' }
      ]);
    }
  }

  function renderRoster(members) {
    if (!memberRosterContainer) return;
    memberRosterContainer.innerHTML = '';
    members.forEach(member => {
      const card = document.createElement('div');
      card.className = 'member-item-card';

      let statusBadgeClass = 'active';
      let statusLabel = 'ACTIVE';
      if (member.status === 'payment_past_due') {
        statusBadgeClass = 'past-due';
        statusLabel = 'PAST DUE';
      } else if (member.status === 'waiver_required') {
        statusBadgeClass = 'waiver';
        statusLabel = 'WAIVER';
      } else if (member.status === 'frozen') {
        statusBadgeClass = 'frozen';
        statusLabel = 'FROZEN';
      }

      card.innerHTML = `
        <div class="member-card-left">
          <span class="member-card-name">${member.name}</span>
          <span class="member-card-sub">${member.membership} • Barcode: ${member.barcode}</span>
        </div>
        <span class="status-badge-chip ${statusBadgeClass}">${statusLabel}</span>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.member-item-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        if (manualBarcodeInput) manualBarcodeInput.value = member.barcode;
        triggerGateScan(member.barcode);
      });

      memberRosterContainer.appendChild(card);
    });
  }

  async function triggerGateScan(barcode) {
    try {
      const res = await fetch('/api/simulation/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcodeOrId: barcode })
      });
      const data = await res.json();
      renderScanResult(data);
    } catch (err) {
      renderScanResult({
        success: false,
        status: 'OFFLINE_FALLBACK',
        message: 'Local hardware check: ' + err.message
      });
    }
  }

  function renderScanResult(data) {
    if (!scanResultOutput) return;

    let cardClass = 'denied';
    let statusText = 'ACCESS DENIED';

    if (data.status === 'GRANTED') {
      cardClass = 'granted';
      statusText = 'ACCESS GRANTED — TURNSTILE UNLOCKED';
    } else if (data.status === 'PAST_DUE') {
      cardClass = 'denied';
      statusText = 'BILLING PAST DUE — SOFT LOCK';
    } else if (data.status === 'WAIVER_REQUIRED') {
      cardClass = 'action';
      statusText = 'ACTION REQUIRED — DIGITAL WAIVER';
    } else if (data.status === 'FROZEN') {
      cardClass = 'denied';
      statusText = 'MEMBERSHIP FROZEN';
    }

    scanResultOutput.innerHTML = `
      <div class="scan-result-card ${cardClass}">
        <div class="scan-badge-row">
          <span class="scan-status-big">${statusText}</span>
          <span style="font-size: 0.8rem; font-family: monospace;">LATENCY: 0.18s</span>
        </div>
        <p class="scan-message">${data.message || ''}</p>
        <div class="scan-telemetry-meta">
          Hardware Controller: Relay A (Normally-Closed 12V DC) • NFC/Barcode Verified
        </div>
      </div>
    `;

    // Append to live logs
    if (recentAccessLogs) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const logRow = document.createElement('div');
      logRow.className = 'log-entry';
      const isOk = data.status === 'GRANTED';
      logRow.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="${isOk ? 'log-granted' : 'log-denied'}">${data.status}</span>
        <span>${data.member ? data.member.name : 'Unknown'} (${barcode})</span>
      `;
      recentAccessLogs.insertBefore(logRow, recentAccessLogs.firstChild);
    }
  }

  if (btnRunManualScan && manualBarcodeInput) {
    btnRunManualScan.addEventListener('click', () => {
      const code = manualBarcodeInput.value.trim();
      if (code) triggerGateScan(code);
    });
  }

  // Load Classes
  const classScheduleGrid = document.getElementById('classScheduleGrid');
  const classBookingNotification = document.getElementById('classBookingNotification');

  async function loadClasses() {
    try {
      const res = await fetch('/api/simulation/classes');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        renderClasses(json.data);
      }
    } catch (err) {
      // ignore
    }
  }

  function renderClasses(classes) {
    if (!classScheduleGrid) return;
    classScheduleGrid.innerHTML = '';
    classes.forEach(c => {
      const isFull = c.enrolled >= c.capacity;
      const card = document.createElement('div');
      card.className = 'class-card';
      const pct = Math.min(100, Math.round((c.enrolled / c.capacity) * 100));

      card.innerHTML = `
        <div>
          <div class="class-title">${c.title}</div>
          <div class="class-meta">⏰ ${c.time} • 👤 ${c.instructor} • 📍 ${c.room}</div>
          <div class="class-capacity-bar-wrap">
            <div class="class-capacity-labels">
              <span>Capacity</span>
              <span>${c.enrolled} / ${c.capacity} Booked ${c.waitlist > 0 ? `(${c.waitlist} on Waitlist)` : ''}</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width: ${pct}%; background: ${isFull ? 'var(--accent-warning)' : 'var(--accent-lime)'}"></div>
            </div>
          </div>
        </div>
        <button class="btn-secondary btn-block btn-book-class" data-id="${c.id}">
          ${isFull ? 'Join Waitlist (Position #' + (c.waitlist + 1) + ')' : '⚡ Book Member Spot'}
        </button>
      `;

      card.querySelector('.btn-book-class').addEventListener('click', async () => {
        try {
          const res = await fetch('/api/simulation/book-class', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId: c.id, memberName: 'Demo Gym Owner' })
          });
          const result = await res.json();
          if (result.success && classBookingNotification) {
            classBookingNotification.textContent = result.message;
            classBookingNotification.classList.remove('hidden');
            loadClasses(); // Refresh counts
            setTimeout(() => {
              classBookingNotification.classList.add('hidden');
            }, 4500);
          }
        } catch (e) {
          // ignore
        }
      });

      classScheduleGrid.appendChild(card);
    });
  }

  loadSimulationMembers();
  loadClasses();

  // --- 3. Facility Type Pills ---
  const facilityData = {
    boutique: {
      title: 'For Boutique Studios (Spin, Reformer Pilates, Yoga & HIIT)',
      bullets: [
        'Interactive spot-reservation floor plans (pick bike #14 or reformer #4 directly from app).',
        'Late-cancel & no-show penalty automation with customizable grace periods.',
        'Dynamic class credit packs, punch cards, and recurring membership auto-renews.',
        'Trainer payroll splits based on per-head attendance tiers.'
      ],
      metric: '98.2% Class Utilization Rate'
    },
    crossfit: {
      title: 'For Strength, CrossFit & Functional Fitness Boxes',
      bullets: [
        'Integrated WOD programming and athlete personal record (PR) tracking.',
        'Drop-in visitor checkout with automatic electronic liability waiver kiosk.',
        'Open Gym 24/7 keycard access for off-peak strength sessions.',
        'Seamless leaderboard and community announcements in member app.'
      ],
      metric: 'Zero Spreadsheet Chaos at Month-End'
    },
    access247: {
      title: 'For 24/7 Keycard Gyms & Health Clubs',
      bullets: [
        'Anti-tailgating AI camera alerts when non-members tailgate behind paid members.',
        'Direct relay integration with turnstiles, magnetic locks, and glass sliding gates.',
        'Remote front-door unlock from manager smartphone in emergencies.',
        'Automated midnight dunning sweep for cards expiring this month.'
      ],
      metric: '100% Unattended Staff Security'
    },
    multiclub: {
      title: 'For Multi-Location Chains & Regional Franchises',
      bullets: [
        'Universal member roaming across all club locations with unified billing.',
        'Consolidated executive dashboard with location-by-location revenue and churn breakdown.',
        'Centralized staff permissions and franchise royalty accounting.',
        'Enterprise Single Sign-On (SSO) and REST API webhooks.'
      ],
      metric: 'Scale to 50+ Gyms on 1 Database'
    }
  };

  const facilityPills = document.querySelectorAll('.facility-pill');
  const facilityContentCard = document.getElementById('facilityContentCard');

  function renderFacilityCard(type) {
    if (!facilityContentCard) return;
    const item = facilityData[type] || facilityData.boutique;
    facilityContentCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
        <h3 style="font-size: 1.45rem;">${item.title}</h3>
        <span class="badge-pill">${item.metric}</span>
      </div>
      <ul class="feature-bullets" style="gap: 0.95rem; font-size: 1rem;">
        ${item.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
      <div style="margin-top: 2rem;">
        <button class="btn-primary open-demo-modal-btn" data-cta="facility-tab-${type}">
          See Demo for ${item.title.split('(')[0].replace('For ', '')}
        </button>
      </div>
    `;

    attachModalOpeners();
  }

  facilityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      facilityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderFacilityCard(pill.getAttribute('data-type'));
    });
  });
  renderFacilityCard('boutique');

  // --- 4. Competitor Migration Logic ---
  const compSelector = document.getElementById('compSelector');
  const migrationDetailsOutput = document.getElementById('migrationDetailsOutput');

  async function updateMigrationView() {
    if (!compSelector || !migrationDetailsOutput) return;
    const competitor = compSelector.value;
    try {
      const res = await fetch(`/api/migration-estimate?competitor=${competitor}&memberCount=250`);
      const json = await res.json();
      if (json.success) {
        const d = json.data;
        migrationDetailsOutput.innerHTML = `
          <div class="migration-metric-box">
            <div class="metric-label">Estimated Current Software Cost</div>
            <div class="metric-val" style="color: #ef4444;">$${d.estimatedCurrentSoftwareCostAnnual.toLocaleString()}/yr</div>
          </div>
          <div class="migration-metric-box">
            <div class="metric-label">Migration Complete In</div>
            <div class="metric-val">${d.migrationTimelineHours} Hours</div>
          </div>
          <div class="migration-metric-box">
            <div class="metric-label">Annual Savings with Pulse</div>
            <div class="metric-val">$${d.estimatedAnnualSavings.toLocaleString()}/yr</div>
          </div>
        `;
      }
    } catch (e) {
      // ignore
    }
  }

  if (compSelector) {
    compSelector.addEventListener('change', updateMigrationView);
    updateMigrationView();
  }

  // --- 5. Billing Cycle Pricing Switcher ---
  const billingCycleToggle = document.getElementById('billingCycleToggle');
  const starterPrice = document.getElementById('starterPrice');
  const starterBilled = document.getElementById('starterBilled');
  const growthPrice = document.getElementById('growthPrice');
  const growthBilled = document.getElementById('growthBilled');
  const scalePrice = document.getElementById('scalePrice');
  const scaleBilled = document.getElementById('scaleBilled');

  function updatePricing() {
    const isAnnual = billingCycleToggle ? billingCycleToggle.checked : true;
    if (isAnnual) {
      starterPrice.textContent = '79';
      starterBilled.textContent = 'Billed annually ($948/yr)';
      growthPrice.textContent = '159';
      growthBilled.textContent = 'Billed annually ($1,908/yr)';
      scalePrice.textContent = '279';
      scaleBilled.textContent = 'Billed annually ($3,348/yr)';
    } else {
      starterPrice.textContent = '99';
      starterBilled.textContent = 'Billed month-to-month ($99/mo)';
      growthPrice.textContent = '199';
      growthBilled.textContent = 'Billed month-to-month ($199/mo)';
      scalePrice.textContent = '349';
      scaleBilled.textContent = 'Billed month-to-month ($349/mo)';
    }
  }

  if (billingCycleToggle) {
    billingCycleToggle.addEventListener('change', updatePricing);
  }

  // --- 6. Modal & Lead Forms ---
  const demoModal = document.getElementById('demoModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseDoneBtn = document.getElementById('modalCloseDoneBtn');
  const modalLeadForm = document.getElementById('modalLeadForm');
  const modalSuccessView = document.getElementById('modalSuccessView');
  const modalRefId = document.getElementById('modalRefId');

  function attachModalOpeners() {
    document.querySelectorAll('.open-demo-modal-btn').forEach(btn => {
      btn.onclick = () => {
        if (demoModal) {
          demoModal.classList.remove('hidden');
          if (modalSuccessView) modalSuccessView.classList.add('hidden');
          if (modalLeadForm) modalLeadForm.classList.remove('hidden');
        }
      };
    });
  }
  attachModalOpeners();

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (demoModal) demoModal.classList.add('hidden');
    });
  }
  if (modalCloseDoneBtn) {
    modalCloseDoneBtn.addEventListener('click', () => {
      if (demoModal) demoModal.classList.add('hidden');
    });
  }
  if (demoModal) {
    demoModal.addEventListener('click', e => {
      if (e.target === demoModal) demoModal.classList.add('hidden');
    });
  }

  // Submit Modal Lead Form
  if (modalLeadForm) {
    modalLeadForm.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        gymName: document.getElementById('modalGymName').value.trim(),
        ownerName: document.getElementById('modalOwnerName').value.trim(),
        email: document.getElementById('modalEmail').value.trim(),
        phone: document.getElementById('modalPhone').value.trim(),
        facilityType: document.getElementById('modalFacilityType').value,
        memberCount: parseInt(document.getElementById('modalMemberCount').value, 10) || 150,
        currentSoftware: document.getElementById('modalSoftware').value
      };

      if (!payload.gymName || !payload.ownerName || !payload.email) {
        alert('Please fill out all required fields.');
        return;
      }

      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          modalLeadForm.classList.add('hidden');
          modalSuccessView.classList.remove('hidden');
          if (modalRefId) modalRefId.textContent = `Confirmation: #${data.data.id}`;
        } else {
          alert('Submission error: ' + (data.error || 'Please check your inputs'));
        }
      } catch (err) {
        alert('Network error submitting demo request. Please try again.');
      }
    });
  }

  // Submit Inline Lead Form
  const inlineLeadForm = document.getElementById('inlineLeadForm');
  const inlineFormSuccess = document.getElementById('inlineFormSuccess');
  const inlineRefId = document.getElementById('inlineRefId');

  if (inlineLeadForm) {
    inlineLeadForm.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        gymName: document.getElementById('inlineGymName').value.trim(),
        ownerName: document.getElementById('inlineOwnerName').value.trim(),
        email: document.getElementById('inlineEmail').value.trim(),
        phone: document.getElementById('inlinePhone').value.trim(),
        facilityType: document.getElementById('inlineFacilityType').value,
        memberCount: parseInt(document.getElementById('inlineMemberCount').value, 10) || 150,
        currentSoftware: document.getElementById('inlineCurrentSoftware').value
      };

      if (!payload.gymName || !payload.ownerName || !payload.email) {
        alert('Please fill out all required fields.');
        return;
      }

      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          inlineLeadForm.classList.add('hidden');
          if (inlineFormSuccess) {
            inlineFormSuccess.classList.remove('hidden');
            if (inlineRefId) inlineRefId.textContent = `#${data.data.id}`;
          }
        } else {
          alert('Submission error: ' + (data.error || 'Please check your inputs'));
        }
      } catch (err) {
        alert('Network error submitting request. Please try again.');
      }
    });
  }
});
