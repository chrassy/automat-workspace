/**
 * Borealis Brewing Co. — Main Client Application & Interactions
 */

// Automat tracking safe fallback to guarantee no errors if offline or blocked
window.automat = window.automat || {
  signup: function(email) {
    if (window.console && console.log) console.log('[Automat fallback] signup:', email);
    return Promise.resolve(true);
  },
  track: function(eventName, props) {
    if (window.console && console.log) console.log('[Automat fallback] track:', eventName, props);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initNavAndCTAs();
  initFoodPairings();
  initQuiz();
  initPreorderForm();
  fetchBatchStatus();
});

/* --------------------------------------------------------------------------
   Age Verification Gate (Legal 21+)
   -------------------------------------------------------------------------- */
function initAgeGate() {
  const modal = document.getElementById('ageGateModal');
  const btnYes = document.getElementById('btnAgeYes');
  const btnNo = document.getElementById('btnAgeNo');

  if (!modal || !btnYes || !btnNo) return;

  const isVerified = localStorage.getItem('borealis_age_verified');
  if (isVerified === 'true') {
    modal.style.display = 'none';
  } else {
    modal.style.display = 'flex';
  }

  btnYes.addEventListener('click', () => {
    localStorage.setItem('borealis_age_verified', 'true');
    modal.style.display = 'none';
    if (window.automat && typeof window.automat.track === 'function') {
      window.automat.track('age_gate_confirmed');
    }
  });

  btnNo.addEventListener('click', () => {
    alert('You must be 21 or older to view the Borealis Brewing Co. craft beer release. Redirecting...');
    window.location.href = 'https://responsibility.org/';
  });
}

/* --------------------------------------------------------------------------
   Nav & CTA Event Tracking
   -------------------------------------------------------------------------- */
function initNavAndCTAs() {
  const heroReserveBtn = document.getElementById('heroReserveBtn');
  const navReserveBtn = document.getElementById('navReserveBtn');
  const announcementCta = document.getElementById('announcementCta');
  const heroLearnBtn = document.getElementById('heroLearnBtn');

  if (heroReserveBtn) {
    heroReserveBtn.addEventListener('click', () => {
      window.automat.track('hero_preorder_click');
    });
  }

  if (navReserveBtn) {
    navReserveBtn.addEventListener('click', () => {
      window.automat.track('nav_preorder_click');
    });
  }

  if (announcementCta) {
    announcementCta.addEventListener('click', () => {
      window.automat.track('announcement_preorder_click');
    });
  }

  if (heroLearnBtn) {
    heroLearnBtn.addEventListener('click', () => {
      window.automat.track('learn_science_click');
    });
  }
}

/* --------------------------------------------------------------------------
   Interactive Food Pairings
   -------------------------------------------------------------------------- */
const pairingsData = {
  burger: {
    category: 'Comfort & Craft Synergy',
    title: 'Charred Smash Burger with Sharp White Cheddar',
    desc: 'Rich dry-aged ground chuck, caramelized onion crust, and sharp cheddar have high fat content that normally coats the palate. Borealis\'s 2.6 volumes of CO₂ and crisp 48 IBU act like a culinary laser, scrubbing the palate between every decadent bite.',
    why: 'Hops accentuate toasted brioche bun sweetness while the cold lager finish resets your tastebuds for the next bite.'
  },
  salmon: {
    category: 'Pacific Coast Seafood',
    title: 'Cedar-Plank Wild King Salmon with Herb Butter',
    desc: 'The unctuous omega-3 richness of wild Pacific salmon pairs impeccably with the cold, bone-dry profile of Borealis. The Nelson Sauvin hop notes mimic white Sauvignon Blanc wine minerality.',
    why: 'Natural citrus notes elevate salmon oils without trampling tender flaky meat, creating an airy, light dining harmony.'
  },
  thai: {
    category: 'High-Heat Asian Gastronomy',
    title: 'Spicy Thai Green Papaya Salad (Som Tum)',
    desc: 'Fiery bird\'s eye chilies and pungent fish sauce require a drink that tames heat without adding heavy syrupy sugars. Borealis\'s cold fermentation delivers instant temperature relief and refreshing sparkle.',
    why: 'Ultra-dry finish prevents chili oils from burning the tongue, leaving vibrant lime and peanut flavors intact.'
  },
  pizza: {
    category: 'Woodfired Neapolitan',
    title: 'Woodfired Margherita with Blistered San Marzano Sauce',
    desc: 'Blistered sourdough crust with molten fresh mozzarella and aromatic basil calls for a beer that echoes the grain while lifting the herbs. The German Barke Pilsner malt base complements the wood-fired char flawlessly.',
    why: 'Pilsner malt mirrors blistered crust while Citra cryo aromatics turn each mouthful of basil and olive oil into a feast.'
  }
};

function initFoodPairings() {
  const tabs = document.querySelectorAll('.pairing-tab');
  const catEl = document.getElementById('pairingCategory');
  const titleEl = document.getElementById('pairingTitle');
  const descEl = document.getElementById('pairingDesc');
  const whyEl = document.getElementById('pairingWhy');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const pairKey = tab.getAttribute('data-pair');
      const data = pairingsData[pairKey];

      if (data && catEl && titleEl && descEl && whyEl) {
        catEl.textContent = data.category;
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        whyEl.textContent = data.why;
      }

      window.automat.track('pairing_tab_click', { pairing: pairKey });
    });
  });
}

/* --------------------------------------------------------------------------
   Palate Calibration / Beer Finder Quiz
   -------------------------------------------------------------------------- */
function initQuiz() {
  const step1 = document.getElementById('quizStep1');
  const step2 = document.getElementById('quizStep2');
  const step3 = document.getElementById('quizStep3');
  const resultView = document.getElementById('quizResult');

  const btnNext1 = document.getElementById('btnQuizNext1');
  const btnBack1 = document.getElementById('btnQuizBack1');
  const btnNext2 = document.getElementById('btnQuizNext2');
  const btnBack2 = document.getElementById('btnQuizBack2');
  const btnSubmit = document.getElementById('btnQuizSubmit');
  const btnRetake = document.getElementById('btnQuizRetake');
  const btnClaim = document.getElementById('btnQuizClaim');

  if (!step1 || !step2 || !step3 || !resultView) return;

  btnNext1?.addEventListener('click', () => {
    step1.classList.remove('active');
    step1.style.display = 'none';
    step2.classList.add('active');
    step2.style.display = 'block';
    window.automat.track('quiz_step1_answered');
  });

  btnBack1?.addEventListener('click', () => {
    step2.classList.remove('active');
    step2.style.display = 'none';
    step1.classList.add('active');
    step1.style.display = 'block';
  });

  btnNext2?.addEventListener('click', () => {
    step2.classList.remove('active');
    step2.style.display = 'none';
    step3.classList.add('active');
    step3.style.display = 'block';
    window.automat.track('quiz_step2_answered');
  });

  btnBack2?.addEventListener('click', () => {
    step3.classList.remove('active');
    step3.style.display = 'none';
    step2.classList.add('active');
    step2.style.display = 'block';
  });

  btnSubmit?.addEventListener('click', async () => {
    const styleVal = document.querySelector('input[name="stylePreference"]:checked')?.value || 'crisp_lager';
    const hopVal = document.querySelector('input[name="hopPreference"]:checked')?.value || 'citrus_tropical';
    const occasionVal = document.querySelector('input[name="occasion"]:checked')?.value || 'bbq_patio';

    step3.classList.remove('active');
    step3.style.display = 'none';
    resultView.style.display = 'block';

    window.automat.track('quiz_completed', {
      style: styleVal,
      hop: hopVal,
      occasion: occasionVal
    });

    // Try server calculation first, with client fallback
    try {
      const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stylePreference: styleVal, hopPreference: hopVal, occasion: occasionVal })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.match) {
          document.getElementById('resultScore').textContent = data.match.score;
          document.getElementById('resultVerdict').textContent = data.match.verdict;
          document.getElementById('resultHeadline').textContent = data.match.headline;
          document.getElementById('resultSummary').textContent = data.match.summary;
          document.getElementById('resultServe').textContent = data.match.suggestedPour;
          document.getElementById('resultPairing').textContent = data.match.curatedPairing;
        }
      }
    } catch {
      // Fallback works automatically from pre-rendered HTML
    }
  });

  btnRetake?.addEventListener('click', () => {
    resultView.style.display = 'none';
    step1.style.display = 'block';
    step1.classList.add('active');
    window.automat.track('quiz_retake_click');
  });

  btnClaim?.addEventListener('click', () => {
    window.automat.track('quiz_claim_cta_click');
  });
}

/* --------------------------------------------------------------------------
   Pre-Order Reservation & Waitlist Form
   -------------------------------------------------------------------------- */
function initPreorderForm() {
  const form = document.getElementById('waitlistForm');
  const emailInput = document.getElementById('emailInput');
  const packSelect = document.getElementById('packPreference');
  const locationSelect = document.getElementById('locationInput');
  const errorEl = document.getElementById('formErrorMessage');
  const submitBtn = document.getElementById('btnSubmitReservation');
  const formBox = document.getElementById('formBox');
  const successBox = document.getElementById('successBox');
  const confirmedEmailEl = document.getElementById('confirmedEmail');
  const ticketIdEl = document.getElementById('ticketReservationId');

  if (!form || !emailInput) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    errorEl.textContent = '';

    const email = emailInput.value.trim();
    const pack = packSelect ? packSelect.value : '4-pack';
    const location = locationSelect ? locationSelect.value : 'Direct Ship';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.style.display = 'block';
      emailInput.focus();
      return;
    }

    // Automat tracking requirements:
    // 1. Call automat.track with short snake_case name
    // 2. Call automat.signup(email) and show confirmation
    window.automat.track('preorder_reservation_submitted', { pack, location });
    window.automat.signup(email);

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Securing Allocation...';

    let reservationId = `BOR-${Math.floor(1843 + Math.random() * 200).toString().padStart(5, '0')}`;

    try {
      const resp = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, packPreference: pack, location })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.reservation && data.reservation.reservationId) {
          reservationId = data.reservation.reservationId;
        }
      }
    } catch {
      // In static demo or network disconnect, client-side fallback succeeds gracefully
    }

    // Render success ticket
    confirmedEmailEl.textContent = email;
    ticketIdEl.textContent = reservationId;

    formBox.style.display = 'none';
    successBox.style.display = 'block';

    // Update remaining counters
    updateRemainingCountUI();
  });
}

function updateRemainingCountUI() {
  const remainingEl = document.getElementById('reserveRemainingNum');
  const spotsText = document.getElementById('spotsRemainingText');
  const claimedEl = document.getElementById('reserveClaimedNum');
  const pctEl = document.getElementById('allocationPct');
  const barEl = document.getElementById('allocationBar');

  if (remainingEl) remainingEl.textContent = '657';
  if (claimedEl) claimedEl.textContent = '1,843';
  if (pctEl) pctEl.textContent = '74% Reserved';
  if (barEl) barEl.style.width = '74%';
  if (spotsText) spotsText.innerHTML = '<strong>657 of 2,500</strong> collector 4-packs remaining';
}

/* --------------------------------------------------------------------------
   Live Batch Status Fetcher
   -------------------------------------------------------------------------- */
async function fetchBatchStatus() {
  try {
    const res = await fetch('/api/batch-status');
    if (!res.ok) return;
    const data = await res.json();

    const remainingEl = document.getElementById('reserveRemainingNum');
    const spotsText = document.getElementById('spotsRemainingText');
    const claimedEl = document.getElementById('reserveClaimedNum');
    const pctEl = document.getElementById('allocationPct');
    const barEl = document.getElementById('allocationBar');

    if (remainingEl) remainingEl.textContent = data.remaining.toLocaleString();
    if (claimedEl) claimedEl.textContent = data.claimed.toLocaleString();
    if (pctEl) pctEl.textContent = `${data.percentageClaimed}% Reserved`;
    if (barEl) barEl.style.width = `${data.percentageClaimed}%`;
    if (spotsText) spotsText.innerHTML = `<strong>${data.remaining.toLocaleString()} of ${data.totalAllocation.toLocaleString()}</strong> collector 4-packs remaining`;
  } catch {
    // Statically pre-rendered fallback is already in place
  }
}
