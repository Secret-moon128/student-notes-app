// ==========================================================================
// Academic Grade Points Mapping
// ==========================================================================
const gradeScales = {
  "4.0": {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0
  },
  "10.0": {
    "O": 10.0, "A+": 9.0, "A": 8.0,
    "B+": 7.0, "B": 6.0, "C": 5.0,
    "P": 4.0, "F": 0.0
  }
};

// ==========================================================================
// App State Data Store
// ==========================================================================
let academicState = {
  gradingScale: "4.0",
  semesters: [
    {
      id: "sem-1",
      name: "Semester 1",
      courses: [
        { name: "Mathematics I", credits: 4, grade: "A" },
        { name: "Computer Systems", credits: 3, grade: "B+" },
        { name: "Programming Lab", credits: 2, grade: "A+" }
      ]
    },
    {
      id: "sem-2",
      name: "Semester 2",
      courses: [
        { name: "Data Structures", credits: 4, grade: "A-" },
        { name: "Web Development", credits: 3, grade: "A" },
        { name: "Discrete Maths", credits: 3, grade: "B" }
      ]
    }
  ],
  targetCgpa: 3.8,
  remainingSemesters: 4
};

// Chart References
let gpaChartInstance = null;
let gradeChartInstance = null;

// Dashboard initialization
document.addEventListener("DOMContentLoaded", () => {
  loadAcademicData();
  bindEventHandlers();
  renderSemestersGrid();
  calculateAcademicPerformance();
  initCharts();
  lucide.createIcons();
});

// Load storage
function loadAcademicData() {
  const saved = localStorage.getItem("gpacraft_pro_academic_state_v1");
  if (saved) {
    try {
      academicState = JSON.parse(saved);
      document.getElementById("grading-scale").value = academicState.gradingScale;
      document.getElementById("target-cgpa-input").value = academicState.targetCgpa || "";
      document.getElementById("remaining-semesters-input").value = academicState.remainingSemesters || "";
    } catch (e) {
      console.error("Error loading saved configurations", e);
    }
  }
}

// Save storage
function saveAcademicData() {
  localStorage.setItem("gpacraft_pro_academic_state_v1", JSON.stringify(academicState));
}

// Binds actions
function bindEventHandlers() {
  // Scale Selector changed
  document.getElementById("grading-scale").addEventListener("change", (e) => {
    academicState.gradingScale = e.target.value;
    
    // Auto-adjust default target input if they swap scales
    const targetInput = document.getElementById("target-cgpa-input");
    if (e.target.value === "10.0") {
      academicState.targetCgpa = 9.0;
      targetInput.value = 9.0;
      targetInput.max = 10;
      document.getElementById("cgpa-scale-label").textContent = "/ 10.00";
    } else {
      academicState.targetCgpa = 3.8;
      targetInput.value = 3.8;
      targetInput.max = 4;
      document.getElementById("cgpa-scale-label").textContent = "/ 4.00";
    }
    
    // Convert grades in state to match new scale keys to prevent errors
    resetGradesForScale();
    saveAcademicData();
    renderSemestersGrid();
    calculateAcademicPerformance();
    updateChartsData();
  });

  // Target CGPA predictors listeners
  document.getElementById("target-cgpa-input").addEventListener("input", (e) => {
    academicState.targetCgpa = parseFloat(e.target.value) || 0;
    saveAcademicData();
    calculateAcademicPerformance();
  });

  document.getElementById("remaining-semesters-input").addEventListener("input", (e) => {
    academicState.remainingSemesters = parseInt(e.target.value) || 0;
    saveAcademicData();
    calculateAcademicPerformance();
  });

  // Action Buttons
  document.getElementById("add-semester-btn").addEventListener("click", addNewSemester);
  document.getElementById("clear-data-btn").addEventListener("click", clearAllData);
  
  // JSON handlers
  document.getElementById("export-btn").addEventListener("click", exportProfileJSON);
  
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importProfileJSON);
}

// Convert grades schema when scale resets
function resetGradesForScale() {
  const currentKeys = Object.keys(gradeScales[academicState.gradingScale]);
  const defaultGrade = currentKeys[0]; // First key as default
  
  academicState.semesters.forEach(sem => {
    sem.courses.forEach(c => {
      if (!currentKeys.includes(c.grade)) {
        c.grade = defaultGrade;
      }
    });
  });
}

// Add empty semester card block
function addNewSemester() {
  const semIndex = academicState.semesters.length + 1;
  const newSem = {
    id: "sem-" + Date.now(),
    name: `Semester ${semIndex}`,
    courses: [
      { name: "", credits: 3, grade: Object.keys(gradeScales[academicState.gradingScale])[0] }
    ]
  };
  
  academicState.semesters.push(newSem);
  saveAcademicData();
  renderSemestersGrid();
  calculateAcademicPerformance();
  updateChartsData();
}

// Delete semester
function deleteSemester(semId) {
  if (confirm("Are you sure you want to delete this semester and all its courses?")) {
    academicState.semesters = academicState.semesters.filter(s => s.id !== semId);
    
    // Rename remaining semesters logically for clean presentation
    academicState.semesters.forEach((sem, idx) => {
      sem.name = `Semester ${idx + 1}`;
    });
    
    saveAcademicData();
    renderSemestersGrid();
    calculateAcademicPerformance();
    updateChartsData();
  }
}

// Add course row inside semester
function addCourseRow(semId) {
  const sem = academicState.semesters.find(s => s.id === semId);
  if (sem) {
    sem.courses.push({
      name: "",
      credits: 3,
      grade: Object.keys(gradeScales[academicState.gradingScale])[0]
    });
    saveAcademicData();
    renderSemestersGrid();
    calculateAcademicPerformance();
    updateChartsData();
  }
}

// Remove course row from semester
function removeCourseRow(semId, courseIdx) {
  const sem = academicState.semesters.find(s => s.id === semId);
  if (sem) {
    sem.courses.splice(courseIdx, 1);
    saveAcademicData();
    renderSemestersGrid();
    calculateAcademicPerformance();
    updateChartsData();
  }
}

// Update single input item
function updateCourseValue(semId, courseIdx, field, val) {
  const sem = academicState.semesters.find(s => s.id === semId);
  if (sem) {
    const course = sem.courses[courseIdx];
    if (field === "credits") {
      course.credits = parseFloat(val) || 0;
    } else if (field === "name") {
      course.name = val;
    } else if (field === "grade") {
      course.grade = val;
    }
    
    saveAcademicData();
    calculateAcademicPerformance();
    updateChartsData();
    
    // Update individual semester GPA badge without full re-render for performance
    const semGpa = calculateSemesterGPA(sem);
    const badge = document.getElementById(`gpa-badge-${semId}`);
    if (badge) {
      badge.textContent = `GPA: ${semGpa.toFixed(2)}`;
    }
  }
}

// Clear all data
function clearAllData() {
  if (confirm("Reset everything? This will clear all courses and semesters.")) {
    academicState.semesters = [];
    saveAcademicData();
    renderSemestersGrid();
    calculateAcademicPerformance();
    updateChartsData();
  }
}

// Renders the dynamic editor grid on the left
function renderSemestersGrid() {
  const container = document.getElementById("semesters-container");
  container.innerHTML = "";
  
  if (academicState.semesters.length === 0) {
    container.innerHTML = `
      <div class="drawer-empty-state">
        <div class="empty-icon"><i data-lucide="plus-circle"></i></div>
        <h3>No Semesters Added</h3>
        <p>Click "Add Semester" above to start tracking your courses, credits, and grades.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const gradeOptions = Object.keys(gradeScales[academicState.gradingScale]);

  academicState.semesters.forEach(sem => {
    const semGPA = calculateSemesterGPA(sem);
    const card = document.createElement("div");
    card.className = "semester-card";
    
    card.innerHTML = `
      <div class="semester-header">
        <div class="sem-title-row">
          <h3>${sem.name}</h3>
          <span class="sem-gpa-badge" id="gpa-badge-${sem.id}">GPA: ${semGPA.toFixed(2)}</span>
        </div>
        <div class="sem-actions">
          <button class="btn btn-secondary btn-icon-text btn-sm" onclick="addCourseRow('${sem.id}')">
            <i data-lucide="plus"></i> Course
          </button>
          <button class="btn btn-danger-outline btn-icon" onclick="deleteSemester('${sem.id}')">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
      
      <div class="courses-table-header">
        <span>Course Title</span>
        <span>Credits</span>
        <span>Grade</span>
        <span></span>
      </div>
      <div class="courses-rows-list" id="courses-list-${sem.id}">
        <!-- Dynamic course input rows -->
      </div>
    `;
    
    const rowsList = card.querySelector(`#courses-list-${sem.id}`);
    
    sem.courses.forEach((course, idx) => {
      const row = document.createElement("div");
      row.className = "course-row";
      
      // Select grade menu
      let gradeSelectHTML = `<select onchange="updateCourseValue('${sem.id}', ${idx}, 'grade', this.value)">`;
      gradeOptions.forEach(opt => {
        gradeSelectHTML += `<option value="${opt}" ${opt === course.grade ? 'selected' : ''}>${opt}</option>`;
      });
      gradeSelectHTML += `</select>`;
      
      row.innerHTML = `
        <input type="text" placeholder="e.g. Calculus I" value="${course.name}" oninput="updateCourseValue('${sem.id}', ${idx}, 'name', this.value)">
        <input type="number" min="0" max="15" step="0.5" placeholder="Credits" value="${course.credits}" oninput="updateCourseValue('${sem.id}', ${idx}, 'credits', this.value)">
        ${gradeSelectHTML}
        <button class="btn btn-danger-outline btn-icon" onclick="removeCourseRow('${sem.id}', ${idx})">
          <i data-lucide="x"></i>
        </button>
      `;
      
      rowsList.appendChild(row);
    });
    
    container.appendChild(card);
  });
  lucide.createIcons();
}

// ==========================================================================
// GPA Calculations Core
// ==========================================================================

// Calculates Single Semester GPA
function calculateSemesterGPA(semester) {
  let totalCredits = 0;
  let weightedPoints = 0;
  const activeScale = gradeScales[academicState.gradingScale];
  
  semester.courses.forEach(c => {
    const credits = parseFloat(c.credits) || 0;
    const gradeVal = activeScale[c.grade];
    
    if (credits > 0 && gradeVal !== undefined) {
      totalCredits += credits;
      weightedPoints += credits * gradeVal;
    }
  });
  
  if (totalCredits === 0) return 0;
  return weightedPoints / totalCredits;
}

// Calculate CGPA, Credits, Standing, and Predictor Values
function calculateAcademicPerformance() {
  let totalCredits = 0;
  let weightedPoints = 0;
  let totalCourses = 0;
  let passedCourses = 0;
  const activeScale = gradeScales[academicState.gradingScale];
  
  academicState.semesters.forEach(sem => {
    sem.courses.forEach(c => {
      const credits = parseFloat(c.credits) || 0;
      const gradeVal = activeScale[c.grade];
      
      if (credits > 0 && gradeVal !== undefined) {
        totalCredits += credits;
        weightedPoints += credits * gradeVal;
        totalCourses++;
        if (c.grade !== "F") {
          passedCourses++;
        }
      }
    });
  });
  
  const cgpaVal = totalCredits === 0 ? 0.00 : weightedPoints / totalCredits;
  const maxScaleVal = academicState.gradingScale === "4.0" ? 4.00 : 10.00;
  const percentFill = (cgpaVal / maxScaleVal) * 100;
  
  // Update UI Stats Cards
  document.getElementById("cgpa-value").textContent = cgpaVal.toFixed(2);
  document.getElementById("cgpa-scale-label").textContent = `/ ${maxScaleVal.toFixed(2)}`;
  document.getElementById("cgpa-progress-fill").style.width = `${percentFill}%`;
  document.getElementById("total-credits-value").textContent = totalCredits;
  document.getElementById("total-courses-value").textContent = `${totalCourses} Courses (${passedCourses} Passed)`;
  
  // Set Academic Standing Status
  const standingValEl = document.getElementById("academic-standing-value");
  const standingSubEl = document.getElementById("academic-standing-sub");
  
  if (totalCredits === 0) {
    standingValEl.textContent = "N/A";
    standingSubEl.textContent = "Add semesters to evaluate";
  } else {
    let standing = "Good Standing";
    let subtext = "Excellent academic status!";
    
    if (academicState.gradingScale === "4.0") {
      if (cgpaVal >= 3.6) { standing = "First Class / Honors"; subtext = "Outstanding achievement!"; }
      else if (cgpaVal >= 3.0) { standing = "Dean's List Status"; subtext = "High academic standard."; }
      else if (cgpaVal < 2.0) { standing = "Academic Probation"; subtext = "CGPA below 2.0. Needs review."; }
    } else {
      if (cgpaVal >= 9.0) { standing = "Distinction / Outstanding"; subtext = "Top tier performance!"; }
      else if (cgpaVal >= 7.5) { standing = "First Class Standard"; subtext = "Consistently strong score."; }
      else if (cgpaVal < 5.0) { standing = "Critical Academic Review"; subtext = "CGPA below 5.0. Needs support."; }
    }
    
    standingValEl.textContent = standing;
    standingSubEl.textContent = subtext;
  }
  
  // Predict CGPA Goals
  evaluateTargetCgpa(cgpaVal, totalCredits);
}

// Evaluate required GPA calculations
function evaluateTargetCgpa(currentCgpa, completedCredits) {
  const targetCgpaInput = academicState.targetCgpa;
  const remainingSems = academicState.remainingSemesters;
  const maxGpa = academicState.gradingScale === "4.0" ? 4.00 : 10.00;
  
  const alertBox = document.getElementById("predictor-output-box");
  
  if (!targetCgpaInput || !remainingSems || completedCredits === 0) {
    alertBox.style.display = "none";
    return;
  }
  
  alertBox.style.display = "block";
  
  // Calculate average credit weight per completed semester
  const completedSemsCount = academicState.semesters.length;
  const averageCreditsPerSem = completedCredits / (completedSemsCount || 1);
  const remainingCreditsEstimate = averageCreditsPerSem * remainingSems;
  
  // Required GPA formula
  const requiredGpa = ((targetCgpaInput * (completedCredits + remainingCreditsEstimate)) - (currentCgpa * completedCredits)) / remainingCreditsEstimate;
  
  if (requiredGpa <= 0) {
    alertBox.className = "predictor-output-alert alert-success";
    alertBox.innerHTML = `🌟 <strong>Target CGPA goal met:</strong> You've already surpassed your target. Keep doing what you're doing to maintain your standing!`;
  } else if (requiredGpa <= maxGpa) {
    const isWarn = requiredGpa > (maxGpa - 0.5);
    alertBox.className = `predictor-output-alert ${isWarn ? 'alert-warning' : 'alert-success'}`;
    alertBox.innerHTML = `🎯 To reach your CGPA goal of <strong>${targetCgpaInput.toFixed(2)}</strong>, you need to average at least <strong>${requiredGpa.toFixed(2)}</strong> GPA over your remaining <strong>${remainingSems}</strong> semesters.`;
  } else {
    alertBox.className = "predictor-output-alert alert-danger";
    alertBox.innerHTML = `⚠️ <strong>Goal Out of Reach:</strong> Achieving ${targetCgpaInput.toFixed(2)} CGPA requires a GPA average of <strong>${requiredGpa.toFixed(2)}</strong> which exceeds your grading scale maximum of ${maxGpa.toFixed(2)}. Consider lowering your target or increasing study load.`;
  }
}

// ==========================================================================
// Charting visualizations (ChartJS configurations)
// ==========================================================================
function initCharts() {
  // Line Chart
  const lineCtx = document.getElementById("gpaTrendChart").getContext("2d");
  gpaChartInstance = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Semester GPA",
        data: [],
        borderColor: "#d4af37",
        backgroundColor: "rgba(212, 175, 55, 0.08)",
        borderWidth: 3,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: academicState.gradingScale === "4.0" ? 4.0 : 10.0,
          grid: { color: "rgba(212, 175, 55, 0.05)" },
          ticks: { color: "#c5b390" }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#c5b390" }
        }
      }
    }
  });

  // Doughnut Chart
  const doughnutCtx = document.getElementById("gradeDistributionChart").getContext("2d");
  gradeChartInstance = new Chart(doughnutCtx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          "#e5c158", "#d4af37", "#b89028", "#99731b",
          "#7c5912", "#5e400c", "#c5b390", "#a38244"
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right", labels: { color: "#c5b390", boxWidth: 12 } }
      }
    }
  });
  
  updateChartsData();
}

function updateChartsData() {
  if (!gpaChartInstance || !gradeChartInstance) return;
  
  // 1. Semester Trend Data mapping
  const semLabels = [];
  const semGpaValues = [];
  
  academicState.semesters.forEach(sem => {
    semLabels.push(sem.name);
    semGpaValues.push(calculateSemesterGPA(sem));
  });
  
  gpaChartInstance.data.labels = semLabels;
  gpaChartInstance.data.datasets[0].data = semGpaValues;
  gpaChartInstance.options.scales.y.max = academicState.gradingScale === "4.0" ? 4.0 : 10.0;
  gpaChartInstance.update();
  
  // 2. Grade Distribution Data mapping
  const gradeCounts = {};
  academicState.semesters.forEach(sem => {
    sem.courses.forEach(c => {
      if (c.grade && c.credits > 0) {
        gradeCounts[c.grade] = (gradeCounts[c.grade] || 0) + 1;
      }
    });
  });
  
  gradeChartInstance.data.labels = Object.keys(gradeCounts);
  gradeChartInstance.data.datasets[0].data = Object.values(gradeCounts);
  gradeChartInstance.update();
}

// ==========================================================================
// JSON Import & Export Configurations
// ==========================================================================
function exportProfileJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(academicState, null, 2));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `academic_profile.json`);
  dlAnchorElem.click();
}

function importProfileJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsedData = JSON.parse(e.target.result);
      if (parsedData.semesters && parsedData.gradingScale) {
        academicState = parsedData;
        
        // Match controls with imported scales values
        document.getElementById("grading-scale").value = academicState.gradingScale;
        document.getElementById("target-cgpa-input").value = academicState.targetCgpa || "";
        document.getElementById("remaining-semesters-input").value = academicState.remainingSemesters || "";
        
        saveAcademicData();
        renderSemestersGrid();
        calculateAcademicPerformance();
        updateChartsData();
        alert("Academic configuration loaded successfully!");
      } else {
        alert("Invalid academic profile file structure.");
      }
    } catch (err) {
      alert("Error parsing JSON file. Check file configuration.");
    }
  };
  reader.readAsText(file);
}
