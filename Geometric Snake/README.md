# Geometric Snake

A vector-lab puzzle game built with vanilla HTML5, CSS3, and JavaScript (ES6+). Move a snake around an 8×8 peg grid using arrow keys or WASD. Enclose a **RIGHT TRIANGLE** or **PERFECT SQUARE** to score — the game uses real geometric verification (Pythagorean theorem, equal sides, perpendicular dot products).

## Features

- **Grid-Based Snake Movement** — Arrow keys or WASD move the snake head one peg at a time. The path trails behind as a continuous line.
- **Geometric Shape Detection** — When the head revisits a peg, the closed loop is evaluated:
  - **Right Triangle**: 3 vertices, verifies a² + b² = c² using the Pythagorean theorem.
  - **Perfect Square**: 4 vertices, verifies equal side lengths and perpendicular corners via dot products.
- **Level Progression** — Targets alternate: odd levels = RIGHT TRIANGLE, even levels = PERFECT SQUARE. Score grows with level.
- **Visual Feedback** — Emerald glow on correct shape, crimson line break on incorrect, neon cyan for the active path.
- **Touch Support** — Swipe on canvas to move on mobile.
- **High Score Caching** — Best score persisted in `localStorage`.
- **Blueprint Lab Theme** — `#0a0f1d` dark canvas, subtle blue grid lines, neon cyan snake path, monospace stats.

## Tech Stack

- HTML5 — Semantic markup + Canvas 2D
- CSS3 — `backdrop-filter` glassmorphism, `vmin` responsive sizing
- Vanilla JS (ES6+) — Canvas rendering, Pythagorean theorem, dot-product angle checks, `localStorage`

## Rules

1. The target shape is shown in the header (RIGHT TRIANGLE or PERFECT SQUARE).
2. Use **arrow keys** or **WASD** to move the snake across the 8×8 peg grid.
3. The snake leaves a trail. When you revisit a peg, the closed loop is evaluated.
4. If the loop forms the target shape → success, points, next level.
5. If not → path resets. Try again.
6. Click **↺ Clear Path** to reset your trail. Click **⟳ Reset Level** to restart from Level 1.

## Usage

1. Open `index.html` in any modern browser.
2. Use arrow keys (or WASD) to move the cyan snake head.
3. Enclose the target shape by returning to a previously visited peg.
4. Watch the feedback banner for success or failure.
5. Your high score is saved automatically.

## Project Structure

```
Geometric Snake/
├── index.html        # Main entry point
├── style.css         # Blueprint lab theme
├── script.js         # Vector engine & shape detection
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
