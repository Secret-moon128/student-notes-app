/**
 * 📊 ADVANCED KANBAN STATE & EVENT DISTRIBUTOR ENGINE
 * Core Architecture: Relational Task State Array with HTML5 DataTransfer Abstraction
 */

// 1. DEFAULT MOCK SEED DATA
const DEFAULT_TASKS = [
    { id: "task_1", title: "Submit AI/ML Lab Report", desc: "Complete Bayesian calibration computations.", status: "todo", updated: Date.now() },
    { id: "task_2", title: "Review Cryptography Notes", desc: "Study ECDSA private key recovery techniques.", status: "inprogress", updated: Date.now() }
];

// 2. GLOBAL STATE MATRIX
let tasks = JSON.parse(localStorage.getItem('kanban_tasks')) || DEFAULT_TASKS;

/**
 * 📐 DOM MATRIX FACTORY & RENDER LOOP
 * Purges and programmatically reconstructs card sub-nodes across column vectors.
 */
function renderKanban() {
    const columns = {
        todo: document.getElementById('col-todo'),
        inprogress: document.getElementById('col-inprogress'),
        completed: document.getElementById('col-completed')
    };

    // Purge existing elements in all containers to prevent double-rendering
    Object.keys(columns).forEach(key => {
        if (columns[key]) columns[key].innerHTML = '';
    });

    // Populate data sets using explicit DOM factory instantiation
    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.setAttribute('draggable', 'true');
        card.setAttribute('id', task.id);
        card.innerHTML = `
            <strong>${task.title}</strong>
            <div>${task.desc || ''}</div>
            <small>Updated: ${new Date(task.updated).toLocaleTimeString()}</small>
        `;

        // Bind Drag Listeners dynamically to the instantiated element
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        if (columns[task.status]) {
            columns[task.status].appendChild(card);
        }
    });
}

/**
 * 🎛️ DRAG & DROP LIFECYCLE CONTROLLERS
 */
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
    });
}

/**
 * 📥 DROP ZONE EVENT CAPTURE REGISTRATION
 */
function initDropZones() {
    const columnContainers = document.querySelectorAll('.kanban-column');

    columnContainers.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        zone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            const targetTaskId = e.dataTransfer.getData('text/plain');
            const targetedColumnId = zone.getAttribute('data-status');

            if (targetTaskId && targetedColumnId) {
                mutateTaskStatus(targetTaskId, targetedColumnId);
            }
        });
    });
}

/**
 * 🧠 STATE MUTATION PIPELINE
 * Locates the targeted target ID block and alters contextual fields cleanly.
 */
function mutateTaskStatus(id, newStatus) {
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        tasks[taskIndex].updated = Date.now();

        localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
        renderKanban();
    }
}

/**
 * 🛒 COMPONENT INPUT PARSER
 */
document.addEventListener('DOMContentLoaded', () => {
    renderKanban();
    initDropZones();

    const form = document.getElementById('form-add-task');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleIn = document.getElementById('input-title');
        const descIn = document.getElementById('input-desc');

        if (!titleIn.value.trim()) return;

        const newTask = {
            id: 'task_' + Date.now(),
            title: titleIn.value.trim(),
            desc: descIn.value.trim(),
            status: 'todo',
            updated: Date.now()
        };

        tasks.push(newTask);
        localStorage.setItem('kanban_tasks', JSON.stringify(tasks));

        titleIn.value = '';
        descIn.value = '';
        renderKanban();
    });
});
