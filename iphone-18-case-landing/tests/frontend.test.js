const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Frontend Landing Page Structure & DOM', () => {
  let dom;
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('contains essential SEO metadata and titles', () => {
    expect(document.title).toContain('AERO-SHIELD Pro');
    expect(document.title).toContain('iPhone 18');
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).not.toBeNull();
    expect(metaDesc.getAttribute('content')).toContain('25ft Drop Protection');
  });

  test('renders hero section with visualizer and CTA triggers', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    expect(heroTitle).not.toBeNull();
    expect(heroTitle.textContent).toContain('Defy Gravity');

    const visualizer = document.getElementById('phone-case-render');
    expect(visualizer).not.toBeNull();

    const heroPreorderBtn = document.getElementById('hero-preorder-btn');
    expect(heroPreorderBtn).not.toBeNull();
  });

  test('renders interactive configurator steps and swatches', () => {
    const modelCards = document.querySelectorAll('.model-option-card');
    expect(modelCards.length).toBe(3);

    const finishSwatches = document.querySelectorAll('.swatch-btn[data-finish]');
    expect(finishSwatches.length).toBe(5);

    const accentSwatches = document.querySelectorAll('.accent-btn');
    expect(accentSwatches.length).toBe(5);

    const engravingInput = document.getElementById('engraving-input');
    expect(engravingInput).not.toBeNull();
    expect(engravingInput.getAttribute('maxlength')).toBe('18');

    const addonItems = document.querySelectorAll('.addon-item');
    expect(addonItems.length).toBe(3);
  });

  test('renders drop lab simulator with slider and telemetry elements', () => {
    const slider = document.getElementById('drop-height-slider');
    expect(slider).not.toBeNull();

    const surfaceSelect = document.getElementById('drop-surface-select');
    expect(surfaceSelect).not.toBeNull();

    const simBtn = document.getElementById('run-simulation-btn');
    expect(simBtn).not.toBeNull();

    const telemetryGForce = document.getElementById('telemetry-gforce');
    expect(telemetryGForce).not.toBeNull();
  });

  test('renders MagSafe accessories showcase and comparison matrix', () => {
    const accessoryCards = document.querySelectorAll('.accessory-card');
    expect(accessoryCards.length).toBe(4);

    const compTable = document.querySelector('.comparison-table');
    expect(compTable).not.toBeNull();
  });

  test('renders cart drawer and checkout modal elements', () => {
    const cartDrawer = document.getElementById('cart-drawer');
    expect(cartDrawer).not.toBeNull();

    const checkoutModal = document.getElementById('checkout-modal');
    expect(checkoutModal).not.toBeNull();

    const preorderForm = document.getElementById('preorder-form');
    expect(preorderForm).not.toBeNull();
  });

  test('renders FAQ accordion and newsletter VIP form', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    expect(faqItems.length).toBeGreaterThanOrEqual(4);

    const newsletterForm = document.getElementById('newsletter-form');
    expect(newsletterForm).not.toBeNull();
  });
});
