// Mouse and keyboard input, translated into the game's 1280x720 logical
// coordinates. The canvas is scaled to the window; the translation keeps
// every click honest whatever the screen size.

import { FIELD } from './config.js';

/**
 * Attach the handlers. callbacks: onClick(x, y), onMove(x, y), onKey(key),
 * onLeave(). Coordinates are logical (0..1280, 0..720).
 */
export function attachInput(canvas, callbacks) {
  /** Convert a pointer event to logical coordinates. */
  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = FIELD.width / rect.width;
    const scaleY = FIELD.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    const p = toLogical(event);
    callbacks.onClick(p.x, p.y);
  });
  canvas.addEventListener('pointermove', (event) => {
    const p = toLogical(event);
    callbacks.onMove(p.x, p.y);
  });
  canvas.addEventListener('pointerleave', () => callbacks.onLeave());
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    callbacks.onKey(event.key.toLowerCase());
  });
}
