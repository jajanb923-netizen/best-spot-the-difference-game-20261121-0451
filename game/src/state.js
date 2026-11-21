// The game's state machine: title, play, round end, time up, win. One
// state object holds everything the renderer needs; nothing here touches
// the canvas or the DOM, so the same logic stages the screenshots.

import { BEST_KEY, HINT_SECONDS, MARK_SECONDS, MISS_PENALTY_SECONDS, ROUNDS, SCORE } from './config.js';
import { PANEL } from './config.js';
import { buildDifferences, SCENES } from './scenes.js';
import { playFound, playHint, playMiss, playRound, playTick, playWin } from './audio.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_ROUND_END = 'round-end';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

/** The best total score ever, kept in this browser only. */
export function loadBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch (error) {
    return 0;
  }
}

export function saveBest(score) {
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch (error) {
    /* A browser that refuses storage still plays the game. */
  }
}

/** A fresh state, showing the title screen over round one's scene. */
export function newState() {
  const state = {
    screen: SCREEN_TITLE,
    roundIndex: 0,
    differences: [],
    foundCount: 0,
    score: 0,
    totalScore: 0,
    misses: 0,
    hintsLeft: 0,
    timeLeft: 0,
    timeTotal: 0,
    marks: [],
    hint: null,
    message: '',
    messageTime: 0,
    best: loadBest(),
    lastTick: -1,
  };
  loadRound(state, 0);
  return state;
}

/** Load one round's scene and differences, without starting its clock. */
export function loadRound(state, index) {
  state.roundIndex = index;
  state.round = ROUNDS[index];
  state.scene = SCENES[state.round.scene];
  state.differences = buildDifferences(state.round.scene).map((d) => ({ ...d, found: false }));
  state.foundCount = 0;
  state.misses = 0;
  state.hintsLeft = state.round.hints;
  state.timeLeft = state.round.seconds;
  state.timeTotal = state.round.seconds;
  state.marks = [];
  state.hint = null;
  state.lastTick = -1;
}

/** Start the game from the title screen: round one, score zero. */
export function startGame(state) {
  state.totalScore = 0;
  state.score = 0;
  loadRound(state, 0);
  state.screen = SCREEN_PLAY;
  setMessage(state, `Round 1: ${state.round.name} — find ${state.differences.length} differences!`);
}

/** Move to the next round, or to the win screen after the last one. */
export function nextRound(state) {
  if (state.roundIndex + 1 >= ROUNDS.length) {
    state.screen = SCREEN_WIN;
    if (state.totalScore > state.best) {
      state.best = state.totalScore;
      saveBest(state.best);
    }
    playWin();
    return;
  }
  loadRound(state, state.roundIndex + 1);
  state.screen = SCREEN_PLAY;
  setMessage(state, `Round ${state.roundIndex + 1}: ${state.round.name} — find ${state.differences.length} differences!`);
}

/** Restart the current round, keeping the total score so far. */
export function restartRound(state) {
  state.score = state.totalScore;
  loadRound(state, state.roundIndex);
  state.screen = SCREEN_PLAY;
  setMessage(state, `Round ${state.roundIndex + 1} restarted — find ${state.differences.length} differences!`);
}

/** A short-lived status line under the panels. */
export function setMessage(state, message) {
  state.message = message;
  state.messageTime = 3;
}

/** The nearest unfound difference to (x, y) in panel-local coordinates. */
function nearestDifference(state, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const d of state.differences) {
    if (d.found) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r && dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return best;
}

/**
 * A click at logical (x, y). Returns 'found', 'miss', or null when the
 * click is not on a panel. A found difference is marked on both panels.
 */
export function clickAt(state, x, y) {
  if (state.screen !== SCREEN_PLAY) return null;
  let local = null;
  if (x >= PANEL.left.x && x <= PANEL.left.x + PANEL.width && y >= PANEL.left.y && y <= PANEL.left.y + PANEL.height) {
    local = { x: x - PANEL.left.x, y: y - PANEL.left.y };
  } else if (x >= PANEL.right.x && x <= PANEL.right.x + PANEL.width && y >= PANEL.right.y && y <= PANEL.right.y + PANEL.height) {
    local = { x: x - PANEL.right.x, y: y - PANEL.right.y };
  }
  if (!local) return null;
  const found = nearestDifference(state, local.x, local.y);
  if (!found) {
    state.misses += 1;
    state.timeLeft = Math.max(0, state.timeLeft - MISS_PENALTY_SECONDS);
    setMessage(state, `Nothing there — ${MISS_PENALTY_SECONDS}s lost. Look closer!`);
    playMiss();
    return 'miss';
  }
  found.found = true;
  state.foundCount += 1;
  state.score += SCORE.perFind;
  state.marks.push({ x: found.x, y: found.y, t: MARK_SECONDS });
  setMessage(state, `Found it — ${found.label}! (${state.foundCount}/${state.differences.length})`);
  playFound();
  if (state.foundCount === state.differences.length) finishRound(state);
  return 'found';
}

/** The round is complete: time bonus, accuracy bonus, then the end screen. */
function finishRound(state) {
  const timeBonus = Math.round(state.timeLeft) * SCORE.timeBonusPerSecond;
  const accuracyBonus = state.misses === 0 ? SCORE.noMissBonus : 0;
  state.score += timeBonus + accuracyBonus;
  state.totalScore = state.score;
  state.screen = SCREEN_ROUND_END;
  state.roundBonus = { time: timeBonus, accuracy: accuracyBonus };
  playRound();
}

/** Spend one hint: pulse a random unfound difference on both panels. */
export function useHint(state) {
  if (state.screen !== SCREEN_PLAY) return false;
  if (state.hintsLeft <= 0) {
    setMessage(state, 'No hints left this round.');
    return false;
  }
  const open = state.differences.filter((d) => !d.found);
  if (open.length === 0) return false;
  const pick = open[Math.floor(Math.random() * open.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - SCORE.hintCost);
  state.hint = { x: pick.x, y: pick.y, r: pick.r, t: HINT_SECONDS };
  setMessage(state, `Hint: look near the pulsing ring (−${SCORE.hintCost} pts).`);
  playHint();
  return true;
}

/** Advance the clock and the animations by dt seconds. */
export function update(state, dt) {
  if (state.messageTime > 0) state.messageTime -= dt;
  for (const mark of state.marks) mark.t -= dt;
  state.marks = state.marks.filter((m) => m.t > 0);
  if (state.hint) {
    state.hint.t -= dt;
    if (state.hint.t <= 0) state.hint = null;
  }
  if (state.screen !== SCREEN_PLAY) return;
  state.timeLeft -= dt;
  const whole = Math.ceil(state.timeLeft);
  if (state.timeLeft <= 10.5 && whole !== state.lastTick && whole > 0) {
    state.lastTick = whole;
    playTick();
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_OVER;
    state.totalScore = state.score;
    if (state.totalScore > state.best) {
      state.best = state.totalScore;
      saveBest(state.best);
    }
    setMessage(state, `Time's up! You found ${state.foundCount} of ${state.differences.length}.`);
    playMiss();
  }
}
