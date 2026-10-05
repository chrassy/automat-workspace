const { scoreIcpProfile } = require('../src/services/icpScorer');

describe('ICP Fit Scorer Unit Tests', () => {
  test('scores 400-600 Elo player with frequent blunders and video fatigue as prime fit (>=80%)', () => {
    const input = {
      ratingRange: '400 - 600',
      blunderFrequency: 'frequent',
      studyMethod: 'passive_video',
      dailyTimeMinutes: 15
    };

    const result = scoreIcpProfile(input);
    expect(result.matchPercentage).toBeGreaterThanOrEqual(80);
    expect(result.archetype).toContain('Prime ICP');
    expect(result.recommendation).toContain('Strongest fit');
    expect(result.factors.length).toBeGreaterThanOrEqual(3);
  });

  test('scores under 400 Elo player with strong match', () => {
    const input = {
      ratingRange: 'Under 400',
      blunderFrequency: 'almost_every_game',
      studyMethod: 'youtube_binge',
      dailyTimeMinutes: 20
    };

    const result = scoreIcpProfile(input);
    expect(result.matchPercentage).toBeGreaterThanOrEqual(70);
  });

  test('scores high-rated player (>1000 Elo) with lower ICP match', () => {
    const input = {
      ratingRange: 'Over 1000',
      blunderFrequency: 'rare',
      studyMethod: 'random_puzzles',
      dailyTimeMinutes: 60
    };

    const result = scoreIcpProfile(input);
    expect(result.matchPercentage).toBeLessThan(60);
    expect(result.archetype).toContain('Advanced');
  });
});
