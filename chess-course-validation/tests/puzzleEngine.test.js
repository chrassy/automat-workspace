const puzzleEngine = require('../src/services/puzzleEngine');

describe('Puzzle Engine Unit Tests', () => {
  test('returns a list of demo puzzles with required board structures', () => {
    const puzzles = puzzleEngine.getAllPuzzles();
    expect(Array.isArray(puzzles)).toBe(true);
    expect(puzzles.length).toBeGreaterThanOrEqual(3);

    const first = puzzles[0];
    expect(first.id).toBeDefined();
    expect(first.prompt).toBeDefined();
    expect(first.board.length).toBe(8);
    expect(first.board[0].length).toBe(8);
  });

  test('successfully verifies correct move for hanging queen puzzle', () => {
    const result = puzzleEngine.verifyMove('puzzle-1', 'c1', 'g5');
    expect(result.success).toBe(true);
    expect(result.message).toContain('Tactical radar confirmed');
    expect(result.explanation).toMatch(/Queen/i);
    expect(result.takeaway).toBeDefined();
  });

  test('accepts valid alternative solution for puzzle 1 if configured', () => {
    const result = puzzleEngine.verifyMove('puzzle-1', 'h2', 'h3');
    expect(result.success).toBe(true);
  });

  test('rejects incorrect move and provides helpful directional hint', () => {
    const result = puzzleEngine.verifyMove('puzzle-1', 'a2', 'a3');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Not quite');
    expect(result.hint).toContain('c1');
  });

  test('throws error if puzzle ID does not exist', () => {
    expect(() => {
      puzzleEngine.verifyMove('non-existent-puzzle', 'e2', 'e4');
    }).toThrow(/not found/i);
  });
});
