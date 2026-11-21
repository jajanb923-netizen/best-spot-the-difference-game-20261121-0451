// Everything the player sees: the HUD, the two picture panels, the markers,
// the hint pulse, the bottom bar and the screens. The renderer only reads
// state; it never changes it.

import { DIVIDER_X, FIELD, PALETTE, PANEL } from './config.js';
import { MARK_SECONDS } from './config.js';
import { circle, line, ring, text, vgrad } from './draw.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_ROUND_END, SCREEN_TITLE, SCREEN_WIN } from './state.js';
import { sceneRandom } from './scenes.js';
import { isMuted } from './audio.js';

/** The bottom-bar buttons, in logical coordinates. */
export const BUTTONS = {
  hint: { x: 36, y: 640, w: 170, h: 44, label: 'Hint (H)' },
  restart: { x: 220, y: 640, w: 170, h: 44, label: 'Restart (R)' },
  sound: { x: 404, y: 640, w: 170, h: 44, label: 'Sound: On' },
};

/** The centred action button on the end screens. */
export const ACTION_BUTTON = { x: 540, y: 470, w: 200, h: 52 };

/** Which bottom-bar button (if any) sits at logical (x, y). */
export function buttonAt(x, y) {
  for (const [name, b] of Object.entries(BUTTONS)) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return name;
  }
  return null;
}

/** Whether logical (x, y) is on the centred action button. */
export function onActionButton(x, y) {
  const b = ACTION_BUTTON;
  return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
}

/** A rounded rectangle, with a plain fallback for old canvases. */
function rrect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
}

/** Seconds as m:ss. */
function clock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Draw one picture panel: base scene, then each difference's side. */
function drawPanel(ctx, state, side, now) {
  const panel = side === 'A' ? PANEL.left : PANEL.right;
  ctx.save();
  ctx.beginPath();
  ctx.rect(panel.x, panel.y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(panel.x, panel.y);
  // A fresh generator every frame: the same seed draws the same picture,
  // so the decoration never flickers between frames.
  state.scene.drawBase(ctx, sceneRandom(state.roundIndex));
  for (const d of state.differences) {
    if (side === 'A') d.a(ctx, d.x, d.y);
    else d.b(ctx, d.x, d.y);
  }
  ctx.restore();
  // The panel frame and its tag.
  ctx.strokeStyle = PALETTE.panelEdge;
  ctx.lineWidth = 3;
  ctx.strokeRect(panel.x, panel.y, PANEL.width, PANEL.height);
  rrect(ctx, panel.x + 10, panel.y + 10, 30, 26, 6, 'rgba(16,24,43,0.75)');
  text(ctx, side, panel.x + 25, panel.y + 24, 16, PALETTE.text, 'center', 800);
  // Markers on every found difference, on both panels alike.
  for (const d of state.differences) {
    if (!d.found) continue;
    const anim = state.marks.find((m) => m.x === d.x && m.y === d.y);
    const pop = anim ? 1 + 0.35 * (anim.t / MARK_SECONDS) : 1;
    const cx = panel.x + d.x;
    const cy = panel.y + d.y;
    ring(ctx, cx, cy, d.r * pop, PALETTE.good, 4);
    ring(ctx, cx, cy, d.r * pop + 6, 'rgba(126,224,129,0.35)', 2);
    line(ctx, cx - 9, cy, cx - 2, cy + 7, PALETTE.good, 4);
    line(ctx, cx - 2, cy + 7, cx + 11, cy - 8, PALETTE.good, 4);
  }
  // The hint pulse, on both panels alike.
  if (state.hint) {
    const pulse = 1 + 0.12 * Math.sin(now * 6);
    const alpha = 0.55 + 0.35 * Math.sin(now * 6);
    ctx.save();
    ctx.globalAlpha = Math.max(0.2, alpha);
    ring(ctx, panel.x + state.hint.x, panel.y + state.hint.y, state.hint.r * pulse, PALETTE.accent, 4);
    ctx.restore();
  }
}

/** The top bar: title, round, counter, clock, score, hints. */
function drawHud(ctx, state) {
  rrect(ctx, 0, 0, FIELD.width, 82, 0, PALETTE.hud);
  line(ctx, 0, 82, FIELD.width, 82, PALETTE.hudEdge, 2);
  text(ctx, 'NIGHT MARKET', 36, 30, 26, PALETTE.text, 'left', 800);
  text(ctx, 'Spot the Difference', 36, 58, 14, PALETTE.muted, 'left', 600);
  text(ctx, `Round ${state.roundIndex + 1} · ${state.round.name}`, 640, 30, 20, PALETTE.accentSoft, 'center', 700);
  text(ctx, state.round.sub, 640, 56, 13, PALETTE.muted, 'center', 600);
  text(ctx, `Found ${state.foundCount} of ${state.differences.length}`, 1000, 30, 20, PALETTE.text, 'center', 700);
  const urgent = state.timeLeft <= 10.5 && state.screen === SCREEN_PLAY;
  text(ctx, `Time ${clock(state.timeLeft)}`, 1000, 58, 16, urgent ? PALETTE.bad : PALETTE.muted, 'center', 700);
  text(ctx, `Score ${state.score}`, 1180, 30, 20, PALETTE.text, 'right', 700);
  text(ctx, `Best ${state.best}`, 1180, 58, 14, PALETTE.muted, 'right', 600);
  // The timer bar under the HUD.
  const frac = Math.max(0, state.timeLeft / state.timeTotal);
  rrect(ctx, 36, 88, 1208, 6, 3, PALETTE.hudEdge);
  const barColor = frac > 0.5 ? PALETTE.good : frac > 0.2 ? PALETTE.accent : PALETTE.bad;
  rrect(ctx, 36, 88, 1208 * frac, 6, 3, barColor);
}

/** The bottom bar: status line, buttons, round dots. */
function drawBottom(ctx, state) {
  const message = state.message || 'Click a difference to mark it — or press H for a hint.';
  text(ctx, message, 36, 566, 17, PALETTE.text, 'left', 600);
  for (const [name, b] of Object.entries(BUTTONS)) {
    const label = name === 'hint' ? `Hint (H) · ${state.hintsLeft} left` : name === 'sound' ? `Sound: ${isMuted() ? 'Off' : 'On'} (M)` : b.label;
    rrect(ctx, b.x, b.y, b.w, b.h, 8, PALETTE.button);
    ctx.strokeStyle = PALETTE.hudEdge;
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    text(ctx, label, b.x + b.w / 2, b.y + b.h / 2 + 1, 15, PALETTE.text, 'center', 700);
  }
  text(ctx, `Round ${state.roundIndex + 1} of 3`, 1244, 566, 15, PALETTE.muted, 'right', 600);
  for (let i = 0; i < 3; i += 1) {
    const cx = 1180 + i * 32;
    const done = i < state.roundIndex || (i === state.roundIndex && state.screen !== SCREEN_PLAY && state.screen !== SCREEN_TITLE);
    circle(ctx, cx, 662, 9, i === state.roundIndex ? PALETTE.accent : done ? PALETTE.good : PALETTE.hudEdge);
  }
}

/** A dark overlay panel for the end screens. */
function overlay(ctx, title, lines, action) {
  ctx.fillStyle = 'rgba(10,14,28,0.82)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  rrect(ctx, 360, 150, 560, 340, 16, PALETTE.hud);
  ctx.strokeStyle = PALETTE.hudEdge;
  ctx.lineWidth = 2;
  ctx.strokeRect(360, 150, 560, 340);
  text(ctx, title, 640, 200, 34, PALETTE.accentSoft, 'center', 800);
  lines.forEach((lineText, i) => {
    text(ctx, lineText, 640, 252 + i * 34, 18, PALETTE.text, 'center', 600);
  });
  rrect(ctx, ACTION_BUTTON.x, ACTION_BUTTON.y, ACTION_BUTTON.w, ACTION_BUTTON.h, 10, PALETTE.accent);
  text(ctx, action, 640, ACTION_BUTTON.y + 27, 19, '#10182b', 'center', 800);
}

/** Draw the whole frame. now is seconds since the page loaded. */
export function render(ctx, state, hover, now) {
  vgrad(ctx, 0, 0, FIELD.width, FIELD.height, '#131a30', '#10182b');
  // The divider between the panels.
  line(ctx, DIVIDER_X, 96, DIVIDER_X, 516, PALETTE.hudEdge, 2);
  text(ctx, 'VS', DIVIDER_X, 306, 18, PALETTE.muted, 'center', 800);
  drawPanel(ctx, state, 'A', now);
  drawPanel(ctx, state, 'B', now);
  // A faint aim ring where the pointer hovers over a panel.
  if (hover && state.screen === SCREEN_PLAY) {
    const overLeft = hover.x >= PANEL.left.x && hover.x <= PANEL.left.x + PANEL.width && hover.y >= PANEL.left.y && hover.y <= PANEL.left.y + PANEL.height;
    const overRight = hover.x >= PANEL.right.x && hover.x <= PANEL.right.x + PANEL.width && hover.y >= PANEL.right.y && hover.y <= PANEL.right.y + PANEL.height;
    if (overLeft || overRight) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ring(ctx, hover.x, hover.y, 18, '#ffffff', 2);
      ctx.restore();
    }
  }
  drawHud(ctx, state);
  drawBottom(ctx, state);

  if (state.screen === SCREEN_TITLE) {
    ctx.fillStyle = 'rgba(10,14,28,0.78)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    text(ctx, 'NIGHT MARKET', 640, 190, 54, PALETTE.text, 'center', 800);
    text(ctx, 'Spot the Difference', 640, 248, 28, PALETTE.accentSoft, 'center', 700);
    text(ctx, 'Two pictures, side by side — but they are not quite the same.', 640, 310, 19, PALETTE.text, 'center', 600);
    text(ctx, 'Click every difference you can find before the clock runs out.', 640, 340, 19, PALETTE.text, 'center', 600);
    text(ctx, 'Three rounds: Warung Kopi · Taman Senja · Pasar Malam', 640, 372, 19, PALETTE.muted, 'center', 600);
    text(ctx, 'H for a hint · R to restart · M to mute', 640, 404, 16, PALETTE.muted, 'center', 600);
    if (state.best > 0) text(ctx, `Best score: ${state.best}`, 640, 446, 18, PALETTE.accentSoft, 'center', 700);
    text(ctx, 'Click or press Enter to start', 640, 500, 22, PALETTE.good, 'center', 700);
  } else if (state.screen === SCREEN_ROUND_END) {
    const bonus = state.roundBonus || { time: 0, accuracy: 0 };
    const lines = [
      `Found ${state.differences.length} of ${state.differences.length} differences!`,
      `Time bonus: +${bonus.time}   Accuracy bonus: +${bonus.accuracy}`,
      `Round score: ${state.score}`,
    ];
    overlay(ctx, 'Round Complete!', lines, state.roundIndex + 1 >= 3 ? 'See Results' : 'Next Round →');
  } else if (state.screen === SCREEN_OVER) {
    const lines = [
      `You found ${state.foundCount} of ${state.differences.length} differences.`,
      `Score this round: ${state.score}   Total: ${state.totalScore}`,
      state.totalScore > 0 && state.totalScore >= state.best ? 'A new best score!' : `Best score: ${state.best}`,
    ];
    overlay(ctx, "Time's Up!", lines, 'Try Again');
  } else if (state.screen === SCREEN_WIN) {
    const lines = [
      'All three rounds complete — every difference found!',
      `Total score: ${state.totalScore}`,
      `Best score: ${state.best}`,
    ];
    overlay(ctx, 'You Found Them All!', lines, 'Play Again');
  }
}
