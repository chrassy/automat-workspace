const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  school: {
    name: process.env.SCHOOL_NAME || 'Apex Martial Arts Academy',
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
      description: 'Learn leverage, submissions, and ground defense. Gi and No-Gi options available.',
      schedule: ['Mon/Wed 6:00 PM', 'Tue/Thu 7:30 PM', 'Sat 10:00 AM (Open Mat)'],
      whatToBring: 'Clean Gi or Rashguard & athletic shorts. Mouthguard recommended.'
    },
    {
      id: 'muay-thai',
      name: 'Muay Thai Kickboxing',
      category: 'Striking',
      icon: '🥊',
      description: 'The Art of 8 Limbs: explosive punches, kicks, knees, and elbows for fitness and combat.',
      schedule: ['Mon/Wed/Fri 7:00 PM', 'Tue/Thu 6:00 PM', 'Sat 11:30 AM'],
      whatToBring: 'Hand wraps, 16oz gloves (loaners available for trial), shin guards.'
    },
    {
      id: 'karate',
      name: 'Traditional Karate',
      category: 'Traditional Martial Arts',
      icon: '⚡',
      description: 'Shotokan Karate focusing on forms (Kata), sparring (Kumite), and mental discipline.',
      schedule: ['Tue/Thu 5:30 PM', 'Sat 9:00 AM', 'Sun 10:00 AM'],
      whatToBring: 'White Gi / Dogi uniform or loose workout clothing.'
    },
    {
      id: 'taekwondo',
      name: 'Taekwondo',
      category: 'Olympic & High-Kicking',
      icon: '🥋',
      description: 'Dynamic kicking techniques, speed, flexibility, and Olympic sparring drills.',
      schedule: ['Mon/Wed 5:00 PM', 'Fri 6:00 PM', 'Sat 1:00 PM'],
      whatToBring: 'Dobok uniform or comfortable athletic wear.'
    },
    {
      id: 'mma',
      name: 'Mixed Martial Arts',
      category: 'Comprehensive Combat',
      icon: '🔥',
      description: 'Integrated striking, wrestling takedowns, cage control, and submission grappling.',
      schedule: ['Mon/Wed 8:00 PM', 'Fri 7:30 PM', 'Sat 12:30 PM'],
      whatToBring: 'MMA hybrid gloves, mouthguard, compression shorts/spats.'
    },
    {
      id: 'judo',
      name: 'Judo',
      category: 'Throws & Takedowns',
      icon: '🥋',
      description: 'The gentle way: powerful throws, sweeps, joint locks, and balance disruption.',
      schedule: ['Tue/Thu 7:00 PM', 'Sat 2:00 PM'],
      whatToBring: 'Heavyweight Judo Gi.'
    },
    {
      id: 'krav-maga',
      name: 'Krav Maga',
      category: 'Real-World Self-Defense',
      icon: '🛡️',
      description: 'Instinctive self-defense, threat neutralization, and situational awareness training.',
      schedule: ['Tue/Thu 6:30 PM', 'Sat 11:00 AM'],
      whatToBring: 'Comfortable athletic clothes, cross-training shoes.'
    },
    {
      id: 'kids',
      name: 'Kids Martial Arts & Bullyproof',
      category: 'Youth (Ages 5-13)',
      icon: '🌟',
      description: 'Building confidence, focus, respect, anti-bullying skills, and athletic agility.',
      schedule: ['Mon/Wed 4:00 PM (Ages 5-8)', 'Tue/Thu 4:15 PM (Ages 9-13)', 'Sat 9:30 AM'],
      whatToBring: 'Comfortable t-shirt and sweatpants or kids martial arts uniform.'
    }
  ],
  programs: [
    { id: 'free-trial', name: 'Free Introductory Trial Class', price: 0, description: '1 Free class + dojo tour & private consultation' },
    { id: 'starter-pass', name: '2-Week Beginner Quick-Start', price: 49, description: 'Unlimited classes for 14 days + Free Academy T-Shirt' },
    { id: 'monthly-unlimited', name: 'Monthly Unlimited Membership', price: 159, description: 'Full access to all disciplines, open mats, and gym equipment' },
    { id: 'kids-monthly', name: 'Kids Junior Champion Program', price: 129, description: '2 classes/week + character development badges' },
    { id: 'private-pack', name: 'Private 1-on-1 Coaching (3 Sessions)', price: 220, description: 'Personalized instruction with a Master Coach' }
  ],
  dbFile: process.env.DB_FILE || path.join(__dirname, '../data/dojo-data.json'),
  email: {
    from: process.env.EMAIL_FROM || '"Apex Martial Arts Academy" <welcome@apexmartialarts.com>',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    mockMode: process.env.EMAIL_MOCK !== 'false' // default to true in tests and local preview
  }
};
