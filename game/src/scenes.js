// The three scenes of Night Market — Spot the Difference. Each scene is an
// original flat-illustration picture drawn in code, 560x420 per panel. The
// base draws everything both panels share; each difference draws the one
// element that is not the same on the two sides (a colour, a missing thing,
// an extra thing, a moved thing). Decorative bits are placed by a seeded
// generator and never land on a difference, so the same seed always draws
// the same picture and a difference is never hidden behind decoration.
//
// A difference is { id, x, y, r, label, a, b }: a(ctx, x, y) draws the
// element as the left panel shows it, b(ctx, x, y) as the right panel does.
// A draw that does nothing means the element is absent on that side.

import { PANEL, ROUND_SEEDS } from './config.js';
import { circle, ellipse, line, poly, rect, ring, star, text, triangle, vgrad } from './draw.js';
import { makeRandom, nearAny, range } from './random.js';

const W = PANEL.width;
const H = PANEL.height;

/** Build one difference record. */
function diff(id, x, y, r, label, a, b) {
  return { id, x, y, r, label, a, b };
}

/** The centres of a scene's differences, for keeping decoration clear. */
function centres(differences) {
  return differences.map((d) => ({ x: d.x, y: d.y }));
}

/* ------------------------------------------------------------------ */
/* Round 1 — Warung Kopi Pagi (Morning Coffee Stall)                  */
/* ------------------------------------------------------------------ */

function warungDifferences() {
  return [
    diff('awning-stripe', 150, 78, 30, 'One awning stripe changes colour', (ctx, x, y) => {
      rect(ctx, x - 14, y - 22, 28, 44, '#d94f3d');
    }, (ctx, x, y) => {
      rect(ctx, x - 14, y - 22, 28, 44, '#2a9d8f');
    }),
    diff('coffee-cup', 300, 210, 26, 'A coffee cup is missing', (ctx, x, y) => {
      rect(ctx, x - 11, y - 8, 22, 16, '#f4ead8');
      rect(ctx, x - 13, y - 12, 26, 5, '#e8d9b8');
      line(ctx, x + 11, y - 4, x + 17, y - 4, '#f4ead8', 3);
      line(ctx, x - 4, y - 18, x - 4, y - 24, '#cbb98f', 2);
      line(ctx, x + 3, y - 18, x + 3, y - 25, '#cbb98f', 2);
    }, () => {}),
    diff('roof-cat', 300, 48, 28, 'A second cat appears on the roof', () => {}, (ctx, x, y) => {
      ellipse(ctx, x, y + 8, 20, 10, '#3a3a3a');
      circle(ctx, x + 14, y - 2, 8, '#3a3a3a');
      triangle(ctx, x + 8, y - 8, 5, 8, '#3a3a3a');
      triangle(ctx, x + 15, y - 8, 5, 8, '#3a3a3a');
      line(ctx, x - 18, y + 6, x - 26, y - 6, '#3a3a3a', 4);
    }),
    diff('sign-icon', 280, 112, 26, 'The sign icon changes from cup to teapot', (ctx, x, y) => {
      rect(ctx, x - 10, y - 4, 20, 13, '#7a4a21');
      line(ctx, x + 10, y, x + 15, y, '#7a4a21', 3);
      line(ctx, x - 3, y - 9, x - 3, y - 14, '#7a4a21', 2);
    }, (ctx, x, y) => {
      ellipse(ctx, x, y + 2, 12, 8, '#7a4a21');
      triangle(ctx, x + 10, y - 2, 8, 4, '#7a4a21');
      line(ctx, x - 10, y, x - 15, y + 2, '#7a4a21', 3);
      line(ctx, x, y - 6, x, y - 12, '#7a4a21', 2);
    }),
    diff('pot-flower', 480, 300, 26, 'The potted flower changes colour', (ctx, x, y) => {
      circle(ctx, x, y - 8, 9, '#e5534b');
      circle(ctx, x - 7, y - 2, 6, '#e5534b');
      circle(ctx, x + 7, y - 2, 6, '#e5534b');
      circle(ctx, x, y - 3, 5, '#f2c94c');
    }, (ctx, x, y) => {
      circle(ctx, x, y - 8, 9, '#f2c94c');
      circle(ctx, x - 7, y - 2, 6, '#f2c94c');
      circle(ctx, x + 7, y - 2, 6, '#f2c94c');
      circle(ctx, x, y - 3, 5, '#e5534b');
    }),
  ];
}

function drawWarungBase(ctx, rng) {
  const diffs = warungDifferences();
  const keep = centres(diffs);
  vgrad(ctx, 0, 0, W, 265, '#ffe9c0', '#ffd28a');
  // Sun with rays, top right.
  circle(ctx, 470, 55, 34, '#ffb830');
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    line(ctx, 470 + Math.cos(a) * 42, 55 + Math.sin(a) * 42, 470 + Math.cos(a) * 54, 55 + Math.sin(a) * 54, '#ffb830', 4);
  }
  // Clouds drift where no difference lives.
  for (let i = 0; i < 3; i += 1) {
    const cx = range(rng, 40, 400);
    const cy = range(rng, 30, 90);
    if (nearAny(cx, cy, keep, 70)) continue;
    ellipse(ctx, cx, cy, 34, 14, '#fff6e0');
    ellipse(ctx, cx + 22, cy + 5, 24, 11, '#fff6e0');
  }
  // Distant houses on the horizon.
  rect(ctx, 30, 225, 70, 40, '#c98a5a');
  triangle(ctx, 30, 225, 70, 26, '#a85a3a');
  rect(ctx, 430, 230, 80, 35, '#c98a5a');
  triangle(ctx, 430, 230, 80, 24, '#a85a3a');
  // Ground and a dirt path.
  rect(ctx, 0, 265, W, H - 265, '#d9a05b');
  poly(ctx, [[180, 420], [260, 265], [300, 265], [380, 420]], '#c98f4e');
  // The stall: posts, roof, counter, stools.
  rect(ctx, 66, 100, 10, 130, '#6b4226');
  rect(ctx, 314, 100, 10, 130, '#6b4226');
  triangle(ctx, 50, 62, 290, 34, '#a85a3a');
  rect(ctx, 70, 210, 250, 90, '#8a5a2b');
  rect(ctx, 70, 210, 250, 10, '#a06a35');
  rect(ctx, 70, 300, 250, 8, '#6b4226');
  // Cream canopy band; the one coloured stripe is a difference.
  rect(ctx, 60, 56, 270, 44, '#fff3d6');
  line(ctx, 60, 100, 330, 100, '#e8d9b8', 3);
  // Hanging sign board; its icon is a difference.
  line(ctx, 280, 100, 280, 108, '#6b4226', 3);
  rect(ctx, 235, 108, 90, 44, '#fdf6e3');
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 3;
  ctx.strokeRect(235, 108, 90, 44);
  text(ctx, 'KOPI', 280, 138, 18, '#7a4a21', 'center', 800);
  // Coffee pot on the counter.
  ellipse(ctx, 350, 205, 18, 10, '#4a4a4a');
  rect(ctx, 338, 185, 24, 20, '#4a4a4a');
  triangle(ctx, 362, 188, 12, 8, '#4a4a4a');
  // Stools in front of the counter.
  circle(ctx, 140, 330, 22, '#a85a3a');
  rect(ctx, 134, 330, 12, 40, '#6b4226');
  circle(ctx, 240, 330, 22, '#a85a3a');
  rect(ctx, 234, 330, 12, 40, '#6b4226');
  // A cat asleep on the counter's right end.
  ellipse(ctx, 430, 225, 26, 12, '#3a3a3a');
  circle(ctx, 452, 216, 10, '#3a3a3a');
  triangle(ctx, 446, 208, 6, 9, '#3a3a3a');
  triangle(ctx, 455, 208, 6, 9, '#3a3a3a');
  // Potted plant: pot and leaves; the flower is a difference.
  poly(ctx, [[462, 330], [498, 330], [492, 360], [468, 360]], '#c96a3b');
  line(ctx, 480, 330, 480, 306, '#4a7a3a', 4);
  ellipse(ctx, 468, 312, 10, 6, '#4a7a3a');
  ellipse(ctx, 492, 312, 10, 6, '#4a7a3a');
  // Bicycle leaning at the left.
  circle(ctx, 90, 350, 22, '#3a3a3a');
  circle(ctx, 150, 350, 22, '#3a3a3a');
  line(ctx, 90, 350, 120, 310, '#7a4a21', 4);
  line(ctx, 150, 350, 120, 310, '#7a4a21', 4);
  line(ctx, 120, 310, 150, 310, '#7a4a21', 4);
  // Birds and flowers, kept clear of the differences.
  for (let i = 0; i < 4; i += 1) {
    const bx = range(rng, 30, 520);
    const by = range(rng, 120, 200);
    if (nearAny(bx, by, keep, 46)) continue;
    line(ctx, bx - 8, by, bx, by - 5, '#5a4632', 2);
    line(ctx, bx, by - 5, bx + 8, by, '#5a4632', 2);
  }
  for (let i = 0; i < 6; i += 1) {
    const fx = range(rng, 30, 530);
    const fy = range(rng, 380, 410);
    if (nearAny(fx, fy, keep, 40)) continue;
    circle(ctx, fx, fy, 5, '#e5534b');
    circle(ctx, fx, fy - 2, 3, '#f2c94c');
  }
}

/* ------------------------------------------------------------------ */
/* Round 2 — Taman Senja (Dusk Garden)                                */
/* ------------------------------------------------------------------ */

function tamanDifferences() {
  return [
    diff('moon', 480, 60, 28, 'The moon is missing', (ctx, x, y) => {
      circle(ctx, x, y, 20, '#fdf6d8');
      circle(ctx, x + 8, y - 4, 16, '#e8d9a8');
    }, () => {}),
    diff('lantern', 120, 150, 26, 'A lantern is dark', (ctx, x, y) => {
      circle(ctx, x, y, 26, '#ffd97a');
      circle(ctx, x, y, 18, '#ffb830');
      circle(ctx, x, y, 10, '#fff3c0');
    }, (ctx, x, y) => {
      circle(ctx, x, y, 18, '#5a5a6e');
      circle(ctx, x, y, 10, '#3a3a4a');
    }),
    diff('lily-flower', 300, 330, 26, 'The lily flower changes colour', (ctx, x, y) => {
      circle(ctx, x, y - 7, 8, '#ff8fb3');
      circle(ctx, x - 7, y, 6, '#ff8fb3');
      circle(ctx, x + 7, y, 6, '#ff8fb3');
      circle(ctx, x, y, 5, '#ffd97a');
    }, (ctx, x, y) => {
      circle(ctx, x, y - 7, 8, '#f4ead8');
      circle(ctx, x - 7, y, 6, '#f4ead8');
      circle(ctx, x + 7, y, 6, '#f4ead8');
      circle(ctx, x, y, 5, '#ffd97a');
    }),
    diff('bench-slat', 240, 250, 30, 'A bench slat is missing', (ctx, x, y) => {
      rect(ctx, x - 42, y - 5, 84, 10, '#8a5a2b');
    }, () => {}),
    diff('perched-bird', 430, 120, 26, 'A bird appears on the branch', () => {}, (ctx, x, y) => {
      ellipse(ctx, x, y + 4, 12, 8, '#2c2c3a');
      circle(ctx, x + 9, y - 4, 6, '#2c2c3a');
      triangle(ctx, x + 14, y - 4, 6, 3, '#e8a33d');
      line(ctx, x - 10, y + 2, x - 16, y - 6, '#2c2c3a', 3);
    }),
    diff('firefly', 60, 160, 30, 'A firefly is missing', (ctx, x, y) => {
      circle(ctx, x, y, 12, '#d8ff9e');
      circle(ctx, x, y, 5, '#a8e05a');
    }, () => {}),
    diff('apple', 395, 165, 28, 'An apple is missing from the tree', (ctx, x, y) => {
      circle(ctx, x, y, 9, '#e5534b');
      line(ctx, x, y - 9, x + 3, y - 14, '#4a7a3a', 2);
    }, () => {}),
  ];
}

function drawTamanBase(ctx, rng) {
  const diffs = tamanDifferences();
  const keep = centres(diffs);
  vgrad(ctx, 0, 0, W, 250, '#7b5ea7', '#ff9e6b');
  // Low sun, half down behind the trees.
  circle(ctx, 90, 205, 30, '#ffb830');
  circle(ctx, 90, 205, 20, '#ffd97a');
  // Stars come out early; the moon is a difference.
  for (let i = 0; i < 9; i += 1) {
    const sx = range(rng, 20, 540);
    const sy = range(rng, 15, 90);
    if (nearAny(sx, sy, keep, 40)) continue;
    star(ctx, sx, sy, 4, '#fdf6d8');
  }
  // Ground and the pond.
  rect(ctx, 0, 250, W, H - 250, '#4a5a3a');
  ellipse(ctx, 280, 335, 150, 42, '#4a7fa5');
  ellipse(ctx, 280, 335, 132, 34, '#5a8fb5');
  ellipse(ctx, 230, 330, 26, 8, '#3d7a4a');
  ellipse(ctx, 330, 340, 30, 9, '#3d7a4a');
  // Path stones from the pond to the bench.
  for (let i = 0; i < 4; i += 1) ellipse(ctx, 200 + i * 26, 385 - i * 4, 14, 7, '#cbb98f');
  // Big tree on the left.
  rect(ctx, 104, 150, 22, 110, '#5a3a22');
  circle(ctx, 115, 120, 52, '#3d7a3a');
  circle(ctx, 80, 145, 34, '#4a8a44');
  circle(ctx, 150, 145, 34, '#4a8a44');
  // Tree on the right, with two apples in the base; the third is a difference.
  rect(ctx, 420, 140, 20, 120, '#5a3a22');
  circle(ctx, 430, 110, 48, '#3d7a3a');
  circle(ctx, 398, 135, 30, '#4a8a44');
  circle(ctx, 462, 135, 30, '#4a8a44');
  circle(ctx, 405, 120, 9, '#e5534b');
  circle(ctx, 455, 105, 9, '#e5534b');
  line(ctx, 405, 111, 408, 106, '#4a7a3a', 2);
  line(ctx, 455, 96, 458, 91, '#4a7a3a', 2);
  // Branch the perched bird lands on (the bird itself is a difference).
  line(ctx, 400, 130, 460, 118, '#5a3a22', 5);
  // Bench: legs and seat in the base; the middle slat is a difference.
  rect(ctx, 190, 282, 10, 26, '#6b4226');
  rect(ctx, 280, 282, 10, 26, '#6b4226');
  rect(ctx, 180, 272, 120, 12, '#8a5a2b');
  rect(ctx, 186, 232, 8, 42, '#6b4226');
  rect(ctx, 286, 232, 8, 42, '#6b4226');
  rect(ctx, 186, 232, 108, 8, '#8a5a2b');
  // Lantern posts: the left lantern's light is a difference; the right one
  // is always lit so the garden never goes dark.
  rect(ctx, 116, 160, 6, 100, '#3a3a4a');
  rect(ctx, 446, 160, 6, 100, '#3a3a4a');
  circle(ctx, 449, 150, 26, '#ffd97a');
  circle(ctx, 449, 150, 18, '#ffb830');
  circle(ctx, 449, 150, 10, '#fff3c0');
  // Fence along the back.
  for (let x = 20; x < W; x += 46) {
    rect(ctx, x, 236, 6, 26, '#6b4a2a');
  }
  rect(ctx, 0, 240, W, 5, '#6b4a2a');
  rect(ctx, 0, 252, W, 5, '#6b4a2a');
  // Flowers and fireflies, kept clear of the differences.
  for (let i = 0; i < 7; i += 1) {
    const fx = range(rng, 30, 530);
    const fy = range(rng, 370, 408);
    if (nearAny(fx, fy, keep, 40)) continue;
    circle(ctx, fx, fy, 5, '#ff8fb3');
    circle(ctx, fx, fy - 2, 3, '#ffd97a');
  }
  for (let i = 0; i < 5; i += 1) {
    const fx = range(rng, 40, 520);
    const fy = range(rng, 160, 230);
    if (nearAny(fx, fy, keep, 46)) continue;
    circle(ctx, fx, fy, 9, '#d8ff9e');
    circle(ctx, fx, fy, 4, '#a8e05a');
  }
}

/* ------------------------------------------------------------------ */
/* Round 3 — Pasar Malam (Night Market)                               */
/* ------------------------------------------------------------------ */

function pasarDifferences() {
  return [
    diff('wheel-cabin', 110, 70, 28, 'A Ferris wheel cabin is missing', (ctx, x, y) => {
      rect(ctx, x - 12, y - 8, 24, 16, '#ffb830');
      rect(ctx, x - 12, y - 8, 24, 5, '#d94f3d');
      line(ctx, x, y - 8, x, y - 16, '#cbb98f', 2);
    }, () => {}),
    diff('balloon-colour', 450, 110, 26, 'A balloon changes colour', (ctx, x, y) => {
      ellipse(ctx, x, y, 13, 16, '#e5534b');
      triangle(ctx, x - 4, y + 15, 8, 5, '#e5534b');
      line(ctx, x, y + 20, x, y + 34, '#cbb98f', 2);
    }, (ctx, x, y) => {
      ellipse(ctx, x, y, 13, 16, '#7ee081');
      triangle(ctx, x - 4, y + 15, 8, 5, '#7ee081');
      line(ctx, x, y + 20, x, y + 34, '#cbb98f', 2);
    }),
    diff('bunting-flag', 280, 60, 24, 'A bunting flag is missing', (ctx, x, y) => {
      triangle(ctx, x - 9, y - 8, 18, 16, '#ff8fb3');
    }, () => {}),
    diff('skewer', 150, 200, 28, 'A satay skewer is missing', (ctx, x, y) => {
      line(ctx, x, y - 12, x, y + 12, '#e8d9b8', 3);
      circle(ctx, x, y - 6, 5, '#c98a3a');
      circle(ctx, x, y + 2, 5, '#c98a3a');
      circle(ctx, x, y + 10, 5, '#c98a3a');
    }, () => {}),
    diff('extra-lantern', 500, 200, 26, 'An extra lantern appears', () => {}, (ctx, x, y) => {
      ellipse(ctx, x, y, 14, 18, '#d94f3d');
      rect(ctx, x - 6, y - 20, 12, 4, '#f2c94c');
      rect(ctx, x - 6, y + 16, 12, 4, '#f2c94c');
      line(ctx, x, y - 28, x, y - 20, '#cbb98f', 2);
    }),
    diff('sky-star', 350, 45, 22, 'A star is missing from the sky', (ctx, x, y) => {
      star(ctx, x, y, 8, '#fdf6d8');
    }, () => {}),
    diff('toy-duck', 290, 290, 26, 'A toy duck is missing', (ctx, x, y) => {
      ellipse(ctx, x, y + 4, 14, 9, '#f2c94c');
      circle(ctx, x + 10, y - 4, 7, '#f2c94c');
      triangle(ctx, x + 16, y - 4, 7, 4, '#e8a33d');
      circle(ctx, x + 12, y - 6, 2, '#2c2c3a');
    }, () => {}),
    diff('moon-crater', 480, 55, 26, 'The moon loses its crater', (ctx, x, y) => {
      circle(ctx, x - 8, y - 7, 6, '#cbb98f');
      circle(ctx, x + 6, y + 5, 4, '#cbb98f');
    }, () => {}),
    diff('dark-bulb', 380, 58, 22, 'A string-light bulb is dark', (ctx, x, y) => {
      circle(ctx, x, y, 10, '#ffd97a');
      circle(ctx, x, y, 5, '#fff3c0');
    }, (ctx, x, y) => {
      circle(ctx, x, y, 10, '#3a3a4a');
      circle(ctx, x, y, 5, '#2c2c3a');
    }),
    diff('cat-tail', 320, 360, 28, 'The market cat lowers its tail', (ctx, x, y) => {
      line(ctx, x - 16, y + 2, x - 26, y - 14, '#2c2c3a', 5);
      line(ctx, x - 26, y - 14, x - 22, y - 22, '#2c2c3a', 5);
    }, (ctx, x, y) => {
      line(ctx, x - 16, y + 4, x - 28, y + 8, '#2c2c3a', 5);
    }),
  ];
}

function drawPasarBase(ctx, rng) {
  const diffs = pasarDifferences();
  const keep = centres(diffs);
  vgrad(ctx, 0, 0, W, 260, '#141a33', '#232c52');
  // Stars; the one at (350, 45) is a difference.
  for (let i = 0; i < 12; i += 1) {
    const sx = range(rng, 20, 540);
    const sy = range(rng, 12, 100);
    if (nearAny(sx, sy, keep, 34)) continue;
    star(ctx, sx, sy, 4, '#fdf6d8');
  }
  // The moon disc; its crater is a difference.
  circle(ctx, 480, 55, 24, '#fdf6d8');
  circle(ctx, 480, 55, 19, '#f4ead8');
  // Ferris wheel silhouette on the left.
  ring(ctx, 110, 140, 70, '#3a4a6e', 5);
  line(ctx, 110, 140, 110, 70, '#3a4a6e', 4);
  line(ctx, 110, 140, 170, 175, '#3a4a6e', 4);
  line(ctx, 110, 140, 50, 175, '#3a4a6e', 4);
  line(ctx, 110, 140, 180, 140, '#3a4a6e', 4);
  line(ctx, 110, 140, 40, 140, '#3a4a6e', 4);
  rect(ctx, 50, 168, 20, 14, '#ffb830');
  rect(ctx, 160, 168, 20, 14, '#ffb830');
  rect(ctx, 102, 206, 16, 10, '#3a4a6e');
  line(ctx, 110, 210, 110, 250, '#3a4a6e', 6);
  // String lights across the top; one bulb is a difference.
  line(ctx, 40, 40, 520, 40, '#3a3a4a', 2);
  for (let x = 60; x <= 500; x += 40) {
    if (Math.abs(x - 380) < 20) continue;
    line(ctx, x, 40, x, 52, '#3a3a4a', 2);
    circle(ctx, x, 58, 7, '#ffd97a');
  }
  // Bunting flags below the lights; one flag is a difference.
  line(ctx, 40, 52, 520, 52, '#3a3a4a', 2);
  const flagColours = ['#ff8fb3', '#7ee081', '#4fc3f7', '#f2c94c'];
  for (let i = 0; i < 12; i += 1) {
    const fx = 60 + i * 40;
    if (Math.abs(fx - 280) < 20) continue;
    triangle(ctx, fx - 9, 52, 18, 16, flagColours[i % 4]);
  }
  // Ground: a dark street with pools of light.
  rect(ctx, 0, 260, W, H - 260, '#1c2138');
  ellipse(ctx, 130, 330, 90, 16, '#2c3355');
  ellipse(ctx, 290, 330, 90, 16, '#2c3355');
  ellipse(ctx, 450, 330, 90, 16, '#2c3355');
  // Satay stall (left): counter, canopy, sign board; skewers are a difference.
  rect(ctx, 60, 210, 160, 80, '#7a4a21');
  rect(ctx, 60, 210, 160, 10, '#a06a35');
  rect(ctx, 70, 180, 140, 26, '#fdf6e3');
  text(ctx, 'SATE', 140, 193, 16, '#7a4a21', 'center', 800);
  triangle(ctx, 50, 180, 180, 30, '#d94f3d');
  line(ctx, 60, 180, 60, 210, '#6b4226', 4);
  line(ctx, 210, 180, 210, 210, '#6b4226', 4);
  // Two skewers in the base; the third is a difference.
  line(ctx, 130, 188, 130, 212, '#e8d9b8', 3);
  circle(ctx, 130, 194, 5, '#c98a3a');
  circle(ctx, 130, 202, 5, '#c98a3a');
  line(ctx, 170, 188, 170, 212, '#e8d9b8', 3);
  circle(ctx, 170, 194, 5, '#c98a3a');
  circle(ctx, 170, 202, 5, '#c98a3a');
  // Toy stall (middle): counter, canopy, toys; the duck is a difference.
  rect(ctx, 230, 210, 160, 80, '#4a5a7a');
  rect(ctx, 230, 210, 160, 10, '#6b7a9a');
  rect(ctx, 240, 180, 140, 26, '#fdf6e3');
  text(ctx, 'MAINAN', 310, 193, 15, '#4a5a7a', 'center', 800);
  triangle(ctx, 220, 180, 180, 30, '#2a9d8f');
  line(ctx, 230, 180, 230, 210, '#3a3a4a', 4);
  line(ctx, 380, 180, 380, 210, '#3a3a4a', 4);
  circle(ctx, 250, 225, 10, '#e5534b');
  rect(ctx, 270, 218, 16, 16, '#4fc3f7');
  triangle(ctx, 300, 232, 20, 14, '#f2c94c');
  circle(ctx, 350, 224, 9, '#ff8fb3');
  // Balloon stall (right): counter, canopy, strings; the coloured balloon is a difference.
  rect(ctx, 410, 210, 130, 80, '#7a3a5a');
  rect(ctx, 410, 210, 130, 10, '#9a5a7a');
  rect(ctx, 420, 180, 110, 26, '#fdf6e3');
  text(ctx, 'BALON', 475, 193, 15, '#7a3a5a', 'center', 800);
  triangle(ctx, 400, 180, 150, 30, '#7b5ea7');
  line(ctx, 410, 180, 410, 210, '#3a3a4a', 4);
  line(ctx, 530, 180, 530, 210, '#3a3a4a', 4);
  ellipse(ctx, 425, 110, 12, 15, '#4fc3f7');
  line(ctx, 425, 125, 425, 160, '#cbb98f', 2);
  ellipse(ctx, 475, 100, 12, 15, '#f2c94c');
  line(ctx, 475, 115, 475, 160, '#cbb98f', 2);
  ellipse(ctx, 500, 125, 11, 14, '#ff8fb3');
  line(ctx, 500, 139, 500, 160, '#cbb98f', 2);
  // Paper lanterns between the stalls (the extra one is a difference).
  line(ctx, 215, 150, 215, 170, '#cbb98f', 2);
  ellipse(ctx, 215, 186, 13, 17, '#d94f3d');
  line(ctx, 395, 150, 395, 170, '#cbb98f', 2);
  ellipse(ctx, 395, 186, 13, 17, '#f2c94c');
  // The market cat: body and head in the base; its tail is a difference.
  ellipse(ctx, 320, 366, 22, 12, '#2c2c3a');
  circle(ctx, 338, 354, 10, '#2c2c3a');
  triangle(ctx, 332, 346, 6, 9, '#2c2c3a');
  triangle(ctx, 341, 346, 6, 9, '#2c2c3a');
  // Distant lit windows.
  for (let i = 0; i < 5; i += 1) {
    const wx = range(rng, 30, 520);
    const wy = range(rng, 130, 200);
    if (nearAny(wx, wy, keep, 40)) continue;
    rect(ctx, wx, wy, 10, 12, '#ffd97a');
  }
}

/* ------------------------------------------------------------------ */
/* The scene table                                                     */
/* ------------------------------------------------------------------ */

export const SCENES = {
  warung: { id: 'warung', drawBase: drawWarungBase, differences: warungDifferences },
  taman: { id: 'taman', drawBase: drawTamanBase, differences: tamanDifferences },
  pasar: { id: 'pasar', drawBase: drawPasarBase, differences: pasarDifferences },
};

/** Build a scene's difference list (fresh objects, safe to mutate). */
export function buildDifferences(sceneId) {
  return SCENES[sceneId].differences();
}

/** A seeded generator for one round's decoration. */
export function sceneRandom(roundIndex) {
  return makeRandom(ROUND_SEEDS[roundIndex]);
}
