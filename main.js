// State Management
const state = {
  step: 1, // 1: Input, 2: Planning, 3: Result
  tasks: [], // Array of { id, text, duration (min), startTime (calc) }
  wakeUpTime: '07:00',
  currentDate: '',
  dragStartIndex: -1
};

// DOM Elements
const els = {
  app: document.getElementById('app'),
  btnReset: document.getElementById('btn-reset'), // Global Reset
  step1: document.getElementById('step-1'),
  step2: document.getElementById('step-2'),
  step3: document.getElementById('step-3'),

  // Step 1
  taskInput: document.getElementById('task-input-field'),
  chipContainer: document.getElementById('chip-container'),
  btnToStep2: document.getElementById('btn-to-step-2'),

  // Step 2
  planningList: document.getElementById('planning-list'),
  wakeUpBtn: document.getElementById('wake-up-time-btn'),

  // Step 3
  finalTimeline: document.getElementById('final-timeline'),
  btnEditCallback: document.getElementById('btn-edit-routine'),

  // Modal
  modal: document.getElementById('time-picker-modal'),
  pickerHour: document.getElementById('picker-hour'),
  pickerMinute: document.getElementById('picker-minute'),
  pickerConfirm: document.getElementById('picker-confirm'),
  pickerCancel: document.getElementById('picker-cancel')
};

// Initialization
function init() {
  restoreState();
  setupEventListeners();
  renderStep();
  updateRealTimeStatus(); // Initialize real-time visualization
}

function restoreState() {
  const saved = localStorage.getItem('routine-flow-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.step = parsed.step || 1;
      state.tasks = parsed.tasks || [];
      state.wakeUpTime = parsed.wakeUpTime || '07:00';
    } catch (e) {
      console.error('State restore failed', e);
    }
  }
}

function saveState() {
  localStorage.setItem('routine-flow-state', JSON.stringify(state));
}

// Render Logic
function renderStep() {
  // Hide all
  [els.step1, els.step2, els.step3].forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('active');
  });

  // Show active
  const activeEl = document.getElementById(`step-${state.step}`);
  if (activeEl) {
    activeEl.classList.remove('hidden');
    // Force reflow for transition
    void activeEl.offsetWidth;
    activeEl.classList.add('active');
  }

  // Live Clock Visibility
  const clockEl = document.getElementById('live-clock-widget');
  if (state.step === 2 || state.step === 3) {
    clockEl.classList.remove('hidden');
    renderLiveClock();
  } else {
    clockEl.classList.add('hidden');
  }

  // FAB (Global Add) Logic
  let fab = document.getElementById('fab-add-task');
  if (!fab) {
    fab = document.createElement('button');
    fab.id = 'fab-add-task';
    fab.className = 'fab-add';
    fab.textContent = '+';
    fab.onclick = () => {
      if (state.step === 1) {
        const input = els.taskInput;
        if (input.value.trim()) {
          addTask(input.value);
        } else {
          input.focus();
        }
      } else if (state.step === 2) {
        promptNewTask();
      }
    };
    els.app.appendChild(fab);
  }

  if (state.step === 1) {
    fab.style.display = 'flex';
  } else if (state.step === 2 && !state.pendingTask) {
    fab.style.display = 'flex';
  } else {
    fab.style.display = 'none';
  }

  // Specific renders
  if (state.step === 1) renderChips();
  if (state.step === 2) renderPlanningList();
  if (state.step === 3) renderFinalTimeline();
}

function goToStep(step) {
  state.step = step;
  saveState();
  renderStep();
}

// STEP 1 LOGIC: Input & Chips
function addTask(text) {
  if (!text.trim()) return;
  state.tasks.push({
    id: Date.now(),
    text: text.trim(),
    duration: 30, // Default 30 min
    startTime: '' // Calculated later
  });
  renderChips();
  saveState();
}

function removeTask(id) {
  // Directly remove without confirmation as requested
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  renderStep(); // Re-render current step
}

function renderChips() {
  els.chipContainer.innerHTML = '';
  state.tasks.forEach(task => {
    const chip = document.createElement('div');
    chip.className = 'task-chip';
    chip.innerHTML = `${task.text} <span class="remove">×</span>`;
    chip.onclick = () => removeTask(task.id);
    els.chipContainer.appendChild(chip);
  });

  els.taskInput.value = '';
  els.btnToStep2.disabled = state.tasks.length === 0;
}

// STEP 2 LOGIC: Planning List
state.pendingTask = null; // Temporary state for interactive add

function renderPlanningList() {
  els.planningList.innerHTML = '';
  els.wakeUpBtn.textContent = state.wakeUpTime;

  // Add Button (FAB)
  let fab = document.getElementById('fab-add-task');
  if (!fab) {
    fab = document.createElement('button');
    fab.id = 'fab-add-task';
    fab.className = 'fab-add';
    fab.textContent = '+';
    fab.onclick = () => {
      // Step 1: Click adds task (via prompt or focus)
      if (state.step === 1) {
        if (els.taskInput.value.trim()) {
          addTask(els.taskInput.value);
        } else {
          els.taskInput.focus();
        }
      } else {
        // Step 2...
        promptNewTask();
      }
    };
    els.app.appendChild(fab);
  }

  // FAB Visibility Control
  if (state.step === 1) {
    fab.style.display = 'flex';
  } else if (state.step === 2 && !state.pendingTask) {
    fab.style.display = 'flex';
    els.planningList.classList.remove('placement-mode');
  } else {
    fab.style.display = 'none';
    if (state.pendingTask) els.planningList.classList.add('placement-mode');
  }

  // Calculate times
  let currentTime = parseTime(state.wakeUpTime);

  // Render Items with Pre-Zones
  // If placing, we need n+1 zones (before first, between, after last)

  // Zone 0 (Top)
  renderZone(0, currentTime);

  state.tasks.forEach((task, index) => {
    // Current Task Start Time
    const startTimeStr = formatTime(currentTime);

    // Calculate End Time
    currentTime = addMinutes(currentTime, task.duration);
    const endTimeStr = formatTime(currentTime);

    task.startTime = startTimeStr; // Update State

    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = !state.pendingTask; // Disable Drag in placement mode
    card.dataset.index = index;
    if (state.pendingTask) card.style.opacity = '0.6';

    card.innerHTML = `
      <div class="card-header">
        <div class="card-info-main">
            <span class="task-index-badge">${index + 1}</span>
            <span class="card-time">${startTimeStr} ~ ${endTimeStr}</span>
        </div>
        <span class="card-title">${task.text}</span>
        <div class="card-controls">
          <button class="delete-btn" onclick="removeTask(${task.id})" title="삭제">×</button>
          <div class="move-btn" ${state.pendingTask ? 'style="display:none"' : ''}>☰</div>
        </div>
      </div>
      <div class="card-actions">
        <div class="duration-control">
          <button class="dur-btn" onclick="updateDuration(${index}, -5)" ${state.pendingTask ? 'disabled' : ''}>-</button>
          <span class="dur-text" onclick="editDurationNatural(${index})" title="눌러서 시간 입력">${task.duration}분</span>
          <button class="dur-btn" onclick="updateDuration(${index}, 5)" ${state.pendingTask ? 'disabled' : ''}>+</button>
        </div>
      </div>
    `;

    // Drag Events (Only if not placing)
    if (!state.pendingTask) {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragover', handleDragOver);
      card.addEventListener('drop', handleDrop);
      card.addEventListener('dragend', handleDragEnd);
    }

    els.planningList.appendChild(card);

    // Zone N+1 (After this task)
    renderZone(index + 1, currentTime);
  });

  // Re-attach listeners for standby items (since render might be called multiple times, we ensure they are clean)
  setupStandbyListeners();
}

function setupStandbyListeners() {
  const items = document.querySelectorAll('.standby-item');
  items.forEach(item => {
    item.addEventListener('dragstart', handleStandbyDragStart);
  });
}

function handleStandbyDragStart(e) {
  // Set data to identify type
  const type = this.dataset.type; // 'meal' or 'rest'
  e.dataTransfer.setData('application/x-type', type);
  e.dataTransfer.effectAllowed = 'copy';
}

function renderZone(index, timeVal) {
  if (!state.pendingTask) return; // Only show in placement mode

  const zone = document.createElement('div');
  zone.className = 'insert-zone';
  // Helper Text
  // zone.textContent = formatTime(timeVal); 

  zone.onclick = () => confirmPlacement(index);
  els.planningList.appendChild(zone);
}

function promptNewTask() {
  const text = prompt("새로운 할 일을 입력하세요:");
  if (text && text.trim()) {
    state.pendingTask = {
      id: Date.now(),
      text: text.trim(),
      duration: 30,
      startTime: ''
    };
    // Enter Placement Mode
    alert("원하는 위치를 선택해주세요!");
    renderPlanningList();
  }
}

function confirmPlacement(index) {
  if (!state.pendingTask) return;

  // Insert at index
  state.tasks.splice(index, 0, state.pendingTask);
  state.pendingTask = null; // Clear pending

  saveState();
  renderPlanningList(); // Re-render normal view
}

function updateDuration(index, delta) {
  const task = state.tasks[index];
  let newDur = task.duration + delta;
  if (newDur < 5) newDur = 5;
  task.duration = newDur;
  saveState();
  renderPlanningList();
  renderLiveClock(); // Update clock immediately
}


function editDurationNatural(index) {
  if (state.pendingTask) return;

  const task = state.tasks[index];
  const input = prompt(`'${task.text}'의 시간을 입력해주세요.\n예: '1시간', '30분', '1시간 20분'`);

  if (input) {
    const minutes = parseNaturalDuration(input);
    if (minutes > 0) {
      task.duration = minutes;
      saveState();
      renderPlanningList();
      renderLiveClock(); // Update clock immediately
    } else {
      alert("시간을 이해하지 못했어요. '1시간 30분' 처럼 입력해주세요.");
    }
  }
}

function parseNaturalDuration(text) {
  if (!text) return 0;
  text = text.trim();

  // Simple number -> minutes
  if (/^\d+$/.test(text)) return parseInt(text, 10);

  let totalMinutes = 0;

  // Handle "반" (half) e.g., "1시간 반" -> 1.5 hours
  // Replace "반" with "30분" logic if it follows "시간"
  text = text.replace(/(\d+)시간\s*반/, "$1시간 30분");
  text = text.replace(/^반시간/, "30분");

  // Extract hours
  const hourMatch = text.match(/(\d+(\.\d+)?)시간/);
  if (hourMatch) {
    totalMinutes += parseFloat(hourMatch[1]) * 60;
  }

  // Extract minutes
  const minMatch = text.match(/(\d+)분/);
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10);
  }

  return Math.round(totalMinutes);
}

// Drag & Drop
function handleDragStart(e) {
  state.dragStartIndex = +this.dataset.index;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('application/x-type', 'move'); // Mark as move
}

function handleDragOver(e) {
  e.preventDefault();
  // Use state to detect internal move vs external/standby copy
  const isInternal = state.dragStartIndex > -1;
  e.dataTransfer.dropEffect = isInternal ? 'move' : 'copy';
}

function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();

  const dragEndIndex = +this.dataset.index;
  const type = e.dataTransfer.getData('application/x-type');

  if (type === 'meal' || type === 'rest') {
    // Insert New Item
    const text = type === 'meal' ? '식사' : '휴식';
    const duration = type === 'meal' ? 30 : 10;

    const newTask = {
      id: Date.now(),
      text: text,
      duration: duration,
      startTime: ''
    };

    // Determine insert position closer to logic
    // We are dropping ON a card. 
    // If we drop on top half -> insert before. Bottom half -> insert after.
    const rect = this.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const insertIdx = e.clientY < midY ? dragEndIndex : dragEndIndex + 1;

    state.tasks.splice(insertIdx, 0, newTask);

  } else {
    // Swap / Reorder Logic
    // Only if it's a move operation
    if (state.dragStartIndex !== dragEndIndex && state.dragStartIndex > -1) {
      const item = state.tasks[state.dragStartIndex];
      // Check if moving down
      if (state.dragStartIndex < dragEndIndex) {
        state.tasks.splice(dragEndIndex + 1, 0, item);
        state.tasks.splice(state.dragStartIndex, 1);
      } else {
        // Moving up
        state.tasks.splice(dragEndIndex, 0, item);
        state.tasks.splice(state.dragStartIndex + 1, 1);
      }
    }
  }

  saveState();
  renderPlanningList();
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.task-card').forEach(c => c.classList.remove('dragging'));
  state.dragStartIndex = -1;
}

// STEP 3 LOGIC: Final Timeline
function renderFinalTimeline() {
  els.finalTimeline.innerHTML = '';

  // Recalculate one last time to be sure
  let currentTime = parseTime(state.wakeUpTime);

  state.tasks.forEach(task => {
    const startTimeStr = formatTime(currentTime);
    currentTime = addMinutes(currentTime, task.duration);
    const endTimeStr = formatTime(currentTime);

    const item = document.createElement('div');
    item.className = 'timeline-item';
    if (task.completed) item.classList.add('completed'); // Add visual style for completed

    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-time">
         <span class="task-index-badge small" style="margin-right:8px">${index + 1}</span>
         ${startTimeStr} - ${endTimeStr} (${task.duration}분)
      </div>
      <div class="timeline-content">${task.text} ${task.completed ? '✅' : ''}</div>
    `;

    // Double click to complete
    item.addEventListener('dblclick', () => {
      if (!task.completed) {
        if (confirm(`'${task.text}'를 완료했나요?`)) {
          task.completed = true;
          saveState();
          renderFinalTimeline();
        }
      } else {
        // Optional: Toggle back?
        task.completed = false;
        saveState();
        renderFinalTimeline();
      }
    });

    els.finalTimeline.appendChild(item);
  });

  // BedTime
  const bedItem = document.createElement('div');
  bedItem.className = 'timeline-item';
  bedItem.innerHTML = `
    <div class="timeline-dot" style="background:var(--toss-grey)"></div>
    <div class="timeline-time">${formatTime(currentTime)}</div>
    <div class="timeline-content" style="color:var(--toss-grey)">취침 시간</div>
  `;
  els.finalTimeline.appendChild(bedItem);
}

// Time Utils
function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m; // minutes from midnight
}

function formatTime(minutes) {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  // Handle overflow 24h
  if (h >= 24) h -= 24;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function addMinutes(baseMinutes, duration) {
  return baseMinutes + duration;
}

// Modal & Picker Logic
let pickerCallback = null;

function openTimePicker(currentVal, onConfirm) {
  els.modal.classList.remove('hidden');
  renderPickerColumns();
  // Scroll to currentVal logic here (skipped for brevity, defaulting to 07:00 or current)
  pickerCallback = onConfirm;
}

function closePicker() {
  els.modal.classList.add('hidden');
  pickerCallback = null;
}

function renderPickerColumns() {
  els.pickerHour.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const div = document.createElement('div');
    div.className = 'picker-item';
    div.textContent = String(i).padStart(2, '0');
    els.pickerHour.appendChild(div);
  }
  els.pickerMinute.innerHTML = '';
  for (let i = 0; i < 60; i += 5) {
    const div = document.createElement('div');
    div.className = 'picker-item';
    div.textContent = String(i).padStart(2, '0');
    els.pickerMinute.appendChild(div);
  }

  // Simple intersection/active logic
  const activateCenter = (col) => {
    col.addEventListener('scroll', () => {
      // logic to highlight center
    });
  }
}

// Reset
function resetRoutine() {
  if (confirm('모든 일정을 초기화하고 처음으로 돌아갈까요?')) {
    state.step = 1;
    state.tasks = [];
    state.wakeUpTime = '07:00';
    saveState();
    renderStep();

    // Clear styles if any
    document.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
    // reset inputs
    els.taskInput.value = '';
    els.chipContainer.innerHTML = '';
  }
}

// ...
function renderLiveClock() {
  const clockFace = document.getElementById('clock-face');
  const totalTimeEl = document.getElementById('clock-total-time');
  if (!clockFace) return;

  const wakeUpMin = parseTime(state.wakeUpTime);
  let currentMin = wakeUpMin;

  // Create gradient string
  // Format: color startDeg endDeg, color2 startDeg2 endDeg2...
  // 00:00 is 0deg (top). 

  const gradients = [];

  // 1. Sleep/Pre-Wakeup (00:00 ~ wakeUp)
  // 00:00 is 0 min. 
  // Angle = (min / 1440) * 360

  const wakeUpDeg = (wakeUpMin / 1440) * 360;
  gradients.push(`#F2F4F6 0deg ${wakeUpDeg}deg`);

  // 2. Tasks
  let totalDuration = 0;

  // Clear previous labels first
  clockFace.querySelectorAll('.clock-slice-label').forEach(el => el.remove());

  state.tasks.forEach((task, idx) => {
    const startDeg = (currentMin / 1440) * 360;
    currentMin += task.duration;
    const endDeg = (currentMin / 1440) * 360;

    // Cycle Colors
    const colors = ['#0064FF', '#0040E0', '#3385FF', '#0050CC'];
    const color = task.completed ? '#4CAF50' : colors[idx % colors.length];

    gradients.push(`${color} ${startDeg}deg ${endDeg}deg`);
    totalDuration += task.duration;

    // Add Index Label
    // Only if duration is significant enough to show label (e.g. > 15 mins?)
    // But user wants to identify ALL.
    const midDeg = (startDeg + endDeg) / 2;
    addSliceLabel(clockFace, String(idx + 1), midDeg);
  });

  // 3. Remaining Time (Current End ~ 24:00)
  const finalDeg = (currentMin / 1440) * 360;
  if (finalDeg < 360) {
    gradients.push(`#E9ECEF ${finalDeg}deg 360deg`);
  }

  clockFace.style.background = `conic-gradient(${gradients.join(', ')})`;
  totalTimeEl.textContent = `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`;

  // Render Time Markers (Every 3 hours for cleaner look, or custom)
  renderClockMarkers(clockFace);
}

function addSliceLabel(container, text, degree) {
  const label = document.createElement('div');
  label.className = 'clock-slice-label';
  label.textContent = text;

  // Position polar -> cartesian
  // Radius is approx 70% from center
  const radius = 35; // %
  const radians = (degree - 90) * (Math.PI / 180); // -90 because 0 is Top
  const x = 50 + radius * Math.cos(radians);
  const y = 50 + radius * Math.sin(radians);

  label.style.left = `${x}%`;
  label.style.top = `${y}%`;

  container.appendChild(label);
}

function renderClockMarkers(container) {
  // Render hour markers 0...23
  for (let h = 0; h < 24; h++) {
    const marker = document.createElement('div');
    marker.className = 'marker-label';
    marker.textContent = h;
    marker.style.position = 'absolute';

    // Radius > 50% to be outside. 
    // Container is the clock-face relative parent.
    const r = 58; // % distance from center
    const deg = (h / 24) * 360;
    const rad = (deg - 90) * (Math.PI / 180);

    const x = 50 + r * Math.cos(rad);
    const y = 50 + r * Math.sin(rad);

    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    // Re-center logic handled by CSS or transform here
    marker.style.transform = 'translate(-50%, -50%)';

    container.appendChild(marker);
  }
}

// Event Listeners
function setupEventListeners() {
  // Global
  if (els.btnReset) {
    els.btnReset.addEventListener('click', resetRoutine);
  }
  // Step 1
  els.taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask(e.target.value);
    }
  });

  els.btnToStep2.addEventListener('click', () => {
    goToStep(2);
  });

  // Step 2
  els.wakeUpBtn.addEventListener('click', () => {
    openTimePicker(state.wakeUpTime, (newTime) => {
      state.wakeUpTime = newTime;
      saveState();
      renderPlanningList();
    });
  });


  // Step 3
  els.btnEditCallback.addEventListener('click', () => {
    goToStep(2);
  });

  // Picker
  els.pickerCancel.addEventListener('click', closePicker);
  els.pickerConfirm.addEventListener('click', () => {
    // Get values from simple active check or just selection
    // For now, let's mock the "Get Active" logic or implementing it fully requires more lines
    // Implementing simple logic:
    const h = getActivePickerValue(els.pickerHour);
    const m = getActivePickerValue(els.pickerMinute);
    if (pickerCallback) pickerCallback(`${h}:${m}`);
    closePicker();
  });

  // Picker scroll visual logic
  [els.pickerHour, els.pickerMinute].forEach(col => {
    col.addEventListener('scroll', () => updateActivePickerItem(col));
    // Init
    setTimeout(() => updateActivePickerItem(col), 100);
  });
}

// Real-Time Logic for "Passing Time"
function updateRealTimeStatus() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 1. Update Clock Hand
  const clockFace = document.getElementById('clock-face');
  if (clockFace && !clockFace.querySelector('.clock-hand')) {
    const hand = document.createElement('div');
    hand.className = 'clock-hand';
    clockFace.appendChild(hand);
  }

  const hand = clockFace ? clockFace.querySelector('.clock-hand') : null;
  if (hand) {
    const deg = (currentMinutes / 1440) * 360;
    hand.style.transform = `translateX(-50%) rotate(${deg}deg)`;
  }

  // 2. Update Task List Status
  if (!state.tasks.length) return;

  let startMin = parseTime(state.wakeUpTime);

  const cards = document.querySelectorAll('.task-card');
  cards.forEach(card => {
    const idx = +card.dataset.index;
    const task = state.tasks[idx];
    if (!task) return;

    const endMin = startMin + task.duration;

    card.classList.remove('past', 'current');

    // Logic: 
    // Passed: endMin <= currentMinutes
    // Current: startMin <= currentMinutes < endMin

    if (currentMinutes >= endMin) {
      card.classList.add('past');
    } else if (currentMinutes >= startMin && currentMinutes < endMin) {
      card.classList.add('current');
    }

    startMin += task.duration;
  });
}

// Start Timer
setInterval(updateRealTimeStatus, 30000); // Check every 30s

function updateActivePickerItem(col) {
  const center = col.scrollTop + (col.clientHeight / 2);
  const items = col.querySelectorAll('.picker-item');
  let closest = null;
  let minDiff = Infinity;
  items.forEach(item => {
    const box = item.getBoundingClientRect();
    const colBox = col.getBoundingClientRect();
    const diff = Math.abs((box.top + box.height / 2) - (colBox.top + colBox.height / 2));
    item.classList.remove('active');
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  });
  if (closest) closest.classList.add('active');
}

function getActivePickerValue(col) {
  const active = col.querySelector('.active');
  return active ? active.textContent : '00';
}

// Start
init();
