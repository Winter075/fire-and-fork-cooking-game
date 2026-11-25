// Small synthesized kitchen sounds. No audio files, no network: just the WebAudio API.
let context = null;
let muted = false;

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ac() {
  if (!context) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) context = new AC();
  }
  if (context && context.state === 'suspended') context.resume();
  return context;
}

function tone(freq, ms, type = 'sine', volume = 0.08, slide = 0) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq + slide, c.currentTime + ms / 1000);
  g.gain.setValueAtTime(volume, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + ms / 1000);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + ms / 1000 + 0.02);
}

export const sound = {
  pick: () => tone(420, 70, 'triangle', 0.05, 120),
  chop: () => tone(190, 55, 'square', 0.05, -70),
  sizzle: () => tone(1200, 180, 'sawtooth', 0.025, -500),
  plate: () => tone(640, 90, 'sine', 0.06, 160),
  serve: () => { tone(520, 110, 'sine', 0.08, 200); setTimeout(() => tone(780, 160, 'sine', 0.07, 180), 90); },
  miss: () => tone(240, 260, 'sawtooth', 0.06, -140),
};
