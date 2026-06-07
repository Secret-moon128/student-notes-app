# Productivity Command Center with Tasks, Goals, Notes & Analytics Dashboard

CoreFlow is a centralized productivity dashboard where users can manage daily tasks, track goals, organize notes, monitor focus sessions, and visualize progress through an interactive analytics system. It is designed to help students, developers, and professionals stay organized and productive.

## Features

- **Centralized Productivity Dashboard**: Live productivity indexing based on task completions, goal milestones, and focus durations.
- **Advanced Task Manager**: Log, prioritize (High/Medium/Low), and schedule tasks across categories (Work, Study, Personal, Health) with filters for active, overdue, and completed items.
- **Structured Goal boards**: Manage Daily, Weekly, and Monthly goals with visual progress bars.
- **Notes Hub**: A digital notebook featuring auto-saving notes sorted by industry categories.
- **Pomodoro Focus Clock**: A visual circular countdown timer with dedicated modes for Focus (25m), Short Breaks (5m), and Long Breaks (15m). Plays custom audio sound alerts synthesized using the Web Audio API.
- **Data Visualizations (ChartJS)**: Review daily completed tasks and logged focus hours over the past week.
- **Achievement & Gamification Badge System**: Unlocked trophies based on user consistency and milestone metrics.
- **Streak Tracker**: Tracks consecutive days of focus sessions to encourage daily focus habits.
- **Theme Caching**: Choose between Light and Dark mode variations, saved instantly to `localStorage`.

## Technologies Used

- **Structure**: Semantic HTML5 markup
- **Styles**: Custom CSS3 variables, flex grid containers, glassmorphic styles, and responsive breakpoints
- **Logic**: Vanilla ES6+ client-side JavaScript utilizing Web Storage (LocalStorage) and Web Audio API
- **Libraries**:
  - [Lucide Icons](https://github.com/lucide-icons/lucide) for visual iconography
  - [ChartJS](https://www.chartjs.org/) for productivity graphs

## Directory Structure

```
productivity-command-center/
├── index.html   # Core layout for the sidebar & viewport grids
├── style.css    # Colors, styling systems, and responsive adjustments
├── app.js       # Central logic, local state persistence, and timer loops
└── README.md    # Documentation and user manual
```

## Setup & Running

1. Clone or download the repository workspace.
2. Navigate to the `/productivity-command-center/` directory.
3. Open `index.html` directly in any web browser or serve it using a local development server (e.g. `npx serve` or `python -m http.server`).
