'use strict';

const CalculatorService = require('../src/services/calculatorService');

describe('CalculatorService', () => {
  describe('calculateRoi', () => {
    test('calculates correct metrics for standard 250 member gym', () => {
      const result = CalculatorService.calculateRoi({
        memberCount: 250,
        avgMonthlyFee: 120,
        monthlyChurnPct: 6,
        failedPaymentPct: 5
      });

      expect(result.inputs.memberCount).toBe(250);
      expect(result.inputs.avgMonthlyFee).toBe(120);
      expect(result.metrics.mrr).toBe(30000); // 250 * 120
      expect(result.metrics.arr).toBe(360000); // 30000 * 12
      expect(result.metrics.monthlyChurnedMembers).toBe(15); // round(250 * 0.06)
      expect(result.metrics.membersSavedPerYear).toBeGreaterThan(0);
      expect(result.metrics.revenueSavedFromRetention).toBeGreaterThan(0);
      expect(result.metrics.annualRecoveredBilling).toBeGreaterThan(0);
      expect(result.metrics.annualAdminCostSavings).toBeGreaterThan(0);
      expect(result.metrics.totalAnnualFinancialGain).toBeGreaterThan(0);
      expect(result.metrics.recommendedPlan.name).toBe('Growth');
      expect(result.metrics.roiMultiplier).toBeGreaterThan(1);
    });

    test('recommends Starter plan for 100 members', () => {
      const result = CalculatorService.calculateRoi({
        memberCount: 100,
        avgMonthlyFee: 80
      });
      expect(result.metrics.recommendedPlan.name).toBe('Starter');
      expect(result.metrics.recommendedPlan.priceMonthly).toBe(99);
    });

    test('recommends Scale plan for 800 members', () => {
      const result = CalculatorService.calculateRoi({
        memberCount: 800,
        avgMonthlyFee: 150
      });
      expect(result.metrics.recommendedPlan.name).toBe('Scale / Multi-Location');
      expect(result.metrics.recommendedPlan.priceMonthly).toBe(349);
    });

    test('handles default fallbacks and edge values gracefully', () => {
      const result = CalculatorService.calculateRoi({});
      expect(result.inputs.memberCount).toBe(150);
      expect(result.inputs.avgMonthlyFee).toBe(99);
      expect(result.metrics.mrr).toBe(150 * 99);
      expect(result.metrics.roiMultiplier).toBeGreaterThan(0);
    });

    test('clamps negative or zero inputs to minimum valid values', () => {
      const result = CalculatorService.calculateRoi({
        memberCount: -50,
        avgMonthlyFee: -20,
        monthlyChurnPct: -5,
        failedPaymentPct: 150
      });
      expect(result.inputs.memberCount).toBe(1);
      expect(result.inputs.avgMonthlyFee).toBe(1);
      expect(result.inputs.monthlyChurnPct).toBe(0.5);
      expect(result.inputs.failedPaymentPct).toBe(100);
    });
  });

  describe('estimateMigration', () => {
    test('estimates migration timeline and savings for Mindbody', () => {
      const estimate = CalculatorService.estimateMigration('mindbody', 300);
      expect(estimate.competitor).toBe('Mindbody');
      expect(estimate.migrationTimelineHours).toBe(48);
      expect(estimate.estimatedAnnualSavings).toBeGreaterThan(0);
      expect(estimate.painPointsAddressed.length).toBeGreaterThan(0);
      expect(estimate.migrationGuarantee).toContain('100% data integrity');
    });

    test('estimates migration for Glofox and spreadsheets', () => {
      const glofox = CalculatorService.estimateMigration('glofox', 200);
      expect(glofox.competitor).toBe('Glofox');

      const sheets = CalculatorService.estimateMigration('spreadsheets', 150);
      expect(sheets.competitor).toBe('Spreadsheets / Manual');
      expect(sheets.estimatedAnnualSavings).toBeGreaterThan(0);
    });

    test('falls back gracefully on unknown competitor', () => {
      const fallback = CalculatorService.estimateMigration('unknown_crm_xyz', 200);
      expect(fallback.competitor).toBe('Mindbody');
    });
  });
});
