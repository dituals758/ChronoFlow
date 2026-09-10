(function() {
    'use strict';
    // ===== Константы =====
    var COLORS = ['#5ab0e0', '#7eacff', '#b89cff', '#ff7eb3', '#ff8c00', '#5cd66e', '#ff6b6b'];
    var DEFAULT_COLOR = '#60cdff';
    var DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
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
        calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
    };
    var STORAGE_TIMERS = 'timeflow_timers';
    var STORAGE_SETTINGS = 'timeflow_settings';
    var STORAGE_NOTIFIED = 'timeflow_notified';
    var STORAGE_DND = 'timeflow_dnd';
    var STORAGE_LAST_UPDATE = 'chronoflow_drag_tip_version';
    var MAX_TITLE = 50;
    var DND_DURATION = 24 * 60 * 60 * 1000; // 24 часа

    // ===== Состояние =====
    var timers = [];
    var dnd = {};
    var editId = null;
    var filter = 'all';
    var sortBy = 'order';
    var categoryFilter = 'all';
    var searchQuery = '';
    var groupByCategory = false;
    var notifiedTimers = {};
    var settings = {};
    var prevDay = -1;
    var prevHour = -1;
    var lastTick = 0;
    var _firstRenderDone = false;
    var anims = true;
    var selectedColor = DEFAULT_COLOR;
    var installPrompt = null;
    var focusTrap = null;
    var lastFocus = null;
    var dragSrcId = null;
    var svgDayDots;
    var svgDayEls = [];
    var _ringBgs = null;
    var _pageVisible = true;
    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var el = {};
    var _tickRafId = null;
    var _tickSvgRafId = null;
    var intersectionObserver = null;
    var visibleCards = new Set();
    var _categoriesOpen = {};

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
                } else console.warn('storage.set error:', e);
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
            var cls = 'toast-' + (type || 'info');
            n.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-msg">' + esc(msg) + '</span><button class="toast-close" aria-label="Закрыть">✕</button>';
            n.className = 'notif toast show ' + cls;
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

    // ===== Утилиты =====
    function $(id) { return document.getElementById(id); }
    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
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
    function diffToParts(d) {
        var sc = Math.floor(d/1000), mn = Math.floor(sc/60), hr = Math.floor(mn/60), dy = Math.floor(hr/24);
        return { sc: sc, mn: mn, hr: hr, dy: dy };
    }
    function calcDateParts(totalDays) {
        var ref = new Date(2000,0,1);
        var end = new Date(ref.getTime() + totalDays * 86400000);
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
        var parts = diffToParts(abs);
        var dp = calcDateParts(parts.dy);
        var rh = parts.hr % 24, rm = parts.mn % 60, rs = parts.sc % 60;
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
    function formatDate(ts, fmt) {
        fmt = fmt || (settings.dateFormat || 'DD.MM.YYYY');
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
    var _userTapped = false;
    document.addEventListener('pointerdown', function() { _userTapped = true; }, { once: true, passive: true });
    document.addEventListener('keydown', function() { _userTapped = true; }, { once: true, passive: true });
    function haptic(type) {
        if (!navigator.vibrate || !_userTapped) return;
        try {
            if (type === 'error') navigator.vibrate([15,50,15]);
            else if (type === 'success') navigator.vibrate([10,30,10]);
            else if (type === 'medium') navigator.vibrate(20);
            else navigator.vibrate(10);
        } catch(e) {}
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

    // ===== Метаданные =====
    var CAT_NAMES = { work:'Работа', health:'Здоровье', personal:'Личное', study:'Учёба', travel:'Путешествия' };
    var REC_NAMES = { weekly:'Еженед.', monthly:'Ежемес.', yearly:'Ежегод.' };
    var TPL_DATA = {
        sobriety: { title:'Не курю', type:'elapsed', color:'#30d158', category:'health', recurring:'', reminder:false },
        work: { title:'На работе', type:'elapsed', color:'#0a84ff', category:'work', recurring:'', reminder:false },
        vacation: { title:'До отпуска', type:'countdown', color:'#ff8c00', category:'travel', recurring:'', reminder:true },
        language: { title:'Изучение языка', type:'elapsed', color:'#bf5af2', category:'study', recurring:'', reminder:false },
        fitness: { title:'Фитнес streak', type:'elapsed', color:'#ff6b6b', category:'health', recurring:'weekly', reminder:false },
        savings: { title:'Накопления', type:'elapsed', color:'#5cd66e', category:'personal', recurring:'', reminder:false }
    };

    // ===== Загрузка/сохранение =====
    function loadSettings() {
        settings = storage.get(STORAGE_SETTINGS, {});
        var t = settings.theme || 'system';
        applyTheme(t);
        if (el.themeSel) el.themeSel.value = t;
        anims = settings.anims !== false;
        if (el.animToggle) el.animToggle.checked = anims;
        if (settings.sortBy) sortBy = settings.sortBy;
        if (settings.categoryFilter) categoryFilter = settings.categoryFilter;
        if (settings.filter) filter = settings.filter;
        groupByCategory = !!settings.groupByCategory;
        if (el.groupToggle) el.groupToggle.checked = groupByCategory;
        if (el.dateFormat) el.dateFormat.value = settings.dateFormat || 'DD.MM.YYYY';
        if (el.weekStart) el.weekStart.value = String(settings.weekStart != null ? settings.weekStart : 1);
        if (el.notifEnabled) el.notifEnabled.checked = settings.notifEnabled !== false;
        if (el.notifPeriod) el.notifPeriod.value = String(settings.notifPeriod != null ? settings.notifPeriod : 3);
        if (el.praiseEnabled) el.praiseEnabled.checked = settings.praiseEnabled !== false;
        if (el.praiseInterval) el.praiseInterval.value = String(settings.praiseInterval || 30);
        applyAnimPref();
    }
    function saveSettings() {
        settings = {
            theme: el.themeSel ? el.themeSel.value : 'system',
            anims: el.animToggle ? el.animToggle.checked : true,
            sortBy: sortBy,
            categoryFilter: categoryFilter,
            filter: filter,
            groupByCategory: el.groupToggle ? el.groupToggle.checked : false,
            dateFormat: el.dateFormat ? el.dateFormat.value : 'DD.MM.YYYY',
            weekStart: el.weekStart ? parseInt(el.weekStart.value) : 1,
            notifEnabled: el.notifEnabled ? el.notifEnabled.checked : true,
            notifPeriod: el.notifPeriod ? parseInt(el.notifPeriod.value) : 3,
            praiseEnabled: el.praiseEnabled ? el.praiseEnabled.checked : true,
            praiseInterval: el.praiseInterval ? parseInt(el.praiseInterval.value) : 30
        };
        storage.set(STORAGE_SETTINGS, settings);
    }
    function loadTimers() {
        var raw = storage.get(STORAGE_TIMERS);
        if (!Array.isArray(raw)) { timers = []; return; }
        timers = raw.filter(function(t) {
            return t && typeof t === 'object' && typeof t.id === 'string' &&
                   typeof t.title === 'string' && typeof t.date === 'number';
        });
    }
    function saveTimers() { storage.set(STORAGE_TIMERS, timers); }
    function loadNotified() { notifiedTimers = storage.get(STORAGE_NOTIFIED, {}); }
    function saveNotified() { storage.set(STORAGE_NOTIFIED, notifiedTimers); }
    function loadDnd() { dnd = storage.get(STORAGE_DND, {}); }
    function saveDnd() { storage.set(STORAGE_DND, dnd); }
    function isDnd(timerId) {
        var until = dnd[timerId];
        if (!until) return false;
        if (Date.now() > until) { delete dnd[timerId]; saveDnd(); return false; }
        return true;
    }

    // ===== Тема =====
    function applyTheme(t) {
        document.body.classList.remove('lt');
        if (t === 'light') document.body.classList.add('lt');
        else if (t === 'system' && window.matchMedia('(prefers-color-scheme:light)').matches) document.body.classList.add('lt');
    }
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function() {
        var s = storage.get(STORAGE_SETTINGS, {});
        if ((s.theme || 'system') === 'system') applyTheme('system');
    });
    function applyAnimPref() {
        if (!anims) document.body.classList.add('no-anim');
        else document.body.classList.remove('no-anim');
    }

    // ===== Уведомления =====
    function requestNotifPermission() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') Notification.requestPermission();
    }
    function sendNotification(title, body) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        try {
            new Notification(title, {
                body: body,
                icon: './icon-192.png',
                badge: './icon-192.png',
                tag: 'chronoflow',
                vibrate: [200,100,200]
            });
        } catch(e) {}
    }
    function checkNotifications(now) {
        if (settings.notifEnabled === false) return;
        var ts = now.getTime();
        var changed = false;
        var period = settings.notifPeriod != null ? settings.notifPeriod : 3;
        var praiseEnabled = settings.praiseEnabled !== false;
        var praiseInterval = settings.praiseInterval || 30;
        var dayMs = 86400000;
        for (var i = 0; i < timers.length; i++) {
            var t = timers[i];
            if (isDnd(t.id)) continue;
            // Напоминания для countdown
            if (t.type === 'countdown' && t.reminder) {
                var diff = t.date - ts;
                var daysLeft = Math.ceil(diff / dayMs);
                var periods = [period, 1, 0];
                if (daysLeft >= 0 && periods.indexOf(daysLeft) !== -1) {
                    var key = 'r_' + t.id + '_' + daysLeft;
                    if (!notifiedTimers[key]) {
                        notifiedTimers[key] = true;
                        changed = true;
                        var body = daysLeft === 0 ? 'Сегодня!' : 'Осталось ' + daysLeft + ' дн.';
                        sendNotification('🔔 ' + t.title, body);
                    }
                }
            }
            // Похвалы для elapsed
            if (t.type === 'elapsed' && praiseEnabled) {
                var elapsedDays = (ts - t.date) / dayMs;
                var days = Math.floor(elapsedDays);
                if (days > 0 && days % praiseInterval === 0) {
                    var key2 = 'p_' + t.id + '_' + days;
                    if (!notifiedTimers[key2]) {
                        notifiedTimers[key2] = true;
                        changed = true;
                        sendNotification('🎉 ' + t.title, declension(days, ['день','дня','дней']) + '! Отличная работа! 💪');
                    }
                }
            }
        }
        if (changed) saveNotified();
    }
    function checkRecurring(now) {
        var changed = false;
        for (var i = 0; i < timers.length; i++) {
            var t = timers[i];
            if (!t.recurring || t.type !== 'countdown') continue;
            if (now.getTime() > t.date) {
                var d = new Date(t.date);
                if (t.recurring === 'weekly') d.setDate(d.getDate() + 7);
                else if (t.recurring === 'monthly') {
                    var day = t.originalDay || d.getDate();
                    d.setDate(1);
                    d.setMonth(d.getMonth() + 1);
                    d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
                } else if (t.recurring === 'yearly') d.setFullYear(d.getFullYear() + 1);
                t.date = d.getTime();
                changed = true;
            }
        }
        if (changed) { saveTimers(); render(); }
    }

    // ===== Карточки =====
    function createTimerCard(t) {
        var isElapsed = t.type === 'elapsed';
        var dateStr = formatDate(t.date);
        var typeLabel = isElapsed ? 'Прошло' : 'Осталось';
        var typeClass = isElapsed ? 'elapsed' : 'countdown';
        var catLabel = '';
        if (t.category && CAT_NAMES[t.category]) {
            catLabel = '<span class="badge cat-tag ' + t.category + '">' + CAT_NAMES[t.category] + '</span>';
        }
        var recLabel = '';
        if (t.recurring && REC_NAMES[t.recurring]) {
            recLabel = '<span class="badge recurring-badge">' + REC_NAMES[t.recurring] + '</span>';
        }
        var isMuted = isDnd(t.id);
        var dndBadge = isMuted ? '<span class="badge dnd-badge">🔇 Тихо</span>' : '';
        var card = document.createElement('div');
        card.className = 'tc-card' + (isMuted ? ' muted' : '');
        card.dataset.id = t.id;
        card.setAttribute('role', 'listitem');
        card.setAttribute('draggable', 'true');
        card.innerHTML =
            '<div class="tc-swipe-actions">' +
                '<button class="tc-swipe-edit" data-id="' + t.id + '" aria-label="Редактировать">' +
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg>Изменить' +
                '</button>' +
                '<button class="tc-swipe-delete" data-id="' + t.id + '" aria-label="Удалить">' +
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>Удалить' +
                '</button>' +
            '</div>' +
            '<div class="tc-swipe-content">' +
                '<div class="tc-handle" aria-label="Перетащить" title="Перетащить">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>' +
                '</div>' +
                '<div class="tc-body">' +
                    '<div class="tc-row-top">' +
                        '<div class="tc-title">' + esc(t.title) + '</div>' +
                        '<div class="tc-actions">' +
                            '<button class="ibtn-s mute' + (isMuted ? ' active' : '') + '" data-id="' + t.id + '" title="' + (isMuted ? 'Включить уведомления' : 'Не беспокоить') + '">' + (isMuted ? ICONS.mute : ICONS.bell) + '</button>' +
                            '<button class="ibtn-s ed" data-id="' + t.id + '" title="Редактировать"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg></button>' +
                            '<button class="ibtn-s dl" data-id="' + t.id + '" title="Удалить"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button>' +
                            '<button class="ibtn-s dup" data-id="' + t.id + '" title="Дублировать"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="tc-badges">' + catLabel + recLabel + dndBadge + '<span class="badge tc-type ' + typeClass + '">' + typeLabel + '</span></div>' +
                    '<div class="tc-counter"><div class="tc-counter-val" data-ts="' + t.date + '" data-type="' + t.type + '" style="color:' + t.color + '" aria-live="polite" aria-atomic="true"></div></div>' +
                    '<div class="tc-date"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + dateStr + '</div>' +
                '</div>' +
            '</div>';
        return card;
    }

    function observeCard(card) {
        if (!intersectionObserver) return;
        intersectionObserver.observe(card);
    }

    function updateCardCounter(card) {
        var el = card.querySelector('.tc-counter-val');
        if (!el) return;
        var ts = parseInt(el.dataset.ts);
        var tp = el.dataset.type;
        if (ts) el.textContent = fmtCounter(ts, tp);
    }

    // ===== Рендер =====
    function getFiltered() {
        var f = timers.slice();
        if (filter !== 'all') f = f.filter(function(x) { return x.type === filter; });
        if (categoryFilter !== 'all') {
            if (categoryFilter === '') f = f.filter(function(x) { return !x.category; });
            else f = f.filter(function(x) { return x.category === categoryFilter; });
        }
        if (searchQuery) {
            var q = searchQuery.toLowerCase();
            f = f.filter(function(x) { return x.title.toLowerCase().indexOf(q) !== -1; });
        }
        if (sortBy === 'name') f.sort(function(a,b) { return a.title.localeCompare(b.title, 'ru'); });
        else if (sortBy === 'date') f.sort(function(a,b) { return a.date - b.date; });
        else if (sortBy === 'created') f.sort(function(a,b) { return (b.created||0) - (a.created||0); });
        return f;
    }

    function updateProgressBar(filtered) {
        var wrap = el.progressBarWrap;
        if (!wrap) return;
        var now = Date.now();
        var countdowns = filtered.filter(function(t) { return t.type === 'countdown' && t.date > now; });
        if (countdowns.length === 0) { wrap.style.display = 'none'; return; }
        var nearest = countdowns.reduce(function(a,b) { return a.date < b.date ? a : b; });
        var total = nearest.date - now;
        var daysLeft = Math.ceil(total / 86400000);
        var maxDays = 365;
        var progress = Math.min(100, Math.max(0, (1 - daysLeft / maxDays) * 100));
        wrap.style.display = 'block';
        el.progressLabel.textContent = 'До «' + nearest.title + '» осталось ' + declension(daysLeft, ['день','дня','дней']);
        el.progressFill.style.width = progress + '%';
    }

    function render() {
        var list = el.timerList;
        var empty = el.empty;
        var filtered = getFiltered();
        updateFilterButtonState();
        updateProgressBar(filtered);

        // Отписываем старые карточки
        if (intersectionObserver) {
            intersectionObserver.disconnect();
            visibleCards.clear();
        }

        if (filtered.length === 0) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
            empty.querySelector('h3').textContent = 'Каждый день на счету';
            empty.querySelector('p').textContent = 'Не курю 45 дней. До отпуска 128 дней. На работе 2 года. Создайте свой первый счётчик.';
            empty.querySelector('.btn-p').textContent = 'Создать счётчик';
            empty.querySelector('.btn-p').onclick = openModal;
            return;
        }
        empty.classList.add('hidden');
        var sectionHdr = document.querySelector('.section-hdr');
        if (sectionHdr) sectionHdr.classList.remove('shifted');

        var useGroups = groupByCategory && sortBy === 'order' && filtered.length > 1;
        list.innerHTML = '';
        if (useGroups) {
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
                var isOpen = _categoriesOpen[cat] !== false;
                var gEl = document.createElement('div');
                gEl.className = 'category-group';
                gEl.dataset.category = cat;
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
                    _categoriesOpen[cat] = o;
                });
                gEl.appendChild(hdr);
                gEl.appendChild(body);
                list.appendChild(gEl);
            });
        } else {
            var frag = document.createDocumentFragment();
            for (var i = 0; i < filtered.length; i++) {
                var card = createTimerCard(filtered[i]);
                frag.appendChild(card);
            }
            list.appendChild(frag);
        }
        // Подписываем карточки
        var cards = list.querySelectorAll('.tc-card');
        for (var c = 0; c < cards.length; c++) {
            observeCard(cards[c]);
            if (_firstRenderDone) cards[c].classList.add('no-anim');
        }
        _firstRenderDone = true;
        // Обновим счётчики сразу для тех, кто уже виден
        for (var k = 0; k < cards.length; k++) updateCardCounter(cards[k]);
    }

    function updateFilterButtonState() {
        var btn = el.filterBtn;
        if (!btn) return;
        if (filter !== 'all' || categoryFilter !== 'all') {
            btn.classList.add('active');
            btn.style.color = 'var(--bl)';
        } else {
            btn.classList.remove('active');
            btn.style.color = '';
        }
    }

    // ===== Модалки и фокус =====
    function dismissModal(m) {
        m.classList.remove('show');
        document.querySelector('main').removeAttribute('inert');
        releaseFocus();
        if (lastFocus) lastFocus.focus();
    }
    function trapFocus(container) {
        var focusable = container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0], last = focusable[focusable.length-1];
        focusTrap = function(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
            else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
        };
        document.addEventListener('keydown', focusTrap);
        document.querySelector('main').setAttribute('inert', '');
    }
    function releaseFocus() {
        if (focusTrap) { document.removeEventListener('keydown', focusTrap); focusTrap = null; }
    }
    function openModal() {
        el.timerTitle.classList.remove('error');
        el.timerDate.classList.remove('error');
        editId = null;
        el.mTitle.textContent = 'Новый счётчик';
        el.timerTitle.value = '';
        el.timerDate.value = '';
        if (el.timerType) el.timerType.value = 'elapsed';
        if (el.timerCategory) el.timerCategory.value = '';
        if (el.timerRecurring) el.timerRecurring.value = '';
        if (el.timerReminder) el.timerReminder.checked = false;
        el.titleCnt.textContent = '0/' + MAX_TITLE;
        selectedColor = DEFAULT_COLOR;
        selectColor(selectedColor);
        if (el.saveMoreRow) el.saveMoreRow.style.display = '';
        lastFocus = document.activeElement;
        history.pushState({ modal: true }, '');
        el.timerModal.classList.add('show');
        trapFocus(el.timerModal);
        setTimeout(function() { el.timerTitle.focus(); }, 100);
    }
    function closeModal() {
        dismissModal(el.timerModal);
        var hp = $('hslPopup'); if (hp) hp.classList.remove('show');
    }
    function openSettings() {
        lastFocus = document.activeElement;
        history.pushState({ modal: true }, '');
        el.sModal.classList.add('show');
        trapFocus(el.sModal);
    }
    function closeSettings() { dismissModal(el.sModal); }

    // ===== CRUD =====
    function saveTimer(more) {
        var title = el.timerTitle.value.trim();
        var dateVal = el.timerDate.value;
        var type = el.timerType ? el.timerType.value : 'elapsed';
        if (!title) { el.timerTitle.classList.add('error'); toast.error('Введите название'); setTimeout(function() { el.timerTitle.classList.remove('error'); },500); return; }
        if (!dateVal) { el.timerDate.classList.add('error'); toast.error('Укажите дату'); setTimeout(function() { el.timerDate.classList.remove('error'); },500); return; }
        var timestamp = new Date(dateVal).getTime();
        if (isNaN(timestamp)) { el.timerDate.classList.add('error'); toast.error('Некорректная дата'); setTimeout(function() { el.timerDate.classList.remove('error'); },500); return; }
        if (editId) {
            var idx = timers.findIndex(function(x) { return x.id === editId; });
            if (idx !== -1) {
                timers[idx].title = title;
                timers[idx].date = timestamp;
                timers[idx].type = type;
                timers[idx].color = selectedColor;
                timers[idx].category = el.timerCategory ? el.timerCategory.value : '';
                timers[idx].recurring = el.timerRecurring ? el.timerRecurring.value : '';
                timers[idx].reminder = el.timerReminder ? el.timerReminder.checked : false;
                timers[idx].originalDay = new Date(dateVal).getDate();
            }
            toast.info('Обновлено');
        } else {
            timers.push({
                id: genId(), title: title, date: timestamp, type: type,
                color: selectedColor, created: Date.now(),
                category: el.timerCategory ? el.timerCategory.value : '',
                recurring: el.timerRecurring ? el.timerRecurring.value : '',
                reminder: el.timerReminder ? el.timerReminder.checked : false,
                originalDay: new Date(dateVal).getDate()
            });
            toast.success('Добавлено');
        }
        haptic('success');
        saveTimers();
        if (more && !editId) {
            el.timerTitle.value = '';
            el.timerDate.value = '';
            el.titleCnt.textContent = '0/' + MAX_TITLE;
            selectedColor = DEFAULT_COLOR;
            selectColor(selectedColor);
            setTimeout(function() { el.timerTitle.focus(); }, 100);
        } else closeModal();
        render();
    }
    function editTimer(id) {
        var t = timers.find(function(x) { return x.id === id; });
        if (!t) return;
        editId = id;
        el.mTitle.textContent = 'Редактировать';
        el.timerTitle.value = t.title;
        el.timerDate.value = localISO(new Date(t.date));
        if (el.timerType) el.timerType.value = t.type || 'elapsed';
        if (el.timerCategory) el.timerCategory.value = t.category || '';
        if (el.timerRecurring) el.timerRecurring.value = t.recurring || '';
        if (el.timerReminder) el.timerReminder.checked = !!t.reminder;
        el.titleCnt.textContent = t.title.length + '/' + MAX_TITLE;
        selectedColor = t.color || DEFAULT_COLOR;
        selectColor(selectedColor);
        if (el.saveMoreRow) el.saveMoreRow.style.display = 'none';
        lastFocus = document.activeElement;
        el.timerModal.classList.add('show');
        trapFocus(el.timerModal);
        setTimeout(function() { el.timerTitle.focus(); }, 100);
    }
    var lastDel = null, undoTimer = null;
    function delTimer(id) {
        haptic('medium');
        var idx = timers.findIndex(function(x) { return x.id === id; });
        if (idx === -1) return;
        var timer = timers[idx];
        timers.splice(idx, 1);
        delete notifiedTimers[id];
        delete notifiedTimers[id + '_done'];
        delete dnd[id];
        saveNotified();
        saveDnd();
        lastDel = { timer: timer };
        var card = el.timerList.querySelector('.tc-card[data-id="' + id + '"]');
        if (card) {
            if (intersectionObserver) intersectionObserver.unobserve(card);
            visibleCards.delete(card);
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
            t.innerHTML = '<span>Удалено</span><button class="undo-btn" id="undoBtn">Отменить</button>';
            document.body.appendChild(t);
            $('undoBtn').onclick = undo;
        }
        clearTimeout(undoTimer);
        t.classList.add('show');
        undoTimer = setTimeout(function() { t.classList.remove('show'); lastDel = null; }, 5000);
    }
    function undo() {
        if (!lastDel) return;
        var i = timers.findIndex(function(x) { return x.id === lastDel.timer.id; });
        if (i !== -1) timers[i] = lastDel.timer;
        else timers.push(lastDel.timer);
        lastDel = null;
        clearTimeout(undoTimer);
        var t = $('undoToast'); if (t) t.classList.remove('show');
        saveTimers(); render();
        haptic('light');
        toast.success('Восстановлено');
    }
    function toggleDnd(id) {
        if (isDnd(id)) { delete dnd[id]; toast.info('Уведомления включены'); }
        else { dnd[id] = Date.now() + DND_DURATION; toast.success('Уведомления отключены на 24 ч'); }
        saveDnd();
        haptic('light');
        render();
    }
    function showConfirm(title, msg, okText, cb) {
        var m = el.confirmModal;
        $('confirmTitle').textContent = title;
        $('confirmMsg').textContent = msg;
        $('confirmOk').textContent = okText || 'Удалить';
        lastFocus = document.activeElement;
        m.classList.add('show');
        trapFocus(m);
        $('confirmOk').onclick = function() { dismissModal(m); cb(); };
        $('confirmCancel').onclick = function() { dismissModal(m); };
    }

    // ===== Экспорт =====
    function exportJSON() {
        if (!timers.length) { toast.error('Нет данных'); return; }
        var blob = new Blob([JSON.stringify(timers, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'chronoflow-' + new Date().toISOString().slice(0,10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        haptic('success'); toast.success('Экспортировано');
    }
    function exportICS() {
        if (!timers.length) { toast.error('Нет данных'); return; }
        var ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ChronoFlow//RU\r\nCALSCALE:GREGORIAN\r\n';
        timers.forEach(function(t) {
            var dt = new Date(t.date).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
            ics += 'BEGIN:VEVENT\r\nUID:' + t.id + '@chronoflow\r\nDTSTAMP:' + dt + '\r\nDTSTART:' + dt + '\r\nSUMMARY:' + t.title.replace(/[\\;,]/g, '\\$&') + '\r\n';
            if (t.category) ics += 'CATEGORIES:' + (CAT_NAMES[t.category] || t.category) + '\r\n';
            ics += 'END:VEVENT\r\n';
        });
        ics += 'END:VCALENDAR';
        var blob = new Blob([ics], { type: 'text/calendar' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'chronoflow-events.ics';
        a.click();
        URL.revokeObjectURL(url);
        haptic('success'); toast.success('Календарь экспортирован');
    }
    function exportImage() {
        var card = el.timerList.querySelector('.tc-card');
        if (!card) { toast.error('Нет счётчиков'); return; }
        var cvs = document.createElement('canvas');
        cvs.width = 800; cvs.height = 600;
        var c = cvs.getContext('2d');
        c.fillStyle = '#000'; c.fillRect(0,0,800,600);
        var grad = c.createLinearGradient(0,0,800,600);
        grad.addColorStop(0, '#0a84ff'); grad.addColorStop(1, '#5e5ce6');
        c.fillStyle = grad; c.globalAlpha = 0.15; c.fillRect(0,0,800,600);
        c.globalAlpha = 1; c.fillStyle = '#fff';
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
            var elc = items[i].querySelector('.tc-counter-val');
            var titleEl = items[i].querySelector('.tc-title');
            var typeEl = items[i].querySelector('.tc-type');
            if (!elc || !titleEl) continue;
            c.fillStyle = 'rgba(255,255,255,0.08)';
            c.beginPath(); c.roundRect(40, y, 720, 50, 12); c.fill();
            c.fillStyle = '#fff';
            c.font = '600 15px -apple-system, sans-serif';
            c.textAlign = 'left';
            c.fillText(titleEl.textContent, 60, y + 22);
            c.fillStyle = elc.style.color || '#fff';
            c.font = '300 18px monospace';
            c.textAlign = 'right';
            c.fillText(elc.textContent, 740, y + 28);
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
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'chronoflow-' + new Date().toISOString().slice(0,10) + '.png';
            a.click();
            URL.revokeObjectURL(url);
            haptic('success'); toast.success('Изображение сохранено');
        });
    }

    // ===== Импорт =====
    function importTimers() { el.importFile.click(); }
    function isValidTimer(obj) {
        if (!obj || typeof obj !== 'object') return false;
        if (typeof obj.title !== 'string' || obj.title.trim() === '') return false;
        if (typeof obj.date !== 'number' || isNaN(obj.date)) return false;
        if (typeof obj.id !== 'string' || obj.id.trim() === '') return false;
        if (obj.type && typeof obj.type !== 'string') return false;
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
                if (!Array.isArray(data)) throw new Error('Данные должны быть массивом');
                var valid = data.filter(isValidTimer);
                if (!valid.length) throw new Error('Нет валидных записей');
                showConfirm('Импорт', 'Импортировать ' + valid.length + ' счётчиков?', 'Импортировать', function() {
                    var ids = {};
                    timers.forEach(function(x) { ids[x.id] = true; });
                    var newT = valid.filter(function(x) { return !ids[x.id]; });
                    var skipped = valid.length - newT.length;
                    timers = timers.concat(newT);
                    saveTimers();
                    render();
                    haptic('success');
                    var m = 'Импортировано ' + newT.length;
                    if (skipped > 0) m += ', пропущено дублей: ' + skipped;
                    toast.success(m);
                });
            } catch (err) {
                var msg = 'Ошибка импорта: ';
                if (err instanceof SyntaxError) msg += 'неверный формат JSON';
                else msg += err.message || 'неизвестная ошибка';
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
        selectedColor = c;
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

    // ===== Свайп =====
    function initCardSwipe() {
        if (!el.timerList) return;
        var activeSwipe = null, startX = 0, startY = 0, swiping = false, isHor = false;
        function resetSwipe(card) {
            if (!card) return;
            var c = card.querySelector('.tc-swipe-content');
            if (c) { c.classList.remove('swiping'); c.style.transform = ''; }
            if (activeSwipe === card) activeSwipe = null;
        }
        el.timerList.addEventListener('touchstart', function(e) {
            if (!isTouch) return;
            var content = e.target.closest('.tc-swipe-content');
            if (!content) return;
            var wrap = content.closest('.tc-card');
            if (!wrap) return;
            if (e.target.closest('.tc-handle') || e.target.closest('.tc-actions button, .tc-swipe-actions button')) return;
            if (activeSwipe && activeSwipe !== wrap) resetSwipe(activeSwipe);
            startX = e.touches[0].clientX; startY = e.touches[0].clientY;
            swiping = false; isHor = false; activeSwipe = wrap;
        }, { passive: true });
        el.timerList.addEventListener('touchmove', function(e) {
            if (!isTouch || !activeSwipe) return;
            var dx = e.touches[0].clientX - startX, dy = e.touches[0].clientY - startY;
            if (!swiping && !isHor) {
                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                    if (Math.abs(dx) > Math.abs(dy)) { isHor = true; swiping = true; }
                    else { activeSwipe = null; return; }
                }
                return;
            }
            if (!isHor) return;
            e.preventDefault();
            var content = activeSwipe.querySelector('.tc-swipe-content');
            if (!content) return;
            var offset = Math.min(0, Math.max(-144, dx));
            content.classList.add('swiping');
            content.style.transform = 'translateX(' + offset + 'px)';
        }, { passive: false });
        el.timerList.addEventListener('touchend', function() {
            if (!isTouch || !activeSwipe) return;
            var content = activeSwipe.querySelector('.tc-swipe-content');
            if (!content) { activeSwipe = null; return; }
            content.classList.remove('swiping');
            var m = content.style.transform.match(/translateX\((-?[\d.]+)px\)/);
            var dx = m ? parseFloat(m[1]) : 0;
            if (dx < -100) content.style.transform = 'translateX(-144px)';
            else { content.style.transform = ''; activeSwipe = null; }
        }, { passive: true });
        el.timerList.addEventListener('touchcancel', function() {
            if (activeSwipe) { resetSwipe(activeSwipe); activeSwipe = null; }
        }, { passive: true });
        document.addEventListener('touchstart', function(e) {
            if (!activeSwipe) return;
            if (!e.target.closest('.tc-card')) { resetSwipe(activeSwipe); activeSwipe = null; }
        }, { passive: true });
        el.timerList.addEventListener('click', function(e) {
            var eb = e.target.closest('.tc-swipe-edit');
            var db = e.target.closest('.tc-swipe-delete');
            if (eb) { var c1 = eb.closest('.tc-card'); if (c1) resetSwipe(c1); haptic('light'); editTimer(eb.dataset.id); }
            else if (db) { var c2 = db.closest('.tc-card'); if (c2) resetSwipe(c2); delTimer(db.dataset.id); }
        });
    }

    // ===== Drag-and-drop =====
    function clearDragIndicators() {
        var cards = el.timerList ? el.timerList.querySelectorAll('.tc-card') : [];
        for (var i = 0; i < cards.length; i++) cards[i].classList.remove('drag-over-top','drag-over-bottom');
    }
    function reorderTimers(srcId, targetId, insertBefore) {
        var si = timers.findIndex(function(x) { return x.id === srcId; });
        var ti = timers.findIndex(function(x) { return x.id === targetId; });
        if (si === -1 || ti === -1 || si === ti) return;
        var m = timers.splice(si, 1)[0];
        ti = timers.findIndex(function(x) { return x.id === targetId; });
        if (insertBefore) timers.splice(ti, 0, m);
        else timers.splice(ti + 1, 0, m);
        saveTimers();
        render();
    }
    function initDrag() {
        if (!el.timerList) return;
        el.timerList.addEventListener('dragstart', function(e) {
            var h = e.target.closest('.tc-handle');
            if (!h) { e.preventDefault(); return; }
            var card = h.closest('.tc-card');
            if (!card) return;
            dragSrcId = card.dataset.id;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.dataset.id);
        });
        el.timerList.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            var card = e.target.closest('.tc-card');
            if (!card || card.dataset.id === dragSrcId) return;
            clearDragIndicators();
            var r = card.getBoundingClientRect();
            if (e.clientY < r.top + r.height/2) card.classList.add('drag-over-top');
            else card.classList.add('drag-over-bottom');
        });
        el.timerList.addEventListener('dragleave', function(e) {
            var card = e.target.closest('.tc-card');
            if (card) card.classList.remove('drag-over-top','drag-over-bottom');
        });
        el.timerList.addEventListener('drop', function(e) {
            e.preventDefault();
            var target = e.target.closest('.tc-card');
            if (!target || !dragSrcId) return;
            if (target.dataset.id === dragSrcId) return;
            var r = target.getBoundingClientRect();
            reorderTimers(dragSrcId, target.dataset.id, e.clientY < r.top + r.height/2);
            clearDragIndicators();
        });
        el.timerList.addEventListener('dragend', function() {
            dragSrcId = null;
            clearDragIndicators();
        });
        // Touch long press
        if (isTouch) {
            var lpTimer = null, isLP = false, lsX = 0, lsY = 0;
            var lpCard = null, lpClone = null, lpActive = false;
            el.timerList.addEventListener('touchstart', function(e) {
                var h = e.target.closest('.tc-handle');
                if (!h) return;
                var card = h.closest('.tc-card');
                if (!card) return;
                if (e.target.closest('.tc-actions button') || e.target.closest('.tc-swipe-actions button')) return;
                var t = e.touches[0];
                lsX = t.clientX; lsY = t.clientY;
                lpCard = card; isLP = false;
                clearTimeout(lpTimer);
                lpTimer = setTimeout(function() {
                    isLP = true; lpActive = true;
                    lpClone = card.cloneNode(true);
                    lpClone.className = 'tc-card touch-clone';
                    lpClone.style.cssText = 'position:fixed;z-index:5000;pointer-events:none;width:' + card.offsetWidth + 'px;opacity:.85;transform:rotate(2deg);';
                    lpClone.style.left = (t.clientX - lpClone.offsetWidth/2) + 'px';
                    lpClone.style.top = (t.clientY - 20) + 'px';
                    document.body.appendChild(lpClone);
                    card.classList.add('dragging');
                    haptic('medium');
                }, 350);
            }, { passive: true });
            el.timerList.addEventListener('touchmove', function(e) {
                if (!lpCard) return;
                var t = e.touches[0];
                var dx = t.clientX - lsX, dy = t.clientY - lsY;
                if (isLP) {
                    e.preventDefault();
                    if (lpClone) {
                        lpClone.style.left = (t.clientX - lpClone.offsetWidth/2) + 'px';
                        lpClone.style.top = (t.clientY - 20) + 'px';
                        lpClone.style.display = 'none';
                        var under = document.elementFromPoint(t.clientX, t.clientY);
                        lpClone.style.display = '';
                        var tc = under ? under.closest('.tc-card') : null;
                        clearDragIndicators();
                        if (tc && tc !== lpCard) {
                            var r = tc.getBoundingClientRect();
                            if (t.clientY < r.top + r.height/2) tc.classList.add('drag-over-top');
                            else tc.classList.add('drag-over-bottom');
                        }
                    }
                    return;
                }
                if (Math.abs(dx) > 12 || Math.abs(dy) > 12) { clearTimeout(lpTimer); lpCard = null; }
            }, { passive: false });
            el.timerList.addEventListener('touchend', function() {
                clearTimeout(lpTimer);
                if (isLP && lpActive) {
                    if (lpCard) lpCard.classList.remove('dragging');
                    if (lpClone && lpClone.parentNode) lpClone.parentNode.removeChild(lpClone);
                    lpClone = null;
                    var over = el.timerList.querySelector('.drag-over-top, .drag-over-bottom');
                    if (over && lpCard) reorderTimers(lpCard.dataset.id, over.dataset.id, over.classList.contains('drag-over-top'));
                    clearDragIndicators();
                    isLP = false; lpActive = false;
                }
                lpCard = null;
            });
            el.timerList.addEventListener('touchcancel', function() {
                clearTimeout(lpTimer);
                if (isLP && lpActive) {
                    if (lpCard) lpCard.classList.remove('dragging');
                    if (lpClone && lpClone.parentNode) lpClone.parentNode.removeChild(lpClone);
                    lpClone = null;
                    clearDragIndicators();
                    isLP = false; lpActive = false;
                }
                lpCard = null;
            });
        }
    }

    // ===== Pull to refresh =====
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
                var svg = ind.querySelector('svg');
                if (svg) svg.style.transform = 'rotate(' + (p * 180) + 'deg)';
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
                var svg = ind.querySelector('svg');
                if (svg) svg.style.transform = '';
                setTimeout(function() {
                    render();
                    ind.classList.remove('active', 'refreshing');
                    ind.style.height = ''; ind.style.opacity = '';
                    toast.info('Обновлено');
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

    // ===== Swipe-down модалок =====
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
                    dismissModal(modal);
                    if (modal === el.sModal) closeSettings();
                    history.back();
                }
                mc.style.transform = ''; modal.style.opacity = '';
            });
            h.addEventListener('touchcancel', function() {
                sw = false; mc.classList.remove('swiping');
                mc.style.transform = ''; modal.style.opacity = '';
            });
        });
    }

    // ===== SVG-часы =====
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_CX = 100, SVG_CY = 100;
    var svgDayRingFill, svgRingEl, svgRingGradStop1, svgRingGradStop2, svgDayGradStop1, svgDayGradStop2;
    var SEC_RING_R = 88, DAY_RING_R = 76;
    var SEC_RING_CIRC = 2 * Math.PI * SEC_RING_R;
    var DAY_RING_CIRC = 2 * Math.PI * DAY_RING_R;
    var DAYS_SHORT_RU = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
    var MONTHS_SHORT = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    function initClockSvg() {
        svgRingEl = $('ringProgress');
        svgDayRingFill = $('dayRingFill');
        svgRingGradStop1 = document.querySelector('#ringGrad stop:first-child');
        svgRingGradStop2 = document.querySelector('#ringGrad stop:last-child');
        svgDayGradStop1 = document.querySelector('#dayRingGrad stop:first-child');
        svgDayGradStop2 = document.querySelector('#dayRingGrad stop:last-child');
        if (svgRingEl) { svgRingEl.style.strokeDasharray = SEC_RING_CIRC; svgRingEl.style.strokeDashoffset = SEC_RING_CIRC; }
        if (svgDayRingFill) { svgDayRingFill.style.strokeDasharray = DAY_RING_CIRC; svgDayRingFill.style.strokeDashoffset = DAY_RING_CIRC; }
        svgDayDots.innerHTML = '';
        svgDayEls = [];
        var dotR = 65;
        for (var i = 0; i < 7; i++) {
            var a = (i * 2 * Math.PI / 7) - Math.PI / 2;
            var x = SVG_CX + dotR * Math.cos(a), y = SVG_CY + dotR * Math.sin(a);
            var dot = document.createElementNS(SVG_NS, 'circle');
            dot.setAttribute('cx', x); dot.setAttribute('cy', y);
            dot.setAttribute('r', '3'); dot.setAttribute('fill', COLORS[i]);
            dot.setAttribute('opacity', '0.15');
            svgDayDots.appendChild(dot); svgDayEls.push(dot);
        }
        var ticksGroup = $('svgTicks');
        if (ticksGroup) {
            ticksGroup.innerHTML = '';
            var tickR = 88;
            for (var t = 0; t < 60; t++) {
                var an = (t * 2 * Math.PI / 60) - Math.PI / 2;
                var isMajor = t % 5 === 0, len = isMajor ? 5 : 2;
                var line = document.createElementNS(SVG_NS, 'line');
                line.setAttribute('x1', SVG_CX + (tickR - len) * Math.cos(an));
                line.setAttribute('y1', SVG_CY + (tickR - len) * Math.sin(an));
                line.setAttribute('x2', SVG_CX + tickR * Math.cos(an));
                line.setAttribute('y2', SVG_CY + tickR * Math.sin(an));
                line.setAttribute('stroke', isMajor ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)');
                line.setAttribute('stroke-width', isMajor ? '1' : '0.5');
                line.setAttribute('stroke-linecap', 'round');
                ticksGroup.appendChild(line);
            }
        }
    }
    function updateClockSvg() {
        var now = new Date();
        var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds(), ms = now.getMilliseconds();
        var dayIndex = relDay(now);
        var dayColor = COLORS[dayIndex];
        var isLight = document.body.classList.contains('lt');
        if (svgRingEl) svgRingEl.style.strokeDashoffset = SEC_RING_CIRC * (1 - (s + ms/1000)/60);
        if (svgRingGradStop1) svgRingGradStop1.setAttribute('stop-color', dayColor);
        if (svgRingGradStop2) svgRingGradStop2.setAttribute('stop-color', lightenHex(dayColor, 0.3));
        if (svgDayRingFill) svgDayRingFill.style.strokeDashoffset = DAY_RING_CIRC * (1 - (h*3600000 + m*60000 + s*1000 + ms)/86400000);
        if (svgDayGradStop1) svgDayGradStop1.setAttribute('stop-color', dayColor);
        if (svgDayGradStop2) svgDayGradStop2.setAttribute('stop-color', lightenHex(dayColor, 0.25));
        if (_ringBgs) for (var r = 0; r < _ringBgs.length; r++) _ringBgs[r].style.stroke = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
        for (var i = 0; i < svgDayEls.length; i++) {
            var active = i === dayIndex;
            svgDayEls[i].setAttribute('r', active ? '4' : '2.5');
            svgDayEls[i].setAttribute('opacity', active ? '1' : '0.2');
            svgDayEls[i].style.filter = active ? 'url(#dotGlow)' : 'none';
        }
        var svgDay = $('svgDay'), svgTime = $('svgTime'), svgSec = $('svgSec'), svgDate = $('svgDate');
        if (svgDay) svgDay.textContent = DAYS_SHORT_RU[dayIndex];
        if (svgTime) svgTime.textContent = pad(h) + ':' + pad(m);
        if (svgSec) svgSec.textContent = pad(s);
        if (svgDate) svgDate.textContent = now.getDate() + ' ' + MONTHS_SHORT[now.getMonth()];
        var svgSt = $('svgSt');
        if (svgSt) {
            var w = dayIndex >= 5;
            var periods = w ? ['Выходной · Ночь','Выходной · Утро','Выходной · День','Выходной · Вечер'] : ['Ночь','Утро','День','Вечер'];
            svgSt.textContent = periods[h < 6 ? 0 : h < 12 ? 1 : h < 18 ? 2 : 3];
        }
    }
    var _announceTimer = null;
    function announceTime(text) {
        if (!el.timeAnnounce) return;
        clearTimeout(_announceTimer);
        _announceTimer = setTimeout(function() { el.timeAnnounce.textContent = text; }, 500);
    }

    // ===== Тикер =====
    function tick(ts) {
        if (!_pageVisible) { _tickRafId = requestAnimationFrame(tick); return; }
        if (ts - lastTick < 500) { _tickRafId = requestAnimationFrame(tick); return; }
        lastTick = ts;
        var now = new Date();
        var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
        if (el.hdrH) el.hdrH.textContent = pad(h);
        if (el.hdrM) el.hdrM.textContent = pad(m);
        if (el.hdrS) el.hdrS.textContent = pad(s);
        if (el.hdrDate && prevHour !== h) el.hdrDate.textContent = now.getDate() + ' ' + MONTHS[now.getMonth()].substring(0,3) + '.';
        var dayIndex = relDay(now);
        if (prevDay !== dayIndex) { prevDay = dayIndex; haptic('light'); checkRecurring(now); }
        if (prevHour !== h) { prevHour = h; announceTime(pad(h) + ':' + pad(m) + ', ' + DAYS[dayIndex]); }
        // Обновляем только видимые карточки
        visibleCards.forEach(function(card) { updateCardCounter(card); });
        checkNotifications(now);
        _tickRafId = requestAnimationFrame(tick);
    }
    function tickSvg() {
        if (_pageVisible) updateClockSvg();
        _tickSvgRafId = requestAnimationFrame(tickSvg);
    }

    // ===== Скролл =====
    var _scrollRaf = null, _cachedWrapH = 0, _cachedWrap = null, _cachedSectionHdr = null;
    function handleScroll() {
        if (_scrollRaf) return;
        _scrollRaf = requestAnimationFrame(function() {
            _scrollRaf = null;
            if (!el.scrollPage || !el.hdrClock) return;
            var st = el.scrollPage.scrollTop;
            var totalH = _cachedWrapH + 16;
            var p1 = Math.max(0, Math.min(1, st / (totalH * 0.6)));
            var e1 = p1 * p1 * (3 - 2 * p1);
            var hdrOp = Math.max(0, Math.min(1, (st - totalH * 0.3) / (totalH * 0.3)));
            el.hdrClock.style.opacity = hdrOp;
            el.hdrClock.style.transform = 'translateY(' + (1 - hdrOp) * -6 + 'px)';
            if (hdrOp > 0.01) el.hdrClock.classList.add('show');
            else el.hdrClock.classList.remove('show');
            if (_cachedWrap) {
                _cachedWrap.style.transform = 'scale(' + (1 - e1 * 0.12) + ') translateY(' + (e1 * -10) + 'px)';
                _cachedWrap.style.opacity = Math.max(0, 1 - e1 * 1.2);
            }
            if (_cachedSectionHdr) {
                if (timers.length === 0 && st < totalH * 0.4) _cachedSectionHdr.classList.add('shifted');
                else _cachedSectionHdr.classList.remove('shifted');
            }
        });
    }
    function initScroll() {
        if (!el.scrollPage) return;
        _cachedWrap = el.clockSection ? el.clockSection.querySelector('.clock-wrap') : null;
        _cachedSectionHdr = document.querySelector('.section-hdr');
        requestAnimationFrame(function() { _cachedWrapH = _cachedWrap ? _cachedWrap.scrollHeight : 300; });
        el.scrollPage.addEventListener('scroll', handleScroll, { passive: true });
        var rt = null;
        window.addEventListener('resize', function() {
            clearTimeout(rt);
            rt = setTimeout(function() {
                _cachedWrapH = _cachedWrap ? _cachedWrap.scrollHeight : 300;
                handleScroll();
            }, 150);
        }, { passive: true });
    }

    // ===== Клавиатура и SW =====
    function initKeyboard() {
        document.addEventListener('keydown', function(e) {
            if (document.querySelector('.modal.show')) return;
            var tag = document.activeElement ? document.activeElement.tagName : '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openModal(); }
        });
    }
    function initSW() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            reg.addEventListener('updatefound', function() {
                var nw = reg.installing;
                if (nw) nw.addEventListener('statechange', function() {
                    if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                        toast.info('Доступно обновление. Обновите страницу.');
                    }
                });
            });
        }).catch(function() {});
    }
    function hideSplash() {
        setTimeout(function() { if (el.splash) el.splash.classList.add('hide'); }, 1000);
        setTimeout(function() { if (el.splash) el.splash.style.display = 'none'; }, 1500);
    }

    // ===== Changelog =====
    function loadChangelog() {
        fetch('./changelog.json', { cache: 'no-cache' })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var versions = Object.keys(data).sort().reverse();
                if (!versions.length) return;
                var v = versions[0];
                var info = data[v];
                var titleEl = $('changelogTitle');
                var listEl = $('changelogList');
                if (titleEl) titleEl.textContent = 'Версия ' + v + (info.title ? ' — ' + info.title : '');
                if (listEl && info.items) {
                    listEl.innerHTML = info.items.map(function(i) { return '<li>' + esc(i) + '</li>'; }).join('');
                }
            })
            .catch(function() {
                var l = $('changelogList');
                if (l) l.innerHTML = '<li>Версия ' + (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '2026.09.11') + '</li>';
            });
    }

    // ===== Подсказка о перетаскивании =====
    function showDragTip() {
        var tip = $('dragTip');
        if (!tip) return;
        tip.classList.add('show');
        var close = tip.querySelector('.tip-close');
        if (close) close.onclick = function() { tip.classList.remove('show'); };
        setTimeout(function() { tip.classList.remove('show'); }, 6000);
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
        for (var id in map) {
            var btn = $(id);
            if (btn && !btn.innerHTML.trim()) btn.innerHTML = ICONS[map[id]];
        }
        document.querySelectorAll('[data-close-modal]').forEach(function(btn) {
            if (!btn.innerHTML.trim()) btn.innerHTML = ICONS.close;
        });
        var addBtn = $('addTimerBtn');
        if (addBtn && !addBtn.textContent.includes('Добавить')) addBtn.innerHTML = ICONS.plus + ' <span>Добавить</span>';
        var pi = $('pullIndicator');
        if (pi) pi.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M12 17V3M7 12l5 5 5-5"/></svg>';
        var sBtns = { exportBtn: 'exportDown', importBtn: 'importUp', clearBtn: 'trash', exportIcsBtn: 'calendar' };
        for (var id2 in sBtns) {
            var btn2 = $(id2);
            if (btn2) {
                var txt = btn2.textContent.trim();
                btn2.innerHTML = ICONS[sBtns[id2]] + ' ' + esc(txt);
            }
        }
    }
    function renderTemplateButtons() {
        var container = document.querySelector('.tpl-grid');
        if (!container) return;
        container.innerHTML = '';
        for (var key in TPL_DATA) {
            var btn = document.createElement('button');
            btn.className = 'tpl-btn';
            btn.dataset.tpl = key;
            btn.textContent = TPL_DATA[key].title;
            container.appendChild(btn);
        }
    }

    // ===== Инициализация элементов =====
    function initElements() {
        svgDayDots = $('dayDots');
        el.timerList = $('timerList'); el.empty = $('emptyState');
        el.timerModal = $('timerModal'); el.timerForm = $('timerForm');
        el.timerTitle = $('timerTitle'); el.timerDate = $('timerDate');
        el.timerType = $('timerType'); el.mTitle = $('mTitle');
        el.titleCnt = $('titleCnt'); el.fModal = $('fModal');
        el.sModal = $('sModal'); el.notif = $('notif');
        el.importFile = $('importFile'); el.clockSection = $('clockSection');
        el.addFirstBtn = $('addFirstBtn'); el.saveMoreBtn = $('saveMoreBtn');
        el.saveMoreRow = $('saveMoreRow'); el.resetTimeBtn = $('resetTimeBtn');
        el.themeSel = $('themeSel'); el.animToggle = $('animToggle');
        el.installBtn = $('installBtn'); el.timeAnnounce = $('timeAnnounce');
        el.offlineDot = $('offlineDot'); el.splash = $('splash');
        el.scrollPage = $('scrollPage'); el.confirmModal = $('confirmModal');
        el.datePickerBtn = $('datePickerBtn'); el.hdrSub = $('hdrSub');
        el.hdrClock = $('hdrClock'); el.hdrH = $('hdrH'); el.hdrM = $('hdrM');
        el.hdrS = $('hdrS'); el.hdrDate = $('hdrDate');
        el.searchInput = $('searchInput'); el.searchClear = $('searchClear');
        el.searchBar = $('searchBar'); el.searchBtn = $('searchBtn');
        el.addTimerBtn = $('addTimerBtn'); el.timerCategory = $('timerCategory');
        el.timerRecurring = $('timerRecurring'); el.timerReminder = $('timerReminder');
        el.catSelect = $('catSelect'); el.sortSelect = $('sortSelect');
        el.filterBtn = $('filterBtn');
        el.dateFormat = $('dateFormat');
        el.weekStart = $('weekStart');
        el.groupToggle = $('groupToggle');
        el.notifEnabled = $('notifEnabled');
        el.notifPeriod = $('notifPeriod');
        el.praiseEnabled = $('praiseEnabled');
        el.praiseInterval = $('praiseInterval');
        el.progressBarWrap = $('progressBarWrap');
        el.progressLabel = $('progressLabel');
        el.progressFill = $('progressFill');
    }

    // ===== События =====
    function bindEvents() {
        document.addEventListener('click', function(e) {
            var cb = e.target.closest('[data-close-modal]');
            if (cb) {
                var mid = cb.dataset.closeModal;
                var m = $(mid);
                if (m) dismissModal(m);
                if (mid === 'sModal') closeSettings();
                history.back();
                return;
            }
            var backdrop = e.target.closest('.modal.show');
            if (backdrop && !e.target.closest('.mc')) {
                dismissModal(backdrop);
                if (backdrop.id === 'sModal') closeSettings();
                history.back();
            }
        });
        if (el.addFirstBtn) el.addFirstBtn.onclick = openModal;
        if (el.heroAddBtn) el.heroAddBtn.onclick = openModal;
        if (el.addTimerBtn) el.addTimerBtn.onclick = function() { haptic('light'); openModal(); };
        if (el.timerForm) el.timerForm.onsubmit = function(e) { e.preventDefault(); saveTimer(false); };
        if (el.saveMoreBtn) el.saveMoreBtn.onclick = function() { saveTimer(true); };
        if (el.timerTitle) el.timerTitle.oninput = function() {
            var l = el.timerTitle.value.length;
            if (l > MAX_TITLE) el.timerTitle.value = el.timerTitle.value.slice(0, MAX_TITLE);
            el.titleCnt.textContent = Math.min(l, MAX_TITLE) + '/' + MAX_TITLE;
        };
        if (el.datePickerBtn) el.datePickerBtn.onclick = function() {
            el.timerDate.showPicker ? el.timerDate.showPicker() : el.timerDate.click();
        };
        if (el.resetTimeBtn) el.resetTimeBtn.onclick = function() {
            el.timerDate.value = localISO(new Date()); autoDetectType(); haptic('light');
        };
        if (el.timerDate) el.timerDate.addEventListener('change', autoDetectType);
        // Цвета
        var cp = $('colorPick'), ccb = $('customColorBtn'), hp = $('hslPopup');
        var hH = $('hslH'), hS = $('hslS'), hL = $('hslL');
        var hHv = $('hslHVal'), hSv = $('hslSVal'), hLv = $('hslLVal');
        var hPrev = $('hslPreview'), hApply = $('hslApply');
        function updHsl() {
            var h = parseInt(hH.value), s = parseInt(hS.value), l = parseInt(hL.value);
            hHv.textContent = h; hSv.textContent = s; hLv.textContent = l;
            if (hPrev) hPrev.style.background = hslToHex(h,s,l);
        }
        if (hH) hH.oninput = updHsl; if (hS) hS.oninput = updHsl; if (hL) hL.oninput = updHsl;
        if (hApply) hApply.onclick = function() {
            var hex = hslToHex(parseInt(hH.value), parseInt(hS.value), parseInt(hL.value));
            selectedColor = hex; selectColor(hex);
            hp.classList.remove('show'); haptic('light');
        };
        if (ccb) ccb.onclick = function() {
            var hsl = hexToHsl(selectedColor);
            hH.value = hsl.h; hS.value = hsl.s; hL.value = hsl.l;
            updHsl(); hp.classList.add('show');
        };
        if (cp) cp.onclick = function(e) {
            var b = e.target.closest('.cp');
            if (!b || b === ccb) return;
            selectedColor = b.dataset.c;
            var all = cp.querySelectorAll('.cp');
            for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
            b.classList.add('active');
        };
        // Фильтры
        if (el.filterBtn) el.filterBtn.onclick = function() {
            if (el.sortSelect) el.sortSelect.value = sortBy;
            if (el.catSelect) el.catSelect.value = categoryFilter;
            var fs = $('fSelect'); if (fs) fs.value = filter;
            el.fModal.classList.add('show');
            trapFocus(el.fModal);
        };
        var applyFBtn = $('applyFBtn');
        if (applyFBtn) applyFBtn.onclick = function() {
            var fs = $('fSelect'); if (fs) filter = fs.value;
            if (el.sortSelect) sortBy = el.sortSelect.value;
            if (el.catSelect) categoryFilter = el.catSelect.value;
            saveSettings();
            el.fModal.classList.remove('show');
            releaseFocus();
            render();
        };
        var eib = $('exportImgBtn');
        if (eib) eib.onclick = function() { el.fModal.classList.remove('show'); releaseFocus(); exportImage(); };
        if (el.searchBtn) el.searchBtn.onclick = function() {
            haptic('light');
            var o = el.searchBar.classList.toggle('open');
            el.searchBtn.classList.toggle('active', o);
            if (o) setTimeout(function() { el.searchInput.focus(); }, 200);
            else { el.searchInput.value = ''; searchQuery = ''; if (el.searchClear) el.searchClear.classList.add('hidden'); render(); }
        };
        if (el.searchInput) {
            el.searchInput.oninput = function() {
                searchQuery = this.value.trim();
                if (el.searchClear) el.searchClear.classList.toggle('hidden', !searchQuery);
                render();
            };
            el.searchInput.onkeydown = function(e) { if (e.key === 'Escape') el.searchBtn.click(); };
        }
        if (el.searchClear) el.searchClear.onclick = function() {
            el.searchInput.value = ''; searchQuery = ''; this.classList.add('hidden'); render();
        };
        if (el.catSelect) el.catSelect.onchange = function() { categoryFilter = el.catSelect.value; render(); };
        // Clear
        var clearBtn = $('clearBtn');
        if (clearBtn) clearBtn.onclick = function() {
            showConfirm('Очистить всё', 'Удалить все счётчики?', 'Удалить', function() {
                timers = []; notifiedTimers = {}; dnd = {};
                saveNotified(); saveDnd(); saveTimers(); render();
                toast.info('Очищено');
            });
        };
        requestNotifPermission();
        var eb = $('exportBtn'); if (eb) eb.onclick = exportJSON;
        var ib = $('importBtn'); if (ib) ib.onclick = importTimers;
        var eics = $('exportIcsBtn'); if (eics) eics.onclick = exportICS;
        if (el.importFile) el.importFile.onchange = handleImport;
        // Settings
        if (el.themeSel) el.themeSel.onchange = function() { applyTheme(el.themeSel.value); saveSettings(); };
        if (el.animToggle) el.animToggle.onchange = function() { anims = el.animToggle.checked; applyAnimPref(); saveSettings(); };
        if (el.dateFormat) el.dateFormat.onchange = function() { saveSettings(); render(); };
        if (el.weekStart) el.weekStart.onchange = saveSettings;
        if (el.groupToggle) el.groupToggle.onchange = function() { saveSettings(); render(); };
        if (el.notifEnabled) el.notifEnabled.onchange = saveSettings;
        if (el.notifPeriod) el.notifPeriod.onchange = saveSettings;
        if (el.praiseEnabled) el.praiseEnabled.onchange = saveSettings;
        if (el.praiseInterval) el.praiseInterval.onchange = saveSettings;
        // Switch-rows
        document.querySelectorAll('.sr:has(.sw)').forEach(function(row) {
            row.addEventListener('click', function(e) {
                if (e.target.closest('.sw') || e.target.tagName === 'INPUT') return;
                var inp = this.querySelector('.sw input');
                if (inp) { inp.checked = !inp.checked; inp.dispatchEvent(new Event('change', { bubbles: true })); haptic('light'); }
            });
        });
        // Клик по карточкам
        if (el.timerList) {
            el.timerList.addEventListener('click', function(e) {
                var btn = e.target.closest('.ibtn-s');
                if (!btn || btn.closest('.tc-handle')) return;
                var id = btn.dataset.id;
                haptic('light');
                if (btn.classList.contains('mute')) toggleDnd(id);
                else if (btn.classList.contains('ed')) editTimer(id);
                else if (btn.classList.contains('dl')) delTimer(id);
                else if (btn.classList.contains('dup')) {
                    var orig = timers.find(function(x) { return x.id === id; });
                    if (orig) {
                        var copy = JSON.parse(JSON.stringify(orig));
                        copy.id = genId();
                        copy.title = orig.title + ' (копия)';
                        copy.created = Date.now();
                        timers.push(copy);
                        saveTimers(); render();
                        toast.success('Дублировано'); haptic('success');
                    }
                }
            });
        }
        document.querySelectorAll('.quick-date').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var off = parseInt(this.dataset.offset);
                var now = new Date(); now.setDate(now.getDate() + off);
                el.timerDate.value = localISO(now); autoDetectType(); haptic('light');
            });
        });
        // Шаблоны
        var tplGrid = document.querySelector('.tpl-grid');
        if (tplGrid) tplGrid.addEventListener('click', function(e) {
            var btn = e.target.closest('.tpl-btn');
            if (!btn) return;
            var tpl = TPL_DATA[btn.dataset.tpl];
            if (!tpl) return;
            el.fModal.classList.remove('show'); releaseFocus();
            editId = null;
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
            selectedColor = tpl.color; selectColor(selectedColor);
            if (el.saveMoreRow) el.saveMoreRow.style.display = 'none';
            lastFocus = document.activeElement;
            history.pushState({ modal: true }, '');
            el.timerModal.classList.add('show');
            trapFocus(el.timerModal);
            setTimeout(function() { el.timerTitle.focus(); }, 100);
        });
        var sb = $('settingsBtn');
        if (sb) sb.onclick = function() { haptic('light'); openSettings(); };
        // Online/offline
        window.onoffline = function() {
            if (el.offlineDot) el.offlineDot.classList.add('show');
            toast.error('Нет соединения');
        };
        window.ononline = function() {
            if (el.offlineDot) el.offlineDot.classList.remove('show');
            toast.success('Соединение восстановлено');
        };
        if (!navigator.onLine && el.offlineDot) el.offlineDot.classList.add('show');
        document.onkeydown = function(e) {
            if (e.key === 'Escape') {
                var ms = document.querySelectorAll('.modal.show');
                if (ms.length) { ms.forEach(function(m) { dismissModal(m); }); history.back(); }
            }
        };
        window.onpopstate = function(e) {
            if (!e.state || !e.state.modal) {
                var ms = document.querySelectorAll('.modal.show');
                if (ms.length) ms.forEach(function(m) { dismissModal(m); });
            }
        };
        window.addEventListener('storage', function(e) {
            if (e.key === STORAGE_TIMERS) { loadTimers(); render(); }
            else if (e.key === STORAGE_SETTINGS) loadSettings();
            else if (e.key === STORAGE_NOTIFIED) loadNotified();
            else if (e.key === STORAGE_DND) loadDnd();
        });
        // Install prompt
        window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault(); installPrompt = e;
            if (el.installBtn) el.installBtn.classList.remove('hidden');
        });
        if (el.installBtn) el.installBtn.onclick = function() {
            if (!installPrompt) return;
            installPrompt.prompt();
            installPrompt.userChoice.then(function(r) {
                if (r.outcome === 'accepted') { installPrompt = null; el.installBtn.classList.add('hidden'); }
            });
        };
    }

    // ===== Init =====
    function init() {
        ensureRoundRect();
        initElements();
        injectIcons();
        var aboutVer = $('aboutVer');
        if (aboutVer && typeof APP_VERSION !== 'undefined') aboutVer.textContent = 'v' + APP_VERSION;
        initClockSvg();
        _ringBgs = document.querySelectorAll('.ring-bg');
        loadSettings();
        loadTimers();
        loadNotified();
        loadDnd();
        // IntersectionObserver
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
        _tickRafId = requestAnimationFrame(tick);
        _tickSvgRafId = requestAnimationFrame(tickSvg);
        render();
        initScroll();
        initKeyboard();
        initDrag();
        initCardSwipe();
        initPullToRefresh();
        initModalSwipe();
        initSW();
        hideSplash();
        loadChangelog();
        var sh = document.querySelector('.section-hdr');
        if (sh && timers.length === 0) sh.classList.add('shifted');
        if (location.search.indexOf('action=add') !== -1) {
            history.replaceState(null, '', location.pathname);
            setTimeout(openModal, 600);
        }
        var storedVersion = localStorage.getItem(STORAGE_LAST_UPDATE);
        if (storedVersion !== APP_VERSION) {
            setTimeout(function() {
                showDragTip();
                localStorage.setItem(STORAGE_LAST_UPDATE, APP_VERSION);
            }, 2500);
        }
        document.addEventListener('visibilitychange', function() {
            _pageVisible = !document.hidden;
            if (!document.hidden) render();
        });
        window.addEventListener('focus', function() { render(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();