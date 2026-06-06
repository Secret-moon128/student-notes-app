/* ═══════════════════════════════════════════════════════
   Simulated Crypto Trading Ledger — Trading Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM ─── */
  const balanceEl = document.getElementById('balance');
  const holdingsEl = document.getElementById('holdings');
  const avgEntryEl = document.getElementById('avg-entry');
  const netWorthEl = document.getElementById('net-worth');
  const priceEl = document.getElementById('price');
  const changeEl = document.getElementById('change');
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');
  const qtyInput = document.getElementById('qty-input');
  const buyBtn = document.getElementById('buy-btn');
  const sellBtn = document.getElementById('sell-btn');
  const estCostEl = document.getElementById('est-cost');
  const dockMsg = document.getElementById('dock-msg');
  const ledgerBody = document.getElementById('ledger-body');

  /* ─── Constants ─── */
  const LS_KEY = 'sctl_state';
  const CANVAS_W = 600, CANVAS_H = 220;
  const MAX_POINTS = 60;                // keep last 60 ticks
  const STARTING_BALANCE = 10000;
  const STARTING_PRICE = 100;
  const VOLATILITY = 0.05;
  const TICK_INTERVAL = 1000;           // 1 second

  /* ─── State ─── */
  let balance = STARTING_BALANCE;
  let holdings = 0;                     // token count
  let avgEntry = 0;
  let price = STARTING_PRICE;
  let prevPrice = price;
  let priceHistory = [];                // array of { time, price }
  let transactions = [];
  let tickId = null;
  let chartAnimId = null;
  let running = false;

  /* ─── Format helpers ─── */
  const fmt = (n) => '$' + n.toFixed(2);
  const fmtTokens = (n) => n.toFixed(4);
  const fmtPrice = (n) => n.toFixed(2);

  /* ─── Init / Load ─── */
  function init () {
    loadState();
    updateUI();
    drawChart();
    qtyInput.addEventListener('input', updateEstCost);
    buyBtn.addEventListener('click', () => executeOrder('BUY'));
    sellBtn.addEventListener('click', () => executeOrder('SELL'));
    startTicker();
  }

  /* ─── Persistence ─── */
  function saveState () {
    try {
      const data = { balance, holdings, avgEntry, price, priceHistory, transactions };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function loadState () {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.balance === 'number') balance = data.balance;
      if (typeof data.holdings === 'number') holdings = data.holdings;
      if (typeof data.avgEntry === 'number') avgEntry = data.avgEntry;
      if (typeof data.price === 'number') { price = data.price; prevPrice = price; }
      if (Array.isArray(data.priceHistory)) priceHistory = data.priceHistory;
      if (Array.isArray(data.transactions)) transactions = data.transactions;
    } catch (_) {}
  }

  /* ─── Random-walk tick ─── */
  function tick () {
    const change = (Math.random() - 0.48) * VOLATILITY;
    prevPrice = price;
    price = price * (1 + change);
    if (price < 0.01) price = 0.01;

    priceHistory.push({ time: Date.now(), price });
    if (priceHistory.length > MAX_POINTS) priceHistory.shift();

    updateUI();
    drawChart();
    updateEstCost();
    saveState();
  }

  function startTicker () {
    if (running) return;
    running = true;
    tick();
    tickId = setInterval(tick, TICK_INTERVAL);
  }

  /* ─── Orders ─── */
  function executeOrder (type) {
    const qty = parseFloat(qtyInput.value);
    if (isNaN(qty) || qty <= 0) {
      setMsg('Enter a valid quantity', 'error');
      return;
    }

    const total = qty * price;

    if (type === 'BUY') {
      if (total > balance) {
        setMsg('Insufficient fiat balance', 'error');
        return;
      }
      balance -= total;
      // Recalc average entry price
      avgEntry = holdings > 0
        ? (holdings * avgEntry + qty * price) / (holdings + qty)
        : price;
      holdings += qty;
    } else {
      if (qty > holdings) {
        setMsg('Insufficient token holdings', 'error');
        return;
      }
      holdings -= qty;
      balance += total;
      // If fully sold, reset avg entry
      if (holdings < 0.0001) avgEntry = 0;
    }

    const tx = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toLocaleTimeString(),
      type,
      qty: Math.round(qty * 10000) / 10000,
      price: Math.round(price * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
    transactions.unshift(tx);
    renderLedger();
    updateUI();
    setMsg(type === 'BUY' ? 'Order filled' : 'Order filled', 'success');
    saveState();
  }

  /* ─── UI ─── */
  function updateUI () {
    const netWorth = balance + holdings * price;
    const pct = ((price - prevPrice) / prevPrice) * 100;
    const isUp = pct >= 0;

    balanceEl.textContent = fmt(balance);
    holdingsEl.textContent = fmtTokens(holdings);
    avgEntryEl.textContent = avgEntry > 0 ? fmt(avgEntry) : '$—';
    priceEl.textContent = '$' + fmtPrice(price);
    changeEl.textContent = (isUp ? '+' : '') + pct.toFixed(2) + '%';
    changeEl.className = 'ticker-change ' + (isUp ? 'up' : 'down');

    netWorthEl.textContent = fmt(netWorth);
    netWorthEl.className = 's-value accent' + (netWorth < STARTING_BALANCE ? ' down' : '');
  }

  function updateEstCost () {
    const qty = parseFloat(qtyInput.value) || 0;
    estCostEl.textContent = fmt(qty * price);
  }

  function setMsg (text, type) {
    dockMsg.textContent = text;
    dockMsg.className = 'dock-msg' + (type ? ' ' + type : '');
    if (type) setTimeout(() => { dockMsg.textContent = ''; dockMsg.className = 'dock-msg'; }, 3000);
  }

  /* ─── Chart ─── */
  function drawChart () {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = '#080c18';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (priceHistory.length < 2) {
      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for data…', CANVAS_W / 2, CANVAS_H / 2);
      return;
    }

    const data = priceHistory;
    const pad = 16;
    const w = CANVAS_W - pad * 2;
    const h = CANVAS_H - pad * 2;

    // Y range
    let min = data[0].price, max = data[0].price;
    for (const d of data) {
      if (d.price < min) min = d.price;
      if (d.price > max) max = d.price;
    }
    const range = max - min || 1;
    const margin = range * 0.1;
    min -= margin;
    max += margin;
    const yRange = max - min || 1;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const y = pad + (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(pad + w, y);
      ctx.stroke();
    }

    // Line
    const isUp = data[data.length - 1].price >= data[0].price;
    ctx.strokeStyle = isUp ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.shadowColor = isUp ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)';
    ctx.shadowBlur = 6;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = pad + (i / (data.length - 1)) * w;
      const y = pad + h - ((data[i].price - min) / yRange) * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fill under line
    ctx.lineTo(pad + w, pad + h);
    ctx.lineTo(pad, pad + h);
    ctx.closePath();
    ctx.fillStyle = isUp ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)';
    ctx.fill();

    // Current price label
    const last = data[data.length - 1].price;
    const lx = pad + w;
    const ly = pad + h - ((last - min) / yRange) * h;
    ctx.fillStyle = isUp ? '#10b981' : '#ef4444';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(fmtPrice(last), lx + 4, ly + 3);
  }

  /* ─── Ledger ─── */
  function renderLedger () {
    if (transactions.length === 0) {
      ledgerBody.innerHTML = '<tr><td colspan="5" class="ledger-empty">No transactions yet</td></tr>';
      return;
    }

    ledgerBody.innerHTML = '';
    for (const tx of transactions) {
      const tr = document.createElement('tr');
      tr.className = tx.type.toLowerCase();
      tr.innerHTML =
        '<td>' + tx.type + '</td>' +
        '<td>' + fmtTokens(tx.qty) + '</td>' +
        '<td>$' + fmtPrice(tx.price) + '</td>' +
        '<td>$' + fmtPrice(tx.total) + '</td>' +
        '<td>' + tx.timestamp + '</td>';
      ledgerBody.appendChild(tr);
    }
  }

  /* ─── Boot ─── */
  init();
  renderLedger();
  updateEstCost();

})();
