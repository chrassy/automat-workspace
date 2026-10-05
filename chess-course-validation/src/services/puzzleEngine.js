const puzzles = require('../content/puzzles.json');

function getAllPuzzles() {
  return puzzles.map(p => ({
    id: p.id,
    title: p.title,
    phase: p.phase,
    difficulty: p.difficulty,
    prompt: p.prompt,
    toMove: p.toMove,
    fen: p.fen,
    board: p.board
  }));
}

function getPuzzleById(id) {
  return puzzles.find(p => p.id === id) || null;
}

function verifyMove(puzzleId, from, to) {
  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) {
    throw new Error(`Puzzle with ID '${puzzleId}' not found.`);
  }

  const cleanFrom = from ? from.trim().toLowerCase() : '';
  const cleanTo = to ? to.trim().toLowerCase() : '';

  const isExactPrimary = puzzle.solution.from === cleanFrom && puzzle.solution.to === cleanTo;

  let isAlt = false;
  if (puzzle.solution.altSolutions) {
    isAlt = puzzle.solution.altSolutions.some(alt => alt.from === cleanFrom && alt.to === cleanTo);
  }

  const isCorrect = isExactPrimary || isAlt;

  if (isCorrect) {
    return {
      success: true,
      puzzleId,
      message: 'Spot on! Tactical radar confirmed.',
      explanation: puzzle.blunderExplanation,
      takeaway: puzzle.takeaway,
      bestMove: puzzle.solution.bestMove
    };
  } else {
    return {
      success: false,
      puzzleId,
      message: 'Not quite. That move leaves you vulnerable or misses the killer tactical punishment.',
      hint: `Look closely at ${puzzle.solution.from} and see what high-value threat it creates against enemy pieces.`
    };
  }
}

module.exports = {
  getAllPuzzles,
  getPuzzleById,
  verifyMove
};
