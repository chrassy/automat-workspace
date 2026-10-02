const { calculateDropMetrics } = require('../src/services/drop-simulator');
const { calculateOrderTotal, createPreOrder, getPreOrder } = require('../src/services/order-service');
const CONFIG = require('../src/config');

describe('Drop Simulator Physics Service', () => {
  test('calculates accurate physics for 25ft drop onto concrete with AERO-SHIELD', () => {
    const result = calculateDropMetrics(25, 'concrete', 'aero-shield');
    expect(result.heightFeet).toBe(25);
    expect(result.velocityMph).toBeGreaterThan(20);
    expect(result.kineticEnergyJoules).toBeGreaterThan(10);
    expect(result.peakGForce).toBeGreaterThan(100);
    expect(result.dispersionPercentage).toBe('98.5%');
    expect(result.glassSurvivalRate).toBe(100);
    expect(result.status).toContain('100% Intact');
  });

  test('correctly simulates silicone case with higher transmitted impact force', () => {
    const result = calculateDropMetrics(15, 'concrete', 'silicone');
    expect(result.caseType).toBe('silicone');
    expect(result.dispersionPercentage).toBe('65.0%');
    expect(result.glassSurvivalRate).toBeLessThan(100);
  });

  test('correctly simulates naked phone with severe damage', () => {
    const result = calculateDropMetrics(20, 'granite', 'naked');
    expect(result.dispersionPercentage).toBe('0.0%');
    expect(result.glassSurvivalRate).toBeLessThan(50);
    expect(result.status).toContain('Catastrophic Glass Shatter');
  });
});

describe('Order & Pricing Engine', () => {
  test('calculates base price for standard iPhone 18 Pro configuration', () => {
    const items = [{
      modelId: 'iphone-18-pro',
      finishId: 'stealth-obsidian',
      accentId: 'cyber-blue',
      addons: [],
      quantity: 1
    }];

    const result = calculateOrderTotal(items, null, 'USD', 'standard');
    // Base 59.99 + Pro modifier 5.00 = 64.99
    expect(result.subtotalUSD).toBe(64.99);
    expect(result.taxUSD).toBeCloseTo(64.99 * 0.08, 2);
    expect(result.totalUSD).toBeCloseTo(64.99 + (64.99 * 0.08), 2);
  });

  test('applies percent discount coupon LAUNCH18 (15% off)', () => {
    const items = [{
      modelId: 'iphone-18',
      finishId: 'cosmic-orange',
      accentId: 'neon-orange',
      addons: ['sapphire-lens-guard'], // +14.99
      quantity: 1
    }];

    // 59.99 + 14.99 = 74.98
    const result = calculateOrderTotal(items, 'LAUNCH18', 'USD', 'standard');
    expect(result.appliedCoupon).toBeDefined();
    expect(result.appliedCoupon.code).toBe('LAUNCH18');
    expect(result.discountUSD).toBeCloseTo(74.98 * 0.15, 2);
  });

  test('converts totals into EUR currency', () => {
    const items = [{
      modelId: 'iphone-18',
      finishId: 'stealth-obsidian',
      quantity: 1
    }];

    const result = calculateOrderTotal(items, null, 'EUR', 'standard');
    expect(result.currency).toBe('EUR');
    expect(result.currencySymbol).toBe('€');
    expect(result.subtotal).toBeCloseTo(59.99 * 0.92, 2);
  });

  test('creates a valid pre-order and retrieves it via getPreOrder', () => {
    const orderData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '742 Evergreen Terrace',
      modelId: 'iphone-18-ultra',
      finishId: 'cyber-cyan',
      accentId: 'ruby-crimson',
      engraving: 'JANEDOE18',
      addons: ['nano-privacy-shield'],
      couponCode: 'CREW20',
      currency: 'USD'
    };

    const newOrder = createPreOrder(orderData);
    expect(newOrder.orderId).toMatch(/^AERO-18-\d+$/);
    expect(newOrder.customerName).toBe('Jane Doe');
    expect(newOrder.warrantyRegistered).toBe(true);
    expect(newOrder.warrantyToken).toContain('WAR-18-');

    const fetched = getPreOrder(newOrder.orderId);
    expect(fetched).not.toBeNull();
    expect(fetched.email).toBe('jane@example.com');
  });

  test('throws error if customer name or email is missing on preorder', () => {
    expect(() => createPreOrder({ name: '' })).toThrow();
  });
});
