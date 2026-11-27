'use strict';
/*
 * Household Names — the server.
 * A team guessing game for a TV and your phones: the clue-giver's phone shows a name, their team
 * shouts guesses, and the same deck comes back every round with tighter rules on the clues.
 *
 * One process holds every room in memory. The TV page creates a room, phones join with a
 * 4-letter code, and the server is the single source of truth: it deals the deck, runs the clock,
 * keeps score, and pushes a fresh snapshot to every screen after each change. Only the
 * clue-giver's phone is ever sent the card in play.
 *
 * Built the same way as the other Game Night games: /, /tv, /?code=ABCD, /health, /version,
 * /uptime, /qr.svg, automatic reconnect, and a sealed backup the TV hands back after a restart.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { WebSocketServer } = require('ws');
const QRCode = require('qrcode');
const Rules = require('./rules');
const Deck = require('./deck');

const PORT = process.env.PORT || 3000;
const PUB = __dirname;
const FONTS = ['fraunces-600.woff2', 'fraunces-900.woff2', 'fraunces-900i.woff2', 'dmsans-400.woff2', 'dmsans-500.woff2', 'dmsans-700.woff2', 'dmsans-800.woff2'];
const PAGES = ['index.html', 'tv.html', 'common.js', 'rules.js', 'style.css'];
const PAGE_FILES = new Set(PAGES.concat(FONTS, ['icon.svg']));
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'
};

// A fingerprint of the pages as they are right now, so a screen left open across an update reloads itself.
const BUILD = (() => {
  const h = crypto.createHash('sha1');
  for (const f of PAGES) { try { h.update(fs.readFileSync(path.join(PUB, f))); } catch (e) { /* missing file */ } }
  return h.digest('hex').slice(0, 12);
})();

const SPEED = Number(process.env.SPEED_UP) || 1;       // tests run the clocks faster
const INTRO_MS = 12000;                                // the round's rules stay up this long unless someone taps on
const RECAP_MS = 8000;                                 // "time!" and what that turn won
const ROOM_IDLE_MS = 6 * 60 * 60 * 1000;
const BOOT = Date.now();
const BACKUP_DELAY_MS = 150;
const BACKUP_MAX = 300 * 1024;
const BACKUP_KEY = (() => {
  let seed = process.env.BACKUP_KEY || process.env.RENDER_SERVICE_ID;
  if (!seed) {
    const file = path.join(__dirname, '.backup-key');
    try { seed = fs.readFileSync(file, 'utf8').trim(); } catch (e) { /* first run */ }
    if (!seed) {
      seed = crypto.randomBytes(32).toString('hex');
      try { fs.writeFileSync(file, seed + '\n', { mode: 0o600 }); } catch (e) { /* read-only disk */ }
    }
  }
  return crypto.createHash('sha256').update('household-names room backup|' + seed).digest();
})();

const rooms = new Map();

// Admin controls on a phone are unlocked with a PIN. It is set on the server (Render: Environment,
// ADMIN_PIN) and never written into the code. With no ADMIN_PIN set, the admin panel stays locked.
const ADMIN_PIN_HASH = process.env.ADMIN_PIN ? crypto.createHash('sha256').update(String(process.env.ADMIN_PIN).trim()).digest() : null;
const PIN_TRIES = 5, PIN_LOCK_MS = 60 * 1000, ROOM_PIN_TRIES = 20, ROOM_PIN_LOCK_MS = 10 * 60 * 1000;
function pinMatches(pin) {
  if (!ADMIN_PIN_HASH) return false;
  const h = crypto.createHash('sha256').update(String(pin == null ? '' : pin).trim()).digest();
  return crypto.timingSafeEqual(h, ADMIN_PIN_HASH);
}

/* ------------------------------------------------------------------ http */

const server = http.createServer((req, res) => {
  let u, p;
  try { u = new URL(req.url, 'http://localhost'); p = decodeURIComponent(u.pathname); } catch (e) { res.writeHead(400); return res.end(); }
  if (p === '/health') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  if (p === '/version') { res.writeHead(200, { 'content-type': 'text/plain', 'cache-control': 'no-store' }); return res.end(BUILD); }
  if (p === '/uptime') {
    res.writeHead(200, { 'content-type': 'text/plain', 'cache-control': 'no-store' });
    return res.end('started ' + new Date(BOOT).toISOString() + ' · up ' + Math.round((Date.now() - BOOT) / 1000) + 's');
  }
  if (p === '/qr.svg') {
    const text = (u.searchParams.get('u') || '').slice(0, 300);
    return QRCode.toString(text || ' ', { type: 'svg', margin: 1, errorCorrectionLevel: 'L' }, (err, svg) => {
      if (err) { res.writeHead(500); return res.end(); }
      res.writeHead(200, { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=3600' });
      res.end(svg);
    });
  }
  if (p === '/') p = '/index.html';
  if (p === '/tv') p = '/tv.html';
  const rel = p.replace(/^\/+/, '');
  if (!PAGE_FILES.has(rel)) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
  fs.readFile(path.join(PUB, rel), (err, data) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
    const ext = path.extname(rel);
    if (ext === '.html') data = Buffer.from(String(data).replace('<html lang="en">', '<html lang="en" data-build="' + BUILD + '">'));
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': ext === '.woff2' ? 'public, max-age=604800' : 'no-cache' });
    res.end(data);
  });
});

/* --------------------------------------------------------------- helpers */

const rid = (n = 12) => crypto.randomBytes(n).toString('base64url');
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function makeCode() {
  const letters = 'BCDFGHJKLMNPQRSTVWXZ';
  for (;;) {
    let c = '';
    for (let i = 0; i < 4; i++) c += letters[crypto.randomInt(letters.length)];
    if (!rooms.has(c)) return c;
  }
}
function clean(s, max) { return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
function send(ws, msg) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(msg)); }
const ms = n => Math.max(20, Math.round(n / SPEED));

/* ----------------------------------------------------------------- rooms */

function newRoom() {
  const room = {
    code: makeCode(), adminToken: rid(18), touched: Date.now(),
    settings: Object.assign({}, Rules.DEFAULTS),
    teams: Rules.TEAMS.map(t => ({ id: t.id, name: t.name })),
    players: new Map(), captainId: null, game: null, used: [], blocked: [], pinFails: [],
    tvs: new Set(), timer: null, backupTimer: null
  };
  rooms.set(room.code, room);
  return room;
}
function activeTeams(room) { return room.teams.slice(0, room.settings.teams); }
function teamPlayers(room, teamId) {
  return [...room.players.values()].filter(p => p.team === teamId).sort((a, b) => a.joinedAt - b.joinedAt);
}
function smallestTeam(room) {
  let best = 0, n = Infinity;
  for (const t of activeTeams(room)) { const c = teamPlayers(room, t.id).length; if (c < n) { n = c; best = t.id; } }
  return best;
}
function pickCaptain(room) {
  const cur = room.players.get(room.captainId);
  if (cur && cur.connected) return;
  const next = [...room.players.values()].filter(p => p.connected).sort((a, b) => a.joinedAt - b.joinedAt)[0];
  if (next) room.captainId = next.id;
}
function clearTimer(room) { if (room.timer) { clearTimeout(room.timer); room.timer = null; } }
function arm(room, delay, fn) {
  clearTimer(room);
  room.timer = setTimeout(() => { room.timer = null; try { fn(); } catch (e) { console.error('timer error', e); } }, delay);
}
function fx(room, k, extra) {
  const msg = Object.assign({ t: 'fx', k }, extra || {});
  for (const ws of room.tvs) send(ws, msg);
  for (const p of room.players.values()) send(p.ws, msg);
}
function cardOut(id) { const c = Deck.BY_ID.get(id); return c ? { id: c.id, name: c.name, cat: c.cat, points: c.points, blurb: c.blurb } : null; }
function cardFace(id) { const c = Deck.BY_ID.get(id); return c ? { id: c.id, name: c.name, cat: c.cat, points: c.points } : null; }

/* ------------------------------------------------------------------ game */

function canStart(room) {
  const teams = activeTeams(room).map(t => teamPlayers(room, t.id).length);
  if (teams.some(n => n < Rules.MIN_TEAM)) return 'Every team needs at least ' + Rules.MIN_TEAM + ' players.';
  return '';
}
function buildDeck(room) {
  const pool = room.settings.rating === 'dark' ? Deck.ALL : Deck.family;
  const want = room.settings.cards;
  const used = new Set(room.used);
  let fresh = pool.filter(c => !used.has(c.id));
  if (fresh.length < want) { room.used = []; fresh = pool.slice(); }           // been through the whole deck: start over
  let picks;
  if (room.settings.rating === 'dark') {
    // After Dark: about half the deck is the spicy cards, the rest is the regular deck.
    const dark = shuffle(fresh.filter(c => c.rating === 'dark')), fam = shuffle(fresh.filter(c => c.rating !== 'dark'));
    const nDark = Math.min(dark.length, Math.round(want / 2));
    picks = dark.slice(0, nDark).concat(fam.slice(0, want - nDark));
    if (picks.length < want) picks = picks.concat(dark.slice(nDark, nDark + want - picks.length));
  } else {
    picks = shuffle(fresh).slice(0, want);
  }
  const ids = shuffle(picks.map(c => c.id));
  room.used = room.used.concat(ids);
  return ids;
}
function startGame(room) {
  const order = shuffle(activeTeams(room).map(t => t.id));
  const deck = buildDeck(room);
  room.game = {
    phase: 'intro', round: 1, rounds: room.settings.rounds, timerSec: room.settings.timer,
    deck, pile: shuffle(deck.slice()), order, turnIdx: 0, giverIdx: {},
    scores: {}, roundScores: [], turn: null, last: null, cardStats: {}, turnsPlayed: 0
  };
  for (const id of order) { room.game.scores[id] = 0; room.game.giverIdx[id] = 0; }
  room.game.roundScores.push(Object.fromEntries(order.map(id => [id, 0])));
  for (const p of room.players.values()) p.stats = { pts: 0, cards: 0, turns: 0, best: 0 };
  setUpTurn(room);
  fx(room, 'round');
  arm(room, ms(INTRO_MS), () => { if (room.game && room.game.phase === 'intro') { room.game.phase = 'ready'; changed(room); } });
}
// Who is up next: the team whose turn it is and the next clue-giver in that team's rotation.
function setUpTurn(room) {
  const g = room.game, team = g.order[g.turnIdx % g.order.length];
  const list = teamPlayers(room, team);
  let giver = null;
  if (list.length) {
    const start = g.giverIdx[team] % list.length;
    for (let i = 0; i < list.length; i++) { const p = list[(start + i) % list.length]; if (p.connected) { giver = p; g.giverIdx[team] = (start + i) % list.length; break; } }
    if (!giver) giver = list[start];
  }
  g.turn = { team, giver: giver ? giver.id : null, started: false, endsAt: 0, paused: false, remaining: g.timerSec * 1000, won: [], skips: 0, shownAt: 0 };
}
function beginTurn(room) {
  const g = room.game, t = g.turn;
  g.phase = 'turn'; t.started = true; t.paused = false;
  t.endsAt = Date.now() + ms(t.remaining); t.shownAt = Date.now();
  arm(room, ms(t.remaining), () => endTurn(room, 'time'));
  fx(room, 'start');
}
function pauseTurn(room) {
  const t = room.game.turn;
  if (room.game.phase !== 'turn' || t.paused) return;
  t.remaining = Math.max(500, (t.endsAt - Date.now()) * SPEED); t.paused = true; clearTimer(room);
}
function resumeTurn(room) {
  const t = room.game.turn;
  if (room.game.phase !== 'turn' || !t.paused) return;
  t.paused = false; t.endsAt = Date.now() + ms(t.remaining); t.shownAt = Date.now();
  arm(room, ms(t.remaining), () => endTurn(room, 'time'));
}
function gotCard(room) {
  const g = room.game, t = g.turn, id = g.pile.shift();
  if (id == null) return;
  const card = Deck.BY_ID.get(id), giver = room.players.get(t.giver);
  const took = Math.max(0, (Date.now() - t.shownAt) * SPEED);
  t.won.push({ id, took });
  g.scores[t.team] += card.points; g.roundScores[g.round - 1][t.team] += card.points;
  if (giver) { giver.stats.pts += card.points; giver.stats.cards++; }
  const cs = g.cardStats[id] || (g.cardStats[id] = { skips: 0 });
  if (took >= 800 && (cs.fast == null || took < cs.fast)) { cs.fast = took; cs.by = t.giver; }   // under 0.8s is a double tap, not a guess
  t.shownAt = Date.now();
  fx(room, 'got', { card: cardFace(id), team: t.team });
  if (!g.pile.length) endTurn(room, 'deck');
}
function skipCard(room) {
  const g = room.game, t = g.turn;
  if (g.pile.length < 2) { fx(room, 'only'); return; }
  const id = g.pile.shift(); g.pile.push(id);
  t.skips++; (g.cardStats[id] || (g.cardStats[id] = { skips: 0 })).skips++;
  t.shownAt = Date.now();
  fx(room, 'skip');
}
function undoCard(room) {
  const g = room.game, t = g.turn, w = t.won.pop();
  if (!w) return;
  const card = Deck.BY_ID.get(w.id), giver = room.players.get(t.giver);
  g.pile.unshift(w.id);
  g.scores[t.team] -= card.points; g.roundScores[g.round - 1][t.team] -= card.points;
  if (giver) { giver.stats.pts -= card.points; giver.stats.cards--; }
  t.shownAt = Date.now();
  fx(room, 'undo');
}
function endTurn(room, reason) {
  const g = room.game, t = g.turn;
  clearTimer(room);
  const giver = room.players.get(t.giver);
  if (giver) { giver.stats.turns++; giver.stats.best = Math.max(giver.stats.best, t.won.length); }
  g.turnsPlayed++;
  g.last = { team: t.team, giver: t.giver, giverName: giver ? giver.name : '', won: t.won.map(w => w.id), skips: t.skips, reason };
  g.giverIdx[t.team]++;
  if (reason === 'deck') {
    g.phase = 'roundEnd';
    fx(room, g.round >= g.rounds ? 'over' : 'roundEnd');
    if (g.round >= g.rounds) finish(room);
  } else {
    // Time ran out: the card in hand goes back into the deck somewhere, not on top.
    if (g.pile.length > 1) { const id = g.pile.shift(); g.pile.splice(1 + crypto.randomInt(g.pile.length), 0, id); }
    g.phase = 'recap'; g.turnIdx++;
    setUpTurn(room);
    fx(room, 'time');
    arm(room, ms(RECAP_MS), () => { if (room.game && room.game.phase === 'recap') { room.game.phase = 'ready'; changed(room); } });
  }
  changed(room);
}
function nextRound(room) {
  const g = room.game;
  g.round++; g.pile = shuffle(g.deck.slice());
  g.roundScores.push(Object.fromEntries(g.order.map(id => [id, 0])));
  // The team that is behind goes first. On a tie, play simply moves on to the next team.
  const low = Math.min(...g.order.map(id => g.scores[id]));
  const lows = g.order.filter(id => g.scores[id] === low);
  const after = (g.order.indexOf(g.last.team) + 1) % g.order.length;
  let idx = after;
  for (let i = 0; i < g.order.length; i++) { const k = (after + i) % g.order.length; if (lows.includes(g.order[k])) { idx = k; break; } }
  g.turnIdx = idx;
  setUpTurn(room);
  g.phase = 'intro';
  fx(room, 'round');
  arm(room, ms(INTRO_MS), () => { if (room.game && room.game.phase === 'intro') { room.game.phase = 'ready'; changed(room); } });
}
function finish(room) {
  const g = room.game;
  g.phase = 'over';
  const top = Math.max(...g.order.map(id => g.scores[id]));
  g.winners = g.order.filter(id => g.scores[id] === top);
  const awards = [], players = [...room.players.values()].filter(p => p.stats);
  const best = (arr, f) => arr.reduce((a, b) => (a == null || f(b) > f(a) ? b : a), null);
  const talker = best(players, p => p.stats.pts);
  if (talker && talker.stats.pts > 0) awards.push({ title: 'Top Clue-Giver', who: talker.name, detail: talker.stats.pts + ' points won for their team' });
  const streak = best(players, p => p.stats.best);
  if (streak && streak.stats.best > 1) awards.push({ title: 'Hot Streak', who: streak.name, detail: streak.stats.best + ' cards in a single turn' });
  let fast = null, stump = null;
  for (const [id, cs] of Object.entries(g.cardStats)) {
    if (cs.fast != null && (!fast || cs.fast < fast.ms)) fast = { id: Number(id), ms: cs.fast, by: cs.by };
    if (cs.skips > 1 && (!stump || cs.skips > stump.n)) stump = { id: Number(id), n: cs.skips };
  }
  if (fast) {
    const who = room.players.get(fast.by), c = Deck.BY_ID.get(fast.id);
    awards.push({ title: 'Lightning Round', who: who ? who.name : '', detail: '"' + c.name + '" in ' + (fast.ms / 1000).toFixed(1) + ' seconds' });
  }
  if (stump) awards.push({ title: 'The Stumper', who: Deck.BY_ID.get(stump.id).name, detail: 'Skipped ' + stump.n + ' times' });
  g.awards = awards;
}

/* ------------------------------------------------------------- snapshots */

function publicState(room) {
  const g = room.game;
  const teams = activeTeams(room).map(t => ({
    id: t.id, name: t.name, score: g ? (g.scores[t.id] || 0) : 0,
    players: teamPlayers(room, t.id).map(p => ({ id: p.id, name: p.name, on: p.connected }))
  }));
  const s = { t: 'state', now: Date.now(), speed: SPEED, code: room.code, phase: g ? g.phase : 'lobby', settings: room.settings, teams, captainId: room.captainId, startError: g ? '' : canStart(room), count: room.players.size };
  if (g) {
    const t = g.turn, giver = t && room.players.get(t.giver);
    s.round = g.round; s.rounds = g.rounds; s.deckCount = g.deck.length; s.pileCount = g.pile.length; s.timerSec = g.timerSec;
    s.roundScores = g.roundScores; s.order = g.order;
    if (t) s.turn = { team: t.team, giver: t.giver, giverName: giver ? giver.name : '', giverOn: !!(giver && giver.connected), started: t.started, endsAt: t.endsAt, paused: t.paused, remaining: t.remaining, won: t.won.map(w => cardFace(w.id)), skips: t.skips };
    if (g.last) s.last = { team: g.last.team, giverName: g.last.giverName, won: g.last.won.map(cardFace), skips: g.last.skips, reason: g.last.reason };
    if (g.phase === 'over') { s.winners = g.winners; s.awards = g.awards; }
  }
  return s;
}
function pushState(room) {
  const s = publicState(room), g = room.game;
  const tvMsg = JSON.stringify(Object.assign({}, s, { you: null, tv: true }));
  for (const ws of room.tvs) if (ws.readyState === 1) ws.send(tvMsg);
  for (const p of room.players.values()) {
    if (!p.ws || p.ws.readyState !== 1) continue;
    const mine = Object.assign({}, s, { you: { id: p.id, name: p.name, team: p.team, captain: p.id === room.captainId, admin: !!p.admin } });
    if (p.admin) { mine.blocked = room.blocked; mine.adminReady = true; }
    // The card in play goes to the clue-giver's phone and nowhere else.
    if (g && g.phase === 'turn' && g.turn.giver === p.id && g.pile.length) mine.card = cardOut(g.pile[0]);
    p.ws.send(JSON.stringify(mine));
  }
}
function changed(room) {
  room.touched = Date.now();
  pickCaptain(room);
  pushState(room);
  if (!room.backupTimer) room.backupTimer = setTimeout(() => { room.backupTimer = null; sendBackup(room); }, BACKUP_DELAY_MS);
}

/* ------------------------------------------------ surviving a restart */

function packRoom(room) {
  const g = room.game;
  let game = null;
  if (g) {
    game = JSON.parse(JSON.stringify(g));
    if (g.phase === 'turn' && !g.turn.paused) { game.turn.paused = true; game.turn.remaining = Math.max(1000, (g.turn.endsAt - Date.now()) * SPEED); }
  }
  const data = {
    v: 1, code: room.code, adminToken: room.adminToken, settings: room.settings, teams: room.teams, captainId: room.captainId, used: room.used, blocked: room.blocked, game,
    players: [...room.players.values()].map(p => ({ id: p.id, token: p.token, name: p.name, team: p.team, joinedAt: p.joinedAt, stats: p.stats || null, admin: !!p.admin }))
  };
  const plain = zlib.deflateRawSync(Buffer.from(JSON.stringify(data)));
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', BACKUP_KEY, iv);
  const body = Buffer.concat([c.update(plain), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64');
}
function sendBackup(room) {
  if (!rooms.has(room.code) || !room.tvs.size) return;
  let blob;
  try { blob = packRoom(room); } catch (e) { return console.error('backup error', e); }
  if (blob.length > BACKUP_MAX) return;
  for (const ws of room.tvs) send(ws, { t: 'backup', code: room.code, blob });
}
function restoreRoom(blob, code, token) {
  let data;
  try {
    const raw = Buffer.from(blob, 'base64');
    const d = crypto.createDecipheriv('aes-256-gcm', BACKUP_KEY, raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    data = JSON.parse(zlib.inflateRawSync(Buffer.concat([d.update(raw.subarray(28)), d.final()])).toString());
  } catch (e) { return null; }
  if (!data || data.v !== 1 || data.code !== code || data.adminToken !== token || rooms.has(code)) return null;
  const room = {
    code, adminToken: token, touched: Date.now(), settings: Object.assign({}, Rules.DEFAULTS, data.settings),
    teams: data.teams, players: new Map(), captainId: data.captainId, game: data.game, used: data.used || [],
    blocked: data.blocked || [], pinFails: [], tvs: new Set(), timer: null, backupTimer: null
  };
  for (const p of data.players) room.players.set(p.id, Object.assign({ ws: null, connected: false }, p));
  rooms.set(code, room);
  const g = room.game;
  if (g && g.phase === 'intro') arm(room, ms(INTRO_MS), () => { if (room.game && room.game.phase === 'intro') { room.game.phase = 'ready'; changed(room); } });
  if (g && g.phase === 'recap') arm(room, ms(RECAP_MS), () => { if (room.game && room.game.phase === 'recap') { room.game.phase = 'ready'; changed(room); } });
  console.log('restored room ' + code + ' (' + room.players.size + ' players, ' + (g ? g.phase : 'lobby') + ')');
  return room;
}

/* -------------------------------------------------------------- messages */

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 512 * 1024 });

wss.on('connection', ws => {
  ws.on('message', raw => {
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }
    if (!m || typeof m.t !== 'string') return;
    try { handle(ws, m); } catch (e) { console.error('message error', m.t, e); }
  });
  ws.on('close', () => {
    const room = ws.room && rooms.get(ws.room);
    if (!room) return;
    if (ws.tv) { room.tvs.delete(ws); return; }
    const p = room.players.get(ws.pid);
    if (p && p.ws === ws) {
      p.ws = null; p.connected = false;
      // If the clue-giver's phone drops mid-turn, stop the clock so the team is not robbed.
      if (room.game && room.game.phase === 'turn' && room.game.turn.giver === p.id) pauseTurn(room);
      changed(room);
    }
  });
});

function seat(ws, room, p) {
  if (p.ws && p.ws !== ws) { send(p.ws, { t: 'bumped' }); try { p.ws.close(); } catch (e) { /* gone */ } }
  p.ws = ws; p.connected = true; ws.room = room.code; ws.pid = p.id; ws.tv = false;
  send(ws, { t: 'seated', code: room.code, id: p.id, token: p.token, name: p.name });
  changed(room);
}

function handle(ws, m) {
  if (m.t === 'ping') return send(ws, { t: 'pong' });

  /* ---- the TV ---- */
  if (m.t === 'tv') {
    const code = clean(m.code, 4).toUpperCase();
    let room = code ? rooms.get(code) : null;
    if (room && room.adminToken !== m.token) room = null;
    if (!room && code && typeof m.blob === 'string' && m.blob.length <= BACKUP_MAX) room = restoreRoom(m.blob, code, String(m.token || ''));
    if (!room) room = newRoom();
    ws.room = room.code; ws.tv = true; room.tvs.add(ws);
    send(ws, { t: 'hosting', code: room.code, token: room.adminToken });
    return changed(room);
  }

  /* ---- phones getting a seat ---- */
  if (m.t === 'rejoin' || m.t === 'join') {
    const code = clean(m.code, 4).toUpperCase(), room = rooms.get(code);
    if (!room) return send(ws, { t: 'nope', why: 'noroom', msg: m.t === 'rejoin' ? '' : 'No game with that code. Check the TV.' });
    if (m.t === 'rejoin') {
      const p = room.players.get(String(m.id));
      if (!p || p.token !== m.token) return send(ws, { t: 'nope', why: 'noseat' });
      return seat(ws, room, p);
    }
    const name = clean(m.name, 14);
    if (!name) return send(ws, { t: 'nope', why: 'name', msg: 'Type a name first.' });
    if (room.blocked.includes(name.toLowerCase())) return send(ws, { t: 'nope', why: 'blocked', msg: 'You can’t join this game.' });
    const same = [...room.players.values()].find(p => p.name.toLowerCase() === name.toLowerCase());
    if (same) {
      if (same.connected) return send(ws, { t: 'nope', why: 'taken', msg: 'Someone is already playing as ' + same.name + '.' });
      return seat(ws, room, same);                                   // came back on a fresh browser: same name takes the seat
    }
    if (room.players.size >= Rules.MAX_PLAYERS) return send(ws, { t: 'nope', why: 'full', msg: 'This game is full.' });
    const p = { id: rid(6), token: rid(18), name, team: smallestTeam(room), joinedAt: Date.now(), ws: null, connected: false, stats: room.game ? { pts: 0, cards: 0, turns: 0, best: 0 } : null };
    room.players.set(p.id, p);
    fx(room, 'join');
    return seat(ws, room, p);
  }

  const room = ws.room && rooms.get(ws.room);
  if (!room) return;
  const me = ws.tv ? null : room.players.get(ws.pid);
  if (!ws.tv && !me) return;
  const admin = ws.tv || !!(me && me.admin);
  const boss = admin || (me && me.id === room.captainId);
  const g = room.game;

  /* ---- unlocking admin controls with the PIN ---- */
  if (m.t === 'adminPin' && me) {
    const now = Date.now();
    room.pinFails = room.pinFails.filter(t => now - t < ROOM_PIN_LOCK_MS);
    if (!ADMIN_PIN_HASH) return send(ws, { t: 'adminNo', msg: 'Admin controls aren’t set up on this server yet.' });
    if (me.pinLockUntil && now < me.pinLockUntil) return send(ws, { t: 'adminNo', msg: 'Too many wrong tries. Wait a minute.' });
    if (room.pinFails.length >= ROOM_PIN_TRIES) return send(ws, { t: 'adminNo', msg: 'Too many wrong tries in this game. Wait ten minutes.' });
    if (!pinMatches(m.pin)) {
      room.pinFails.push(now); me.pinFails = (me.pinFails || 0) + 1;
      if (me.pinFails >= PIN_TRIES) { me.pinFails = 0; me.pinLockUntil = now + PIN_LOCK_MS; }
      return send(ws, { t: 'adminNo', msg: 'Wrong PIN.' });
    }
    me.admin = true; me.pinFails = 0;
    changed(room);                         // the phone gets its admin state first, then the go-ahead
    return send(ws, { t: 'adminOk' });
  }
  if (m.t === 'adminOff' && me) { me.admin = false; return changed(room); }
  if (admin && m.t.startsWith('a_')) return adminAction(ws, room, me, m);

  /* ---- the lobby ---- */
  if (!g) {
    if (m.t === 'team' && me) {
      const id = Number(m.team);
      if (!activeTeams(room).some(t => t.id === id)) return;
      me.team = id; me.joinedAt = Date.now();
      return changed(room);
    }
    if (m.t === 'rename' && (boss || (me && me.team === Number(m.team)))) {
      const team = room.teams[Number(m.team)], name = clean(m.name, 18);
      if (team && name) { team.name = name; changed(room); }
      return;
    }
    if (m.t === 'leave' && me) {
      room.players.delete(me.id); send(ws, { t: 'left' }); ws.pid = null; ws.room = null;
      return changed(room);
    }
    if (!boss) return;
    if (m.t === 'set') {
      const key = String(m.key), list = Rules.CHOICES[key];
      if (!list || !list.includes(m.value)) return;
      room.settings[key] = m.value;
      if (key === 'teams') for (const p of room.players.values()) if (p.team >= m.value) p.team = smallestTeam(room);
      return changed(room);
    }
    if (m.t === 'shuffle') {
      const ps = shuffle([...room.players.values()]), n = room.settings.teams;
      ps.forEach((p, i) => { p.team = i % n; p.joinedAt = Date.now() + i; });
      fx(room, 'shuffle');
      return changed(room);
    }
    if (m.t === 'kick') {
      const p = room.players.get(String(m.id));
      if (p) { removePlayer(room, p, false); changed(room); }
      return;
    }
    if (m.t === 'start') {
      const err = canStart(room);
      if (err) return send(ws, { t: 'nope', why: 'start', msg: err });
      startGame(room);
      return changed(room);
    }
    return;
  }

  /* ---- in a game ---- */
  const t = g.turn, giver = me && t && t.giver === me.id;
  if (m.t === 'go' && g.phase === 'ready' && (giver || boss)) { beginTurn(room); return changed(room); }
  if (g.phase === 'turn' && giver && !t.paused) {
    if (m.t === 'got') { gotCard(room); if (room.game.phase === 'turn') changed(room); return; }
    if (m.t === 'skip') { skipCard(room); return changed(room); }
    if (m.t === 'undo') { undoCard(room); return changed(room); }
  }
  if (m.t === 'pause' && (giver || boss)) { pauseTurn(room); return changed(room); }
  if (m.t === 'resume' && (giver || boss)) { resumeTurn(room); return changed(room); }
  if (!boss) return;
  if (m.t === 'next') {
    if (g.phase === 'intro' || g.phase === 'recap') { clearTimer(room); g.phase = 'ready'; return changed(room); }
    if (g.phase === 'roundEnd') { nextRound(room); return changed(room); }
    return;
  }
  if (m.t === 'pass' && g.phase === 'ready') {           // the clue-giver stepped away: hand the turn to a teammate
    g.giverIdx[t.team]++; setUpTurn(room); return changed(room);
  }
  if (m.t === 'again' && g.phase === 'over') { clearTimer(room); room.game = null; return changed(room); }
  if (m.t === 'end') { clearTimer(room); room.game = null; fx(room, 'ended'); return changed(room); }
}

/* --------------------------------------------------------- admin controls */

// Everything the admin panel on a phone can do. The TV may do these too.
function adminAction(ws, room, me, m) {
  const g = room.game, say = msg => send(ws, { t: 'nope', why: 'admin', msg });
  const target = m.id != null ? room.players.get(String(m.id)) : null;
  const between = g && (g.phase === 'ready' || g.phase === 'intro' || g.phase === 'recap');

  if (m.t === 'a_kick') {
    if (!target) return;
    removePlayer(room, target, !!m.block);
    fx(room, 'kicked');
    return changed(room);
  }
  if (m.t === 'a_move') {
    if (!target) return;
    const team = Number(m.team);
    if (!activeTeams(room).some(t => t.id === team) || target.team === team) return;
    if (g && g.phase === 'turn' && g.turn.giver === target.id) return say('Wait until ' + target.name + '’s turn is over.');
    target.team = team; target.joinedAt = Date.now();
    if (between && g.turn.giver === target.id) setUpTurn(room);
    return changed(room);
  }
  if (m.t === 'a_host') {
    if (!target) return;
    room.captainId = target.id;
    return changed(room);
  }
  if (m.t === 'a_rename') {
    if (!target) return;
    const name = clean(m.name, 14);
    if (!name) return;
    if ([...room.players.values()].some(p => p !== target && p.name.toLowerCase() === name.toLowerCase())) return say('Someone is already called ' + name + '.');
    target.name = name;
    return changed(room);
  }
  if (m.t === 'a_unblock') {
    const name = String(m.name || '').toLowerCase();
    room.blocked = m.all ? [] : room.blocked.filter(n => n !== name);
    return changed(room);
  }
  if (!g) return;
  if (m.t === 'a_score') {
    const team = Number(m.team), delta = Math.max(-5, Math.min(5, Math.trunc(Number(m.delta)) || 0));
    if (!g.order.includes(team) || !delta) return;
    g.scores[team] += delta; g.roundScores[g.round - 1][team] += delta;
    if (g.phase === 'over') { const top = Math.max(...g.order.map(id => g.scores[id])); g.winners = g.order.filter(id => g.scores[id] === top); }
    return changed(room);
  }
  if (m.t === 'a_endTurn') {
    if (g.phase === 'turn') endTurn(room, 'time');
    return;
  }
  if (m.t === 'a_pass' && between) {             // same team, next clue-giver
    clearTimer(room); g.giverIdx[g.turn.team]++; setUpTurn(room); g.phase = 'ready';
    return changed(room);
  }
  if (m.t === 'a_skipTeam' && between) {         // hand the turn to the next team
    clearTimer(room); g.turnIdx++; setUpTurn(room); g.phase = 'ready';
    return changed(room);
  }
  if (m.t === 'a_endRound' && (g.phase === 'turn' || between)) {
    if (g.phase === 'turn') return endTurn(room, 'deck');
    clearTimer(room);
    if (!g.last) g.last = { team: g.turn.team, giver: g.turn.giver, giverName: '', won: [], skips: 0, reason: 'admin' };
    g.phase = 'roundEnd';
    fx(room, g.round >= g.rounds ? 'over' : 'roundEnd');
    if (g.round >= g.rounds) finish(room);
    return changed(room);
  }
}

// Take a player out of the room, mid-game or not. A blocked name can't join this room again.
function removePlayer(room, p, block) {
  const g = room.game;
  if (g && g.turn && g.turn.giver === p.id && g.phase === 'turn') endTurn(room, 'time');
  room.players.delete(p.id);
  if (g && g.turn && g.turn.giver === p.id && g.phase !== 'turn' && g.phase !== 'over' && g.phase !== 'roundEnd') setUpTurn(room);
  if (block && !room.blocked.includes(p.name.toLowerCase())) room.blocked.push(p.name.toLowerCase());
  if (p.ws) { send(p.ws, { t: 'left', why: 'kicked' }); p.ws.pid = null; p.ws.room = null; }
}

/* ------------------------------------------------------------ housekeeping */

setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.touched > ROOM_IDLE_MS) { clearTimer(room); clearTimeout(room.backupTimer); rooms.delete(code); }
  }
}, 10 * 60 * 1000).unref();

if (require.main === module) server.listen(PORT, () => console.log('Household Names is up on port ' + PORT + ' (build ' + BUILD + ')'));

module.exports = { server, rooms, packRoom, restoreRoom };
