/* ── Canvas Setup ── */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = 600;
const H = 800;

/* ─── Candy Colors ─── */

const CANDY_COLORS = [
  { fill: '#ff69b4', glow: 'rgba(255,105,180,0.35)', name: 'pink' },
  { fill: '#ffeb3b', glow: 'rgba(255,235,59,0.35)',  name: 'yellow' },
  { fill: '#00e5ff', glow: 'rgba(0,229,255,0.35)',   name: 'cyan' },
  { fill: '#76ff03', glow: 'rgba(118,255,3,0.35)',   name: 'lime' },
  { fill: '#ff6d00', glow: 'rgba(255,109,0,0.35)',   name: 'orange' },
];

/* ── Game Config ── */

const INITIAL_SPEED = 2.5;
const SPEED_STEP = 0.3;
const SPEED_INTERVAL = 10;
const SPAWN_INTERVAL = 1300;
const CANDY_SIZE = 22;
const BOMB_SIZE = 26;
const BASKET_W = 88;
const BASKET_H = 18;
const BASKET_Y = H - 48;
const MAX_LIVES = 3;
const BOMB_CHANCE = 0.3;

/* ── DOM Refs ── */

const scoreDisplay = document.getElementById('scoreDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const bestDisplay = document.getElementById('bestDisplay');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const finalScore = document.getElementById('finalScore');
const finalBest = document.getElementById('finalBest');

/* ── State ── */

let state = 'menu';
let score = 0;
let highScore = 0;
let lives = MAX_LIVES;
let baseSpeed = INITIAL_SPEED;
let items = [];
let particles = [];
let lastSpawn = 0;
let animId = null;
let basketX = W / 2 - BASKET_W / 2;

/* ── Item Spawn ── */

function spawnItem() {
  const isBomb = Math.random() < BOMB_CHANCE;
  const size = isBomb ? BOMB_SIZE : CANDY_SIZE;
  const margin = 12;
  const x = margin + Math.random() * (W - 2 * margin - size);
  items.push({
    x, y: -size,
    w: size, h: size,
    isBomb,
    colorIndex: isBomb ? -1 : Math.floor(Math.random() * CANDY_COLORS.length),
    speed: baseSpeed + Math.random() * 0.6,
  });
}

/* ── Particles ── */

function burstParticles(x, y, color, count, spread) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 1 + Math.random() * spread;
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      size: 3 + Math.random() * 4,
      color,
      life: 1,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life -= 0.025;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

/* ── Game Loop ── */

function loop(ts) {
  if (state === 'playing') {
    update(ts);
    draw();
  }
  animId = requestAnimationFrame(loop);
}

function update(ts) {
  updateParticles();

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    item.y += item.speed;

    if (collides(item)) {
      if (item.isBomb) {
        onBomb(i);
      } else {
        onCandy(i);
      }
      if (state !== 'playing') return;
      continue;
    }

    if (item.y > H) {
      if (item.isBomb) {
        items.splice(i, 1);
      } else {
        onMiss(i);
        if (state !== 'playing') return;
      }
    }
  }

  if (ts - lastSpawn > SPAWN_INTERVAL) {
    spawnItem();
    lastSpawn = ts;
  }
}

function collides(item) {
  return item.x < basketX + BASKET_W &&
         item.x + item.w > basketX &&
         item.y < BASKET_Y + BASKET_H &&
         item.y + item.h > BASKET_Y;
}

/* ── Events ── */

function onCandy(index) {
  const item = items[index];
  const color = CANDY_COLORS[item.colorIndex].fill;
  burstParticles(item.x + item.w / 2, item.y + item.h / 2, color, 10, 3);
  items.splice(index, 1);
  score++;

  canvas.classList.remove('match-flash');
  void canvas.offsetWidth;
  canvas.classList.add('match-flash');

  if (score % SPEED_INTERVAL === 0) {
    baseSpeed += SPEED_STEP;
  }

  updateHUD();
}

function onBomb(index) {
  const item = items[index];
  burstParticles(item.x + item.w / 2, item.y + item.h / 2, '#ff4500', 18, 4);
  burstParticles(item.x + item.w / 2, item.y + item.h / 2, '#ffd700', 10, 3);
  items.splice(index, 1);
  lives--;
  triggerShake();
  updateHUD();
  if (lives <= 0) endGame();
}

function onMiss(index) {
  const item = items[index];
  burstParticles(item.x + item.w / 2, item.y + item.h / 2, '#94a3b8', 6, 2);
  items.splice(index, 1);
  lives--;
  if (lives <= 0) { endGame(); return; }
  updateHUD();
}

function triggerShake() {
  canvas.classList.remove('shake');
  void canvas.offsetWidth;
  canvas.classList.add('shake');
}

/* ── Draw ── */

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0d0d18');
  grad.addColorStop(1, '#141428');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawBasket() {
  const bx = basketX;
  const by = BASKET_Y;

  ctx.shadowColor = '#8B4513';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo(bx, by + BASKET_H, bx + BASKET_W * 0.5, by + BASKET_H + 4);
  ctx.quadraticCurveTo(bx + BASKET_W, by + BASKET_H, bx + BASKET_W, by);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#a0522d';
  ctx.fillRect(bx + 4, by + 2, BASKET_W - 8, 4);

  ctx.fillStyle = '#6B3410';
  ctx.fillRect(bx + 2, by, BASKET_W - 4, 2);
}

function drawItems() {
  for (const item of items) {
    const cx = item.x + item.w / 2;
    const cy = item.y + item.h / 2;
    const r = item.w / 2;

    if (item.isBomb) {
      ctx.shadowColor = '#ff4500';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#2d2d2d';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ff4500';
      ctx.font = `${r + 2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('\u2717', cx, cy + 1);

      ctx.strokeStyle = '#ff4500';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const c = CANDY_COLORS[item.colorIndex];
      ctx.shadowColor = c.glow;
      ctx.shadowBlur = 14;
      ctx.fillStyle = c.fill;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function draw() {
  drawBackground();
  drawItems();
  drawParticles();
  drawBasket();
}

/* ── HUD ── */

function renderLives() {
  livesDisplay.textContent = '';
  for (let i = 0; i < lives; i++) {
    const span = document.createElement('span');
    span.textContent = '\u2665';
    span.style.color = '#ff69b4';
    span.style.marginRight = '2px';
    livesDisplay.appendChild(span);
  }
}

function updateHUD() {
  scoreDisplay.textContent = String(score);
  bestDisplay.textContent = String(highScore);
  renderLives();
}

/* ── Session ── */

function startGame() {
  score = 0;
  lives = MAX_LIVES;
  baseSpeed = INITIAL_SPEED;
  items = [];
  particles = [];
  lastSpawn = 0;
  basketX = W / 2 - BASKET_W / 2;

  startOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');

  updateHUD();
  state = 'playing';
  lastSpawn = performance.now();
}

function endGame() {
  state = 'gameOver';

  if (score > highScore) {
    highScore = score;
    saveBest();
  }

  finalScore.textContent = String(score);
  finalBest.textContent = String(highScore);
  bestDisplay.textContent = String(highScore);

  gameOverOverlay.classList.remove('hidden');
}

/* ── High Score ── */

function loadBest() {
  try {
    const v = localStorage.getItem('candyCollectorBest');
    if (v !== null) highScore = parseInt(v, 10) || 0;
  } catch (_) {}
  bestDisplay.textContent = String(highScore);
}

function saveBest() {
  try { localStorage.setItem('candyCollectorBest', String(highScore)); } catch (_) {}
}

/* ── Keyboard ── */

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' && state === 'playing') {
    basketX = Math.max(0, basketX - 16);
  }
  if (e.code === 'ArrowRight' && state === 'playing') {
    basketX = Math.min(W - BASKET_W, basketX + 16);
  }
});

/* ── Mouse ── */

canvas.addEventListener('mousemove', (e) => {
  if (state !== 'playing') return;
  const rect = canvas.getBoundingClientRect();
  const sx = W / rect.width;
  const mx = (e.clientX - rect.left) * sx;
  basketX = Math.max(0, Math.min(W - BASKET_W, mx - BASKET_W / 2));
});

/* ── Touch ── */

canvas.addEventListener('touchmove', (e) => {
  if (state !== 'playing') return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const sx = W / rect.width;
  const mx = (e.touches[0].clientX - rect.left) * sx;
  basketX = Math.max(0, Math.min(W - BASKET_W, mx - BASKET_W / 2));
}, { passive: false });

/* ── Events ── */

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

/* ── Boot ── */

loadBest();
updateHUD();
loop(performance.now());
