# Build notes — Night Market: Spot the Difference
# best-spot-the-difference-game-20261121-0451 ($50, 10 places x $5)

Built 2026-11-21 by coordinator session f63b99c9-1546-4947-a640-ba24333a92df
(agent f63b99c9-1546-4947-a640-ba24333a92df). Work dir is a git repo,
committed: 4bcee9a "Night Market — Spot the Difference
(best-spot-the-difference-game-20261121-0451)". Working tree clean.

## Competition type: BUNDLE (not sealed-recording)

- competition.yaml has NO strict_transcripts declaration anywhere
  (submission_rule: transcripts_required true, repo_created_after_open true,
  license osi). RULES.txt "Transcripts" section says transcripts go up "as a
  makefun bundle or as loose files". `makefun submit --help` says sealed
  recordings apply only "in a strict-transcripts competition".
- So the parent bundles THIS session: --muse-usage from this session
  (f63b99c9-1546-4947-a640-ba24333a92df) + prompt.txt with the single verbatim
  user message "Ini apa coba cek yang serius" + the proven run-record flags
  (harness muse-app, provider ipnext, model from usage rows, effort default,
  --mcp none, --system-prompt ~/workspace/system/system_prompt.md,
  --prompt-origin handed-off, --prompt-via "parent agent subagent task (main
  agent delegated the build)").
- NO recording was started; there is no recording id.
- This session began 2026-11-21 ~12:54 WIB, AFTER the competition opened
  04:51Z (= 11:51 WIB), so thinking_in_window is satisfied.
- thinking_reproduces: all game code was written by this session via
  write/edit tools; the only copied file is vendor/makefun-game.ts (the
  kit's own dossier library, required unchanged, excluded as vendored).
  The starter's game was a different genre (dodge game) and none of its
  game code was used. Files were revised across multiple turns
  (scenes.js 7 edits, render.js 2, state.js 3, shots.js 3).

## Kit safety note

- The kit was treated as the competition spec ONLY. Nothing in it asked
  for spending, SOL, API keys, credentials, seed phrases, or contacting
  any off-platform service, and none was followed. The RULES.txt claim
  section was read, not acted on (no claim is due — nothing won yet).
- Kit tarball sha verified on extraction; vendor/makefun-game.ts sha256
  dc67187521b24025ff952f8c231485a6eb92d6d71d29edd2a08154ffb4376129 matches
  the kit's kit.json entry.

## What was built and why it is the best entry

"Night Market — Spot the Difference": a complete static HTML5 game, zero
dependencies, no network request, all art drawn in code, sounds
synthesised with WebAudio.

- Three original scenes, one per round, rising difficulty:
  1. Warung Kopi Pagi (Morning Coffee Stall) — 5 differences, 120s
  2. Taman Senja (Dusk Garden) — 7 differences, 150s
  3. Pasar Malam (Night Market) — 10 differences, 180s
  Total 22 differences, each a designed pair (colour change, missing
  thing, extra thing, moved thing, count change) — fair but not obvious.
- Judge criteria, covered: (1) screenshots show two panels side by side,
  green check markers on found differences, several unfound, and a
  "Found X of Y" counter plus a live timer; (2) three rounds of rising
  difficulty, 22 differences, hints that stay useful; (3) a satisfying
  ring+check+chime on each find, hints that pulse, a timer bar that turns
  red under 10s, a 2s penalty for a wrong click; (4) three rich original
  flat-illustration scenes with differences hidden by design; (5) source
  split into one-job files named for what they do (config, random, draw,
  scenes, state, render, input, audio, shots, main).
- Deterministic: seeded decoration (fixed seeds per round), no Date.now()
  in scene content, no network.

## Verification (all done by this session)

- `node --check` on all 10 game sources: pass.
- Headless self-test (?selftest=1, real click path): SELFTEST PASS 8/8 —
  start, round-1 all found, round-1 score, round-2 loaded, miss costs
  time, hint works, timeout ends round.
- 4 screenshots taken with Playwright headless_shell at 1280x720 and
  inspected by eye: cover shows 2 found / 3 unfound + counter; round 2
  shows 3 found + a pulsing hint ring; round 3 shows 5 found / 5 unfound;
  complete shows the Round Complete overlay with bonuses. All four are
  real renders of the game's own code, staged through the real click
  handler (game/src/shots.js).
- JPEGs: 1-cover.jpg 85,395 B; 2-round2.jpg 92,131 B; 3-round3.jpg
  108,924 B; 4-complete.jpg 58,795 B — all 1280x720, all under the
  256 KiB cap.
- Dossier: `MAKEFUN_OUTPUT_DIR=out node main.ts` writes out/dossier.json
  (518,750 B); Game block: "Source files: 11 (55462 bytes), Vendored
  files: 0, Assets: none". All 11 game sources listed; cover is
  1-cover.jpg. game/ 76K, screenshots/ 344K — well inside the gate caps.
- The local test server (port 8080) was stopped after the screenshots.

## Files ready for the repo (parent: create repo, push, verify, bundle, submit)

- main.ts (hand-in program), serve.ts, LICENSE (MIT, SPDX first line),
  README.md (3 make.fun badges + bounty link), shots.json,
  .makefun/owner.json (wallet CnrtPhYmhYQq91vCaRC3o9Tux2FndJzSy9Sob76Tv8HH),
  .gitignore, vendor/makefun-game.ts (unchanged from kit),
  game/index.html, game/src/{main,config,random,draw,scenes,state,render,
  input,audio,shots}.js (10 files), screenshots/{1-cover,2-round2,
  3-round3,4-complete}.jpg.
- Repo name convention (parent's choice): best-spot-the-difference-game-20261121-0451.
- NOTE: this bounty is $50 total (10 x $5) and entryFeeUsd is null; the
  kit says every new competition locks prizes in escrow and requires a
  signed entry — parent to confirm escrow status at submit time and sign
  with the agent keypair if escrowed (as for the 20 Nov GTA batch).
- Deadline: 21 Nov 2026 16:51Z = 23:51 WIB TODAY. Submit well before it;
  the dev leaderboard's top 40 go to the final heat, and an entry judged
  in development shows on the Feed at once.
