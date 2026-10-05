const waitlistService = require('../src/services/waitlistService');

describe('Waitlist & Intent Capture Service', () => {
  beforeEach(() => {
    waitlistService.resetWaitlist();
  });

  test('validates email format properly', () => {
    expect(waitlistService.isValidEmail('test@example.com')).toBe(true);
    expect(waitlistService.isValidEmail('invalid-email')).toBe(false);
    expect(waitlistService.isValidEmail('')).toBe(false);
    expect(waitlistService.isValidEmail(null)).toBe(false);
  });

  test('records a new waitlist lead with survey responses', () => {
    const lead = waitlistService.addWaitlistEntry({
      email: 'pioneer@test.com',
      rating: '400 - 600',
      frustration: 'Blundering rooks in the endgame',
      pricingTolerance: '$19 One-Time (Lifetime Early Bird)',
      source: 'reddit_chessbeginners'
    });

    expect(lead.id).toBeDefined();
    expect(lead.email).toBe('pioneer@test.com');
    expect(lead.rating).toBe('400 - 600');
    expect(lead.source).toBe('reddit_chessbeginners');

    const all = waitlistService.getWaitlist();
    expect(all.length).toBe(1);
  });

  test('deduplicates re-submissions by updating existing lead data', () => {
    waitlistService.addWaitlistEntry({
      email: 'duplicate@test.com',
      rating: '400 - 600',
      pricingTolerance: '$19 One-Time (Lifetime Early Bird)'
    });

    waitlistService.addWaitlistEntry({
      email: 'duplicate@test.com',
      rating: '601 - 800',
      pricingTolerance: '$29 One-Time (Standard Price)'
    });

    const all = waitlistService.getWaitlist();
    expect(all.length).toBe(1);
    expect(all[0].rating).toBe('601 - 800');
    expect(all[0].pricingTolerance).toBe('$29 One-Time (Standard Price)');
  });

  test('calculates accurate statistics and green-light validation status', () => {
    waitlistService.addWaitlistEntry({ email: 'u1@a.com', rating: '400 - 600', pricingTolerance: '$19 One-Time (Lifetime Early Bird)' });
    waitlistService.addWaitlistEntry({ email: 'u2@a.com', rating: '400 - 600', pricingTolerance: '$29 One-Time (Standard Price)' });
    waitlistService.addWaitlistEntry({ email: 'u3@a.com', rating: '601 - 800', pricingTolerance: '$19 One-Time (Lifetime Early Bird)' });
    waitlistService.addWaitlistEntry({ email: 'u4@a.com', rating: 'Under 400', pricingTolerance: '$7/Month Micro-Subscription' });
    waitlistService.addWaitlistEntry({ email: 'u5@a.com', rating: '400 - 600', pricingTolerance: 'Free tier only' });

    const stats = waitlistService.getWaitlistStats();
    expect(stats.totalWaitlist).toBe(5);
    // 4 out of 5 want paid options = 80%
    expect(stats.paidWillingnessPercentage).toBe(80);
    expect(stats.greenLightStatus).toBe('VALIDATED');
    expect(stats.ratingDistribution['400 - 600']).toBe(3);
  });

  test('throws error when invalid email is provided', () => {
    expect(() => {
      waitlistService.addWaitlistEntry({ email: 'bad-email' });
    }).toThrow(/valid email/i);
  });
});
