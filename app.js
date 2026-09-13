(function() {
    'use strict';

    var STORAGE = {
        TIMERS: 'timeflow_timers',
        SETTINGS: 'timeflow_settings',
        NOTIFIED: 'timeflow_notified',
        DND: 'timeflow_dnd',
        DRAG_TIP: 'chronoflow_drag_tip_version',
        IOS_TIP: 'chronoflow_ios_tip_shown'
    };
    var MODAL = { TIMER: 'timerModal', FILTER: 'fModal', SETTINGS: 'sModal', CONFIRM: 'confirmModal' };
    var CATEGORIES = [
        { id: 'work', name: 'Работа' }, { id: 'health', name: 'Здоровье' },
        { id: 'personal', name: 'Личное' }, { id: 'study', name: 'Учёба' },
        { id: 'travel', name: 'Путешествия' }
    ];
    var CAT_NAMES = {};
    CATEGORIES.forEach(function(c) { CAT_NAMES[c.id] = c.name; });
    var REC_NAMES = { weekly: 'Еженед.', monthly: 'Ежемес.', yearly: 'Ежегод.' };
    var COLORS = ['#5ab0e0', '#7eacff', '#b89cff', '#ff7eb3', '#ff8c00', '#5cd66e', '#ff6b6b'];
    var DEFAULT_COLOR = '#60cdff';
    var MAX_TITLE = 50;
    var DND_DURATION = 24 * 60 * 60 * 1000;
    var DAY_MS = 86400000;
    var DAYS_SHORT = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
    var MONTHS_SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];

    var TEXTS = {
        emptyTitle: 'Каждый день на счету',
        emptyBody: 'ChronoFlow — офлайн-таймер для всего, что важно. Не курю 45 дней. До отпуска 128 дней. Создайте свой счётчик.',
        emptyBtn: 'Создать счётчик',
        noResultsTitle: 'Ничего не найдено',
        noResultsBody: 'Попробуйте изменить фильтр или поиск.',
        noResultsBtn: 'Сбросить фильтры',
        added: 'Добавлено', updated: 'Обновлено', deleted: 'Удалено', restored: 'Восстановлено',
        duplicated: 'Счётчик дублирован', cleared: 'Очищено',
        muted: 'Уведомления отключены на 24 ч', unmuted: 'Уведомления включены',
        noConnection: 'Нет соединения', connectionBack: 'Соединение восстановлено',
        refreshed: 'Обновлено', exported: 'Экспортировано', imageSaved: 'Изображение сохранено',
        icsExported: 'Календарь экспортирован',
        enterTitle: 'Введите название', enterDate: 'Укажите дату', invalidDate: 'Некорректная дата',
        noData: 'Нет данных', noTimers: 'Нет счётчиков',
        importError: 'Ошибка импорта: ', updateAvailable: 'Доступно обновление. Обновите страницу.',
        iosInstall: 'Нажмите «Поделиться» → «На экран Домой» для установки'
    };

    var ICONS = {
        settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
        install: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 17V3M7 12l5 5 5-5M4 18h16"/></svg>',
        plus: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>',
        search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
        filter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16M7 12h10M9 18h6"/></svg>',
        close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
        trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>',
        clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
        calendarPicker: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
        calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
        exportDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
        importUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>',
        image: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
        colorPlus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>',
        searchClear: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
        check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12v4M12 8h.01"/></svg>',
        mute: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>',
        bell: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
        drag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>',
        edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg>',
        duplicate: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
    };

    var TPL_DATA = {
        sobriety: { title:'Не курю', type:'elapsed', color:'#30d158', category:'health', recurring:'', reminder:false },
        work: { title:'На работе', type:'elapsed', color:'#0a84ff', category:'work', recurring:'', reminder:false },
        vacation: { title:'До отпуска', type:'countdown', color:'#ff8c00', category:'travel', recurring:'', reminder:true },
        language: { title:'Изучение языка', type:'elapsed', color:'#bf5af2', category:'study', recurring:'', reminder:false },
        fitness: { title:'Фитнес streak', type:'elapsed', color:'#ff6b6b', category:'health', recurring:'weekly', reminder:false },
        savings: { title:'Накопления', type:'elapsed', color:'#5cd66e', category:'personal', recurring:'', reminder:false }
    };

    // ===== Платформа =====
    var PLATFORM = (function() {
        var ua = navigator.userAgent;
        var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
        var isAndroid = /Android/.test(ua);
        var isStandalone = (window.navigator.standalone === true) ||
                          (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
        return { isIOS: isIOS, isAndroid: isAndroid, isStandalone: isStandalone };
    })();

    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // ===== Состояние =====
    var state = {
        timers: [], dnd: {}, notified: {}, settings: {},
        editId: null, filter: 'all', sortBy: 'order', categoryFilter: 'all',
        searchQuery: '', groupByCategory: false, selectedColor: DEFAULT_COLOR,
        prevDay: -1, prevHour: -1, lastTick: 0, firstRenderDone: false,
        anims: true, _pageVisible: true, _rafId: null,
        _modalStack: [], _focusTrap: null, _lastFocus: null,
        _categoriesOpen: {}, _dragSrcId: null, _installPrompt: null,
        _userTapped: false, _undoData: null, _undoTimer: null
    };

    var el = {};
    var svg = {};
    var visibleCards = new Set();
    var intersectionObserver = null;
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SEC_RING_CIRC = 2 * Math.PI * 88;
    var DAY_RING_CIRC = 2 * Math.PI * 76;

    // ===== Утилиты =====
    function $(id) { return document.getElementById(id); }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
    function genId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID().replace(/-/g,'').slice(0,20);
        return Date.now().toString(36) + Math.random().toString(36).substring(2,10);
    }
    function localISO(d) {
        var off = d.getTimezoneOffset();
        return new Date(d.getTime() - off * 60000).toISOString().slice(0,16);
    }
    function relDay(d) { return d.getDay() === 0 ? 6 : d.getDay() - 1; }
    function declension(v, forms) {
        v = Math.abs(v);
        var n = v % 100;
        var idx = (n >= 5 && n <= 20) ? 2 : (n % 10 === 1) ? 0 : (n % 10 >= 2 && n % 10 <= 4) ? 1 : 2;
        return v + ' ' + forms[idx];
    }
    function calcDateParts(totalDays) {
        var ref = new Date(2000,0,1);
        var end = new Date(ref.getTime() + totalDays * DAY_MS);
        var y = end.getFullYear() - ref.getFullYear();
        var mo = end.getMonth() - ref.getMonth();
        var dd = end.getDate() - ref.getDate();
        if (dd < 0) { mo--; dd += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
        if (mo < 0) { y--; mo += 12; }
        return { y: y, mo: mo, dd: dd };
    }
    function fmtCounter(timestamp, type) {
        var now = Date.now();
        var diff = type === 'countdown' ? timestamp - now : now - timestamp;
        var negative = diff < 0;
        if (type === 'elapsed' && negative) return 'Ещё не наступило';
        var abs = Math.abs(diff);
        var sc = Math.floor(abs / 1000);
        var mn = Math.floor(sc / 60);
        var hr = Math.floor(mn / 60);
        var dy = Math.floor(hr / 24);
        var dp = calcDateParts(dy);
        var rh = hr % 24, rm = mn % 60, rs = sc % 60;
        var r = [];
        if (dp.y > 0) r.push(declension(dp.y, ['год','года','лет']));
        if (dp.mo > 0) r.push(declension(dp.mo, ['месяц','месяца','месяцев']));
        if (dp.dd > 0) r.push(declension(dp.dd, ['день','дня','дней']));
        if (rh > 0) r.push(declension(rh, ['час','часа','часов']));
        if (rm > 0) r.push(declension(rm, ['минуту','минуты','минут']));
        if (rs > 0 || r.length === 0) r.push(declension(rs, ['секунду','секунды','секунд']));
        var result = r.join(' ');
        if (type === 'countdown' && negative) result += ' назад';
        return result;
    }
    function formatDate(ts) {
        var fmt = state.settings.dateFormat || 'DD.MM.YYYY';
        var d = new Date(ts);
        var dd = pad(d.getDate()), mm = pad(d.getMonth()+1), yyyy = d.getFullYear();
        var hh = pad(d.getHours()), mi = pad(d.getMinutes());
        if (fmt === 'MM/DD/YYYY') return mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + mi;
        if (fmt === 'YYYY-MM-DD') return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi;
        return dd + '.' + mm + '.' + yyyy + ' ' + hh + ':' + mi;
    }
    function lightenHex(hex, pct) {
        if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return hex || DEFAULT_COLOR;
        var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
        r = Math.min(255, Math.round(r + (255 - r) * pct));
        g = Math.min(255, Math.round(g + (255 - g) * pct));
        b = Math.min(255, Math.round(b + (255 - b) * pct));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    function haptic(type) {
        if (!navigator.vibrate || !state._userTapped) return;
        try {
            if (type === 'error') navigator.vibrate([15,50,15]);
            else if (type === 'success') navigator.vibrate([10,30,10]);
            else if (type === 'medium') navigator.vibrate(20);
            else navigator.vibrate(10);
        } catch(e) {}
    }
    function showPickerFallback(input) {
        // iOS Safari не поддерживает showPicker(), используем клик
        if (input && typeof input.showPicker === 'function') {
            try { input.showPicker(); return; } catch (e) {}
        }
        if (input) { input.focus(); input.click(); }
    }
    function ensureRoundRect() {
        if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
                var r = typeof radii === 'number' ? [radii,radii,radii,radii] : radii;
                if (!Array.isArray(r) || r.length < 4) r = [0,0,0,0];
                this.moveTo(x+r[0], y);
                this.lineTo(x+w-r[1], y);
                this.quadraticCurveTo(x+w, y, x+w, y+r[1]);
                this.lineTo(x+w, y+h-r[2]);
                this.quadraticCurveTo(x+w, y+h, x+w-r[2], y+h);
                this.lineTo(x+r[3], y+h);
                this.quadraticCurveTo(x, y+h, x, y+h-r[3]);
                this.lineTo(x, y+r[0]);
                this.quadraticCurveTo(x, y, x+r[0], y);
                this.closePath();
            };
        }
    }

    // ===== Storage =====
    var storage = {
        get: function(key, def) {
            try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
            catch (e) { return def; }
        },
        set: function(key, val) {
            try { localStorage.setItem(key, JSON.stringify(val)); }
            catch (e) {
                if (e.name === 'QuotaExceededError' || e.code === 22) {
                    toast.error('Хранилище переполнено. Удалите лишние счётчики.');
                }
            }
        }
    };

    // ===== Toast =====
    var toast = {
        show: function(msg, type) {
            var n = el.notif;
            if (!n) return;
            var iconMap = { success: ICONS.check, error: ICONS.error, info: ICONS.info };
            var icon = iconMap[type] || ICONS.info;
            n.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-msg">' + esc(msg) + '</span><button class="toast-close" aria-label="Закрыть">✕</button>';
            n.className = 'notif toast show toast-' + (type || 'info');
            var closeBtn = n.querySelector('.toast-close');
            if (closeBtn) closeBtn.onclick = function() { n.classList.remove('show'); clearTimeout(n._t); };
            clearTimeout(n._t);
            n._t = setTimeout(function() { n.classList.remove('show'); }, 2800);
            haptic(type === 'error' ? 'error' : 'light');
        },
        success: function(m) { this.show(m, 'success'); },
        error: function(m) { this.show(m, 'error'); },
        info: function(m) { this.show(m, 'info'); }
    };

    // ===== Загрузка/сохранение =====
    function loadTimers() {
        var raw = storage.get(STORAGE.TIMERS);
        state.timers = Array.isArray(raw) ? raw.filter(function(t) {
            return t && typeof t === 'object' && typeof t.id === 'string' &&
                   typeof t.title === 'string' && typeof t.date === 'number';
        }) : [];
    }
    function saveTimers() { storage.set(STORAGE.TIMERS, state.timers); }
    function loadNotified() { state.notified = storage.get(STORAGE.NOTIFIED, {}); }
    function saveNotified() { storage.set(STORAGE.NOTIFIED, state.notified); }
    function loadDnd() {
        var raw = storage.get(STORAGE.DND, {});
        var now = Date.now();
        var cleaned = {};
        Object.keys(raw).forEach(function(id) { if (raw[id] > now) cleaned[id] = raw[id]; });
        state.dnd = cleaned;
        if (Object.keys(cleaned).length !== Object.keys(raw).length) saveDnd();
    }
    function saveDnd() { storage.set(STORAGE.DND, state.dnd); }
    function isDnd(id) { return !!state.dnd[id]; }
    function toggleDnd(id) {
        if (state.dnd[id]) { delete state.dnd[id]; toast.info(TEXTS.unmuted); }
        else { state.dnd[id] = Date.now() + DND_DURATION; toast.success(TEXTS.muted); }
        saveDnd(); haptic('light'); render();
    }
    function loadSettings() {
        state.settings = storage.get(STORAGE.SETTINGS, {});
        var s = state.settings;
        applyTheme(s.theme || 'system');
        state.anims = s.anims !== false;
        state.sortBy = s.sortBy || 'order';
        state.categoryFilter = s.categoryFilter || 'all';
        state.filter = s.filter || 'all';
        state.groupByCategory = !!s.groupByCategory;
        if (el.themeSel) el.themeSel.value = s.theme || 'system';
        if (el.animToggle) el.animToggle.checked = state.anims;
        if (el.groupToggle) el.groupToggle.checked = state.groupByCategory;
        if (el.dateFormat) el.dateFormat.value = s.dateFormat || 'DD.MM.YYYY';
        if (el.weekStart) el.weekStart.value = String(s.weekStart != null ? s.weekStart : 1);
        if (el.notifEnabled) el.notifEnabled.checked = s.notifEnabled !== false;
        if (el.notifPeriod) el.notifPeriod.value = String(s.notifPeriod != null ? s.notifPeriod : 3);
        if (el.praiseEnabled) el.praiseEnabled.checked = s.praiseEnabled !== false;
        if (el.praiseInterval) el.praiseInterval.value = String(s.praiseInterval || 30);
        applyAnimPref();
    }
    function saveSettings() {
        state.settings = {
            theme: el.themeSel ? el.themeSel.value : 'system',
            anims: el.animToggle ? el.animToggle.checked : true,
            sortBy: state.sortBy,
            categoryFilter: state.categoryFilter,
            filter: state.filter,
            groupByCategory: el.groupToggle ? el.groupToggle.checked : false,
            dateFormat: el.dateFormat ? el.dateFormat.value : 'DD.MM.YYYY',
            weekStart: el.weekStart ? parseInt(el.weekStart.value) : 1,
            notifEnabled: el.notifEnabled ? el.notifEnabled.checked : true,
            notifPeriod: el.notifPeriod ? parseInt(el.notifPeriod.value) : 3,
            praiseEnabled: el.praiseEnabled ? el.praiseEnabled.checked : true,
            praiseInterval: el.praiseInterval ? parseInt(el.praiseInterval.value) : 30
        };
        storage.set(STORAGE.SETTINGS, state.settings);
    }
    function applyTheme(t) {
        document.body.classList.remove('lt');
        if (t === 'light') document.body.classList.add('lt');
        else if (t === 'system' && window.matchMedia('(prefers-color-scheme:light)').matches) {
            document.body.classList.add('lt');
        }
    }
    function applyAnimPref() { document.body.classList.toggle('no-anim', !state.anims); }

    // ===== Уведомления =====
    function notify(timer, body, type) {
        toast.show(timer.title + ' — ' + body, type);
    }
    function checkNotifications(now) {
        if (state.settings.notifEnabled === false) return;
        var ts = now.getTime();
        var period = state.settings.notifPeriod != null ? state.settings.notifPeriod : 3;
        var praiseEnabled = state.settings.praiseEnabled !== false;
        var praiseInterval = state.settings.praiseInterval || 30;
        var changed = false;
        for (var i = 0; i < state.timers.length; i++) {
            var t = state.timers[i];
            if (isDnd(t.id)) continue;
            if (t.type === 'countdown' && t.reminder) {
                var daysLeft = Math.ceil((t.date - ts) / DAY_MS);
                var periods = [period, 1, 0];
                if (daysLeft >= 0 && periods.indexOf(daysLeft) !== -1) {
                    var key = 'r_' + t.id + '_' + daysLeft;
                    if (!state.notified[key]) {
                        state.notified[key] = true;
                        changed = true;
                        notify(t, daysLeft === 0 ? 'сегодня' : 'осталось ' + declension(daysLeft, ['день','дня','дней']), 'info');
                    }
                }
            }
            if (t.type === 'elapsed' && praiseEnabled) {
                var elapsedDays = Math.floor((ts - t.date) / DAY_MS);
                if (elapsedDays > 0) {
                    var lastPraiseKey = 'p_last_' + t.id;
                    var lastPraise = state.notified[lastPraiseKey] || 0;
                    var milestone = Math.floor(elapsedDays / praiseInterval) * praiseInterval;
                    if (milestone > lastPraise && milestone > 0) {
                        state.notified[lastPraiseKey] = milestone;
                        changed = true;
                        notify(t, declension(milestone, ['день','дня','дней']) + '! Отличная работа!', 'success');
                    }
                }
            }
        }
        if (changed) saveNotified();
    }
    function checkRecurring(now) {
        var changed = false;
        for (var i = 0; i < state.timers.length; i++) {
            var t = state.timers[i];
            if (!t.recurring || t.type !== 'countdown') continue;
            var guard = 0;
            while (now.getTime() > t.date && guard < 500) {
                var d = new Date(t.date);
                if (t.recurring === 'weekly') d.setDate(d.getDate() + 7);
                else if (t.recurring === 'monthly') {
                    var day = t.originalDay || d.getDate();
                    d.setDate(1);
                    d.setMonth(d.getMonth() + 1);
                    d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
                } else if (t.recurring === 'yearly') d.setFullYear(d.getFullYear() + 1);
                else break;
                t.date = d.getTime();
                changed = true;
                guard++;
            }
        }
        if (changed) { saveTimers(); render(); }
    }

    // ===== Карточки =====
    function buildBadge(className, label) {
        return '<span class="badge ' + className + '">' + esc(label) + '</span>';
    }
    function buildCardBadges(t) {
        var parts = [];
        if (t.category && CAT_NAMES[t.category]) parts.push(buildBadge('cat-tag ' + t.category, CAT_NAMES[t.category]));
        if (t.recurring && REC_NAMES[t.recurring]) parts.push(buildBadge('recurring-badge', REC_NAMES[t.recurring]));
        if (isDnd(t.id)) parts.push(buildBadge('dnd-badge', '🔇 Тихо'));
        parts.push(buildBadge('tc-type ' + (t.type === 'elapsed' ? 'elapsed' : 'countdown'), t.type === 'elapsed' ? 'Прошло' : 'Осталось'));
        return parts.join('');
    }
    function createTimerCard(t) {
        var card = document.createElement('div');
        card.className = 'tc-card' + (isDnd(t.id) ? ' muted' : '');
        card.dataset.id = t.id;
        card.setAttribute('role', 'listitem');
        card.setAttribute('draggable', 'true');
        card.innerHTML =
            '<div class="tc-swipe-actions">' +
                '<button class="tc-swipe-edit" data-id="' + t.id + '" aria-label="Редактировать">' + ICONS.edit + 'Изменить</button>' +
                '<button class="tc-swipe-delete" data-id="' + t.id + '" aria-label="Удалить">' + ICONS.trash + 'Удалить</button>' +
            '</div>' +
            '<div class="tc-swipe-content">' +
                '<div class="tc-handle" aria-label="Перетащить" title="Перетащить">' + ICONS.drag + '</div>' +
                '<div class="tc-body">' +
                    '<div class="tc-row-top">' +
                        '<div class="tc-title">' + esc(t.title) + '</div>' +
                        '<div class="tc-actions">' +
                            '<button class="ibtn-s mute' + (isDnd(t.id) ? ' active' : '') + '" data-id="' + t.id + '" title="Не беспокоить">' + (isDnd(t.id) ? ICONS.mute : ICONS.bell) + '</button>' +
                            '<button class="ibtn-s ed" data-id="' + t.id + '" title="Редактировать">' + ICONS.edit + '</button>' +
                            '<button class="ibtn-s dl" data-id="' + t.id + '" title="Удалить">' + ICONS.trash + '</button>' +
                            '<button class="ibtn-s dup" data-id="' + t.id + '" title="Дублировать">' + ICONS.duplicate + '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="tc-badges">' + buildCardBadges(t) + '</div>' +
                    '<div class="tc-counter"><div class="tc-counter-val" data-ts="' + t.date + '" data-type="' + t.type + '" style="color:' + t.color + '" aria-live="polite" aria-atomic="true"></div></div>' +
                    '<div class="tc-date">' + ICONS.calendarPicker + formatDate(t.date) + '</div>' +
                '</div>' +
            '</div>';
        return card;
    }
    function updateCardCounter(card) {
        var c = card.querySelector('.tc-counter-val');
        if (!c) return;
        var ts = parseInt(c.dataset.ts);
        if (ts) c.textContent = fmtCounter(ts, c.dataset.type);
    }
    function observeCard(card) { if (intersectionObserver) intersectionObserver.observe(card); }

    // ===== Рендер =====
    function getFiltered() {
        var f = state.timers.slice();
        if (state.filter !== 'all') f = f.filter(function(x) { return x.type === state.filter; });
        if (state.categoryFilter !== 'all') {
            f = state.categoryFilter === ''
                ? f.filter(function(x) { return !x.category; })
                : f.filter(function(x) { return x.category === state.categoryFilter; });
        }
        if (state.searchQuery) {
            var q = state.searchQuery.toLowerCase();
            f = f.filter(function(x) { return x.title.toLowerCase().indexOf(q) !== -1; });
        }
        if (state.sortBy === 'name') f.sort(function(a,b) { return a.title.localeCompare(b.title, 'ru'); });
        else if (state.sortBy === 'date') f.sort(function(a,b) { return a.date - b.date; });
        else if (state.sortBy === 'created') f.sort(function(a,b) { return (b.created||0) - (a.created||0); });
        return f;
    }
    function updateProgressBar(filtered) {
        if (!el.progressBarWrap) return;
        var now = Date.now();
        var countdowns = filtered.filter(function(t) { return t.type === 'countdown' && t.date > now; });
        if (!countdowns.length) { el.progressBarWrap.style.display = 'none'; return; }
        var nearest = countdowns.reduce(function(a,b) { return a.date < b.date ? a : b; });
        var daysLeft = Math.ceil((nearest.date - now) / DAY_MS);
        var progress = Math.min(100, Math.max(0, (1 - daysLeft / 365) * 100));
        el.progressBarWrap.style.display = 'block';
        el.progressLabel.textContent = 'До «' + nearest.title + '» ' + declension(daysLeft, ['день','дня','дней']);
        el.progressFill.style.width = progress + '%';
    }
    function setEmptyState(kind) {
        var h = $('emptyTitle');
        var p = $('emptyBody');
        var b = $('emptyBtn');
        if (kind === 'noResults') {
            h.textContent = TEXTS.noResultsTitle;
            p.textContent = TEXTS.noResultsBody;
            b.textContent = TEXTS.noResultsBtn;
            b.onclick = resetFilters;
        } else {
            h.textContent = TEXTS.emptyTitle;
            p.textContent = TEXTS.emptyBody;
            b.textContent = TEXTS.emptyBtn;
            b.onclick = openModal;
        }
    }
    function resetFilters() {
        state.filter = 'all';
        state.categoryFilter = 'all';
        state.searchQuery = '';
        if (el.searchInput) el.searchInput.value = '';
        if (el.searchClear) el.searchClear.classList.add('hidden');
        saveSettings();
        render();
    }
    function render() {
        var filtered = getFiltered();
        updateFilterButtonState();
        updateProgressBar(filtered);
        if (intersectionObserver) { intersectionObserver.disconnect(); visibleCards.clear(); }

        if (filtered.length === 0) {
            el.timerList.innerHTML = '';
            el.empty.classList.remove('hidden');
            if (el.heroCta) el.heroCta.style.display = '';
            var isFiltered = state.filter !== 'all' || state.categoryFilter !== 'all' || state.searchQuery;
            setEmptyState(isFiltered ? 'noResults' : 'empty');
            return;
        }
        el.empty.classList.add('hidden');
        if (el.heroCta) el.heroCta.style.display = 'none';
        el.timerList.innerHTML = '';
        if (state.groupByCategory && state.sortBy === 'order' && filtered.length > 1) {
            renderGrouped(filtered);
        } else {
            renderFlat(filtered);
        }
        var cards = el.timerList.querySelectorAll('.tc-card');
        for (var i = 0; i < cards.length; i++) {
            observeCard(cards[i]);
            if (state.firstRenderDone) cards[i].classList.add('no-anim');
            updateCardCounter(cards[i]);
        }
        state.firstRenderDone = true;
    }
    function renderFlat(filtered) {
        var frag = document.createDocumentFragment();
        for (var i = 0; i < filtered.length; i++) frag.appendChild(createTimerCard(filtered[i]));
        el.timerList.appendChild(frag);
    }
    function renderGrouped(filtered) {
        var groups = {};
        filtered.forEach(function(t) {
            var c = t.category || '_none';
            if (!groups[c]) groups[c] = [];
            groups[c].push(t);
        });
        var cats = Object.keys(groups).sort(function(a,b) {
            if (a === '_none') return 1;
            if (b === '_none') return -1;
            return a.localeCompare(b);
        });
        cats.forEach(function(cat) {
            var items = groups[cat];
            var catName = cat === '_none' ? 'Без категории' : (CAT_NAMES[cat] || cat);
            var isOpen = state._categoriesOpen[cat] !== false;
            var gEl = document.createElement('div');
            gEl.className = 'category-group';
            var hdr = document.createElement('div');
            hdr.className = 'category-header';
            hdr.innerHTML = '<span class="cat-name">' + esc(catName) + '</span>' +
                '<span class="cat-count">' + items.length + '</span>' +
                '<span class="cat-toggle' + (isOpen ? ' open' : '') + '">▶</span>';
            var body = document.createElement('div');
            body.className = 'category-body' + (isOpen ? ' open' : '');
            items.forEach(function(t) { body.appendChild(createTimerCard(t)); });
            hdr.addEventListener('click', function() {
                var tg = hdr.querySelector('.cat-toggle');
                var o = tg.classList.toggle('open');
                body.classList.toggle('open', o);
                state._categoriesOpen[cat] = o;
            });
            gEl.appendChild(hdr);
            gEl.appendChild(body);
            el.timerList.appendChild(gEl);
        });
    }
    function updateFilterButtonState() {
        if (!el.filterBtn) return;
        var active = state.filter !== 'all' || state.categoryFilter !== 'all';
        el.filterBtn.classList.toggle('active', active);
        el.filterBtn.style.color = active ? 'var(--bl)' : '';
    }

    // ===== Модалки =====
    function lockBody() { document.body.classList.add('modal-open'); }
    function unlockBody() {
        if (!state._modalStack.length) document.body.classList.remove('modal-open');
    }
    function openModalById(id) {
        var m = $(id);
        if (!m) return;
        state._lastFocus = document.activeElement;
        state._modalStack.push(id);
        history.pushState({ modal: true }, '');
        m.classList.add('show');
        lockBody();
        trapFocus(m);
    }
    function closeTopModal(fromHistory) {
        var id = state._modalStack.pop();
        if (!id) return;
        var m = $(id);
        if (m) {
            m.classList.remove('show');
            if (id === MODAL.TIMER) {
                var hp = $('hslPopup');
                if (hp) hp.classList.remove('show');
            }
        }
        var nextId = state._modalStack[state._modalStack.length - 1];
        if (nextId) {
            trapFocus($(nextId));
        } else {
            releaseFocus();
            unlockBody();
            if (state._lastFocus) state._lastFocus.focus();
            if (!fromHistory && history.state && history.state.modal) history.back();
        }
    }
    function closeAllModals() {
        while (state._modalStack.length) {
            var id = state._modalStack.pop();
            var m = $(id);
            if (m) m.classList.remove('show');
        }
        releaseFocus();
        unlockBody();
    }
    function trapFocus(container) {
        releaseFocus();
        if (!container) return;
        var focusable = container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0], last = focusable[focusable.length-1];
        state._focusTrap = function(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener('keydown', state._focusTrap);
        var main = document.querySelector('main');
        if (main) main.setAttribute('inert', '');
    }
    function releaseFocus() {
        if (state._focusTrap) {
            document.removeEventListener('keydown', state._focusTrap);
            state._focusTrap = null;
        }
        var main = document.querySelector('main');
        if (main) main.removeAttribute('inert');
    }
    function openModal() {
        el.timerTitle.classList.remove('error');
        el.timerDate.classList.remove('error');
        state.editId = null;
        el.mTitle.textContent = 'Новый счётчик';
        el.timerTitle.value = '';
        el.timerDate.value = '';
        if (el.timerType) el.timerType.value = 'elapsed';
        if (el.timerCategory) el.timerCategory.value = '';
        if (el.timerRecurring) el.timerRecurring.value = '';
        if (el.timerReminder) el.timerReminder.checked = false;
        el.titleCnt.textContent = '0/' + MAX_TITLE;
        selectColor(DEFAULT_COLOR);
        if (el.saveMoreRow) el.saveMoreRow.style.display = '';
        openModalById(MODAL.TIMER);
        setTimeout(function() { el.timerTitle.focus(); }, 100);
    }
    function openSettings() { openModalById(MODAL.SETTINGS); }
    function openFilterModal() {
        if (el.sortSelect) el.sortSelect.value = state.sortBy;
        if (el.catSelect) el.catSelect.value = state.categoryFilter;
        var fs = $('fSelect'); if (fs) fs.value = state.filter;
        openModalById(MODAL.FILTER);
    }
    function showConfirm(title, msg, okText, cb) {
        $('confirmTitle').textContent = title;
        $('confirmMsg').textContent = msg;
        $('confirmOk').textContent = okText || 'Удалить';
        openModalById(MODAL.CONFIRM);
        $('confirmOk').onclick = function() { closeTopModal(); cb(); };
        $('confirmCancel').onclick = function() { closeTopModal(); };
    }

    // ===== CRUD =====
    function validateAndParseDate(dateVal) {
        if (!dateVal) return { error: TEXTS.enterDate };
        var ts = new Date(dateVal).getTime();
        if (isNaN(ts)) return { error: TEXTS.invalidDate };
        return { ts: ts };
    }
    function saveTimer(more) {
        var title = el.timerTitle.value.trim();
        if (!title) {
            el.timerTitle.classList.add('error');
            toast.error(TEXTS.enterTitle);
            setTimeout(function() { el.timerTitle.classList.remove('error'); }, 500);
            return;
        }
        var parsed = validateAndParseDate(el.timerDate.value);
        if (parsed.error) {
            el.timerDate.classList.add('error');
            toast.error(parsed.error);
            setTimeout(function() { el.timerDate.classList.remove('error'); }, 500);
            return;
        }
        var data = {
            title: title, date: parsed.ts,
            type: el.timerType ? el.timerType.value : 'elapsed',
            color: state.selectedColor,
            category: el.timerCategory ? el.timerCategory.value : '',
            recurring: el.timerRecurring ? el.timerRecurring.value : '',
            reminder: el.timerReminder ? el.timerReminder.checked : false,
            originalDay: new Date(el.timerDate.value).getDate()
        };
        if (state.editId) {
            var idx = state.timers.findIndex(function(x) { return x.id === state.editId; });
            if (idx !== -1) Object.assign(state.timers[idx], data);
            toast.info(TEXTS.updated);
        } else {
            data.id = genId();
            data.created = Date.now();
            state.timers.push(data);
            toast.success(TEXTS.added);
        }
        haptic('success');
        saveTimers();
        if (more && !state.editId) {
            el.timerTitle.value = '';
            el.timerDate.value = '';
            el.titleCnt.textContent = '0/' + MAX_TITLE;
            selectColor(DEFAULT_COLOR);
            setTimeout(function() { el.timerTitle.focus(); }, 100);
        } else {
            closeTopModal();
        }
        render();
    }
    function editTimer(id) {
        var t = state.timers.find(function(x) { return x.id === id; });
        if (!t) return;
        state.editId = id;
        el.mTitle.textContent = 'Редактировать';
        el.timerTitle.value = t.title;
        el.timerDate.value = localISO(new Date(t.date));
        if (el.timerType) el.timerType.value = t.type || 'elapsed';
        if (el.timerCategory) el.timerCategory.value = t.category || '';
        if (el.timerRecurring) el.timerRecurring.value = t.recurring || '';
        if (el.timerReminder) el.timerReminder.checked = !!t.reminder;
        el.titleCnt.textContent = t.title.length + '/' + MAX_TITLE;
        selectColor(t.color || DEFAULT_COLOR);
        if (el.saveMoreRow) el.saveMoreRow.style.display = 'none';
        openModalById(MODAL.TIMER);
        setTimeout(function() { el.timerTitle.focus(); }, 100);
    }
    function delTimer(id) {
        haptic('medium');
        var idx = state.timers.findIndex(function(x) { return x.id === id; });
        if (idx === -1) return;
        var timer = state.timers[idx];
        state.timers.splice(idx, 1);
        delete state.notified[id];
        delete state.notified[id + '_done'];
        delete state.notified['p_last_' + id];
        delete state.dnd[id];
        saveNotified(); saveDnd();
        state._undoData = { timer: timer };
        var card = el.timerList.querySelector('.tc-card[data-id="' + id + '"]');
        if (card && intersectionObserver) { intersectionObserver.unobserve(card); visibleCards.delete(card); }
        if (card) {
            card.classList.add('removing');
            setTimeout(function() { saveTimers(); render(); showUndo(); }, 300);
        } else { saveTimers(); render(); showUndo(); }
    }
    function showUndo() {
        var t = $('undoToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'undoToast';
            t.className = 'toast undo-toast';
            t.innerHTML = '<span>' + TEXTS.deleted + '</span><button class="undo-btn" id="undoBtn">Отменить</button>';
            document.body.appendChild(t);
            $('undoBtn').onclick = undo;
        }
        clearTimeout(state._undoTimer);
        t.classList.add('show');
        state._undoTimer = setTimeout(function() {
            t.classList.remove('show');
            state._undoData = null;
        }, 5000);
    }
    function undo() {
        if (!state._undoData) return;
        var i = state.timers.findIndex(function(x) { return x.id === state._undoData.timer.id; });
        if (i !== -1) state.timers[i] = state._undoData.timer;
        else state.timers.push(state._undoData.timer);
        state._undoData = null;
        clearTimeout(state._undoTimer);
        var t = $('undoToast'); if (t) t.classList.remove('show');
        saveTimers(); render();
        haptic('light');
        toast.success(TEXTS.restored);
    }
    function duplicateTimer(id) {
        var orig = state.timers.find(function(x) { return x.id === id; });
        if (!orig) return;
        var copy = JSON.parse(JSON.stringify(orig));
        copy.id = genId();
        copy.title = orig.title + ' (копия)';
        copy.created = Date.now();
        state.timers.push(copy);
        saveTimers(); render();
        toast.success(TEXTS.duplicated);
        haptic('success');
    }
    function reorderTimers(srcId, targetId, insertBefore) {
        var si = state.timers.findIndex(function(x) { return x.id === srcId; });
        var ti = state.timers.findIndex(function(x) { return x.id === targetId; });
        if (si === -1 || ti === -1 || si === ti) return;
        var m = state.timers.splice(si, 1)[0];
        ti = state.timers.findIndex(function(x) { return x.id === targetId; });
        if (insertBefore) state.timers.splice(ti, 0, m);
        else state.timers.splice(ti + 1, 0, m);
        saveTimers(); render();
    }

    // ===== Экспорт / импорт =====
    function download(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    }
    function exportJSON() {
        if (!state.timers.length) { toast.error(TEXTS.noData); return; }
        var payload = {
            version: (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1.0'),
            exported: new Date().toISOString(),
            timers: state.timers,
            settings: state.settings
        };
        download(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
                 'chronoflow-' + new Date().toISOString().slice(0,10) + '.json');
        haptic('success'); toast.success(TEXTS.exported);
    }
    function exportICS() {
        if (!state.timers.length) { toast.error(TEXTS.noData); return; }
        var ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ChronoFlow//RU','CALSCALE:GREGORIAN'];
        state.timers.forEach(function(t) {
            var dt = new Date(t.date).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
            ics.push('BEGIN:VEVENT');
            ics.push('UID:' + t.id + '@chronoflow');
            ics.push('DTSTAMP:' + dt);
            ics.push('DTSTART:' + dt);
            ics.push('SUMMARY:' + t.title.replace(/[\\;,]/g, '\\$&'));
            if (t.category) ics.push('CATEGORIES:' + (CAT_NAMES[t.category] || t.category));
            ics.push('END:VEVENT');
        });
        ics.push('END:VCALENDAR');
        download(new Blob([ics.join('\r\n')], { type: 'text/calendar' }), 'chronoflow-events.ics');
        haptic('success'); toast.success(TEXTS.icsExported);
    }
    function exportImage() {
        var card = el.timerList.querySelector('.tc-card');
        if (!card) { toast.error(TEXTS.noTimers); return; }
        var cvs = document.createElement('canvas');
        cvs.width = 800; cvs.height = 600;
        var c = cvs.getContext('2d');
        c.fillStyle = '#000'; c.fillRect(0,0,800,600);
        var grad = c.createLinearGradient(0,0,800,600);
        grad.addColorStop(0, '#0a84ff'); grad.addColorStop(1, '#5e5ce6');
        c.fillStyle = grad; c.globalAlpha = 0.15; c.fillRect(0,0,800,600);
        c.globalAlpha = 1;
        c.fillStyle = '#fff';
        c.font = '700 36px -apple-system, sans-serif';
        c.textAlign = 'center';
        c.fillText('ChronoFlow', 400, 60);
        c.font = '400 16px -apple-system, sans-serif';
        c.fillStyle = 'rgba(255,255,255,0.6)';
        c.fillText(new Date().toLocaleDateString('ru-RU', { year:'numeric', month:'long', day:'numeric' }), 400, 90);
        var items = el.timerList.querySelectorAll('.tc-card');
        var y = 130;
        var count = Math.min(items.length, 8);
        for (var i = 0; i < count; i++) {
            var val = items[i].querySelector('.tc-counter-val');
            var titleEl = items[i].querySelector('.tc-title');
            var typeEl = items[i].querySelector('.tc-type');
            if (!val || !titleEl) continue;
            c.fillStyle = 'rgba(255,255,255,0.08)';
            c.beginPath(); c.roundRect(40, y, 720, 50, 12); c.fill();
            c.fillStyle = '#fff';
            c.font = '600 15px -apple-system, sans-serif';
            c.textAlign = 'left';
            c.fillText(titleEl.textContent, 60, y + 22);
            c.fillStyle = val.style.color || '#fff';
            c.font = '300 18px monospace';
            c.textAlign = 'right';
            c.fillText(val.textContent, 740, y + 28);
            if (typeEl) {
                c.fillStyle = 'rgba(255,255,255,0.4)';
                c.font = '600 10px -apple-system, sans-serif';
                c.fillText(typeEl.textContent, 740, y + 44);
            }
            y += 58;
        }
        if (items.length > 8) {
            c.fillStyle = 'rgba(255,255,255,0.3)';
            c.font = '12px -apple-system, sans-serif';
            c.textAlign = 'right';
            c.fillText('и ещё ' + (items.length - 8), 760, y + 10);
        }
        cvs.toBlob(function(blob) {
            download(blob, 'chronoflow-' + new Date().toISOString().slice(0,10) + '.png');
            haptic('success'); toast.success(TEXTS.imageSaved);
        });
    }
    function isValidTimer(obj) {
        if (!obj || typeof obj !== 'object') return false;
        if (typeof obj.title !== 'string' || !obj.title.trim()) return false;
        if (obj.title.length > MAX_TITLE * 4) return false;
        if (typeof obj.date !== 'number' || isNaN(obj.date)) return false;
        if (typeof obj.id !== 'string' || !obj.id.trim()) return false;
        if (obj.color && !/^#[0-9a-fA-F]{6}$/.test(obj.color)) return false;
        if (obj.recurring && ['weekly','monthly','yearly',''].indexOf(obj.recurring) === -1) return false;
        if (obj.reminder !== undefined && typeof obj.reminder !== 'boolean') return false;
        return true;
    }
    function handleImport(e) {
        var f = e.target.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            try {
                var data = JSON.parse(ev.target.result);
                var incoming = Array.isArray(data) ? data : (data.timers || []);
                var incomingSettings = Array.isArray(data) ? null : data.settings;
                var valid = incoming.filter(isValidTimer);
                if (!valid.length) throw new Error('Нет валидных записей');
                showConfirm('Импорт', 'Импортировать ' + valid.length + ' счётчиков?', 'Импортировать', function() {
                    var ids = {};
                    state.timers.forEach(function(x) { ids[x.id] = true; });
                    var newT = valid.filter(function(x) { return !ids[x.id]; });
                    state.timers = state.timers.concat(newT);
                    saveTimers();
                    if (incomingSettings) {
                        state.settings = Object.assign({}, state.settings, incomingSettings);
                        storage.set(STORAGE.SETTINGS, state.settings);
                        loadSettings();
                    }
                    render();
                    haptic('success');
                    var msg = 'Импортировано ' + newT.length;
                    var skipped = valid.length - newT.length;
                    if (skipped > 0) msg += ', пропущено дублей: ' + skipped;
                    toast.success(msg);
                });
            } catch (err) {
                var msg = TEXTS.importError;
                msg += (err instanceof SyntaxError) ? 'неверный формат JSON' : (err.message || 'неизвестная ошибка');
                toast.error(msg);
            }
        };
        reader.readAsText(f);
        e.target.value = '';
    }

    // ===== Цвет =====
    function hslToHex(h,s,l) {
        s/=100; l/=100;
        var a = s * Math.min(l, 1-l);
        function f(n) {
            var k = (n + h/30) % 12;
            var color = l - a * Math.max(Math.min(k-3, 9-k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2,'0');
        }
        return '#' + f(0) + f(8) + f(4);
    }
    function hexToHsl(hex) {
        var r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
        var max = Math.max(r,g,b), min = Math.min(r,g,b);
        var h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
            else if (max === g) h = ((b - r) / d + 2) * 60;
            else h = ((r - g) / d + 4) * 60;
        }
        return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    function selectColor(c) {
        state.selectedColor = c;
        var all = document.querySelectorAll('.cp');
        var matched = false;
        for (var i = 0; i < all.length; i++) {
            var isMatch = all[i].dataset.c === c;
            all[i].classList.toggle('active', isMatch);
            if (isMatch) matched = true;
        }
        var cb = $('customColorBtn');
        if (!matched && cb) {
            for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
            cb.classList.add('active');
            cb.style.setProperty('--c', c);
            cb.style.background = c;
        } else if (cb) {
            cb.classList.remove('active');
            cb.style.background = '';
            cb.style.removeProperty('--c');
        }
    }
    function autoDetectType() {
        if (!el.timerDate || !el.timerType) return;
        var v = el.timerDate.value; if (!v) return;
        el.timerType.value = new Date(v).getTime() < Date.now() ? 'elapsed' : 'countdown';
    }

    // ===== Жесты =====
    function initCardSwipe() {
        if (!el.timerList) return;
        var active = null, startX = 0, startY = 0, isHor = false;
        function reset(card) {
            if (!card) return;
            var c = card.querySelector('.tc-swipe-content');
            if (c) { c.classList.remove('swiping'); c.style.transform = ''; }
            if (active === card) active = null;
        }
        el.timerList.addEventListener('touchstart', function(e) {
            if (!isTouch) return;
            var content = e.target.closest('.tc-swipe-content');
            if (!content) return;
            var card = content.closest('.tc-card');
            if (!card) return;
            if (e.target.closest('.tc-handle, .tc-actions button, .tc-swipe-actions button')) return;
            if (active && active !== card) reset(active);
            startX = e.touches[0].clientX; startY = e.touches[0].clientY;
            isHor = false; active = card;
        }, { passive: true });
        el.timerList.addEventListener('touchmove', function(e) {
            if (!isTouch || !active) return;
            var dx = e.touches[0].clientX - startX;
            var dy = e.touches[0].clientY - startY;
            if (!isHor) {
                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                    if (Math.abs(dx) > Math.abs(dy)) isHor = true;
                    else { active = null; return; }
                } else return;
            }
            e.preventDefault();
            var content = active.querySelector('.tc-swipe-content');
            if (!content) return;
            var offset = Math.min(0, Math.max(-144, dx));
            content.classList.add('swiping');
            content.style.transform = 'translateX(' + offset + 'px)';
        }, { passive: false });
        el.timerList.addEventListener('touchend', function() {
            if (!isTouch || !active) return;
            var content = active.querySelector('.tc-swipe-content');
            if (!content) { active = null; return; }
            content.classList.remove('swiping');
            var m = content.style.transform.match(/translateX\((-?[\d.]+)px\)/);
            var dx = m ? parseFloat(m[1]) : 0;
            if (dx < -100) content.style.transform = 'translateX(-144px)';
            else { content.style.transform = ''; active = null; }
        }, { passive: true });
        el.timerList.addEventListener('touchcancel', function() {
            if (active) { reset(active); active = null; }
        }, { passive: true });
        document.addEventListener('touchstart', function(e) {
            if (!active) return;
            if (!e.target.closest('.tc-card')) { reset(active); active = null; }
        }, { passive: true });
        el.timerList.addEventListener('click', function(e) {
            var eb = e.target.closest('.tc-swipe-edit');
            var db = e.target.closest('.tc-swipe-delete');
            if (eb) { var c1 = eb.closest('.tc-card'); if (c1) reset(c1); haptic('light'); editTimer(eb.dataset.id); }
            else if (db) { var c2 = db.closest('.tc-card'); if (c2) reset(c2); delTimer(db.dataset.id); }
        });
    }
    function initPullToRefresh() {
        if (!el.scrollPage || !isTouch) return;
        var ind = $('pullIndicator');
        if (!ind) return;
        var startY = 0, pulling = false;
        el.scrollPage.addEventListener('touchstart', function(e) {
            if (el.scrollPage.scrollTop <= 0) { startY = e.touches[0].clientY; pulling = true; }
        }, { passive: true });
        el.scrollPage.addEventListener('touchmove', function(e) {
            if (!pulling) return;
            var dy = e.touches[0].clientY - startY;
            if (dy > 10 && el.scrollPage.scrollTop <= 0) {
                var p = Math.min(1, dy / 80);
                ind.style.height = Math.min(56, dy * 0.6) + 'px';
                ind.style.opacity = p;
                ind.classList.add('active');
                var s = ind.querySelector('svg');
                if (s) s.style.transform = 'rotate(' + (p * 180) + 'deg)';
            }
        }, { passive: true });
        el.scrollPage.addEventListener('touchend', function() {
            if (!pulling) return;
            pulling = false;
            var h = parseFloat(ind.style.height) || 0;
            if (h >= 40) {
                haptic('medium');
                ind.classList.add('refreshing');
                ind.style.height = '56px'; ind.style.opacity = '1';
                var s = ind.querySelector('svg');
                if (s) s.style.transform = '';
                setTimeout(function() {
                    render();
                    ind.classList.remove('active', 'refreshing');
                    ind.style.height = ''; ind.style.opacity = '';
                    toast.info(TEXTS.refreshed);
                }, 600);
            } else {
                ind.classList.remove('active');
                ind.style.height = ''; ind.style.opacity = '';
            }
        });
        el.scrollPage.addEventListener('touchcancel', function() {
            pulling = false;
            ind.classList.remove('active');
            ind.style.height = ''; ind.style.opacity = '';
        });
    }
    function initModalSwipe() {
        if (!isTouch) return;
        document.querySelectorAll('.modal').forEach(function(modal) {
            var mc = modal.querySelector('.mc');
            var h = modal.querySelector('.mc-handle');
            if (!mc || !h) return;
            var sy = 0, sw = false;
            h.addEventListener('touchstart', function(e) { sy = e.touches[0].clientY; sw = true; mc.classList.add('swiping'); }, { passive: true });
            h.addEventListener('touchmove', function(e) {
                if (!sw) return;
                var dy = e.touches[0].clientY - sy;
                if (dy > 0) {
                    e.preventDefault();
                    mc.style.transform = 'translateY(' + dy + 'px)';
                    modal.style.opacity = Math.max(0, 1 - dy / 300);
                }
            }, { passive: false });
            h.addEventListener('touchend', function() {
                if (!sw) return;
                sw = false;
                mc.classList.remove('swiping');
                var m = mc.style.transform.match(/translateY\(([\d.]+)px\)/);
                var dy = m ? parseFloat(m[1]) : 0;
                if (dy > 120) {
                    haptic('medium');
                    closeTopModal();
                }
                mc.style.transform = ''; modal.style.opacity = '';
            });
            h.addEventListener('touchcancel', function() {
                sw = false; mc.classList.remove('swiping');
                mc.style.transform = ''; modal.style.opacity = '';
            });
        });
    }
    function clearDragIndicators() {
        var cards = el.timerList ? el.timerList.querySelectorAll('.tc-card') : [];
        for (var i = 0; i < cards.length; i++) cards[i].classList.remove('drag-over-top','drag-over-bottom');
    }
    function initDrag() {
        if (!el.timerList) return;
        el.timerList.addEventListener('dragstart', function(e) {
            var h = e.target.closest('.tc-handle');
            if (!h) { e.preventDefault(); return; }
            var card = h.closest('.tc-card');
            if (!card) return;
            state._dragSrcId = card.dataset.id;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.dataset.id);
        });
        el.timerList.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            var card = e.target.closest('.tc-card');
            if (!card || card.dataset.id === state._dragSrcId) return;
            clearDragIndicators();
            var r = card.getBoundingClientRect();
            card.classList.add(e.clientY < r.top + r.height/2 ? 'drag-over-top' : 'drag-over-bottom');
        });
        el.timerList.addEventListener('dragleave', function(e) {
            var card = e.target.closest('.tc-card');
            if (card) card.classList.remove('drag-over-top','drag-over-bottom');
        });
        el.timerList.addEventListener('drop', function(e) {
            e.preventDefault();
            var target = e.target.closest('.tc-card');
            if (!target || !state._dragSrcId || target.dataset.id === state._dragSrcId) return;
            var r = target.getBoundingClientRect();
            reorderTimers(state._dragSrcId, target.dataset.id, e.clientY < r.top + r.height/2);
            clearDragIndicators();
        });
        el.timerList.addEventListener('dragend', function() {
            state._dragSrcId = null;
            clearDragIndicators();
        });
        if (isTouch) {
            var timer = null, card = null, clone = null, active = false, lsX = 0, lsY = 0;
            el.timerList.addEventListener('touchstart', function(e) {
                var h = e.target.closest('.tc-handle');
                if (!h) return;
                var c = h.closest('.tc-card');
                if (!c) return;
                var t = e.touches[0];
                lsX = t.clientX; lsY = t.clientY;
                card = c; active = false;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    active = true;
                    clone = c.cloneNode(true);
                    clone.className = 'tc-card touch-clone';
                    clone.style.cssText = 'position:fixed;z-index:5000;pointer-events:none;width:' + c.offsetWidth + 'px;opacity:.85;transform:rotate(2deg);';
                    clone.style.left = (t.clientX - clone.offsetWidth/2) + 'px';
                    clone.style.top = (t.clientY - 20) + 'px';
                    document.body.appendChild(clone);
                    c.classList.add('dragging');
                    haptic('medium');
                }, 350);
            }, { passive: true });
            el.timerList.addEventListener('touchmove', function(e) {
                if (!card) return;
                var t = e.touches[0];
                var dx = t.clientX - lsX, dy = t.clientY - lsY;
                if (active) {
                    e.preventDefault();
                    if (clone) {
                        clone.style.left = (t.clientX - clone.offsetWidth/2) + 'px';
                        clone.style.top = (t.clientY - 20) + 'px';
                        clone.style.display = 'none';
                        var under = document.elementFromPoint(t.clientX, t.clientY);
                        clone.style.display = '';
                        var tc = under ? under.closest('.tc-card') : null;
                        clearDragIndicators();
                        if (tc && tc !== card) {
                            var r = tc.getBoundingClientRect();
                            tc.classList.add(t.clientY < r.top + r.height/2 ? 'drag-over-top' : 'drag-over-bottom');
                        }
                    }
                    return;
                }
                if (Math.abs(dx) > 12 || Math.abs(dy) > 12) { clearTimeout(timer); card = null; }
            }, { passive: false });
            el.timerList.addEventListener('touchend', function() {
                clearTimeout(timer);
                if (active) {
                    if (card) card.classList.remove('dragging');
                    if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
                    clone = null;
                    var over = el.timerList.querySelector('.drag-over-top, .drag-over-bottom');
                    if (over && card) reorderTimers(card.dataset.id, over.dataset.id, over.classList.contains('drag-over-top'));
                    clearDragIndicators();
                }
                active = false; card = null;
            });
            el.timerList.addEventListener('touchcancel', function() {
                clearTimeout(timer);
                if (active) {
                    if (card) card.classList.remove('dragging');
                    if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
                    clone = null;
                    clearDragIndicators();
                }
                active = false; card = null;
            });
        }
    }

    // ===== SVG =====
    function initClockSvg() {
        svg.ring = $('ringProgress');
        svg.dayRing = $('dayRingFill');
        svg.ringStop1 = document.querySelector('#ringGrad stop:first-child');
        svg.ringStop2 = document.querySelector('#ringGrad stop:last-child');
        svg.dayStop1 = document.querySelector('#dayRingGrad stop:first-child');
        svg.dayStop2 = document.querySelector('#dayRingGrad stop:last-child');
        svg.day = $('svgDay');
        svg.time = $('svgTime');
        svg.sec = $('svgSec');
        svg.date = $('svgDate');
        svg.st = $('svgSt');
        if (svg.ring) { svg.ring.style.strokeDasharray = SEC_RING_CIRC; svg.ring.style.strokeDashoffset = SEC_RING_CIRC; }
        if (svg.dayRing) { svg.dayRing.style.strokeDasharray = DAY_RING_CIRC; svg.dayRing.style.strokeDashoffset = DAY_RING_CIRC; }
        var dots = $('dayDots');
        dots.innerHTML = '';
        svg.dayEls = [];
        for (var i = 0; i < 7; i++) {
            var a = (i * 2 * Math.PI / 7) - Math.PI / 2;
            var dot = document.createElementNS(SVG_NS, 'circle');
            dot.setAttribute('cx', 100 + 65 * Math.cos(a));
            dot.setAttribute('cy', 100 + 65 * Math.sin(a));
            dot.setAttribute('r', '3');
            dot.setAttribute('fill', COLORS[i]);
            dot.setAttribute('opacity', '0.15');
            dots.appendChild(dot);
            svg.dayEls.push(dot);
        }
        var ticks = $('svgTicks');
        ticks.innerHTML = '';
        for (var t = 0; t < 60; t++) {
            var an = (t * 2 * Math.PI / 60) - Math.PI / 2;
            var isMajor = t % 5 === 0, len = isMajor ? 5 : 2;
            var line = document.createElementNS(SVG_NS, 'line');
            line.setAttribute('x1', 100 + (88 - len) * Math.cos(an));
            line.setAttribute('y1', 100 + (88 - len) * Math.sin(an));
            line.setAttribute('x2', 100 + 88 * Math.cos(an));
            line.setAttribute('y2', 100 + 88 * Math.sin(an));
            line.setAttribute('stroke', isMajor ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)');
            line.setAttribute('stroke-width', isMajor ? '1' : '0.5');
            line.setAttribute('stroke-linecap', 'round');
            ticks.appendChild(line);
        }
        svg.ringBgs = document.querySelectorAll('.ring-bg');
    }
    function updateClockSvg() {
        var now = new Date();
        var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds(), ms = now.getMilliseconds();
        var dayIndex = relDay(now);
        var dayColor = COLORS[dayIndex];
        var isLight = document.body.classList.contains('lt');
        if (svg.ring) svg.ring.style.strokeDashoffset = SEC_RING_CIRC * (1 - (s + ms/1000)/60);
        if (svg.ringStop1) svg.ringStop1.setAttribute('stop-color', dayColor);
        if (svg.ringStop2) svg.ringStop2.setAttribute('stop-color', lightenHex(dayColor, 0.3));
        if (svg.dayRing) svg.dayRing.style.strokeDashoffset = DAY_RING_CIRC * (1 - (h*3600000 + m*60000 + s*1000 + ms)/DAY_MS);
        if (svg.dayStop1) svg.dayStop1.setAttribute('stop-color', dayColor);
        if (svg.dayStop2) svg.dayStop2.setAttribute('stop-color', lightenHex(dayColor, 0.25));
        if (svg.ringBgs) for (var r = 0; r < svg.ringBgs.length; r++) {
            svg.ringBgs[r].style.stroke = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
        }
        for (var i = 0; i < svg.dayEls.length; i++) {
            var act = i === dayIndex;
            svg.dayEls[i].setAttribute('r', act ? '4' : '2.5');
            svg.dayEls[i].setAttribute('opacity', act ? '1' : '0.2');
            svg.dayEls[i].style.filter = act ? 'url(#dotGlow)' : 'none';
        }
        if (svg.day) svg.day.textContent = DAYS_SHORT[dayIndex];
        if (svg.time) svg.time.textContent = pad(h) + ':' + pad(m);
        if (svg.sec) svg.sec.textContent = pad(s);
        if (svg.date) svg.date.textContent = now.getDate() + ' ' + MONTHS_SHORT[now.getMonth()];
        if (svg.st) {
            var w = dayIndex >= 5;
            var periods = w
                ? ['Выходной · Ночь','Выходной · Утро','Выходной · День','Выходной · Вечер']
                : ['Ночь','Утро','День','Вечер'];
            svg.st.textContent = periods[h < 6 ? 0 : h < 12 ? 1 : h < 18 ? 2 : 3];
        }
    }

    // ===== RAF =====
    function rafLoop(ts) {
        if (state._pageVisible) {
            if (ts - state.lastTick >= 500) {
                state.lastTick = ts;
                var now = new Date();
                var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
                if (el.hdrH) el.hdrH.textContent = pad(h);
                if (el.hdrM) el.hdrM.textContent = pad(m);
                if (el.hdrS) el.hdrS.textContent = pad(s);
                if (el.hdrDate && state.prevHour !== h) {
                    el.hdrDate.textContent = now.getDate() + ' ' + MONTHS_SHORT[now.getMonth()] + '.';
                }
                var dayIndex = relDay(now);
                if (state.prevDay !== dayIndex) {
                    state.prevDay = dayIndex;
                    checkRecurring(now);
                }
                state.prevHour = h;
                visibleCards.forEach(updateCardCounter);
                checkNotifications(now);
            }
            updateClockSvg();
        }
        state._rafId = requestAnimationFrame(rafLoop);
    }

    // ===== Скролл =====
    var _scroll = { raf: null, wrapH: 0, wrap: null };
    function handleScroll() {
        if (_scroll.raf) return;
        _scroll.raf = requestAnimationFrame(function() {
            _scroll.raf = null;
            if (!el.scrollPage || !el.hdrClock) return;
            var st = el.scrollPage.scrollTop;
            var totalH = _scroll.wrapH + 16;
            var p1 = Math.max(0, Math.min(1, st / (totalH * 0.6)));
            var e1 = p1 * p1 * (3 - 2 * p1);
            var hdrOp = Math.max(0, Math.min(1, (st - totalH * 0.3) / (totalH * 0.3)));
            el.hdrClock.style.opacity = hdrOp;
            el.hdrClock.style.transform = 'translateY(' + (1 - hdrOp) * -6 + 'px)';
            el.hdrClock.classList.toggle('show', hdrOp > 0.01);
            if (_scroll.wrap) {
                _scroll.wrap.style.transform = 'scale(' + (1 - e1 * 0.12) + ') translateY(' + (e1 * -10) + 'px)';
                _scroll.wrap.style.opacity = Math.max(0, 1 - e1 * 1.2);
            }
        });
    }
    function initScroll() {
        if (!el.scrollPage) return;
        _scroll.wrap = el.clockSection ? el.clockSection.querySelector('.clock-wrap') : null;
        requestAnimationFrame(function() { _scroll.wrapH = _scroll.wrap ? _scroll.wrap.scrollHeight : 300; });
        el.scrollPage.addEventListener('scroll', handleScroll, { passive: true });
        var rt = null;
        window.addEventListener('resize', function() {
            clearTimeout(rt);
            rt = setTimeout(function() {
                _scroll.wrapH = _scroll.wrap ? _scroll.wrap.scrollHeight : 300;
                handleScroll();
            }, 150);
        }, { passive: true });
    }

    // ===== Service Worker =====
    function initSW() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            reg.addEventListener('updatefound', function() {
                var nw = reg.installing;
                if (nw) nw.addEventListener('statechange', function() {
                    if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                        toast.info(TEXTS.updateAvailable);
                    }
                });
            });
        }).catch(function() {});
    }

    // ===== Changelog =====
    function loadChangelog() {
        fetch('./changelog.json', { cache: 'no-cache' })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var versions = Object.keys(data).sort().reverse();
                if (!versions.length) return;
                var v = versions[0], info = data[v];
                var tEl = $('changelogTitle'), lEl = $('changelogList');
                if (tEl) tEl.textContent = 'Версия ' + v + (info.title ? ' — ' + info.title : '');
                if (lEl && info.items) {
                    lEl.innerHTML = info.items.map(function(i) { return '<li>' + esc(i) + '</li>'; }).join('');
                }
            })
            .catch(function() {
                var l = $('changelogList');
                if (l) l.innerHTML = '<li>Версия ' + (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '2026.09.13.1') + '</li>';
            });
    }

    // ===== Иконки =====
    function injectIcons() {
        var map = {
            settingsBtn: 'settings', installBtn: 'install', addTimerBtn: 'plus',
            searchBtn: 'search', filterBtn: 'filter',
            datePickerBtn: 'calendarPicker', resetTimeBtn: 'clock',
            searchClear: 'searchClear', customColorBtn: 'colorPlus',
            exportImgBtn: 'image', addFirstBtn: 'plus'
        };
        Object.keys(map).forEach(function(id) {
            var btn = $(id);
            if (btn && !btn.innerHTML.trim()) btn.innerHTML = ICONS[map[id]];
        });
        document.querySelectorAll('[data-close-modal]').forEach(function(btn) {
            if (!btn.innerHTML.trim()) btn.innerHTML = ICONS.close;
        });
        var addBtn = $('addTimerBtn');
        if (addBtn && addBtn.textContent.indexOf('Добавить') === -1) addBtn.innerHTML = ICONS.plus + ' <span>Добавить</span>';
        var pi = $('pullIndicator');
        if (pi) pi.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M12 17V3M7 12l5 5 5-5"/></svg>';
        var sBtns = { exportBtn: 'exportDown', importBtn: 'importUp', clearBtn: 'trash', exportIcsBtn: 'calendar' };
        Object.keys(sBtns).forEach(function(id) {
            var btn = $(id);
            if (btn) btn.innerHTML = ICONS[sBtns[id]] + ' ' + esc(btn.textContent.trim());
        });
    }
    function renderTemplateButtons() {
        var container = document.querySelector('.tpl-grid');
        if (!container) return;
        container.innerHTML = '';
        Object.keys(TPL_DATA).forEach(function(key) {
            var btn = document.createElement('button');
            btn.className = 'tpl-btn';
            btn.dataset.tpl = key;
            btn.textContent = TPL_DATA[key].title;
            container.appendChild(btn);
        });
    }

    // ===== Инициализация элементов =====
function initElements() {
    svg.dayDots = $('dayDots');
    ['timerList','emptyState','timerModal','timerForm','timerTitle','timerDate',
     'timerType','mTitle','titleCnt','fModal','sModal','notif','importFile',
     'clockSection','addFirstBtn','saveMoreBtn','saveMoreRow','resetTimeBtn',
     'themeSel','animToggle','installBtn','timeAnnounce','offlineDot','splash',
     'scrollPage','confirmModal','datePickerBtn','hdrSub','hdrClock','hdrH','hdrM','hdrS','hdrDate',
     'searchInput','searchClear','searchBar','searchBtn','addTimerBtn','timerCategory',
     'timerRecurring','timerReminder','catSelect','sortSelect','filterBtn',
     'dateFormat','weekStart','groupToggle','notifEnabled','notifPeriod','praiseEnabled',
     'praiseInterval','progressBarWrap','progressLabel','progressFill','heroAddBtn','heroCta'
    ].forEach(function(k) { el[k] = $(k); });
    el.empty = el.emptyState;   // алиас — render() и setEmptyState() используют el.empty
}

    // ===== События =====
    function bindEvents() {
        document.addEventListener('click', function(e) {
            var cb = e.target.closest('[data-close-modal]');
            if (cb) { closeTopModal(); return; }
            var backdrop = e.target.closest('.modal.show');
            if (backdrop && !e.target.closest('.mc')) closeTopModal();
        });
        if (el.addFirstBtn) el.addFirstBtn.addEventListener('click', openModal);
        if (el.heroAddBtn) el.heroAddBtn.addEventListener('click', openModal);
        if (el.addTimerBtn) el.addTimerBtn.addEventListener('click', function() { haptic('light'); openModal(); });
        if (el.timerForm) el.timerForm.addEventListener('submit', function(e) { e.preventDefault(); saveTimer(false); });
        if (el.saveMoreBtn) el.saveMoreBtn.addEventListener('click', function() { saveTimer(true); });
        if (el.timerTitle) el.timerTitle.addEventListener('input', function() {
            var l = el.timerTitle.value.length;
            if (l > MAX_TITLE) el.timerTitle.value = el.timerTitle.value.slice(0, MAX_TITLE);
            el.titleCnt.textContent = Math.min(l, MAX_TITLE) + '/' + MAX_TITLE;
        });
        if (el.datePickerBtn) el.datePickerBtn.addEventListener('click', function() {
            showPickerFallback(el.timerDate);
        });
        if (el.resetTimeBtn) el.resetTimeBtn.addEventListener('click', function() {
            el.timerDate.value = localISO(new Date()); autoDetectType(); haptic('light');
        });
        if (el.timerDate) el.timerDate.addEventListener('change', autoDetectType);

        var cp = $('colorPick'), ccb = $('customColorBtn'), hp = $('hslPopup');
        var hH = $('hslH'), hS = $('hslS'), hL = $('hslL');
        var hHv = $('hslHVal'), hSv = $('hslSVal'), hLv = $('hslLVal');
        var hPrev = $('hslPreview'), hApply = $('hslApply');
        function updHsl() {
            var h = parseInt(hH.value), s = parseInt(hS.value), l = parseInt(hL.value);
            hHv.textContent = h; hSv.textContent = s; hLv.textContent = l;
            if (hPrev) hPrev.style.background = hslToHex(h,s,l);
        }
        [hH, hS, hL].forEach(function(input) { if (input) input.addEventListener('input', updHsl); });
        if (hApply) hApply.addEventListener('click', function() {
            selectColor(hslToHex(parseInt(hH.value), parseInt(hS.value), parseInt(hL.value)));
            hp.classList.remove('show'); haptic('light');
        });
        if (ccb) ccb.addEventListener('click', function() {
            var hsl = hexToHsl(state.selectedColor);
            hH.value = hsl.h; hS.value = hsl.s; hL.value = hsl.l;
            updHsl(); hp.classList.add('show');
        });
        if (cp) cp.addEventListener('click', function(e) {
            var b = e.target.closest('.cp');
            if (!b || b === ccb) return;
            selectColor(b.dataset.c);
        });

        if (el.filterBtn) el.filterBtn.addEventListener('click', openFilterModal);
        var applyFBtn = $('applyFBtn');
        if (applyFBtn) applyFBtn.addEventListener('click', function() {
            var fs = $('fSelect'); if (fs) state.filter = fs.value;
            if (el.sortSelect) state.sortBy = el.sortSelect.value;
            if (el.catSelect) state.categoryFilter = el.catSelect.value;
            saveSettings(); closeTopModal(); render();
        });
        var eib = $('exportImgBtn');
        if (eib) eib.addEventListener('click', function() { closeTopModal(); exportImage(); });

        if (el.searchBtn) el.searchBtn.addEventListener('click', function() {
            haptic('light');
            var o = el.searchBar.classList.toggle('open');
            el.searchBtn.classList.toggle('active', o);
            if (o) setTimeout(function() { el.searchInput.focus(); }, 200);
            else { el.searchInput.value = ''; state.searchQuery = ''; if (el.searchClear) el.searchClear.classList.add('hidden'); render(); }
        });
        if (el.searchInput) {
            el.searchInput.addEventListener('input', function() {
                state.searchQuery = this.value.trim();
                if (el.searchClear) el.searchClear.classList.toggle('hidden', !state.searchQuery);
                render();
            });
            el.searchInput.addEventListener('keydown', function(e) { if (e.key === 'Escape') el.searchBtn.click(); });
        }
        if (el.searchClear) el.searchClear.addEventListener('click', function() {
            el.searchInput.value = ''; state.searchQuery = ''; this.classList.add('hidden'); render();
        });
        if (el.catSelect) el.catSelect.addEventListener('change', function() { state.categoryFilter = el.catSelect.value; render(); });

        var clearBtn = $('clearBtn');
        if (clearBtn) clearBtn.addEventListener('click', function() {
            showConfirm('Очистить всё', 'Удалить все счётчики?', 'Удалить', function() {
                state.timers = []; state.notified = {}; state.dnd = {};
                saveNotified(); saveDnd(); saveTimers(); render();
                toast.info(TEXTS.cleared);
            });
        });
        var eb = $('exportBtn'); if (eb) eb.addEventListener('click', exportJSON);
        var ib = $('importBtn'); if (ib) ib.addEventListener('click', function() { el.importFile.click(); });
        var eics = $('exportIcsBtn'); if (eics) eics.addEventListener('click', exportICS);
        if (el.importFile) el.importFile.addEventListener('change', handleImport);

        if (el.themeSel) el.themeSel.addEventListener('change', function() { applyTheme(el.themeSel.value); saveSettings(); });
        if (el.animToggle) el.animToggle.addEventListener('change', function() { state.anims = el.animToggle.checked; applyAnimPref(); saveSettings(); });
        if (el.dateFormat) el.dateFormat.addEventListener('change', function() { saveSettings(); render(); });
        if (el.weekStart) el.weekStart.addEventListener('change', saveSettings);
        if (el.groupToggle) el.groupToggle.addEventListener('change', function() { saveSettings(); render(); });
        [el.notifEnabled, el.notifPeriod, el.praiseEnabled, el.praiseInterval].forEach(function(i) {
            if (i) i.addEventListener('change', saveSettings);
        });

        document.querySelectorAll('.sr:has(.sw)').forEach(function(row) {
            row.addEventListener('click', function(e) {
                if (e.target.closest('.sw') || e.target.tagName === 'INPUT') return;
                var inp = this.querySelector('.sw input');
                if (inp) {
                    inp.checked = !inp.checked;
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                    haptic('light');
                }
            });
        });

        if (el.timerList) el.timerList.addEventListener('click', function(e) {
            var btn = e.target.closest('.ibtn-s');
            if (!btn || btn.closest('.tc-handle')) return;
            var id = btn.dataset.id;
            haptic('light');
            if (btn.classList.contains('mute')) toggleDnd(id);
            else if (btn.classList.contains('ed')) editTimer(id);
            else if (btn.classList.contains('dl')) delTimer(id);
            else if (btn.classList.contains('dup')) duplicateTimer(id);
        });

        document.querySelectorAll('.quick-date').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var off = parseInt(this.dataset.offset);
                var now = new Date(); now.setDate(now.getDate() + off);
                el.timerDate.value = localISO(now); autoDetectType(); haptic('light');
            });
        });

        var tplGrid = document.querySelector('.tpl-grid');
        if (tplGrid) tplGrid.addEventListener('click', function(e) {
            var btn = e.target.closest('.tpl-btn');
            if (!btn) return;
            var tpl = TPL_DATA[btn.dataset.tpl];
            if (!tpl) return;
            closeTopModal();
            state.editId = null;
            el.mTitle.textContent = 'Новый счётчик';
            el.timerTitle.value = tpl.title;
            var now = new Date();
            if (tpl.type === 'countdown') now.setDate(now.getDate() + 30);
            el.timerDate.value = localISO(now);
            if (el.timerType) el.timerType.value = tpl.type;
            if (el.timerCategory) el.timerCategory.value = tpl.category || '';
            if (el.timerRecurring) el.timerRecurring.value = tpl.recurring || '';
            if (el.timerReminder) el.timerReminder.checked = tpl.reminder || false;
            el.titleCnt.textContent = tpl.title.length + '/' + MAX_TITLE;
            selectColor(tpl.color);
            if (el.saveMoreRow) el.saveMoreRow.style.display = 'none';
            openModalById(MODAL.TIMER);
            setTimeout(function() { el.timerTitle.focus(); }, 100);
        });

        var sb = $('settingsBtn');
        if (sb) sb.addEventListener('click', function() { haptic('light'); openSettings(); });

        window.addEventListener('offline', function() {
            if (el.offlineDot) el.offlineDot.classList.add('show');
            toast.error(TEXTS.noConnection);
        });
        window.addEventListener('online', function() {
            if (el.offlineDot) el.offlineDot.classList.remove('show');
            toast.success(TEXTS.connectionBack);
        });
        if (!navigator.onLine && el.offlineDot) el.offlineDot.classList.add('show');

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && state._modalStack.length) {
                closeTopModal();
            } else if (!document.querySelector('.modal.show')) {
                var tag = document.activeElement ? document.activeElement.tagName : '';
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
                if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    openModal();
                }
            }
        });

        window.addEventListener('popstate', function(e) {
            if (!e.state || !e.state.modal) closeAllModals();
        });

        window.addEventListener('storage', function(e) {
            if (e.key === STORAGE.TIMERS) { loadTimers(); render(); }
            else if (e.key === STORAGE.SETTINGS) loadSettings();
            else if (e.key === STORAGE.NOTIFIED) loadNotified();
            else if (e.key === STORAGE.DND) loadDnd();
        });

        window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            state._installPrompt = e;
            if (el.installBtn) el.installBtn.classList.remove('hidden');
        });
        if (el.installBtn) el.installBtn.addEventListener('click', function() {
            if (PLATFORM.isIOS && !PLATFORM.isStandalone) {
                toast.info(TEXTS.iosInstall);
                return;
            }
            if (!state._installPrompt) {
                toast.info('Приложение уже установлено или установка недоступна');
                return;
            }
            state._installPrompt.prompt();
            state._installPrompt.userChoice.then(function(r) {
                if (r.outcome === 'accepted') {
                    state._installPrompt = null;
                    el.installBtn.classList.add('hidden');
                }
            });
        });

        document.addEventListener('visibilitychange', function() {
            state._pageVisible = !document.hidden;
            if (!document.hidden) {
                checkRecurring(new Date());
                checkNotifications(new Date());
                render();
            }
        });
    }

    // ===== Drag tip =====
    function showDragTip() {
        var tip = $('dragTip');
        if (!tip) return;
        tip.classList.add('show');
        var close = tip.querySelector('.tip-close');
        if (close) close.addEventListener('click', function() { tip.classList.remove('show'); });
        setTimeout(function() { tip.classList.remove('show'); }, 6000);
    }

    // ===== iOS install tip =====
    function showIosInstallTip() {
        if (!PLATFORM.isIOS || PLATFORM.isStandalone) return;
        if (localStorage.getItem(STORAGE.IOS_TIP)) return;
        var btn = el.installBtn;
        if (btn) btn.classList.remove('hidden');
        localStorage.setItem(STORAGE.IOS_TIP, '1');
    }

    // ===== Init =====
    function init() {
        ensureRoundRect();
        initElements();
        injectIcons();

        var aboutVer = $('aboutVer');
        if (aboutVer && typeof APP_VERSION !== 'undefined') aboutVer.textContent = 'v' + APP_VERSION;

        initClockSvg();
        loadSettings();
        loadTimers();
        loadNotified();
        loadDnd();

        if ('IntersectionObserver' in window) {
            intersectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    var card = entry.target;
                    if (entry.isIntersecting) {
                        card.classList.add('visible');
                        visibleCards.add(card);
                        updateCardCounter(card);
                    } else {
                        card.classList.remove('visible');
                        visibleCards.delete(card);
                    }
                });
            }, { root: el.scrollPage, rootMargin: '0px 0px 50px 0px', threshold: 0.05 });
        }

        renderTemplateButtons();
        bindEvents();
        state._rafId = requestAnimationFrame(rafLoop);
        render();
        initScroll();
        initDrag();
        initCardSwipe();
        initPullToRefresh();
        initModalSwipe();
        initSW();
        loadChangelog();

        setTimeout(function() { if (el.splash) el.splash.classList.add('hide'); }, 1000);
        setTimeout(function() { if (el.splash) el.splash.style.display = 'none'; }, 1500);

        if (location.search.indexOf('action=add') !== -1) {
            history.replaceState(null, '', location.pathname);
            setTimeout(openModal, 600);
        }

        var storedVersion = localStorage.getItem(STORAGE.DRAG_TIP);
        if (storedVersion !== APP_VERSION) {
            setTimeout(function() {
                showDragTip();
                localStorage.setItem(STORAGE.DRAG_TIP, APP_VERSION);
            }, 2500);
        }

        // iOS install tip
        setTimeout(showIosInstallTip, 3500);
    }

    document.addEventListener('pointerdown', function() { state._userTapped = true; }, { once: true, passive: true });
    document.addEventListener('keydown', function() { state._userTapped = true; }, { once: true, passive: true });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();