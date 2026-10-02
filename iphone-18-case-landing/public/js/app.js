/**
 * iPhone 18 AERO-SHIELD Pro - Interactive Client Application
 */

const STATE = {
  currency: 'USD',
  currencySymbol: '$',
  currencyRate: 1.0,
  selectedModel: 'iphone-18-pro',
  selectedFinish: 'stealth-obsidian',
  selectedAccent: 'cyber-blue',
  engravingText: '',
  selectedAddons: new Set(),
  viewMode: 'back',
  cart: [],
  appliedCoupon: null,
  productsConfig: null
};

// Finish Map
const FINISH_DATA = {
  'stealth-obsidian': {
    name: 'Stealth Obsidian',
    bg: 'radial-gradient(circle at 50% 30%, #282a30 0%, #0d0e11 85%)',
    border: '#3b4252',
    accent: '#00e5ff'
  },
  'titanium-slate': {
    name: 'Titanium Slate',
    bg: 'radial-gradient(circle at 50% 30%, #636875 0%, #2b2e35 85%)',
    border: '#7c8599',
    accent: '#cbd5e1'
  },
  'cosmic-orange': {
    name: 'Cosmic Amber / Orange',
    bg: 'radial-gradient(circle at 50% 30%, #ff8533 0%, #cc4700 85%)',
    border: '#ff944d',
    accent: '#ffea00'
  },
  'cyber-cyan': {
    name: 'Cyber Cyan',
    bg: 'radial-gradient(circle at 50% 30%, #33d4ff 0%, #0088cc 85%)',
    border: '#66e0ff',
    accent: '#ffffff'
  },
  'lunar-white': {
    name: 'Lunar Ceramic White',
    bg: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #cbd5e1 85%)',
    border: '#e2e8f0',
    accent: '#64748b'
  }
};

const ACCENT_DATA = {
  'titanium-silver': '#d1d5db',
  'electro-gold': '#fbbf24',
  'neon-orange': '#ff5722',
  'cyber-blue': '#00e5ff',
  'ruby-crimson': '#ef4444'
};

const MODEL_PRICES = {
  'iphone-18': 59.99,
  'iphone-18-pro': 64.99,
  'iphone-18-ultra': 69.99
};

const ADDON_PRICES = {
  'sapphire-lens-guard': 14.99,
  'nano-privacy-shield': 19.99,
  'tactical-paracord-lanyard': 9.99
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initCustomizerEvents();
  initDropSimulator();
  initAccessoriesVisualizer();
  initCartAndCheckout();
  initReviewsFilter();
  initFaqAccordion();
  initOrderTracking();
  initNewsletter();
  initStickyBar();
});

async function initApp() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    if (data.success) {
      STATE.productsConfig = data.data;
    }
  } catch (err) {
    console.warn('Using fallback configuration', err);
  }
  updateVisualizer();
  updatePriceDisplay();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '⚡' : '✨';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// -------------------------------------------------------------
// Customizer Logic
// -------------------------------------------------------------
function initCustomizerEvents() {
  // Model selector cards
  document.querySelectorAll('.model-option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.model-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      STATE.selectedModel = card.getAttribute('data-model');
      updatePriceDisplay();
      updateVisualizer();
      showToast(`Selected model: ${card.querySelector('.model-name').textContent}`);
    });
  });

  // Finish Swatches
  document.querySelectorAll('.swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      STATE.selectedFinish = btn.getAttribute('data-finish');
      
      const label = document.getElementById('finish-name-label');
      if (label && FINISH_DATA[STATE.selectedFinish]) {
        label.textContent = FINISH_DATA[STATE.selectedFinish].name;
      }
      updateVisualizer();
      updateStickyBar();
    });
  });

  // Button Accent swatches
  document.querySelectorAll('.accent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.accent-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      STATE.selectedAccent = btn.getAttribute('data-accent');
      
      const label = document.getElementById('accent-name-label');
      if (label) {
        label.textContent = btn.getAttribute('data-name') || STATE.selectedAccent;
      }
      updateVisualizer();
    });
  });

  // Engraving input
  const engravingInput = document.getElementById('engraving-input');
  const engravingDisplay = document.getElementById('case-engraving-display');
  const engravingCounter = document.getElementById('engraving-counter');
  const clearEngravingBtn = document.getElementById('clear-engraving-btn');

  if (engravingInput) {
    engravingInput.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase().slice(0, 18);
      e.target.value = val;
      STATE.engravingText = val;
      if (engravingDisplay) {
        engravingDisplay.textContent = val || 'AERO • IPHONE 18';
      }
      if (engravingCounter) {
        engravingCounter.textContent = `${val.length}/18`;
      }
    });
  }

  if (clearEngravingBtn && engravingInput) {
    clearEngravingBtn.addEventListener('click', () => {
      engravingInput.value = '';
      STATE.engravingText = '';
      if (engravingDisplay) engravingDisplay.textContent = 'AERO • IPHONE 18';
      if (engravingCounter) engravingCounter.textContent = '0/18';
    });
  }

  // Addons toggle
  document.querySelectorAll('.addon-item').forEach(item => {
    item.addEventListener('click', () => {
      const addonId = item.getAttribute('data-addon');
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (STATE.selectedAddons.has(addonId)) {
        STATE.selectedAddons.delete(addonId);
        item.classList.remove('selected');
        if (checkbox) checkbox.checked = false;
      } else {
        STATE.selectedAddons.add(addonId);
        item.classList.add('selected');
        if (checkbox) checkbox.checked = true;
      }
      updatePriceDisplay();
    });
  });

  // View mode switcher
  document.querySelectorAll('.view-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.viewMode = btn.getAttribute('data-view');
      const container = document.getElementById('phone-case-render');
      if (container) {
        container.className = `phone-case-container view-${STATE.viewMode}`;
      }
    });
  });

  // Currency select
  const currencySelect = document.getElementById('currency-selector');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      STATE.currency = e.target.value;
      if (STATE.productsConfig && STATE.productsConfig.currencies[STATE.currency]) {
        STATE.currencySymbol = STATE.productsConfig.currencies[STATE.currency].symbol;
        STATE.currencyRate = STATE.productsConfig.currencies[STATE.currency].rate;
      } else {
        const fallbackRates = { USD: { s: '$', r: 1.0 }, EUR: { s: '€', r: 0.92 }, GBP: { s: '£', r: 0.79 }, CAD: { s: 'CA$', r: 1.36 }, JPY: { s: '¥', r: 155.0 } };
        const match = fallbackRates[STATE.currency] || fallbackRates.USD;
        STATE.currencySymbol = match.s;
        STATE.currencyRate = match.r;
      }
      updatePriceDisplay();
      updateCartDrawer();
    });
  }
}

function updateVisualizer() {
  const caseBack = document.getElementById('case-back-body');
  const actionBtn = document.getElementById('case-btn-action');
  const finishInfo = FINISH_DATA[STATE.selectedFinish] || FINISH_DATA['stealth-obsidian'];
  const accentColor = ACCENT_DATA[STATE.selectedAccent] || '#00e5ff';

  if (caseBack) {
    caseBack.style.background = finishInfo.bg;
    caseBack.style.borderColor = finishInfo.border;
  }
  if (actionBtn) {
    actionBtn.style.background = accentColor;
  }
}

function calculateCurrentPrice() {
  let baseUSD = MODEL_PRICES[STATE.selectedModel] || 59.99;
  for (const addonId of STATE.selectedAddons) {
    baseUSD += (ADDON_PRICES[addonId] || 0);
  }
  const converted = baseUSD * STATE.currencyRate;
  const decimals = STATE.currency === 'JPY' ? 0 : 2;
  return {
    rawUSD: baseUSD,
    formatted: `${STATE.currencySymbol}${converted.toFixed(decimals)}`
  };
}

function updatePriceDisplay() {
  const priceData = calculateCurrentPrice();
  const priceElements = document.querySelectorAll('.dynamic-price-tag');
  priceElements.forEach(el => {
    el.textContent = priceData.formatted;
  });
  updateStickyBar();
}

// -------------------------------------------------------------
// Drop Simulator Logic
// -------------------------------------------------------------
function initDropSimulator() {
  const heightSlider = document.getElementById('drop-height-slider');
  const heightValue = document.getElementById('drop-height-display');
  const surfaceSelect = document.getElementById('drop-surface-select');
  const caseSelect = document.getElementById('drop-case-select');
  const simulateBtn = document.getElementById('run-simulation-btn');

  if (heightSlider && heightValue) {
    heightSlider.addEventListener('input', (e) => {
      heightValue.textContent = `${e.target.value} ft (${(e.target.value * 0.3048).toFixed(1)}m)`;
    });
  }

  if (simulateBtn) {
    simulateBtn.addEventListener('click', async () => {
      const height = heightSlider ? parseInt(heightSlider.value, 10) : 25;
      const surface = surfaceSelect ? surfaceSelect.value : 'concrete';
      const caseType = caseSelect ? caseSelect.value : 'aero-shield';

      simulateBtn.textContent = 'Simulating High-Speed Impact...';
      simulateBtn.disabled = true;

      try {
        const res = await fetch('/api/simulate-drop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ heightFeet: height, surface, caseType })
        });
        const json = await res.json();
        if (json.success) {
          renderSimulationResult(json.data);
        }
      } catch (err) {
        console.error('Simulation error', err);
      } finally {
        simulateBtn.textContent = '⚡ Run Drop Impact Simulation';
        simulateBtn.disabled = false;
      }
    });
  }
}

function renderSimulationResult(metrics) {
  const velocityEl = document.getElementById('telemetry-velocity');
  const gforceEl = document.getElementById('telemetry-gforce');
  const dissipatedEl = document.getElementById('telemetry-dissipated');
  const survivalEl = document.getElementById('telemetry-survival');
  const statusEl = document.getElementById('telemetry-status-text');

  if (velocityEl) velocityEl.textContent = `${metrics.velocityMph} MPH`;
  if (gforceEl) gforceEl.textContent = `${metrics.peakGForce} G`;
  if (dissipatedEl) dissipatedEl.textContent = `${metrics.dispersionPercentage}`;
  if (survivalEl) survivalEl.textContent = `${metrics.glassSurvivalRate}%`;
  if (statusEl) {
    statusEl.innerHTML = `<strong>Telemetry Status:</strong> ${metrics.status} Frame deformation: <code>${metrics.frameDamage}</code>.`;
  }
  showToast(`Drop test simulated at ${metrics.heightFeet}ft onto ${metrics.surface}!`);
}

// -------------------------------------------------------------
// Accessories Visualizer Logic
// -------------------------------------------------------------
function initAccessoriesVisualizer() {
  document.querySelectorAll('.accessory-card').forEach(card => {
    card.addEventListener('click', () => {
      const accId = card.getAttribute('data-acc');
      const accName = card.querySelector('.acc-title')?.textContent || 'Accessory';
      const magRing = document.querySelector('.magsafe-ring');
      if (magRing) {
        magRing.classList.add('active-snap');
        setTimeout(() => magRing.classList.remove('active-snap'), 2500);
      }
      showToast(`Snapped ${accName} with 40N Magnetic Lock!`, 'success');
    });
  });
}

// -------------------------------------------------------------
// Cart, Coupon & Checkout Logic
// -------------------------------------------------------------
function initCartAndCheckout() {
  const cartDrawer = document.getElementById('cart-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const stickyAddToCartBtn = document.getElementById('sticky-add-to-cart-btn');
  const heroPreorderBtn = document.getElementById('hero-preorder-btn');

  const openDrawer = () => {
    if (cartDrawer && drawerBackdrop) {
      cartDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
    }
  };

  const closeDrawer = () => {
    if (cartDrawer && drawerBackdrop) {
      cartDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
    }
  };

  if (openCartBtn) openCartBtn.addEventListener('click', openDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  const addItemToCart = () => {
    const item = {
      modelId: STATE.selectedModel,
      finishId: STATE.selectedFinish,
      accentId: STATE.selectedAccent,
      engraving: STATE.engravingText,
      addons: Array.from(STATE.selectedAddons),
      quantity: 1
    };
    STATE.cart.push(item);
    updateCartDrawer();
    openDrawer();
    showToast('AERO-SHIELD Pro Case added to bag!', 'success');
  };

  if (addToCartBtn) addToCartBtn.addEventListener('click', addItemToCart);
  if (stickyAddToCartBtn) stickyAddToCartBtn.addEventListener('click', addItemToCart);
  if (heroPreorderBtn) {
    heroPreorderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addItemToCart();
    });
  }

  // Apply Coupon
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-code-input');
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', async () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) return;
      try {
        const res = await fetch('/api/coupon/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const json = await res.json();
        if (json.success && json.valid) {
          STATE.appliedCoupon = json.data;
          showToast(`Applied promo coupon "${json.data.code}"!`, 'success');
          updateCartDrawer();
        } else {
          showToast(json.error || 'Invalid coupon code', 'error');
        }
      } catch (err) {
        showToast('Error verifying coupon', 'error');
      }
    });
  }

  // Checkout modal
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutForm = document.getElementById('preorder-form');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeDrawer();
      if (checkoutModal && modalBackdrop) {
        checkoutModal.classList.add('open');
        modalBackdrop.classList.add('active');
      }
    });
  }

  const closeCheckoutModal = () => {
    if (checkoutModal && modalBackdrop) {
      checkoutModal.classList.remove('open');
      modalBackdrop.classList.remove('active');
    }
  };

  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCheckoutModal);

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Reserving Launch Day Batch...';
        submitBtn.disabled = true;
      }

      const orderPayload = {
        name: document.getElementById('checkout-name')?.value || 'Valued Early Adopter',
        email: document.getElementById('checkout-email')?.value || 'customer@example.com',
        address: document.getElementById('checkout-address')?.value || '1 Apple Park Way',
        items: STATE.cart.length > 0 ? STATE.cart : [{
          modelId: STATE.selectedModel,
          finishId: STATE.selectedFinish,
          accentId: STATE.selectedAccent,
          engraving: STATE.engravingText,
          addons: Array.from(STATE.selectedAddons),
          quantity: 1
        }],
        couponCode: STATE.appliedCoupon ? STATE.appliedCoupon.code : null,
        currency: STATE.currency,
        shippingType: document.getElementById('checkout-shipping')?.value || 'express'
      };

      try {
        const res = await fetch('/api/preorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const data = await res.json();
        if (data.success) {
          STATE.cart = [];
          updateCartDrawer();
          renderOrderConfirmation(data.data);
        } else {
          showToast(data.error || 'Failed to place preorder', 'error');
        }
      } catch (err) {
        showToast('Network error processing preorder', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.textContent = 'Confirm Launch Pre-Order';
          submitBtn.disabled = false;
        }
      }
    });
  }
}

async function updateCartDrawer() {
  const list = document.getElementById('cart-items-container');
  const countBadge = document.getElementById('cart-badge-count');
  const subtotalEl = document.getElementById('cart-subtotal-display');
  const discountEl = document.getElementById('cart-discount-display');
  const totalEl = document.getElementById('cart-total-display');

  if (countBadge) {
    countBadge.textContent = STATE.cart.length;
  }

  if (STATE.cart.length === 0) {
    if (list) {
      list.innerHTML = `<div style="text-align:center; padding: 40px 0; color: var(--text-muted);">Your bag is currently empty. Configure your iPhone 18 case above!</div>`;
    }
    if (subtotalEl) subtotalEl.textContent = `${STATE.currencySymbol}0.00`;
    if (discountEl) discountEl.textContent = `${STATE.currencySymbol}0.00`;
    if (totalEl) totalEl.textContent = `${STATE.currencySymbol}0.00`;
    return;
  }

  try {
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: STATE.cart,
        couponCode: STATE.appliedCoupon ? STATE.appliedCoupon.code : null,
        currency: STATE.currency,
        shippingType: 'express'
      })
    });
    const json = await res.json();
    if (json.success) {
      const calc = json.data;
      if (subtotalEl) subtotalEl.textContent = `${calc.currencySymbol}${calc.subtotal}`;
      if (discountEl) discountEl.textContent = `-${calc.currencySymbol}${calc.discount}`;
      if (totalEl) totalEl.textContent = `${calc.currencySymbol}${calc.total}`;

      if (list) {
        list.innerHTML = calc.items.map((it, idx) => `
          <div class="cart-item-row">
            <div style="display:flex; justify-content:space-between; font-weight:700;">
              <span>${it.model}</span>
              <span class="text-cyan">${calc.currencySymbol}${(it.lineTotalUSD * calc.rate).toFixed(calc.currency === 'JPY' ? 0 : 2)}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin:4px 0;">
              Finish: <strong>${it.finish}</strong> | Accent: <strong>${it.accent}</strong>
            </div>
            ${it.engraving ? `<div style="font-size:0.75rem; color:var(--accent-cyan);">Laser Engraved: "${it.engraving}"</div>` : ''}
            ${it.addons.length > 0 ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Add-ons: ${it.addons.map(a => a.name).join(', ')}</div>` : ''}
            <button onclick="removeCartItem(${idx})" style="background:transparent; border:none; color:#ef4444; font-size:0.75rem; cursor:pointer; margin-top:8px;">Remove</button>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed calculating cart totals', err);
  }
}

window.removeCartItem = function(index) {
  STATE.cart.splice(index, 1);
  updateCartDrawer();
  showToast('Item removed from bag');
};

function renderOrderConfirmation(order) {
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) {
    checkoutModal.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🚀</div>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 8px;">Pre-Order Confirmed!</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">Your iPhone 18 AERO-SHIELD Pro allocation is locked into Batch 01.</p>
        
        <div style="background: var(--bg-tertiary); border: 1px solid var(--accent-cyan); border-radius: 14px; padding: 20px; text-align: left; margin-bottom: 24px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="color:var(--text-muted);">Order Reference:</span>
            <strong style="font-family:var(--font-mono); color:var(--accent-cyan);">${order.orderId}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="color:var(--text-muted);">Customer:</span>
            <span>${order.customerName}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="color:var(--text-muted);">Total Paid:</span>
            <strong>${order.currencySymbol}${order.total} (${order.currency})</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="color:var(--text-muted);">Estimated Delivery:</span>
            <span style="color:#10b981;">${order.estimatedShipDate}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Lifetime Warranty Token:</span>
            <code style="font-size:0.8rem; color:var(--accent-gold);">${order.warrantyToken}</code>
          </div>
        </div>

        <button onclick="location.reload()" class="btn-primary" style="width: 100%;">Done & Return Home</button>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// Reviews Filter & Submit Logic
// -------------------------------------------------------------
function initReviewsFilter() {
  const modelFilter = document.getElementById('reviews-model-filter');
  const ratingFilter = document.getElementById('reviews-rating-filter');
  const reviewForm = document.getElementById('submit-review-form');

  const fetchReviews = async () => {
    const model = modelFilter ? modelFilter.value : 'all';
    const rating = ratingFilter ? ratingFilter.value : 'all';
    try {
      const res = await fetch(`/api/reviews?model=${encodeURIComponent(model)}&rating=${encodeURIComponent(rating)}`);
      const json = await res.json();
      if (json.success) {
        renderReviews(json.data.reviews);
      }
    } catch (err) {
      console.error('Failed fetching reviews', err);
    }
  };

  if (modelFilter) modelFilter.addEventListener('change', fetchReviews);
  if (ratingFilter) ratingFilter.addEventListener('change', fetchReviews);

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = document.getElementById('review-author')?.value;
      const rating = document.getElementById('review-rating')?.value;
      const model = document.getElementById('review-model')?.value;
      const title = document.getElementById('review-title')?.value;
      const content = document.getElementById('review-content')?.value;

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author, rating, model, title, content })
        });
        const json = await res.json();
        if (json.success) {
          showToast('Thank you! Your verified review has been published.', 'success');
          reviewForm.reset();
          fetchReviews();
        }
      } catch (err) {
        showToast('Failed to post review', 'error');
      }
    });
  }
}

function renderReviews(reviews) {
  const container = document.getElementById('reviews-list-container');
  if (!container) return;
  if (reviews.length === 0) {
    container.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--text-muted); padding: 30px;">No reviews match this filter.</div>`;
    return;
  }
  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div>
          <div class="reviewer-name">${r.author} <span class="badge badge-green" style="font-size:0.65rem; padding:2px 8px; margin-left:6px;">VERIFIED</span></div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${r.role} • ${r.model} • ${r.date}</div>
        </div>
        <div class="review-stars">${'★'.repeat(r.rating)}</div>
      </div>
      <div class="review-title">"${r.title}"</div>
      <div class="review-body">${r.content}</div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// Order Tracking & Warranty Lookup
// -------------------------------------------------------------
function initOrderTracking() {
  const trackBtn = document.getElementById('track-order-btn');
  const trackInput = document.getElementById('track-order-input');
  const resultBox = document.getElementById('track-result-container');

  if (trackBtn && trackInput) {
    trackBtn.addEventListener('click', async () => {
      const orderId = trackInput.value.trim();
      if (!orderId) return;

      trackBtn.textContent = 'Searching...';
      try {
        const res = await fetch(`/api/track/${encodeURIComponent(orderId)}`);
        const json = await res.json();
        if (json.success) {
          const ord = json.data;
          if (resultBox) {
            resultBox.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div>
                  <h4 style="font-size:1.1rem; color:#fff;">Order: <code style="color:var(--accent-cyan);">${ord.orderId}</code></h4>
                  <p style="font-size:0.8rem; color:var(--text-muted);">${ord.customerName} • ${ord.model}</p>
                </div>
                <span class="badge badge-green">${ord.status}</span>
              </div>
              <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.7;">
                <div>🚚 <strong>Carrier:</strong> ${ord.trackingCarrier}</div>
                <div>📅 <strong>Estimated Dispatch:</strong> ${ord.estimatedShipDate}</div>
                <div>🛡️ <strong>Lifetime Warranty Status:</strong> <span style="color:#10b981;">Active & Registered</span></div>
              </div>
            `;
            resultBox.classList.add('visible');
          }
        } else {
          if (resultBox) {
            resultBox.innerHTML = `<div style="color:#ef4444; font-size:0.9rem;">${json.error}</div>`;
            resultBox.classList.add('visible');
          }
        }
      } catch (err) {
        showToast('Failed to retrieve order tracking info', 'error');
      } finally {
        trackBtn.textContent = 'Track Order';
      }
    });
  }
}

// -------------------------------------------------------------
// FAQ Accordion
// -------------------------------------------------------------
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });

  const searchInput = document.getElementById('faq-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

// -------------------------------------------------------------
// Newsletter VIP Signup
// -------------------------------------------------------------
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  if (form && input) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const json = await res.json();
        if (json.success) {
          showToast(json.message, 'success');
          input.value = '';
        } else {
          showToast(json.error, 'error');
        }
      } catch (err) {
        showToast('Error subscribing', 'error');
      }
    });
  }
}

// -------------------------------------------------------------
// Sticky Bottom Bar
// -------------------------------------------------------------
function initStickyBar() {
  const stickyBar = document.getElementById('sticky-floating-bar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      stickyBar?.classList.add('visible');
    } else {
      stickyBar?.classList.remove('visible');
    }
  });
}

function updateStickyBar() {
  const modelName = document.querySelector('.model-option-card.selected .model-name')?.textContent || 'iPhone 18 Pro';
  const finishName = FINISH_DATA[STATE.selectedFinish]?.name || 'Stealth Obsidian';
  const summaryEl = document.getElementById('sticky-summary-text');
  if (summaryEl) {
    summaryEl.textContent = `${modelName} • ${finishName}`;
  }
}
