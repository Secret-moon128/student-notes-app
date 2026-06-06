# Quantum Tic-Tac-Toe

A cyberpunk neon-themed tic-tac-toe variant with a quantum twist — each player can only keep **3 tokens** on the board at a time. Placing a 4th removes the oldest one via FIFO queue logic.

## Features

- **FIFO Token Lifespan** — Each player maintains a queue of up to 3 board positions. The 4th placement `.shift()`s the oldest and `.push()`es the new one.
- **Token Fade Warning** — The oldest token of the current player pulses with a decaying opacity animation, giving a strategic heads-up that it will vanish on the next move.
- **Real-Time Win Detection** — Evaluates all 8 horizontal, vertical, and diagonal paths after every token addition and removal. Removing a token correctly alters win possibilities.
- **Neon Cyberpunk Aesthetic** — Cyan glow (`#06b6d4`) for Player X, hot pink glow (`#d946ef`) for Player O on a deep `#0a0f1d` canvas.
- **Token Pop Animation** — New tokens scale-bounce in; fading tokens oscillate rhythmically.
- **Responsive** — Grid scales with `vmin` for perfect alignment on any screen size.
- **Reset** — One-click button wipes the grid, queues, and turn state.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — CSS Grid, `backdrop-filter`, `@keyframes` animations, `vmin` scaling
- Vanilla JS (ES6+) — FIFO queue arrays, win-path matrix evaluation, event delegation

## Rules

1. Players take turns placing **X** or **O** on the 3×3 board.
2. Each player can have **at most 3 tokens** on the board at once.
3. When you place a 4th token, your **oldest token** is automatically removed.
4. The oldest token of the active player pulses as a visual warning.
5. Standard tic-tac-toe win conditions apply — first to 3 in a row wins.

## Usage

1. Open `index.html` in any modern browser.
2. Click any empty cell to place your token.
3. Watch the oldest token fade — it will vanish on your next move.
4. The game announces a win or draw in the status bar.
5. Click **⟳ New Game** to reset.

## Project Structure

```
Quantum Tic-Tac-Toe/
├── index.html        # Main entry point
├── style.css         # Cyberpunk neon theme
├── script.js         # Game engine & FIFO queues
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
