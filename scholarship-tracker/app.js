// ==========================================================================
// Pre-populated Mock Scholarship Listings
// ==========================================================================
const mockScholarships = [
  {
    id: "schol-1",
    name: "Generation Google Scholarship",
    sponsor: "Google",
    amount: 10000,
    type: "Merit",
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 15 days from now
    link: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship",
    status: "Under Review",
    checklist: ["Essay", "Transcript", "Resume"],
    notes: "Requires a 500-word essay on commitment to diversity and technology. Reference letter requested from supervisor."
  },
  {
    id: "schol-2",
    name: "National Merit Scholarship",
    sponsor: "National Merit Scholarship Corp.",
    amount: 2500,
    type: "Merit",
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days ago (Passed)
    link: "https://www.nationalmerit.org/",
    status: "Awarded",
    checklist: ["Essay", "LOR", "Transcript", "Resume"],
    notes: "Awarded based on PSAT performance. Secured $2,500 check on high school graduation."
  },
  {
    id: "schol-3",
    name: "STEM Excellence Fellowship",
    sponsor: "Science Foundation",
    amount: 12000,
    type: "Subject",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days from now (Urgent)
    link: "https://www.sciencefoundation.org/fellowships",
    status: "Applied",
    checklist: ["Essay", "LOR", "Transcript"],
    notes: "Requires submission of two letters of recommendation (LOR) and science project description. Already applied on portal."
  },
  {
    id: "schol-4",
    name: "Diverse Leaders Grant",
    sponsor: "Unity Network",
    amount: 5000,
    type: "Minority",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 45 days from now
    link: "https://www.unityleaders.org/grants",
    status: "Draft",
    checklist: ["Resume"],
    notes: "Need-based and diversity grant. Focuses on community leadership contributions. Drafting the application essay now."
  }
];

const defaultProfile = {
  name: "Vishwa Mistry",
  bio: "Undergrad Student & Scholar",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=VM"
};

let appState = {
  profile: { ...defaultProfile },
  scholarships: [...mockScholarships],
  goalTarget: 25000
};

// Global Chart references
let activeChartType = "status"; // status, funds, types
let chartInstance = null;

// ==========================================================================
// Initialization & Startup Handlers
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadAppData();
  bindEventHandlers();

  // Renders
  renderProfile();
  renderGoalProgress();
  renderSummaryStats();
  renderUpcomingDeadlines();
  renderScholarshipLogs();
  initAnalyticsChart();

  lucide.createIcons();
});

function loadAppData() {
  const saved = localStorage.getItem("scholarly_state_v1");
  if (saved) {
    try {
      appState = JSON.parse(saved);
    } catch (e) {
      console.error("Error loading Scholarly app state.", e);
    }
  }

  const savedTheme = localStorage.getItem("scholarly_theme_v1");
  if (savedTheme) {
    document.body.className = savedTheme;
  }
}

function saveAppData() {
  localStorage.setItem("scholarly_state_v1", JSON.stringify(appState));
}

function bindEventHandlers() {
  // Theme Toggle switcher
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    const newTheme = isDark ? "light-theme" : "dark-theme";
    document.body.className = newTheme;
    localStorage.setItem("scholarly_theme_v1", newTheme);
    drawCharts();
  });

  // Mobile sidebar menu toggles
  document.getElementById("sidebar-toggle-open").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.add("active");
  });
  document.getElementById("sidebar-toggle-close").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.remove("active");
  });

  // Profile modal triggers
  document.getElementById("edit-profile-btn").addEventListener("click", openProfileModal);
  document.getElementById("profile-modal-close").addEventListener("click", closeProfileModal);
  document.getElementById("profile-modal-cancel").addEventListener("click", closeProfileModal);
  document.getElementById("profile-form").addEventListener("submit", handleProfileSave);

  // Secured Funding Goal target editor
  document.getElementById("edit-goal-btn").addEventListener("click", () => {
    document.getElementById("goal-target-input").value = appState.goalTarget;
    document.getElementById("inline-goal-form").style.display = "flex";
  });
  document.getElementById("save-goal-btn").addEventListener("click", () => {
    const goalVal = parseInt(document.getElementById("goal-target-input").value);
    if (goalVal > 0) {
      appState.goalTarget = goalVal;
      saveAppData();
      renderGoalProgress();
      renderSummaryStats();
    }
    document.getElementById("inline-goal-form").style.display = "none";
  });

  // Scholarship form modal triggers
  document.getElementById("add-scholarship-btn").addEventListener("click", () => openScholarshipModal());
  document.getElementById("modal-close-btn").addEventListener("click", closeScholarshipModal);
  document.getElementById("modal-cancel-btn").addEventListener("click", closeScholarshipModal);
  document.getElementById("scholarship-form").addEventListener("submit", handleScholarshipSubmit);

  // Search & Filter event binds
  document.getElementById("log-search").addEventListener("input", renderScholarshipLogs);
  document.getElementById("filter-status").addEventListener("change", renderScholarshipLogs);
  document.getElementById("filter-type").addEventListener("change", renderScholarshipLogs);
  document.getElementById("filter-urgency").addEventListener("change", renderScholarshipLogs);

  // Chart switches
  document.getElementById("btn-chart-status").addEventListener("click", () => switchChart("status"));
  document.getElementById("btn-chart-funds").addEventListener("click", () => switchChart("funds"));
  document.getElementById("btn-chart-types").addEventListener("click", () => switchChart("types"));

  // Reset database actions
  document.getElementById("reset-btn").addEventListener("click", resetDatabase);

  // Backup configuration file controls
  document.getElementById("export-btn").addEventListener("click", exportDatabaseJSON);
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importDatabaseJSON);
}

// ==========================================================================
// Profile Management
// ==========================================================================
function renderProfile() {
  document.getElementById("profile-name").textContent = appState.profile.name || "Student";
  document.getElementById("profile-bio").textContent = appState.profile.bio || "Student Profile details...";
  document.getElementById("profile-avatar").src = appState.profile.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=VM";
}

function openProfileModal() {
  document.getElementById("form-profile-name").value = appState.profile.name || "";
  document.getElementById("form-profile-bio").value = appState.profile.bio || "";
  document.getElementById("form-profile-avatar").value = appState.profile.avatar || "";
  document.getElementById("profile-modal").style.display = "flex";
}

function closeProfileModal() {
  document.getElementById("profile-modal").style.display = "none";
}

function handleProfileSave(e) {
  e.preventDefault();
  appState.profile.name = document.getElementById("form-profile-name").value.trim();
  appState.profile.bio = document.getElementById("form-profile-bio").value.trim();
  appState.profile.avatar = document.getElementById("form-profile-avatar").value.trim();

  saveAppData();
  renderProfile();
  closeProfileModal();
}

// ==========================================================================
// Financial secured goal progress bar
// ==========================================================================
function renderGoalProgress() {
  const secured = appState.scholarships
    .filter(s => s.status === "Awarded")
    .reduce((sum, s) => sum + s.amount, 0);
  
  const target = appState.goalTarget;
  const percent = Math.min(100, Math.round((secured / target) * 100));

  document.getElementById("secured-funds-value").textContent = `$${secured.toLocaleString()}`;
  document.getElementById("target-funds-value").textContent = `$${target.toLocaleString()}`;
  document.getElementById("secured-funds-bar").style.width = `${percent}%`;
  document.getElementById("goal-status-text").textContent = `${percent}% Goal Secured`;
}

// ==========================================================================
// Dashboard mathematical stats calculators
// ==========================================================================
function renderSummaryStats() {
  const total = appState.scholarships.length;
  
  const secured = appState.scholarships
    .filter(s => s.status === "Awarded")
    .reduce((sum, s) => sum + s.amount, 0);

  const potential = appState.scholarships
    .filter(s => ["Applied", "Under Review", "Interview"].includes(s.status))
    .reduce((sum, s) => sum + s.amount, 0);

  const appliedCount = appState.scholarships
    .filter(s => s.status !== "Draft")
    .length;

  const awardedCount = appState.scholarships
    .filter(s => s.status === "Awarded")
    .length;

  const rejectedCount = appState.scholarships
    .filter(s => s.status === "Rejected")
    .length;

  const activePendingCount = appState.scholarships
    .filter(s => ["Applied", "Under Review", "Interview"].includes(s.status))
    .length;

  // Success Rate calculations
  const decisonMadeCount = awardedCount + rejectedCount;
  const successRate = decisonMadeCount === 0 ? 0 : Math.round((awardedCount / decisonMadeCount) * 100);

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-sub-applied").textContent = `${activePendingCount} pending review decisions`;

  document.getElementById("stat-secured-funds").textContent = `$${secured.toLocaleString()}`;
  document.getElementById("stat-sub-target").textContent = `Target Secured: $${appState.goalTarget.toLocaleString()}`;

  document.getElementById("stat-potential-funds").textContent = `$${potential.toLocaleString()}`;
  document.getElementById("stat-sub-potential").textContent = `$${potential.toLocaleString()} under potential consideration`;

  document.getElementById("stat-success-rate").textContent = `${successRate}%`;
  document.getElementById("stat-sub-awarded").textContent = `${awardedCount} scholarships won (${rejectedCount} rejected)`;
}

// ==========================================================================
// Deadline alerts tracker panels
// ==========================================================================
function renderUpcomingDeadlines() {
  const container = document.getElementById("deadline-alerts-container");
  container.innerHTML = "";

  const today = new Date();
  
  // Filter active scholarships where deadline is in future and status is not Rejected/Awarded
  const activeSchols = appState.scholarships
    .filter(s => !["Awarded", "Rejected"].includes(s.status) && s.deadline && new Date(s.deadline) >= today)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  if (activeSchols.length === 0) {
    container.innerHTML = `<div class="empty-deadline-state">No upcoming deadlines. Log some applications!</div>`;
    return;
  }

  activeSchols.forEach(s => {
    const deadlineDate = new Date(s.deadline);
    const diffTime = Math.abs(deadlineDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isUrgent = diffDays <= 7;
    const alertCard = document.createElement("div");
    alertCard.className = `deadline-alert-item ${isUrgent ? 'urgent' : ''}`;

    alertCard.innerHTML = `
      <div class="deadline-alert-info">
        <h4>${s.name}</h4>
        <p>${s.sponsor} • $${s.amount.toLocaleString()}</p>
      </div>
      <div class="deadline-badge">
        ${isUrgent ? 'Due in ' + diffDays + 'd ⚠️' : diffDays + ' days left'}
      </div>
    `;

    container.appendChild(alertCard);
  });
}

// ==========================================================================
// Log management & Form Modal submissions
// ==========================================================================
function openScholarshipModal(id = null) {
  const form = document.getElementById("scholarship-form");
  const modalTitle = document.getElementById("modal-title");
  form.reset();

  // Load default deadline as 1 month from now
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 1);
  document.getElementById("form-deadline").value = defaultDate.toISOString().split("T")[0];

  if (id) {
    const schol = appState.scholarships.find(s => s.id === id);
    if (schol) {
      modalTitle.textContent = "Edit Scholarship Application";
      document.getElementById("edit-scholarship-id").value = schol.id;
      document.getElementById("form-name").value = schol.name;
      document.getElementById("form-sponsor").value = schol.sponsor;
      document.getElementById("form-amount").value = schol.amount;
      document.getElementById("form-type").value = schol.type;
      document.getElementById("form-deadline").value = schol.deadline;
      document.getElementById("form-link").value = schol.link || "";
      document.getElementById("form-status").value = schol.status;
      document.getElementById("form-notes").value = schol.notes || "";

      // Load checklists checkboxes
      document.getElementById("chk-essay").checked = schol.checklist.includes("Essay");
      document.getElementById("chk-lor").checked = schol.checklist.includes("LOR");
      document.getElementById("chk-transcript").checked = schol.checklist.includes("Transcript");
      document.getElementById("chk-resume").checked = schol.checklist.includes("Resume");
    }
  } else {
    modalTitle.textContent = "Add Scholarship Application";
    document.getElementById("edit-scholarship-id").value = "";
  }

  document.getElementById("scholarship-modal").style.display = "flex";
}

function closeScholarshipModal() {
  document.getElementById("scholarship-modal").style.display = "none";
}

function handleScholarshipSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById("edit-scholarship-id").value;
  const name = document.getElementById("form-name").value.trim();
  const sponsor = document.getElementById("form-sponsor").value.trim();
  const amount = parseInt(document.getElementById("form-amount").value) || 0;
  const type = document.getElementById("form-type").value;
  const deadline = document.getElementById("form-deadline").value;
  const link = document.getElementById("form-link").value.trim();
  const status = document.getElementById("form-status").value;
  const notes = document.getElementById("form-notes").value.trim();

  // Checklist arrays compilation
  const checklist = [];
  if (document.getElementById("chk-essay").checked) checklist.push("Essay");
  if (document.getElementById("chk-lor").checked) checklist.push("LOR");
  if (document.getElementById("chk-transcript").checked) checklist.push("Transcript");
  if (document.getElementById("chk-resume").checked) checklist.push("Resume");

  if (editId) {
    const schol = appState.scholarships.find(s => s.id === editId);
    if (schol) {
      schol.name = name;
      schol.sponsor = sponsor;
      schol.amount = amount;
      schol.type = type;
      schol.deadline = deadline;
      schol.link = link;
      schol.status = status;
      schol.checklist = checklist;
      schol.notes = notes;
    }
  } else {
    const newSchol = {
      id: "schol-" + Date.now(),
      name, sponsor, amount, type, deadline, link, status, checklist, notes
    };
    appState.scholarships.unshift(newSchol);
  }

  saveAppData();
  closeScholarshipModal();
  renderScholarshipLogs();
  renderGoalProgress();
  renderSummaryStats();
  renderUpcomingDeadlines();
  updateCharts();
}

function deleteScholarship(id) {
  if (confirm("Are you sure you want to delete this scholarship listing?")) {
    appState.scholarships = appState.scholarships.filter(s => s.id !== id);
    saveAppData();
    renderScholarshipLogs();
    renderGoalProgress();
    renderSummaryStats();
    renderUpcomingDeadlines();
    updateCharts();
  }
}

// Inline toggle document checklist item on cards
window.toggleCardChecklistItem = function(id, item) {
  const schol = appState.scholarships.find(s => s.id === id);
  if (schol) {
    if (schol.checklist.includes(item)) {
      schol.checklist = schol.checklist.filter(i => i !== item);
    } else {
      schol.checklist.push(item);
    }
    saveAppData();
    renderScholarshipLogs();
    renderUpcomingDeadlines();
    renderSummaryStats();
  }
};

// ==========================================================================
// Logs database lists renders
// ==========================================================================
function renderScholarshipLogs() {
  const container = document.getElementById("logs-list-container");
  container.innerHTML = "";

  const searchQuery = document.getElementById("log-search").value.toLowerCase();
  const statusFilter = document.getElementById("filter-status").value;
  const typeFilter = document.getElementById("filter-type").value;
  const sortFilter = document.getElementById("filter-urgency").value;

  // Filter application items
  let filtered = appState.scholarships.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery) ||
                          s.sponsor.toLowerCase().includes(searchQuery) ||
                          (s.notes && s.notes.toLowerCase().includes(searchQuery));
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesType = typeFilter === "all" || s.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sorting
  if (sortFilter === "deadline") {
    filtered.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (sortFilter === "amount") {
    filtered.sort((a,b) => b.amount - a.amount);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-p">No scholarships match the filters. Click "Add Scholarship" to start logging!</div>`;
    return;
  }

  filtered.forEach(s => {
    const card = document.createElement("div");
    card.className = `log-item-card ${s.status.toLowerCase().replace(" ", "")}-card`;

    let statusIcon = "file-text";
    if (s.status === "Applied") statusIcon = "send";
    else if (s.status === "Under Review") statusIcon = "eye";
    else if (s.status === "Interview") statusIcon = "users";
    else if (s.status === "Awarded") statusIcon = "check-circle-2";
    else if (s.status === "Rejected") statusIcon = "x-circle";

    const descBlock = s.notes ? `<p class="log-desc">${s.notes}</p>` : "";
    const nameAnchor = s.link ? `<a href="${s.link}" target="_blank">${s.name} <i data-lucide="external-link" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i></a>` : s.name;

    // Compile checklist inline card widget
    const allChecks = ["Essay", "LOR", "Transcript", "Resume"];
    const chkInputs = allChecks.map(item => {
      const isChecked = s.checklist.includes(item);
      return `
        <label class="checklist-item">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="toggleCardChecklistItem('${s.id}', '${item}')">
          <span>${item}</span>
        </label>
      `;
    }).join("");

    const checklistProgress = Math.round((s.checklist.length / 4) * 100);

    // Check if deadline is past and status is not closed
    const isPast = new Date(s.deadline) < new Date() && !["Awarded", "Rejected"].includes(s.status);
    const deadlineTag = isPast 
      ? `<span class="log-meta-tag urgent-tag"><i data-lucide="alert-triangle"></i> Past Deadline! (${s.deadline})</span>`
      : `<span class="log-meta-tag"><i data-lucide="calendar"></i> Deadline: ${s.deadline}</span>`;

    card.innerHTML = `
      <div class="log-status-border">
        <i data-lucide="${statusIcon}"></i>
      </div>
      <div class="log-content-box">
        <div class="log-title-row">
          <h4>${nameAnchor} <span class="badge-status ${s.status.toLowerCase().replace(" ", "")}">${s.status}</span></h4>
          <span class="log-reward">$${s.amount.toLocaleString()}</span>
        </div>
        ${descBlock}
        
        <!-- Document Checklists -->
        <div class="checklist-widget-container">
          <div class="checklist-header">
            <span>Application Checklist</span>
            <span>${checklistProgress}% Complete</span>
          </div>
          <div class="checklist-items-grid">
            ${chkInputs}
          </div>
        </div>

        <div class="log-meta-row">
          <span class="log-meta-tag badge-type">${s.type}</span>
          <span class="log-meta-tag"><i data-lucide="award"></i> ${s.sponsor}</span>
          ${deadlineTag}
        </div>
      </div>
      <div class="log-actions-box">
        <button class="btn btn-secondary btn-action-log" onclick="openScholarshipModal('${s.id}')" title="Edit App"><i data-lucide="edit-3" style="width:12px;height:12px;"></i></button>
        <button class="btn btn-secondary btn-action-log" onclick="deleteScholarship('${s.id}')" title="Delete App"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
      </div>
    `;

    container.appendChild(card);
  });

  lucide.createIcons();
}

// ==========================================================================
// Chart.js Implementations
// ==========================================================================
function initAnalyticsChart() {
  drawCharts();
}

function switchChart(type) {
  activeChartType = type;
  document.getElementById("btn-chart-status").classList.remove("active");
  document.getElementById("btn-chart-funds").classList.remove("active");
  document.getElementById("btn-chart-types").classList.remove("active");

  document.getElementById(`btn-chart-${type}`).classList.add("active");
  drawCharts();
}

function updateCharts() {
  drawCharts();
}

function drawCharts() {
  const canvas = document.getElementById("scholarshipChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const isLight = document.body.classList.contains("light-theme");
  const labelColor = isLight ? "#57606a" : "#8b949e";
  const gridColor = isLight ? "rgba(9, 105, 218, 0.08)" : "rgba(88, 166, 255, 0.08)";

  if (activeChartType === "status") {
    // Doughnut splits of status
    const statusCounts = { Draft: 0, Applied: 0, "Under Review": 0, Interview: 0, Awarded: 0, Rejected: 0 };
    appState.scholarships.forEach(s => {
      if (statusCounts[s.status] !== undefined) statusCounts[s.status]++;
    });

    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: ["#8b949e", "#388bfd", "#d29922", "#a371f7", "#2ea44f", "#f85149"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { color: labelColor, font: { family: "Outfit" } }
          }
        }
      }
    });
  } else if (activeChartType === "funds") {
    // Award secured vs potential funds bar
    const secured = appState.scholarships.filter(s => s.status === "Awarded").reduce((sum,s)=>sum+s.amount, 0);
    const potential = appState.scholarships.filter(s => ["Applied", "Under Review", "Interview"].includes(s.status)).reduce((sum,s)=>sum+s.amount, 0);

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Awarded / Secured Funds", "Pending Potential Funds"],
        datasets: [{
          data: [secured, potential],
          backgroundColor: ["#2ea44f", "#d29922"],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: labelColor }, grid: { display: false } },
          y: { 
            ticks: { 
              color: labelColor,
              callback: function(value) { return '$' + value.toLocaleString(); }
            },
            grid: { color: gridColor }
          }
        }
      }
    });
  } else {
    // Polar Area Chart by Funding Type
    const typesCount = {};
    appState.scholarships.forEach(s => {
      typesCount[s.type] = (typesCount[s.type] || 0) + 1;
    });

    chartInstance = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: Object.keys(typesCount),
        datasets: [{
          data: Object.values(typesCount),
          backgroundColor: [
            "rgba(88, 166, 255, 0.6)",
            "rgba(163, 113, 247, 0.6)",
            "rgba(46, 164, 79, 0.6)",
            "rgba(210, 153, 34, 0.6)",
            "rgba(248, 81, 73, 0.6)",
            "rgba(139, 148, 158, 0.6)"
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { color: labelColor, font: { family: "Outfit" } }
          }
        },
        scales: {
          r: {
            grid: { color: gridColor },
            ticks: { color: labelColor, backdropColor: "transparent" }
          }
        }
      }
    });
  }
}

// ==========================================================================
// Backup Import/Export Files controls & resets
// ==========================================================================
function exportDatabaseJSON() {
  const data = JSON.stringify(appState, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);
  const exportFileDefaultName = 'scholarly_scholarships_backup.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importDatabaseJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.profile && parsed.scholarships && Array.isArray(parsed.scholarships)) {
        appState = parsed;
        saveAppData();
        renderProfile();
        renderGoalProgress();
        renderSummaryStats();
        renderUpcomingDeadlines();
        renderScholarshipLogs();
        drawCharts();
        alert("JSON Backup loaded successfully!");
      } else {
        alert("Invalid backup configuration layout.");
      }
    } catch (err) {
      alert("Error parsing backup JSON file.");
    }
  };
  reader.readAsText(file);
}

function resetDatabase() {
  if (confirm("Are you sure you want to reset and restore default scholarship listings?")) {
    appState = {
      profile: { ...defaultProfile },
      scholarships: [...mockScholarships],
      goalTarget: 25000
    };
    saveAppData();
    renderProfile();
    renderGoalProgress();
    renderSummaryStats();
    renderUpcomingDeadlines();
    renderScholarshipLogs();
    drawCharts();
    alert("Database successfully reset.");
  }
}
