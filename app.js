(function () {
    'use strict';

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
        edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg>',
        trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>',
        clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
        calendarPicker: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>',
        exportDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
        importUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>',
        image: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
        colorPlus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>',
        searchClear: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>'
    };

    var STORAGE_TIMERS = 'timeflow_timers';
    var STORAGE_SETTINGS = 'timeflow_settings';
    var MAX_TITLE = 50;

    var timers = [];
    var editId = null;
    var filter = 'all';
    var sortBy = 'created';
    var categoryFilter = 'all';
    var searchQuery = '';
    var notifiedTimers = {};
    var prevDay = -1;
    var prevHour = -1;
    var lastTick = 0;
    var anims = true;
    var selectedColor = DEFAULT_COLOR;
    var installPrompt = null;
    var focusTrap = null;
    var lastFocus = null;
    var dragSrcId = null;
    var touchDragCard = null;
    var touchLongPress = null;
    var touchClone = null;

    var svgDayDots;
    var svgDayEls = [];
    var isTouch = window.matchMedia('(pointer: coarse)').matches;

    var el = {};

    function $(id) { return document.getElementById(id); }

    function initElements() {
        svgDayDots = $('dayDots');
        el.timerList = $('timerList'); el.empty = $('emptyState');
        el.timerModal = $('timerModal'); el.timerForm = $('timerForm');
        el.timerTitle = $('timerTitle'); el.timerDate = $('timerDate');
        el.timerType = $('timerType'); el.mTitle = $('mTitle');
        el.titleCnt = $('titleCnt'); el.fModal = $('fModal');
        el.sModal = $('sModal'); el.notif = $('notif');
        el.importFile = $('importFile');
        el.clockSection = $('clockSection');
        el.timersSection = $('timersSection');
        el.addFirstBtn = $('addFirstBtn');
        el.closeModal = $('closeModal'); el.cancelBtn = $('cancelBtn');
        el.saveMoreBtn = $('saveMoreBtn'); el.saveMoreRow = $('saveMoreRow');
        el.resetTimeBtn = $('resetTimeBtn');
        el.themeSel = $('themeSel'); el.animToggle = $('animToggle');
        el.installBtn = $('installBtn');
        el.timeAnnounce = $('timeAnnounce'); el.offlineDot = $('offlineDot');
        el.splash = $('splash'); el.scrollPage = $('scrollPage');
        el.confirmModal = $('confirmModal'); el.datePickerBtn = $('datePickerBtn');
        el.hdrSub = $('hdrSub'); el.hdrClock = $('hdrClock');
        el.hdrH = $('hdrH'); el.hdrM = $('hdrM');
        el.hdrS = $('hdrS'); el.hdrDate = $('hdrDate');
        el.searchInput = $('searchInput');
        el.searchClear = $('searchClear');
        el.searchBar = $('searchBar');
        el.searchBtn = $('searchBtn');
        el.addTimerBtn = $('addTimerBtn');
        el.timerCategory = $('timerCategory');
        el.timerRecurring = $('timerRecurring');
        el.timerReminder = $('timerReminder');
        el.catSelect = $('catSelect');
        el.sortSelect = $('sortSelect');
    }

    function injectIcons() {
        var map = {
            settingsBtn: 'settings',
            installBtn: 'install',
            addTimerBtn: 'plus',
            searchBtn: 'search',
            filterBtn: 'filter',
            closeModal: 'close',
            cancelBtn: 'close',
            closeFModal: 'close',
            closeSModal: 'close',
            datePickerBtn: 'calendarPicker',
            resetTimeBtn: 'clock',
            searchClear: 'searchClear',
            customColorBtn: 'colorPlus',
            exportImgBtn: 'image',
            addFirstBtn: 'plus'
        };
        for (var id in map) {
            var btn = $(id);
            if (btn && !btn.innerHTML.trim()) btn.innerHTML = ICONS[map[id]];
        }
        var addBtn = $('addTimerBtn');
        if (addBtn && !addBtn.textContent.includes('Добавить')) addBtn.innerHTML = ICONS.plus + ' <span>Добавить</span>';
        var pullIndicator = $('pullIndicator');
        if (pullIndicator) pullIndicator.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M12 17V3M7 12l5 5 5-5"/></svg>';
        var sBtns = {
            exportBtn: 'exportDown',
            importBtn: 'importUp',
            clearBtn: 'trash'
        };
        for (var id2 in sBtns) {
            var btn2 = $(id2);
            if (btn2) {
                var txt = btn2.textContent.trim();
                btn2.innerHTML = ICONS[sBtns[id2]] + ' ' + esc(txt);
            }
        }
    }

    function init() {
        initElements();
        injectIcons();
        var aboutVer = document.getElementById('aboutVer');
        if (aboutVer && typeof APP_VERSION !== 'undefined') aboutVer.textContent = 'v' + APP_VERSION;
        initClockSvg();
        loadSettings();
        loadTimers();
        bindEvents();
        tick(performance.now());
        requestAnimationFrame(function tickSvg() { updateClockSvg(); requestAnimationFrame(tickSvg); });
        render();
        initScroll();
        initKeyboard();
        initSW();
        hideSplash();
        var sh = document.querySelector('.section-hdr');
        if (sh && timers.length === 0) sh.classList.add('shifted');
    }

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var SVG_CX = 100;
    var SVG_CY = 100;
    var svgDayRingFill;
    var svgRingEl;
    var svgRingGradStop1, svgRingGradStop2;
    var svgDayGradStop1, svgDayGradStop2;
    var SEC_RING_R = 88;
    var DAY_RING_R = 76;
    var SEC_RING_CIRCUMFERENCE = 2 * Math.PI * SEC_RING_R;
    var DAY_RING_CIRCUMFERENCE = 2 * Math.PI * DAY_RING_R;
    var DAYS_SHORT_RU = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    var MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    function lightenHex(hex, pct) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        r = Math.min(255, Math.round(r + (255 - r) * pct));
        g = Math.min(255, Math.round(g + (255 - g) * pct));
        b = Math.min(255, Math.round(b + (255 - b) * pct));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function initClockSvg() {
        svgRingEl = document.getElementById('ringProgress');
        svgDayRingFill = document.getElementById('dayRingFill');
        svgRingGradStop1 = document.querySelector('#ringGrad stop:first-child');
        svgRingGradStop2 = document.querySelector('#ringGrad stop:last-child');
        svgDayGradStop1 = document.querySelector('#dayRingGrad stop:first-child');
        svgDayGradStop2 = document.querySelector('#dayRingGrad stop:last-child');

        if (svgRingEl) {
            svgRingEl.style.strokeDasharray = SEC_RING_CIRCUMFERENCE;
            svgRingEl.style.strokeDashoffset = SEC_RING_CIRCUMFERENCE;
        }
        if (svgDayRingFill) {
            svgDayRingFill.style.strokeDasharray = DAY_RING_CIRCUMFERENCE;
            svgDayRingFill.style.strokeDashoffset = DAY_RING_CIRCUMFERENCE;
        }

        // Day dots
        svgDayDots.innerHTML = '';
        svgDayEls = [];
        var dotR = 65;
        for (var i = 0; i < 7; i++) {
            var angle = (i * 2 * Math.PI / 7) - Math.PI / 2;
            var x = SVG_CX + dotR * Math.cos(angle);
            var y = SVG_CY + dotR * Math.sin(angle);
            var dot = document.createElementNS(SVG_NS, 'circle');
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.setAttribute('r', '3');
            dot.setAttribute('fill', COLORS[i]);
            dot.setAttribute('opacity', '0.15');
            svgDayDots.appendChild(dot);
            svgDayEls.push(dot);
        }

        // Tick marks for seconds
        var ticksGroup = document.getElementById('svgTicks');
        if (ticksGroup) {
            ticksGroup.innerHTML = '';
            var tickR = 88;
            for (var t = 0; t < 60; t++) {
                var a = (t * 2 * Math.PI / 60) - Math.PI / 2;
                var isMajor = t % 5 === 0;
                var len = isMajor ? 5 : 2;
                var x1 = SVG_CX + (tickR - len) * Math.cos(a);
                var y1 = SVG_CY + (tickR - len) * Math.sin(a);
                var x2 = SVG_CX + tickR * Math.cos(a);
                var y2 = SVG_CY + tickR * Math.sin(a);
                var line = document.createElementNS(SVG_NS, 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', isMajor ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)');
                line.setAttribute('stroke-width', isMajor ? '1' : '0.5');
                line.setAttribute('stroke-linecap', 'round');
                ticksGroup.appendChild(line);
            }
        }
    }

    function updateClockSvg() {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        var s = now.getSeconds();
        var ms = now.getMilliseconds();
        var dayIndex = relDay(now);
        var dayColor = COLORS[dayIndex];
        var isLight = document.body.classList.contains('lt');

        // Seconds ring
        var secProgress = (s + ms / 1000) / 60;
        if (svgRingEl) {
            svgRingEl.style.strokeDashoffset = SEC_RING_CIRCUMFERENCE * (1 - secProgress);
        }
        if (svgRingGradStop1) svgRingGradStop1.setAttribute('stop-color', dayColor);
        if (svgRingGradStop2) svgRingGradStop2.setAttribute('stop-color', lightenHex(dayColor, 0.3));

        // Day progress ring (24h)
        var dayMs = h * 3600000 + m * 60000 + s * 1000 + ms;
        var dayProgress = dayMs / 86400000;
        if (svgDayRingFill) {
            svgDayRingFill.style.strokeDashoffset = DAY_RING_CIRCUMFERENCE * (1 - dayProgress);
        }
        if (svgDayGradStop1) svgDayGradStop1.setAttribute('stop-color', dayColor);
        if (svgDayGradStop2) svgDayGradStop2.setAttribute('stop-color', lightenHex(dayColor, 0.25));

        // Ring backgrounds
        var ringBgs = document.querySelectorAll('.ring-bg');
        for (var r = 0; r < ringBgs.length; r++) {
            ringBgs[r].style.stroke = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
        }

        // Day dots
        for (var i = 0; i < svgDayEls.length; i++) {
            var isActive = i === dayIndex;
            svgDayEls[i].setAttribute('r', isActive ? '4' : '2.5');
            svgDayEls[i].setAttribute('opacity', isActive ? '1' : '0.2');
            svgDayEls[i].style.filter = isActive ? 'url(#dotGlow)' : 'none';
        }

        // SVG text elements
        var svgDay = document.getElementById('svgDay');
        var svgTime = document.getElementById('svgTime');
        var svgSec = document.getElementById('svgSec');
        var svgDate = document.getElementById('svgDate');

        if (svgDay) svgDay.textContent = DAYS_SHORT_RU[dayIndex];
        if (svgTime) svgTime.textContent = pad(h) + ':' + pad(m);
        if (svgSec) svgSec.textContent = pad(s);
        if (svgDate) svgDate.textContent = now.getDate() + ' ' + MONTHS_SHORT[now.getMonth()];

        // Time of day badge
        var svgSt = document.getElementById('svgSt');
        if (svgSt) {
            var isWeekend = dayIndex >= 5;
            var periods = isWeekend
                ? ['Выходной · Ночь', 'Выходной · Утро', 'Выходной · День', 'Выходной · Вечер']
                : ['Ночь', 'Утро', 'День', 'Вечер'];
            svgSt.textContent = periods[h < 6 ? 0 : h < 12 ? 1 : h < 18 ? 2 : 3];
        }
    }

    function hideSplash() {
        setTimeout(function () { if (el.splash) el.splash.classList.add('hide'); }, 1000);
        setTimeout(function () { if (el.splash) el.splash.style.display = 'none'; }, 1500);
    }

    function loadSettings() {
        try {
            var s = JSON.parse(localStorage.getItem(STORAGE_SETTINGS) || '{}');
            var t = s.theme || 'system';
            applyTheme(t);
            if (el.themeSel) el.themeSel.value = t;
            if (s.anims === false) { anims = false; if (el.animToggle) el.animToggle.checked = false; }
            if (s.sortBy) sortBy = s.sortBy;
            if (s.categoryFilter) categoryFilter = s.categoryFilter;
            applyAnimPref();
        } catch (e) { }
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_SETTINGS, JSON.stringify({
                theme: el.themeSel ? el.themeSel.value : 'system',
                anims: el.animToggle ? el.animToggle.checked : true,
                sortBy: sortBy,
                categoryFilter: categoryFilter
            }));
        } catch (e) { }
    }

    function applyTheme(t) {
        document.body.classList.remove('lt');
        if (t === 'light') document.body.classList.add('lt');
        else if (t === 'system' && window.matchMedia('(prefers-color-scheme:light)').matches) document.body.classList.add('lt');
    }

    function applyAnimPref() {
        if (!anims) document.body.classList.add('no-anim');
        else document.body.classList.remove('no-anim');
    }

    function loadTimers() {
        try { timers = JSON.parse(localStorage.getItem(STORAGE_TIMERS) || '[]'); } catch (e) { timers = []; }
    }

    function saveTimers() {
        try { localStorage.setItem(STORAGE_TIMERS, JSON.stringify(timers)); } catch (e) { }
    }

    function genId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    var _userTapped = false;
    function markUserGesture() { _userTapped = true; }
    document.addEventListener('pointerdown', markUserGesture, { once: true, passive: true });
    document.addEventListener('keydown', markUserGesture, { once: true, passive: true });

    function haptic(type) {
        if (!navigator.vibrate || !_userTapped) return;
        try {
            if (type === 'error') navigator.vibrate([15, 50, 15]);
            else if (type === 'success') navigator.vibrate([10, 30, 10]);
            else if (type === 'medium') navigator.vibrate(20);
            else navigator.vibrate(10);
        } catch (e) { }
    }

    function notify(msg, type) {
        var n = el.notif;
        if (!n) return;
        n.textContent = msg;
        n.className = 'notif show' + (type === 'error' ? ' err' : '');
        haptic(type === 'error' ? 'error' : 'light');
        clearTimeout(n._t);
        n._t = setTimeout(function () { n.classList.remove('show'); }, 2800);
    }

    var _announceTimer = null;
    function announceTime(text) {
        if (!el.timeAnnounce) return;
        clearTimeout(_announceTimer);
        _announceTimer = setTimeout(function () { el.timeAnnounce.textContent = text; }, 500);
    }

    function initSW() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('./sw.js').then(function (reg) {
            reg.addEventListener('updatefound', function () {
                var nw = reg.installing;
                if (nw) nw.addEventListener('statechange', function () {
                    if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                        notify('Доступно обновление. Обновите страницу.');
                    }
                });
            });
        }).catch(function () { });
    }

    function tick(ts) {
        if (ts - lastTick < 500) { requestAnimationFrame(tick); return; }
        lastTick = ts;

        var now = new Date();
        var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds(), ms = now.getMilliseconds();

        if (el.hdrH) el.hdrH.textContent = pad(h);
        if (el.hdrM) el.hdrM.textContent = pad(m);
        if (el.hdrS) el.hdrS.textContent = pad(s);

        if (el.hdrDate && prevHour !== h) {
            el.hdrDate.textContent = now.getDate() + ' ' + MONTHS[now.getMonth()].substring(0, 3) + '.';
        }

        var dayIndex = relDay(now);
        if (prevDay !== dayIndex) {
            prevDay = dayIndex;
            haptic('light');
            checkRecurring(now);
        }

        if (prevHour !== h) {
            prevHour = h;
            announceTime(pad(h) + ':' + pad(m) + ', ' + DAYS[dayIndex]);
        }

        var counters = document.querySelectorAll('.tc-counter-val');
        for (var x = 0; x < counters.length; x++) {
            var ts2 = parseInt(counters[x].dataset.ts);
            var tp2 = counters[x].dataset.type;
            if (counters[x] && ts2) counters[x].textContent = fmtCounter(ts2, tp2);
        }

        checkNotifications(now);

        requestAnimationFrame(tick);
    }

    function localISO(d) {
        var off = d.getTimezoneOffset();
        var local = new Date(d.getTime() - off * 60000);
        return local.toISOString().slice(0, 16);
    }

    function relDay(d) { return d.getDay() === 0 ? 6 : d.getDay() - 1; }

    function autoDetectType() {
        if (!el.timerDate || !el.timerType) return;
        var val = el.timerDate.value;
        if (!val) return;
        var selected = new Date(val).getTime();
        var now = Date.now();
        el.timerType.value = selected < now ? 'elapsed' : 'countdown';
    }

    var CAT_NAMES = { work: 'Работа', health: 'Здоровье', personal: 'Личное', study: 'Учёба', travel: 'Путешествия' };
    var REC_NAMES = { weekly: 'Еженед.', monthly: 'Ежемес.', yearly: 'Ежегод.' };
    var TPL_DATA = {
        sobriety: { title: 'Не курю', type: 'elapsed', color: '#30d158', category: 'health', recurring: '', reminder: false },
        work: { title: 'На работе уже', type: 'elapsed', color: '#0a84ff', category: 'work', recurring: '', reminder: false },
        vacation: { title: 'До отпуска', type: 'countdown', color: '#ff8c00', category: 'travel', recurring: '', reminder: true },
        language: { title: 'Изучение языка', type: 'elapsed', color: '#bf5af2', category: 'study', recurring: '', reminder: false },
        fitness: { title: 'Фитнес streak', type: 'elapsed', color: '#ff6b6b', category: 'health', recurring: '', reminder: false },
        savings: { title: 'Накопления', type: 'elapsed', color: '#5cd66e', category: 'personal', recurring: '', reminder: false }
    };

    function requestNotifPermission() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    function sendNotification(title, body) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        try {
            new Notification(title, { body: body, icon: './icon-192.png', badge: './icon-192.png', tag: 'chronoflow' });
        } catch (e) { }
    }

    function checkNotifications(now) {
        var ts = now.getTime();
        for (var i = 0; i < timers.length; i++) {
            var t = timers[i];
            if (t.type !== 'countdown' || !t.reminder) continue;
            var diff = t.date - ts;
            if (diff > 0 && diff < 86400000 && !notifiedTimers[t.id]) {
                notifiedTimers[t.id] = true;
                sendNotification('ChronoFlow', t.title + ' — завтра!');
            } else if (diff <= 0 && diff > -3600000 && !notifiedTimers[t.id + '_done']) {
                notifiedTimers[t.id + '_done'] = true;
                sendNotification('ChronoFlow', t.title + ' наступил!');
            }
        }
    }

    function checkRecurring(now) {
        var changed = false;
        for (var i = 0; i < timers.length; i++) {
            var t = timers[i];
            if (!t.recurring || t.type !== 'countdown') continue;
            if (now.getTime() > t.date) {
                var d = new Date(t.date);
                if (t.recurring === 'weekly') d.setDate(d.getDate() + 7);
                else if (t.recurring === 'monthly') d.setMonth(d.getMonth() + 1);
                else if (t.recurring === 'yearly') d.setFullYear(d.getFullYear() + 1);
                t.date = d.getTime();
                changed = true;
            }
        }
        if (changed) { saveTimers(); render(); }
    }

    function exportImage() {
        var card = el.timerList.querySelector('.tc-card');
        if (!card) { notify('Нет счётчиков', 'error'); return; }
        var cvs = document.createElement('canvas');
        cvs.width = 800; cvs.height = 600;
        var c = cvs.getContext('2d');
        if (!c.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
                if (typeof r === 'number') r = [r, r, r, r];
                this.moveTo(x + r[0], y);
                this.lineTo(x + w - r[1], y);
                this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
                this.lineTo(x + w, y + h - r[2]);
                this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
                this.lineTo(x + r[3], y + h);
                this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
                this.lineTo(x, y + r[0]);
                this.quadraticCurveTo(x, y, x + r[0], y);
                this.closePath();
            };
        }
        c.fillStyle = '#000'; c.fillRect(0, 0, 800, 600);
        var grad = c.createLinearGradient(0, 0, 800, 600);
        grad.addColorStop(0, '#0a84ff'); grad.addColorStop(1, '#bf5af2');
        c.fillStyle = grad; c.globalAlpha = 0.15; c.fillRect(0, 0, 800, 600); c.globalAlpha = 1;
        c.fillStyle = '#fff'; c.font = '700 36px -apple-system, sans-serif'; c.textAlign = 'center';
        c.fillText('ChronoFlow', 400, 60);
        c.font = '400 16px -apple-system, sans-serif'; c.fillStyle = 'rgba(255,255,255,0.6)';
        c.fillText(new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }), 400, 90);
        var items = el.timerList.querySelectorAll('.tc-card');
        var y = 130;
        var count = Math.min(items.length, 8);
        for (var i = 0; i < count; i++) {
            var el2 = items[i].querySelector('.tc-counter-val');
            var titleEl = items[i].querySelector('.tc-title');
            var typeEl = items[i].querySelector('.tc-type');
            if (!el2 || !titleEl) continue;
            c.fillStyle = 'rgba(255,255,255,0.08)';
            c.beginPath(); c.roundRect(40, y, 720, 50, 12); c.fill();
            c.fillStyle = '#fff'; c.font = '600 15px -apple-system, sans-serif'; c.textAlign = 'left';
            c.fillText(titleEl.textContent, 60, y + 22);
            c.fillStyle = el2.style.color || '#fff'; c.font = '300 18px monospace'; c.textAlign = 'right';
            c.fillText(el2.textContent, 740, y + 28);
            if (typeEl) {
                c.fillStyle = 'rgba(255,255,255,0.4)'; c.font = '600 10px -apple-system, sans-serif';
                c.fillText(typeEl.textContent, 740, y + 44);
            }
            y += 58;
        }
        cvs.toBlob(function (blob) {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url; a.download = 'chronoflow-' + new Date().toISOString().slice(0, 10) + '.png';
            a.click(); URL.revokeObjectURL(url);
            haptic('success'); notify('Изображение сохранено');
        });
    }

    function declension(value, forms) {
        value = Math.abs(value);
        var n = value % 100;
        var idx = (n >= 5 && n <= 20) ? 2 : (n % 10 === 1) ? 0 : (n % 10 >= 2 && n % 10 <= 4) ? 1 : 2;
        return value + ' ' + forms[idx];
    }

    function diffToParts(diff) {
        var sc = Math.floor(diff / 1000);
        var mn = Math.floor(sc / 60);
        var hr = Math.floor(mn / 60);
        var dy = Math.floor(hr / 24);
        return { sc: sc, mn: mn, hr: hr, dy: dy };
    }

    function parseDiff(timestamp, type) {
        var now = Date.now();
        var diff = type === 'countdown' ? timestamp - now : now - timestamp;
        var negative = diff < 0;
        return { parts: diffToParts(Math.abs(diff)), negative: negative };
    }

    function fmtCounter(timestamp, type) {
        var p = parseDiff(timestamp, type);
        var d = p.parts;
        var remDy = d.dy;
        var y = Math.floor(remDy / 365); remDy -= y * 365;
        var mo = Math.floor(remDy / 30.44); remDy -= Math.floor(mo * 30.44);
        var dd = Math.floor(remDy);
        var rh = d.hr % 24;
        var rm = d.mn % 60;
        var rs = d.sc % 60;
        var parts = [];
        if (y > 0) parts.push(declension(y, ['год', 'года', 'лет']));
        if (mo > 0) parts.push(declension(mo, ['месяц', 'месяца', 'месяцев']));
        if (dd > 0) parts.push(declension(dd, ['день', 'дня', 'дней']));
        if (rh > 0) parts.push(declension(rh, ['час', 'часа', 'часов']));
        if (rm > 0 || parts.length > 0) parts.push(declension(rm, ['минуту', 'минуты', 'минут']));
        parts.push(declension(rs, ['секунду', 'секунды', 'секунд']));
        if (p.negative && type === 'countdown') return parts.join(' ') + ' назад';
        return parts.join(' ');
    }

    function render() {
        var list = el.timerList;
        var empty = el.empty;
        var filtered = timers.slice();

        if (filter !== 'all') {
            filtered = filtered.filter(function (x) { return x.type === filter; });
        }

        if (categoryFilter !== 'all') {
            if (categoryFilter === '') {
                filtered = filtered.filter(function (x) { return !x.category; });
            } else {
                filtered = filtered.filter(function (x) { return x.category === categoryFilter; });
            }
        }

        if (searchQuery) {
            var q = searchQuery.toLowerCase();
            filtered = filtered.filter(function (x) { return x.title.toLowerCase().indexOf(q) !== -1; });
        }

        if (sortBy === 'name') {
            filtered.sort(function (a, b) { return a.title.localeCompare(b.title, 'ru'); });
        } else if (sortBy === 'date') {
            filtered.sort(function (a, b) { return a.date - b.date; });
        } else {
            filtered.sort(function (a, b) { return (b.created || 0) - (a.created || 0); });
        }

        if (filtered.length === 0) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
            empty.querySelector('h3').textContent = 'Каждый день на счету';
            empty.querySelector('p').textContent = 'Не курю 45 дней. До отпуска 128 дней. На новой работе 2 года. Создайте свой первый счётчик и начните считать то, что важно именно вам.';
            empty.querySelector('.btn-p').textContent = 'Создать счётчик';
            empty.querySelector('.btn-p').onclick = openModal;
            return;
        }

        empty.classList.add('hidden');
        var sectionHdr = document.querySelector('.section-hdr');
        if (sectionHdr) sectionHdr.classList.remove('shifted');
        var frag = document.createDocumentFragment();

        for (var i = 0; i < filtered.length; i++) {
            var t = filtered[i];
            var isElapsed = t.type === 'elapsed';

            var card = document.createElement('div');
            card.className = 'tc-card';
            card.style.setProperty('--card-color', t.color || DEFAULT_COLOR);
            card.dataset.id = t.id;
            card.setAttribute('role', 'listitem');
            card.setAttribute('draggable', 'true');

            var dt = new Date(t.date);
            var dateStr = dt.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            var typeLabel = isElapsed ? 'Прошло' : 'Осталось';
            var typeClass = isElapsed ? 'elapsed' : 'countdown';
            var catLabel = '';
            if (t.category && CAT_NAMES[t.category]) {
                catLabel = '<span class="cat-tag ' + t.category + '">' + CAT_NAMES[t.category] + '</span>';
            }
            var recurringLabel = '';
            if (t.recurring && REC_NAMES[t.recurring]) {
                recurringLabel = '<span class="recurring-badge">' + REC_NAMES[t.recurring] + '</span>';
            }

            card.innerHTML =
                '<div class="tc-swipe-actions">' +
                    '<button class="tc-swipe-edit" data-id="' + t.id + '" aria-label="Редактировать"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg>Изменить</button>' +
                    '<button class="tc-swipe-delete" data-id="' + t.id + '" aria-label="Удалить"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>Удалить</button>' +
                '</div>' +
                '<div class="tc-swipe-content">' +
                    '<div class="tc-handle" aria-label="Перетащить" title="Перетащить"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg></div>' +
                    '<div class="tc-body">' +
                        '<div class="tc-row-top">' +
                            '<div class="tc-title">' + esc(t.title) + '</div>' +
                            '<div class="tc-actions">' +
                                '<button class="ibtn-s ed" data-id="' + t.id + '" title="Редактировать" aria-label="Редактировать"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg></button>' +
                                '<button class="ibtn-s dl" data-id="' + t.id + '" title="Удалить" aria-label="Удалить"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="tc-badges">' + catLabel + recurringLabel + '<span class="tc-type ' + typeClass + '">' + typeLabel + '</span></div>' +
                        '<div class="tc-counter"><div class="tc-counter-val" data-ts="' + t.date + '" data-type="' + t.type + '" style="color:' + t.color + '"></div></div>' +
                        '<div class="tc-date"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + dateStr + '</div>' +
                    '</div>' +
                '</div>';

            frag.appendChild(card);
        }

        list.innerHTML = '';
        list.appendChild(frag);
    }

    function openModal() {
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
        setTimeout(function () { el.timerTitle.focus(); }, 100);
    }

    function closeModal() {
        el.timerModal.classList.remove('show');
        var hslPopup = document.getElementById('hslPopup');
        if (hslPopup) hslPopup.classList.remove('show');
        releaseFocus();
        if (lastFocus) lastFocus.focus();
        history.back();
    }

    function saveTimer(more) {
        var title = el.timerTitle.value.trim();
        var dateVal = el.timerDate.value;
        var type = el.timerType ? el.timerType.value : 'elapsed';

        if (!title) {
            el.timerTitle.classList.add('error');
            notify('Введите название', 'error');
            setTimeout(function () { el.timerTitle.classList.remove('error'); }, 500);
            return;
        }
        if (!dateVal) {
            el.timerDate.classList.add('error');
            notify('Укажите дату', 'error');
            setTimeout(function () { el.timerDate.classList.remove('error'); }, 500);
            return;
        }

        var timestamp = new Date(dateVal).getTime();

        if (editId) {
            var idx = timers.findIndex(function (x) { return x.id === editId; });
            if (idx !== -1) {
                timers[idx].title = title;
                timers[idx].date = timestamp;
                timers[idx].type = type;
                timers[idx].color = selectedColor;
                timers[idx].category = el.timerCategory ? el.timerCategory.value : '';
                timers[idx].recurring = el.timerRecurring ? el.timerRecurring.value : '';
                timers[idx].reminder = el.timerReminder ? el.timerReminder.checked : false;
            }
            notify('Обновлено');
        } else {
            timers.push({ id: genId(), title: title, date: timestamp, type: type, color: selectedColor, created: Date.now(), category: el.timerCategory ? el.timerCategory.value : '', recurring: el.timerRecurring ? el.timerRecurring.value : '', reminder: el.timerReminder ? el.timerReminder.checked : false });
            notify('Добавлено');
        }

        haptic('success');
        saveTimers();
        if (more && !editId) {
            el.timerTitle.value = '';
            el.timerDate.value = '';
            el.titleCnt.textContent = '0/' + MAX_TITLE;
            selectedColor = DEFAULT_COLOR;
            selectColor(selectedColor);
            setTimeout(function () { el.timerTitle.focus(); }, 100);
        } else {
            closeModal();
        }
        render();
        
    }

    function editTimer(id) {
        var t = timers.find(function (x) { return x.id === id; });
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
        setTimeout(function () { el.timerTitle.focus(); }, 100);
    }

    var lastDel = null;
    var undoTimer = null;

    function delTimer(id) {
        haptic('medium');
        var idx = timers.findIndex(function (x) { return x.id === id; });
        if (idx === -1) return;
        var timer = timers[idx];

        var card = el.timerList.querySelector('.tc-card[data-id="' + id + '"]');
        if (card) {
            card.classList.add('removing');
            setTimeout(function () {
                var freshIdx = timers.findIndex(function (x) { return x.id === id; });
                if (freshIdx === -1) return;
                lastDel = { timer: timers[freshIdx], index: freshIdx };
                timers.splice(freshIdx, 1);
                saveTimers();
                render();
                showUndo();
                
            }, 300);
        } else {
            lastDel = { timer: timer, index: idx };
            timers.splice(idx, 1);
            saveTimers();
            render();
            showUndo();
            
        }
    }

    function showUndo() {
        var t = document.getElementById('undoToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'undoToast';
            t.className = 'undo-toast';
            t.innerHTML = '<span>Удалено</span><button class="undo-btn" id="undoBtn">Отменить</button>';
            document.body.appendChild(t);
            document.getElementById('undoBtn').onclick = undo;
        }
        clearTimeout(undoTimer);
        t.classList.add('show');
        undoTimer = setTimeout(function () { t.classList.remove('show'); lastDel = null; }, 5000);
    }

    function undo() {
        if (!lastDel) return;
        timers.splice(lastDel.index, 0, lastDel.timer);
        lastDel = null;
        clearTimeout(undoTimer);
        var t = document.getElementById('undoToast');
        if (t) t.classList.remove('show');
        saveTimers();
        render();
        
        haptic('light');
        notify('Восстановлено');
    }

    function showConfirm(title, msg, okText, cb) {
        var m = el.confirmModal;
        $('confirmTitle').textContent = title;
        $('confirmMsg').textContent = msg;
        $('confirmOk').textContent = okText || 'Удалить';
        lastFocus = document.activeElement;
        m.classList.add('show');
        trapFocus(m);
        $('confirmOk').onclick = function () {
            m.classList.remove('show'); releaseFocus();
            if (lastFocus) lastFocus.focus(); cb();
        };
        $('confirmCancel').onclick = function () {
            m.classList.remove('show'); releaseFocus();
            if (lastFocus) lastFocus.focus();
        };
    }

    function exportJSON() {
        if (!timers.length) { notify('Нет данных', 'error'); return; }
        var blob = new Blob([JSON.stringify(timers, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'chronoflow-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        haptic('success');
        notify('Экспортировано');
    }

    function importTimers() { el.importFile.click(); }

    function handleImport(e) {
        var f = e.target.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            try {
                var data = JSON.parse(ev.target.result);
                if (!Array.isArray(data)) throw 0;
                var valid = data.filter(function (x) { return x && typeof x.title === 'string' && typeof x.date === 'number'; });
                if (!valid.length) throw 0;
                showConfirm('Импорт', 'Импортировать ' + valid.length + ' счётчиков?', 'Импортировать', function () {
                    timers = timers.concat(valid);
                    saveTimers(); render(); 
                    haptic('success');
                    notify('Импортировано ' + valid.length);
                });
            } catch (err) { notify('Ошибка формата', 'error'); }
        };
        reader.readAsText(f);
        e.target.value = '';
    }

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        var a = s * Math.min(l, 1 - l);
        function f(n) {
            var k = (n + h / 30) % 12;
            var color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        }
        return '#' + f(0) + f(8) + f(4);
    }

    function hexToHsl(hex) {
        var r = parseInt(hex.slice(1, 3), 16) / 255;
        var g = parseInt(hex.slice(3, 5), 16) / 255;
        var b = parseInt(hex.slice(5, 7), 16) / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
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
        var customBtn = document.getElementById('customColorBtn');
        if (!matched && customBtn) {
            for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
            customBtn.classList.add('active');
            customBtn.style.setProperty('--c', c);
            customBtn.style.background = c;
        } else if (customBtn) {
            customBtn.classList.remove('active');
            customBtn.style.background = '';
            customBtn.style.removeProperty('--c');
        }
    }

    function openSettings() {
        lastFocus = document.activeElement;
        history.pushState({ modal: true }, '');
        el.sModal.classList.add('show');
        trapFocus(el.sModal);
    }

    function closeSettings() {
        el.sModal.classList.remove('show');
        releaseFocus();
        if (lastFocus) lastFocus.focus();
    }

    var _scrollRaf = null;
    var _cachedWrapH = 0;
    var _cachedWrap = null;
    var _cachedSectionHdr = null;

    function initScroll() {
        if (!el.scrollPage) return;
        el.scrollPage.addEventListener('scroll', handleScroll, { passive: true });
        _cachedWrap = el.clockSection ? el.clockSection.querySelector('.clock-wrap') : null;
        _cachedSectionHdr = document.querySelector('.section-hdr');
        requestAnimationFrame(function () {
            _cachedWrapH = _cachedWrap ? _cachedWrap.scrollHeight : 300;
        });
        var resizeTimer = null;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                _cachedWrapH = _cachedWrap ? _cachedWrap.scrollHeight : 300;
                if (_cachedWrap) _cachedWrap.style.cssText = '';
                handleScroll();
            }, 150);
        }, { passive: true });
    }

    function handleScroll() {
        if (_scrollRaf) return;
        _scrollRaf = requestAnimationFrame(function () {
            _scrollRaf = null;
            if (!el.scrollPage || !el.hdrClock) return;

            var scrollTop = el.scrollPage.scrollTop;
            var totalH = _cachedWrapH + 16;

            var p1 = Math.max(0, Math.min(1, scrollTop / (totalH * 0.6)));
            var ease1 = p1 * p1 * (3 - 2 * p1);

            var hdrOpacity = Math.max(0, Math.min(1, (scrollTop - totalH * 0.3) / (totalH * 0.3)));
            el.hdrClock.style.opacity = hdrOpacity;
            el.hdrClock.style.transform = 'translateY(' + (1 - hdrOpacity) * -6 + 'px)';
            if (hdrOpacity > 0.01) el.hdrClock.classList.add('show');
            else el.hdrClock.classList.remove('show');

            if (_cachedWrap) {
                var s = 1 - ease1 * 0.12;
                var ty = ease1 * -10;
                var o = Math.max(0, 1 - ease1 * 1.2);
                _cachedWrap.style.transform = 'scale(' + s + ') translateY(' + ty + 'px)';
                _cachedWrap.style.opacity = o;
            }

            if (_cachedSectionHdr) {
                if (timers.length === 0) {
                    if (scrollTop > totalH * 0.4) _cachedSectionHdr.classList.remove('shifted');
                    else _cachedSectionHdr.classList.add('shifted');
                } else {
                    _cachedSectionHdr.classList.remove('shifted');
                }
            }
        });
    }

    function trapFocus(container) {
        var focusable = container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0], last = focusable[focusable.length - 1];
        focusTrap = function (e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
            else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
        };
        document.addEventListener('keydown', focusTrap);
    }

    function releaseFocus() {
        if (focusTrap) { document.removeEventListener('keydown', focusTrap); focusTrap = null; }
    }

    function initKeyboard() {
        document.addEventListener('keydown', function (e) {
            if (document.querySelector('.modal.show')) return;
            if (e.key === 'n' || e.key === 'N') {
                if (e.ctrlKey || e.metaKey) return;
                e.preventDefault();
                openModal();
            }
        });
    }

    function clearDragIndicators() {
        var cards = el.timerList ? el.timerList.querySelectorAll('.tc-card') : [];
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.remove('drag-over-top', 'drag-over-bottom');
        }
    }

    function reorderTimers(srcId, targetId, insertBefore) {
        var srcIdx = timers.findIndex(function (x) { return x.id === srcId; });
        var targetIdx = timers.findIndex(function (x) { return x.id === targetId; });
        if (srcIdx === -1 || targetIdx === -1 || srcIdx === targetIdx) return;
        var moved = timers.splice(srcIdx, 1)[0];
        targetIdx = timers.findIndex(function (x) { return x.id === targetId; });
        if (insertBefore) timers.splice(targetIdx, 0, moved);
        else timers.splice(targetIdx + 1, 0, moved);
        saveTimers();
        render();
    }

    function bindEvents() {
        if (el.addFirstBtn) el.addFirstBtn.onclick = openModal;
        if (el.addTimerBtn) el.addTimerBtn.onclick = function () { haptic('light'); openModal(); };
        if (el.closeModal) el.closeModal.onclick = closeModal;
        if (el.cancelBtn) el.cancelBtn.onclick = closeModal;
        if (el.timerForm) el.timerForm.onsubmit = function (e) { e.preventDefault(); saveTimer(); };
        if (el.saveMoreBtn) el.saveMoreBtn.onclick = function () { saveTimer(true); };
        if (el.timerTitle) el.timerTitle.oninput = function () {
            var l = el.timerTitle.value.length;
            if (l > MAX_TITLE) el.timerTitle.value = el.timerTitle.value.slice(0, MAX_TITLE);
            el.titleCnt.textContent = Math.min(l, MAX_TITLE) + '/' + MAX_TITLE;
        };

        if (el.datePickerBtn) el.datePickerBtn.onclick = function () {
            el.timerDate.showPicker ? el.timerDate.showPicker() : el.timerDate.click();
        };

        if (el.resetTimeBtn) el.resetTimeBtn.onclick = function () {
            el.timerDate.value = localISO(new Date());
            autoDetectType();
            haptic('light');
        };

        if (el.timerDate) el.timerDate.addEventListener('change', autoDetectType);

        var colorPick = document.getElementById('colorPick');
        var customColorBtn = document.getElementById('customColorBtn');
        var hslPopup = document.getElementById('hslPopup');
        var hslH = document.getElementById('hslH');
        var hslS = document.getElementById('hslS');
        var hslL = document.getElementById('hslL');
        var hslHVal = document.getElementById('hslHVal');
        var hslSVal = document.getElementById('hslSVal');
        var hslLVal = document.getElementById('hslLVal');
        var hslPreview = document.getElementById('hslPreview');
        var hslApply = document.getElementById('hslApply');

        function updateHslPopup() {
            var h = parseInt(hslH.value), s = parseInt(hslS.value), l = parseInt(hslL.value);
            hslHVal.textContent = h;
            hslSVal.textContent = s;
            hslLVal.textContent = l;
            var hex = hslToHex(h, s, l);
            if (hslPreview) hslPreview.style.background = hex;
            hslH.style.setProperty('--range-color', 'hsl(' + h + ',' + s + '%,' + l + '%)');
            hslS.style.setProperty('--range-color', 'hsl(' + h + ',' + s + '%,' + l + '%)');
            hslL.style.setProperty('--range-color', 'hsl(' + h + ',' + s + '%,' + l + '%)');
        }

        function openHslPopup(color) {
            var hsl = hexToHsl(color);
            hslH.value = hsl.h;
            hslS.value = hsl.s;
            hslL.value = hsl.l;
            updateHslPopup();
            hslPopup.classList.add('show');
        }

        if (hslH) hslH.oninput = updateHslPopup;
        if (hslS) hslS.oninput = updateHslPopup;
        if (hslL) hslL.oninput = updateHslPopup;

        if (hslApply) hslApply.onclick = function () {
            var hex = hslToHex(parseInt(hslH.value), parseInt(hslS.value), parseInt(hslL.value));
            selectedColor = hex;
            selectColor(hex);
            hslPopup.classList.remove('show');
            haptic('light');
        };

        if (colorPick) colorPick.onclick = function (e) {
            var cp = e.target.closest('.cp');
            if (!cp) return;
            if (cp === customColorBtn) {
                openHslPopup(selectedColor);
                return;
            }
            selectedColor = cp.dataset.c;
            var all = colorPick.querySelectorAll('.cp');
            for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
            cp.classList.add('active');
        };

        var filterBtn = $('filterBtn');
        if (filterBtn) filterBtn.onclick = function () {
            var fs = $('fSelect');
            var ss = $('sortSelect');
            var cs = $('catSelect');
            if (fs) fs.value = filter;
            if (ss) ss.value = sortBy;
            if (cs) cs.value = categoryFilter;
            el.fModal.classList.add('show');
            trapFocus(el.fModal);
        };

        var closeFModal = $('closeFModal');
        if (closeFModal) closeFModal.onclick = function () { el.fModal.classList.remove('show'); releaseFocus(); if (lastFocus) lastFocus.focus(); };

        var applyFBtn = $('applyFBtn');
        if (applyFBtn) applyFBtn.onclick = function () {
            var fs = $('fSelect');
            var ss = $('sortSelect');
            var cs = $('catSelect');
            if (fs) filter = fs.value;
            if (ss) sortBy = ss.value;
            if (cs) categoryFilter = cs.value;
            saveSettings();
            el.fModal.classList.remove('show');
            releaseFocus();
            render();
        };

        var exportImgBtn = $('exportImgBtn');
        if (exportImgBtn) exportImgBtn.onclick = function () {
            el.fModal.classList.remove('show');
            releaseFocus();
            exportImage();
        };

        var tplBtns = document.querySelectorAll('.tpl-btn');
        for (var ti = 0; ti < tplBtns.length; ti++) {
            tplBtns[ti].onclick = function () {
                var tpl = TPL_DATA[this.dataset.tpl];
                if (!tpl) return;
                el.fModal.classList.remove('show');
                releaseFocus();
                editId = null;
                el.mTitle.textContent = 'Новый счётчик';
                el.timerTitle.value = tpl.title;
                var now = new Date();
                if (tpl.type === 'countdown') {
                    now.setDate(now.getDate() + 30);
                }
                el.timerDate.value = localISO(now);
                if (el.timerType) el.timerType.value = tpl.type;
                if (el.timerCategory) el.timerCategory.value = tpl.category || '';
                if (el.timerRecurring) el.timerRecurring.value = tpl.recurring || '';
                if (el.timerReminder) el.timerReminder.checked = tpl.reminder || false;
                el.titleCnt.textContent = tpl.title.length + '/' + MAX_TITLE;
                selectedColor = tpl.color;
                selectColor(selectedColor);
                if (el.saveMoreRow) el.saveMoreRow.style.display = 'none';
                lastFocus = document.activeElement;
                history.pushState({ modal: true }, '');
                el.timerModal.classList.add('show');
                trapFocus(el.timerModal);
                setTimeout(function () { el.timerTitle.focus(); }, 100);
            };
        }

        if (el.searchBtn) {
            el.searchBtn.onclick = function () {
                haptic('light');
                var isOpen = el.searchBar.classList.toggle('open');
                el.searchBtn.classList.toggle('active', isOpen);
                if (isOpen) {
                    setTimeout(function () { el.searchInput.focus(); }, 200);
                } else {
                    el.searchInput.value = '';
                    searchQuery = '';
                    if (el.searchClear) el.searchClear.classList.add('hidden');
                    render();
                }
            };
        }

        if (el.searchInput) {
            el.searchInput.oninput = function () {
                searchQuery = this.value.trim();
                if (el.searchClear) el.searchClear.classList.toggle('hidden', !searchQuery);
                render();
            };
            el.searchInput.onkeydown = function (e) {
                if (e.key === 'Escape') {
                    el.searchBtn.click();
                }
            };
        }
        if (el.searchClear) {
            el.searchClear.onclick = function () {
                el.searchInput.value = '';
                searchQuery = '';
                this.classList.add('hidden');
                render();
            };
        }

        if (el.catSelect) {
            el.catSelect.onchange = function () {
                categoryFilter = el.catSelect.value;
                render();
            };
        }

        var clearBtn = $('clearBtn');
        if (clearBtn) clearBtn.onclick = function () {
            showConfirm('Очистить всё', 'Удалить все счётчики?', 'Удалить', function () {
                timers = [];
                saveTimers();
                render();
                
                notify('Очищено');
            });
        };

        requestNotifPermission();

        var exportBtn = $('exportBtn');
        if (exportBtn) exportBtn.onclick = exportJSON;

        var importBtn = $('importBtn');
        if (importBtn) importBtn.onclick = importTimers;

        if (el.themeSel) el.themeSel.onchange = function () { applyTheme(el.themeSel.value); saveSettings(); };
        if (el.animToggle) el.animToggle.onchange = function () { anims = el.animToggle.checked; applyAnimPref(); saveSettings(); };

        var srRows = document.querySelectorAll('.sr:has(.sw)');
        for (var i = 0; i < srRows.length; i++) {
            srRows[i].addEventListener('click', function (e) {
                if (e.target.closest('.sw') || e.target.tagName === 'INPUT') return;
                var input = this.querySelector('.sw input');
                if (input) {
                    input.checked = !input.checked;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    haptic('light');
                }
            });
        }

        var closeSModal = $('closeSModal');
        if (closeSModal) closeSModal.onclick = function () { closeSettings(); };

        if (el.importFile) el.importFile.onchange = handleImport;

        if (el.timerList) el.timerList.onclick = function (e) {
            var btn = e.target.closest('.ibtn-s');
            if (!btn || btn.closest('.tc-handle')) return;
            var id = btn.dataset.id;
            haptic('light');
            if (btn.classList.contains('ed')) editTimer(id);
            else if (btn.classList.contains('dl')) delTimer(id);
        };

        if (el.timerList) {
            el.timerList.addEventListener('dragstart', function (e) {
                var card = e.target.closest('.tc-card');
                if (!card) return;
                dragSrcId = card.dataset.id;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.dataset.id);
            });

            el.timerList.addEventListener('dragover', function (e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                var card = e.target.closest('.tc-card');
                if (!card || card.dataset.id === dragSrcId) return;
                clearDragIndicators();
                var rect = card.getBoundingClientRect();
                var mid = rect.top + rect.height / 2;
                if (e.clientY < mid) card.classList.add('drag-over-top');
                else card.classList.add('drag-over-bottom');
            });

            el.timerList.addEventListener('dragleave', function (e) {
                var card = e.target.closest('.tc-card');
                if (card) { card.classList.remove('drag-over-top', 'drag-over-bottom'); }
            });

            el.timerList.addEventListener('drop', function (e) {
                e.preventDefault();
                var targetCard = e.target.closest('.tc-card');
                if (!targetCard || !dragSrcId) return;
                var targetId = targetCard.dataset.id;
                if (targetId === dragSrcId) return;
                var rect = targetCard.getBoundingClientRect();
                var mid = rect.top + rect.height / 2;
                var insertBefore = e.clientY < mid;
                reorderTimers(dragSrcId, targetId, insertBefore);
                clearDragIndicators();
            });

            el.timerList.addEventListener('dragend', function () {
                dragSrcId = null;
                clearDragIndicators();
            });

            el.timerList.addEventListener('touchstart', function (e) {
                if (!isTouch) return;
                var handle = e.target.closest('.tc-handle');
                if (!handle) return;
                var card = handle.closest('.tc-card');
                if (!card) return;
                e.preventDefault();
                touchDragCard = card;
                touchLongPress = setTimeout(function () {
                    card.classList.add('dragging');
                    haptic('medium');
                    touchClone = card.cloneNode(true);
                    touchClone.className = 'tc-card touch-clone';
                    touchClone.style.cssText = 'position:fixed;z-index:5000;pointer-events:none;width:' + card.offsetWidth + 'px;opacity:.85;transform:rotate(2deg);';
                    document.body.appendChild(touchClone);
                }, 200);
            }, { passive: false });

            el.timerList.addEventListener('touchmove', function (e) {
                if (!isTouch || !touchDragCard || !touchClone) return;
                e.preventDefault();
                var touch = e.touches[0];
                touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
                touchClone.style.top = (touch.clientY - 20) + 'px';
                clearDragIndicators();
                var el2 = document.elementFromPoint(touch.clientX, touch.clientY);
                var targetCard = el2 ? el2.closest('.tc-card') : null;
                if (targetCard && targetCard !== touchDragCard) {
                    var rect = targetCard.getBoundingClientRect();
                    var mid = rect.top + rect.height / 2;
                    if (touch.clientY < mid) targetCard.classList.add('drag-over-top');
                    else targetCard.classList.add('drag-over-bottom');
                }
            }, { passive: false });

            el.timerList.addEventListener('touchend', function () {
                if (!isTouch) return;
                clearTimeout(touchLongPress);
                if (!touchDragCard) return;
                var overCard = el.timerList.querySelector('.drag-over-top, .drag-over-bottom');
                if (overCard) {
                    var insertBefore = overCard.classList.contains('drag-over-top');
                    reorderTimers(touchDragCard.dataset.id, overCard.dataset.id, insertBefore);
                }
                touchDragCard.classList.remove('dragging');
                if (touchClone && touchClone.parentNode) touchClone.parentNode.removeChild(touchClone);
                touchDragCard = null;
                touchClone = null;
                clearDragIndicators();
            });

            el.timerList.addEventListener('touchcancel', function () {
                if (!isTouch) return;
                clearTimeout(touchLongPress);
                if (touchDragCard) touchDragCard.classList.remove('dragging');
                if (touchClone && touchClone.parentNode) touchClone.parentNode.removeChild(touchClone);
                touchDragCard = null;
                touchClone = null;
                clearDragIndicators();
            });

        }

        initPullToRefresh();
        initModalSwipe();
        initCardSwipe();

        var settingsBtn = $('settingsBtn');
        if (settingsBtn) settingsBtn.onclick = function () { haptic('light'); openSettings(); };

        document.querySelectorAll('.modal').forEach(function (m) {
            m.onclick = function (e) {
                if (e.target === m) {
                    m.classList.remove('show');
                    releaseFocus();
                    if (lastFocus) lastFocus.focus();
                    if (m === el.sModal) closeSettings();
                }
            };
        });

        document.onkeydown = function (e) {
            if (e.key === 'Escape') {
                var ms = document.querySelectorAll('.modal.show');
                if (ms.length) {
                    ms.forEach(function (m) { m.classList.remove('show'); });
                    releaseFocus();
                    if (lastFocus) lastFocus.focus();
                    if (el.sModal && !el.sModal.classList.contains('show')) closeSettings();
                }
            }
        };

        window.onpopstate = function (e) {
            if (!e.state || !e.state.modal) {
                var ms = document.querySelectorAll('.modal.show');
                if (ms.length) {
                    ms.forEach(function (m) { m.classList.remove('show'); });
                    releaseFocus();
                    if (lastFocus) lastFocus.focus();
                }
            }
        };

        window.onoffline = function () {
            if (el.offlineDot) el.offlineDot.classList.add('show');
            notify('Нет соединения', 'error');
        };
        window.ononline = function () {
            if (el.offlineDot) el.offlineDot.classList.remove('show');
            notify('Соединение восстановлено');
        };
        if (!navigator.onLine && el.offlineDot) el.offlineDot.classList.add('show');
    }

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        installPrompt = e;
        if (el.installBtn) el.installBtn.classList.remove('hidden');
    });

    if (el.installBtn) el.installBtn.onclick = function () {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then(function (r) {
            if (r.outcome === 'accepted') {
                installPrompt = null;
                el.installBtn.classList.add('hidden');
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function initCardSwipe() {
        if (!el.timerList) return;
        var activeSwipe = null;
        var startX = 0;
        var startY = 0;
        var swiping = false;
        var isHorizontal = false;

        el.timerList.addEventListener('touchstart', function (e) {
            if (!isTouch) return;
            var content = e.target.closest('.tc-swipe-content');
            if (!content) return;
            var wrap = content.closest('.tc-card');
            if (!wrap) return;
            var handle = e.target.closest('.tc-handle');
            if (handle) return;
            var btn = e.target.closest('.tc-actions button, .tc-swipe-actions button');
            if (btn) return;

            if (activeSwipe && activeSwipe !== wrap) {
                resetSwipe(activeSwipe);
            }

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            swiping = false;
            isHorizontal = false;
            activeSwipe = wrap;
        }, { passive: true });

        el.timerList.addEventListener('touchmove', function (e) {
            if (!isTouch || !activeSwipe) return;
            var dx = e.touches[0].clientX - startX;
            var dy = e.touches[0].clientY - startY;

            if (!swiping && !isHorizontal) {
                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                    if (Math.abs(dx) > Math.abs(dy)) {
                        isHorizontal = true;
                        swiping = true;
                    } else {
                        activeSwipe = null;
                        return;
                    }
                }
                return;
            }

            if (!isHorizontal) return;
            e.preventDefault();

            var content = activeSwipe.querySelector('.tc-swipe-content');
            if (!content) return;
            var offset = Math.min(0, Math.max(-144, dx));
            content.classList.add('swiping');
            content.style.transform = 'translateX(' + offset + 'px)';
        }, { passive: false });

        el.timerList.addEventListener('touchend', function () {
            if (!isTouch || !activeSwipe) return;
            var content = activeSwipe.querySelector('.tc-swipe-content');
            if (!content) { activeSwipe = null; return; }
            content.classList.remove('swiping');
            var transform = content.style.transform;
            var match = transform.match(/translateX\((-?[\d.]+)px\)/);
            var dx = match ? parseFloat(match[1]) : 0;

            if (dx < -100) {
                content.style.transform = 'translateX(-144px)';
            } else {
                content.style.transform = '';
            }
            activeSwipe = null;
        }, { passive: true });

        el.timerList.addEventListener('touchcancel', function () {
            if (activeSwipe) {
                resetSwipe(activeSwipe);
                activeSwipe = null;
            }
        }, { passive: true });

        function resetSwipe(card) {
            var content = card.querySelector('.tc-swipe-content');
            if (content) {
                content.classList.remove('swiping');
                content.style.transform = '';
            }
        }

        document.addEventListener('touchstart', function (e) {
            if (!activeSwipe) return;
            if (!e.target.closest('.tc-card')) {
                resetSwipe(activeSwipe);
                activeSwipe = null;
            }
        }, { passive: true });

        el.timerList.addEventListener('click', function (e) {
            var editBtn = e.target.closest('.tc-swipe-edit');
            var deleteBtn = e.target.closest('.tc-swipe-delete');
            if (editBtn) {
                var id = editBtn.dataset.id;
                var card = editBtn.closest('.tc-card');
                if (card) resetSwipe(card);
                haptic('light');
                editTimer(id);
            } else if (deleteBtn) {
                var id2 = deleteBtn.dataset.id;
                var card2 = deleteBtn.closest('.tc-card');
                if (card2) resetSwipe(card2);
                delTimer(id2);
            }
        });
    }

    function initPullToRefresh() {
        if (!el.scrollPage || !isTouch) return;
        var indicator = $('pullIndicator');
        if (!indicator) return;
        var startY = 0;
        var pulling = false;

        el.scrollPage.addEventListener('touchstart', function (e) {
            if (el.scrollPage.scrollTop <= 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        }, { passive: true });

        el.scrollPage.addEventListener('touchmove', function (e) {
            if (!pulling) return;
            var dy = e.touches[0].clientY - startY;
            if (dy > 10 && el.scrollPage.scrollTop <= 0) {
                var progress = Math.min(1, dy / 80);
                indicator.style.height = Math.min(56, dy * 0.6) + 'px';
                indicator.style.opacity = progress;
                indicator.classList.add('active');
                var svg = indicator.querySelector('svg');
                if (svg) svg.style.transform = 'rotate(' + (progress * 180) + 'deg)';
            }
        }, { passive: true });

        el.scrollPage.addEventListener('touchend', function () {
            if (!pulling) return;
            pulling = false;
            var h = parseFloat(indicator.style.height) || 0;
            if (h >= 40) {
                haptic('medium');
                indicator.classList.add('refreshing');
                indicator.style.height = '56px';
                indicator.style.opacity = '1';
                var svg = indicator.querySelector('svg');
                if (svg) svg.style.transform = '';
                setTimeout(function () {
                    render();
                    
                    indicator.classList.remove('active', 'refreshing');
                    indicator.style.height = '';
                    indicator.style.opacity = '';
                    notify('Обновлено');
                }, 600);
            } else {
                indicator.classList.remove('active');
                indicator.style.height = '';
                indicator.style.opacity = '';
            }
        });

        el.scrollPage.addEventListener('touchcancel', function () {
            pulling = false;
            indicator.classList.remove('active');
            indicator.style.height = '';
            indicator.style.opacity = '';
        });
    }

    function initModalSwipe() {
        if (!isTouch) return;
        document.querySelectorAll('.modal').forEach(function (modal) {
            var mc = modal.querySelector('.mc');
            var handle = modal.querySelector('.mc-handle');
            if (!mc || !handle) return;
            var startY = 0;
            var swiping = false;

            handle.addEventListener('touchstart', function (e) {
                startY = e.touches[0].clientY;
                swiping = true;
                mc.classList.add('swiping');
            }, { passive: true });

            handle.addEventListener('touchmove', function (e) {
                if (!swiping) return;
                var dy = e.touches[0].clientY - startY;
                if (dy > 0) {
                    e.preventDefault();
                    mc.style.transform = 'translateY(' + dy + 'px)';
                    modal.style.opacity = Math.max(0, 1 - dy / 300);
                }
            }, { passive: false });

            handle.addEventListener('touchend', function () {
                if (!swiping) return;
                swiping = false;
                mc.classList.remove('swiping');
                var transform = mc.style.transform;
                var match = transform.match(/translateY\(([\d.]+)px\)/);
                var dy = match ? parseFloat(match[1]) : 0;

                if (dy > 120) {
                    haptic('medium');
                    modal.classList.remove('show');
                    releaseFocus();
                    if (lastFocus) lastFocus.focus();
                    if (modal === el.sModal) closeSettings();
                    history.back();
                }
                mc.style.transform = '';
                modal.style.opacity = '';
            });

            handle.addEventListener('touchcancel', function () {
                swiping = false;
                mc.classList.remove('swiping');
                mc.style.transform = '';
                modal.style.opacity = '';
            });
        });
    }

    var _pausedAt = null;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            _pausedAt = Date.now();
        } else {
            if (_pausedAt) {
                var gap = Date.now() - _pausedAt;
                if (gap > 5000) {
                    render();
                    
                }
                _pausedAt = null;
            }
        }
    });

    window.addEventListener('focus', function () {
        if (_pausedAt) {
            var gap = Date.now() - _pausedAt;
            if (gap > 5000) {
                render();
                
            }
            _pausedAt = null;
        }
    });

    if (!isTouch && el.scrollPage) {
        var _wheelTimer = null;
        el.scrollPage.addEventListener('wheel', function (e) {
            if (e.deltaY < 0 && el.scrollPage.scrollTop <= 0 && !_wheelTimer) {
                _wheelTimer = setTimeout(function () {
                    var indicator = $('pullIndicator');
                    if (indicator) {
                        haptic('medium');
                        indicator.classList.add('active', 'refreshing');
                        indicator.style.height = '56px';
                        indicator.style.opacity = '1';
                        setTimeout(function () {
                            render();
                            
                            indicator.classList.remove('active', 'refreshing');
                            indicator.style.height = '';
                            indicator.style.opacity = '';
            notify('Готово!');


                        }, 600);
                    }
                    _wheelTimer = null;
                }, 300);
            } else if (e.deltaY > 0) {
                clearTimeout(_wheelTimer);
                _wheelTimer = null;
            }
        }, { passive: true });
    }
})();
