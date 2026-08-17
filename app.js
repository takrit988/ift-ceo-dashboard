// IFT Group Executive CEO Dashboard & CMS Application Logic

document.addEventListener('DOMContentLoaded', () => {
  let currentCurrency = 'IDR'; // IDR or USD
  let currentTargetMode = 'reconciled'; // reconciled (71B) or reported (67B)
  let currentLang = 'EN'; // EN or ID
  let currentUser = null; // Active logged-in user
  let completedActions = new Set();
  let charts = {};

  // Safe Helper to set inner text without crash
  function safeSetText(id, text) {
    const elem = document.getElementById(id);
    if (elem && text !== undefined && text !== null) {
      elem.innerText = text;
    }
  }

  // Init Authentication & Application
  try {
    initAuth();
    initNav();
    initControls();
    initInteractiveCheckboxes();
    initCategoryFilters();
    initCmsModule();
    renderAll();
  } catch (err) {
    console.error("Dashboard initialization error:", err);
  }

  /* -------------------------------------------------------------
     AUTHENTICATION & LOGIN GATEKEEPER
  ------------------------------------------------------------- */
  function initAuth() {
    const loginOverlay = document.getElementById('login-modal-overlay');
    const loginForm = document.getElementById('form-login');
    const errorMsg = document.getElementById('login-error-msg');
    const btnLogout = document.getElementById('btn-logout');

    // Check existing session
    const savedUserJson = sessionStorage.getItem('currentUser');
    if (savedUserJson) {
      try {
        currentUser = JSON.parse(savedUserJson);
        if (loginOverlay) loginOverlay.style.display = 'none';
        updateUserBadge();
      } catch(e) {
        currentUser = null;
      }
    }

    if (!currentUser && loginOverlay) {
      loginOverlay.style.display = 'flex';
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('login-username').value.trim();
        const passwordInput = document.getElementById('login-password').value.trim();

        const matchUser = window.IFT_DATA.users.find(
          u => u.username === usernameInput && u.password === passwordInput
        );

        if (matchUser) {
          currentUser = matchUser;
          sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
          if (loginOverlay) loginOverlay.style.display = 'none';
          if (errorMsg) errorMsg.style.display = 'none';
          updateUserBadge();
          renderAll();
        } else {
          if (errorMsg) errorMsg.style.display = 'block';
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        currentUser = null;
        if (loginOverlay) {
          document.getElementById('login-username').value = '';
          document.getElementById('login-password').value = '';
          if (errorMsg) errorMsg.style.display = 'none';
          loginOverlay.style.display = 'flex';
        }
      });
    }

    // Toggle Password Visibility (👁️ / 🙈)
    const btnTogglePassword = document.getElementById('btn-toggle-password');
    const passwordInputElem = document.getElementById('login-password');
    if (btnTogglePassword && passwordInputElem) {
      btnTogglePassword.addEventListener('click', () => {
        const isPassword = passwordInputElem.type === 'password';
        passwordInputElem.type = isPassword ? 'text' : 'password';
        btnTogglePassword.innerText = isPassword ? '🙈' : '👁️';
        btnTogglePassword.title = isPassword ? 'Hide Password' : 'Show Password';
      });
    }

    // Forgot Password Action
    const btnForgotPassword = document.getElementById('btn-forgot-password');
    if (btnForgotPassword) {
      btnForgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Please contact system admin \"Sam\" takrit@ultimatesuccess.co");
      });
    }
  }

  function updateUserBadge() {
    const nameElem = document.getElementById('user-display-name');
    if (nameElem && currentUser) {
      nameElem.innerText = `${currentUser.name} (${currentUser.role})`;
      nameElem.style.color = currentUser.role === 'Admin' ? '#38bdf8' : currentUser.role === 'Executive' ? '#34d399' : '#f59e0b';
    }
  }

  function initNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const view = item.getAttribute('data-view');
        switchView(view);
      });
    });
  }

  function switchView(viewName) {
    const views = document.querySelectorAll('.view-section');
    views.forEach(v => v.style.display = 'none');
    
    const activeView = document.getElementById(`view-${viewName}`);
    if (activeView) {
      activeView.style.display = 'flex';
      updateViewTitle(viewName);

      if (viewName === 'group-overview' || viewName === 'subsidiary-breakdown') {
        renderCharts();
      } else if (viewName === 'cms') {
        populateDropdowns();
        renderCmsTasks();
        renderQuarterlyArchives();
        renderUploadedFiles();
        renderPlanAdjuster();
        renderExecutiveManager();
        renderLeverManager();
      }
    }
  }

  function updateViewTitle(viewName) {
    const titleElem = document.getElementById('current-view-title');
    if (!titleElem) return;

    const t = window.IFT_DATA.i18n[currentLang];
    if (viewName === 'ceo-top-panel') titleElem.innerText = t.navTopPanel;
    else if (viewName === 'group-overview') titleElem.innerText = t.navGroupOverview;
    else if (viewName === 'subsidiary-breakdown') titleElem.innerText = t.navSubsidiary;
    else if (viewName === 'ipo-sandbox') titleElem.innerText = t.navIpoSandbox;
    else if (viewName === 'governance') titleElem.innerText = t.navGovernance;
    else if (viewName === 'cms') titleElem.innerText = t.navCms || "Executive CMS & Governance Hub";
  }

  function initControls() {
    // Language Switcher
    const btnEn = document.getElementById('btn-lang-en');
    const btnId = document.getElementById('btn-lang-id');

    if (btnEn && btnId) {
      btnEn.addEventListener('click', () => {
        currentLang = 'EN';
        btnEn.classList.add('active');
        btnId.classList.remove('active');
        renderI18n();
      });
      btnId.addEventListener('click', () => {
        currentLang = 'ID';
        btnId.classList.add('active');
        btnEn.classList.remove('active');
        renderI18n();
      });
    }

    // Currency toggle
    const btnIdr = document.getElementById('btn-currency-idr');
    const btnUsd = document.getElementById('btn-currency-usd');

    if (btnIdr && btnUsd) {
      btnIdr.addEventListener('click', () => {
        currentCurrency = 'IDR';
        btnIdr.classList.add('active');
        btnUsd.classList.remove('active');
        renderAll();
      });
      btnUsd.addEventListener('click', () => {
        currentCurrency = 'USD';
        btnUsd.classList.add('active');
        btnIdr.classList.remove('active');
        renderAll();
      });
    }

    // Target Governance Reconciler
    const targetToggle = document.getElementById('target-mode-toggle');
    if (targetToggle) {
      targetToggle.addEventListener('change', (e) => {
        currentTargetMode = e.target.checked ? 'reported' : 'reconciled';
        renderAll();
      });
    }

    // IPO Sandbox Sliders
    const sliderGrowth = document.getElementById('slider-growth');
    const sliderEbitda = document.getElementById('slider-ebitda');
    const sliderMultiple = document.getElementById('slider-multiple');

    if (sliderGrowth && sliderEbitda && sliderMultiple) {
      [sliderGrowth, sliderEbitda, sliderMultiple].forEach(input => {
        input.addEventListener('input', updateIpoSandbox);
      });
    }
  }

  function initInteractiveCheckboxes() {
    const checkboxes = document.querySelectorAll('.ceo-action-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const key = `${cb.getAttribute('data-lever')}-${cb.getAttribute('data-step')}`;
        if (cb.checked) {
          completedActions.add(key);
        } else {
          completedActions.delete(key);
        }
        updateActionProgress();
        renderVariableEngine();
      });
    });
  }

  function updateActionProgress() {
    const totalSteps = 11;
    const doneCount = completedActions.size;
    const pct = Math.round((doneCount / totalSteps) * 100);

    const progressElem = document.getElementById('action-progress-val');
    if (progressElem) {
      progressElem.innerText = `${doneCount} / ${totalSteps} Done (${pct}%)`;
      progressElem.style.color = pct >= 80 ? '#34d399' : pct >= 40 ? '#00a3e0' : '#ef4444';
    }
  }

  function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.lever-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('.lever-item');

        items.forEach(item => {
          if (filter === 'all') {
            item.style.display = 'flex';
          } else {
            item.style.display = item.getAttribute('data-category') === filter ? 'flex' : 'none';
          }
        });
      });
    });
  }

  /* -------------------------------------------------------------
     SCORECARD DIRECTIVE EDITABLE PERSISTENCE
  ------------------------------------------------------------- */
  window.updateScorecardDirective = function(id, text) {
    if (!window.IFT_DATA.scorecardDirectives) {
      window.IFT_DATA.scorecardDirectives = {};
    }
    window.IFT_DATA.scorecardDirectives[id] = text;
    console.log(`Updated Scorecard Directive [${id}]:`, text);
  };

  /* -------------------------------------------------------------
     CMS MODULE INITIALIZATION & LOGIC
  ------------------------------------------------------------- */
  function initCmsModule() {
    // CMS Tab Switching
    const cmsBtns = document.querySelectorAll('.cms-tab-btn');
    cmsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cmsBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-cms-tab');

        const contents = document.querySelectorAll('.cms-tab-content');
        contents.forEach(c => c.style.display = 'none');

        const activeContent = document.getElementById(`cms-tab-${targetTab}`);
        if (activeContent) activeContent.style.display = 'flex';
      });
    });

    // Populate initial Lever & Executive dropdowns
    populateDropdowns();

    // Quick Add Buttons
    document.getElementById('btn-quick-add-lever')?.addEventListener('click', promptAddLever);
    document.getElementById('btn-quick-add-exec')?.addEventListener('click', promptAddExecutive);
    document.getElementById('btn-add-exec-main')?.addEventListener('click', promptAddExecutive);
    document.getElementById('btn-add-lever-main')?.addEventListener('click', promptAddLever);

    // Add New Task Form Listener
    const addTaskForm = document.getElementById('form-add-task');
    if (addTaskForm) {
      addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('new-task-title').value;
        const lever = document.getElementById('new-task-lever').value;
        const owner = document.getElementById('new-task-owner').value;
        const deadline = document.getElementById('new-task-deadline').value;

        const newTask = {
          id: `task_${Date.now()}`,
          lever: lever,
          title: title,
          category: lever.includes('Lever #1') || lever.includes('Lever #2') ? 'Critical' : 'High Priority',
          owner: owner,
          deadline: deadline,
          status: 'Not Started',
          impact: 'Accelerate operational execution'
        };

        window.IFT_DATA.tasks.unshift(newTask);
        document.getElementById('new-task-title').value = '';
        renderCmsTasks();
        alert('✅ New Executive Task Directive Added Successfully!');
      });
    }

    // Save Quarter Snapshot Listener with Custom Quarter Name & Notes
    const btnSnapshot = document.getElementById('btn-save-quarter-snapshot');
    if (btnSnapshot) {
      btnSnapshot.addEventListener('click', () => {
        const data = window.IFT_DATA;
        const defaultName = `Q${data.quarterlyArchives.length + 1} FY26`;
        const qName = prompt("Enter Quarter Name (e.g. Q3 FY26, Q4 FY26, Q1 FY27):", defaultName);
        if (!qName) return;

        const notes = prompt("Enter Strategic Notes / Audit Directives for this Quarter:", "Target review and delivery execution signoff.");

        const newSnapshot = {
          quarter: qName,
          asOf: new Date().toISOString().split('T')[0],
          target: data.groupTotals.target,
          achieved: data.groupTotals.totalAchieved,
          closedWon: data.groupTotals.closedWon,
          healthIndex: parseInt(document.getElementById('group-health-score')?.innerText || '72'),
          status: 'ACTIVE',
          notes: notes || 'Executive snapshot saved via CMS.'
        };
        data.quarterlyArchives.unshift(newSnapshot);
        renderQuarterlyArchives();
        alert(`📌 Snapshot for "${qName}" Saved Successfully to Quarterly Vault!`);
      });
    }

    // Drag & Drop File Upload Handlers
    const browseBtn = document.getElementById('btn-browse-files');
    const fileInput = document.getElementById('cms-file-input');

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', handleFileSelect);
    }

    // Target Plan Adjuster Listener
    const btnSavePlan = document.getElementById('btn-save-plan-adjustments');
    if (btnSavePlan) {
      btnSavePlan.addEventListener('click', savePlanAdjustments);
    }

    // Executive Exporters
    document.getElementById('btn-export-excel')?.addEventListener('click', exportToExcel);
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => window.print());
    document.getElementById('btn-export-json')?.addEventListener('click', exportToJson);
  }

  function populateDropdowns() {
    const leverSelect = document.getElementById('new-task-lever');
    const ownerSelect = document.getElementById('new-task-owner');

    if (leverSelect && window.IFT_DATA.levers) {
      leverSelect.innerHTML = window.IFT_DATA.levers.map(l => `<option value="${l.name}">${l.name}</option>`).join('');
    }

    if (ownerSelect && window.IFT_DATA.executives) {
      ownerSelect.innerHTML = window.IFT_DATA.executives.map(e => `<option value="${e.name} (${e.role})">${e.name} (${e.role})</option>`).join('');
    }
  }

  function promptAddExecutive() {
    const name = prompt("Enter Executive Name (e.g. Ananda Wijaya):");
    if (!name) return;
    const role = prompt("Enter Executive Role / Title (e.g. Chief Risk Officer):", "Executive");
    if (!role) return;

    const newExec = {
      id: `exec_${Date.now()}`,
      name: name,
      role: role
    };

    window.IFT_DATA.executives.push(newExec);
    populateDropdowns();
    renderExecutiveManager();
    renderCmsTasks();
    alert(`✅ Added Executive "${name} (${role})" to Roster!`);
  }

  function promptAddLever() {
    const code = prompt("Enter Lever Code (e.g. Lever #5):", "Lever #5");
    if (!code) return;
    const name = prompt("Enter Lever Description (e.g. M&A Synergy & AI Integration):");
    if (!name) return;

    const newLever = {
      id: `lever_${Date.now()}`,
      code: code,
      name: `${code}: ${name}`
    };

    window.IFT_DATA.levers.push(newLever);
    populateDropdowns();
    renderLeverManager();
    renderCmsTasks();
    alert(`✅ Added Strategic Lever "${newLever.name}"!`);
  }

  function renderExecutiveManager() {
    const container = document.getElementById('cms-executives-list');
    if (!container) return;

    let html = '';
    window.IFT_DATA.executives.forEach(exec => {
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:4px; border:1px solid var(--border-color);">
          <div>
            <strong style="color:#fff; font-size:13px;">${exec.name}</strong>
            <span style="font-size:11px; color:var(--color-mckinsey-blue); margin-left:6px;">(${exec.role})</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button onclick="editExecutive('${exec.id}')" style="background:none; border:1px solid var(--border-color); color:var(--text-secondary); padding:2px 8px; border-radius:4px; cursor:pointer; font-size:11px;">✏️ Edit</button>
            <button onclick="deleteExecutive('${exec.id}')" style="background:#ef4444; border:none; color:#fff; padding:2px 8px; border-radius:4px; cursor:pointer; font-size:11px;">🗑️ Delete</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  window.editExecutive = function(id) {
    const exec = window.IFT_DATA.executives.find(e => e.id === id);
    if (!exec) return;
    const newName = prompt("Edit Executive Name:", exec.name);
    if (newName) exec.name = newName;
    const newRole = prompt("Edit Executive Role:", exec.role);
    if (newRole) exec.role = newRole;

    populateDropdowns();
    renderExecutiveManager();
    renderCmsTasks();
  };

  window.deleteExecutive = function(id) {
    window.IFT_DATA.executives = window.IFT_DATA.executives.filter(e => e.id !== id);
    populateDropdowns();
    renderExecutiveManager();
    renderCmsTasks();
  };

  function renderLeverManager() {
    const container = document.getElementById('cms-levers-list');
    if (!container) return;

    let html = '';
    window.IFT_DATA.levers.forEach(lever => {
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:4px; border:1px solid var(--border-color);">
          <div style="font-size:12px; color:#fff; font-weight:600;">${lever.name}</div>
          <div style="display:flex; gap:6px;">
            <button onclick="editLever('${lever.id}')" style="background:none; border:1px solid var(--border-color); color:var(--text-secondary); padding:2px 8px; border-radius:4px; cursor:pointer; font-size:11px;">✏️ Edit</button>
            <button onclick="deleteLever('${lever.id}')" style="background:#ef4444; border:none; color:#fff; padding:2px 8px; border-radius:4px; cursor:pointer; font-size:11px;">🗑️ Delete</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  window.editLever = function(id) {
    const lever = window.IFT_DATA.levers.find(l => l.id === id);
    if (!lever) return;
    const newName = prompt("Edit Strategic Lever Name:", lever.name);
    if (newName) lever.name = newName;

    populateDropdowns();
    renderLeverManager();
    renderCmsTasks();
  };

  window.deleteLever = function(id) {
    window.IFT_DATA.levers = window.IFT_DATA.levers.filter(l => l.id !== id);
    populateDropdowns();
    renderLeverManager();
    renderCmsTasks();
  };

  function renderCmsTasks() {
    const tableBody = document.getElementById('cms-task-table-body');
    if (!tableBody) return;

    const tasks = window.IFT_DATA.tasks;
    safeSetText('cms-task-count-badge', `${tasks.length} Active Directives`);

    let html = '';
    tasks.forEach(t => {
      html += `
        <tr>
          <td>
            <select onchange="updateTaskLever('${t.id}', this.value)" style="background:rgba(5,25,41,0.9); border:1px solid var(--border-color); color:#fff; padding:4px 8px; border-radius:4px; font-size:11px; max-width:160px;">
              ${window.IFT_DATA.levers.map(l => `<option value="${l.name}" ${t.lever===l.name?'selected':''}>${l.code || l.name.split(':')[0]}</option>`).join('')}
            </select>
          </td>
          <td>
            <input type="text" value="${t.title}" onchange="updateTaskTitle('${t.id}', this.value)" style="background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; padding:4px 8px; border-radius:4px; font-size:12px; width:100%;">
          </td>
          <td>
            <select onchange="updateTaskOwner('${t.id}', this.value)" style="background:rgba(5,25,41,0.9); border:1px solid var(--border-color); color:#fff; padding:4px 8px; border-radius:4px; font-size:12px;">
              ${window.IFT_DATA.executives.map(e => `<option value="${e.name} (${e.role})" ${t.owner.includes(e.name) ? 'selected' : ''}>${e.name} (${e.role})</option>`).join('')}
            </select>
          </td>
          <td>
            <input type="date" value="${t.deadline}" onchange="updateTaskDeadline('${t.id}', this.value)" style="background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; padding:4px 8px; border-radius:4px; font-size:12px;">
          </td>
          <td>
            <select onchange="updateTaskStatus('${t.id}', this.value)" style="background:rgba(5,25,41,0.9); border:1px solid var(--border-color); color:#fff; padding:4px 8px; border-radius:4px; font-size:12px;">
              <option value="Not Started" ${t.status==='Not Started'?'selected':''}>🔴 Not Started</option>
              <option value="In Progress" ${t.status==='In Progress'?'selected':''}>🟡 In Progress</option>
              <option value="Completed" ${t.status==='Completed'?'selected':''}>🟢 Completed</option>
            </select>
          </td>
          <td>
            <input type="text" value="${t.impact}" onchange="updateTaskImpact('${t.id}', this.value)" style="background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-secondary); padding:4px 8px; border-radius:4px; font-size:11px; width:100%;">
          </td>
          <td>
            <button onclick="deleteTask('${t.id}')" style="background:#ef4444; border:none; color:#fff; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px;">🗑️ Delete</button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  }

  window.updateTaskLever = function(id, val) {
    const task = window.IFT_DATA.tasks.find(t => t.id === id);
    if (task) task.lever = val;
  };

  window.updateTaskTitle = function(id, val) {
    const task = window.IFT_DATA.tasks.find(t => t.id === id);
    if (task) task.title = val;
  };

  window.updateTaskOwner = function(id, val) {
    const task = window.IFT_DATA.tasks.find(t => t.id === id);
    if (task) task.owner = val;
  };

  window.updateTaskDeadline = function(id, val) {
    const task = window.IFT_DATA.tasks.find(t => t.id === id);
    if (task) task.deadline = val;
  };

  window.updateTaskStatus = function(id, val) {
    const task = window.IFT_DATA.tasks.find(t => t.id === id);
    if (task) task.status = val;
    renderCmsTasks();
  };

  window.updateTaskImpact = function(id, val) {
    const task = window.IFT_DATA.tasks.find(t => t.id === id);
    if (task) task.impact = val;
  };

  window.deleteTask = function(id) {
    window.IFT_DATA.tasks = window.IFT_DATA.tasks.filter(t => t.id !== id);
    renderCmsTasks();
  };

  function renderQuarterlyArchives() {
    const tableBody = document.getElementById('cms-quarterly-table-body');
    if (!tableBody) return;

    const archives = window.IFT_DATA.quarterlyArchives;
    let html = '';

    archives.forEach((q, idx) => {
      html += `
        <tr>
          <td style="font-weight:700; color:#fff;">${q.quarter}</td>
          <td>${q.asOf}</td>
          <td>${formatMoney(q.target)}</td>
          <td style="font-weight:700; color:#fff;">${formatMoney(q.achieved)}</td>
          <td style="color:var(--color-mckinsey-blue); font-weight:700;">${formatMoney(q.closedWon)}</td>
          <td><strong style="color:${q.healthIndex>=80?'#34d399':'#f59e0b'};">${q.healthIndex} / 100</strong></td>
          <td><span class="status-pill ${q.status==='COMPLETED'?'exceed':q.status==='ACTIVE'?'near':'below'}">${q.status}</span></td>
          <td style="font-size:12px; color:var(--text-secondary);">${q.notes}</td>
          <td>
            <button onclick="deleteQuarterSnapshot(${idx})" style="background:none; border:1px solid var(--border-color); color:#ef4444; padding:2px 8px; border-radius:4px; cursor:pointer; font-size:11px;">🗑️ Delete</button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  }

  window.deleteQuarterSnapshot = function(idx) {
    if (confirm("Are you sure you want to delete this Quarterly report snapshot?")) {
      window.IFT_DATA.quarterlyArchives.splice(idx, 1);
      renderQuarterlyArchives();
    }
  };

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.csv');
      const newFileObj = {
        name: file.name,
        type: isExcel ? 'Excel' : file.type.includes('pdf') ? 'PDF' : 'Image',
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        uploader: currentUser ? currentUser.name : 'Executive User'
      };

      window.IFT_DATA.uploadedFiles.unshift(newFileObj);

      // Auto-parse Excel files using SheetJS
      if (isExcel && window.XLSX) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            alert(`✅ Excel File "${file.name}" uploaded & parsed successfully! (${workbook.SheetNames.length} sheets imported)`);
          } catch (err) {
            console.log("SheetJS parse notice", err);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });

    renderUploadedFiles();
  }

  function renderUploadedFiles() {
    const tableBody = document.getElementById('cms-files-table-body');
    if (!tableBody) return;

    const files = window.IFT_DATA.uploadedFiles;
    let html = '';

    files.forEach((f, idx) => {
      html += `
        <tr>
          <td style="font-weight:700; color:#fff;">📎 ${f.name}</td>
          <td><span class="status-pill ${f.type==='Excel'?'exceed':f.type==='PDF'?'near':'below'}">${f.type}</span></td>
          <td>${f.size}</td>
          <td>${f.uploadedAt}</td>
          <td>${f.uploader}</td>
          <td>
            <button onclick="deleteFile(${idx})" style="background:#ef4444; border:none; color:#fff; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px;">🗑️ Remove</button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  }

  window.deleteFile = function(idx) {
    window.IFT_DATA.uploadedFiles.splice(idx, 1);
    renderUploadedFiles();
  };

  function renderPlanAdjuster() {
    const grid = document.getElementById('cms-target-adjuster-grid');
    if (!grid) return;

    let html = '';
    window.IFT_DATA.subsidiaries.forEach(sub => {
      html += `
        <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-color); padding:14px; border-radius:6px;">
          <label style="font-size:12px; font-weight:700; color:var(--color-mckinsey-blue);">${sub.code} Target (Rp B):</label>
          <input type="number" id="input-target-${sub.id}" value="${sub.target}" step="0.5" style="width:100%; padding:6px 10px; background:rgba(5,25,41,0.9); border:1px solid var(--border-color); color:#fff; border-radius:4px; margin-top:6px;">
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  function savePlanAdjustments() {
    let sumNewTargets = 0;
    window.IFT_DATA.subsidiaries.forEach(sub => {
      const input = document.getElementById(`input-target-${sub.id}`);
      if (input) {
        sub.target = parseFloat(input.value) || sub.target;
        sub.achievementPct = sub.target > 0 ? parseFloat(((sub.totalAchieved / sub.target) * 100).toFixed(1)) : 0;
        sub.gap = parseFloat((sub.totalAchieved - sub.target).toFixed(2));
        sumNewTargets += sub.target;
      }
    });

    window.IFT_DATA.groupTotals.target = parseFloat(sumNewTargets.toFixed(2));
    renderAll();
    alert(`💾 Financial Target Plans Updated Successfully! Reconciled Group Target: Rp ${window.IFT_DATA.groupTotals.target}B`);
  }

  function exportToExcel() {
    if (!window.XLSX) {
      alert("XLSX Library loading... Please try again in a moment.");
      return;
    }

    const data = window.IFT_DATA;
    
    // Sheet 1: Group Summary
    const groupWs = XLSX.utils.json_to_sheet([
      { Metric: "Reconciled Group Target (Rp B)", Value: data.groupTotals.target },
      { Metric: "Total Achieved Sales (Rp B)", Value: data.groupTotals.totalAchieved },
      { Metric: "Closed Won Invoiced Revenue (Rp B)", Value: data.groupTotals.closedWon },
      { Metric: "PO Confirmed Unrecognized (Rp B)", Value: data.groupTotals.poConfirmed },
      { Metric: "Achievement Rate (%)", Value: `${data.groupTotals.achievementPct}%` },
      { Metric: "Group Health Score", Value: "72 / 100" }
    ]);

    // Sheet 2: Business Units
    const buWs = XLSX.utils.json_to_sheet(data.subsidiaries.map(s => ({
      Code: s.code,
      Company: s.name,
      "Target (Rp B)": s.target,
      "PO Confirmed (Rp B)": s.poConfirmed,
      "Closed Won (Rp B)": s.closedWon,
      "Total Achieved (Rp B)": s.totalAchieved,
      "Achievement (%)": s.achievementPct,
      Status: s.status,
      "Executive Owner": s.owner,
      Deadline: s.deadline
    })));

    // Sheet 3: Directives & Tasks
    const taskWs = XLSX.utils.json_to_sheet(data.tasks.map(t => ({
      Lever: t.lever,
      Directive: t.title,
      Category: t.category,
      Owner: t.owner,
      Deadline: t.deadline,
      Status: t.status,
      Impact: t.impact
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, groupWs, "Group Summary");
    XLSX.utils.book_append_sheet(wb, buWs, "Business Units");
    XLSX.utils.book_append_sheet(wb, taskWs, "Action Tasks & Owners");

    XLSX.writeFile(wb, "IFT_Group_CEO_Executive_Report_FY2026.xlsx");
  }

  function exportToJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.IFT_DATA, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "IFT_Group_CMS_Backup_2026.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  /* -------------------------------------------------------------
     CORE DASHBOARD RENDERERS
  ------------------------------------------------------------- */
  function renderI18n() {
    const t = window.IFT_DATA.i18n[currentLang];
    if (!t) return;

    safeSetText('i18n-brand-subtitle', t.brandSubtitle);
    safeSetText('i18n-nav-top-panel', t.navTopPanel);
    safeSetText('i18n-nav-group-overview', t.navGroupOverview);
    safeSetText('i18n-nav-subsidiary', t.navSubsidiary);
    safeSetText('i18n-nav-ipo-sandbox', t.navIpoSandbox);
    safeSetText('i18n-nav-governance', t.navGovernance);
    safeSetText('i18n-nav-cms', t.navCms || "Executive CMS & Governance");
    safeSetText('i18n-ipo-header', t.ipoHeader);

    safeSetText('i18n-target-baseline-label', t.targetBaselineLabel);
    safeSetText('i18n-reported-vs-reconciled', t.reportedVsReconciled);

    safeSetText('i18n-summary-title', t.summaryTitle);
    safeSetText('i18n-summary-sub', t.summarySub);
    safeSetText('i18n-summary-desc', t.summaryDesc);

    safeSetText('i18n-lever1-title', t.lever1Title);
    safeSetText('i18n-lever1-cur-label', t.currentValLabel);
    safeSetText('i18n-lever1-tar-label', t.targetValLabel);
    safeSetText('i18n-lever1-impact', t.lever1Impact);
    safeSetText('i18n-lever1-step1', t.lever1Step1);
    safeSetText('i18n-lever1-step2', t.lever1Step2);
    safeSetText('i18n-lever1-step3', t.lever1Step3);

    safeSetText('i18n-lever2-title', t.lever2Title);
    safeSetText('i18n-lever2-impact', t.lever2Impact);
    safeSetText('i18n-lever2-step1', t.lever2Step1);
    safeSetText('i18n-lever2-step2', t.lever2Step2);
    safeSetText('i18n-lever2-step3', t.lever2Step3);

    safeSetText('i18n-lever3-title', t.lever3Title);
    safeSetText('i18n-lever3-impact', t.lever3Impact);
    safeSetText('i18n-lever3-step1', t.lever3Step1);
    safeSetText('i18n-lever3-step2', t.lever3Step2);
    safeSetText('i18n-lever3-step3', t.lever3Step3);

    safeSetText('i18n-lever4-title', t.lever4Title);
    safeSetText('i18n-lever4-cur-label', t.currentValLabel);
    safeSetText('i18n-lever4-tar-label', t.targetValLabel);
    safeSetText('i18n-lever4-impact', t.lever4Impact);
    safeSetText('i18n-lever4-step1', t.lever4Step1);
    safeSetText('i18n-lever4-step2', t.lever4Step2);

    // Active View Title
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
      switchView(activeNav.getAttribute('data-view'));
    }
  }

  function formatMoney(numInBillionsIdr) {
    if (numInBillionsIdr === undefined || numInBillionsIdr === null || isNaN(numInBillionsIdr)) {
      return currentCurrency === 'USD' ? '$0.00M' : 'Rp 0.00B';
    }
    const rateUsd = 16000;
    if (currentCurrency === 'USD') {
      const numInUsdMillions = (numInBillionsIdr * 1000000000) / (rateUsd * 1000000);
      return `$${numInUsdMillions.toFixed(2)}M`;
    } else {
      return `Rp ${numInBillionsIdr.toFixed(2)}B`;
    }
  }

  function renderAll() {
    renderTopPanel();
    renderKPIs();
    renderSubsidiaryTable();
    renderCharts();
    updateIpoSandbox();
    renderVariableEngine();
  }

  function getActiveTarget() {
    const data = window.IFT_DATA;
    if (currentTargetMode === 'reported') {
      return data.metadata.reportedGroupTarget || data.groupTotals.reportedGroupTarget || 67.00;
    } else {
      return data.groupTotals.target || 71.00;
    }
  }

  function renderVariableEngine() {
    const data = window.IFT_DATA;
    const doneCount = completedActions.size;

    // Health Score calculation
    const baseHealth = 72;
    const bonusHealth = Math.min(doneCount * 2.5, 28);
    const totalHealth = Math.round(baseHealth + bonusHealth);

    const healthElem = document.getElementById('group-health-score');
    if (healthElem) {
      const grade = totalHealth >= 90 ? 'Grade A+' : totalHealth >= 80 ? 'Grade A' : totalHealth >= 75 ? 'Grade B+' : 'Grade B';
      healthElem.innerText = `${totalHealth} / 100 (${grade})`;
      healthElem.style.color = totalHealth >= 85 ? '#34d399' : totalHealth >= 75 ? '#00a3e0' : '#f59e0b';
    }

    // Dynamic Variables (X1..X4 -> Y1..Y3)
    const basePoExecution = 5.8;
    const poExecutionMod = basePoExecution + (doneCount * 3.5);
    safeSetText('var-x1', `${poExecutionMod.toFixed(1)}% (Target 45.0%)`);

    const healthyCount = 2 + Math.floor(doneCount / 3);
    safeSetText('var-x2', `${Math.min(healthyCount, 5)} / 5 Healthy`);

    const dsoVal = Math.max(92 - (doneCount * 3), 60);
    safeSetText('var-x3', `${dsoVal} Days (Target < 60)`);

    const arrVal = Math.min(38.0 + (doneCount * 2), 60.0);
    safeSetText('var-x4', `${arrVal.toFixed(1)}% (Target 60.0%)`);

    // Dependent Variables Y1, Y2, Y3
    const closedWonVal = data.groupTotals.closedWon + (doneCount * 2.5);
    const varY1 = document.getElementById('var-y1');
    if (varY1) {
      const pctWon = ((closedWonVal / data.groupTotals.totalAchieved) * 100).toFixed(1);
      varY1.innerText = `${formatMoney(closedWonVal)} (${pctWon}%)`;
      varY1.style.color = closedWonVal >= 15 ? '#34d399' : '#f59e0b';
    }

    const rule40Val = (42.5 + (doneCount * 0.8)).toFixed(1);
    safeSetText('var-y2', `${rule40Val}% Score`);

    const projectedValIdr = 1500 + (doneCount * 45);
    const varY3 = document.getElementById('var-y3');
    if (varY3) {
      varY3.innerText = currentCurrency === 'USD' 
        ? `$${((projectedValIdr * 1000000000) / (16000 * 1000000)).toFixed(1)}M USD`
        : `Rp ${projectedValIdr} Billion`;
    }
  }

  function renderTopPanel() {
    const data = window.IFT_DATA;
    const target = getActiveTarget();
    const totalAchieved = data.groupTotals.totalAchieved;
    const achievementPct = target > 0 ? ((totalAchieved / target) * 100).toFixed(1) : "0.0";

    safeSetText('top-panel-sales-val', `${formatMoney(totalAchieved)} (${achievementPct}%)`);

    const poExecutionPct = ((data.groupTotals.closedWon / data.groupTotals.totalAchieved) * 100).toFixed(1);
    safeSetText('lever1-current', `${poExecutionPct}% Invoiced (${formatMoney(data.groupTotals.closedWon)})`);
  }

  function renderKPIs() {
    const data = window.IFT_DATA;
    const target = getActiveTarget();
    const totalAchieved = data.groupTotals.totalAchieved;
    const achievementPct = target > 0 ? ((totalAchieved / target) * 100).toFixed(1) : "0.0";
    const gap = (totalAchieved - target).toFixed(2);

    safeSetText('kpi-target', formatMoney(target));
    safeSetText('kpi-achieved', formatMoney(totalAchieved));
    safeSetText('kpi-achievement-pct', `${achievementPct}%`);
    safeSetText('kpi-gap', `${gap >= 0 ? '+' : ''}${formatMoney(parseFloat(gap))}`);
    
    // Status text & bar
    const statusTag = document.getElementById('kpi-status-tag');
    const progressFill = document.getElementById('kpi-progress-fill');
    if (statusTag && progressFill) {
      const numericPct = parseFloat(achievementPct);
      if (numericPct >= 100) {
        statusTag.innerText = "ABOVE TARGET";
        statusTag.className = "kpi-subtext tag-success";
        progressFill.style.background = "#00a3e0";
      } else if (numericPct >= 80) {
        statusTag.innerText = "NEAR TARGET";
        statusTag.className = "kpi-subtext tag-warning";
        progressFill.style.background = "#38bdf8";
      } else {
        statusTag.innerText = "BELOW TARGET";
        statusTag.className = "kpi-subtext tag-danger";
        progressFill.style.background = "#ef4444";
      }
      progressFill.style.width = `${Math.min(numericPct, 100)}%`;
    }

    // Execution ratio
    const poExecutionPct = ((data.groupTotals.closedWon / data.groupTotals.totalAchieved) * 100).toFixed(1);
    safeSetText('kpi-po-confirmed', formatMoney(data.groupTotals.poConfirmed));
    safeSetText('kpi-closed-won', formatMoney(data.groupTotals.closedWon));
    safeSetText('kpi-po-conversion-rate', `${poExecutionPct}% Invoiced`);

    // 6th KPI Card: Weighted Pipeline
    safeSetText('kpi-weighted-pipeline', formatMoney(data.groupTotals.pipelineWeighted || 67.53));
  }

  function renderSubsidiaryTable() {
    const tableBody = document.getElementById('table-subsidiary-body');
    const tableBodyBu = document.getElementById('table-subsidiary-body-bu-view');
    if (!tableBody && !tableBodyBu) return;

    const data = window.IFT_DATA;
    let html = '';

    data.subsidiaries.forEach(sub => {
      const statusClass = sub.status === 'EXCEED TARGET' ? 'exceed' : sub.status === 'BELOW TARGET' ? 'below' : 'near';
      const isDct = sub.id === 'DCT';
      
      html += `
        <tr class="main-bu-row ${isDct ? 'dct-row' : ''}">
          <td style="font-weight: 700; color: #fff;">
            ${isDct ? '<span style="cursor:pointer; font-size: 14px; margin-right:4px; color:var(--color-mckinsey-blue);" onclick="toggleDctRows()">▼</span>' : ''}
            ${sub.name}
          </td>
          <td style="color: var(--color-mckinsey-blue); font-weight:700;">${sub.code}</td>
          <td>${formatMoney(sub.target)}</td>
          <td>${formatMoney(sub.poConfirmed)}</td>
          <td style="color: ${sub.closedWon > 0 ? '#38bdf8' : '#94a3b8'}; font-weight:700;">${formatMoney(sub.closedWon)}</td>
          <td style="font-weight: 700; color: #fff;">${formatMoney(sub.totalAchieved)}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700;">${sub.achievementPct}%</span>
              <div class="progress-bar-container" style="width:60px;">
                <div class="progress-bar-fill" style="width:${Math.min(sub.achievementPct, 100)}%; background:${sub.achievementPct>=100?'#00a3e0':sub.achievementPct>=80?'#38bdf8':'#ef4444'};"></div>
              </div>
            </div>
          </td>
          <td style="color: ${sub.gap >= 0 ? '#38bdf8' : '#ef4444'}; font-weight:700;">${sub.gap >= 0 ? '+' : ''}${formatMoney(sub.gap)}</td>
          <td><span class="status-pill ${statusClass}">${sub.status}</span></td>
        </tr>
      `;

      if (isDct && sub.subEntities.length > 0) {
        sub.subEntities.forEach(child => {
          html += `
            <tr class="sub-entity-row dct-child">
              <td>↳ ${child.name}</td>
              <td>DCT-SUB</td>
              <td>-</td>
              <td>${formatMoney(child.poConfirmed)}</td>
              <td>${formatMoney(child.closedWon)}</td>
              <td style="font-weight:600;">${formatMoney(child.totalAchieved)}</td>
              <td>-</td>
              <td>-</td>
              <td><span style="font-size:10px; opacity:0.7; color:var(--color-mckinsey-blue);">Subsidiary</span></td>
            </tr>
          `;
        });
      }
    });

    if (tableBody) tableBody.innerHTML = html;
    if (tableBodyBu) tableBodyBu.innerHTML = html;
  }

  window.toggleDctRows = function() {
    const rows = document.querySelectorAll('.dct-child');
    rows.forEach(r => {
      r.style.display = r.style.display === 'none' ? 'table-row' : 'none';
    });
  };

  function renderCharts() {
    const data = window.IFT_DATA;
    
    // Chart 1: BU Achievement comparison
    const ctxBu = document.getElementById('chart-bu-achievement');
    if (ctxBu) {
      if (charts.buChart) charts.buChart.destroy();

      const labels = data.subsidiaries.map(s => s.code);
      const targets = data.subsidiaries.map(s => s.target);
      const achieved = data.subsidiaries.map(s => s.totalAchieved);

      charts.buChart = new Chart(ctxBu, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Target (Rp B)',
              data: targets,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderWidth: 1,
              borderRadius: 4
            },
            {
              label: 'Total Achieved (Rp B)',
              data: achieved,
              backgroundColor: achieved.map(val => val >= 15 ? '#00a3e0' : '#ef4444'),
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: 'bold' } } }
          },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
          }
        }
      });
    }

    // Chart 2: PO Execution Doughnut
    const ctxPo = document.getElementById('chart-po-execution');
    if (ctxPo) {
      if (charts.poChart) charts.poChart.destroy();

      charts.poChart = new Chart(ctxPo, {
        type: 'doughnut',
        data: {
          labels: ['PO Confirmed (Pending Execution)', 'Closed Won (Invoiced & Recognized)'],
          datasets: [{
            data: [data.groupTotals.poConfirmed - data.groupTotals.closedWon, data.groupTotals.closedWon],
            backgroundColor: ['#1e3a5f', '#00a3e0'],
            borderColor: '#0a2540',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } } }
          }
        }
      });
    }
  }

  function updateIpoSandbox() {
    const growth = parseFloat(document.getElementById('slider-growth')?.value || 25);
    const ebitda = parseFloat(document.getElementById('slider-ebitda')?.value || 18);
    const multiple = parseFloat(document.getElementById('slider-multiple')?.value || 12);

    safeSetText('val-growth', `${growth}%`);
    safeSetText('val-ebitda', `${ebitda}%`);
    safeSetText('val-multiple', `${multiple}x`);

    const ruleOf40 = growth + ebitda;
    const rule40Elem = document.getElementById('val-rule40');
    if (rule40Elem) {
      rule40Elem.innerText = `${ruleOf40}%`;
      rule40Elem.style.color = ruleOf40 >= 40 ? '#00a3e0' : '#f59e0b';
    }

    // Calculate Projected Valuation (Year 3 ARR projected based on growth slider)
    const baseRevenue = 70.55; // Rp B
    const yr3Revenue = baseRevenue * Math.pow(1 + (growth / 100), 3);
    const yr3Ebitda = yr3Revenue * (ebitda / 100);
    const estValuationIdr = yr3Ebitda * multiple; // Rp Billion

    const valDisplay = document.getElementById('estimated-valuation-display');
    if (valDisplay) {
      valDisplay.innerText = currentCurrency === 'USD' 
        ? `$${((estValuationIdr * 1000000000) / (16000 * 1000000)).toFixed(1)}M USD`
        : `Rp ${estValuationIdr.toFixed(0)} Billion`;
    }
  }
});
