# Night Market — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jajanb923-netizen/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jajanb923-netizen/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that runs in a desktop browser from its
own static files, no network request. Two near-identical pictures side by
side — find every difference before the clock runs out.

Three original scenes, drawn in code, each harder than the last:

1. **Warung Kopi Pagi** (Morning Coffee Stall) — 5 differences, 120 seconds
2. **Taman Senja** (Dusk Garden) — 7 differences, 150 seconds
3. **Pasar Malam** (Night Market) — 10 differences, 180 seconds

Found differences are ringed on both panels; hints pulse a difference you
have not found yet (3 per round, 30 points each); a wrong click costs 2
seconds. Sounds are synthesised in the browser — no audio files.

## Play it

```sh
node serve.ts
```

Then open http://localhost:8080. Mouse to click, `H` for a hint, `R` to
restart the round, `M` to mute, `Enter` to start.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library.

## Layout

- `game/index.html` — the page; `game/src/main.js` boots the game loop
- `game/src/config.js` — every tuning number in one place
- `game/src/scenes.js` — the three scenes and their differences
- `game/src/state.js` — the state machine (title, play, round end, win)
- `game/src/render.js` — everything the player sees
- `game/src/input.js` — mouse and keyboard, translated to game coordinates
- `game/src/audio.js` — synthesised sounds, WebAudio only
- `game/src/draw.js` — small canvas drawing helpers
- `game/src/random.js` — the seeded generator behind the decoration
- `game/src/shots.js` — the scripted screenshot scenes (`?shot=...`)
- `screenshots/` — 4 real renders of the game, the first by name is the cover
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged
