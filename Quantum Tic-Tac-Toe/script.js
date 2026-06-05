/* ═══════════════════════════════════════════════════════
   Quantum Tic-Tac-Toe — Game Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Constants ───
  const WIN_PATHS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],             // diags
  ];

  const MAX_TOKENS = 3;

  // ─── State ───
  let grid = new Array(9).fill(null);
  let playerXQueue = [];  // FIFO queue of index positions
  let playerOQueue = [];
  let currentPlayer = 'X';
  let gameOver = false;
  let winner = null;

  // ─── DOM ───
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const dom = {};

  function cacheDom() {
    dom.board = $('#board');
    dom.cells = $$('.cell');
    dom.turnToken = $('#turn-token');
    dom.turnBanner = $('#turn-banner');
    dom.statusBar = $('#status-bar');
    dom.btnReset = $('#btn-reset');
  }

  // ─── Helpers ───
  function getQueue() {
    return currentPlayer === 'X' ? playerXQueue : playerOQueue;
  }

  function otherPlayer() {
    return currentPlayer === 'X' ? 'O' : 'X';
  }

  function switchTurn() {
    currentPlayer = otherPlayer();
    updateTurnDisplay();
  }

  // ─── Win Detection ───
  function checkWin() {
    for (const path of WIN_PATHS) {
      const [a, b, c] = path;
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return { winner: grid[a], path };
      }
    }
    return null;
  }

  // ─── Oldest token index for current player (fading) ───
  function getFadingIndex() {
    const q = getQueue();
    // fading token is the oldest = first in queue (if at max capacity)
    if (q.length >= MAX_TOKENS) {
      return q[0];
    }
    return null;
  }

  // ─── FIFO Place ───
  function placeToken(index) {
    if (gameOver) return false;
    if (grid[index] !== null) return false;

    const queue = getQueue();

    // If already at max, shift oldest and wipe it
    if (queue.length >= MAX_TOKENS) {
      const oldest = queue.shift();
      grid[oldest] = null;
      // clear the cell visually (will be re-rendered)
    }

    // Place new token
    grid[index] = currentPlayer;
    queue.push(index);

    return true;
  }

  // ─── Render ───
  function render() {
    // Clear all cells
    dom.cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'cell';
      cell.classList.remove('taken', 'game-over');
    });

    // Paint grid state
    for (let i = 0; i < 9; i++) {
      const cell = dom.board.querySelector(`[data-index="${i}"]`);
      if (!cell) continue;
      const val = grid[i];
      if (val) {
        cell.textContent = val;
        cell.classList.add('taken', val.toLowerCase());
      }
    }

    // Apply fading highlight to oldest token of current player
    const fadeIdx = getFadingIndex();
    if (fadeIdx !== null && grid[fadeIdx] !== null && !gameOver) {
      const fadeCell = dom.board.querySelector(`[data-index="${fadeIdx}"]`);
      if (fadeCell) {
        fadeCell.classList.add('token-fading');
      }
    }

    // Win highlight
    const result = checkWin();
    if (result) {
      result.path.forEach((i) => {
        const wc = dom.board.querySelector(`[data-index="${i}"]`);
        if (wc) wc.classList.add('win-highlight');
      });
      // Remove fading from win cells
      result.path.forEach((i) => {
        const wc = dom.board.querySelector(`[data-index="${i}"]`);
        if (wc) wc.classList.remove('token-fading');
      });
    }
  }

  // ─── Turn Display ───
  function updateTurnDisplay() {
    dom.turnToken.textContent = currentPlayer;
    dom.turnToken.className = 'turn-token';
    dom.turnToken.classList.add(currentPlayer === 'X' ? 'x-turn' : 'o-turn');

    if (!gameOver) {
      dom.statusBar.textContent = `Player ${currentPlayer}'s turn`;
      dom.statusBar.className = 'status-bar';
    }
  }

  // ─── Game Over ───
  function setGameOver(result) {
    gameOver = true;
    dom.cells.forEach((c) => c.classList.add('game-over'));

    if (result) {
      winner = result.winner;
      dom.statusBar.textContent = `✨ Player ${winner} wins! ✨`;
      dom.statusBar.className = 'status-bar win';
    } else {
      dom.statusBar.textContent = 'Draw';
      dom.statusBar.className = 'status-bar draw';
    }
  }

  // ─── Check draw ───
  function isDraw() {
    return grid.every((c) => c !== null);
  }

  // ─── Handle Move ───
  function handleMove(index) {
    if (gameOver) return;

    if (!placeToken(index)) return;

    render();

    // Check win
    const result = checkWin();
    if (result) {
      render(); // re-render with win highlights
      setGameOver(result);
      return;
    }

    // Check draw
    if (isDraw()) {
      setGameOver(null);
      return;
    }

    switchTurn();
    updateTurnDisplay();
    render(); // re-render to update fading token
  }

  // ─── Reset ───
  function resetGame() {
    grid = new Array(9).fill(null);
    playerXQueue = [];
    playerOQueue = [];
    currentPlayer = 'X';
    gameOver = false;
    winner = null;

    dom.cells.forEach((c) => {
      c.className = 'cell';
      c.textContent = '';
    });

    updateTurnDisplay();
    dom.statusBar.textContent = 'Place your first token';
    dom.statusBar.className = 'status-bar';
  }

  // ─── Events ───
  function setupEvents() {
    dom.board.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const index = parseInt(cell.dataset.index, 10);
      handleMove(index);
    });

    dom.btnReset.addEventListener('click', resetGame);
  }

  // ─── Init ───
  function init() {
    cacheDom();
    resetGame();
    setupEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
