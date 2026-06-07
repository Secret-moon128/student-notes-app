// ==========================================================================
// Default / Mock Data for Productivity Command Center
// ==========================================================================
const mockTasks = [
  { id: "task-1", title: "Review Chemistry Chapter 4 notes", category: "Study", priority: "High", notes: "Focus on balancing equations and redox formulas.", due: new Date().toISOString().split("T")[0], done: false },
  { id: "task-2", title: "Draft SaaS layout wireframe mockups", category: "Work", priority: "Medium", notes: "Use paper grids first, then design digital SVGs.", due: new Date().toISOString().split("T")[0], done: true },
  { id: "task-3", title: "Complete 30 minutes cardio session", category: "Health", priority: "Low", notes: "Maintain pulse rate around 140 bpm.", due: new Date().toISOString().split("T")[0], done: false }
];

const mockGoals = [
  { id: "goal-1", title: "Drink 3 liters of water", timeframe: "Daily", category: "Health", done: true },
  { id: "goal-2", title: "Solve 5 algorithmic challenges", timeframe: "Daily", category: "Study", done: false },
  { id: "goal-3", title: "Read one book chapter weekly", timeframe: "Weekly", category: "Personal", done: false },
  { id: "goal-4", title: "Ship 1 feature module monthly", timeframe: "Monthly", category: "Work", done: true }
];

const mockNotes = [
  { id: "note-1", title: "Weekly Retro Notes", category: "Work", content: "What went well:\n- Handled placements tracking modal forms smoothly.\n- Drafted cleaner gradient layouts.\n\nImprovements:\n- Refine SVG progress offsets.\n- Optimize chart redraw timelines.", updated: "2026-06-07" },
  { id: "note-2", title: "Book Recommendations", category: "Personal", content: "- Atomic Habits by James Clear\n- Deep Work by Cal Newport\n- Zero to One by Peter Thiel", updated: "2026-06-06" }
];

const mockLogs = [
  { id: "log-1", mode: "work", duration: 25, timestamp: "2026-06-06 14:30" },
  { id: "log-2", mode: "work", duration: 25, timestamp: "2026-06-07 10:15" }
];

let appState = {
  tasks: [...mockTasks],
  goals: [...mockGoals],
  notes: [...mockNotes],
  focusSessions: [...mockLogs],
  streak: 2,
  lastFocusDate: "2026-06-06",
  activeNoteId: "note-1"
};

// Global References
let chartInstance = null;
let currentView = "dashboard";
let activeChartType = "tasks"; // tasks, focus

// Pomodoro Timer state
let timerInterval = null;
let timerRunning = false;
let timeRemaining = 25 * 60; // 25 minutes default
let currentTimerMode = "work"; // work, short, long
const modeDurations = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

// SVG stroke properties for circular timers
const POMO_RING_LENGTH = 452.4; // 2 * PI * 72

// ==========================================================================
// App Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadStateData();
  bindEventHandlers();
  switchView(currentView);
  
  // Render sub-elements
  renderTasksList();
  renderGoalsList();
  renderNotesList();
  renderFocusLogs();
  calculateDashboardMetrics();
  initAnalyticsChart();
  updateStreakDisplay();
  
  lucide.createIcons();
});

function loadStateData() {
  const saved = localStorage.getItem("coreflow_state_v2");
  if (saved) {
    try {
      appState = JSON.parse(saved);
      if (!appState.activeNoteId && appState.notes.length > 0) {
        appState.activeNoteId = appState.notes[0].id;
      }
    } catch (e) {
      console.error("Error loading application state.", e);
    }
  }

  const savedTheme = localStorage.getItem("coreflow_theme_v2");
  if (savedTheme) {
    document.body.className = savedTheme;
  }
}

function saveStateData() {
  localStorage.setItem("coreflow_state_v2", JSON.stringify(appState));
}

// Binds actions
function bindEventHandlers() {
  // Theme Switching
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    const newTheme = isDark ? "light-theme" : "dark-theme";
    document.body.className = newTheme;
    localStorage.setItem("coreflow_theme_v2", newTheme);
    drawCharts();
  });

  // Mobile sidebar switches
  document.getElementById("sidebar-toggle-open").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.add("active");
  });
  document.getElementById("sidebar-toggle-close").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.remove("active");
  });

  // View Navigation Toggles
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const targetView = item.getAttribute("data-view");
      switchView(targetView);
      document.getElementById("app-sidebar").classList.remove("active");
    });
  });

  // Task Filters Event listeners
  document.querySelectorAll(".filter-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderTasksList();
    });
  });
  document.getElementById("tasks-search").addEventListener("input", renderTasksList);

  // Forms submit logic
  document.getElementById("task-form").addEventListener("submit", handleAddTask);
  document.getElementById("goal-form").addEventListener("submit", handleAddGoal);

  // Note editor bindings
  document.getElementById("new-note-btn").addEventListener("click", createNewNote);
  document.getElementById("delete-note-btn").addEventListener("click", deleteActiveNote);
  
  document.getElementById("note-editor-title").addEventListener("input", (e) => {
    updateActiveNoteProperty("title", e.target.value);
  });
  document.getElementById("note-editor-category").addEventListener("change", (e) => {
    updateActiveNoteProperty("category", e.target.value);
  });
  document.getElementById("note-editor-content").addEventListener("input", (e) => {
    updateActiveNoteProperty("content", e.target.value);
  });

  // Pomodoro Controls
  document.getElementById("btn-timer-toggle").addEventListener("click", toggleTimer);
  document.getElementById("btn-timer-reset").addEventListener("click", resetTimer);
  
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.getAttribute("data-mode");
      switchTimerMode(mode);
    });
  });

  // Chart type switcher buttons
  document.getElementById("btn-chart-tasks").addEventListener("click", () => switchChart("tasks"));
  document.getElementById("btn-chart-focus").addEventListener("click", () => switchChart("focus"));

  // Reset Button
  document.getElementById("reset-btn").addEventListener("click", resetDatabase);
}

function switchView(viewName) {
  currentView = viewName;
  document.querySelectorAll(".viewport-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById("view-" + viewName).classList.add("active");

  // Recalculate metrics on dashboard visit
  if (viewName === "dashboard") {
    calculateDashboardMetrics();
    drawCharts();
  } else if (viewName === "achievements") {
    renderAchievements();
  }
}

// ==========================================================================
// Tasks Management Modules
// ==========================================================================
function renderTasksList() {
  const container = document.getElementById("tasks-list-container");
  container.innerHTML = "";

  const filter = document.querySelector(".filter-buttons button.active").getAttribute("data-filter");
  const searchQuery = document.getElementById("tasks-search").value.toLowerCase();
  const todayStr = new Date().toISOString().split("T")[0];

  const filteredTasks = appState.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery) || 
                          (task.notes && task.notes.toLowerCase().includes(searchQuery));
    
    let matchesFilter = true;
    if (filter === "active") matchesFilter = !task.done;
    else if (filter === "completed") matchesFilter = task.done;
    else if (filter === "overdue") matchesFilter = !task.done && task.due && task.due < todayStr;

    return matchesSearch && matchesFilter;
  });

  document.getElementById("tasks-count").textContent = filteredTasks.length;

  if (filteredTasks.length === 0) {
    container.innerHTML = `<div class="empty-state-p">No matching tasks found.</div>`;
    return;
  }

  filteredTasks.forEach(task => {
    const item = document.createElement("div");
    item.className = `task-item ${task.done ? 'completed' : ''}`;
    
    // Notes block mapping
    const notesBlock = task.notes ? `<p class="desc">${task.notes}</p>` : "";
    // Due tag matching
    const dueBlock = task.due ? `<span class="meta-tag"><i data-lucide="calendar"></i> Due ${task.due}</span>` : "";
    // Category tag matching
    const catBlock = `<span class="meta-tag text-${task.category.toLowerCase()}"><i data-lucide="tag"></i> ${task.category}</span>`;

    item.innerHTML = `
      <div class="chk-col">
        <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTaskDone('${task.id}')">
      </div>
      <div class="content-col">
        <span class="title">${task.title}</span>
        ${notesBlock}
        <div class="meta-row">
          <span class="badge-priority ${task.priority.toLowerCase()}">${task.priority}</span>
          ${dueBlock}
          ${catBlock}
        </div>
      </div>
      <button class="btn-del" onclick="deleteTask('${task.id}')" title="Delete Task">
        <i data-lucide="trash-2"></i>
      </button>
    `;
    container.appendChild(item);
  });

  lucide.createIcons();
}

function handleAddTask(e) {
  e.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  const due = document.getElementById("task-due").value;
  const category = document.getElementById("task-category").value;
  const priority = document.getElementById("task-priority").value;
  const notes = document.getElementById("task-notes").value.trim();

  const newTask = {
    id: "task-" + Date.now(),
    title, due, category, priority, notes,
    done: false
  };

  appState.tasks.push(newTask);
  saveStateData();
  document.getElementById("task-form").reset();
  renderTasksList();
  calculateDashboardMetrics();
}

function toggleTaskDone(id) {
  const task = appState.tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveStateData();
    renderTasksList();
    calculateDashboardMetrics();
  }
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    appState.tasks = appState.tasks.filter(t => t.id !== id);
    saveStateData();
    renderTasksList();
    calculateDashboardMetrics();
  }
}

// ==========================================================================
// Goal Management Modules
// ==========================================================================
function renderGoalsList() {
  const dailyContainer = document.getElementById("daily-goals-container-view");
  const weeklyContainer = document.getElementById("weekly-goals-container-view");
  const monthlyContainer = document.getElementById("monthly-goals-container-view");

  dailyContainer.innerHTML = "";
  weeklyContainer.innerHTML = "";
  monthlyContainer.innerHTML = "";

  let counts = { Daily: 0, Weekly: 0, Monthly: 0 };

  appState.goals.forEach(goal => {
    const card = document.createElement("div");
    card.className = `goal-item ${goal.done ? 'completed' : ''}`;
    
    card.innerHTML = `
      <div class="goal-item-header">
        <div class="title-grp">
          <input type="checkbox" ${goal.done ? 'checked' : ''} onchange="toggleGoalDone('${goal.id}')">
          <span class="title">${goal.title}</span>
        </div>
        <button class="btn-del" onclick="deleteGoal('${goal.id}')" title="Delete Goal">
          <i data-lucide="x" style="width:12px;height:12px;"></i>
        </button>
      </div>
      <div class="goal-item-footer">
        <span class="text-${goal.category.toLowerCase()}">${goal.category}</span>
      </div>
    `;

    if (goal.timeframe === "Daily") {
      dailyContainer.appendChild(card);
      counts.Daily++;
    } else if (goal.timeframe === "Weekly") {
      weeklyContainer.appendChild(card);
      counts.Weekly++;
    } else if (goal.timeframe === "Monthly") {
      monthlyContainer.appendChild(card);
      counts.Monthly++;
    }
  });

  document.getElementById("count-daily-goals").textContent = counts.Daily;
  document.getElementById("count-weekly-goals").textContent = counts.Weekly;
  document.getElementById("count-monthly-goals").textContent = counts.Monthly;

  // Add empty placeholders
  if (counts.Daily === 0) dailyContainer.innerHTML = `<div class="empty-state-p">No daily goals.</div>`;
  if (counts.Weekly === 0) weeklyContainer.innerHTML = `<div class="empty-state-p">No weekly goals.</div>`;
  if (counts.Monthly === 0) monthlyContainer.innerHTML = `<div class="empty-state-p">No monthly goals.</div>`;

  lucide.createIcons();
}

function handleAddGoal(e) {
  e.preventDefault();
  const title = document.getElementById("goal-title").value.trim();
  const timeframe = document.getElementById("goal-timeframe").value;
  const category = document.getElementById("goal-category").value;

  const newGoal = {
    id: "goal-" + Date.now(),
    title, timeframe, category,
    done: false
  };

  appState.goals.push(newGoal);
  saveStateData();
  document.getElementById("goal-form").reset();
  renderGoalsList();
  calculateDashboardMetrics();
}

function toggleGoalDone(id) {
  const goal = appState.goals.find(g => g.id === id);
  if (goal) {
    goal.done = !goal.done;
    saveStateData();
    renderGoalsList();
    calculateDashboardMetrics();
  }
}

function deleteGoal(id) {
  if (confirm("Are you sure you want to delete this goal?")) {
    appState.goals = appState.goals.filter(g => g.id !== id);
    saveStateData();
    renderGoalsList();
    calculateDashboardMetrics();
  }
}

// ==========================================================================
// Notes Hub Modules
// ==========================================================================
function renderNotesList() {
  const container = document.getElementById("notes-list-container");
  container.innerHTML = "";

  if (appState.notes.length === 0) {
    container.innerHTML = `<div class="empty-state-p">No notes created yet.</div>`;
    document.getElementById("editor-active-state").style.display = "none";
    document.getElementById("editor-empty-state").style.display = "flex";
    return;
  }

  appState.notes.forEach(note => {
    const item = document.createElement("div");
    item.className = `note-item ${note.id === appState.activeNoteId ? 'active' : ''}`;
    item.onclick = () => selectNote(note.id);

    const bodyPreview = note.content ? note.content.substring(0, 35) + "..." : "Empty note content...";

    item.innerHTML = `
      <span class="title">${note.title || 'Untitled Note'}</span>
      <span class="body-preview">${bodyPreview}</span>
      <div class="note-meta">
        <span class="text-${note.category.toLowerCase()}">${note.category}</span>
        <span>${note.updated}</span>
      </div>
    `;
    container.appendChild(item);
  });

  // Load selected note details
  loadActiveNoteEditor();
}

function selectNote(id) {
  appState.activeNoteId = id;
  saveStateData();
  renderNotesList();
}

function loadActiveNoteEditor() {
  const note = appState.notes.find(n => n.id === appState.activeNoteId);
  if (!note) {
    document.getElementById("editor-active-state").style.display = "none";
    document.getElementById("editor-empty-state").style.display = "flex";
    return;
  }

  document.getElementById("editor-active-state").style.display = "flex";
  document.getElementById("editor-empty-state").style.display = "none";

  document.getElementById("note-editor-title").value = note.title || "";
  document.getElementById("note-editor-category").value = note.category || "Work";
  document.getElementById("note-editor-content").value = note.content || "";
}

function updateActiveNoteProperty(prop, value) {
  const note = appState.notes.find(n => n.id === appState.activeNoteId);
  if (note) {
    note[prop] = value;
    note.updated = new Date().toISOString().split("T")[0];
    saveStateData();
    
    // Quick-update preview card to avoid full redraw layout jitters
    const activeCard = document.querySelector(".note-item.active");
    if (activeCard) {
      if (prop === "title") activeCard.querySelector(".title").textContent = value || 'Untitled Note';
      if (prop === "content") activeCard.querySelector(".body-preview").textContent = value ? value.substring(0, 35) + "..." : "Empty note content...";
    }
  }
}

function createNewNote() {
  const newNote = {
    id: "note-" + Date.now(),
    title: "New Note Title",
    category: "Work",
    content: "",
    updated: new Date().toISOString().split("T")[0]
  };

  appState.notes.unshift(newNote);
  appState.activeNoteId = newNote.id;
  saveStateData();
  renderNotesList();
}

function deleteActiveNote() {
  if (confirm("Are you sure you want to delete this note?")) {
    appState.notes = appState.notes.filter(n => n.id !== appState.activeNoteId);
    appState.activeNoteId = appState.notes.length > 0 ? appState.notes[0].id : null;
    saveStateData();
    renderNotesList();
  }
}

// ==========================================================================
// Focus & Pomodoro Timer Module
// ==========================================================================
function toggleTimer() {
  if (timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  timerRunning = true;
  document.getElementById("timer-toggle-text").textContent = "Pause Session";
  
  // Icon replacements
  document.querySelector(".timer-play-icon").style.display = "none";
  document.querySelector(".timer-pause-icon").style.display = "block";

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerUI();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      triggerTimerCompletionAlarm();
      logFocusSession();
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById("timer-toggle-text").textContent = "Resume Session";
  document.querySelector(".timer-play-icon").style.display = "block";
  document.querySelector(".timer-pause-icon").style.display = "none";
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timeRemaining = modeDurations[currentTimerMode];
  document.getElementById("timer-toggle-text").textContent = "Start Session";
  document.querySelector(".timer-play-icon").style.display = "block";
  document.querySelector(".timer-pause-icon").style.display = "none";
  updateTimerUI();
}

function switchTimerMode(mode) {
  currentTimerMode = mode;
  resetTimer();
}

function updateTimerUI() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const digits = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  document.getElementById("timer-digits-val").textContent = digits;

  // Render SVG offset progress
  const total = modeDurations[currentTimerMode];
  const progressPercent = (total - timeRemaining) / total;
  const offset = POMO_RING_LENGTH - (progressPercent * POMO_RING_LENGTH);
  document.getElementById("timer-progress-ring").style.strokeDashoffset = offset;
}

function triggerTimerCompletionAlarm() {
  // Web Audio synthesis sound
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Primary sound synth chime
    const playTone = (freq, start, duration) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.3, start);
      gainNode.gain.exponentialRampToValueAtTime(0.01, start + duration);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    const now = audioCtx.currentTime;
    playTone(523.25, now, 0.2); // C5
    playTone(659.25, now + 0.15, 0.2); // E5
    playTone(783.99, now + 0.3, 0.4); // G5
  } catch (err) {
    console.error("Audio Synthesis error", err);
  }
}

function logFocusSession() {
  const durationMinutes = Math.round(modeDurations[currentTimerMode] / 60);
  
  const newLog = {
    id: "log-" + Date.now(),
    mode: currentTimerMode,
    duration: durationMinutes,
    timestamp: new Date().toLocaleString()
  };

  appState.focusSessions.push(newLog);
  
  // Daily Streak Management check
  const todayStr = new Date().toISOString().split("T")[0];
  if (currentTimerMode === "work") {
    if (appState.lastFocusDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      if (appState.lastFocusDate === yesterdayStr) {
        appState.streak++;
      } else {
        appState.streak = 1;
      }
      appState.lastFocusDate = todayStr;
    }
  }

  saveStateData();
  resetTimer();
  renderFocusLogs();
  calculateDashboardMetrics();
  updateStreakDisplay();
}

function renderFocusLogs() {
  const container = document.getElementById("focus-logs-container");
  container.innerHTML = "";

  document.getElementById("focus-logs-count").textContent = `${appState.focusSessions.length} logged`;

  if (appState.focusSessions.length === 0) {
    container.innerHTML = `<div class="empty-state-p">No focus sessions logged.</div>`;
    return;
  }

  // Render logs in reverse chronological order
  const logsCopy = [...appState.focusSessions].reverse();
  logsCopy.forEach(log => {
    const item = document.createElement("div");
    item.className = "focus-log-item";
    
    const icon = log.mode === "work" ? "brain" : "coffee";
    const modeLabel = log.mode === "work" ? "Focus Session" : "Break Session";

    item.innerHTML = `
      <div class="info">
        <span class="mode"><i data-lucide="${icon}" style="width:12px;height:12px;display:inline-block;margin-right:6px;vertical-align:-1px;"></i>${modeLabel}</span>
        <span class="time">${log.timestamp}</span>
      </div>
      <div class="duration">+${log.duration}m</div>
    `;
    container.appendChild(item);
  });

  lucide.createIcons();
}

function updateStreakDisplay() {
  document.getElementById("streak-counter").textContent = `${appState.streak} Day${appState.streak === 1 ? '' : 's'}`;
}

// ==========================================================================
// Dashboard Calculations & Charts drawing
// ==========================================================================
function calculateDashboardMetrics() {
  const totalTasks = appState.tasks.length;
  const completedTasks = appState.tasks.filter(t => t.done).length;
  const pendingTasks = totalTasks - completedTasks;

  const totalGoals = appState.goals.length;
  const completedGoals = appState.goals.filter(g => g.done).length;

  const totalFocusMins = appState.focusSessions.reduce((acc, log) => acc + (log.mode === "work" ? log.duration : 0), 0);
  const totalSessions = appState.focusSessions.filter(log => log.mode === "work").length;

  // Today Focus ring target progress (Target is 50m focus)
  const todayStr = new Date().toISOString().split("T")[0];
  const todayFocusMins = appState.focusSessions.reduce((acc, log) => {
    if (log.mode === "work" && log.timestamp && log.timestamp.includes(todayStr.substring(0, 10))) {
      return acc + log.duration;
    }
    return acc;
  }, 0);

  const focusTarget = 50;
  const focusPercent = Math.min(100, Math.round((todayFocusMins / focusTarget) * 100));
  
  // Dashboard Rings offsets
  document.getElementById("focus-progress-val").textContent = `${focusPercent}%`;
  const focusRingOffset = 251.2 - (progressValueOffset(focusPercent, 100) * 251.2);
  document.getElementById("focus-progress-ring").style.strokeDashoffset = focusRingOffset;
  document.getElementById("today-focus-logged").textContent = `${todayFocusMins}m`;

  // Calculating overall productivity score
  let productivityScore = 0;
  if (totalTasks > 0) {
    productivityScore += (completedTasks / totalTasks) * 50;
  }
  if (totalGoals > 0) {
    productivityScore += (completedGoals / totalGoals) * 30;
  }
  if (todayFocusMins > 0) {
    productivityScore += Math.min(1, todayFocusMins / 50) * 20;
  }
  productivityScore = Math.round(productivityScore);

  // Update UI Stats Row
  document.getElementById("stat-score").textContent = productivityScore;
  document.getElementById("score-progress").style.width = `${productivityScore}%`;

  document.getElementById("stat-tasks").textContent = completedTasks;
  document.getElementById("stat-tasks-pending").textContent = `${pendingTasks} Pending`;

  document.getElementById("stat-focus").textContent = `${totalFocusMins}m`;
  document.getElementById("stat-focus").setAttribute("title", `Logged a total of ${totalFocusMins} minutes focus session.`);
  document.getElementById("stat-sessions").textContent = `${totalSessions} Sessions`;

  document.getElementById("stat-goals").textContent = completedGoals;
  document.getElementById("stat-goals-total").textContent = `${totalGoals} Targets`;

  // Update lists inside Dashboard
  renderDashboardWidgets();
}

function progressValueOffset(val, max) {
  return Math.min(max, Math.max(0, val)) / max;
}

function renderDashboardWidgets() {
  // 1. Injects upcoming tasks
  const upcomingContainer = document.getElementById("upcoming-tasks-container");
  upcomingContainer.innerHTML = "";
  
  const activeTasks = appState.tasks.filter(t => !t.done);
  if (activeTasks.length === 0) {
    upcomingContainer.innerHTML = `<p class="empty-state-p">No pending tasks! All clear.</p>`;
  } else {
    // Sort active tasks by due date
    const sorted = activeTasks.sort((a,b) => (a.due || "9999") > (b.due || "9999") ? 1 : -1);
    sorted.slice(0, 3).forEach(task => {
      const item = document.createElement("div");
      item.className = `upcoming-item prio-${task.priority}`;
      item.innerHTML = `
        <div class="info">
          <span class="title">${task.title}</span>
          <span class="date">${task.due ? 'Due ' + task.due : 'No due date'}</span>
        </div>
        <span class="badge-priority ${task.priority.toLowerCase()}">${task.priority}</span>
      `;
      upcomingContainer.appendChild(item);
    });
  }

  // 2. Injects Today Goals Checklist
  const goalsContainer = document.getElementById("today-goals-container");
  goalsContainer.innerHTML = "";
  
  const dailyGoals = appState.goals.filter(g => g.timeframe === "Daily");
  if (dailyGoals.length === 0) {
    goalsContainer.innerHTML = `<p class="empty-state-p">No daily goals created.</p>`;
  } else {
    dailyGoals.forEach(goal => {
      const item = document.createElement("div");
      item.className = "goal-mini-item";
      item.innerHTML = `
        <span>${goal.title}</span>
        <span class="text-${goal.category.toLowerCase()}" style="font-weight:700;">${goal.done ? 'Done' : 'Pending'}</span>
      `;
      goalsContainer.appendChild(item);
    });
  }
}

// ==========================================================================
// Chart.js Data Visualizations
// ==========================================================================
function initAnalyticsChart() {
  drawCharts();
}

function switchChart(type) {
  activeChartType = type;
  document.getElementById("btn-chart-tasks").classList.remove("active");
  document.getElementById("btn-chart-focus").classList.remove("active");
  
  if (type === "tasks") {
    document.getElementById("btn-chart-tasks").classList.add("active");
  } else {
    document.getElementById("btn-chart-focus").classList.add("active");
  }
  
  drawCharts();
}

function drawCharts() {
  const canvas = document.getElementById("productivityChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Theme labels matching variables styles
  const isLight = !document.body.classList.contains("dark-theme");
  const tickColor = isLight ? "#6e61ab" : "#a39cf4";
  const gridColor = isLight ? "rgba(79, 70, 229, 0.08)" : "rgba(163, 156, 244, 0.08)";

  // Dummy 7 days labels
  const daysLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (activeChartType === "tasks") {
    // Completed tasks mock stats mapping based on actual count
    const completedTasksCount = appState.tasks.filter(t => t.done).length;
    const taskData = [2, 4, 1, 3, completedTasksCount + 1, completedTasksCount, completedTasksCount + 2];

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: daysLabels,
        datasets: [{
          label: "Completed Tasks",
          data: taskData,
          backgroundColor: "#6366f1",
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: tickColor }, grid: { display: false } },
          y: { ticks: { color: tickColor, stepSize: 1 }, grid: { color: gridColor } }
        }
      }
    });
  } else {
    // Focus Minutes mock stats mapping
    const focusLogged = appState.focusSessions.reduce((acc, log) => acc + (log.mode === "work" ? log.duration : 0), 0);
    const focusData = [25, 50, 0, 75, 50, focusLogged > 0 ? focusLogged : 25, focusLogged + 25];

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: daysLabels,
        datasets: [{
          label: "Focus Minutes",
          data: focusData,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: tickColor }, grid: { display: false } },
          y: { ticks: { color: tickColor }, grid: { color: gridColor } }
        }
      }
    });
  }
}

// ==========================================================================
// Achievement Grid Renderers
// ==========================================================================
const badgeDefinitions = [
  { id: "badge-tasks-1", title: "Task Recruit", desc: "Complete at least 1 productivity task.", icon: "check-circle", check: (state) => state.tasks.filter(t => t.done).length >= 1 },
  { id: "badge-tasks-5", title: "Task Crusher", desc: "Complete 5 productivity tasks.", icon: "zap", check: (state) => state.tasks.filter(t => t.done).length >= 5 },
  { id: "badge-focus-1", title: "Deep Work Starter", desc: "Log your first Focus Session.", icon: "brain", check: (state) => state.focusSessions.filter(f => f.mode === "work").length >= 1 },
  { id: "badge-focus-5", title: "Focus Master", desc: "Complete 5 focus sessions.", icon: "flame", check: (state) => state.focusSessions.filter(f => f.mode === "work").length >= 5 },
  { id: "badge-goals-3", title: "Goal Getter", desc: "Achieve 3 workspace goals.", icon: "target", check: (state) => state.goals.filter(g => g.done).length >= 3 },
  { id: "badge-streak-2", title: "Streaker", desc: "Maintain a focus streak of 2+ days.", icon: "award", check: (state) => state.streak >= 2 }
];

function renderAchievements() {
  const container = document.getElementById("badges-grid-container");
  container.innerHTML = "";

  badgeDefinitions.forEach(badge => {
    const isUnlocked = badge.check(appState);
    const card = document.createElement("div");
    card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;

    card.innerHTML = `
      <div class="badge-icon">
        <i data-lucide="${badge.icon}"></i>
      </div>
      <h4>${badge.title}</h4>
      <p>${badge.desc}</p>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

// ==========================================================================
// Reset Workspace Database
// ==========================================================================
function resetDatabase() {
  if (confirm("Are you sure you want to clear all productivity logs and reset defaults?")) {
    appState = {
      tasks: [...mockTasks],
      goals: [...mockGoals],
      notes: [...mockNotes],
      focusSessions: [...mockLogs],
      streak: 2,
      lastFocusDate: "2026-06-06",
      activeNoteId: "note-1"
    };

    saveStateData();
    
    // Refresh visual layers
    renderTasksList();
    renderGoalsList();
    renderNotesList();
    renderFocusLogs();
    calculateDashboardMetrics();
    updateStreakDisplay();
    drawCharts();
    
    alert("Workspace reloaded successfully!");
  }
}
