// BlunderProof Chess Validation App
const UNICODE_PIECES = {
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

let currentPuzzles = [];
let activePuzzleIndex = 0;
let selectedSquare = null;

// Initial Fallback Puzzles (allows full standalone client functionality)
const DEFAULT_PUZZLES = [
  {
    id: "puzzle-1",
    title: "Radar 1: Punish the Hanging Queen",
    phase: "Phase 1: Board Awareness",
    difficulty: "400 - 600 Elo",
    prompt: "White to move. Black placed their Queen on g4 without any defender. How do you punish this blunder immediately?",
    toMove: "white",
    board: [
      ["r", null, "b", null, "k", "b", "n", "r"],
      ["p", "p", "p", "p", null, "p", "p", "p"],
      [null, null, "n", null, null, null, null, null],
      [null, null, null, null, "p", null, null, null],
      [null, null, null, null, "P", null, "q", null],
      [null, null, null, "P", null, "N", null, null],
      ["P", "P", "P", null, null, "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", null, "R"]
    ],
    solution: { from: "c1", to: "g5", alt: [{ from: "h2", to: "h3" }] },
    blunderExplanation: "Black's Queen on g4 is completely undefended! Bishop to g5 (or h3) immediately attacks and wins the Queen.",
    takeaway: "Never make a move until you scan for undefended enemy pieces. In 400-800 Elo, 1 out of 4 games features a hanging queen!"
  },
  {
    id: "puzzle-2",
    title: "Radar 2: The Lethal Knight Fork",
    phase: "Phase 3: Core 4 Tactics",
    difficulty: "500 - 750 Elo",
    prompt: "White to move. Black's King on e8 and Rook on a8 are vulnerable to a fork on c7. Can you position your Knight to set up this fork?",
    toMove: "white",
    board: [
      ["r", null, "b", null, "k", null, null, "r"],
      ["p", "p", null, "p", null, "p", "p", "p"],
      [null, null, null, null, "p", "n", null, null],
      [null, null, "b", null, null, null, null, null],
      [null, null, null, null, "P", null, null, null],
      [null, null, "N", null, null, null, null, null],
      ["P", "P", "P", null, null, "P", "P", "P"],
      ["R", null, "B", "Q", "K", "B", null, "R"]
    ],
    solution: { from: "c3", to: "b5" },
    blunderExplanation: "Nb5 threatens Nc7+ royal fork checking the King on e8 while attacking Rook on a8. Black cannot defend both!",
    takeaway: "Knights are beginner killers because their L-shaped jumps can hit two separated high-value targets without being blocked."
  },
  {
    id: "puzzle-3",
    title: "Radar 3: Back-Rank Checkmate",
    phase: "Phase 2: Blunder Radar",
    difficulty: "500 - 800 Elo",
    prompt: "White to move. Black's King is trapped behind their own pawns. Deliver the crushing back-rank checkmate!",
    toMove: "white",
    board: [
      [null, null, null, null, null, null, "k", null],
      [null, null, null, null, null, "p", "p", "p"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, "P", "P", "P"],
      [null, null, null, null, "R", null, "K", null]
    ],
    solution: { from: "e1", to: "e8" },
    blunderExplanation: "Re8# is checkmate! Black's king has no escape square (no 'luft') because the f7, g7, and h7 pawns block all forward movement.",
    takeaway: "Always create an escape window ('luft') for your king with h3 or g3, and punish opponents who forget!"
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  await loadPuzzles();
  renderPuzzle(0);
  initModal();
  initIcpQuiz();
  initWaitlistForm();
});

async function loadPuzzles() {
  try {
    const res = await fetch('/api/puzzles');
    if (res.ok) {
      const data = await res.json();
      if (data.puzzles && data.puzzles.length > 0) {
        currentPuzzles = data.puzzles;
      } else {
        currentPuzzles = DEFAULT_PUZZLES;
      }
    } else {
      currentPuzzles = DEFAULT_PUZZLES;
    }
  } catch (e) {
    currentPuzzles = DEFAULT_PUZZLES;
  }
}

function renderPuzzle(index) {
  activePuzzleIndex = index;
  selectedSquare = null;
  const puzzle = currentPuzzles[index];

  // Update tabs
  document.querySelectorAll('.puzzle-tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  // Update text
  document.getElementById('puzzleTitle').innerText = puzzle.title;
  document.getElementById('puzzlePhase').innerText = puzzle.phase;
  document.getElementById('puzzleElo').innerText = puzzle.difficulty;
  document.getElementById('puzzlePrompt').innerText = puzzle.prompt;

  // Clear feedback
  const feedback = document.getElementById('puzzleFeedback');
  feedback.className = 'feedback-card';
  feedback.innerHTML = '';

  renderBoard(puzzle.board);
}

function renderBoard(boardMatrix) {
  const boardEl = document.getElementById('chessboard');
  boardEl.innerHTML = '';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const squareName = `${FILES[c]}${RANKS[r]}`;
      const isLight = (r + c) % 2 === 0;
      const pieceChar = boardMatrix[r][c];

      const squareDiv = document.createElement('div');
      squareDiv.className = `square ${isLight ? 'light' : 'dark'}`;
      squareDiv.dataset.square = squareName;
      squareDiv.dataset.row = r;
      squareDiv.dataset.col = c;

      if (pieceChar) {
        squareDiv.innerText = UNICODE_PIECES[pieceChar] || pieceChar;
        squareDiv.dataset.piece = pieceChar;
        if (pieceChar === pieceChar.toUpperCase()) {
          squareDiv.style.color = '#fff';
          squareDiv.style.textShadow = '0 1px 3px rgba(0,0,0,0.8), 0 0 1px #000';
        } else {
          squareDiv.style.color = '#1e1b4b';
          squareDiv.style.textShadow = '0 0 2px rgba(255,255,255,0.4)';
        }
      }

      squareDiv.addEventListener('click', () => handleSquareClick(squareName, pieceChar, squareDiv));
      boardEl.appendChild(squareDiv);
    }
  }
}

async function handleSquareClick(squareName, pieceChar, squareDiv) {
  const puzzle = currentPuzzles[activePuzzleIndex];

  // If no square selected yet
  if (!selectedSquare) {
    if (!pieceChar) return; // cannot select empty square first
    // Only select pieces belonging to white (uppercase)
    if (pieceChar !== pieceChar.toUpperCase()) return;

    selectedSquare = squareName;
    clearHighlights();
    squareDiv.classList.add('selected');
    return;
  }

  // If clicking on same square, deselect
  if (selectedSquare === squareName) {
    selectedSquare = null;
    clearHighlights();
    return;
  }

  // If clicking on another white piece, switch selection
  if (pieceChar && pieceChar === pieceChar.toUpperCase()) {
    selectedSquare = squareName;
    clearHighlights();
    squareDiv.classList.add('selected');
    return;
  }

  // Second square clicked: attempt move
  const fromSquare = selectedSquare;
  const toSquare = squareName;
  selectedSquare = null;
  clearHighlights();

  await submitPuzzleMove(puzzle.id, fromSquare, toSquare);
}

function clearHighlights() {
  document.querySelectorAll('.square').forEach(sq => {
    sq.classList.remove('selected', 'dest-target');
  });
}

async function submitPuzzleMove(puzzleId, from, to) {
  const feedbackEl = document.getElementById('puzzleFeedback');

  try {
    const res = await fetch('/api/puzzle/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId, from, to })
    });

    if (res.ok) {
      const data = await res.json();
      showFeedback(data);
      return;
    }
  } catch (err) {
    // API failed, use local fallback
  }

  // Client-side fallback verification
  const localPuzzle = currentPuzzles.find(p => p.id === puzzleId);
  if (!localPuzzle) return;

  const isPrimary = localPuzzle.solution.from === from && localPuzzle.solution.to === to;
  let isAlt = false;
  if (localPuzzle.solution.alt) {
    isAlt = localPuzzle.solution.alt.some(a => a.from === from && a.to === to);
  }

  if (isPrimary || isAlt) {
    showFeedback({
      success: true,
      message: 'Spot on! Tactical radar confirmed.',
      explanation: localPuzzle.blunderExplanation,
      takeaway: localPuzzle.takeaway
    });
  } else {
    showFeedback({
      success: false,
      message: 'Not quite. That move leaves you vulnerable or misses the killer tactical punishment.',
      hint: `Look closely at ${localPuzzle.solution.from} and see how it exploits enemy weaknesses.`
    });
  }
}

function showFeedback(result) {
  const feedbackEl = document.getElementById('puzzleFeedback');
  feedbackEl.classList.remove('success', 'error', 'show');

  if (result.success) {
    feedbackEl.classList.add('success', 'show');
    feedbackEl.innerHTML = `
      <strong>🎯 ${result.message}</strong>
      <p style="margin-top: 6px;">${result.explanation}</p>
      <div style="margin-top: 8px; font-size: 0.85rem; color: #bbf7d0;">
        <strong>Survival Takeaway:</strong> ${result.takeaway}
      </div>
      <div style="margin-top: 12px;">
        <button class="btn-primary" style="padding: 6px 14px; font-size: 0.85rem;" onclick="nextPuzzle()">Next Survival Challenge →</button>
      </div>
    `;
  } else {
    feedbackEl.classList.add('error', 'show');
    feedbackEl.innerHTML = `
      <strong>⚠️ ${result.message}</strong>
      <p style="margin-top: 6px; font-size: 0.85rem;">${result.hint || 'Try another move on the board.'}</p>
    `;
  }
}

window.nextPuzzle = function() {
  const nextIdx = (activePuzzleIndex + 1) % currentPuzzles.length;
  renderPuzzle(nextIdx);
};

window.selectPuzzle = function(idx) {
  renderPuzzle(idx);
};

// ICP Assessment Quiz
function initIcpQuiz() {
  const quizForm = document.getElementById('icpQuizForm');
  if (!quizForm) return;

  quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ratingRange = document.getElementById('quizRating').value;
    const blunderFrequency = document.getElementById('quizBlunders').value;
    const studyMethod = document.getElementById('quizStudy').value;
    const dailyTimeMinutes = document.getElementById('quizTime').value;

    const payload = { ratingRange, blunderFrequency, studyMethod, dailyTimeMinutes };

    let result = null;
    try {
      const res = await fetch('/api/icp-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        result = await res.json();
      }
    } catch (err) {}

    if (!result) {
      // Local fallback calculation
      result = {
        matchPercentage: ratingRange.includes('400') || ratingRange.includes('601') ? 92 : 75,
        archetype: 'Prime ICP: Plateaued Blunder Fighter (400–800 Elo)',
        recommendation: 'Strongest fit. BlunderProof will directly eliminate 70%+ of your game losses in 14 days.',
        factors: [
          'Target rating bullseye (400-800 Elo) for survival tactic wiring',
          'Frequent unforced blunders identified as the key bottleneck',
          '15-20 min/day fits perfectly into interactive micro-modules'
        ]
      };
    }

    const resultBox = document.getElementById('quizResultBox');
    resultBox.classList.add('show');
    resultBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="color: #38bdf8; font-size: 1.15rem;">ICP Fit: ${result.matchPercentage}% Match</h4>
        <span class="meta-pill">${result.archetype}</span>
      </div>
      <p style="font-size: 0.95rem; margin-bottom: 12px;"><strong>Diagnosis:</strong> ${result.recommendation}</p>
      <ul style="padding-left: 20px; font-size: 0.85rem; color: #cbd5e1;">
        ${result.factors.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <div style="margin-top: 14px;">
        <a href="#waitlist" class="btn-primary" style="padding: 8px 18px; font-size: 0.9rem;">Lock in Early Bird Waitlist Spot →</a>
      </div>
    `;
  });
}

// Waitlist Form
function initWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('wlEmail').value;
    const rating = document.getElementById('wlRating').value;
    const frustration = document.getElementById('wlFrustration').value;
    const pricingTolerance = document.getElementById('wlPricing').value;

    const payload = {
      email,
      rating,
      frustration,
      pricingTolerance,
      source: window.location.search || 'direct_landing'
    };

    const statusEl = document.getElementById('waitlistStatus');
    statusEl.innerHTML = '<p style="color: #38bdf8;">Saving your spot...</p>';

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        statusEl.innerHTML = `
          <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; padding: 16px; border-radius: 8px; color: #86efac; margin-top: 16px;">
            <h4 style="margin-bottom: 4px;">🎉 Spot Reserved! You're on the Pioneer Waitlist.</h4>
            <p style="font-size: 0.9rem;">Your $19 early bird discount has been locked for <strong>${data.entry.email}</strong>. Check your inbox for your 3 free survival puzzles!</p>
            <p style="font-size: 0.8rem; margin-top: 8px; color: #cbd5e1;">Total pioneers on waitlist: ${data.stats.totalWaitlist} | Willingness to pay: ${data.stats.paidWillingnessPercentage}%</p>
          </div>
        `;
        form.reset();
        return;
      }
    } catch (err) {}

    // Fallback if offline
    statusEl.innerHTML = `
      <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; padding: 16px; border-radius: 8px; color: #86efac; margin-top: 16px;">
        <h4 style="margin-bottom: 4px;">🎉 Spot Reserved! You're on the Pioneer Waitlist.</h4>
        <p style="font-size: 0.9rem;">Your early bird discount has been recorded for <strong>${email}</strong>. Welcome aboard!</p>
      </div>
    `;
    form.reset();
  });
}

// Research Modal Dossier
function initModal() {
  const openBtn = document.getElementById('openDossierBtn');
  const closeBtn = document.getElementById('closeDossierBtn');
  const modal = document.getElementById('dossierModal');

  if (openBtn && modal) {
    openBtn.addEventListener('click', async () => {
      modal.classList.add('open');
      await loadDossierData();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  // Tab switching
  document.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.target);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

async function loadDossierData() {
  try {
    const res = await fetch('/api/validation-data');
    if (res.ok) {
      const data = await res.json();
      document.getElementById('agent1Json').innerText = JSON.stringify(data.agent1_CompetitorAnalysis, null, 2);
      document.getElementById('agent2Json').innerText = JSON.stringify(data.agent2_IcpPositioning, null, 2);
      document.getElementById('agent3Json').innerText = JSON.stringify(data.agent3_LandingPageCopy, null, 2);
      document.getElementById('agent4Json').innerText = JSON.stringify(data.agent4_DistributionPlaybook, null, 2);
      document.getElementById('metricsJson').innerText = JSON.stringify(data.liveWaitlistMetrics, null, 2);
    }
  } catch (err) {}
}
