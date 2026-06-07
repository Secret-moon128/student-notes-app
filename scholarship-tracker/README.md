# Scholarly | Scholarship Tracker with Application Management, Deadline Tracking & Progress Dashboard

A premium client-side scholarship management companion designed for students to track application processes, manage deadline schedules, track document requirement checklists, and visualize funding progress with interactive metrics.

## Core Features

- **Dashboard Statistics**:
  - Total application counts, funding won (secured rewards), potential pending funding sums, and success rates.
- **Funding Goal Progress Bar**:
  - Displays secured funds ($) against a customizable funding goal targets.
- **Deadline Alerts Timeline**:
  - Lists upcoming deadlines chronologically and flags entries due in less than 7 days as urgent.
- **Application Registry & Manager**:
  - Log name, sponsor, amount, type (Merit, Need, Athletic, Creative, etc.), deadline, link, status, and notes.
  - Interactive checklists to toggle status of academic transcripts, essays, letters of recommendation (LOR), and resumes/portfolios.
- **Visual Analytics Charts**:
  - Doughnut Chart: Application Status distribution (Draft, Applied, Review, Interview, Awarded, Rejected).
  - Bar Chart: Secure funds vs. potential pending reward sums.
  - Polar Area Chart: Funding classifications breakdown.
- **Storage & Backup Controls**:
  - Offline sync using `localStorage`.
  - JSON data backup imports/exports.
- **Themes Switcher**: Supports Light and Dark modes.

## Technical Details

- **Core Structure**: HTML5, CSS3, JavaScript (ES6+).
- **Libraries**:
  - **Chart.js**: Clean visual analytics.
  - **Lucide Icons**: Crisp vector icons.
  - **Google Fonts**: Outfit & Plus Jakarta Sans typography.

## Directory Structure

```
scholarship-tracker/
├── index.html   # Main dashboard layout structure, tables, and modals
├── style.css    # Responsive styles, theme variables, and layouts
├── app.js       # App state controller, calculations, and Chart.js integrations
└── README.md    # Product documentation and setup guides
```

## Setup Instructions

1. Double-click `index.html` to run in any browser.
2. Alternatively, run a static server in the root workspace directory:
   ```bash
   npx http-server -p 8002
   ```
   and navigate to `http://localhost:8002/scholarship-tracker/`.
