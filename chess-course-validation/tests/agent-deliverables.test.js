const competitorAnalysis = require('../src/content/competitor-analysis.json');
const icpPositioning = require('../src/content/icp-positioning.json');
const landingCopy = require('../src/content/landing-copy.json');
const distributionPlaybook = require('../src/content/distribution-playbook.json');

describe('Agent 1: Competitor & Gap Analysis Deliverables', () => {
  test('maps pricing tiers for major alternatives including Chessly and Chessable', () => {
    expect(competitorAnalysis.competitors).toBeDefined();
    expect(competitorAnalysis.competitors.length).toBeGreaterThanOrEqual(3);

    const chessly = competitorAnalysis.competitors.find(c => c.id === 'chessly');
    expect(chessly).toBeDefined();
    expect(chessly.pricingTiers.length).toBeGreaterThanOrEqual(2);
    expect(chessly.pricingTiers.some(t => t.priceUSD >= 60)).toBe(true);

    const chessable = competitorAnalysis.competitors.find(c => c.id === 'chessable');
    expect(chessable).toBeDefined();
    expect(chessable.pricingTiers.some(t => t.billing === 'monthly' || t.billing === 'one-time')).toBe(true);
  });

  test('identifies beginner customer complaints in reviews/forums', () => {
    expect(competitorAnalysis.customerPainPoints).toBeDefined();
    expect(competitorAnalysis.customerPainPoints.length).toBeGreaterThanOrEqual(3);

    const painThemes = competitorAnalysis.customerPainPoints.map(p => p.theme.toLowerCase());
    expect(painThemes.some(t => t.includes('video') || t.includes('passive'))).toBe(true);
    expect(painThemes.some(t => t.includes('opening') || t.includes('theory'))).toBe(true);
    expect(painThemes.some(t => t.includes('blunder'))).toBe(true);
  });

  test('formulates the specific differentiator: Active, puzzle-first browser experience with zero video required', () => {
    expect(competitorAnalysis.coreDifferentiator).toBeDefined();
    expect(competitorAnalysis.coreDifferentiator.headline).toContain('Active, Puzzle-First');
    expect(competitorAnalysis.coreDifferentiator.headline).toContain('Zero Video');
    expect(competitorAnalysis.coreDifferentiator.pillars.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Agent 2: ICP & Positioning Strategist Deliverables', () => {
  test('defines demographic and psychographic profiles for 400-800 Elo beginners', () => {
    expect(icpPositioning.icpProfile).toBeDefined();
    const { demographics, psychographics } = icpPositioning.icpProfile;

    expect(demographics.ratingRange).toContain('400');
    expect(demographics.platforms).toContain('Chess.com');
    expect(psychographics.frustrations.length).toBeGreaterThanOrEqual(3);
    expect(psychographics.learningStyle).toBeDefined();
  });

  test('details the primary pain point: the gap between knowing basic piece rules and surviving tactical blunders', () => {
    expect(icpPositioning.primaryPainPoint).toBeDefined();
    expect(icpPositioning.primaryPainPoint.coreProblem).toMatch(/gap between knowing basic piece rules and surviving tactical blunders/i);
    expect(icpPositioning.primaryPainPoint.analysis).toMatch(/blunder/i);
    expect(icpPositioning.primaryPainPoint.consequences.length).toBeGreaterThanOrEqual(2);
  });

  test('provides actionable positioning statement and UVP', () => {
    expect(icpPositioning.positioningStatement).toBeDefined();
    expect(icpPositioning.positioningStatement).toMatch(/400 and 800/);
    expect(icpPositioning.positioningStatement).toMatch(/zero-video/i);

    expect(icpPositioning.uniqueValueProposition).toBeDefined();
    expect(icpPositioning.uniqueValueProposition.headline).toMatch(/Stop hanging pieces/i);
  });
});

describe('Agent 3: Landing Page & Copywriting Deliverables', () => {
  test('hero section contains required headline and CTAs', () => {
    expect(landingCopy.heroSection).toBeDefined();
    expect(landingCopy.heroSection.headline).toBe('Master Chess Tactics Through Action, Not Endless Videos');
    expect(landingCopy.heroSection.subheadline).toMatch(/400–800/);
    expect(landingCopy.heroSection.primaryCta).toBeDefined();
  });

  test('problem/solution breakdown contrasts passive videos with active board-first loop', () => {
    expect(landingCopy.problemSolutionBreakdown).toBeDefined();
    expect(landingCopy.problemSolutionBreakdown.comparison.length).toBeGreaterThanOrEqual(3);

    const comp = landingCopy.problemSolutionBreakdown.comparison;
    expect(comp.some(c => c.traditional.toLowerCase().includes('passive'))).toBe(true);
    expect(comp.some(c => c.blunderProof.toLowerCase().includes('active') || c.blunderProof.toLowerCase().includes('tactile'))).toBe(true);
  });

  test('curriculum sneak peek includes all 4 phases: Basics, Blunders, Tactics, Endgames', () => {
    expect(landingCopy.curriculumSneakPeek).toBeDefined();
    const phases = landingCopy.curriculumSneakPeek.phases;
    expect(phases.length).toBe(4);

    expect(phases[0].phaseName).toMatch(/Board Awareness|Basics/i);
    expect(phases[1].phaseName).toMatch(/Blunder/i);
    expect(phases[2].phaseName).toMatch(/Tactics/i);
    expect(phases[3].phaseName).toMatch(/Endgame/i);
  });

  test('lead capture copy contains hook text for email opt-in', () => {
    expect(landingCopy.leadCaptureCopy).toBeDefined();
    expect(landingCopy.leadCaptureCopy.headline).toMatch(/Waitlist|Early Bird/i);
    expect(landingCopy.leadCaptureCopy.formFields.email).toBeDefined();
    expect(landingCopy.leadCaptureCopy.formFields.pricingTolerance).toBeDefined();
  });
});

describe('Agent 4: Scrappy Validation & Distribution Playbook Deliverables', () => {
  test('identifies target communities including r/chessbeginners and Discord', () => {
    expect(distributionPlaybook.targetCommunities).toBeDefined();
    const channels = distributionPlaybook.targetCommunities.map(c => c.channel.toLowerCase());

    expect(channels.some(c => c.includes('r/chessbeginners'))).toBe(true);
    expect(channels.some(c => c.includes('discord'))).toBe(true);
    expect(channels.some(c => c.includes('hacker news') || c.includes('developer'))).toBe(true);
  });

  test('drafts organic value-first engagement posts without immediate hard-selling', () => {
    expect(distributionPlaybook.organicEngagementPosts).toBeDefined();
    expect(distributionPlaybook.organicEngagementPosts.length).toBeGreaterThanOrEqual(3);

    const redditPost = distributionPlaybook.organicEngagementPosts.find(p => p.id === 'post-reddit-chessbeginners');
    expect(redditPost).toBeDefined();
    expect(redditPost.content).toMatch(/blunder/i);
    expect(redditPost.content).toMatch(/opening/i);
  });

  test('defines explicit conversion rate benchmarks and green-light criteria', () => {
    expect(distributionPlaybook.successMetrics).toBeDefined();
    const metrics = distributionPlaybook.successMetrics;

    expect(metrics.conversionTiers.greenLight.rate).toMatch(/15%/);
    expect(metrics.keyMetrics.some(m => m.benchmarkTarget.includes('15%'))).toBe(true);
    expect(metrics.keyMetrics.some(m => m.metric.includes('Willingness to Pay'))).toBe(true);
  });
});
