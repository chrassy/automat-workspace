'use strict';

const leadService = require('../src/services/leadService');

describe('LeadService', () => {
  beforeEach(() => {
    leadService.clearLeads();
  });

  describe('validateLead', () => {
    test('returns valid for proper lead object', () => {
      const result = leadService.validateLead({
        gymName: 'Titan Fitness & Athletics',
        ownerName: 'Sarah Connor',
        email: 'sarah@titanfitness.com',
        memberCount: 320
      });
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('flags missing gymName and ownerName', () => {
      const result = leadService.validateLead({
        email: 'test@example.com'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Gym Name is required and must be at least 2 characters.');
      expect(result.errors).toContain('Owner / Manager Name is required and must be at least 2 characters.');
    });

    test('flags invalid email format', () => {
      const result = leadService.validateLead({
        gymName: 'Apex Gym',
        ownerName: 'John Doe',
        email: 'not-an-email'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('A valid email address is required.');
    });

    test('flags invalid memberCount', () => {
      const result = leadService.validateLead({
        gymName: 'Apex Gym',
        ownerName: 'John Doe',
        email: 'john@apex.com',
        memberCount: -12
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Member count must be a positive integer.');
    });
  });

  describe('createLead and query', () => {
    test('creates lead with generated ID and default fallbacks', () => {
      const lead = leadService.createLead({
        gymName: 'Barbell Republic',
        ownerName: 'Alex Mercer',
        email: 'alex@barbellrepublic.com',
        phone: '555-443-2211',
        facilityType: 'strength_box',
        memberCount: 180,
        currentSoftware: 'mindbody'
      });

      expect(lead.id).toMatch(/^LEAD-/);
      expect(lead.gymName).toBe('Barbell Republic');
      expect(lead.ownerName).toBe('Alex Mercer');
      expect(lead.email).toBe('alex@barbellrepublic.com');
      expect(lead.phone).toBe('555-443-2211');
      expect(lead.status).toBe('DEMO_REQUESTED');
      expect(lead.createdAt).toBeDefined();

      const all = leadService.getAllLeads();
      expect(all.length).toBe(1);

      const found = leadService.getLeadById(lead.id);
      expect(found).not.toBeNull();
      expect(found.id).toBe(lead.id);
    });

    test('throws 400 error on invalid data', () => {
      expect(() => {
        leadService.createLead({ gymName: '' });
      }).toThrow('Lead validation failed');
    });

    test('getLeadById returns null if not found', () => {
      const found = leadService.getLeadById('NONEXISTENT');
      expect(found).toBeNull();
    });
  });
});
