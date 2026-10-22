/*
 * Game sound effects, synthesised with Web Audio (no audio files to load).
 * Muted state is remembered per browser.
 */

const MUTE_KEY = 'connect_arena_muted';
let ctx = null;
let muted = (() => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
})();

export const isMuted = () => muted;
export const setMuted = (value) => {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    // Storage unavailable: setting lasts for this visit
  }
};

const audio = () => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

// One short tone with an envelope
const tone = (freq, { at = 0, dur = 0.15, type = 'sine', gain = 0.12, slideTo } = {}) => {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + at;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
};

const SOUNDS = {
  join: () => {
    tone(660, { dur: 0.09, type: 'triangle' });
    tone(990, { at: 0.07, dur: 0.12, type: 'triangle' });
  },
  tick: () => tone(1200, { dur: 0.05, type: 'square', gain: 0.04 }),
  go: () => {
    tone(523, { dur: 0.1, type: 'triangle' });
    tone(784, { at: 0.1, dur: 0.18, type: 'triangle' });
  },
  lock: () => tone(440, { dur: 0.08, type: 'triangle', gain: 0.08 }),
  correct: () => {
    tone(659, { dur: 0.1, type: 'triangle' });
    tone(880, { at: 0.09, dur: 0.1, type: 'triangle' });
    tone(1319, { at: 0.18, dur: 0.22, type: 'triangle' });
  },
  wrong: () => tone(220, { dur: 0.32, type: 'sawtooth', gain: 0.06, slideTo: 140 }),
  powerup: () => tone(400, { dur: 0.28, type: 'sine', gain: 0.1, slideTo: 1600 }),
  reveal: () => tone(330, { dur: 0.25, type: 'triangle', gain: 0.08, slideTo: 660 }),
  fanfare: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, { at: i * 0.12, dur: 0.22, type: 'triangle' }));
    tone(1047, { at: 0.5, dur: 0.6, type: 'triangle', gain: 0.1 });
  },
};

export const play = (name) => {
  if (muted) return;
  try {
    SOUNDS[name]?.();
  } catch {
    // Audio can fail before user interaction; the game works without it
  }
};
