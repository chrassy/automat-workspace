const fs = require('fs');
const path = require('path');
const config = require('./config');

class DojoDatabase {
  constructor(filePath = config.dbFile, useMemoryOnly = false) {
    this.filePath = filePath;
    this.useMemoryOnly = useMemoryOnly;
    this.data = {
      signups: [],
      emailLogs: [],
      checkIns: []
    };
    this.init();
  }

  init() {
    if (this.useMemoryOnly) {
      return;
    }
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        if (raw.trim()) {
          this.data = JSON.parse(raw);
          this.data.signups = this.data.signups || [];
          this.data.emailLogs = this.data.emailLogs || [];
          this.data.checkIns = this.data.checkIns || [];
        }
      } else {
        this.save();
      }
    } catch (err) {
      // In case of file system errors, operate in memory
      console.warn('Could not read persistent db file, using in-memory store:', err.message);
    }
  }

  save() {
    if (this.useMemoryOnly || !this.filePath) return;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save data:', err.message);
    }
  }

  clearAll() {
    this.data = {
      signups: [],
      emailLogs: [],
      checkIns: []
    };
    this.save();
  }

  // --- Signups ---
  getAllSignups(filter = {}) {
    let list = [...this.data.signups];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(s =>
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.phone && s.phone.toLowerCase().includes(q)) ||
        (s.passCode && s.passCode.toLowerCase().includes(q))
      );
    }

    if (filter.discipline && filter.discipline !== 'all') {
      list = list.filter(s => s.discipline === filter.discipline);
    }

    if (filter.program && filter.program !== 'all') {
      list = list.filter(s => s.program === filter.program);
    }

    if (filter.status && filter.status !== 'all') {
      list = list.filter(s => s.status === filter.status);
    }

    if (filter.experience && filter.experience !== 'all') {
      list = list.filter(s => s.experienceLevel === filter.experience);
    }

    // Sort by createdAt descending
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  getSignupById(id) {
    return this.data.signups.find(s => s.id === id) || null;
  }

  getSignupByPassCode(code) {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    return this.data.signups.find(s => s.passCode && s.passCode.toUpperCase() === clean) || null;
  }

  createSignup(signup) {
    this.data.signups.push(signup);
    this.save();
    return signup;
  }

  updateSignup(id, updates) {
    const idx = this.data.signups.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.signups[idx] = {
      ...this.data.signups[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.signups[idx];
  }

  deleteSignup(id) {
    const idx = this.data.signups.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.data.signups.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Email Logs ---
  logEmail(emailRecord) {
    this.data.emailLogs.unshift(emailRecord);
    if (this.data.emailLogs.length > 500) {
      this.data.emailLogs.pop();
    }
    this.save();
    return emailRecord;
  }

  getAllEmails() {
    return this.data.emailLogs;
  }

  getEmailById(id) {
    return this.data.emailLogs.find(e => e.id === id) || null;
  }

  // --- Check-Ins ---
  recordCheckIn(checkInRecord) {
    this.data.checkIns.unshift(checkInRecord);
    this.save();
    return checkInRecord;
  }

  getAllCheckIns() {
    return this.data.checkIns;
  }

  // --- Stats ---
  getStats() {
    const signups = this.data.signups;
    const totalSignups = signups.length;
    const checkedInCount = signups.filter(s => s.status === 'checked_in').length;
    const confirmedCount = signups.filter(s => s.status === 'confirmed').length;
    const pendingCount = signups.filter(s => s.status === 'pending').length;

    // By discipline
    const byDiscipline = {};
    for (const d of config.disciplines) {
      byDiscipline[d.id] = 0;
    }
    signups.forEach(s => {
      if (s.discipline) {
        byDiscipline[s.discipline] = (byDiscipline[s.discipline] || 0) + 1;
      }
    });

    // By program
    const byProgram = {};
    for (const p of config.programs) {
      byProgram[p.id] = 0;
    }
    signups.forEach(s => {
      if (s.program) {
        byProgram[s.program] = (byProgram[s.program] || 0) + 1;
      }
    });

    // Recent activity
    const recentSignups = signups.slice(0, 5);

    return {
      totalSignups,
      checkedInCount,
      confirmedCount,
      pendingCount,
      byDiscipline,
      byProgram,
      totalEmailsSent: this.data.emailLogs.length,
      recentSignups
    };
  }
}

// Singleton database instance
const db = new DojoDatabase();

module.exports = {
  db,
  DojoDatabase
};
