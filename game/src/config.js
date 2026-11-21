// Night Market — Spot the Difference: every tuning number in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to
// the window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** Two picture panels, side by side, in logical coordinates. */
export const PANEL = {
  width: 560,
  height: 420,
  left: { x: 36, y: 96 },
  right: { x: 684, y: 96 },
};

/** The gap between the panels holds the divider and the A / B tags. */
export const DIVIDER_X = 620;

/** One round: one scene, a set of differences, a time limit, a hint budget. */
export const ROUNDS = [
  { scene: 'warung', name: 'Warung Kopi Pagi', sub: 'Morning Coffee Stall', differences: 5, seconds: 120, hints: 3 },
  { scene: 'taman', name: 'Taman Senja', sub: 'Dusk Garden', differences: 7, seconds: 150, hints: 3 },
  { scene: 'pasar', name: 'Pasar Malam', sub: 'Night Market', differences: 10, seconds: 180, hints: 3 },
];

/** Points for one found difference, and the price of a hint. */
export const SCORE = {
  perFind: 100,
  hintCost: 30,
  noMissBonus: 50,
  timeBonusPerSecond: 2,
};

/** A wrong click costs this many seconds of the round clock. */
export const MISS_PENALTY_SECONDS = 2;

/** How long a hint pulse stays visible, in seconds. */
export const HINT_SECONDS = 2.5;

/** How long the found-marker ring animation plays, in seconds. */
export const MARK_SECONDS = 0.9;

/** Fixed decorative seeds, one per round: the same scene every visit. */
export const ROUND_SEEDS = [101, 202, 303];

export const PALETTE = {
  backdrop: '#10182b',
  hud: '#1b2440',
  hudEdge: '#2c3a5e',
  text: '#f4ead8',
  muted: '#9aa7c4',
  accent: '#ffc53d',
  accentSoft: '#ffd97a',
  good: '#7ee081',
  bad: '#ff6b6b',
  panelEdge: '#3a4a6e',
  button: '#2c3a5e',
  buttonHover: '#3a4a6e',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'night-market-spot.best';
