# Changelog

## 1.1.0 — November 26, 2026
**Fixes**
- The "How to play" pop-up on phones couldn't be closed and couldn't be scrolled: it was taller
  than the screen, so its button and the backdrop ended up off-screen, and swiping scrolled the page
  behind it. Every pop-up now fits the screen, scrolls inside itself, keeps the page behind still,
  and has a ✕ in the corner. Tapping the backdrop or pressing Escape also closes it.

**Admin controls**
- New "Admin controls" button in the phone menu (≡), unlocked with a PIN. The PIN is set on the
  server as the `ADMIN_PIN` environment variable (on Render: the service's Environment tab) and is
  never in the code. Without it set, the button says admin isn't set up.
- Five wrong tries locks that phone out for a minute; twenty wrong tries in one game locks the whole
  game's PIN pad for ten minutes.
- Once unlocked, that phone gets everything the host and the TV can do, plus:
  - **Players:** move to another team, make host, rename, kick, or kick and block the name from
    rejoining (with an unblock list). Works mid-game: kicking the clue-giver ends their turn and the
    cards they already got still count; kicking the next person up hands the turn to a teammate.
  - **Game:** pause or resume the clock, end this turn now, next clue-giver on the same team, skip
    to the next team, end this round now, end the game.
  - **Scores:** +1 / −1 for any team.
- The admin phone stays unlocked through a reconnect or a server restart. "Lock admin controls"
  locks it again.
- `npm test`: 87 checks (16 new ones for admin controls, run with a stand-in PIN).

## 1.0.0 — November 26, 2026
First version.
- TV + phones, joined by QR code or a four-letter code. 2–4 teams, up to 20 players.
- Three rounds on the same deck (Say Anything, One Word, Charades) and an optional fourth (Freeze Frame).
- 418 original cards: 328 family-friendly and 90 After Dark (PG-13), each with points for difficulty.
- The clue-giver's phone gets the card, Got it, Skip, Undo and Pause. Nobody else is sent the card.
- The team that is behind starts each new round. Awards at the end.
- Rejoin by reopening the page or typing the same name. The TV keeps a sealed backup, so a game
  survives a server restart.
- `npm test`: 71 checks over two whole games.
