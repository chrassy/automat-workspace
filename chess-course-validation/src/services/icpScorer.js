function scoreIcpProfile(answers) {
  // answers: { ratingRange, blunderFrequency, studyMethod, dailyTimeMinutes }
  let score = 0;
  const factors = [];

  // 1. Rating evaluation (Target: 400 - 800)
  if (answers.ratingRange === '400 - 600' || answers.ratingRange === '601 - 800') {
    score += 40;
    factors.push('Perfect rating bullseye (400–800 Elo) for tactical blunder elimination.');
  } else if (answers.ratingRange === 'Under 400') {
    score += 30;
    factors.push('Under 400 Elo: Course will accelerate basic board survival rules quickly.');
  } else if (answers.ratingRange === '801 - 1000') {
    score += 25;
    factors.push('801–1000 Elo: Great for plugging recurring blunder leaks and endgame conversions.');
  } else {
    score += 10;
    factors.push('Over 1000 Elo: May find foundational modules too basic, but could benefit from speed drills.');
  }

  // 2. Blunder frequency
  if (answers.blunderFrequency === 'frequent' || answers.blunderFrequency === 'almost_every_game') {
    score += 30;
    factors.push('Frequent piece blunders indicate high need for subconscious danger radar.');
  } else if (answers.blunderFrequency === 'occasional') {
    score += 20;
    factors.push('Occasional blunders are the primary obstacle to reaching 1000 Elo.');
  } else {
    score += 5;
  }

  // 3. Current study method
  if (answers.studyMethod === 'passive_video' || answers.studyMethod === 'youtube_binge') {
    score += 20;
    factors.push('Suffering from passive video fatigue and the illusion of competence.');
  } else if (answers.studyMethod === 'opening_memorization') {
    score += 18;
    factors.push('Trapped in opening theory that fails against unpredictable beginner moves.');
  } else if (answers.studyMethod === 'random_puzzles') {
    score += 15;
    factors.push('Random puzzles lack structured survival and piece defense scaffolding.');
  } else {
    score += 10;
  }

  // 4. Time availability (Target: 15-20 min/day)
  if (answers.dailyTimeMinutes && answers.dailyTimeMinutes <= 30) {
    score += 10;
    factors.push('15–25 min/day window is an optimal match for our bite-sized interactive modules.');
  } else {
    score += 5;
  }

  const matchPercentage = Math.min(100, score);
  let archetype = 'Casual Competitor in the Blunder Rut';
  let recommendation = 'High Priority Candidate for Pioneer Cohort';

  if (matchPercentage >= 75) {
    archetype = 'Prime ICP: The Plateaued Blunder Fighter (400–800 Elo)';
    recommendation = 'Strongest fit. BlunderProof will directly eliminate 70%+ of your game losses in 14 days.';
  } else if (matchPercentage >= 50) {
    archetype = 'Moderate Fit: Tactical Refresher Candidate';
    recommendation = 'Good fit. Interactive board training will tighten up piece security and endgame speed.';
  } else {
    archetype = 'Advanced / Casual Observer';
    recommendation = 'Consider higher-level positional training, though survival drills remain useful.';
  }

  return {
    matchPercentage,
    archetype,
    recommendation,
    factors
  };
}

module.exports = {
  scoreIcpProfile
};
