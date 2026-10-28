/**
 * Exam Committee Badge Generator (ប្រព័ន្ធបង្កើតស្លាកសញ្ញាគណៈកម្មការប្រឡង)
 * Developed for Cambodian Examination Committees
 */

// Khmer Numerals Map
const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

function toKhmerNumber(num) {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, d => KHMER_DIGITS[parseInt(d)]);
}

// Preset color options
const COLOR_PALETTE = [
  { name: 'ក្រហម (Red)', hex: '#d32f2f' },
  { name: 'លឿងទុំ (Gold/Yellow)', hex: '#f5a623' },
  { name: 'ខៀវស្រាល (Sky Blue)', hex: '#00a3e8' },
  { name: 'បៃតង (Green)', hex: '#10b981' },
  { name: 'ស្វាយ (Purple)', hex: '#8b5cf6' },
  { name: 'ទឹកក្រូច (Orange)', hex: '#f97316' },
  { name: 'ខៀវចាស់ (Navy Blue)', hex: '#1e3a8a' },
  { name: 'ឈាមជ្រូក (Crimson)', hex: '#991b1b' },
  { name: 'ផ្កាឈូក (Rose)', hex: '#ec4899' },
  { name: 'ប្រផេះ (Slate)', hex: '#475569' }
];

// Initial State matching the user uploaded sample
const INITIAL_STATE = {
  examInfo: {
    examTitle: 'ប្រឡងជ្រើសរើសសិស្សពូកែ',
    examSession: 'សម័យប្រឡង ៖ ២១ កញ្ញា ២០២៦',
    location: 'រាជធានីភ្នំពេញ',
    locationColor: '#c81d1a',
    academicYear: 'ឆ្នាំសិក្សា ២០២៦-២០២៧',
    showCenter: false,
    centerName: 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ',
    logoUrl: (typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.logo) ? DEFAULT_ASSETS.logo : 'assets/logo.png',
    dividerUrl: (typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.divider) ? DEFAULT_ASSETS.divider : 'assets/divider.png',
    dividerType: 'image', // 'image', 'svg', 'none'
    borderWidth: 6.5,     // in mm
    borderRadius: 3,      // in mm
    logoSize: 28,         // in mm
    roleFontSize: 22,     // in pt
    titleFontSize: 13,    // in pt
    showCutMarks: false,
    mode: 'roles'         // 'roles' or 'members'
  },
  roles: [
    { id: 1, name: 'ប្រធានមណ្ឌល', color: '#d32f2f', qty: 1 },
    { id: 2, name: 'អនុប្រធានមណ្ឌល', color: '#d32f2f', qty: 1 },
    { id: 3, name: 'គណៈកម្មការ\nកណ្ដាល', color: '#f5a623', qty: 1 },
    { id: 4, name: 'គណៈកម្មការ\nអប្បមាទ', color: '#00a3e8', qty: 1 },
    { id: 5, name: 'គណៈកម្មការ\nអនុរក្ស', color: '#10b981', qty: 4 },
    { id: 6, name: 'គណៈកម្មការ\nកែផ្ទៀង', color: '#8b5cf6', qty: 2 },
    { id: 7, name: 'គណៈកម្មការ\nលេខាធិការ', color: '#f97316', qty: 2 }
  ],
  members: [
    { id: 1, name: 'លោក ស៊ុន វណ្ណា', gender: 'ប្រុស', role: 'ប្រធានមណ្ឌល', color: '#d32f2f', unit: 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ', room: 'ការិយាល័យមណ្ឌល' },
    { id: 2, name: 'លោកស្រី កែវ មុនី', gender: 'ស្រី', role: 'អនុប្រធានមណ្ឌល', color: '#d32f2f', unit: 'វិទ្យាល័យបាក់ទូក', room: 'ការិយាល័យមណ្ឌល' },
    { id: 3, name: 'លោក ចាន់ ធី', gender: 'ប្រុស', role: 'គណៈកម្មការកណ្ដាល', color: '#f5a623', unit: 'ការិយាល័យអប់រំ', room: 'បន្ទប់ប្រជុំ' },
    { id: 4, name: 'លោក ហេង សុផល', gender: 'ប្រុស', role: 'គណៈកម្មការអប្បមាទ', color: '#00a3e8', unit: 'នាយកដ្ឋានត្រួតពិនិត្យ', room: 'អប្បមាទ' }
  ],
  ui: {
    currentPage: 1,
    zoom: 85,
    viewMode: 'all', // 'all' or 'paged'
    activeTab: 'general'
  }
};

class BadgeApp {
  constructor() {
    this.state = this.loadState();
    this.initDOM();
    this.bindEvents();
    this.render();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('exam_badge_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure assets are present
        if (!parsed.examInfo.logoUrl && typeof DEFAULT_ASSETS !== 'undefined') {
          parsed.examInfo.logoUrl = DEFAULT_ASSETS.logo;
        }
        if (!parsed.examInfo.dividerUrl && typeof DEFAULT_ASSETS !== 'undefined') {
          parsed.examInfo.dividerUrl = DEFAULT_ASSETS.divider;
        }
        if (!parsed.examInfo.logoSize) parsed.examInfo.logoSize = 28;
        if (!parsed.examInfo.roleFontSize) parsed.examInfo.roleFontSize = 22;
        if (!parsed.examInfo.titleFontSize) parsed.examInfo.titleFontSize = 13;
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem('exam_badge_state_v1', JSON.stringify(this.state));
    } catch (e) {
      console.error('Save state failed', e);
    }
  }

  initDOM() {
    // Inputs
    this.examTitleInput = document.getElementById('inputExamTitle');
    this.examSessionInput = document.getElementById('inputExamSession');
    this.locationInput = document.getElementById('inputLocation');
    this.locationColorInput = document.getElementById('inputLocationColor');
    this.academicYearInput = document.getElementById('inputAcademicYear');
    this.showCenterCheckbox = document.getElementById('checkboxShowCenter');
    this.centerNameInput = document.getElementById('inputCenterName');
    this.centerGroup = document.getElementById('groupCenterName');
    this.borderWidthInput = document.getElementById('inputBorderWidth');
    this.borderWidthVal = document.getElementById('valBorderWidth');
    this.borderRadiusInput = document.getElementById('inputBorderRadius');
    this.borderRadiusVal = document.getElementById('valBorderRadius');
    this.logoSizeInput = document.getElementById('inputLogoSize');
    this.logoSizeVal = document.getElementById('valLogoSize');
    this.roleFontSizeInput = document.getElementById('inputRoleFontSize');
    this.roleFontSizeVal = document.getElementById('valRoleFontSize');
    this.titleFontSizeInput = document.getElementById('inputTitleFontSize');
    this.titleFontSizeVal = document.getElementById('valTitleFontSize');
    this.showCutMarksCheckbox = document.getElementById('checkboxShowCutMarks');
    this.dividerTypeSelect = document.getElementById('selectDividerType');
    this.groupCustomDivider = document.getElementById('groupCustomDivider');
    this.badgeModeSelect = document.getElementById('selectBadgeMode');
    this.sectionRolesMode = document.getElementById('sectionRolesMode');
    this.sectionMembersMode = document.getElementById('sectionMembersMode');

    // Logo & Divider
    this.logoFileInput = document.getElementById('fileLogo');
    this.logoPreview = document.getElementById('logoPreview');
    this.dividerFileInput = document.getElementById('fileDivider');

    // Containers
    this.rolesListContainer = document.getElementById('rolesListContainer');
    this.membersTableBody = document.getElementById('membersTableBody');
    this.previewContainer = document.getElementById('previewContainer');
    this.totalBadgesCount = document.getElementById('totalBadgesCount');
    this.totalPagesCount = document.getElementById('totalPagesCount');
    this.paginationControls = document.getElementById('paginationControls');
    this.pageIndicator = document.getElementById('pageIndicator');
    this.zoomSelect = document.getElementById('selectZoom');

    // Populate initial inputs
    this.populateInputs();
  }

  populateInputs() {
    const info = this.state.examInfo;
    if (this.examTitleInput) this.examTitleInput.value = info.examTitle;
    if (this.examSessionInput) this.examSessionInput.value = info.examSession;
    if (this.locationInput) this.locationInput.value = info.location;
    if (this.locationColorInput) this.locationColorInput.value = info.locationColor || '#c81d1a';
    if (this.academicYearInput) this.academicYearInput.value = info.academicYear;
    if (this.showCenterCheckbox) this.showCenterCheckbox.checked = !!info.showCenter;
    if (this.centerNameInput) this.centerNameInput.value = info.centerName || '';
    if (this.centerGroup) this.centerGroup.style.display = info.showCenter ? 'block' : 'none';
    if (this.borderWidthInput) this.borderWidthInput.value = info.borderWidth || 6.5;
    if (this.borderWidthVal) this.borderWidthVal.innerText = (info.borderWidth || 6.5) + ' mm';
    if (this.borderRadiusInput) this.borderRadiusInput.value = info.borderRadius || 3;
    if (this.borderRadiusVal) this.borderRadiusVal.innerText = (info.borderRadius || 3) + ' mm';
    if (this.logoSizeInput) this.logoSizeInput.value = info.logoSize || 28;
    if (this.logoSizeVal) this.logoSizeVal.innerText = (info.logoSize || 28) + ' mm';
    if (this.roleFontSizeInput) this.roleFontSizeInput.value = info.roleFontSize || 22;
    if (this.roleFontSizeVal) this.roleFontSizeVal.innerText = (info.roleFontSize || 22) + ' pt';
    if (this.titleFontSizeInput) this.titleFontSizeInput.value = info.titleFontSize || 13;
    if (this.titleFontSizeVal) this.titleFontSizeVal.innerText = (info.titleFontSize || 13) + ' pt';
    if (this.showCutMarksCheckbox) this.showCutMarksCheckbox.checked = !!info.showCutMarks;
    if (this.dividerTypeSelect) {
      this.dividerTypeSelect.value = info.dividerType || 'image';
      if (this.groupCustomDivider) {
        this.groupCustomDivider.style.display = info.dividerType === 'custom' ? 'block' : 'none';
      }
    }
    if (this.badgeModeSelect) {
      this.badgeModeSelect.value = info.mode || 'roles';
      this.toggleModeSections(info.mode || 'roles');
    }
    if (this.logoPreview && info.logoUrl) this.logoPreview.src = info.logoUrl;
    if (this.zoomSelect) this.zoomSelect.value = this.state.ui.zoom;
  }

  toggleModeSections(mode) {
    if (this.sectionRolesMode) this.sectionRolesMode.style.display = mode === 'roles' ? 'block' : 'none';
    if (this.sectionMembersMode) this.sectionMembersMode.style.display = mode === 'members' ? 'block' : 'none';
  }

  bindEvents() {
    // Real-time text changes
    const bindText = (input, key) => {
      if (!input) return;
      input.addEventListener('input', (e) => {
        this.state.examInfo[key] = e.target.value;
        this.saveState();
        this.renderBadgesOnly();
      });
    };

    bindText(this.examTitleInput, 'examTitle');
    bindText(this.examSessionInput, 'examSession');
    bindText(this.locationInput, 'location');
    bindText(this.academicYearInput, 'academicYear');
    bindText(this.centerNameInput, 'centerName');

    if (this.locationColorInput) {
      this.locationColorInput.addEventListener('input', (e) => {
        this.state.examInfo.locationColor = e.target.value;
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.showCenterCheckbox) {
      this.showCenterCheckbox.addEventListener('change', (e) => {
        this.state.examInfo.showCenter = e.target.checked;
        if (this.centerGroup) this.centerGroup.style.display = e.target.checked ? 'block' : 'none';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.borderWidthInput) {
      this.borderWidthInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 6.5;
        this.state.examInfo.borderWidth = val;
        if (this.borderWidthVal) this.borderWidthVal.innerText = val + ' mm';
        this.saveState();
        this.updateBadgeStyles();
      });
    }

    if (this.borderRadiusInput) {
      this.borderRadiusInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 3;
        this.state.examInfo.borderRadius = val;
        if (this.borderRadiusVal) this.borderRadiusVal.innerText = val + ' mm';
        this.saveState();
        this.updateBadgeStyles();
      });
    }

    if (this.logoSizeInput) {
      this.logoSizeInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10) || 28;
        this.state.examInfo.logoSize = val;
        if (this.logoSizeVal) this.logoSizeVal.innerText = val + ' mm';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.roleFontSizeInput) {
      this.roleFontSizeInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10) || 22;
        this.state.examInfo.roleFontSize = val;
        if (this.roleFontSizeVal) this.roleFontSizeVal.innerText = val + ' pt';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.titleFontSizeInput) {
      this.titleFontSizeInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 13;
        this.state.examInfo.titleFontSize = val;
        if (this.titleFontSizeVal) this.titleFontSizeVal.innerText = val + ' pt';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.showCutMarksCheckbox) {
      this.showCutMarksCheckbox.addEventListener('change', (e) => {
        this.state.examInfo.showCutMarks = e.target.checked;
        this.saveState();
        this.render();
      });
    }

    if (this.dividerTypeSelect) {
      this.dividerTypeSelect.addEventListener('change', (e) => {
        this.state.examInfo.dividerType = e.target.value;
        if (this.groupCustomDivider) {
          this.groupCustomDivider.style.display = e.target.value === 'custom' ? 'block' : 'none';
        }
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.badgeModeSelect) {
      this.badgeModeSelect.addEventListener('change', (e) => {
        this.state.examInfo.mode = e.target.value;
        this.toggleModeSections(e.target.value);
        this.saveState();
        this.render();
      });
    }

    // Logo Upload
    if (this.logoFileInput) {
      this.logoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          this.state.examInfo.logoUrl = evt.target.result;
          if (this.logoPreview) this.logoPreview.src = evt.target.result;
          this.saveState();
          this.renderBadgesOnly();
        };
        reader.readAsDataURL(file);
      });
    }

    // Divider Upload
    if (this.dividerFileInput) {
      this.dividerFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          this.state.examInfo.dividerUrl = evt.target.result;
          this.state.examInfo.dividerType = 'image';
          if (this.dividerTypeSelect) this.dividerTypeSelect.value = 'image';
          this.saveState();
          this.renderBadgesOnly();
        };
        reader.readAsDataURL(file);
      });
    }

    // Zoom Change
    if (this.zoomSelect) {
      this.zoomSelect.addEventListener('change', (e) => {
        this.state.ui.zoom = parseInt(e.target.value, 10);
        this.applyZoom();
      });
    }

    // Window Resize -> Auto adjust responsive preview if needed
    window.addEventListener('resize', () => {
      this.applyZoom();
    });
  }

  updateBadgeStyles() {
    const bw = (this.state.examInfo.borderWidth || 6.5) + 'mm';
    const br = (this.state.examInfo.borderRadius || 3) + 'mm';
    document.querySelectorAll('.exam-badge').forEach(el => {
      el.style.borderWidth = bw;
      el.style.borderRadius = br;
    });
  }

  applyZoom() {
    const zoom = (this.state.ui.zoom || 85) / 100;
    if (this.previewContainer) {
      this.previewContainer.style.transform = `scale(${zoom})`;
    }
  }

  // Generate expanded list of badges
  getBadgesList() {
    const badges = [];
    if (this.state.examInfo.mode === 'members') {
      this.state.members.forEach(m => {
        badges.push({
          id: m.id,
          roleName: m.role,
          color: m.color || '#d32f2f',
          memberName: m.name,
          unit: m.unit,
          room: m.room,
          gender: m.gender
        });
      });
    } else {
      // Roles mode
      this.state.roles.forEach(r => {
        const count = Math.max(1, parseInt(r.qty) || 1);
        for (let i = 0; i < count; i++) {
          badges.push({
            id: `${r.id}_${i}`,
            roleId: r.id,
            roleName: r.name,
            color: r.color || '#d32f2f',
            memberName: null
          });
        }
      });
    }
    return badges;
  }

  render() {
    this.renderRolesControlList();
    this.renderMembersTable();
    this.renderPages();
    this.applyZoom();
    this.updateStats();
  }

  renderBadgesOnly() {
    this.renderPages();
    this.updateBadgeStyles();
  }

  updateStats() {
    const badges = this.getBadgesList();
    const totalBadges = badges.length;
    const totalPages = Math.ceil(totalBadges / 4) || 1;

    if (this.totalBadgesCount) this.totalBadgesCount.innerText = toKhmerNumber(totalBadges);
    if (this.totalPagesCount) this.totalPagesCount.innerText = toKhmerNumber(totalPages);
  }

  // Render Control List of Roles
  renderRolesControlList() {
    if (!this.rolesListContainer) return;
    this.rolesListContainer.innerHTML = '';

    this.state.roles.forEach((role, idx) => {
      const item = document.createElement('div');
      item.className = 'flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all';
      item.innerHTML = `
        <!-- Color Preview & Picker -->
        <div class="relative flex-shrink-0">
          <input type="color" value="${role.color}" class="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 bg-white" data-action="change-role-color" data-id="${role.id}">
        </div>

        <!-- Role Name Input -->
        <div class="flex-1 min-w-0">
          <textarea rows="1" class="w-full text-xs font-khmer-moul px-2 py-1 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none" data-action="change-role-name" data-id="${role.id}" title="ចុចដើម្បីកែសម្រួលឈ្មោះតួនាទី">${role.name}</textarea>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <button class="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 text-xs font-bold" data-action="decrement-role" data-id="${role.id}">-</button>
          <input type="number" min="1" max="999" value="${role.qty}" class="w-12 text-center text-xs font-bold py-1 border border-slate-300 rounded bg-white" data-action="change-role-qty" data-id="${role.id}">
          <button class="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-200 text-xs font-bold" data-action="increment-role" data-id="${role.id}">+</button>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <button class="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-white" title="ចម្លងតួនាទី (Duplicate)" data-action="duplicate-role" data-id="${role.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </button>
          <button class="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-white" title="លុប (Delete)" data-action="delete-role" data-id="${role.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      `;
      this.rolesListContainer.appendChild(item);
    });

    // Delegate Role Control Events
    this.rolesListContainer.onclick = (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = parseInt(btn.dataset.id, 10);
      const role = this.state.roles.find(r => r.id === id);
      if (!role) return;

      if (action === 'increment-role') {
        role.qty = (parseInt(role.qty) || 1) + 1;
        this.saveState();
        this.render();
      } else if (action === 'decrement-role') {
        if (role.qty > 1) {
          role.qty = role.qty - 1;
          this.saveState();
          this.render();
        }
      } else if (action === 'duplicate-role') {
        const newRole = {
          id: Date.now(),
          name: role.name,
          color: role.color,
          qty: role.qty
        };
        const pos = this.state.roles.indexOf(role);
        this.state.roles.splice(pos + 1, 0, newRole);
        this.saveState();
        this.render();
      } else if (action === 'delete-role') {
        if (this.state.roles.length <= 1) {
          alert('ត្រូវតែមានតួនាទីយ៉ាងហោចណាស់មួយ!');
          return;
        }
        if (confirm(`តើអ្នកពិតជាចង់លុបតួនាទី "${role.name.replace('\n', ' ')}" មែនទេ?`)) {
          this.state.roles = this.state.roles.filter(r => r.id !== id);
          this.saveState();
          this.render();
        }
      }
    };

    this.rolesListContainer.oninput = (e) => {
      const el = e.target;
      const action = el.dataset.action;
      const id = parseInt(el.dataset.id, 10);
      const role = this.state.roles.find(r => r.id === id);
      if (!role) return;

      if (action === 'change-role-name') {
        role.name = el.value;
        this.saveState();
        this.renderBadgesOnly();
      } else if (action === 'change-role-color') {
        role.color = el.value;
        this.saveState();
        this.renderBadgesOnly();
      } else if (action === 'change-role-qty') {
        role.qty = Math.max(1, parseInt(el.value) || 1);
        this.saveState();
        this.render();
      }
    };
  }

  // Render Member Table
  renderMembersTable() {
    if (!this.membersTableBody) return;
    this.membersTableBody.innerHTML = '';

    this.state.members.forEach((m, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b hover:bg-slate-50 text-xs';
      tr.innerHTML = `
        <td class="p-2 text-center text-slate-500">${toKhmerNumber(idx + 1)}</td>
        <td class="p-2 font-medium text-slate-800">${m.name}</td>
        <td class="p-2 text-center">${m.gender || 'ប្រុស'}</td>
        <td class="p-2">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold" style="background-color: ${m.color}15; color: ${m.color}; border: 1px solid ${m.color}40;">
            <span class="w-2 h-2 rounded-full" style="background-color: ${m.color};"></span>
            ${m.role}
          </span>
        </td>
        <td class="p-2 text-slate-600">${m.unit || '-'}</td>
        <td class="p-2 text-center">
          <button class="text-slate-400 hover:text-red-600 p-1 rounded" onclick="window.app.deleteMember(${m.id})" title="លុប">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      `;
      this.membersTableBody.appendChild(tr);
    });
  }

  deleteMember(id) {
    if (confirm('តើអ្នកពិតជាចង់លុបសមាជិកនេះមែនទេ?')) {
      this.state.members = this.state.members.filter(m => m.id !== id);
      this.saveState();
      this.render();
    }
  }

  submitNewMember() {
    const nameEl = document.getElementById('newMemberName');
    const genderEl = document.getElementById('newMemberGender');
    const roleEl = document.getElementById('newMemberRole');
    const colorEl = document.getElementById('newMemberColor');
    const unitEl = document.getElementById('newMemberUnit');
    const roomEl = document.getElementById('newMemberRoom');

    if (!nameEl || !nameEl.value.trim()) {
      alert('សូមបញ្ចូលឈ្មោះសមាជិក!');
      return;
    }

    const newMember = {
      id: Date.now(),
      name: nameEl.value.trim(),
      gender: genderEl ? genderEl.value : 'ប្រុស',
      role: (roleEl && roleEl.value.trim()) ? roleEl.value.trim() : 'គណៈកម្មការ',
      color: colorEl ? colorEl.value : '#d32f2f',
      unit: unitEl ? unitEl.value.trim() : '',
      room: roomEl ? roomEl.value.trim() : ''
    };

    this.state.members.push(newMember);
    this.saveState();
    this.render();

    // Reset and hide modal
    nameEl.value = '';
    if (unitEl) unitEl.value = '';
    if (roomEl) roomEl.value = '';
    document.getElementById('modalAddMember').classList.add('hidden');
  }

  downloadSampleCSV() {
    const headers = ['ឈ្មោះ', 'ភេទ', 'តួនាទី', 'ពណ៌ស៊ុម', 'អង្គភាព', 'បន្ទប់'];
    const rows = [
      ['លោក ស៊ុន វណ្ណា', 'ប្រុស', 'ប្រធានមណ្ឌល', '#d32f2f', 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ', 'ការិយាល័យមណ្ឌល'],
      ['លោកស្រី កែវ មុនី', 'ស្រី', 'អនុប្រធានមណ្ឌល', '#d32f2f', 'វិទ្យាល័យបាក់ទូក', 'ការិយាល័យមណ្ឌល'],
      ['លោក ចាន់ ធី', 'ប្រុស', 'គណៈកម្មការកណ្ដាល', '#f5a623', 'ការិយាល័យអប់រំ', 'បន្ទប់ប្រជុំ'],
      ['លោក ហេង សុផល', 'ប្រុស', 'គណៈកម្មការអប្បមាទ', '#00a3e8', 'នាយកដ្ឋានត្រួតពិនិត្យ', 'អប្បមាទ']
    ];

    let csvContent = '\uFEFF' + headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(v => `"${v}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'គំរូបញ្ជីឈ្មោះគណៈកម្មការ.csv');
    link.click();
  }

  importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        alert('ឯកសារ CSV មិនមានទិន្នន័យ!');
        return;
      }

      const newMembers = [];
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        // Simple regex to parse CSV with commas & quotes
        const cols = lines[i].split(',').map(s => s.replace(/^"|"$/g, '').trim());
        if (cols[0]) {
          newMembers.push({
            id: Date.now() + i,
            name: cols[0],
            gender: cols[1] || 'ប្រុស',
            role: cols[2] || 'គណៈកម្មការ',
            color: (cols[3] && cols[3].startsWith('#')) ? cols[3] : '#d32f2f',
            unit: cols[4] || '',
            room: cols[5] || ''
          });
        }
      }

      if (newMembers.length > 0) {
        this.state.members = newMembers;
        this.state.examInfo.mode = 'members';
        if (this.badgeModeSelect) this.badgeModeSelect.value = 'members';
        this.toggleModeSections('members');
        this.saveState();
        this.render();
        alert(`បានបញ្ចូលសមាជិកចំនួន ${toKhmerNumber(newMembers.length)} នាក់ដោយជោគជ័យ!`);
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  // Render Badge Cards onto A4 Sheets (2x2 grid per page)
  renderPages() {
    if (!this.previewContainer) return;
    this.previewContainer.innerHTML = '';

    const badges = this.getBadgesList();
    const totalBadges = badges.length;
    const totalPages = Math.ceil(totalBadges / 4) || 1;

    // Show/Hide Pagination Controls
    if (this.paginationControls) {
      this.paginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
      if (this.pageIndicator) {
        this.pageIndicator.innerText = `ទំព័រទី ${toKhmerNumber(this.state.ui.currentPage)} នៃ ${toKhmerNumber(totalPages)}`;
      }
    }

    // Determine which pages to render
    const pagesToRender = [];
    if (this.state.ui.viewMode === 'paged' && totalPages > 1) {
      pagesToRender.push(this.state.ui.currentPage);
    } else {
      for (let p = 1; p <= totalPages; p++) {
        pagesToRender.push(p);
      }
    }

    pagesToRender.forEach(pageNum => {
      const sheet = document.createElement('div');
      sheet.className = `a4-sheet ${this.state.examInfo.showCutMarks ? 'crop-lines' : ''}`;
      sheet.dataset.page = pageNum;

      // Badges for this page: 4 badges per page
      const startIndex = (pageNum - 1) * 4;
      const pageBadges = badges.slice(startIndex, startIndex + 4);

      for (let i = 0; i < 4; i++) {
        const badgeData = pageBadges[i];
        if (badgeData) {
          const badgeEl = this.createBadgeElement(badgeData);
          sheet.appendChild(badgeEl);
        } else {
          // Empty slot placeholder for clean printing or cutting balance
          const emptySlot = document.createElement('div');
          emptySlot.className = 'w-[94mm] h-[134mm] border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300 text-xs no-print';
          emptySlot.innerText = 'កន្លែងទំនេរ (Empty)';
          sheet.appendChild(emptySlot);
        }
      }

      this.previewContainer.appendChild(sheet);
    });
  }

  // Create single badge DOM element matching the uploaded image design exactly!
  createBadgeElement(badge) {
    const info = this.state.examInfo;
    const badgeEl = document.createElement('div');
    badgeEl.className = 'exam-badge';
    badgeEl.style.borderColor = badge.color || '#d32f2f';
    badgeEl.style.borderWidth = `${info.borderWidth || 6.5}mm`;
    badgeEl.style.borderRadius = `${info.borderRadius || 3}mm`;

    // Process Role text
    const lines = (badge.roleName || '').split('\n');
    const formattedRole = lines
      .map(line => `<span class="block">${line}</span>`)
      .join('');

    // Determine Role Font Size based on line length and user's base size
    const maxLineLen = Math.max(...lines.map(l => l.length));
    const isMultiLine = lines.length > 1;
    const baseSize = info.roleFontSize || 22;

    let computedFontSize = baseSize;
    let roleLineHeight = '1.35';

    if (isMultiLine) {
      if (maxLineLen > 18) {
        computedFontSize = Math.max(16, baseSize - 4);
      } else if (maxLineLen > 12) {
        computedFontSize = Math.max(18, baseSize - 2);
      } else {
        computedFontSize = baseSize;
      }
    } else {
      if (maxLineLen > 24) {
        computedFontSize = Math.max(16, baseSize - 4);
      } else if (maxLineLen > 18) {
        computedFontSize = Math.max(18.5, baseSize - 1.5);
      } else if (maxLineLen > 14) {
        computedFontSize = Math.max(20.5, baseSize);
      } else {
        computedFontSize = baseSize + 2;
      }
    }

    // Divider HTML
    let dividerHtml = '';
    if (info.dividerType === 'image' && info.dividerUrl) {
      dividerHtml = `<img src="${info.dividerUrl}" alt="Divider" class="badge-divider-img">`;
    } else if (info.dividerType === 'svg') {
      dividerHtml = `
        <svg viewBox="0 0 300 24" class="badge-divider-img text-slate-700" style="color: ${badge.color};" fill="currentColor">
          <path d="M 10 12 L 105 12 M 195 12 L 290 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <circle cx="10" cy="12" r="2.5"/>
          <circle cx="290" cy="12" r="2.5"/>
          <polygon points="150,4 157,12 150,20 143,12"/>
          <circle cx="150" cy="12" r="2.5" fill="#ffffff"/>
          <circle cx="132" cy="12" r="2"/>
          <circle cx="168" cy="12" r="2"/>
          <path d="M 105 12 Q 118 6 125 12" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <path d="M 195 12 Q 182 6 175 12" fill="none" stroke="currentColor" stroke-width="1.6"/>
        </svg>
      `;
    }

    // Member Info HTML (if in member mode)
    let memberHtml = '';
    if (badge.memberName) {
      memberHtml = `
        <div class="badge-member-name">${badge.memberName}</div>
        ${badge.unit ? `<div class="badge-member-details">${badge.unit}</div>` : ''}
        ${badge.room ? `<div class="badge-member-details font-semibold">${badge.room}</div>` : ''}
      `;
    }

    // Center Info HTML
    let centerHtml = '';
    if (info.showCenter && info.centerName) {
      centerHtml = `<div class="badge-exam-center">${info.centerName}</div>`;
    }

    badgeEl.innerHTML = `
      <div class="exam-badge-inner">
        <!-- Top Section: Logo, Title, Session -->
        <div class="badge-header">
          ${info.logoUrl ? `<img src="${info.logoUrl}" alt="Logo" class="badge-logo" style="height: ${info.logoSize || 28}mm;">` : ''}
          <h2 class="badge-exam-title" style="font-size: ${info.titleFontSize || 13}pt;">${info.examTitle || 'ប្រឡងជ្រើសរើសសិស្សពូកែ'}</h2>
          <div class="badge-exam-session">${info.examSession || 'សម័យប្រឡង ៖ ២១ កញ្ញា ២០២៦'}</div>
          ${centerHtml}
        </div>

        <!-- Middle Section: Role / Committee -->
        <div class="badge-role-container">
          <h1 class="badge-role-title" style="font-size: ${computedFontSize}pt; line-height: ${roleLineHeight};">
            ${formattedRole}
          </h1>
          ${memberHtml}
        </div>

        <!-- Bottom Section: Location, Academic Year, Divider -->
        <div class="badge-footer">
          <div class="badge-location" style="color: ${info.locationColor || '#c81d1a'};">
            ${info.location || 'រាជធានីភ្នំពេញ'}
          </div>
          <div class="badge-academic-year">
            ${info.academicYear || 'ឆ្នាំសិក្សា ២០២៦-២០២៧'}
          </div>
          ${dividerHtml}
        </div>
      </div>
    `;

    return badgeEl;
  }

  // Add New Role
  addNewRole(name = 'គណៈកម្មការថ្មី', color = '#d32f2f', qty = 1) {
    const newRole = {
      id: Date.now(),
      name,
      color,
      qty
    };
    this.state.roles.push(newRole);
    this.saveState();
    this.render();
  }

  // Reset to initial sample design
  resetToTemplate() {
    if (confirm('តើអ្នកចង់កំណត់ប្រព័ន្ធឡើងវិញទៅគំរូដើម (ដូចរូបភាពគំរូ) មែនទេ?')) {
      this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
      this.saveState();
      this.populateInputs();
      this.render();
    }
  }

  // Load Exam Type Preset
  loadExamPreset(type) {
    if (type === 'outstanding') {
      this.state.examInfo.examTitle = 'ប្រឡងជ្រើសរើសសិស្សពូកែ';
      this.state.examInfo.location = 'រាជធានីភ្នំពេញ';
    } else if (type === 'mock1' || type === 'bacii') {
      this.state.examInfo.examTitle = 'ប្រឡងសាកល្បងលើកទី១';
      this.state.examInfo.location = 'រាជធានីភ្នំពេញ';
    } else if (type === 'mock2') {
      this.state.examInfo.examTitle = 'ប្រឡងសាកល្បងលើកទី២';
      this.state.examInfo.location = 'រាជធានីភ្នំពេញ';
    } else if (type === 'brevet') {
      this.state.examInfo.examTitle = 'ប្រឡងសញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ';
      this.state.examInfo.location = 'រាជធានីភ្នំពេញ';
    } else if (type === 'semester1') {
      this.state.examInfo.examTitle = 'ការប្រឡងឆមាសលើកទី១';
    } else if (type === 'semester2') {
      this.state.examInfo.examTitle = 'ការប្រឡងឆមាសលើកទី២';
    }
    this.populateInputs();
    this.saveState();
    this.renderBadgesOnly();
  }

  // Convert Gregorian Date to Khmer String
  setKhmerDateFromPicker(dateString) {
    if (!dateString) return;
    const parts = dateString.split('-');
    if (parts.length !== 3) return;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const khmerDay = toKhmerNumber(day);
    const khmerMonth = KHMER_MONTHS[month] || '';
    const khmerYear = toKhmerNumber(year);

    const sessionStr = `សម័យប្រឡង ៖ ${khmerDay} ${khmerMonth} ${khmerYear}`;
    this.state.examInfo.examSession = sessionStr;
    if (this.examSessionInput) this.examSessionInput.value = sessionStr;
    this.saveState();
    this.renderBadgesOnly();
  }

  // Pagination navigation
  goToPage(p) {
    const totalBadges = this.getBadgesList().length;
    const totalPages = Math.ceil(totalBadges / 4) || 1;
    if (p >= 1 && p <= totalPages) {
      this.state.ui.currentPage = p;
      this.renderPages();
    }
  }

  nextPage() {
    const totalBadges = this.getBadgesList().length;
    const totalPages = Math.ceil(totalBadges / 4) || 1;
    if (this.state.ui.currentPage < totalPages) {
      this.goToPage(this.state.ui.currentPage + 1);
    }
  }

  prevPage() {
    if (this.state.ui.currentPage > 1) {
      this.goToPage(this.state.ui.currentPage - 1);
    }
  }

  // Print system
  print() {
    // Before printing, force all pages to render
    const origViewMode = this.state.ui.viewMode;
    this.state.ui.viewMode = 'all';
    this.renderPages();

    // Trigger native browser print
    setTimeout(() => {
      window.print();
      // Restore view mode after print dialog closes
      this.state.ui.viewMode = origViewMode;
      this.renderPages();
    }, 250);
  }

  // Export JSON backup
  exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `exam_committee_badges_${Date.now()}.json`);
    dlAnchorElem.click();
  }

  // Import JSON backup
  importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.examInfo && imported.roles) {
          this.state = imported;
          this.saveState();
          this.populateInputs();
          this.render();
          alert('ទិន្នន័យត្រូវបានបញ្ចូលដោយជោគជ័យ!');
        } else {
          alert('ឯកសារ JSON មិនត្រឹមត្រូវតាមទម្រង់!');
        }
      } catch (err) {
        alert('មានបញ្ហាក្នុងការអានឯកសារ JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  }
}

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new BadgeApp();
});
