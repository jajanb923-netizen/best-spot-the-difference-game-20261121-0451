// A tiny seeded random generator (mulberry32): the same seed always gives the
// same scene, so a screenshot staged today matches the game a player sees.

/** Make a random function from an integer seed. */
export function makeRandom(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A number between min (inclusive) and max (exclusive). */
export function range(random, min, max) {
  return min + random() * (max - min);
}

/** An integer between min and max, both inclusive. */
export function int(random, min, max) {
  return Math.floor(range(random, min, max + 1));
}

/** One item from a list, chosen by the generator. */
export function pick(random, list) {
  return list[Math.floor(random() * list.length)];
}

/** True when (x, y) is closer than margin to any point in list. */
export function nearAny(x, y, list, margin) {
  for (let i = 0; i < list.length; i += 1) {
    const dx = x - list[i].x;
    const dy = y - list[i].y;
    if (dx * dx + dy * dy < margin * margin) return true;
  }
  return false;
}
