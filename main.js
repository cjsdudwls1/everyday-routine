const state = {
  step: 1, // 1: Input, 2: Planning, 3: Result
  tasks: [], // Array of { id, text, duration (min), startTime (calc) }
  wakeUpTime: '07:00',
  currentDate: '',
  dragStartIndex: -1,
  lang: 'ko' // Default
};

const translations = {
  ko: {
    reset: "초기화",
    step1_title: "오늘 할 일을<br>모두 적어주세요",
    step1_subtitle: "순서는 나중에 정할 수 있어요.",
    placeholder: "예: 영어 공부하기",
    intro_title: "루틴 플로우 200% 활용하기",
    intro_step1: "할 일 입력",
    intro_step2: "시간 배분",
    intro_step3: "하루 완성",
    intro_desc: "복잡한 계획은 그만.<br>할 일만 적으면 시간이 저절로 정리돼요.",
    footer_about: "서비스 소개",
    footer_privacy: "개인정보처리방침",
    footer_terms: "이용약관",
    btn_next: "다음",
    step2_title: "언제, 얼마나<br>진행할까요?",
    step2_subtitle: "시간을 조정하고 순서를 바꿔보세요.",
    label_wakeup: "기상 시간",
    standby_meal: "식사",
    standby_rest: "휴식",
    step3_title: "오늘의 루틴이<br>완성되었어요!",
    step3_subtitle: "알차게 보내세요.",
    btn_edit: "수정",
    btn_save: "저장하기",
    modal_title: "시간 설정",
    btn_cancel: "취소",
    btn_confirm: "확인",
    // JS Alerts
    prompt_new_task: "새로운 할 일을 입력하세요:",
    alert_placement: "원하는 위치를 선택해주세요!",
    prompt_duration: "'{task}'의 시간을 입력해주세요.\n예: '1시간', '30분', '1시간 20분'",
    alert_duration_error: "시간을 이해하지 못했어요. '1시간 30분' 처럼 입력해주세요.",
    confirm_reset: "모든 일정을 초기화하고 처음으로 돌아갈까요?",
    confirm_complete: "'{task}'를 완료했나요?",
    label_bedtime: "취침 시간",
    current_status: "진행 중"
  },
  en: {
    reset: "Reset",
    step1_title: "List all your tasks<br>for today",
    step1_subtitle: "You can arrange them later.",
    placeholder: "E.g. Study English",
    intro_title: "Maximize Routine Flow",
    intro_step1: "List Tasks",
    intro_step2: "Allocate Time",
    intro_step3: "Complete Day",
    intro_desc: "No more complex planning.<br>Just list tasks and organize your time.",
    footer_about: "About",
    footer_privacy: "Privacy",
    footer_terms: "Terms",
    btn_next: "Next",
    step2_title: "When and how long?",
    step2_subtitle: "Adjust time and order.",
    label_wakeup: "Wake Up",
    standby_meal: "Meal",
    standby_rest: "Rest",
    step3_title: "Your routine is<br>ready!",
    step3_subtitle: "Have a productive day.",
    btn_edit: "Edit",
    btn_save: "Save",
    modal_title: "Set Time",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    prompt_new_task: "Enter a new task:",
    alert_placement: "Please select a location!",
    prompt_duration: "Enter duration for '{task}'.\nE.g. '1 hour', '30 min'",
    alert_duration_error: "Could not understand. Try '1 hour 30 min'.",
    confirm_reset: "Reset all schedules and start over?",
    confirm_complete: "Did you complete '{task}'?",
    label_bedtime: "Bedtime",
    current_status: "Ongoing"
  },
  zh: {
    reset: "重置",
    step1_title: "请写下今天<br>所有的待办事项",
    step1_subtitle: "顺序稍后可以调整。",
    placeholder: "例如：学习英语",
    intro_title: "充分利用 Routine Flow",
    intro_step1: "输入待办",
    intro_step2: "分配时间",
    intro_step3: "完成计划",
    intro_desc: "告别复杂的计划。<br>只需列出待办，时间自动整理。",
    footer_about: "关于服务",
    footer_privacy: "隐私政策",
    footer_terms: "使用条款",
    btn_next: "下一步",
    step2_title: "何时进行，<br>持续多久？",
    step2_subtitle: "请调整时间和顺序。",
    label_wakeup: "起床时间",
    standby_meal: "用餐",
    standby_rest: "休息",
    step3_title: "今天的日程<br>已完成！",
    step3_subtitle: "祝您度过充实的一天。",
    btn_edit: "修改",
    btn_save: "保存",
    modal_title: "时间设置",
    btn_cancel: "取消",
    btn_confirm: "确认",
    prompt_new_task: "请输入新的待办事项：",
    alert_placement: "请选择位置！",
    prompt_duration: "请输入'{task}'的时间。\n例如：'1小时'，'30分钟'",
    alert_duration_error: "无法理解时间。请输入如 '1小时 30分钟'。",
    confirm_reset: "要重置所有日程并重新开始吗？",
    confirm_complete: "完成了'{task}'吗？",
    label_bedtime: "就寝时间",
    current_status: "进行中"
  },
  ja: {
    reset: "初期化",
    step1_title: "今日のやることを<br>すべて書いてください",
    step1_subtitle: "順番は後で決められます。",
    placeholder: "例：英語の勉強",
    intro_title: "Routine Flowを200%活用",
    intro_step1: "入力",
    intro_step2: "時間配分",
    intro_step3: "完成",
    intro_desc: "複雑な計画は不要。<br>やることを書くだけで時間が整理されます。",
    footer_about: "サービス紹介",
    footer_privacy: "プライバシー",
    footer_terms: "利用規約",
    btn_next: "次へ",
    step2_title: "いつ、どのくらい<br>行いますか？",
    step2_subtitle: "時間を調整して順番を変えてみてください。",
    label_wakeup: "起床時間",
    standby_meal: "食事",
    standby_rest: "休憩",
    step3_title: "今日のルーチンが<br>完成しました！",
    step3_subtitle: "充実した一日を。",
    btn_edit: "修正",
    btn_save: "保存",
    modal_title: "時間設定",
    btn_cancel: "キャンセル",
    btn_confirm: "確認",
    prompt_new_task: "新しいタスクを入力してください:",
    alert_placement: "場所を選択してください！",
    prompt_duration: "'{task}'の時間を入力してください。\n例: '1時間', '30分'",
    alert_duration_error: "時間を理解できませんでした。'1時間 30分'のように入力してください。",
    confirm_reset: "すべての予定を初期化して最初に戻りますか？",
    confirm_complete: "'{task}'を完了しましたか？",
    label_bedtime: "就寝時間",
    current_status: "進行中"
  }
};

// DOM Elements
const els = {
  app: document.getElementById('app'),
  btnReset: document.getElementById('btn-reset'), // Global Reset
  langSelector: document.getElementById('lang-selector'), // Language Selector
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
  btnToStep3: document.getElementById('btn-to-step-3'),

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
  setLanguage(state.lang); // Apply language
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
      state.lang = parsed.lang || 'ko';
    } catch (e) {
      console.error('State restore failed', e);
    }
  } else {
    // Detect browser language if no save
    const browserLang = navigator.language.slice(0, 2);
    if (['en', 'zh', 'ja'].includes(browserLang)) {
      state.lang = browserLang;
    } else {
      state.lang = 'ko';
    }
  }
}

function saveState() {
  localStorage.setItem('routine-flow-state', JSON.stringify(state));
}

function setLanguage(lang) {
  state.lang = lang;
  if (els.langSelector) els.langSelector.value = lang;
  saveState();

  const t = translations[lang];
  if (!t) return;

  // Global
  if (els.btnReset) els.btnReset.textContent = t.reset;

  // Step 1
  const step1Title = document.querySelector('#step-1 .step-title');
  if (step1Title) step1Title.innerHTML = t.step1_title;
  const step1Sub = document.querySelector('#step-1 .step-subtitle');
  if (step1Sub) step1Sub.textContent = t.step1_subtitle;
  if (els.taskInput) els.taskInput.placeholder = t.placeholder;
  if (els.btnToStep2) {
    els.btnToStep2.textContent = t.btn_next;
  }
  if (els.btnToStep3) {
    els.btnToStep3.textContent = t.btn_next;
  }

  // Intro
  const introTitle = document.querySelector('.intro-title');
  if (introTitle) introTitle.textContent = t.intro_title;
  const introItems = document.querySelectorAll('.intro-step-item p');
  if (introItems.length >= 3) {
    introItems[0].textContent = t.intro_step1;
    introItems[1].textContent = t.intro_step2;
    introItems[2].textContent = t.intro_step3;
  }
  const introDesc = document.querySelector('.intro-desc');
  if (introDesc) introDesc.innerHTML = t.intro_desc;

  // Footer
  const footerLinks = document.querySelectorAll('.footer-links a');
  if (footerLinks.length >= 3) {
    footerLinks[0].textContent = t.footer_about;
    footerLinks[1].textContent = t.footer_privacy;
    footerLinks[2].textContent = t.footer_terms;
  }

  // Step 2
  const step2Title = document.querySelector('#step-2 .step-sub-title'); // Assuming class name
  if (step2Title) step2Title.innerHTML = t.step2_title;
  const step2Desc = document.querySelector('#step-2 .step-desc');
  if (step2Desc) step2Desc.textContent = t.step2_subtitle;
  const wakeupLabel = document.querySelector('.wakeup-row span');
  if (wakeupLabel) wakeupLabel.textContent = t.label_wakeup;

  // Standby Items
  const standbyItems = document.querySelectorAll('.standby-item');
  standbyItems.forEach(item => {
    const type = item.dataset.type;
    const txt = type === 'meal' ? t.standby_meal : t.standby_rest;
    const duration = type === 'meal' ? '(30min)' : type === 'rest' ? '(10min)' : '';
    // Preserve icon
    const icon = item.querySelector('.icon').outerHTML;
    item.innerHTML = `${icon} ${txt} ${duration.replace('min', t.ko ? '분' : 'min')}`;
    // A bit hacky but works for now. Proper way should be structured.
    // Let's revert to simple text replacement if structure is consistent
    // Actually duration logic is tricky with translation. Simplification:
    // Just replace text node after icon.
    if (item.childNodes.length > 1) {
      // item.childNodes[2] is likely the text if [0] is newline [1] is span.
      // Safe replace:
      item.innerHTML = `${icon} ${txt} (${type === 'meal' ? 30 : 10}${lang === 'ko' ? '분' : 'min'})`;
    }
  });

  // Step 3
  const step3Title = document.querySelector('#step-3 .step-title');
  if (step3Title) step3Title.innerHTML = t.step3_title;
  const step3Sub = document.querySelector('#step-3 .step-subtitle');
  if (step3Sub) step3Sub.textContent = t.step3_subtitle;
  if (els.btnEditCallback) els.btnEditCallback.textContent = t.btn_edit;

  // Modal
  const modalTitle = document.getElementById('modal-picker-title');
  if (modalTitle) modalTitle.textContent = t.modal_title;
  if (els.pickerCancel) els.pickerCancel.textContent = t.btn_cancel;
  if (els.pickerConfirm) els.pickerConfirm.textContent = t.btn_confirm;

  // Re-render lists to update inner texts if necessary
  if (state.step === 2) renderPlanningList();
  if (state.step === 3) renderFinalTimeline();
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
  const t = translations[state.lang];
  const text = prompt(t.prompt_new_task);
  if (text && text.trim()) {
    state.pendingTask = {
      id: Date.now(),
      text: text.trim(),
      duration: 30,
      startTime: ''
    };
    // Enter Placement Mode
    alert(t.alert_placement);
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

  const t = translations[state.lang];
  const task = state.tasks[index];
  const input = prompt(t.prompt_duration.replace('{task}', task.text));

  if (input) {
    const minutes = parseNaturalDuration(input);
    if (minutes > 0) {
      task.duration = minutes;
      saveState();
      renderPlanningList();
      renderLiveClock(); // Update clock immediately
    } else {
      alert(t.alert_duration_error);
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
    const t = translations[state.lang];
    const text = type === 'meal' ? t.standby_meal : t.standby_rest;
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
  const t = translations[state.lang];

  // Recalculate one last time to be sure
  let currentTime = parseTime(state.wakeUpTime);

  state.tasks.forEach((task, index) => { // Added index arg
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
         ${startTimeStr} - ${endTimeStr} (${task.duration}${t.ko ? '분' : 'min'})
      </div>
      <div class="timeline-content">${task.text} ${task.completed ? '✅' : ''}</div>
    `;


    // Double click to complete
    item.addEventListener('dblclick', () => {
      if (!task.completed) {
        if (confirm(t.confirm_complete.replace('{task}', task.text))) {
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
    <div class="timeline-content" style="color:var(--toss-grey)">${t.label_bedtime}</div>
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

  // Scroll to current value
  // currentVal is "HH:mm"
  const [hStr, mStr] = currentVal.split(':');
  const h = parseInt(hStr, 10) || 7;
  const m = parseInt(mStr, 10) || 0;

  // Wait for layout
  setTimeout(() => {
    // Hour (0-23)
    // Item height 50px. Padding 75px. 
    // scrollTop = index * 50 centers the item.
    if (els.pickerHour) els.pickerHour.scrollTop = h * 50;

    // Minute (0, 5, 10... 55) => index 0..11
    const mIndex = Math.floor(m / 5);
    if (els.pickerMinute) els.pickerMinute.scrollTop = mIndex * 50;

    // Update active highlight immediately
    updateActivePickerItem(els.pickerHour);
    updateActivePickerItem(els.pickerMinute);
  }, 0);

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
  const t = translations[state.lang];
  if (confirm(t.confirm_reset)) {
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
  // Language Selector
  if (els.langSelector) {
    els.langSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
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

  if (els.btnToStep3) {
    els.btnToStep3.addEventListener('click', () => {
      goToStep(3);
    });
  }

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
