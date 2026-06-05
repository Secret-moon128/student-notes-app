# MapCraft 🗺️ | Career Roadmap Planner & Progress Tracker

**MapCraft** is an interactive, visual career roadmap planner designed to help developers, students, and aspiring professionals design and monitor their technical growth. Select standard learning tracks, check sub-topics, read curated official resources, take study notes, and track your active milestones seamlessly in a modern, single-page application.

---

## 🚀 Purpose and Benefits
Learning complex disciplines (like Frontend Architecture, Backend Systems, or Data Science) is often overwhelming due to information overload.
**MapCraft** solves this by providing:
- **Guided Visual Timelines**: Clear step-by-step pathways grouped by levels of experience.
- **Micro-Progress Monitoring**: Complete sub-topic checklists inside each skill node to track concrete sub-milestones.
- **Consolidated Educational Links**: Direct recommendations pointing to MDN Web Docs, Scrimba, W3C, Kaggle, and official guides.
- **In-Browser Persistence**: Your tracking state, personal notes, and paths progress are automatically saved to your browser's local storage.

---

## ✨ Features
1. **Interactive Path Navigator**: Sidebar selector covering standard industry disciplines:
   - **Frontend Developer** (HTML, CSS Grid/Flexbox, ES6 JavaScript, NPM packages, React)
   - **Backend Developer** (Node/Express, Relational DBs, MongoDB, Docker, Caching systems)
   - **Data Scientist** (Python, Numpy/Pandas, Data Cleaning, Visualization, Supervised ML)
   - **Cybersecurity Analyst** (Networking basics, Wireshark, Linux administration, auditing tools)
   - **UI/UX Designer** (UX research, Gestalt Principles, Figma auto-layouts, wireframing workflows)
2. **Visual Flowchart Canvas**: Dynamic stage blocks (e.g., Level 1: Foundations, Level 2: Core Skills) with color-coded nodes.
3. **Responsive Viewport Modes**: Support for mobile and tablet reflow grids.
4. **Comprehensive Detail Panel**:
   - Status switch options (**Not Started**, **In Progress**, **Completed**).
   - Dynamic checklists automatically updating parent node status.
   - Recommended learning URLs.
   - Text notes space for logging personal notes.
5. **Dashboard Analytics**: Tracks the overall count of paths currently explored and total completed technical nodes.

---

## 🛠️ Tech Stack
- **Dashboard Interface**: HTML5 (Semantic elements), CSS3 Grid & flexbox layouts.
- **Behavior & Rendering**: Vanilla JavaScript (ES6+ State controller).
- **Icons**: Lucide Icons CDN.

---

## 📦 Local Setup Instructions
To run this application locally, follow these steps:

### Prerequisites
You only need a modern web browser installed on your machine. No bundlers (Vite/Webpack) or package managers (NPM/Yarn) are required.

### Installation
1. Clone the repository containing the planner:
   ```bash
   git clone https://github.com/cu-sanjay/Web-Dev-Projects.git
   cd Web-Dev-Projects/career-roadmap-planner
   ```

2. Open the application:
   - **Double click** `index.html` to run the page directly in your default web browser.
   - **Alternative (Recommended)**: Serve the files using a local development server like Python's static HTTP module:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your web browser.

---

## 📖 Usage Guide
1. **Choose a Track**: Select a discipline card (e.g., *Frontend Developer*) in the left panel.
2. **Select Nodes**: Click any skill card (e.g., *HTML5 & Structuring*) in the central canvas area.
3. **Mark Progress**: Update the status to *In Progress* or *Completed* in the right-side detail drawer.
4. **Complete Checklists**: Check off specific sub-skills as you learn.
5. **Read Curated Materials**: Click on links under *Curated Learning Resources* to read official documentations.
6. **Take Notes**: Type custom remarks into the text box; the state saves automatically on every keystroke.
7. **Reset Workspace**: To wipe your storage and start completely clean, click **Reset All** in the header.

---

## 📂 Folder Structure
```text
career-roadmap-planner/
├── index.html        # Main dashboard workspace layout
├── style.css         # Visual tree layout rules, timelines, theme overrides
├── app.js            # Core roadmaps dataset and reactive state controllers
└── README.md         # Project user manual and local run documentation
```

---

## 🚀 Future Enhancements
- [ ] Support custom career path creation (add/remove nodes dynamically).
- [ ] Integrate external REST APIs (e.g., Github Actions / roadmaps.sh indicators).
- [ ] Export custom roadmaps to PDF/PNG images.

---

## 🤝 Contribution Guidelines
We welcome community contributions:
1. Fork the project.
2. Create a branch: `git checkout -b feature/new-career-track`.
3. Add a new roadmap configuration object in `app.js`.
4. Submit a Pull Request.

---

## 📄 License
Distributed under the MIT License. Feel free to use and adapt it for personal projects!
