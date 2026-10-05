function scoreIcpProfile(answers) {
  // answers: { ratingRange, blunderFrequency, studyMethod, dailyTimeMinutes }
  let score = 0;
  const factors = [];

  const rating = answers.ratingRange || '';

  // 1. Rating evaluation (Primary target: Adult Improvers 800–1600 Elo & 400–800 Elo beginners)
  if (
    rating === '400 - 600' ||
    rating === '601 - 800' ||
    rating === '800 - 1000' ||
    rating === '1001 - 1200' ||
    rating === '1201 - 1400' ||
    rating === '1401 - 1600' ||
    rating === '800 - 1600' ||
    rating.includes('Adult Improver')
  ) {
    score += 40;
    factors.push('Prime target rating band (800–1600 Elo & foundational 400–800 Elo) for tactical blunder elimination and CCT routine.');
  } else if (rating === 'Under 400' || rating === 'Under 800') {
    score += 30;
    factors.push('Under 400–800 Elo: Course accelerates foundational board awareness and piece safety quickly.');
  } else if (rating === 'Over 1000') {
    score += 10;
    factors.push('Over 1000 Elo: Higher-rated player with less blunder frequency; foundational modules may feel introductory.');
  } else {
    score += 10;
    factors.push('Over 1600 Elo: May find foundational survival drills too basic, but speed CCT exercises still sharpen vision.');
  }

  // 2. Blunder frequency
  if (answers.blunderFrequency === 'frequent' || answers.blunderFrequency === 'almost_every_game') {
    score += 30;
    factors.push('Frequent piece blunders indicate high need for subconscious Checks-Captures-Threats (CCT) danger radar.');
  } else if (answers.blunderFrequency === 'occasional') {
    score += 20;
    factors.push('Occasional blunders are the primary obstacle preventing a breakout past 1400 Elo.');
  } else {
    score += 5;
  }

  // 3. Current study method
  if (answers.studyMethod === 'passive_video' || answers.studyMethod === 'youtube_binge') {
    score += 20;
    factors.push('Suffering from passive video fatigue and the illusion of competence from video lectures.');
  } else if (answers.studyMethod === 'opening_memorization') {
    score += 18;
    factors.push('Trapped in bloated 40-hour opening theory that collapses against non-standard opponent moves.');
  } else if (answers.studyMethod === 'random_puzzles') {
    score += 15;
    factors.push('Random puzzles lack structured Checks-Captures-Threats (CCT) habit scaffolding.');
  } else {
    score += 10;
  }

  // 4. Time availability (Target: 15-20 min/day)
  if (answers.dailyTimeMinutes && Number(answers.dailyTimeMinutes) <= 30) {
    score += 10;
    factors.push('15–25 min/day window is an optimal match for our bite-sized tactical micro-drills.');
  } else {
    score += 5;
  }

  const matchPercentage = Math.min(100, score);
  let archetype = 'Casual Competitor in the Blunder Rut';
  let recommendation = 'High Priority Candidate for Pioneer Cohort';

  if (matchPercentage >= 75) {
    archetype = 'Prime ICP: The Plateaued Adult Improver (800–1600 Elo / Blunder Rut)';
    recommendation = 'Strongest fit. BlunderProof CCT drills will directly eliminate 70%+ of your unforced game losses in 14 days.';
  } else if (matchPercentage >= 50) {
    archetype = 'Moderate Fit: Tactical Refresher Candidate';
    recommendation = 'Good fit. Interactive CCT board training will tighten up piece security and endgame speed.';
  } else {
    archetype = 'Advanced / Casual Observer';
    recommendation = 'Consider higher-level positional training, though CCT speed drills remain useful.';
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
