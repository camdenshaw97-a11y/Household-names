/* Household Names — shared by the TV page and the phone page. */
(function () {
  'use strict';
  var G = window.Game = {};
  var R = window.Rules;

  G.TITLE = 'Household Names';
  // Goes up with every change; CHANGELOG.md says what each one was.
  G.VERSION = '1.1.0';

  G.$ = function (sel, root) { return (root || document).querySelector(sel); };
  G.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  G.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); };

  G.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } }
  };

  /* ---- live connection with automatic reconnect ---- */
  G.connect = function (opts) {
    var ws = null, timer = null, tries = 0;
    var myBuild = document.documentElement.getAttribute('data-build');
    function freshCheck() {
      if (!myBuild || !window.fetch) return;
      fetch('/version', { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (v) {
        if (!/^[0-9a-f]{12}$/.test(v) || v === myBuild) return;
        var last = Number(G.store.get('hn.reloadAt', 0));
        if (Date.now() - last < 30000) return;
        G.store.set('hn.reloadAt', Date.now());
        location.reload();
      }).catch(function () { /* offline: try again next time */ });
    }
    function open() {
      timer = null;
      try { ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws'); } catch (e) { return retry(); }
      var mine = ws;
      mine.onopen = function () {
        tries = 0; freshCheck();
        if (opts.onStatus) opts.onStatus(true);
        var h = opts.hello && opts.hello();
        if (h) mine.send(JSON.stringify(h));
      };
      mine.onmessage = function (e) { var m; try { m = JSON.parse(e.data); } catch (err) { return; } opts.onMessage(m); };
      mine.onclose = function () { if (ws !== mine) return; if (opts.onStatus) opts.onStatus(false); retry(); };
      mine.onerror = function () { try { mine.close(); } catch (e) { /* ignore */ } };
    }
    function retry() { if (timer) return; timer = setTimeout(open, Math.min(4000, 300 + 500 * tries++)); }
    var api = { send: function (m) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(m)); return true; } return false; } };
    open();
    setInterval(function () { api.send({ t: 'ping' }); }, 20000);
    setInterval(function () { try { fetch('/health').catch(function () {}); freshCheck(); } catch (e) { /* ignore */ } }, 4 * 60 * 1000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && (!ws || ws.readyState > 1)) { if (timer) { clearTimeout(timer); timer = null; } tries = 0; open(); }
    });
    return api;
  };

  G.stayAwake = function () {
    var lock = null;
    function ask() {
      if (!navigator.wakeLock || document.hidden) return;
      try { navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { lock = null; }); }).catch(function () {}); } catch (e) { /* not allowed here */ }
    }
    ask();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) ask(); });
    document.addEventListener('click', function () { if (!lock) ask(); }, { passive: true });
  };

  /* ---- the clock: the server's time, not this device's ---- */
  var skew = 0, speed = 1;
  G.sync = function (state) { skew = state.now - Date.now(); speed = state.speed || 1; };
  G.msLeft = function (turn) {
    if (!turn) return 0;
    if (!turn.started || turn.paused) return turn.remaining;
    return Math.max(0, (turn.endsAt - (Date.now() + skew)) * speed);
  };

  /* ---- pieces of the look ---- */
  G.team = function (id) { return R.TEAMS[id] || R.TEAMS[0]; };
  G.teamStyle = function (id) { var t = G.team(id); return '--tc:' + t.color + ';--ti:' + t.ink; };
  G.logo = function (cls) {
    return '<div class="logo ' + (cls || '') + '">' +
      '<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 60 26v30a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V26z" fill="#E5484D"/><path d="m32 20 4.6 9.6 10.4 1.4-7.6 7.2 1.9 10.3L32 43.4l-9.3 5.1 1.9-10.3-7.6-7.2 10.4-1.4z" fill="#FFF6E5"/></svg>' +
      '<div class="logo-words"><span class="logo-a">Household</span><span class="logo-b">NAMES</span></div></div>';
  };
  G.pips = function (n) {
    var s = '';
    for (var i = 0; i < 4; i++) s += '<i class="' + (i < n ? 'on' : '') + '"></i>';
    return '<span class="pips" aria-label="' + G.plural(n, 'point') + '">' + s + '</span>';
  };
  // The full card: only ever drawn on the clue-giver's phone.
  G.card = function (c) {
    var cat = R.CATEGORIES[c.cat] || { label: '', color: '#888' };
    var len = c.name.length, size = len > 44 ? 'xs' : len > 28 ? 's' : len > 16 ? 'm' : 'l';
    return '<article class="card" style="--c:' + cat.color + '">' +
      '<header class="card-top"><span>The name is</span>' + G.pips(c.points) + '</header>' +
      '<div class="card-body"><h2 class="card-name ' + size + '">' + G.esc(c.name) + '</h2>' +
      '<p class="card-blurb">' + G.esc(c.blurb) + '</p></div>' +
      '<footer class="card-foot"><span class="card-cat">' + G.esc(cat.label) + '</span><span class="card-pts">' + G.plural(c.points, 'point') + '</span></footer></article>';
  };
  // A small face-up card for names that have already been guessed.
  G.chip = function (c) {
    var cat = R.CATEGORIES[c.cat] || { color: '#888' };
    return '<div class="chip" style="--c:' + cat.color + '"><span class="chip-name">' + G.esc(c.name) + '</span><span class="chip-pts">+' + c.points + '</span></div>';
  };
  G.roundCard = function (n, total) {
    var r = R.ROUNDS[n - 1];
    return '<div class="round-card"><div class="round-no">Round ' + n + (total ? ' of ' + total : '') + '</div><h1 class="round-name">' + G.esc(r.name) + '</h1>' +
      '<ul class="round-rules">' + r.rules.map(function (x) { return '<li>' + G.esc(x) + '</li>'; }).join('') + '</ul></div>';
  };
  G.points = function (cards) { return cards.reduce(function (a, c) { return a + c.points; }, 0); };

  /* ---- sounds, made on the spot ---- */
  var ac = null, muted = G.store.get('hn.muted', false);
  function audio() {
    if (muted) return null;
    try { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) { return null; }
    return ac;
  }
  document.addEventListener('pointerdown', function () { audio(); }, { passive: true });
  function tone(freq, start, dur, type, vol, slideTo) {
    var a = audio(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime + start;
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  G.sound = {
    got: function () { tone(660, 0, 0.12, 'triangle', 0.25); tone(990, 0.09, 0.22, 'triangle', 0.25); },
    skip: function () { tone(420, 0, 0.16, 'sine', 0.14, 240); },
    undo: function () { tone(500, 0, 0.1, 'sine', 0.12); tone(380, 0.08, 0.14, 'sine', 0.12); },
    tick: function () { tone(1100, 0, 0.05, 'square', 0.06); },
    start: function () { tone(523, 0, 0.1, 'triangle', 0.2); tone(659, 0.1, 0.1, 'triangle', 0.2); tone(784, 0.2, 0.2, 'triangle', 0.22); },
    time: function () { tone(180, 0, 0.7, 'sawtooth', 0.22, 110); tone(120, 0, 0.7, 'square', 0.12, 80); },
    join: function () { tone(880, 0, 0.09, 'sine', 0.12); tone(1175, 0.07, 0.14, 'sine', 0.12); },
    round: function () { [392, 523, 659, 784].forEach(function (f, i) { tone(f, i * 0.11, 0.22, 'triangle', 0.2); }); },
    over: function () { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, i * 0.13, 0.3, 'triangle', 0.22); }); },
    muted: function () { return muted; },
    toggle: function () { muted = !muted; G.store.set('hn.muted', muted); return muted; }
  };
  G.buzz = function (pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* not supported */ } };

  /* ---- confetti for the winners ---- */
  G.confetti = function (colors) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
    var x = c.getContext('2d'), w = c.width = innerWidth, h = c.height = innerHeight, bits = [], t0 = performance.now();
    colors = colors || ['#E5484D', '#3E63DD', '#F2B01E', '#2F9E5B', '#FFF6E5'];
    for (var i = 0; i < 180; i++) bits.push({ x: Math.random() * w, y: -20 - Math.random() * h * 0.6, s: 6 + Math.random() * 10, vy: 2 + Math.random() * 4, vx: -1.5 + Math.random() * 3, r: Math.random() * 6, vr: -0.2 + Math.random() * 0.4, c: colors[i % colors.length] });
    (function frame(now) {
      x.clearRect(0, 0, w, h);
      bits.forEach(function (b) { b.x += b.vx; b.y += b.vy; b.r += b.vr; x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.c; x.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); x.restore(); });
      if (now - t0 < 6000) requestAnimationFrame(frame); else c.remove();
    })(t0);
  };

  /* ---- a small pop-up for messages and yes/no questions ---- */
  G.toast = function (text) {
    var el = document.createElement('div'); el.className = 'toast'; el.textContent = text; document.body.appendChild(el);
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 400); }, 2600);
  };
  G.ask = function (title, body, yes, onYes, no) {
    var wrap = document.createElement('div'); wrap.className = 'sheet-wrap';
    wrap.innerHTML = '<div class="sheet" role="dialog" aria-modal="true"><h3>' + G.esc(title) + '</h3>' + (body ? '<p>' + G.esc(body) + '</p>' : '') +
      '<div class="sheet-btns"><button class="btn ghost" data-x="no">' + G.esc(no || 'Cancel') + '</button><button class="btn primary" data-x="yes">' + G.esc(yes) + '</button></div></div>';
    wrap.addEventListener('click', function (e) {
      var x = e.target.getAttribute && e.target.getAttribute('data-x');
      if (e.target === wrap || x === 'no') wrap.remove();
      if (x === 'yes') { wrap.remove(); onYes(); }
    });
    document.body.appendChild(wrap);
  };
})();
