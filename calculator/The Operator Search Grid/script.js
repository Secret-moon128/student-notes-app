/* ═══════════════════════════════════════════════════════
   The Operator Search Grid — Game Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Constants ───
  const TIMER_DURATION = 25;
  const BEST_KEY = 'operatorGridBest';
  const OPERATORS = ['+', '-', '*', '/'];
  const GRID_SIZE = 16;

  // ─── State ───
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let numbers = [];
  let correctOperators = [];
  let targetResult = 0;
  let userSlots = [];
  let currentSlot = 0;
  let timer = TIMER_DURATION;
  let timerInterval = null;
  let isPlaying = false;

  // ─── DOM ───
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const dom = {};

  function cacheDom() {
    dom.score = $('#score');
    dom.streak = $('#streak');
    dom.bestStreak = $('#best-streak');
    dom.timerBar = $('#timer-bar');
    dom.equation = $('#equation');
    dom.resultTarget = $('#result-target');
    dom.opGrid = $('#op-grid');
    dom.feedback = $('#feedback');
    dom.btnClear = $('#btn-clear');
    dom.btnSkip = $('#btn-skip');
  }

  // ─── Storage ───
  function loadBest() {
    try {
      const v = localStorage.getItem(BEST_KEY);
      if (v) bestStreak = parseInt(v, 10) || 0;
    } catch { bestStreak = 0; }
  }

  function saveBest() {
    try { localStorage.setItem(BEST_KEY, String(bestStreak)); } catch { /* ignore */ }
  }

  // ─── PEMDAS Calculator (no eval) ───
  function calculatePEMDAS(nums, ops) {
    const n = [...nums];
    const o = [...ops];

    // Phase 1: *, /
    let i = 0;
    while (i < o.length) {
      if (o[i] === '*' || o[i] === '/') {
        const a = n[i];
        const b = n[i + 1];
        let val;
        if (o[i] === '*') {
          val = a * b;
        } else {
          if (b === 0) return NaN;
          val = a / b;
        }
        n.splice(i, 2, val);
        o.splice(i, 1);
      } else {
        i++;
      }
    }

    // Phase 2: +, -
    let result = n[0];
    for (let j = 0; j < o.length; j++) {
      if (o[j] === '+') result += n[j + 1];
      else if (o[j] === '-') result -= n[j + 1];
    }

    return result;
  }

  // ─── Equation Generator ───
  function generateEquation() {
    const numCount = Math.random() < 0.5 ? 3 : 4;
    const nums = [];
    for (let i = 0; i < numCount; i++) {
      nums.push(Math.floor(Math.random() * 15) + 1);
    }

    const ops = [];
    for (let i = 0; i < numCount - 1; i++) {
      ops.push(OPERATORS[Math.floor(Math.random() * OPERATORS.length)]);
    }

    const result = calculatePEMDAS(nums, ops);

    // Retry if not a clean integer or negative or too large
    if (!Number.isInteger(result) || result < 0 || result > 999 || !isFinite(result)) {
      return generateEquation();
    }

    return { numbers: nums, operators: ops, result };
  }

  // ─── Start New Round ───
  function newRound() {
    stopTimer();
    const eq = generateEquation();
    numbers = eq.numbers;
    correctOperators = eq.operators;
    targetResult = eq.result;

    userSlots = new Array(numbers.length - 1).fill(null);
    currentSlot = 0;
    isPlaying = true;

    dom.feedback.textContent = '';
    dom.feedback.className = 'feedback';

    renderEquation();
    renderGrid();
    startTimer();
  }

  // ─── Render Equation ───
  function renderEquation() {
    let html = '';
    for (let i = 0; i < numbers.length; i++) {
      html += `<span class="num-block">${numbers[i]}</span>`;
      if (i < numbers.length - 1) {
        const val = userSlots[i];
        html += `<span class="slot-block${val !== null ? ' filled' : ''}" data-slot="${i}">${val !== null ? val : '?'}</span>`;
      }
    }
    dom.equation.innerHTML = html;
    dom.resultTarget.textContent = `= ${targetResult}`;
  }

  // ─── Render Operator Grid ───
  function renderGrid() {
    // Create 16 buttons with balanced operator distribution
    const ops = [];
    const perOp = Math.floor(GRID_SIZE / OPERATORS.length);
    OPERATORS.forEach((op) => {
      for (let i = 0; i < perOp; i++) ops.push(op);
    });
    while (ops.length < GRID_SIZE) {
      ops.push(OPERATORS[Math.floor(Math.random() * OPERATORS.length)]);
    }
    // Shuffle
    for (let i = ops.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ops[i], ops[j]] = [ops[j], ops[i]];
    }

    dom.opGrid.innerHTML = ops
      .map((op) => `<button class="op-btn" data-op="${op}">${op}</button>`)
      .join('');
  }

  // ─── Place Operator ───
  function placeOperator(op) {
    if (!isPlaying) return;
    if (currentSlot >= userSlots.length) return;

    userSlots[currentSlot] = op;
    currentSlot++;
    renderEquation();

    // If all slots filled, validate
    if (currentSlot === userSlots.length) {
      validateAnswer();
    }
  }

  // ─── Validate ───
  function validateAnswer() {
    isPlaying = false;
    stopTimer();

    const userResult = calculatePEMDAS(numbers, userSlots);

    if (userResult === targetResult) {
      score += 10;
      streak++;
      if (streak > bestStreak) {
        bestStreak = streak;
        saveBest();
      }
      dom.feedback.textContent = 'Correct! +10pts';
      dom.feedback.className = 'feedback correct';
      updateStats();

      setTimeout(() => newRound(), 1200);
    } else {
      dom.feedback.textContent = 'Incorrect — try again';
      dom.feedback.className = 'feedback wrong';
      // Shake then clear
      setTimeout(() => {
        clearSlots();
        isPlaying = true;
        startTimer();
      }, 800);
    }
  }

  // ─── Clear Slots ───
  function clearSlots() {
    userSlots.fill(null);
    currentSlot = 0;
    dom.feedback.textContent = '';
    dom.feedback.className = 'feedback';
    renderEquation();
  }

  // ─── Skip ───
  function skipRound() {
    stopTimer();
    streak = 0;
    updateStats();
    newRound();
  }

  // ─── Timer ───
  function startTimer() {
    timer = TIMER_DURATION;
    dom.timerBar.style.width = '100%';
    dom.timerBar.classList.remove('danger');

    timerInterval = setInterval(() => {
      timer -= 0.1;
      const pct = (timer / TIMER_DURATION) * 100;
      dom.timerBar.style.width = Math.max(0, pct) + '%';
      if (pct < 25) dom.timerBar.classList.add('danger');

      if (timer <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 100);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function handleTimeout() {
    isPlaying = false;
    streak = 0;
    updateStats();
    dom.feedback.textContent = '⏰ Time\'s up! Streak reset.';
    dom.feedback.className = 'feedback timeout';

    setTimeout(() => newRound(), 1400);
  }

  // ─── Update Stats ───
  function updateStats() {
    dom.score.textContent = score;
    dom.streak.textContent = streak;
    dom.bestStreak.textContent = bestStreak;
  }

  // ─── Events ───
  function setupEvents() {
    dom.opGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.op-btn');
      if (!btn) return;
      placeOperator(btn.dataset.op);
    });

    dom.btnClear.addEventListener('click', () => {
      if (!isPlaying) return;
      stopTimer();
      clearSlots();
      startTimer();
    });

    dom.btnSkip.addEventListener('click', skipRound);
  }

  // ─── Init ───
  function init() {
    cacheDom();
    loadBest();
    updateStats();
    newRound();
    setupEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
