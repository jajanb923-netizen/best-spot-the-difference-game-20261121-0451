// Scripted screenshot scenes (?shot=...). Each one plays the real rules
// forward from a fresh round — the clicks go through the same clickAt the
// player uses — so the frame is what a short game really looks like, and the
// same seed always gives the same frame. The clock is frozen afterwards, so
// the screenshot never catches the timer mid-tick.

import { HINT_SECONDS } from './config.js';
import { PANEL } from './config.js';
import { clickAt, nextRound, startGame, update } from './state.js';

/** Click one difference by id, on the left panel, through the real path. */
function find(state, id) {
  const d = state.differences.find((item) => item.id === id);
  if (!d) throw new Error(`no difference ${id}`);
  clickAt(state, PANEL.left.x + d.x, PANEL.left.y + d.y);
}

/** Settle the marker animations and freeze the clock at a fixed reading. */
function settle(state, seconds) {
  update(state, 1.0);
  state.timeLeft = seconds;
  state.shotMode = true;
}

/**
 * Stage the named scene on a fresh state and return the screen to show.
 * Names: cover, round2, round3, complete. Any other name is the cover.
 */
export function stageShot(name, state) {
  startGame(state);
  if (name === 'round2') {
    nextRound(state);
    find(state, 'moon');
    find(state, 'lantern');
    find(state, 'lily-flower');
    const hintOn = state.differences.find((d) => d.id === 'bench-slat');
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - 30);
    state.hint = { x: hintOn.x, y: hintOn.y, r: hintOn.r, t: HINT_SECONDS };
    settle(state, 108);
    return;
  }
  if (name === 'round3') {
    nextRound(state);
    nextRound(state);
    find(state, 'wheel-cabin');
    find(state, 'balloon-colour');
    find(state, 'skewer');
    find(state, 'toy-duck');
    find(state, 'cat-tail');
    settle(state, 131);
    return;
  }
  if (name === 'complete') {
    find(state, 'awning-stripe');
    find(state, 'coffee-cup');
    find(state, 'roof-cat');
    find(state, 'sign-icon');
    find(state, 'pot-flower');
    settle(state, 84);
    return;
  }
  // cover: round one, two found, three still to find.
  find(state, 'awning-stripe');
  find(state, 'coffee-cup');
  settle(state, 96);
}
