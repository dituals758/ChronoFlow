(function () {
    'use strict';

    var COLORS = ['#6cc8ff', '#7eacff', '#b89cff', '#ff7eb3', '#ff8c00', '#5cd66e', '#ff6b6b'];
    var DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    var DAYS_SHORT = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    var STORAGE_TIMERS = 'timeflow_timers';
    var STORAGE_SETTINGS = 'timeflow_settings';
    var MAX_TITLE = 50;
    var CIRC = 2 * Math.PI * 46;

    var timers = [];
    var editId = null;
    var filter = 'all';
    var prevDay = -1;
    var prevHour = -1;
    var lastTick = 0;
    var colonElements = null;
    var anims = true;
    var selectedColor = '#60cdff';
    var installPrompt = null;
    var focusTrap = null;
    var lastFocus = null;
    var dragSrcId = null;
    var touchDragCard = null;
    var touchLongPress = null;
    var touchClone = null;

    var canvas, ctx, dpr;
    var canvasW = 0, canvasH = 0;

    var el = {};

    function $(id) { return document.getElementById(id); }

    function initElements() {
        el.h = $('h'); el.m = $('m'); el.s = $('s');
        el.dn = $('dn'); el.ds = $('ds'); el.st = $('st');
        el.clockFace = $('clockFace');
        canvas = $('clockCanvas');
        ctx = canvas ? canvas.getContext('2d') : null;
        el.timerList = $('timerList'); el.empty = $('emptyState');
        el.timerModal = $('timerModal'); el.timerForm = $('timerForm');
        el.timerTitle = $('timerTitle'); el.timerDate = $('timerDate');
        el.timerType = $('timerType'); el.mTitle = $('mTitle');
        el.titleCnt = $('titleCnt'); el.fModal = $('fModal');
        el.sModal = $('sModal'); el.notif = $('notif');
        el.importFile = $('importFile');
        el.clockSection = $('clockSection');
        el.timersSection = $('timersSection');
        el.addBtn = $('addBtn'); el.addFirstBtn = $('addFirstBtn');
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
    }

    function init() {
        initElements();
        initCanvas();
        loadSettings();
        loadTimers();
        bindEvents();
        tick(performance.now());
        render();
        updateClockStats();
        initScroll();
        initKeyboard();
        initSW();
        hideSplash();
        var sh = document.querySelector('.section-hdr');
        if (sh && timers.length === 0) sh.classList.add('shifted');
    }

    function initCanvas() {
        if (!canvas || !ctx) return;
        dpr = window.devicePixelRatio || 1;
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!canvas || !ctx) return;
        var box = canvas.parentElement;
        if (!box) return;
        var rect = box.getBoundingClientRect();
        canvasW = rect.width;
        canvasH = rect.height;
        canvas.width = canvasW * dpr;
        canvas.height = canvasH * dpr;
        canvas.style.width = canvasW + 'px';
        canvas.style.height = canvasH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getCSSVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function hexToRgba(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    function drawClock(now) {
        if (!ctx || !canvasW || !canvasH) return;

        var w = canvasW;
        var h = canvasH;
        var cx = w / 2;
        var cy = h / 2;
        var outerR = Math.min(cx, cy) * 0.96;
        var innerR = outerR * 0.74;
        var ringR = outerR * 0.88;
        var ringW = outerR * 0.045;
        var dayIndex = relDay(now);
        var dayColor = COLORS[dayIndex];
        var s = now.getSeconds();
        var ms = now.getMilliseconds();
        var isLight = document.body.classList.contains('lt');
        var labelInactive = isLight ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.22)';

        ctx.clearRect(0, 0, w, h);

        for (var i = 0; i < 7; i++) {
            var startAngle = (i * 2 * Math.PI / 7) - Math.PI / 2;
            var endAngle = startAngle + (2 * Math.PI / 7);
            var segColor = COLORS[i];
            var isActive = i === dayIndex;
            var segAlpha = isActive ? 0.14 : 0.04;

            ctx.beginPath();
            ctx.arc(cx, cy, outerR, startAngle, endAngle);
            ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = hexToRgba(segColor, segAlpha);
            ctx.fill();

            if (isActive) {
                var pulse = 0.10 + 0.05 * Math.sin(Date.now() / 800);
                ctx.beginPath();
                ctx.arc(cx, cy, outerR, startAngle, endAngle);
                ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
                ctx.closePath();
                ctx.fillStyle = hexToRgba(segColor, pulse);
                ctx.fill();
            }
        }

        var labelR = (outerR + ringR + ringW / 2) / 2;
        ctx.font = '600 ' + Math.max(9, outerR * 0.065) + 'px ' + getCSSVar('--fn');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var j = 0; j < 7; j++) {
            var angle = (j * 2 * Math.PI / 7) - Math.PI / 2;
            var lx = cx + labelR * Math.cos(angle);
            var ly = cy + labelR * Math.sin(angle);
            ctx.fillStyle = j === dayIndex ? hexToRgba(dayColor, 0.9) : labelInactive;
            ctx.fillText(DAYS_SHORT[j], lx, ly);
        }

        var progress = (s + ms / 1000) / 60;
        var ringStart = -Math.PI / 2;
        var ringEnd = ringStart + progress * 2 * Math.PI;

        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, 2 * Math.PI);
        ctx.strokeStyle = hexToRgba(dayColor, 0.08);
        ctx.lineWidth = ringW;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, ringR, ringStart, ringEnd);
        ctx.strokeStyle = dayColor;
        ctx.lineWidth = ringW;
        ctx.lineCap = 'round';
        ctx.stroke();

        var glowX = cx + ringR * Math.cos(ringEnd);
        var glowY = cy + ringR * Math.sin(ringEnd);
        var glowGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, ringW * 2.5);
        glowGrad.addColorStop(0, hexToRgba(dayColor, 0.45));
        glowGrad.addColorStop(1, hexToRgba(dayColor, 0));
        ctx.beginPath();
        ctx.arc(glowX, glowY, ringW * 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = glowGrad;
        ctx.fill();
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
            applyAnimPref();
        } catch (e) { }
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_SETTINGS, JSON.stringify({
                theme: el.themeSel ? el.themeSel.value : 'system',
                anims: el.animToggle ? el.animToggle.checked : true
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

    function haptic(type) {
        if (!navigator.vibrate) return;
        if (type === 'error') navigator.vibrate([15, 50, 15]);
        else if (type === 'success') navigator.vibrate([10, 30, 10]);
        else if (type === 'medium') navigator.vibrate(20);
        else navigator.vibrate(10);
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

        el.h.textContent = pad(h);
        el.m.textContent = pad(m);
        el.s.textContent = pad(s);

        if (el.hdrH) el.hdrH.textContent = pad(h);
        if (el.hdrM) el.hdrM.textContent = pad(m);
        if (el.hdrS) el.hdrS.textContent = pad(s);

        if (el.hdrDate && prevHour !== h) {
            el.hdrDate.textContent = now.getDate() + ' ' + MONTHS[now.getMonth()].substring(0, 3) + '.';
        }

        if (!colonElements) colonElements = document.querySelectorAll('.tc');
        var blink = s % 2 === 0;
        for (var i = 0; i < colonElements.length; i++) {
            colonElements[i].style.opacity = blink ? '0.4' : '1';
        }

        var dayIndex = relDay(now);
        if (prevDay !== dayIndex) {
            prevDay = dayIndex;
            var c = COLORS[dayIndex];
            el.dn.textContent = DAYS[dayIndex];
            el.dn.style.color = c;
            el.h.style.color = c;
            el.m.style.color = c;
        }

        el.ds.textContent = now.getDate() + ' ' + MONTHS[now.getMonth()] + ' ' + now.getFullYear();

        drawClock(now);

        if (prevHour !== h) {
            prevHour = h;
            var isWeekend = dayIndex >= 5;
            var periods = isWeekend
                ? ['Выходной · Ночь', 'Выходной · Утро', 'Выходной · День', 'Выходной · Вечер']
                : ['Ночь', 'Утро', 'День', 'Вечер'];
            el.st.textContent = periods[h < 6 ? 0 : h < 12 ? 1 : h < 18 ? 2 : 3];
            announceTime(pad(h) + ':' + pad(m) + ', ' + DAYS[dayIndex]);
        }

        var counters = document.querySelectorAll('.tc-counter-val');
        for (var x = 0; x < counters.length; x++) {
            var ts2 = parseInt(counters[x].dataset.ts);
            var tp2 = counters[x].dataset.type;
            if (counters[x] && ts2) counters[x].textContent = fmtCounter(ts2, tp2);
        }

        requestAnimationFrame(tick);
    }

    function relDay(d) { return d.getDay() === 0 ? 6 : d.getDay() - 1; }

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

    function fmtFull(timestamp, type) {
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
        if (y > 0) parts.push(y + ' г.');
        if (mo > 0) parts.push(mo + ' мес.');
        if (dd > 0) parts.push(dd + ' дн.');
        if (rh > 0) parts.push(rh + ' ч.');
        if (rm > 0) parts.push(rm + ' мин.');
        if (parts.length === 0) parts.push(rs + ' сек.');
        return (p.negative && type === 'countdown' ? '+ ' : '') + parts.join(' ');
    }

    function render() {
        var list = el.timerList;
        var empty = el.empty;
        var filtered = timers.slice();

        if (filter !== 'all') {
            filtered = filtered.filter(function (x) { return x.type === filter; });
        }

        if (filtered.length === 0) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
            empty.querySelector('h3').textContent = 'Начните считать время';
            empty.querySelector('p').textContent = 'Создайте первый счётчик и отслеживайте, как меняется ваше время';
            empty.querySelector('.btn-p').textContent = 'Создать первый счётчик';
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
            card.style.setProperty('--card-color', t.color || '#60cdff');
            card.dataset.id = t.id;
            card.setAttribute('role', 'listitem');
            card.setAttribute('draggable', 'true');

            var dt = new Date(t.date);
            var dateStr = dt.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            var typeLabel = isElapsed ? 'Прошло' : 'Осталось';
            var typeClass = isElapsed ? 'elapsed' : 'countdown';

            card.innerHTML =
                '<div class="tc-handle" aria-label="Перетащить" title="Перетащить"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg></div>' +
                '<div class="tc-header"><div class="tc-title">' + esc(t.title) + '</div><div class="tc-type ' + typeClass + '">' + typeLabel + '</div></div>' +
                '<div class="tc-counter"><div class="tc-counter-val" data-ts="' + t.date + '" data-type="' + t.type + '" style="color:' + t.color + '"></div></div>' +
                '<div class="tc-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + dateStr + '</div>' +
                '<div class="tc-actions"><button class="ibtn-s ed" data-id="' + t.id + '" title="Редактировать" aria-label="Редактировать"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg></button><button class="ibtn-s dl" data-id="' + t.id + '" title="Удалить" aria-label="Удалить"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button></div>';

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
        el.titleCnt.textContent = '0/' + MAX_TITLE;
        selectedColor = '#60cdff';
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
            }
            notify('Обновлено');
        } else {
            timers.push({ id: genId(), title: title, date: timestamp, type: type, color: selectedColor, created: Date.now() });
            notify('Добавлено');
        }

        haptic('success');
        saveTimers();
        if (more && !editId) {
            el.timerTitle.value = '';
            el.timerDate.value = '';
            el.titleCnt.textContent = '0/' + MAX_TITLE;
            selectedColor = '#60cdff';
            selectColor(selectedColor);
            setTimeout(function () { el.timerTitle.focus(); }, 100);
        } else {
            closeModal();
        }
        render();
        updateClockStats();
    }

    function editTimer(id) {
        var t = timers.find(function (x) { return x.id === id; });
        if (!t) return;

        editId = id;
        el.mTitle.textContent = 'Редактировать';
        el.timerTitle.value = t.title;
        el.timerDate.value = new Date(t.date).toISOString().slice(0, 16);
        if (el.timerType) el.timerType.value = t.type || 'elapsed';
        el.titleCnt.textContent = t.title.length + '/' + MAX_TITLE;
        selectedColor = t.color || '#60cdff';
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

        var card = el.timerList.querySelector('[data-id="' + id + '"]');
        if (card) {
            card.classList.add('removing');
            setTimeout(function () {
                lastDel = { timer: timers[idx], index: idx };
                timers.splice(idx, 1);
                saveTimers();
                render();
                showUndo();
                updateClockStats();
            }, 300);
        } else {
            lastDel = { timer: timers[idx], index: idx };
            timers.splice(idx, 1);
            saveTimers();
            render();
            showUndo();
            updateClockStats();
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
        updateClockStats();
        haptic('light');
        notify('Восстановлено');
    }

    function showConfirm(title, msg, okText, cb) {
        var m = el.confirmModal;
        $('confirmTitle').textContent = title;
        $('confirmMsg').textContent = msg;
        $('confirmOk').textContent = okText;
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
                    saveTimers(); render(); updateClockStats();
                    haptic('success');
                    notify('Импортировано ' + valid.length);
                });
            } catch (err) { notify('Ошибка формата', 'error'); }
        };
        reader.readAsText(f);
        e.target.value = '';
    }

    function closeAllModals() {
        var ms = document.querySelectorAll('.modal.show');
        if (ms.length) {
            ms.forEach(function (m) { m.classList.remove('show'); });
            releaseFocus();
            if (lastFocus) lastFocus.focus();
        }
        if (el.sModal && !el.sModal.classList.contains('show')) closeSettings();
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

    function updateClockStats() {
        var elapsed = 0, countdown = 0;
        var now = Date.now();

        for (var i = 0; i < timers.length; i++) {
            var t = timers[i];
            if (t.type === 'elapsed') elapsed++;
            else countdown++;
        }

        var total = timers.length;
        var totalEl = $('csTotal');
        var elapsedEl = $('csElapsed');
        var countdownEl = $('csCountdown');
        if (totalEl) totalEl.querySelector('.cs-val').textContent = total;
        if (elapsedEl) elapsedEl.querySelector('.cs-val').textContent = elapsed;
        if (countdownEl) countdownEl.querySelector('.cs-val').textContent = countdown;
    }

    var _scrollRaf = null;
    var _cachedWrapH = 0;
    var _cachedStatsH = 0;

    function initScroll() {
        if (!el.scrollPage) return;
        el.scrollPage.addEventListener('scroll', handleScroll, { passive: true });
        requestAnimationFrame(function () {
            var wrap = el.clockSection ? el.clockSection.querySelector('.clock-wrap') : null;
            var stats = el.clockSection ? el.clockSection.querySelector('.clock-stats') : null;
            _cachedWrapH = wrap ? wrap.scrollHeight : 300;
            _cachedStatsH = stats ? stats.scrollHeight : 0;
        });
        var resizeTimer = null;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                var wrap = el.clockSection ? el.clockSection.querySelector('.clock-wrap') : null;
                var stats = el.clockSection ? el.clockSection.querySelector('.clock-stats') : null;
                _cachedWrapH = wrap ? wrap.scrollHeight : 300;
                _cachedStatsH = stats ? stats.scrollHeight : 0;
                if (wrap) {
                    wrap.style.cssText = '';
                    wrap.classList.remove('collapsed');
                }
                if (stats) {
                    stats.style.cssText = '';
                }
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
            var wrap = el.clockSection ? el.clockSection.querySelector('.clock-wrap') : null;
            var stats = el.clockSection ? el.clockSection.querySelector('.clock-stats') : null;
            var wrapH = _cachedWrapH;
            var statsH = _cachedStatsH;
            var totalH = wrapH + statsH + 16;
            var trigger = totalH * 0.08;
            var full = totalH * 0.45;
            var progress = Math.max(0, Math.min(1, (scrollTop - trigger) / (full - trigger)));
            var ease = progress * progress * (3 - 2 * progress);

            el.hdrClock.style.opacity = ease;
            el.hdrClock.style.transform = 'translateY(' + (1 - ease) * -8 + 'px)';
            if (ease > 0.01) el.hdrClock.classList.add('show');
            else el.hdrClock.classList.remove('show');

            if (wrap) {
                var s = 1 - ease * 0.6;
                var ty = ease * -20;
                var o = Math.max(0, 1 - ease * 1.5);
                wrap.style.transform = 'scale(' + s + ') translateY(' + ty + 'px)';
                wrap.style.opacity = o;
                wrap.style.overflow = ease > 0.05 ? 'hidden' : 'visible';
            }
            if (stats) {
                var sE = Math.max(0, Math.min(1, (scrollTop - trigger * 0.5) / (full * 0.5)));
                var ss = 1 - sE * 0.15;
                var sty = sE * -12;
                var so = Math.max(0, 1 - sE * 1.4);
                stats.style.transform = 'scale(' + ss + ') translateY(' + sty + 'px)';
                stats.style.opacity = so;
                stats.style.overflow = sE > 0.05 ? 'hidden' : 'visible';
            }

            var sectionHdr = document.querySelector('.section-hdr');
            if (sectionHdr && timers.length === 0) {
                if (scrollTop > totalH * 0.25) sectionHdr.classList.remove('shifted');
                else sectionHdr.classList.add('shifted');
            } else if (sectionHdr) {
                sectionHdr.classList.remove('shifted');
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
        if (el.addBtn) el.addBtn.onclick = openModal;
        if (el.addFirstBtn) el.addFirstBtn.onclick = openModal;
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
            el.timerDate.value = new Date().toISOString().slice(0, 16);
            haptic('light');
        };

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
            if (fs) fs.value = filter;
            el.fModal.classList.add('show');
            trapFocus(el.fModal);
        };

        var closeFModal = $('closeFModal');
        if (closeFModal) closeFModal.onclick = function () { el.fModal.classList.remove('show'); releaseFocus(); };

        var applyFBtn = $('applyFBtn');
        if (applyFBtn) applyFBtn.onclick = function () {
            var fs = $('fSelect');
            if (fs) filter = fs.value;
            el.fModal.classList.remove('show');
            releaseFocus();
            render();
        };

        var exportBtn = $('exportBtn');
        if (exportBtn) exportBtn.onclick = exportJSON;

        var importBtn = $('importBtn');
        if (importBtn) importBtn.onclick = importTimers;

        var clearBtn = $('clearBtn');
        if (clearBtn) clearBtn.onclick = function () {
            showConfirm('Очистить всё', 'Удалить все счётчики?', 'Удалить', function () {
                timers = [];
                saveTimers();
                render();
                updateClockStats();
                notify('Очищено');
            });
        };

        if (el.themeSel) el.themeSel.onchange = function () { applyTheme(el.themeSel.value); saveSettings(); };
        if (el.animToggle) el.animToggle.onchange = function () { anims = el.animToggle.checked; applyAnimPref(); saveSettings(); };

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
                if (!touchDragCard || !touchClone) return;
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
                clearTimeout(touchLongPress);
                if (touchDragCard) touchDragCard.classList.remove('dragging');
                if (touchClone && touchClone.parentNode) touchClone.parentNode.removeChild(touchClone);
                touchDragCard = null;
                touchClone = null;
                clearDragIndicators();
            });
        }

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
})();
