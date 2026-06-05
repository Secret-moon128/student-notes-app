# Student GPA Calculator Pro with CGPA Analysis & Academic Performance Dashboard

**Student GPA Calculator Pro** is a modern, responsive single-page web application designed for students and educators to plan semesters, calculate GPA & CGPA, evaluate performance margins, and visualize grades distribution curves in real-time.

---

## 🚀 Purpose and Benefits
Academic tracking is vital for maintaining scholarships, qualifying for graduate programs, and planning course loads.
**GPACraft Pro** solves this by providing:
- **Interactive Multi-Semester Mapping**: Add/delete semesters and input dynamic courses, credit hours, and grades directly.
- **Goal planning and Predictor Alerts**: Put in target CGPA limits and forecast average performance targets required over remaining semesters.
- **Performance Analytics Dashboards**: Injected ChartJS visualizations providing real-time line trends and grade allocation doughnut graphics.
- **Zero Server Overhead**: State persistence is maintained entirely on client-side browser `localStorage`, making your academic data safe and secure.

---

## ✨ Features
1. **Semester Workspace**:
   - Create multi-semester logs.
   - Modify course descriptions, configure course credits, and select grade mappings.
2. **Standard Scale Selectors**: Match academic rules using US Standard 4.0 Scale or Technical Standard 10.0 Scale.
3. **Cumulative Statistics Indicators**:
   - Real-time Cumulative GPA (CGPA) gauge card.
   - Sum total of course credits recorded.
   - Academic standing metrics (Honors, Dean's list, Probation).
4. **Target CGPA Predictor**: Injects predictive warnings explaining what GPA marks you need next to graduate with your desired CGPA target.
5. **Interactive ChartJS Analytics**:
   - *GPA Performance Trend*: Track progress trends over time.
   - *Grade Distribution Breakdown*: View the spread of your letter grades.
6. **Local Backup Configs**: Export your complete semesters profile as a local JSON backup, or import profiles to reload configurations instantly.

---

## 🛠️ Tech Stack
- **Dashboard interface**: HTML5, CSS3 Custom Properties (Fluid CSS grid layouts)
- **Behavior Engine**: Vanilla JavaScript (ES6+ state engine)
- **Visual Charts**: ChartJS (HTML5 Canvas rendering engine)
- **Icons**: Lucide Icons CDN

---

## 📦 Local Setup Instructions
To run this application locally, follow these steps:

### Prerequisites
All you need is a modern web browser. No complex package installations, server configuration, or database hooks are required.

### Installation
1. Clone the repository containing the calculator:
   ```bash
   git clone https://github.com/karthik2004-tech/student-notes-app.git
   cd student-notes-app/student-gpa-calculator-pro
   ```

2. Open the application:
   - **Double click** the `index.html` file inside the `student-gpa-calculator-pro` directory to run the dashboard directly in your browser.
   - **Alternative (Recommended)**: Serve the files using Python's static HTTP server to run the application over a local port:
     ```bash
     python -m http.server 8000
     ```
     Then open your browser to `http://localhost:8000`.

---

## 📖 Usage Guide
1. **Choose Grading Scale**: Select between 4.0 Scale or 10.0 Scale in the header bar.
2. **Add Semesters**: Click **Add Semester** to generate card structures.
3. **Add Course Lines**: Click **+ Course** inside any semester panel.
4. **Type Academic Marks**: Input Course Title, specify credit values, and pick a grade from the select box.
5. **Set Targets**: Under the *Target CGPA Predictor* card, enter your Goal CGPA and the number of future semesters remaining to evaluate required GPAs.
6. **Save Configurations**: Click the download icon in the header to save a local backup `academic_profile.json`. Use the upload icon to reload your configuration.

---

## 📂 Folder Structure
```text
student-gpa-calculator-pro/
├── index.html        # Main dashboard grid workspace
├── style.css         # Styling system for custom inputs, cards, and layouts
├── app.js            # Grading databases, calculators, and charting scripts
└── README.md         # Setup guides and user manual
```

---

## 🚀 Future Enhancements
- [ ] Support custom scale weights.
- [ ] Export semester summaries as PDF reports.
- [ ] Add multiple student profile support.

---

## 🤝 Contribution Guidelines
Contributions are welcome:
1. Fork this repository.
2. Create a branch: `git checkout -b feature/new-gpa-feature`.
3. Push changes and submit a Pull Request.

---

## 📄 License
This project is open-source and distributed under the [MIT License](https://opensource.org/licenses/MIT).
