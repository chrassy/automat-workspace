'use strict';

/**
 * Service to calculate ROI, recovered revenue, churn mitigation,
 * and admin time saved for gym owners.
 */
class CalculatorService {
  /**
   * Calculate financial ROI metrics based on gym operational variables.
   * @param {Object} params
   * @param {number} params.memberCount - Current active gym members (e.g., 250)
   * @param {number} params.avgMonthlyFee - Average monthly membership price in USD (e.g., $110)
   * @param {number} [params.monthlyChurnPct=7] - Current monthly member churn % (e.g., 7%)
   * @param {number} [params.failedPaymentPct=6.5] - Current monthly failed payment % (e.g., 6.5%)
   */
  static calculateRoi({
    memberCount,
    avgMonthlyFee,
    monthlyChurnPct = 7,
    failedPaymentPct = 6.5
  }) {
    const members = Math.max(1, parseInt(memberCount, 10) || 150);
    const fee = Math.max(1, parseFloat(avgMonthlyFee) || 99);
    const churn = Math.min(100, Math.max(0.5, parseFloat(monthlyChurnPct) || 7));
    const failedPayment = Math.min(100, Math.max(0.5, parseFloat(failedPaymentPct) || 6.5));

    // Base Financials
    const mrr = Math.round(members * fee);
    const arr = mrr * 12;

    // Churn Analytics
    const monthlyChurnedMembers = Math.round(members * (churn / 100));
    const annualChurnedMembers = monthlyChurnedMembers * 12;
    const annualLostChurnRevenue = annualChurnedMembers * fee;

    // PulseGym Retention Impact: 36% reduction in churn using predictive drop-off alerts & SMS reactivation
    const retentionImprovementRate = 0.36;
    const membersSavedPerYear = Math.round(annualChurnedMembers * retentionImprovementRate);
    const revenueSavedFromRetention = Math.round(membersSavedPerYear * fee * 6); // Average member retains at least 6 additional months

    // Smart Dunning & Automated Card Updater Impact:
    // 74% of declined payments recovered automatically through instant retry & automated SMS payment link
    const recoveryRate = 0.74;
    const monthlyFailedAmount = mrr * (failedPayment / 100);
    const monthlyRecoveredBilling = Math.round(monthlyFailedAmount * recoveryRate);
    const annualRecoveredBilling = monthlyRecoveredBilling * 12;

    // Admin Time Savings
    // Estimated 1 hr saved per week per 25 members (automated check-ins, scheduling, payment reconciliation)
    const adminHoursSavedWeekly = Math.min(30, Math.max(4, Math.round(members / 25)));
    const annualAdminHoursSaved = adminHoursSavedWeekly * 50; // 50 work weeks
    const adminCostPerHour = 22; // $22/hr average front desk / management wage
    const annualAdminCostSavings = annualAdminHoursSaved * adminCostPerHour;

    // Total Financial Gain
    const totalAnnualFinancialGain = revenueSavedFromRetention + annualRecoveredBilling + annualAdminCostSavings;

    // Recommended PulseGym Plan
    let recommendedPlan = {
      name: 'Starter',
      priceMonthly: 99,
      priceAnnual: 79 * 12,
      maxMembers: 150
    };

    if (members > 600) {
      recommendedPlan = {
        name: 'Scale / Multi-Location',
        priceMonthly: 349,
        priceAnnual: 279 * 12,
        maxMembers: 'Unlimited'
      };
    } else if (members > 150) {
      recommendedPlan = {
        name: 'Growth',
        priceMonthly: 199,
        priceAnnual: 159 * 12,
        maxMembers: 600
      };
    }

    const annualSoftwareCost = recommendedPlan.priceMonthly * 12;
    const netAnnualValue = totalAnnualFinancialGain - annualSoftwareCost;
    const roiMultiplier = (annualSoftwareCost > 0)
      ? parseFloat((totalAnnualFinancialGain / annualSoftwareCost).toFixed(1))
      : 0;

    return {
      inputs: {
        memberCount: members,
        avgMonthlyFee: fee,
        monthlyChurnPct: churn,
        failedPaymentPct: failedPayment
      },
      metrics: {
        mrr,
        arr,
        monthlyChurnedMembers,
        annualLostChurnRevenue: Math.round(annualLostChurnRevenue),
        membersSavedPerYear,
        revenueSavedFromRetention,
        monthlyRecoveredBilling,
        annualRecoveredBilling,
        adminHoursSavedWeekly,
        annualAdminHoursSaved,
        annualAdminCostSavings,
        totalAnnualFinancialGain,
        recommendedPlan,
        annualSoftwareCost,
        netAnnualValue,
        roiMultiplier
      }
    };
  }

  /**
   * Estimate migration difficulty, timeline, and savings vs competitor software.
   * @param {string} competitor
   * @param {number} memberCount
   */
  static estimateMigration(competitor, memberCount) {
    const validCompetitors = ['mindbody', 'glofox', 'zenplanner', 'pushpress', 'spreadsheets', 'other'];
    const compKey = validCompetitors.includes((competitor || '').toLowerCase())
      ? competitor.toLowerCase()
      : 'mindbody';

    const members = Math.max(1, parseInt(memberCount, 10) || 200);

    const competitorDetails = {
      mindbody: {
        name: 'Mindbody',
        avgCostPerMonth: Math.max(250, Math.round(members * 1.1 + 129)),
        painPoints: ['High merchant processing fees (up to 3.7%)', 'Clunky legacy UI', 'Slow front desk check-in', 'Hidden add-on fees'],
        migrationHours: 48,
        pulseSavingsAnnual: Math.max(1200, Math.round(members * 12 * 0.8))
      },
      glofox: {
        name: 'Glofox',
        avgCostPerMonth: Math.max(200, Math.round(members * 0.9 + 110)),
        painPoints: ['App sync glitches', 'Rigid booking windows', 'Delayed customer support'],
        migrationHours: 36,
        pulseSavingsAnnual: Math.max(900, Math.round(members * 12 * 0.5))
      },
      zenplanner: {
        name: 'Zen Planner',
        avgCostPerMonth: Math.max(160, Math.round(members * 0.75 + 99)),
        painPoints: ['Outdated mobile interface', 'Limited access-control hardware integrations', 'Manual dunning'],
        migrationHours: 24,
        pulseSavingsAnnual: Math.max(750, Math.round(members * 12 * 0.4))
      },
      pushpress: {
        name: 'PushPress',
        avgCostPerMonth: Math.max(159, Math.round(members * 0.7 + 89)),
        painPoints: ['Steep tier jumps', 'Limited multi-location routing', 'Restricted custom reporting'],
        migrationHours: 24,
        pulseSavingsAnnual: Math.max(600, Math.round(members * 12 * 0.3))
      },
      spreadsheets: {
        name: 'Spreadsheets / Manual',
        avgCostPerMonth: 0,
        painPoints: ['Hours lost manually reconciling payments', 'Zero automated check-in', 'No churn visibility', 'Uncollected member debts'],
        migrationHours: 24,
        pulseSavingsAnnual: Math.round(members * 45) // Massive savings from recovered leakage
      },
      other: {
        name: 'Other Legacy Platform',
        avgCostPerMonth: 180,
        painPoints: ['Fragmented tools', 'Lack of modern integrations', 'High maintenance overhead'],
        migrationHours: 48,
        pulseSavingsAnnual: 950
      }
    };

    const target = competitorDetails[compKey];
    return {
      competitor: target.name,
      estimatedCurrentSoftwareCostAnnual: target.avgCostPerMonth * 12,
      migrationTimelineHours: target.migrationHours,
      estimatedAnnualSavings: target.pulseSavingsAnnual,
      painPointsAddressed: target.painPoints,
      migrationGuarantee: 'Pulse Concierge Team handles CSV extraction, Stripe/Merchant token migration, and member account import with 0% downtime and 100% data integrity.'
    };
  }
}

module.exports = CalculatorService;
