// Night Market — Spot the Difference: bootstrap, game loop and wiring.
// The canvas keeps a fixed 1280x720 backing store and is letterboxed to
// the window; input coordinates are translated back the same way.

import { FIELD } from './config.js';
import { attachInput } from './input.js';
import { buttonAt, onActionButton, render } from './render.js';
import {
  SCREEN_OVER,
  SCREEN_PLAY,
  SCREEN_ROUND_END,
  SCREEN_TITLE,
  SCREEN_WIN,
  clickAt,
  newState,
  nextRound,
  restartRound,
  startGame,
  update,
  useHint,
} from './state.js';
import { stageShot } from './shots.js';
import { toggleMute } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = newState();
let hover = null;
let last = performance.now();

/** Fit the 1280x720 canvas into the window, letterboxed. */
function resize() {
  const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
  canvas.style.width = `${Math.floor(FIELD.width * scale)}px`;
  canvas.style.height = `${Math.floor(FIELD.height * scale)}px`;
}

window.addEventListener('resize', resize);
resize();

/** What a click at logical (x, y) does on the current screen. */
function onClick(x, y) {
  if (state.screen === SCREEN_TITLE) {
    startGame(state);
    return;
  }
  if (state.screen === SCREEN_ROUND_END) {
    if (onActionButton(x, y)) nextRound(state);
    return;
  }
  if (state.screen === SCREEN_OVER) {
    if (onActionButton(x, y)) restartRound(state);
    return;
  }
  if (state.screen === SCREEN_WIN) {
    if (onActionButton(x, y)) startGame(state);
    return;
  }
  if (state.screen !== SCREEN_PLAY) return;
  const button = buttonAt(x, y);
  if (button === 'hint') {
    useHint(state);
    return;
  }
  if (button === 'restart') {
    restartRound(state);
    return;
  }
  if (button === 'sound') {
    toggleMute();
    return;
  }
  clickAt(state, x, y);
}

/** What a key does on the current screen. */
function onKey(key) {
  if (key === 'enter' || key === ' ') {
    if (state.screen === SCREEN_TITLE) startGame(state);
    else if (state.screen === SCREEN_ROUND_END) nextRound(state);
    else if (state.screen === SCREEN_OVER) restartRound(state);
    else if (state.screen === SCREEN_WIN) startGame(state);
    return;
  }
  if (key === 'h') useHint(state);
  else if (key === 'r' && state.screen === SCREEN_PLAY) restartRound(state);
  else if (key === 'm') toggleMute();
}

attachInput(canvas, {
  onClick,
  onMove: (x, y) => {
    hover = { x, y };
  },
  onLeave: () => {
    hover = null;
  },
  onKey,
});

/**
 * A headless self-test (?selftest=1): plays the real rules through and
 * writes the result into the document title and a #selftest node, so a
 * headless run can read it back without a mouse.
 */
function runSelfTest() {
  const results = [];
  const check = (name, ok) => results.push(`${name}=${ok ? 'ok' : 'FAIL'}`);
  startGame(state);
  check('start', state.screen === SCREEN_PLAY && state.differences.length === 5);
  // Click every difference of round one, on the left panel.
  const panel = { x: 36, y: 96 };
  for (const d of [...state.differences]) {
    clickAt(state, panel.x + d.x, panel.y + d.y);
  }
  check('round1-all-found', state.screen === SCREEN_ROUND_END && state.foundCount === 5);
  check('round1-score', state.score > 500);
  nextRound(state);
  check('round2-loaded', state.screen === SCREEN_PLAY && state.differences.length === 7);
  // A wrong click costs time and counts as a miss.
  const before = state.timeLeft;
  clickAt(state, panel.x + 280, panel.y + 210);
  check('miss-costs-time', state.misses === 1 && state.timeLeft < before);
  // A hint marks one unfound difference and costs a hint.
  const hintsBefore = state.hintsLeft;
  useHint(state);
  check('hint-works', state.hint !== null && state.hintsLeft === hintsBefore - 1);
  // The timer ends the round at zero.
  state.timeLeft = 0.05;
  update(state, 0.1);
  check('timeout-ends-round', state.screen === SCREEN_OVER);
  const verdict = results.every((r) => r.endsWith('=ok')) ? 'PASS' : 'FAIL';
  const text = `SELFTEST ${verdict} ${results.join(' ')}`;
  document.title = text;
  const node = document.getElementById('selftest');
  if (node) node.textContent = text;
}

// Screenshot staging (?shot=...) and the self-test (?selftest=1).
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(shot, state);
  document.title = `shot:${shot}`;
}
if (params.get('selftest') === '1') {
  runSelfTest();
}

/** The game loop: fixed-step updates, one render a frame. */
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!state.shotMode) update(state, dt);
  render(ctx, state, hover, now / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
