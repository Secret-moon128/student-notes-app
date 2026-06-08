# The Operator Search Grid

A cyberpunk dark-lab math puzzle application built with vanilla HTML5, CSS3, and JavaScript (ES6+). Solve procedurally generated equations by selecting operators (+, -, *, /) from a 4×4 grid — but watch the timer!

## Features

- **Procedural Equation Generator** — Generates 3–4 whole numbers with a hidden operator sequence and a clean integer target result.
- **Custom PEMDAS Engine** — No `eval()`. A two-pass calculator resolves `*` and `/` first, then `+` and `-`.
- **Interactive 4×4 Operator Grid** — 16 operator buttons with balanced distribution; click to pipe an operator into the next empty equation slot.
- **Instant Validation** — When all slots are filled, your answer is checked against the target. Correct = +10pts and streak up; wrong = shake animation and slot clear.
- **25-Second Timer** — Shrinking cyan bar turns crimson under 25%. Timeout resets your streak to zero and spawns a new equation.
- **Best Streak Caching** — Highest streak is persisted in `localStorage`.
- **Clear & Skip** — Clear your current operator path or skip to a new equation (streak resets on skip).
- **Cyberpunk Dark Theme** — `#080b11` canvas, glassmorphic cards, electric gold targets, neon emerald success, crimson alerts.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — `backdrop-filter` glassmorphism, CSS Grid, `@keyframes` shake animation, `vmin` scaling
- Vanilla JS (ES6+) — PEMDAS calculator, interval timer, `localStorage`, dynamic grid rendering

## Rules

1. An equation with missing operators is displayed (e.g., `5 [ ? ] 2 [ ? ] 4 = 14`).
2. Click operators from the 4×4 grid to fill the slots left to right.
3. Once all slots are filled, the engine validates using PEMDAS order of operations.
4. Correct = +10 points and streak increases. Wrong = slots clear, try again.
5. The 25-second timer resets each round. If it hits zero, your streak resets.

## Usage

1. Open `index.html` in any modern browser.
2. Click operator buttons to fill the `[ ? ]` slots in the equation.
3. Watch the timer bar — it shrinks as time runs out.
4. Click **↺ Clear Path** to reset your operator choices.
5. Click **⏭ Skip** to generate a new equation (streak resets).

## Project Structure

```
The Operator Search Grid/
├── index.html        # Main entry point
├── style.css         # Cyberpunk dark dashboard theme
├── script.js         # Game engine & PEMDAS calculator
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
