const CONFIG = require('../config');

// In-memory store for pre-orders (seeded with sample lookup orders)
const preOrdersStore = new Map();

// Seed initial orders for tracking demonstrations
preOrdersStore.set('AERO-18-99421', {
  orderId: 'AERO-18-99421',
  customerName: 'Alex Mercer',
  email: 'alex.mercer@example.com',
  model: 'iPhone 18 Ultra / Pro Max (6.9")',
  finish: 'Stealth Obsidian',
  accent: 'Cyber Blue',
  engraving: 'CYBERPUNK-18',
  addons: ['Dual Sapphire Camera Lens Protector'],
  total: 67.98,
  currency: 'USD',
  currencySymbol: '$',
  status: 'Priority Production Queue (Batch 01)',
  estimatedShipDate: 'Launch Day (Sep 19)',
  trackingCarrier: 'FedEx SuperFast Overnight',
  warrantyRegistered: true,
  createdAt: new Date().toISOString()
});

function calculateOrderTotal(items = [], couponCode = null, currency = 'USD', shippingType = 'standard') {
  const curr = CONFIG.currencies[currency] || CONFIG.currencies.USD;
  let subtotalUSD = 0;
  const processedItems = [];

  for (const item of items) {
    const model = CONFIG.product.models.find(m => m.id === item.modelId) || CONFIG.product.models[0];
    const finish = CONFIG.product.finishes.find(f => f.id === item.finishId) || CONFIG.product.finishes[0];
    const accent = CONFIG.product.buttonAccents.find(b => b.id === item.accentId) || CONFIG.product.buttonAccents[0];
    
    let itemPriceUSD = CONFIG.product.basePrice + model.priceModifier;
    
    // Addons
    const addonDetails = [];
    if (Array.isArray(item.addons)) {
      for (const addonId of item.addons) {
        const addon = CONFIG.product.addons.find(a => a.id === addonId);
        if (addon) {
          itemPriceUSD += addon.price;
          addonDetails.push(addon);
        }
      }
    }

    // Laser Engraving fee (Free during launch promo)
    const engraving = (item.engraving || '').trim().slice(0, 18);

    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    const lineTotalUSD = itemPriceUSD * qty;
    subtotalUSD += lineTotalUSD;

    processedItems.push({
      model: model.name,
      modelId: model.id,
      finish: finish.name,
      finishId: finish.id,
      finishHex: finish.hex,
      accent: accent.name,
      accentId: accent.id,
      engraving,
      addons: addonDetails,
      quantity: qty,
      unitPriceUSD: Number(itemPriceUSD.toFixed(2)),
      lineTotalUSD: Number(lineTotalUSD.toFixed(2))
    });
  }

  // Shipping
  let shippingUSD = 0; // Free standard shipping
  if (shippingType === 'express') {
    shippingUSD = 12.00;
  } else if (shippingType === 'overnight') {
    shippingUSD = 24.00;
  }

  // Apply Coupon
  let discountUSD = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const cleanCoupon = String(couponCode).toUpperCase().trim();
    const couponDef = CONFIG.coupons[cleanCoupon];
    if (couponDef) {
      if (couponDef.type === 'percent') {
        discountUSD = (subtotalUSD * couponDef.value) / 100;
      } else if (couponDef.type === 'shipping') {
        discountUSD = shippingUSD;
        shippingUSD = 0;
      }
      appliedCoupon = {
        code: cleanCoupon,
        label: couponDef.label,
        discountUSD: Number(discountUSD.toFixed(2))
      };
    }
  }

  const taxableAmount = Math.max(0, subtotalUSD - discountUSD);
  const taxUSD = taxableAmount * 0.08; // Estimated 8% tax
  const totalUSD = Math.max(0, taxableAmount + shippingUSD + taxUSD);

  // Convert to target currency
  const rate = curr.rate;
  const subtotal = Number((subtotalUSD * rate).toFixed(curr.decimals));
  const discount = Number((discountUSD * rate).toFixed(curr.decimals));
  const shipping = Number((shippingUSD * rate).toFixed(curr.decimals));
  const tax = Number((taxUSD * rate).toFixed(curr.decimals));
  const total = Number((totalUSD * rate).toFixed(curr.decimals));

  return {
    items: processedItems,
    currency,
    currencySymbol: curr.symbol,
    rate,
    subtotalUSD: Number(subtotalUSD.toFixed(2)),
    subtotal,
    discountUSD: Number(discountUSD.toFixed(2)),
    discount,
    shippingUSD: Number(shippingUSD.toFixed(2)),
    shipping,
    taxUSD: Number(taxUSD.toFixed(2)),
    tax,
    totalUSD: Number(totalUSD.toFixed(2)),
    total,
    appliedCoupon
  };
}

function createPreOrder(orderData) {
  if (!orderData.email || !orderData.name) {
    throw new Error('Customer name and email are required.');
  }

  const items = orderData.items && orderData.items.length > 0
    ? orderData.items
    : [{
        modelId: orderData.modelId || 'iphone-18-pro',
        finishId: orderData.finishId || 'stealth-obsidian',
        accentId: orderData.accentId || 'cyber-blue',
        engraving: orderData.engraving || '',
        addons: orderData.addons || [],
        quantity: orderData.quantity || 1
      }];

  const calc = calculateOrderTotal(
    items,
    orderData.couponCode,
    orderData.currency || 'USD',
    orderData.shippingType || 'express'
  );

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `AERO-18-${randomNum}`;

  const orderRecord = {
    orderId,
    customerName: orderData.name,
    email: orderData.email,
    shippingAddress: orderData.address || '1 Infinite Loop, Cupertino, CA',
    items: calc.items,
    calculation: calc,
    total: calc.total,
    currency: calc.currency,
    currencySymbol: calc.currencySymbol,
    status: 'Confirmed - Batch 01 Launch Reservation',
    estimatedShipDate: 'iPhone 18 Official Launch Day',
    trackingCarrier: 'Express Courier Air Priority',
    warrantyRegistered: true,
    warrantyToken: `WAR-18-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    createdAt: new Date().toISOString()
  };

  preOrdersStore.set(orderId, orderRecord);
  return orderRecord;
}

function getPreOrder(orderId) {
  if (!orderId) return null;
  const cleanId = String(orderId).trim().toUpperCase();
  return preOrdersStore.get(cleanId) || null;
}

module.exports = {
  calculateOrderTotal,
  createPreOrder,
  getPreOrder,
  preOrdersStore
};
