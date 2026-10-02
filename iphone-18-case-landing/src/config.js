const CONFIG = {
  product: {
    name: 'AERO-SHIELD Pro for iPhone 18 Series',
    tagline: 'Defy Gravity. Aerospace Titanium meets Graphene Aerogel.',
    basePrice: 59.99,
    msrp: 79.99,
    models: [
      {
        id: 'iphone-18',
        name: 'iPhone 18 (6.1")',
        priceModifier: 0,
        dimensions: '147.8 x 72.0 x 8.1 mm',
        weight: '29 grams',
        cameraStyle: 'dual-diagonal'
      },
      {
        id: 'iphone-18-pro',
        name: 'iPhone 18 Pro (6.3")',
        priceModifier: 5.0,
        dimensions: '150.2 x 72.8 x 8.4 mm',
        weight: '32 grams',
        cameraStyle: 'quad-prism'
      },
      {
        id: 'iphone-18-ultra',
        name: 'iPhone 18 Ultra / Pro Max (6.9")',
        priceModifier: 10.0,
        dimensions: '163.5 x 78.2 x 8.6 mm',
        weight: '36 grams',
        cameraStyle: 'quad-prism-ultra'
      }
    ],
    finishes: [
      {
        id: 'stealth-obsidian',
        name: 'Stealth Obsidian',
        hex: '#18191c',
        accentHex: '#00e5ff',
        bgGradient: 'radial-gradient(circle at 50% 30%, #282a30 0%, #0d0e11 85%)',
        textColor: '#ffffff',
        description: 'Matte forged carbon with nano-microtexture'
      },
      {
        id: 'titanium-slate',
        name: 'Titanium Slate',
        hex: '#4a4d56',
        accentHex: '#a0a7b5',
        bgGradient: 'radial-gradient(circle at 50% 30%, #636875 0%, #2b2e35 85%)',
        textColor: '#ffffff',
        description: 'Aerospace Grade 5 brushed titanium composite'
      },
      {
        id: 'cosmic-orange',
        name: 'Cosmic Amber / Orange',
        hex: '#ff6200',
        accentHex: '#ffaa00',
        bgGradient: 'radial-gradient(circle at 50% 30%, #ff8533 0%, #cc4700 85%)',
        textColor: '#ffffff',
        description: 'High-visibility anodized endurance alloy'
      },
      {
        id: 'cyber-cyan',
        name: 'Cyber Cyan',
        hex: '#00c3ff',
        accentHex: '#ffffff',
        bgGradient: 'radial-gradient(circle at 50% 30%, #33d4ff 0%, #0088cc 85%)',
        textColor: '#0a101d',
        description: 'Luminescent quantum dot translucent finish'
      },
      {
        id: 'lunar-white',
        name: 'Lunar Ceramic White',
        hex: '#e2e8f0',
        accentHex: '#64748b',
        bgGradient: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #cbd5e1 85%)',
        textColor: '#0f172a',
        description: 'Zirconia micro-ceramic anti-yellowing coat'
      }
    ],
    buttonAccents: [
      { id: 'titanium-silver', name: 'Raw Titanium', hex: '#d1d5db' },
      { id: 'electro-gold', name: 'Electro Gold', hex: '#fbbf24' },
      { id: 'neon-orange', name: 'Neon Orange', hex: '#ff5722' },
      { id: 'cyber-blue', name: 'Cyber Blue', hex: '#00e5ff' },
      { id: 'ruby-crimson', name: 'Ruby Crimson', hex: '#ef4444' }
    ],
    addons: [
      {
        id: 'sapphire-lens-guard',
        name: 'Dual Sapphire Camera Lens Protector',
        description: 'Mohs hardness 9 Mohs scratchproof optical sapphire',
        price: 14.99,
        originalPrice: 24.99
      },
      {
        id: 'nano-privacy-shield',
        name: '9H+ Nano Privacy Screen Shield',
        description: 'Anti-spy 28° viewing angle with oleophobic coating',
        price: 19.99,
        originalPrice: 29.99
      },
      {
        id: 'tactical-paracord-lanyard',
        name: 'Military Para-Cord Quick-Release Lanyard',
        description: '550lb tensile strength with magnetic swivel clasp',
        price: 9.99,
        originalPrice: 19.99
      }
    ]
  },
  currencies: {
    USD: { symbol: '$', rate: 1.0, decimals: 2 },
    EUR: { symbol: '€', rate: 0.92, decimals: 2 },
    GBP: { symbol: '£', rate: 0.79, decimals: 2 },
    CAD: { symbol: 'CA$', rate: 1.36, decimals: 2 },
    JPY: { symbol: '¥', rate: 155.0, decimals: 0 }
  },
  coupons: {
    LAUNCH18: { type: 'percent', value: 15, label: '15% Off Launch Special' },
    CREW20: { type: 'percent', value: 20, label: '20% Off Early Backer VIP' },
    VIPEARLY: { type: 'percent', value: 25, label: '25% Off VIP Secret Club' },
    FREESHIP: { type: 'shipping', value: 100, label: 'Free Express Worldwide Shipping' }
  },
  accessories: [
    {
      id: 'snap-wallet',
      name: 'AERO Magnetic MagSafe 3.0 Slim Wallet',
      price: 34.99,
      magneticForce: '42 Newtons',
      description: 'Holds 3 RFID-shielded cards with pop-up thumb ejector and integrated kickstand.',
      badge: 'Best Seller'
    },
    {
      id: 'qi3-fast-charger',
      name: 'MagAir 30W Cryo-Cooling Wireless Powerbank',
      price: 49.99,
      magneticForce: '40 Newtons',
      description: '10,000mAh ultra-compact powerpack with active Peltier cooling preventing battery heat.',
      badge: 'New Tech'
    },
    {
      id: 'car-mount-pro',
      name: 'MagLock Pro CNC Carbon Car Vent Mount',
      price: 39.99,
      magneticForce: '48 Newtons',
      description: 'Solid aluminum ball head with dual-ring rare-earth neodymium clamps for zero vibration.',
      badge: 'Essential'
    },
    {
      id: 'desk-stand-pivot',
      name: 'Titanium Stand 360° Studio Magnetic Base',
      price: 44.99,
      magneticForce: '38 Newtons',
      description: 'Dual-axis weighted desktop pedestal supporting landscape StandBy Mode.',
      badge: 'Workspace'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      author: 'Marcus Vance',
      role: 'Tech Editor, GearNexus',
      rating: 5,
      model: 'iPhone 18 Ultra',
      date: '2 days ago',
      verified: true,
      title: 'Dropped my prototype from a 2nd floor balcony — zero scratches.',
      content: 'I was skeptical about the 25-foot claim until I accidentally dropped my iPhone 18 Pro prototype over the stairwell on concrete. The aerogel corner took the impact and bounced without a single scuff to the titanium body or sapphire lenses.'
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      role: 'Industrial Designer',
      rating: 5,
      model: 'iPhone 18 Pro',
      date: '3 days ago',
      verified: true,
      title: 'The MagSafe 3.0 grip is shockingly strong.',
      content: 'Standard cases slip off car mounts on bumpy highways. AERO-SHIELD locks on with 40+ Newtons of force. Plus the 0.4mm back thickness keeps wireless charging at full 30W speeds.'
    },
    {
      id: 'rev-3',
      author: 'David Chen',
      role: 'Outdoor Adventure Photographer',
      rating: 5,
      model: 'iPhone 18 Ultra',
      date: '5 days ago',
      verified: true,
      title: 'Finally a rugged case that does not feel like a brick in pocket.',
      content: 'Weighs only 36 grams on the Ultra model. The tactile button responsiveness feels even crisper than the bare iPhone buttons. The laser engraving was razor sharp.'
    },
    {
      id: 'rev-4',
      author: 'Sarah Jenkins',
      role: 'Verified Pre-order Backer',
      rating: 5,
      model: 'iPhone 18',
      date: '1 week ago',
      verified: true,
      title: 'The Cosmic Orange finish is breathtaking.',
      content: 'In person the metallic sheen and the subtle carbon weave under sunlight look like a supercar. Worth every penny.'
    }
  ],
  faqs: [
    {
      q: 'Will the AERO-SHIELD Pro fit the iPhone 18 series camera upgrades?',
      a: 'Yes. Our CAD models are precision-engineered to the micron for iPhone 18, iPhone 18 Pro, and iPhone 18 Ultra / Pro Max, featuring a 2.0mm raised titanium camera bezel that fully shields the new Quad-Prism telephoto lenses.'
    },
    {
      q: 'How does the Aerogel Honeycomb shock absorption work?',
      a: 'The case corners embed micro-pneumatic graphene aerogel cells. When dropped, the air channels dynamically compress, dispersing up to 850G of kinetic shock outwards instead of transmitting impact force through your iPhone frame.'
    },
    {
      q: 'Is this case compatible with Qi2 and MagSafe 3.0 accessories?',
      a: '100% fully compatible. It features a precision 48-magnet NdFeB array with ultra-low thermal resistance so your phone charges at the fastest 30W rate without thermal throttling.'
    },
    {
      q: 'How does custom laser engraving work?',
      a: 'You can input up to 18 characters (letters, numbers, selected symbols/emojis). We use ultra-precision fiber lasers to etch directly into the aerospace composite layer with 0.05mm precision.'
    },
    {
      q: 'What is your warranty and return policy?',
      a: 'Every AERO-SHIELD Pro case comes with an unconditional Lifetime Replacement Guarantee against drops, breakage, and yellowing, plus a 60-day money-back trial.'
    }
  ]
};

module.exports = CONFIG;
