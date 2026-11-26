'use strict';
/* Household Names — plays whole games against the real server with pretend phones. Run with: npm test */
process.env.SPEED_UP = '40';
const WebSocket = require('ws');
const { server, rooms, packRoom } = require('../server');
const Deck = require('../deck');
const Rules = require('../rules');

let pass = 0, fail = 0;
function ok(cond, label) { if (cond) { pass++; } else { fail++; console.log('  FAIL  ' + label); } }
const sleep = n => new Promise(r => setTimeout(r, n));

function client(port) {
  const ws = new WebSocket('ws://localhost:' + port + '/ws');
  const c = { ws, state: null, msgs: [], seat: null, host: null, blob: null, sawCard: false };
  ws.on('message', raw => {
    const m = JSON.parse(raw); c.msgs.push(m);
    if (m.t === 'state') { c.state = m; if (m.card) c.sawCard = true; }
    if (m.t === 'seated') c.seat = m;
    if (m.t === 'hosting') c.host = m;
    if (m.t === 'backup') c.blob = m.blob;
  });
  c.send = m => ws.send(JSON.stringify(m));
  c.open = new Promise(r => ws.on('open', r));
  c.close = () => new Promise(r => { ws.on('close', r); ws.close(); });
  c.last = t => [...c.msgs].reverse().find(m => m.t === t);
  return c;
}
async function until(fn, label, max = 4000) {
  const t0 = Date.now();
  while (Date.now() - t0 < max) { if (fn()) return true; await sleep(10); }
  ok(false, 'timed out waiting for: ' + label); return false;
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  /* ---- the deck ---- */
  ok(Deck.family.length >= 250, 'family deck has 250+ cards (' + Deck.family.length + ')');
  ok(Deck.afterDark.length >= 60, 'after dark deck has 60+ cards (' + Deck.afterDark.length + ')');
  ok(Deck.family.every(c => c.rating === 'family'), 'family cards are all rated family');
  ok(new Set(Deck.ALL.map(c => c.id)).size === Deck.ALL.length, 'card ids are unique');
  ok(Deck.ALL.every(c => c.blurb.length > 20 && c.blurb.length < 190 && c.name.length <= 64), 'every card has a sensible name and blurb');
  ok(Deck.ALL.every(c => Rules.CATEGORIES[c.cat]), 'every card has a known category');

  /* ---- http ---- */
  const get = p => new Promise(r => require('http').get('http://localhost:' + port + p, res => { let d = ''; res.on('data', x => d += x); res.on('end', () => r({ code: res.statusCode, body: d })); }));
  ok((await get('/health')).body === 'ok', '/health');
  ok(/^[0-9a-f]{12}$/.test((await get('/version')).body), '/version');
  ok((await get('/uptime')).body.startsWith('started'), '/uptime');
  ok((await get('/qr.svg?u=hello')).body.includes('<svg'), '/qr.svg');
  ok((await get('/')).body.includes('data-build='), 'phone page is served');
  ok((await get('/tv')).body.includes('Household Names'), 'tv page is served');
  ok((await get('/deck.js')).code === 404, 'the deck is not downloadable');
  ok((await get('/server.js')).code === 404, 'server code is not downloadable');

  /* ---- a room and its lobby ---- */
  const tv = client(port); await tv.open; tv.send({ t: 'tv' });
  await until(() => tv.host && tv.state, 'tv gets a room');
  const code = tv.host.code;
  ok(/^[A-Z]{4}$/.test(code), 'room code is four letters');
  const names = ['Ana', 'Ben', 'Cam', 'Dee', 'Eli'];
  const ph = [];
  for (const n of names) { const c = client(port); await c.open; c.send({ t: 'join', code, name: n }); await until(() => c.seat && c.state, n + ' joins'); ph.push(c); }
  const bad = client(port); await bad.open; bad.send({ t: 'join', code: 'QQQQ', name: 'Zed' });
  await until(() => bad.last('nope'), 'wrong code is refused'); ok(bad.last('nope').why === 'noroom', 'wrong code says no room');
  bad.send({ t: 'join', code, name: 'ana' }); await until(() => bad.msgs.filter(m => m.t === 'nope').length === 2, 'taken name refused');
  ok(bad.last('nope').why === 'taken', 'a name in use is refused');
  await bad.close();
  await until(() => tv.state.count === 5, 'tv sees five players');
  const sizes = () => tv.state.teams.map(t => t.players.length);
  ok(JSON.stringify(sizes().sort()) === '[2,3]', 'players are spread across two teams ' + JSON.stringify(sizes()));
  ok(tv.state.captainId === ph[0].seat.id, 'first player in is the host');
  ok(ph[0].state.you.captain && !ph[1].state.you.captain, 'only the host is told they are the host');

  ph[1].send({ t: 'set', key: 'timer', value: 45 }); await sleep(60);
  ok(tv.state.settings.timer === 60, 'a non-host cannot change settings');
  ph[0].send({ t: 'set', key: 'timer', value: 45 }); tv.send({ t: 'set', key: 'cards', value: 30 }); tv.send({ t: 'set', key: 'cards', value: 31 });
  await until(() => tv.state.settings.timer === 45 && tv.state.settings.cards === 30, 'host and tv can change settings');
  tv.send({ t: 'set', key: 'teams', value: 3 }); await until(() => tv.state.teams.length === 3, 'three teams');
  ok(!!tv.state.startError, 'cannot start with a short team');
  tv.send({ t: 'start' }); await until(() => tv.last('nope'), 'start refused'); ok(tv.state.phase === 'lobby', 'still in the lobby');
  tv.send({ t: 'set', key: 'teams', value: 2 }); await until(() => tv.state.teams.length === 2 && !tv.state.startError, 'back to two teams');
  ph[4].send({ t: 'team', team: 0 }); ph[3].send({ t: 'team', team: 1 }); ph[2].send({ t: 'team', team: 0 }); ph[1].send({ t: 'team', team: 1 }); ph[0].send({ t: 'team', team: 0 });
  await until(() => JSON.stringify(sizes()) === '[3,2]', 'players pick teams');
  ph[1].send({ t: 'rename', team: 1, name: 'The <b>Cousins</b>' }); ph[1].send({ t: 'rename', team: 0, name: 'Nope' });
  await until(() => tv.state.teams[1].name !== 'Team Blueberry', 'team renamed');
  ok(tv.state.teams[1].name === 'The b Cousins /b' && tv.state.teams[0].name === 'Team Tomato', 'rename is cleaned and only works on your own team');

  /* ---- round one ---- */
  ph[0].send({ t: 'start' });
  await until(() => tv.state.phase === 'intro', 'game starts with the round intro');
  ok(tv.state.round === 1 && tv.state.pileCount === 30 && tv.state.deckCount === 30, 'thirty cards dealt');
  const room = rooms.get(code);
  ok(room.game.deck.every(id => Deck.BY_ID.get(id).rating === 'family'), 'family deck has no after-dark cards');
  tv.send({ t: 'next' }); await until(() => tv.state.phase === 'ready', 'intro can be skipped');
  const byId = id => ph.find(c => c.seat.id === id);
  let giver = byId(tv.state.turn.giver);
  ok(!!giver && giver.state.you.team === tv.state.turn.team, 'the clue-giver is on the team that is up');
  const other = ph.find(c => c !== giver);
  other.send({ t: 'go' }); await sleep(60);
  ok(tv.state.phase === 'ready' || other.state.you.captain, 'only the clue-giver (or host) starts the clock');
  if (tv.state.phase === 'ready') giver.send({ t: 'go' });
  await until(() => tv.state.phase === 'turn' && giver.state.card, 'turn starts and the giver sees a card');
  ok(!tv.state.card && ph.filter(c => c !== giver).every(c => !c.state.card), 'nobody else is sent the card');
  const first = giver.state.card;
  giver.send({ t: 'skip' }); await until(() => giver.state.card && giver.state.card.id !== first.id, 'skip shows the next card');
  ok(tv.state.turn.skips === 1 && room.game.pile[room.game.pile.length - 1] === first.id, 'skipped card goes to the bottom');
  const second = giver.state.card, teamId = tv.state.turn.team;
  giver.send({ t: 'got' }); await until(() => tv.state.turn.won.length === 1, 'got it counts');
  ok(tv.state.teams.find(t => t.id === teamId).score === second.points, 'points go to the team');
  ok(tv.state.turn.won[0].name === second.name && tv.state.turn.won[0].blurb === undefined, 'tv shows the guessed name only');
  giver.send({ t: 'undo' }); await until(() => tv.state.turn.won.length === 0, 'undo takes it back');
  ok(tv.state.teams.find(t => t.id === teamId).score === 0 && giver.state.card.id === second.id, 'undo restores the score and the card');
  other.send({ t: 'got' }); await sleep(60); ok(tv.state.turn.won.length === 0, 'other players cannot score the card');
  giver.send({ t: 'got' }); giver.send({ t: 'got' }); await until(() => tv.state.turn.won.length === 2, 'two cards');
  tv.send({ t: 'pause' }); await until(() => tv.state.turn.paused, 'tv can pause');
  const rem = tv.state.turn.remaining; await sleep(200);
  giver.send({ t: 'got' }); await sleep(60); ok(tv.state.turn.won.length === 2 && tv.state.turn.remaining === rem, 'nothing moves while paused');
  giver.send({ t: 'resume' }); await until(() => !tv.state.turn.paused, 'giver can resume');
  await until(() => tv.state.phase === 'recap', 'the clock runs out', 4000);
  ok(tv.state.last.won.length === 2 && tv.state.last.reason === 'time', 'recap lists what was won');
  ok(tv.state.turn.team !== teamId, 'the other team is up next');
  ok(tv.state.pileCount === 28, 'won cards left the deck');
  await until(() => tv.state.phase === 'ready', 'recap moves on by itself', 3000);

  // Play out the rest of the round quickly, checking the rotation as we go.
  const givers = { [teamId]: [giver.seat.id] };
  async function playTurn(maxCards) {
    const t = tv.state.turn, g = byId(t.giver);
    (givers[t.team] = givers[t.team] || []).push(t.giver);
    g.send({ t: 'go' }); await until(() => tv.state.phase === 'turn' && g.state.card, 'turn begins');
    for (let i = 0; i < maxCards && tv.state.phase === 'turn'; i++) {
      const n = tv.state.turn.won.length; g.send({ t: 'got' });
      await until(() => tv.state.phase !== 'turn' || tv.state.turn.won.length > n, 'card counted');
    }
    if (tv.state.phase === 'turn') { await until(() => tv.state.phase === 'recap', 'time runs out', 4000); tv.send({ t: 'next' }); await until(() => tv.state.phase === 'ready', 'next turn ready'); }
  }
  let guard = 0;
  while (tv.state.phase === 'ready' && guard++ < 20) await playTurn(9);
  ok(tv.state.phase === 'roundEnd', 'round ends when the deck is empty');
  ok(tv.state.teams.reduce((a, t) => a + t.score, 0) === room.game.deck.reduce((a, id) => a + Deck.BY_ID.get(id).points, 0), 'all points handed out exactly once');
  const t0 = givers[0] || [], uniq0 = new Set(t0.slice(0, 3));
  ok(t0.length < 3 || uniq0.size === 3, 'clue-givers rotate through the team');

  /* ---- later rounds ---- */
  ph[1].send({ t: 'next' }); await sleep(60); ok(tv.state.phase === 'roundEnd', 'only the host or tv starts the next round');
  const low = tv.state.teams.slice().sort((a, b) => a.score - b.score)[0], tie = tv.state.teams[0].score === tv.state.teams[1].score;
  ph[0].send({ t: 'next' }); await until(() => tv.state.phase === 'intro' && tv.state.round === 2, 'round two intro');
  ok(tv.state.pileCount === 30, 'the same deck comes back');
  ok(tie || tv.state.turn.team === low.id, 'the team that is behind goes first');
  ok(new Set(room.game.pile).size === 30 && room.game.pile.every(id => room.game.deck.includes(id)), 'round two uses exactly the same cards');

  /* ---- a phone drops and comes back; the server restarts ---- */
  tv.send({ t: 'next' }); await until(() => tv.state.phase === 'ready', 'ready in round two');
  giver = byId(tv.state.turn.giver); giver.send({ t: 'go' });
  await until(() => tv.state.phase === 'turn' && giver.state.card, 'round two turn');
  giver.send({ t: 'got' }); await until(() => tv.state.turn.won.length === 1, 'one card in round two');
  const seat = giver.seat, idx = ph.indexOf(giver);
  await giver.close(); await until(() => tv.state.turn.paused && !tv.state.turn.giverOn, 'clock stops when the giver drops');
  const back = client(port); await back.open; back.send({ t: 'rejoin', code, id: seat.id, token: seat.token });
  await until(() => back.state && back.state.card, 'giver is back and sees the card again'); ph[idx] = back; giver = back;
  ok(back.state.turn.paused, 'still paused until someone resumes');
  await until(() => tv.blob, 'tv holds a backup');
  await sleep(250);
  const blob = tv.blob, token = tv.host.token, scoreBefore = JSON.stringify(tv.state.teams.map(t => t.score)), pileBefore = tv.state.pileCount;
  ok(blob === tv.blob && packRoom(room).length > 100, 'backup is a sealed blob');
  // "Restart": the room vanishes from memory, every socket drops.
  clearTimeout(room.timer); clearTimeout(room.backupTimer); rooms.delete(code);
  await Promise.all([tv.close(), ...ph.map(c => c.close())]);
  const early = client(port); await early.open; early.send({ t: 'rejoin', code, id: seat.id, token: seat.token });
  await until(() => early.last('nope'), 'phone is told to wait'); ok(early.last('nope').why === 'noroom', 'no room until the tv hands it back');
  const forged = client(port); await forged.open; forged.send({ t: 'tv', code, token: 'wrong', blob });
  await until(() => forged.host, 'forged restore answered'); ok(forged.host.code !== code && !rooms.has(code), 'a backup with the wrong token is refused');
  await forged.close();
  const tv2 = client(port); await tv2.open; tv2.send({ t: 'tv', code, token, blob });
  await until(() => tv2.host && tv2.state, 'tv restores the room');
  ok(tv2.host.code === code && tv2.state.phase === 'turn' && tv2.state.turn.paused, 'game is back, paused mid-turn');
  ok(JSON.stringify(tv2.state.teams.map(t => t.score)) === scoreBefore && tv2.state.pileCount === pileBefore, 'scores and deck survived');
  early.send({ t: 'rejoin', code, id: seat.id, token: seat.token }); await until(() => early.state && early.state.card, 'giver rejoins after the restart');
  const ph2 = [];
  for (const c of ph) { if (c.seat.id === seat.id) { ph2.push(early); continue; } const n = client(port); await n.open; n.send({ t: 'join', code, name: c.seat.name }); await until(() => n.seat && n.state, 'rejoin by name'); ok(n.seat.id === c.seat.id, c.seat.name + ' gets the same seat back by name'); ph2.push(n); }
  const tvB = tv2, P = ph2, by2 = id => P.find(c => c.seat.id === id);
  early.send({ t: 'resume' }); await until(() => !tvB.state.turn.paused, 'resumed after restore');

  // Finish rounds two and three with every card guessed.
  async function finishRound() {
    let g2 = 0;
    while ((tvB.state.phase === 'turn' || tvB.state.phase === 'ready' || tvB.state.phase === 'recap') && g2++ < 60) {
      if (tvB.state.phase === 'recap') { tvB.send({ t: 'next' }); await until(() => tvB.state.phase !== 'recap', 'recap skipped'); continue; }
      const g = by2(tvB.state.turn.giver);
      if (tvB.state.phase === 'ready') { g.send({ t: 'go' }); await until(() => tvB.state.phase === 'turn', 'turn on'); }
      while (tvB.state.phase === 'turn') { const n = tvB.state.pileCount; g.send({ t: 'got' }); await until(() => tvB.state.phase !== 'turn' || tvB.state.pileCount < n, 'card'); }
    }
  }
  await finishRound(); ok(tvB.state.phase === 'roundEnd' && tvB.state.round === 2, 'round two done');
  tvB.send({ t: 'next' }); await until(() => tvB.state.phase === 'intro' && tvB.state.round === 3, 'round three');
  tvB.send({ t: 'next' }); await until(() => tvB.state.phase === 'ready', 'ready in round three');
  await finishRound();
  ok(tvB.state.phase === 'over', 'game is over after round three');
  const total = rooms.get(code).game.deck.reduce((a, id) => a + Deck.BY_ID.get(id).points, 0);
  ok(tvB.state.teams.reduce((a, t) => a + t.score, 0) === total * 3, 'three rounds of points add up');
  ok(tvB.state.roundScores.length === 3 && tvB.state.roundScores.every(r => Object.values(r).reduce((a, b) => a + b, 0) === total), 'each round adds up on the scoresheet');
  const top = Math.max(...tvB.state.teams.map(t => t.score));
  ok(tvB.state.winners.length >= 1 && tvB.state.winners.every(id => tvB.state.teams.find(t => t.id === id).score === top), 'the winner has the most points');
  ok(tvB.state.awards.length >= 2 && tvB.state.awards[0].title === 'Top Clue-Giver', 'awards are handed out');
  ok(!tvB.sawCard && !tv.sawCard, 'the tv was never sent a card in play');

  /* ---- play again, after dark, four rounds ---- */
  const usedFirst = new Set(rooms.get(code).game.deck);
  tvB.send({ t: 'again' }); await until(() => tvB.state.phase === 'lobby', 'play again returns to the lobby');
  ok(JSON.stringify(tvB.state.teams.map(t => t.players.length)) === '[3,2]', 'teams are kept');
  tvB.send({ t: 'set', key: 'rating', value: 'dark' }); tvB.send({ t: 'set', key: 'rounds', value: 4 }); tvB.send({ t: 'set', key: 'cards', value: 40 });
  await until(() => tvB.state.settings.rounds === 4 && tvB.state.settings.cards === 40, 'settings for game two');
  tvB.send({ t: 'start' }); await until(() => tvB.state.phase === 'intro', 'game two starts');
  const deck2 = rooms.get(code).game.deck;
  ok(deck2.length === 40 && deck2.every(id => !usedFirst.has(id)), 'game two deals cards that were not in game one');
  const nDark = deck2.filter(id => Deck.BY_ID.get(id).rating === 'dark').length;
  ok(nDark === 20, 'after dark deck is half spicy cards (' + nDark + ')');
  ok(tvB.state.rounds === 4, 'four rounds');
  const late = client(port); await late.open; late.send({ t: 'join', code, name: 'Flo' });
  await until(() => late.seat && late.state, 'late joiner gets in mid-game');
  ok(late.state.you.team === 1, 'late joiner lands on the smaller team');
  for (let r = 1; r <= 4; r++) {
    if (tvB.state.phase === 'intro') { tvB.send({ t: 'next' }); await until(() => tvB.state.phase === 'ready', 'ready'); }
    P.push(late); await finishRound(); P.pop();
    if (r < 4) { ok(tvB.state.phase === 'roundEnd', 'round ' + r + ' of game two done'); tvB.send({ t: 'next' }); await until(() => tvB.state.round === r + 1, 'next round'); }
  }
  ok(tvB.state.phase === 'over' && tvB.state.roundScores.length === 4, 'four-round game finishes');
  tvB.send({ t: 'end' }); await until(() => tvB.state.phase === 'lobby', 'end game returns to the lobby');
  P[1].send({ t: 'leave' }); await until(() => tvB.state.count === 5, 'a player can leave in the lobby');

  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
