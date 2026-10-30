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
    examTitle: 'ប្រឡងសាកល្បងលើកទី១',
    examSession: 'សម័យប្រឡង ៖ ៧ ធ្នូ ២០២៦',
    location: 'រាជធានីភ្នំពេញ',
    locationColor: '#c81d1a',
    academicYear: 'ឆ្នាំសិក្សា ២០២៦-២០២៧',
    showCenter: true,
    centerName: 'វិទ្យាល័យព្រះស៊ីសុវត្ថិ',
    logoUrl: (typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.logo) ? DEFAULT_ASSETS.logo : 'assets/logo.png',
    dividerUrl: (typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.divider) ? DEFAULT_ASSETS.divider : 'assets/divider.png',
    dividerType: 'svg', // 'svg', 'image', 'custom', 'none'
    borderWidth: 6.5,     // in mm
    borderRadius: 3,      // in mm
    logoSize: 28,         // in mm
    roleFontSize: 22,     // in pt
    titleFontSize: 13,    // in pt
    sessionFontSize: 10,  // in pt (សម័យប្រឡង)
    centerFontSize: 9.5,  // in pt (ឈ្មោះសាលា/មណ្ឌល)
    yearFontSize: 10,     // in pt (ឆ្នាំសិក្សា)
    locationFontSize: 15.5, // in pt (រាជធានី/ខេត្ត)
    sessionGap: 3.5,      // in mm (gap from title to session)
    centerGap: 2.5,       // in mm (gap between session and center name)
    yearGap: 3,           // in mm (gap between location and academic year)
    footerBottom: 6.5,    // in mm (bottom space/lift for footer)
    bgUrl: (typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.background) ? DEFAULT_ASSETS.background : 'assets/background.jpg', // Background image URL/DataURL
    bgOpacity: 25,        // in percent (5-100)
    bgFit: 'cover',       // 'cover', 'contain', 'center'
    printScale: 90,       // in percentage (75% to 105%), default 90% gives ~17mm side margins
    cardColGap: 8,        // in mm (horizontal gap between cards)
    cardRowGap: 10,       // in mm (vertical gap between cards)
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

// Lightweight IndexedDB Storage for bulletproof persistent saving without 5MB quota limits
const DB_NAME = 'ExamBadgeDB';
const DB_STORE = 'badge_state';
const DB_KEY = 'saved_state';

function openBadgeDB() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function saveToIndexedDB(state) {
  try {
    const db = await openBadgeDB();
    if (!db) return;
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(JSON.parse(JSON.stringify(state)), DB_KEY);
  } catch (e) {
    console.warn('IndexedDB write error', e);
  }
}

async function loadFromIndexedDB() {
  try {
    const db = await openBadgeDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(DB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

// Canvas-based image compressor to keep uploads under ~150-250KB
function compressImageFile(file, maxDimension = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const isPng = file.type === 'image/png';
        let dataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality);
        if (isPng && dataUrl.length > 500000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        }
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

class BadgeApp {
  constructor() {
    this.state = this.loadState();
    this.initDOM();
    this.bindEvents();
    this.render();
    this.checkIndexedDBBackup();
    this.syncWithServer(false);
    this.initAutoSyncInterval();
  }

  async checkIndexedDBBackup() {
    try {
      const dbState = await loadFromIndexedDB();
      if (!dbState || !dbState.examInfo) return;

      const localStr = localStorage.getItem('exam_badge_state_v1');
      if (!localStr) {
        this.state = dbState;
        this.populateInputs();
        this.render();
        this.saveState();
      } else {
        if (typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.logo) {
          const l = this.state.examInfo.logoUrl || '';
          const isOld = !l || l === 'assets/logo.png' || l === 'assets/logo.jpg' ||
                        l.includes('iVBORw0KGgoAAAANSUhEUgAAAHAAAABy') ||
                        l.startsWith('data:image/jpeg') ||
                        (l.startsWith('data:image/png') && l.length < 50000);
          if (isOld) {
            this.state.examInfo.logoUrl = DEFAULT_ASSETS.logo;
            this.populateInputs();
            this.renderBadgesOnly();
            this.saveState();
          }
        }
        if (dbState.examInfo.bgUrl && !this.state.examInfo.bgUrl) {
          this.state.examInfo.bgUrl = dbState.examInfo.bgUrl;
          this.populateInputs();
          this.renderBadgesOnly();
        }
      }
    } catch (e) {
      console.warn('checkIndexedDBBackup error', e);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem('exam_badge_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.examInfo) {
          // If browser only holds the outdated initial template, auto-upgrade to the new official default template
          if (parsed.examInfo.examTitle === 'ប្រឡងជ្រើសរើសសិស្សពូកែ' &&
              parsed.examInfo.examSession &&
              parsed.examInfo.examSession.includes('២១ កញ្ញា')) {
            const fresh = JSON.parse(JSON.stringify(INITIAL_STATE));
            try {
              localStorage.setItem('exam_badge_state_v1', JSON.stringify(fresh));
              saveToIndexedDB(fresh);
            } catch (e) {}
            return fresh;
          }
          let upgraded = false;
          // Ensure assets are present and upgraded to latest clean versions
          if (typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.logo) {
            const currentLogo = parsed.examInfo.logoUrl || '';
            const isOldSampleLogo = !currentLogo ||
                                   currentLogo === 'assets/logo.png' ||
                                   currentLogo === 'assets/logo.jpg' ||
                                   currentLogo.includes('iVBORw0KGgoAAAANSUhEUgAAAHAAAABy') ||
                                   currentLogo.startsWith('data:image/jpeg') ||
                                   (currentLogo.startsWith('data:image/png') && currentLogo.length < 50000);
            if (isOldSampleLogo) {
              parsed.examInfo.logoUrl = DEFAULT_ASSETS.logo;
              upgraded = true;
            }
          }
          if (!parsed.examInfo.dividerUrl && typeof DEFAULT_ASSETS !== 'undefined') {
            parsed.examInfo.dividerUrl = DEFAULT_ASSETS.divider;
            upgraded = true;
          }
          if (!parsed.examInfo.dividerType || parsed.examInfo.dividerType === 'image') {
            parsed.examInfo.dividerType = 'svg';
            upgraded = true;
          }
          if (!parsed.examInfo.bgUrl && typeof DEFAULT_ASSETS !== 'undefined' && DEFAULT_ASSETS.background) {
            parsed.examInfo.bgUrl = DEFAULT_ASSETS.background;
            upgraded = true;
          }
          if (upgraded) {
            try {
              localStorage.setItem('exam_badge_state_v1', JSON.stringify(parsed));
              saveToIndexedDB(parsed);
            } catch (e) {}
          }
          if (!parsed.examInfo.logoSize) parsed.examInfo.logoSize = 28;
          if (!parsed.examInfo.roleFontSize) parsed.examInfo.roleFontSize = 22;
          if (!parsed.examInfo.titleFontSize) parsed.examInfo.titleFontSize = 13;
          if (parsed.examInfo.sessionFontSize === undefined) parsed.examInfo.sessionFontSize = 10;
          if (parsed.examInfo.centerFontSize === undefined) parsed.examInfo.centerFontSize = 9.5;
          if (parsed.examInfo.yearFontSize === undefined) parsed.examInfo.yearFontSize = 10;
          if (parsed.examInfo.locationFontSize === undefined) parsed.examInfo.locationFontSize = 15.5;
          if (parsed.examInfo.sessionGap === undefined) parsed.examInfo.sessionGap = 3.5;
          if (parsed.examInfo.centerGap === undefined) parsed.examInfo.centerGap = 2.5;
          if (parsed.examInfo.yearGap === undefined) parsed.examInfo.yearGap = 3;
          if (parsed.examInfo.footerBottom === undefined) parsed.examInfo.footerBottom = 6.5;
          if (parsed.examInfo.bgUrl === undefined) parsed.examInfo.bgUrl = null;
          if (parsed.examInfo.bgOpacity === undefined) parsed.examInfo.bgOpacity = 25;
          if (parsed.examInfo.bgFit === undefined) parsed.examInfo.bgFit = 'cover';
          if (parsed.examInfo.printScale === undefined) parsed.examInfo.printScale = 90;
          if (parsed.examInfo.cardColGap === undefined) parsed.examInfo.cardColGap = 8;
          if (parsed.examInfo.cardRowGap === undefined) parsed.examInfo.cardRowGap = 10;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  saveState() {
    let success = false;
    try {
      localStorage.setItem('exam_badge_state_v1', JSON.stringify(this.state));
      success = true;
    } catch (e) {
      console.warn('Full localStorage save failed (likely quota limit), saving safe fallback without large image...', e);
      try {
        const safe = JSON.parse(JSON.stringify(this.state));
        if (safe.examInfo && safe.examInfo.bgUrl && safe.examInfo.bgUrl.length > 250000) {
          safe.examInfo.bgUrl = null;
        }
        localStorage.setItem('exam_badge_state_v1', JSON.stringify(safe));
        success = true;
      } catch (err2) {
        console.error('Fatal localStorage save error', err2);
      }
    }

    // Always mirror full state to IndexedDB (no 5MB quota limit)
    saveToIndexedDB(this.state);

    if (success) {
      this.triggerAutoSaveIndicator();
    } else {
      const textEl = document.getElementById('autoSaveText');
      if (textEl) textEl.innerText = 'កំហុសរក្សាទុក';
    }
    return success;
  }

  manualSave() {
    const ok = this.saveState();
    if (ok) {
      alert('✅ បានរក្សាទុកទិន្នន័យដោយជោគជ័យ!\n\nរាល់ការកែប្រែទាំងអស់ត្រូវបានកត់ត្រាទុកយ៉ាងមានសុវត្ថិភាព។ លោកអ្នកអាច Refresh ទំព័រ ឬបិទ browser បានដោយមិនបាត់បង់ទិន្នន័យឡើយ។');
    } else {
      alert('⚠️ មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ! សូមពិនិត្យទំហំផ្ទុក ឬជ្រើសរើស Export JSON ដើម្បីរក្សាទុកជាឯកសារ។');
    }
  }

  // Synchronize state with central shared-data.json on server
  async syncWithServer(force = false) {
    const syncBtn = document.getElementById('btnServerSync');
    const syncText = document.getElementById('syncText');
    const syncIcon = document.getElementById('syncIcon');

    if (syncIcon) syncIcon.classList.add('animate-spin');
    if (syncText && force) syncText.innerText = 'កំពុងទាញ...';

    try {
      const res = await fetch(`shared-data.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('Shared data file not accessible');

      const serverData = await res.json();
      if (!serverData || !serverData.examInfo) throw new Error('Invalid shared data');

      const localVer = parseInt(localStorage.getItem('shared_data_version') || '0', 10);
      const serverVer = parseInt(serverData.version || '1', 10);

      if (force || serverVer > localVer || !localStorage.getItem('shared_data_version')) {
        // Merge official shared examInfo
        Object.assign(this.state.examInfo, serverData.examInfo);

        // Ensure clean default assets
        if (typeof DEFAULT_ASSETS !== 'undefined') {
          if (!this.state.examInfo.logoUrl ||
              this.state.examInfo.logoUrl.includes('iVBORw0KGgoAAAANSUhEUgAAAHAAAABy') ||
              this.state.examInfo.logoUrl.length < 50000) {
            this.state.examInfo.logoUrl = DEFAULT_ASSETS.logo;
          }
          if (!this.state.examInfo.bgUrl) {
            this.state.examInfo.bgUrl = DEFAULT_ASSETS.background;
          }
          if (!this.state.examInfo.dividerUrl) {
            this.state.examInfo.dividerUrl = DEFAULT_ASSETS.divider;
          }
        }

        if (Array.isArray(serverData.roles) && serverData.roles.length > 0) {
          this.state.roles = JSON.parse(JSON.stringify(serverData.roles));
        }
        if (Array.isArray(serverData.members) && serverData.members.length > 0) {
          this.state.members = JSON.parse(JSON.stringify(serverData.members));
        }

        localStorage.setItem('shared_data_version', String(serverVer));
        this.saveState();
        this.populateInputs();
        this.render();

        if (syncBtn) {
          syncBtn.className = syncBtn.className
            .replace(/bg-amber-\d+/g, 'bg-emerald-50')
            .replace(/border-amber-\d+/g, 'border-emerald-300')
            .replace(/text-amber-\d+/g, 'text-emerald-800');
        }
        if (syncText) syncText.innerText = `ទិន្នន័យរួម v${serverVer}`;

        if (force) {
          alert(`✅ បានធ្វើសមកាលកម្មទិន្នន័យផ្លូវការ (កំណែ v${serverVer}) ពី Server ដោយជោគជ័យ!\n\nរាល់ទិន្នន័យ អក្សរ និងតួនាទីទាំងអស់ត្រូវបាន Update ដូចគ្នាជាមួយគ្រប់ User ទាំងអស់។`);
        }
      } else {
        if (syncBtn) {
          syncBtn.className = syncBtn.className
            .replace(/bg-amber-\d+/g, 'bg-emerald-50')
            .replace(/border-amber-\d+/g, 'border-emerald-300')
            .replace(/text-amber-\d+/g, 'text-emerald-800');
        }
        if (syncText) syncText.innerText = `ទិន្នន័យរួម v${serverVer}`;
        if (force) {
          alert(`✅ ទិន្នន័យរបស់លោកអ្នកបានទាន់សម័យជាមួយ Server រួចរាល់ហើយ (កំណែ v${serverVer})!`);
        }
      }
    } catch (err) {
      console.warn('syncWithServer error:', err);
      if (syncText && force) syncText.innerText = 'Sync មិនបាន';
      if (force) {
        alert('⚠️ មិនអាចទាញយកទិន្នន័យពី Server បានទេនៅពេលនេះ (សូមពិនិត្យអ៊ីនធឺណិត)។');
      }
    } finally {
      if (syncIcon) syncIcon.classList.remove('animate-spin');
    }
  }

  initAutoSyncInterval() {
    // Check every 45 seconds when page is active
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.syncWithServer(false);
      }
    }, 45000);

    // Also check when tab regains focus
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncWithServer(false);
      }
    });
  }

  triggerAutoSaveIndicator() {
    const indicator = document.getElementById('autoSaveIndicator');
    const textEl = document.getElementById('autoSaveText');
    const dotEl = document.getElementById('autoSaveDot');
    if (!indicator || !textEl) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const khmerTime = toKhmerNumber(timeStr);

    indicator.className = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-semibold rounded-lg shadow-xs transition-all';
    if (dotEl) {
      dotEl.className = 'w-2 h-2 rounded-full bg-emerald-600 animate-ping';
      setTimeout(() => {
        if (dotEl) dotEl.className = 'w-2 h-2 rounded-full bg-emerald-500';
      }, 400);
    }
    textEl.innerText = `រក្សាទុករួចរាល់ (${khmerTime})`;

    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      if (indicator) {
        indicator.className = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg shadow-xs transition-all';
      }
    }, 2000);
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
    this.sessionFontSizeInput = document.getElementById('inputSessionFontSize');
    this.sessionFontSizeVal = document.getElementById('valSessionFontSize');
    this.centerFontSizeInput = document.getElementById('inputCenterFontSize');
    this.centerFontSizeVal = document.getElementById('valCenterFontSize');
    this.yearFontSizeInput = document.getElementById('inputYearFontSize');
    this.yearFontSizeVal = document.getElementById('valYearFontSize');
    this.locationFontSizeInput = document.getElementById('inputLocationFontSize');
    this.locationFontSizeVal = document.getElementById('valLocationFontSize');
    this.sessionGapInput = document.getElementById('inputSessionGap');
    this.sessionGapVal = document.getElementById('valSessionGap');
    this.centerGapInput = document.getElementById('inputCenterGap');
    this.centerGapVal = document.getElementById('valCenterGap');
    this.yearGapInput = document.getElementById('inputYearGap');
    this.yearGapVal = document.getElementById('valYearGap');
    this.footerBottomInput = document.getElementById('inputFooterBottom');
    this.footerBottomVal = document.getElementById('valFooterBottom');
    this.printScaleInput = document.getElementById('inputPrintScale');
    this.printScaleVal = document.getElementById('valPrintScale');
    this.printScaleToolbarVal = document.getElementById('valPrintScaleToolbar');
    this.badgeSideMarginToolbar = document.getElementById('badgeSideMarginToolbar');
    this.cardColGapInput = document.getElementById('inputCardColGap');
    this.cardColGapVal = document.getElementById('valCardColGap');
    this.cardRowGapInput = document.getElementById('inputCardRowGap');
    this.cardRowGapVal = document.getElementById('valCardRowGap');
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

    // Background Controls
    this.bgFileInput = document.getElementById('fileBg');
    this.bgPreview = document.getElementById('bgPreview');
    this.bgPlaceholderIcon = document.getElementById('bgPlaceholderIcon');
    this.bgOpacityInput = document.getElementById('inputBgOpacity');
    this.bgOpacityVal = document.getElementById('valBgOpacity');
    this.bgFitSelect = document.getElementById('selectBgFit');
    this.btnRemoveBg = document.getElementById('btnRemoveBg');
    this.groupBgSettings = document.getElementById('groupBgSettings');

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
    if (this.sessionFontSizeInput) this.sessionFontSizeInput.value = info.sessionFontSize || 10;
    if (this.sessionFontSizeVal) this.sessionFontSizeVal.innerText = (info.sessionFontSize || 10) + ' pt';
    if (this.centerFontSizeInput) this.centerFontSizeInput.value = info.centerFontSize || 9.5;
    if (this.centerFontSizeVal) this.centerFontSizeVal.innerText = (info.centerFontSize || 9.5) + ' pt';
    if (this.yearFontSizeInput) this.yearFontSizeInput.value = info.yearFontSize || 10;
    if (this.yearFontSizeVal) this.yearFontSizeVal.innerText = (info.yearFontSize || 10) + ' pt';
    if (this.locationFontSizeInput) this.locationFontSizeInput.value = info.locationFontSize || 15.5;
    if (this.locationFontSizeVal) this.locationFontSizeVal.innerText = (info.locationFontSize || 15.5) + ' pt';
    if (this.sessionGapInput) this.sessionGapInput.value = info.sessionGap !== undefined ? info.sessionGap : 3.5;
    if (this.sessionGapVal) this.sessionGapVal.innerText = (info.sessionGap !== undefined ? info.sessionGap : 3.5) + ' mm';
    if (this.centerGapInput) this.centerGapInput.value = info.centerGap !== undefined ? info.centerGap : 2.5;
    if (this.centerGapVal) this.centerGapVal.innerText = (info.centerGap !== undefined ? info.centerGap : 2.5) + ' mm';
    if (this.yearGapInput) this.yearGapInput.value = info.yearGap !== undefined ? info.yearGap : 3;
    if (this.yearGapVal) this.yearGapVal.innerText = (info.yearGap !== undefined ? info.yearGap : 3) + ' mm';
    if (this.footerBottomInput) this.footerBottomInput.value = info.footerBottom !== undefined ? info.footerBottom : 6.5;
    if (this.footerBottomVal) this.footerBottomVal.innerText = (info.footerBottom !== undefined ? info.footerBottom : 6.5) + ' mm';
    if (this.showCutMarksCheckbox) this.showCutMarksCheckbox.checked = !!info.showCutMarks;
    if (this.dividerTypeSelect) {
      this.dividerTypeSelect.value = info.dividerType || 'svg';
      if (this.groupCustomDivider) {
        this.groupCustomDivider.style.display = info.dividerType === 'custom' ? 'block' : 'none';
      }
    }
    if (this.badgeModeSelect) {
      this.badgeModeSelect.value = info.mode || 'roles';
      this.toggleModeSections(info.mode || 'roles');
    }
    if (this.logoPreview && info.logoUrl) this.logoPreview.src = info.logoUrl;
    if (this.bgPreview) {
      if (info.bgUrl) {
        this.bgPreview.src = info.bgUrl;
        this.bgPreview.style.display = 'block';
        if (this.bgPlaceholderIcon) this.bgPlaceholderIcon.style.display = 'none';
        if (this.btnRemoveBg) this.btnRemoveBg.style.display = 'inline-flex';
        if (this.groupBgSettings) this.groupBgSettings.style.display = 'block';
      } else {
        this.bgPreview.style.display = 'none';
        if (this.bgPlaceholderIcon) this.bgPlaceholderIcon.style.display = 'block';
        if (this.btnRemoveBg) this.btnRemoveBg.style.display = 'none';
        if (this.groupBgSettings) this.groupBgSettings.style.display = 'none';
      }
    }
    if (this.bgOpacityInput) this.bgOpacityInput.value = info.bgOpacity !== undefined ? info.bgOpacity : 25;
    if (this.bgOpacityVal) this.bgOpacityVal.innerText = (info.bgOpacity !== undefined ? info.bgOpacity : 25) + ' %';
    if (this.bgFitSelect) this.bgFitSelect.value = info.bgFit || 'cover';
    if (this.zoomSelect) this.zoomSelect.value = this.state.ui.zoom;
    this.updateScaleDisplays();
  }

  getSideMarginMm(scale = this.state.examInfo.printScale, colGap = this.state.examInfo.cardColGap || 8) {
    const s = scale || 90;
    const cg = colGap !== undefined ? colGap : 8;
    const effectiveWidth = (94 * 2 + cg) * (s / 100);
    const margin = (210 - effectiveWidth) / 2;
    return Math.max(0, Math.round(margin * 10) / 10);
  }

  updateScaleDisplays() {
    const scale = this.state.examInfo.printScale || 90;
    const colGap = this.state.examInfo.cardColGap !== undefined ? this.state.examInfo.cardColGap : 8;
    const rowGap = this.state.examInfo.cardRowGap !== undefined ? this.state.examInfo.cardRowGap : 10;
    const marginMm = this.getSideMarginMm(scale, colGap);
    const khmerScale = toKhmerNumber(scale);
    const khmerMargin = toKhmerNumber(marginMm);

    if (this.printScaleInput) this.printScaleInput.value = scale;
    if (this.printScaleVal) {
      this.printScaleVal.innerText = `${khmerScale}% (គែមសងខាង ~${khmerMargin} mm)`;
    }
    if (this.printScaleToolbarVal) {
      this.printScaleToolbarVal.innerText = `${khmerScale}%`;
    }
    if (this.badgeSideMarginToolbar) {
      this.badgeSideMarginToolbar.innerText = `គែមសងខាង ~${khmerMargin}mm`;
    }
    if (this.cardColGapInput) this.cardColGapInput.value = colGap;
    if (this.cardColGapVal) this.cardColGapVal.innerText = `${toKhmerNumber(colGap)} mm`;
    if (this.cardRowGapInput) this.cardRowGapInput.value = rowGap;
    if (this.cardRowGapVal) this.cardRowGapVal.innerText = `${toKhmerNumber(rowGap)} mm`;
    this.triggerAutoSaveIndicator();
  }

  applyPrintScale() {
    const scale = (this.state.examInfo.printScale || 90) / 100;
    const colGap = (this.state.examInfo.cardColGap !== undefined ? this.state.examInfo.cardColGap : 8) + 'mm';
    const rowGap = (this.state.examInfo.cardRowGap !== undefined ? this.state.examInfo.cardRowGap : 10) + 'mm';

    document.querySelectorAll('.a4-sheet-grid').forEach(grid => {
      grid.style.setProperty('zoom', scale, 'important');
      grid.style.setProperty('transform', 'none', 'important');
      grid.style.columnGap = colGap;
      grid.style.rowGap = rowGap;
    });
    document.documentElement.style.setProperty('--print-zoom', scale);
    document.documentElement.style.setProperty('--badge-col-gap', colGap);
    document.documentElement.style.setProperty('--badge-row-gap', rowGap);
    this.updateScaleDisplays();
  }

  adjustPrintScale(delta) {
    let current = this.state.examInfo.printScale || 90;
    current = Math.min(105, Math.max(75, current + delta));
    this.state.examInfo.printScale = current;
    this.saveState();
    this.applyPrintScale();
  }

  setPrintScale(val) {
    this.state.examInfo.printScale = Math.min(105, Math.max(75, parseInt(val, 10) || 90));
    this.saveState();
    this.applyPrintScale();
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

    if (this.sessionFontSizeInput) {
      this.sessionFontSizeInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 10;
        this.state.examInfo.sessionFontSize = val;
        if (this.sessionFontSizeVal) this.sessionFontSizeVal.innerText = val + ' pt';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.centerFontSizeInput) {
      this.centerFontSizeInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 9.5;
        this.state.examInfo.centerFontSize = val;
        if (this.centerFontSizeVal) this.centerFontSizeVal.innerText = val + ' pt';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.yearFontSizeInput) {
      this.yearFontSizeInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 10;
        this.state.examInfo.yearFontSize = val;
        if (this.yearFontSizeVal) this.yearFontSizeVal.innerText = val + ' pt';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.locationFontSizeInput) {
      this.locationFontSizeInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 15.5;
        this.state.examInfo.locationFontSize = val;
        if (this.locationFontSizeVal) this.locationFontSizeVal.innerText = val + ' pt';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.sessionGapInput) {
      this.sessionGapInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 3.5;
        this.state.examInfo.sessionGap = val;
        if (this.sessionGapVal) this.sessionGapVal.innerText = val + ' mm';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.centerGapInput) {
      this.centerGapInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 2.5;
        this.state.examInfo.centerGap = val;
        if (this.centerGapVal) this.centerGapVal.innerText = val + ' mm';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.yearGapInput) {
      this.yearGapInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 3;
        this.state.examInfo.yearGap = val;
        if (this.yearGapVal) this.yearGapVal.innerText = val + ' mm';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.footerBottomInput) {
      this.footerBottomInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 6.5;
        this.state.examInfo.footerBottom = val;
        if (this.footerBottomVal) this.footerBottomVal.innerText = val + ' mm';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.printScaleInput) {
      this.printScaleInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10) || 94;
        this.state.examInfo.printScale = val;
        this.saveState();
        this.applyPrintScale();
      });
    }

    if (this.cardColGapInput) {
      this.cardColGapInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 8;
        this.state.examInfo.cardColGap = val;
        this.saveState();
        this.applyPrintScale();
      });
    }

    if (this.cardRowGapInput) {
      this.cardRowGapInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 10;
        this.state.examInfo.cardRowGap = val;
        this.saveState();
        this.applyPrintScale();
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
      this.logoFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await compressImageFile(file, 600, 0.85);
        if (!dataUrl) return;
        this.state.examInfo.logoUrl = dataUrl;
        if (this.logoPreview) this.logoPreview.src = dataUrl;
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    // Background Upload
    if (this.bgFileInput) {
      this.bgFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await compressImageFile(file, 1200, 0.8);
        if (!dataUrl) return;
        this.state.examInfo.bgUrl = dataUrl;
        this.populateInputs();
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.btnRemoveBg) {
      this.btnRemoveBg.addEventListener('click', () => {
        this.state.examInfo.bgUrl = null;
        if (this.bgFileInput) this.bgFileInput.value = '';
        this.populateInputs();
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.bgOpacityInput) {
      this.bgOpacityInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10) || 25;
        this.state.examInfo.bgOpacity = val;
        if (this.bgOpacityVal) this.bgOpacityVal.innerText = val + ' %';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    if (this.bgFitSelect) {
      this.bgFitSelect.addEventListener('change', (e) => {
        this.state.examInfo.bgFit = e.target.value;
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    // Divider Upload
    if (this.dividerFileInput) {
      this.dividerFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await compressImageFile(file, 800, 0.85);
        if (!dataUrl) return;
        this.state.examInfo.dividerUrl = dataUrl;
        this.state.examInfo.dividerType = 'image';
        if (this.dividerTypeSelect) this.dividerTypeSelect.value = 'image';
        this.saveState();
        this.renderBadgesOnly();
      });
    }

    // Zoom Change
    if (this.zoomSelect) {
      this.zoomSelect.addEventListener('change', (e) => {
        this.state.ui.zoom = parseInt(e.target.value, 10);
        this.applyZoom();
        this.saveState();
      });
    }

    // Window Resize -> Auto adjust responsive preview if needed
    window.addEventListener('resize', () => {
      this.applyZoom();
    });

    // Instant Auto-Save on page exit or blur
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
    window.addEventListener('pagehide', () => {
      this.saveState();
    });
    window.addEventListener('blur', () => {
      this.saveState();
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

        <!-- Role Name Input (Rows 2 for easy 2-line editing) -->
        <div class="flex-1 min-w-0">
          <textarea rows="2" class="w-full text-xs font-khmer-moul px-2 py-1 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed" data-action="change-role-name" data-id="${role.id}" placeholder="ឈ្មោះតួនាទី (កំណត់ត្រឹម ២ ជួរ)" title="ចុចដើម្បីកែសម្រួលឈ្មោះតួនាទី (កំណត់ត្រឹម ២ ជួរ)">${role.name}</textarea>
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

      const grid = document.createElement('div');
      grid.className = 'a4-sheet-grid';
      const scale = (this.state.examInfo.printScale || 90) / 100;
      const colGap = (this.state.examInfo.cardColGap !== undefined ? this.state.examInfo.cardColGap : 8) + 'mm';
      const rowGap = (this.state.examInfo.cardRowGap !== undefined ? this.state.examInfo.cardRowGap : 10) + 'mm';
      grid.style.setProperty('zoom', scale, 'important');
      grid.style.setProperty('transform', 'none', 'important');
      grid.style.columnGap = colGap;
      grid.style.rowGap = rowGap;

      // Badges for this page: 4 badges per page
      const startIndex = (pageNum - 1) * 4;
      const pageBadges = badges.slice(startIndex, startIndex + 4);

      for (let i = 0; i < 4; i++) {
        const badgeData = pageBadges[i];
        if (badgeData) {
          const badgeEl = this.createBadgeElement(badgeData);
          grid.appendChild(badgeEl);
        } else {
          // Empty slot placeholder for clean printing or cutting balance
          const emptySlot = document.createElement('div');
          emptySlot.className = 'w-[94mm] h-[134mm] border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300 text-xs no-print';
          emptySlot.innerText = 'កន្លែងទំនេរ (Empty)';
          grid.appendChild(emptySlot);
        }
      }

      sheet.appendChild(grid);
      this.previewContainer.appendChild(sheet);
    });

    this.applyPrintScale();
  }

  // Create single badge DOM element matching the uploaded image design exactly!
  createBadgeElement(badge) {
    const info = this.state.examInfo;
    const badgeEl = document.createElement('div');
    badgeEl.className = 'exam-badge';
    badgeEl.style.borderColor = badge.color || '#d32f2f';
    badgeEl.style.borderWidth = `${info.borderWidth || 6.5}mm`;
    badgeEl.style.borderRadius = `${info.borderRadius || 3}mm`;

    // Process Role text: Strictly limit to maximum 2 lines (កំណត់ត្រឹម ២ ជួរ)
    let rawLines = (badge.roleName || '')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // Auto-split single long line if it starts with គណៈកម្មការ and exceeds 14 chars
    if (rawLines.length === 1 && rawLines[0].length > 14 && rawLines[0].startsWith('គណៈកម្មការ')) {
      rawLines = ['គណៈកម្មការ', rawLines[0].substring(9).trim()];
    }

    // Combine any excess lines beyond line 2 into line 2
    let finalLines = rawLines;
    if (rawLines.length > 2) {
      finalLines = [rawLines[0], rawLines.slice(1).join(' ')];
    } else if (rawLines.length === 0) {
      finalLines = [''];
    }

    // Determine Role Font Size so that the longest line fits without overflowing 73mm width
    const maxLineLen = Math.max(...finalLines.map(l => l.length));
    const isMultiLine = finalLines.length > 1;
    const baseSize = info.roleFontSize || 22;

    let computedFontSize = baseSize;
    let roleLineHeight = isMultiLine ? '1.35' : '1.25';

    if (isMultiLine) {
      if (maxLineLen > 22) {
        computedFontSize = Math.min(baseSize, 14.5);
      } else if (maxLineLen > 18) {
        computedFontSize = Math.min(baseSize, 15.5);
      } else if (maxLineLen > 15) {
        computedFontSize = Math.min(baseSize, 16.5);
      } else if (maxLineLen > 12) {
        computedFontSize = Math.min(baseSize, 19);
      } else {
        computedFontSize = baseSize;
      }
    } else {
      if (maxLineLen > 22) {
        computedFontSize = Math.min(baseSize, 15.5);
      } else if (maxLineLen > 18) {
        computedFontSize = Math.min(baseSize, 17.5);
      } else if (maxLineLen > 14) {
        computedFontSize = Math.min(baseSize, 20);
      } else {
        computedFontSize = baseSize + 2;
      }
    }

    const formattedRole = finalLines
      .map(line => `<span class="badge-role-line">${line}</span>`)
      .join('');

    // Divider HTML
    let dividerHtml = '';
    if ((info.dividerType === 'image' || info.dividerType === 'custom') && info.dividerUrl) {
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
      centerHtml = `<div class="badge-exam-center" style="font-size: ${info.centerFontSize || 9.5}pt;">${info.centerName}</div>`;
    }

    // Background Overlay HTML
    let bgOverlayHtml = '';
    if (info.bgUrl) {
      let bgSizeVal = 'cover';
      if (info.bgFit === 'contain') bgSizeVal = 'contain';
      else if (info.bgFit === 'center') bgSizeVal = '60%';
      else bgSizeVal = 'cover';

      bgOverlayHtml = `
        <div class="badge-bg-overlay" style="
          background-image: url('${info.bgUrl}');
          background-size: ${bgSizeVal};
          opacity: ${(info.bgOpacity !== undefined ? info.bgOpacity : 25) / 100};
        "></div>
      `;
    }

    badgeEl.innerHTML = `
      <div class="exam-badge-inner" style="padding-bottom: ${info.footerBottom !== undefined ? info.footerBottom : 6.5}mm;">
        ${bgOverlayHtml}
        <!-- Top Section: Logo, Title, Session -->
        <div class="badge-header">
          ${info.logoUrl ? `<img src="${info.logoUrl}" alt="Logo" class="badge-logo" style="height: ${info.logoSize || 28}mm;">` : ''}
          <h2 class="badge-exam-title" style="font-size: ${info.titleFontSize || 13}pt; margin-bottom: ${info.sessionGap !== undefined ? info.sessionGap : 3.5}mm;">${info.examTitle || 'ប្រឡងជ្រើសរើសសិស្សពូកែ'}</h2>
          <div class="badge-exam-session" style="font-size: ${info.sessionFontSize || 10}pt; ${info.showCenter && info.centerName ? `margin-bottom: ${info.centerGap !== undefined ? info.centerGap : 2.5}mm;` : ''}">${info.examSession || 'សម័យប្រឡង ៖ ២១ កញ្ញា ២០២៦'}</div>
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
          <div class="badge-location" style="font-size: ${info.locationFontSize || 15.5}pt; color: ${info.locationColor || '#c81d1a'}; margin-bottom: ${info.yearGap !== undefined ? info.yearGap : 3}mm;">
            ${info.location || 'រាជធានីភ្នំពេញ'}
          </div>
          <div class="badge-academic-year" style="font-size: ${info.yearFontSize || 10}pt;">
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
      saveToIndexedDB(this.state);
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
    this.applyPrintScale();

    // Trigger native browser print
    setTimeout(() => {
      window.print();
      // Restore view mode after print dialog closes
      this.state.ui.viewMode = origViewMode;
      this.renderPages();
      this.applyPrintScale();
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
