// Synthesised sounds, WebAudio only: no audio file is ever loaded, so the
// game stays a set of plain files with no network request. Every sound is
// guarded, so a browser without audio (or a muted tab) never breaks the game.

let context = null;
let muted = false;

/** True when the player has silenced the game. */
export function isMuted() {
  return muted;
}

/** Flip the mute state and return the new state. */
export function toggleMute() {
  muted = !muted;
  return muted;
}

/** The shared AudioContext, made on first use (after a user gesture). */
function audio() {
  if (context === null) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      context = new AC();
    } catch (error) {
      context = false;
    }
  }
  if (context && context.state === 'suspended') context.resume();
  return context || null;
}

/** One short oscillator note: frequency, start delay, length, shape, gain. */
function note(freq, delay, length, shape, gain) {
  const ac = audio();
  if (!ac || muted) return;
  try {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = shape;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0, ac.currentTime + delay);
    amp.gain.linearRampToValueAtTime(gain, ac.currentTime + delay + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + length);
    osc.connect(amp);
    amp.connect(ac.destination);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + length + 0.05);
  } catch (error) {
    /* A sound that cannot play is never a reason to stop the game. */
  }
}

/** Two bright notes: a difference was found. */
export function playFound() {
  note(660, 0, 0.16, 'sine', 0.16);
  note(990, 0.09, 0.28, 'sine', 0.16);
}

/** A low dull note: a click that found nothing. */
export function playMiss() {
  note(160, 0, 0.14, 'square', 0.06);
}

/** A soft shimmer: a hint is shown. */
export function playHint() {
  note(1180, 0, 0.12, 'sine', 0.08);
  note(1560, 0.08, 0.2, 'sine', 0.08);
}

/** A short rising fanfare: a round is complete. */
export function playRound() {
  note(523, 0, 0.14, 'triangle', 0.14);
  note(659, 0.12, 0.14, 'triangle', 0.14);
  note(784, 0.24, 0.3, 'triangle', 0.14);
}

/** A longer fanfare: all three rounds are complete. */
export function playWin() {
  note(523, 0, 0.15, 'triangle', 0.14);
  note(659, 0.13, 0.15, 'triangle', 0.14);
  note(784, 0.26, 0.15, 'triangle', 0.14);
  note(1047, 0.39, 0.45, 'triangle', 0.16);
}

/** A single tick when the clock runs under ten seconds. */
export function playTick() {
  note(880, 0, 0.05, 'square', 0.04);
}
