'use strict';

const simulationService = require('../src/services/simulationService');

describe('SimulationService', () => {
  beforeEach(() => {
    simulationService.resetState();
  });

  describe('processCheckIn', () => {
    test('grants access to active member and increments streak', () => {
      const activeMember = simulationService.getMembers().find(m => m.barcode === 'BAR-1001');
      const initialStreak = activeMember.streakDays;

      const result = simulationService.processCheckIn('BAR-1001');
      expect(result.success).toBe(true);
      expect(result.accessGranted).toBe(true);
      expect(result.status).toBe('GRANTED');
      expect(result.member.streakDays).toBe(initialStreak + 1);
      expect(result.member.lastCheckIn).toBe('Just now');
    });

    test('flags past due member with soft lock and warning message', () => {
      const result = simulationService.processCheckIn('BAR-1002');
      expect(result.success).toBe(false);
      expect(result.accessGranted).toBe(false);
      expect(result.status).toBe('PAST_DUE');
      expect(result.message).toContain('Soft Turnstile Lock');
      expect(result.message).toContain('Automated SMS');
    });

    test('flags missing waiver for unsigned member', () => {
      const result = simulationService.processCheckIn('BAR-1003');
      expect(result.success).toBe(false);
      expect(result.accessGranted).toBe(false);
      expect(result.status).toBe('WAIVER_REQUIRED');
      expect(result.message).toContain('liability waiver');
    });

    test('denies entry to frozen member', () => {
      const result = simulationService.processCheckIn('BAR-1005');
      expect(result.success).toBe(false);
      expect(result.accessGranted).toBe(false);
      expect(result.status).toBe('FROZEN');
    });

    test('handles unknown member barcode gracefully', () => {
      const result = simulationService.processCheckIn('UNKNOWN-999');
      expect(result.success).toBe(false);
      expect(result.accessGranted).toBe(false);
      expect(result.status).toBe('NOT_FOUND');
    });

    test('throws error when barcode is empty', () => {
      expect(() => {
        simulationService.processCheckIn('');
      }).toThrow('Barcode or member ID is required.');
    });
  });

  describe('bookClassSpot', () => {
    test('books spot when space available', () => {
      const result = simulationService.bookClassSpot('CLS-01', 'Coach Sam');
      expect(result.success).toBe(true);
      expect(result.isWaitlist).toBe(false);
      expect(result.classItem.enrolled).toBe(23);
    });

    test('adds to waitlist when class is full', () => {
      // CLS-02 capacity is 12, already 12 enrolled
      const result = simulationService.bookClassSpot('CLS-02', 'Jordan Doe');
      expect(result.success).toBe(true);
      expect(result.isWaitlist).toBe(true);
      expect(result.classItem.waitlist).toBe(4);
    });

    test('throws error on invalid classId', () => {
      expect(() => {
        simulationService.bookClassSpot('INVALID_ID', 'User');
      }).toThrow('Class with ID INVALID_ID not found.');
    });
  });

  describe('getDashboardTelemetry', () => {
    test('returns live telemetry snapshot', () => {
      const telemetry = simulationService.getDashboardTelemetry();
      expect(telemetry.currentOccupancy).toBeGreaterThan(0);
      expect(telemetry.mrr).toBeGreaterThan(0);
      expect(telemetry.retentionRatePct).toBeGreaterThan(90);
    });
  });
});
