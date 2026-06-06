# Simulated Crypto Trading Ledger

A Bloomberg-style simulated crypto trading terminal built with vanilla HTML5, CSS3, and JavaScript (ES6+). Watch NEXA Token's price evolve via a random-walk model, execute buy/sell orders with guard clauses, and track your portfolio across sessions.

## Features

- **Random-Walk Price Simulation** — 1-second tick interval using `Price × (1 + (random − 0.48) × Volatility)` for realistic market momentum. NEXA Token starts at $100.00.
- **Live Canvas Sparkline** — 60-point rolling chart with auto-scaling Y-axis, green/red line colour based on trend, and area fill under the curve.
- **Order Execution Desk** — Enter a quantity and click **Buy** or **Sell**. Guard clauses block purchases exceeding your fiat balance and sells exceeding your token holdings. Average entry price is recalculated on each trade.
- **Transaction History Ledger** — Every trade creates an immutable record (`id`, `timestamp`, `type`, `qty`, `price`, `total`) pushed into a scrollable table with smooth row-animation fades.
- **Portfolio Dashboard** — Real-time display of fiat balance, NEXA holdings, average entry price, and net worth (balance + holdings × current price).
- **Persistent State** — All state (balance, holdings, price history, transactions) serialised to `localStorage`. Refresh or close and reopen to resume exactly where you left off.
- **Bloomberg Dark Theme** — `#06090e` matte black canvas, `#10b981` green gains, `#ef4444` red losses, glassmorphic panels, monospace tabular data.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — `backdrop-filter` glassmorphism, `@keyframes` row fade, custom scrollbar, `vmin` responsive scaling
- Vanilla JS (ES6+) — `setInterval` price loop, Canvas 2D chart rendering, state object management, `localStorage` serialization

## Trading Rules

1. You start with **$10,000.00 USD** and **0 NEXA** tokens.
2. The NEXA price updates every second via random-walk.
3. Enter a quantity and click **Buy** to purchase tokens at the current price.
4. Click **Sell** to liquidate tokens at the current price.
5. You cannot buy more than your fiat balance allows.
6. You cannot sell more tokens than you hold.
7. Your average entry price updates automatically on each buy.
8. Refresh or revisit — your portfolio is saved.

## Usage

1. Open `index.html` in any modern browser.
2. Watch the NEXA price tick and chart update in real time.
3. Type a quantity and click **Buy** or **Sell**.
4. Monitor your portfolio in the status bar and history in the ledger.
5. Close and reopen — your state is restored from `localStorage`.

## Project Structure

```
Simulated Crypto Trading Ledger/
├── index.html        # Main entry point
├── style.css         # Bloomberg dark theme
├── script.js         # Trading engine
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
