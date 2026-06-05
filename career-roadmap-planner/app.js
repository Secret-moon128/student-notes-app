// ==========================================================================
// Career Paths Database Catalog
// ==========================================================================
const careerRoadmaps = {
  frontend: {
    title: "Frontend Developer",
    desc: "Visual guide and learning paths to design, build, and deploy modern interactive user interfaces in web browsers.",
    icon: "monitor",
    stages: [
      {
        name: "Stage 1: The Foundations",
        skills: [
          {
            id: "fe-internet",
            name: "How the Internet Works",
            time: "~3 hours",
            category: "Basics",
            topics: ["HTTP/HTTPS protocols", "DNS & Domain Names", "Browsers & Rendering Engines", "Hosting & Servers"],
            resources: [
              { label: "MDN: How the Web works", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works" },
              { label: "Crash Course: Computer Networks", url: "https://www.youtube.com/watch?v=qiQR5rTSshw" }
            ]
          },
          {
            id: "fe-html",
            name: "HTML5 & Structuring",
            time: "~6 hours",
            category: "Foundations",
            topics: ["Semantic HTML tags", "Forms & Input validation", "SEO basics & Meta tags", "Accessibility (a11y) basics"],
            resources: [
              { label: "MDN: HTML Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
              { label: "W3C Web Accessibility Tutorial", url: "https://www.w3.org/WAI/tutorials/" }
            ]
          },
          {
            id: "fe-css",
            name: "CSS3 Styles & Layouts",
            time: "~12 hours",
            category: "Foundations",
            topics: ["CSS Grid & Flexbox", "Box Model & Positioning", "Media queries & Responsive design", "CSS Variables & Transitions"],
            resources: [
              { label: "CSS-Tricks: Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
              { label: "CSS-Tricks: Grid Guide", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" }
            ]
          }
        ]
      },
      {
        name: "Stage 2: Programming Logic",
        skills: [
          {
            id: "fe-js",
            name: "JavaScript Essentials",
            time: "~20 hours",
            category: "Programming",
            topics: ["Variables, Loops & Scope", "DOM manipulation & Events", "Promises & Async/Await", "Fetch API & Fetching JSON"],
            resources: [
              { label: "javascript.info Tutorial", url: "https://javascript.info/" },
              { label: "MDN: Fetching Data from Server", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data" }
            ]
          },
          {
            id: "fe-git",
            name: "Git & Version Control",
            time: "~5 hours",
            category: "Tools",
            topics: ["Basic commands (clone, add, commit)", "Branching & Merging", "Pull Requests & GitHub workflows", "Resolving merge conflicts"],
            resources: [
              { label: "GitHub: Git Handbook", url: "https://guides.github.com/introduction/git-handbook/" },
              { label: "Visual Git Branching Tutorial", url: "https://learngitbranching.js.org/" }
            ]
          }
        ]
      },
      {
        name: "Stage 3: Frameworks & Building",
        skills: [
          {
            id: "fe-npm",
            name: "Package Managers & Tooling",
            time: "~4 hours",
            category: "Tools",
            topics: ["NPM & Yarn workflows", "Scripts & dependencies", "Vite / Webpack configs", "ESLint & Prettier linters"],
            resources: [
              { label: "NPM documentation guides", url: "https://docs.npmjs.com/" },
              { label: "Vite Guide", url: "https://vitejs.dev/guide/" }
            ]
          },
          {
            id: "fe-react",
            name: "React.js Framework",
            time: "~25 hours",
            category: "Frameworks",
            topics: ["JSX & Components", "State & Hook APIs (useState, useEffect)", "Props & Event Handling", "Context API & Global States"],
            resources: [
              { label: "Official React Documentation", url: "https://react.dev/" },
              { label: "Scrimba React Course (Free)", url: "https://scrimba.com/learn/learnreact" }
            ]
          }
        ]
      }
    ]
  },
  
  backend: {
    title: "Backend Developer",
    desc: "Structured journey to master server-side logic, databases, APIs, scaling, and secure cloud environments.",
    icon: "server",
    stages: [
      {
        name: "Stage 1: Core Technologies",
        skills: [
          {
            id: "be-lang",
            name: "Server-side Language",
            time: "~25 hours",
            category: "Programming",
            topics: ["Node.js / Express essentials", "Python / Django framework basics", "Go / Rust syntax structures", "Asynchronous runtimes"],
            resources: [
              { label: "Node.js Learning path", url: "https://nodejs.dev/en/learn/" },
              { label: "Django Girls Tutorial (Python)", url: "https://tutorial.djangogirls.org/" }
            ]
          },
          {
            id: "be-apis",
            name: "APIs Design & Architecture",
            time: "~10 hours",
            category: "Design",
            topics: ["RESTful API design principles", "GraphQL query schemas", "Status codes & JSON payloads", "Authentication (JWT, OAuth)"],
            resources: [
              { label: "RESTful API Tutorial", url: "https://restfulapi.net/" },
              { label: "GraphQL Introduction", url: "https://graphql.org/learn/" }
            ]
          }
        ]
      },
      {
        name: "Stage 2: Databases & Storage",
        skills: [
          {
            id: "be-relational",
            name: "Relational Databases",
            time: "~15 hours",
            category: "Databases",
            topics: ["PostgreSQL & MySQL concepts", "SQL Queries & Joins", "DB Schema design & normalization", "Index structures & Optimization"],
            resources: [
              { label: "SQLBolt: Interactive SQL Course", url: "https://sqlbolt.com/" },
              { label: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" }
            ]
          },
          {
            id: "be-nosql",
            name: "NoSQL Databases",
            time: "~10 hours",
            category: "Databases",
            topics: ["MongoDB Document structures", "Redis Key-Value caching", "Scaling datasets", "Consistency models"],
            resources: [
              { label: "MongoDB University courses", url: "https://university.mongodb.com/" },
              { label: "Redis Crash Course", url: "https://redis.io/docs/latest/develop/data-types/" }
            ]
          }
        ]
      },
      {
        name: "Stage 3: DevOps & Scaling",
        skills: [
          {
            id: "be-docker",
            name: "Docker Containers",
            time: "~8 hours",
            category: "DevOps",
            topics: ["Containerization benefits", "Dockerfiles & builds", "Docker Compose environments", "Volumes & network links"],
            resources: [
              { label: "Docker Guide: Quickstart", url: "https://docs.docker.com/get-started/" }
            ]
          },
          {
            id: "be-caching",
            name: "Caching & Message Queues",
            time: "~8 hours",
            category: "Scaling",
            topics: ["Server-side caching with Redis", "RabbitMQ / Kafka basics", "Background jobs", "Rate limiters"],
            resources: [
              { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
            ]
          }
        ]
      }
    ]
  },

  data_science: {
    title: "Data Scientist",
    desc: "Analytical roadmap covering data structures, statistics, programming language toolkits, and machine learning models.",
    icon: "database",
    stages: [
      {
        name: "Stage 1: Core Mathematical Toolkit",
        skills: [
          {
            id: "ds-python",
            name: "Python for Data Analysis",
            time: "~15 hours",
            category: "Languages",
            topics: ["Data structures: lists, dicts, arrays", "Pandas for dataframes manipulations", "NumPy vector calculations", "Jupyter Notebook workflows"],
            resources: [
              { label: "Kaggle: Python Course", url: "https://www.kaggle.com/learn/python" },
              { label: "Pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" }
            ]
          },
          {
            id: "ds-stats",
            name: "Probability & Statistics",
            time: "~20 hours",
            category: "Maths",
            topics: ["Descriptive Stats: Mean, Median, Std dev", "Probability distributions", "Hypothesis testing & p-values", "Regression models basics"],
            resources: [
              { label: "Khan Academy: Statistics course", url: "https://www.khanacademy.org/math/statistics-probability" }
            ]
          }
        ]
      },
      {
        name: "Stage 2: Wrangling & Visualizing",
        skills: [
          {
            id: "ds-viz",
            name: "Data Visualization",
            time: "~8 hours",
            category: "Analysis",
            topics: ["Matplotlib plotting", "Seaborn visual structures", "Plotly interactive dashboard building", "Storytelling with datasets"],
            resources: [
              { label: "Kaggle: Data Visualization", url: "https://www.kaggle.com/learn/data-visualization" }
            ]
          },
          {
            id: "ds-cleaning",
            name: "Data Cleaning & Preprocessing",
            time: "~12 hours",
            category: "Analysis",
            topics: ["Handling missing values", "Outlier detection & filtering", "One-hot Encoding categories", "Feature Scaling & Normalization"],
            resources: [
              { label: "Data Preprocessing Guides", url: "https://scikit-learn.org/stable/modules/preprocessing.html" }
            ]
          }
        ]
      },
      {
        name: "Stage 3: ML Models",
        skills: [
          {
            id: "ds-supervised",
            name: "Supervised Learning",
            time: "~20 hours",
            category: "ML Models",
            topics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Support Vector Machines (SVM)", "Scikit-Learn usage"],
            resources: [
              { label: "Scikit-Learn Tutorial", url: "https://scikit-learn.org/stable/tutorial/index.html" },
              { label: "Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" }
            ]
          }
        ]
      }
    ]
  },

  cybersecurity: {
    title: "Cybersecurity Analyst",
    desc: "A solid visual guide to mastering operating systems, network topologies, offensive auditing, and defensive mitigation configurations.",
    icon: "shield",
    stages: [
      {
        name: "Stage 1: Core Networking & OS",
        skills: [
          {
            id: "sec-networks",
            name: "Network Security Basics",
            time: "~15 hours",
            category: "Networking",
            topics: ["TCP/IP Model & packets routing", "Port configurations & protocols", "Subnets, DNS, DHCP rules", "Wireshark packet sniffing tools"],
            resources: [
              { label: "Wireshark User Guide", url: "https://www.wireshark.org/docs/" },
              { label: "CompTIA Network+ Crash Course", url: "https://www.youtube.com/watch?v=8K0tLrx_eH0" }
            ]
          },
          {
            id: "sec-linux",
            name: "Linux Administration",
            time: "~10 hours",
            category: "Systems",
            topics: ["Command Line Interface navigation", "User Permissions & access configs", "Cron jobs & service scripting", "System log auditing"],
            resources: [
              { label: "Linux Journey tutorial", url: "https://linuxjourney.com/" }
            ]
          }
        ]
      },
      {
        name: "Stage 2: Defensive & Offensive Techniques",
        skills: [
          {
            id: "sec-offensive",
            name: "Ethical Hacking & Audits",
            time: "~20 hours",
            category: "Offensive",
            topics: ["Nmap port sweeps", "Metasploit exploit vectors", "OWASP Top 10 vulnerabilities (SQLi, XSS)", "Password hash crack methods"],
            resources: [
              { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
              { label: "TryHackMe Interactive Academy", url: "https://tryhackme.com/" }
            ]
          },
          {
            id: "sec-defensive",
            name: "Defensive Firewalls & Logs",
            time: "~12 hours",
            category: "Defensive",
            topics: ["Firewall configs (ufw, iptables)", "Intrusion Detection Systems (IDS)", "SIEM systems & Splunk logs", "Security patching"],
            resources: [
              { label: "Splunk Free training options", url: "https://www.splunk.com/en_us/training/free-courses-overview.html" }
            ]
          }
        ]
      }
    ]
  },

  uiux: {
    title: "UI/UX Designer",
    desc: "Creative track teaching wireframes, high-fidelity mockups, typography selection, user interviews, and Figma component layouts.",
    icon: "pen-tool",
    stages: [
      {
        name: "Stage 1: Design Principles",
        skills: [
          {
            id: "ux-theory",
            name: "UX Research & Methodologies",
            time: "~15 hours",
            category: "Theory",
            topics: ["User Personas construction", "User Journeys mapping", "Information Architecture (IA)", "Heuristic evaluations"],
            resources: [
              { label: "Interaction Design Foundation Guides", url: "https://www.interaction-design.org/literature" },
              { label: "Nielsen Norman Group Articles", url: "https://www.nngroup.com/articles/" }
            ]
          },
          {
            id: "ui-theory",
            name: "Visual Hierarchy & Layouts",
            time: "~10 hours",
            category: "Theory",
            topics: ["Color theory & schemes", "Typography pairings & sizes", "Grid systems alignment", "Gestalt Principles of design"],
            resources: [
              { label: "Refactoring UI (Design concepts)", url: "https://www.refactoringui.com/" }
            ]
          }
        ]
      },
      {
        name: "Stage 2: Tooling & Prototyping",
        skills: [
          {
            id: "ui-figma",
            name: "Figma Mastery",
            time: "~20 hours",
            category: "Tools",
            topics: ["Vector paths & nodes manipulation", "Auto-Layout configs", "Components & design libraries", "Interactive prototyping animations"],
            resources: [
              { label: "Figma Learn Tutorials Portal", url: "https://help.figma.com/hc/en-us/categories/360002051614-Learn" }
            ]
          },
          {
            id: "ui-wireframe",
            name: "Wireframing & Handoff",
            time: "~8 hours",
            category: "Design",
            topics: ["Low-fidelity pencil sketching", "High-fidelity mockups creation", "User feedback interviews", "Design specifications export"],
            resources: [
              { label: "Google UX Professional Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design" }
            ]
          }
        ]
      }
    ]
  }
};

// ==========================================================================
// Application State Controller
// ==========================================================================
let currentPathKey = "frontend";
let selectedSkillId = null;

// State schema structure:
// {
//    [skillId]: {
//       status: 'unstarted' | 'progress' | 'completed',
//       checkedTopics: [string, string],
//       notes: string
//    }
// }
let userProgress = {};

// Initialize UI elements
document.addEventListener("DOMContentLoaded", () => {
  loadProgressFromStorage();
  renderPathSelector();
  loadPath(currentPathKey);
  bindEvents();
  lucide.createIcons();
});

// Load storage
function loadProgressFromStorage() {
  const data = localStorage.getItem("mapcraft_roadmap_progress_v1");
  if (data) {
    try {
      userProgress = JSON.parse(data);
    } catch (e) {
      userProgress = {};
    }
  }
}

// Save storage
function saveProgressToStorage() {
  localStorage.setItem("mapcraft_roadmap_progress_v1", JSON.stringify(userProgress));
  calculateAllStats();
}

// Get or create node progress object
function getNodeProgress(id) {
  if (!userProgress[id]) {
    userProgress[id] = {
      status: "unstarted",
      checkedTopics: [],
      notes: ""
    };
  }
  return userProgress[id];
}

// Binds actions
function bindEvents() {
  // Theme selection dashboard toggle
  const themeToggleBtn = document.getElementById("theme-toggle");
  themeToggleBtn.addEventListener("click", () => {
    const body = document.body;
    if (body.classList.contains("dark-theme")) {
      body.classList.replace("dark-theme", "light-theme");
    } else {
      body.classList.replace("light-theme", "dark-theme");
    }
  });

  // Reset Progress Button
  const resetBtn = document.getElementById("reset-progress-btn");
  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear ALL your learning progress? This cannot be undone.")) {
      userProgress = {};
      saveProgressToStorage();
      loadPath(currentPathKey);
      closeDetailDrawer();
      alert("All progress has been reset successfully!");
    }
  });

  // Notes update event listener
  const notesTextarea = document.getElementById("skill-notes");
  notesTextarea.addEventListener("input", (e) => {
    if (selectedSkillId) {
      const nodeProg = getNodeProgress(selectedSkillId);
      nodeProg.notes = e.target.value;
      saveProgressToStorage();
    }
  });

  // Status Selector Buttons Mapping
  const statusButtons = document.querySelectorAll(".status-btn");
  statusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!selectedSkillId) return;
      
      const newStatus = btn.getAttribute("data-status");
      
      // Update DOM button states
      statusButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Update Node State
      const nodeProg = getNodeProgress(selectedSkillId);
      nodeProg.status = newStatus;
      
      // If completed, check all topics
      if (newStatus === "completed") {
        const skillData = findSkillInCatalog(selectedSkillId);
        if (skillData) {
          nodeProg.checkedTopics = [...skillData.topics];
        }
      } else if (newStatus === "unstarted") {
        nodeProg.checkedTopics = [];
      }
      
      saveProgressToStorage();
      
      // Re-render Roadmap UI & update the Detail panel state
      renderRoadmapCanvas(currentPathKey);
      loadSkillDetails(selectedSkillId);
    });
  });
}

// Render left path buttons
function renderPathSelector() {
  const container = document.getElementById("paths-list");
  container.innerHTML = "";

  Object.keys(careerRoadmaps).forEach(key => {
    const path = careerRoadmaps[key];
    const percentage = calculatePathCompletion(key);
    
    const btn = document.createElement("button");
    btn.className = `path-card ${key === currentPathKey ? 'active' : ''}`;
    btn.id = `path-card-${key}`;
    btn.innerHTML = `
      <div class="path-card-title">${path.title}</div>
      <div class="path-card-progress">
        <div class="path-card-bar-bg">
          <div class="path-card-bar-fill" style="width: ${percentage}%;"></div>
        </div>
        <span class="path-card-percentage">${percentage}%</span>
      </div>
    `;
    
    btn.addEventListener("click", () => {
      document.querySelectorAll(".path-card").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      currentPathKey = key;
      loadPath(key);
      closeDetailDrawer();
    });
    
    container.appendChild(btn);
  });
}

// Load dynamic career path details
function loadPath(key) {
  const path = careerRoadmaps[key];
  document.getElementById("current-path-title").textContent = path.title;
  document.getElementById("current-path-desc").textContent = path.desc;
  
  renderRoadmapCanvas(key);
  calculateAllStats();
}

// Re-render core roadmap elements in the dashboard scroll view
function renderRoadmapCanvas(key) {
  const path = careerRoadmaps[key];
  const container = document.getElementById("roadmap-stages-container");
  container.innerHTML = "";

  path.stages.forEach(stage => {
    const stageSec = document.createElement("div");
    stageSec.className = "roadmap-stage-section";
    
    stageSec.innerHTML = `
      <div class="stage-badge">${stage.name}</div>
      <div class="stage-nodes-row"></div>
    `;
    
    const row = stageSec.querySelector(".stage-nodes-row");
    
    stage.skills.forEach(skill => {
      const nodeState = getNodeProgress(skill.id);
      const skillNode = document.createElement("div");
      skillNode.className = `skill-node status-${nodeState.status} ${skill.id === selectedSkillId ? 'active-selection' : ''}`;
      skillNode.id = `node-${skill.id}`;
      
      skillNode.innerHTML = `
        <div class="skill-node-name">${skill.name}</div>
        <div class="skill-node-duration">${skill.time}</div>
      `;
      
      skillNode.addEventListener("click", () => {
        // Toggle selection state styles
        document.querySelectorAll(".skill-node").forEach(n => n.classList.remove("active-selection"));
        skillNode.classList.add("active-selection");
        selectedSkillId = skill.id;
        loadSkillDetails(skill.id);
      });
      
      row.appendChild(skillNode);
    });
    
    container.appendChild(stageSec);
  });
}

// Load Skill details in the sidebar panel
function loadSkillDetails(id) {
  const skill = findSkillInCatalog(id);
  if (!skill) return;

  selectedSkillId = id;
  const nodeState = getNodeProgress(id);

  // Setup display drawer views
  document.getElementById("drawer-empty-view").style.display = "none";
  document.getElementById("drawer-content-view").style.display = "block";

  // Text values mapping
  document.getElementById("skill-detail-category").textContent = skill.category;
  document.getElementById("skill-detail-name").textContent = skill.name;
  document.getElementById("skill-detail-time").textContent = `Estimate: ${skill.time}`;
  document.getElementById("skill-notes").value = nodeState.notes || "";

  // Set active status button
  const statusButtons = document.querySelectorAll(".status-btn");
  statusButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-status") === nodeState.status) {
      btn.classList.add("active");
    }
  });

  // Render Sub-topics Checkboxes
  const checklistBox = document.getElementById("topics-checklist-box");
  checklistBox.innerHTML = "";
  
  skill.topics.forEach(topic => {
    const isChecked = nodeState.checkedTopics.includes(topic);
    const item = document.createElement("label");
    item.className = `checkbox-item ${isChecked ? 'checked' : ''}`;
    
    item.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''}>
      <span>${topic}</span>
    `;
    
    const input = item.querySelector("input");
    input.addEventListener("change", () => {
      const isNowChecked = input.checked;
      
      if (isNowChecked) {
        if (!nodeState.checkedTopics.includes(topic)) {
          nodeState.checkedTopics.push(topic);
        }
        item.classList.add("checked");
        
        // If topics are partially checked, push state to In Progress automatically
        if (nodeState.status === "unstarted") {
          nodeState.status = "progress";
          updateStatusDOM("progress");
        }
      } else {
        nodeState.checkedTopics = nodeState.checkedTopics.filter(t => t !== topic);
        item.classList.remove("checked");
        
        // If all subtopics cleared, toggle status back
        if (nodeState.checkedTopics.length === 0 && nodeState.status === "progress") {
          nodeState.status = "unstarted";
          updateStatusDOM("unstarted");
        }
      }
      
      // If all subtopics completed, toggle status to Completed
      if (nodeState.checkedTopics.length === skill.topics.length) {
        nodeState.status = "completed";
        updateStatusDOM("completed");
      } else if (nodeState.status === "completed" && nodeState.checkedTopics.length < skill.topics.length) {
        nodeState.status = "progress";
        updateStatusDOM("progress");
      }

      saveProgressToStorage();
      renderRoadmapCanvas(currentPathKey);
    });

    checklistBox.appendChild(item);
  });

  // Render Custom resources
  const resourcesBox = document.getElementById("resources-links-box");
  resourcesBox.innerHTML = "";
  
  skill.resources.forEach(res => {
    const rLink = document.createElement("a");
    rLink.className = "resource-link-card";
    rLink.href = res.url;
    rLink.target = "_blank";
    rLink.innerHTML = `
      <span>${res.label}</span>
      <i data-lucide="external-link"></i>
    `;
    resourcesBox.appendChild(rLink);
  });
  lucide.createIcons();
}

function updateStatusDOM(status) {
  const statusButtons = document.querySelectorAll(".status-btn");
  statusButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-status") === status) {
      btn.classList.add("active");
    }
  });
}

// Reset panel view state
function closeDetailDrawer() {
  selectedSkillId = null;
  document.getElementById("drawer-empty-view").style.display = "flex";
  document.getElementById("drawer-content-view").style.display = "none";
}

// Find Skill info matching target ID
function findSkillInCatalog(id) {
  let found = null;
  Object.keys(careerRoadmaps).forEach(pathKey => {
    careerRoadmaps[pathKey].stages.forEach(stage => {
      stage.skills.forEach(skill => {
        if (skill.id === id) found = skill;
      });
    });
  });
  return found;
}

// ==========================================================================
// Completion calculations & stats
// ==========================================================================

// Calculate path completion percentage
function calculatePathCompletion(pathKey) {
  const path = careerRoadmaps[pathKey];
  let totalSkills = 0;
  let completedSkills = 0;

  path.stages.forEach(stage => {
    stage.skills.forEach(skill => {
      totalSkills++;
      const nodeState = getNodeProgress(skill.id);
      if (nodeState.status === "completed") {
        completedSkills++;
      }
    });
  });

  if (totalSkills === 0) return 0;
  return Math.round((completedSkills / totalSkills) * 100);
}

// Recalculates stats panel
function calculateAllStats() {
  // Update Left sidebar progress sliders
  Object.keys(careerRoadmaps).forEach(key => {
    const percentage = calculatePathCompletion(key);
    const cardProgressFill = document.querySelector(`#path-card-${key} .path-card-bar-fill`);
    const cardProgressLabel = document.querySelector(`#path-card-${key} .path-card-percentage`);
    
    if (cardProgressFill) cardProgressFill.style.width = `${percentage}%`;
    if (cardProgressLabel) cardProgressLabel.textContent = `${percentage}%`;
  });

  // Calculate current active path stats
  const path = careerRoadmaps[currentPathKey];
  let totalInPath = 0;
  let completedInPath = 0;
  
  path.stages.forEach(stage => {
    stage.skills.forEach(skill => {
      totalInPath++;
      if (getNodeProgress(skill.id).status === "completed") {
        completedInPath++;
      }
    });
  });

  const pathPercentage = totalInPath === 0 ? 0 : Math.round((completedInPath / totalInPath) * 100);
  
  document.getElementById("progress-percentage-label").textContent = `${pathPercentage}%`;
  document.getElementById("progress-bar-fill").style.width = `${pathPercentage}%`;
  document.getElementById("progress-completed-meta").textContent = `${completedInPath} / ${totalInPath} Completed`;

  // Calculate global statistics values across all career branches
  let totalCompletedAll = 0;
  let exploredPaths = 0;

  Object.keys(careerRoadmaps).forEach(pathKey => {
    let completedInThisPath = 0;
    careerRoadmaps[pathKey].stages.forEach(stage => {
      stage.skills.forEach(skill => {
        if (userProgress[skill.id] && userProgress[skill.id].status === "completed") {
          totalCompletedAll++;
          completedInThisPath++;
        }
      });
    });
    
    if (completedInThisPath > 0) {
      exploredPaths++;
    }
  });

  document.getElementById("stat-paths-count").textContent = exploredPaths;
  document.getElementById("stat-completed-skills").textContent = totalCompletedAll;
}
