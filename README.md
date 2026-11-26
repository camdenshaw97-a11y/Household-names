# Household Names

A team guessing game for a TV and your phones. One deck of names, three rounds, and the rules for
giving clues get tighter every round:

1. **Say Anything** — any words, sounds or gestures, except the name itself.
2. **One Word** — a single word per card.
3. **Charades** — no words at all.
4. **Freeze Frame** (optional bonus round) — one frozen pose per card.

The TV shows the clock, the score and the names as they are guessed. The clue-giver's phone shows the
card, with **Got it** and **Skip**. Everyone else shouts.

## Play
- TV or laptop: open `/tv`. It shows a QR code and a four-letter code.
- Phones: scan the code, or open `/` and type it in. Pick a team.
- The first person in is the host and can change the settings and start the game from their phone.
  The TV can do the same (space bar = the main button on screen, M = sound on/off).

## Settings
Deck (Family-friendly or After Dark, which is PG-13), 2–4 teams, 30–60 cards, 45–90 second turns,
3 or 4 rounds.

## Run it
```
npm install
npm start        # http://localhost:3000/tv
npm test         # plays whole games against the server
```
On Render: Node web service, build `npm install`, start `node server.js` (see `render.yaml`).

## Files
- `server.js` — rooms, the clock, scoring. The only thing that ever sees the whole deck.
- `deck.js` — every card, one per line: `Name | CATEGORY | points | blurb`. Add lines to add cards.
- `rules.js` — round rules, team colours and setting choices, shared by server and pages.
- `tv.html`, `index.html`, `common.js`, `style.css` — the TV, the phones, shared helpers, the look.

## Credits
The game is our own take on the old parlour game known as Celebrity, Fishbowl or the Hat Game.
Every card in `deck.js` was written for this version. Not for sale.
