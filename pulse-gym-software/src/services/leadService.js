'use strict';

/**
 * Service to manage gym owner demo requests and lead conversions.
 */
class LeadService {
  constructor() {
    this.leads = [];
  }

  /**
   * Validate incoming lead payload.
   * @param {Object} data
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  validateLead(data) {
    const errors = [];
    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
    }

    if (!data.gymName || typeof data.gymName !== 'string' || data.gymName.trim().length < 2) {
      errors.push('Gym Name is required and must be at least 2 characters.');
    }

    if (!data.ownerName || typeof data.ownerName !== 'string' || data.ownerName.trim().length < 2) {
      errors.push('Owner / Manager Name is required and must be at least 2 characters.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email.trim())) {
      errors.push('A valid email address is required.');
    }

    if (data.memberCount !== undefined && data.memberCount !== null && data.memberCount !== '') {
      const count = Number(data.memberCount);
      if (isNaN(count) || count < 1 || !Number.isInteger(count)) {
        errors.push('Member count must be a positive integer.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Store new gym owner lead.
   * @param {Object} data
   */
  createLead(data) {
    const validation = this.validateLead(data);
    if (!validation.isValid) {
      const error = new Error('Lead validation failed');
      error.validationErrors = validation.errors;
      error.statusCode = 400;
      throw error;
    }

    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const lead = {
      id: leadId,
      gymName: data.gymName.trim(),
      ownerName: data.ownerName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone ? String(data.phone).trim() : null,
      facilityType: data.facilityType || 'general_gym',
      memberCount: data.memberCount ? parseInt(data.memberCount, 10) : 150,
      currentSoftware: data.currentSoftware || 'other',
      primaryGoal: data.primaryGoal || 'all_of_above',
      demoPreferenceDate: data.demoPreferenceDate || 'Immediate (Next 48 hrs)',
      notes: data.notes ? String(data.notes).trim() : '',
      status: 'DEMO_REQUESTED',
      createdAt: now
    };

    this.leads.push(lead);
    return lead;
  }

  /**
   * Get all leads
   */
  getAllLeads() {
    return [...this.leads];
  }

  /**
   * Get lead by ID
   */
  getLeadById(id) {
    return this.leads.find(l => l.id === id) || null;
  }

  /**
   * Clear all leads (testing utility)
   */
  clearLeads() {
    this.leads = [];
  }
}

module.exports = new LeadService();
