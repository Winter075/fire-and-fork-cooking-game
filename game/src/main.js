// Boot the kitchen, wire keyboard and mouse, and draw every frame.
import { drawKitchen, BINS, CHOP, STOVE, DISH, HATCH } from './kitchen.js';
import { drawHud } from './hud.js';
import { initialState, start, pick, chop, toPan, toPlate, serve, nudgeChef, update } from './game.js';
import { toggleMute } from './audio.js';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const state = initialState();

const keys = {
  '1': 'tomato', '2': 'mushroom', '3': 'shrimp', '4': 'rice', '5': 'greens',
};

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  const t = performance.now() / 1000;
  if (keys[k]) pick(state, keys[k]);
  else if (k === 'c') chop(state, t);
  else if (k === 's') toPan(state, t);
  else if (k === 'p') toPlate(state, t);
  else if (k === 'm') {
    const off = toggleMute();
    state.flash = { text: off ? 'MUTED' : 'SOUND ON', good: true, at: t };
  } else if (k === 'enter') {
    if (state.phase === 'title' || state.phase === 'over') start(state);
    else serve(state, t);
  } else if (k === 'w' || k === 'arrowup') nudgeChef(state, 0, -1);
  else if (k === 'a' || k === 'arrowleft') nudgeChef(state, -1, 0);
  else if (k === 'd' || k === 'arrowright') nudgeChef(state, 1, 0);
  else if (k === 'x' || k === 'arrowdown') nudgeChef(state, 0, 1);
  if (['enter', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
});

function inside(p, b) {
  return p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
}

canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  const p = {
    x: (e.clientX - r.left) * canvas.width / r.width,
    y: (e.clientY - r.top) * canvas.height / r.height,
  };
  const t = performance.now() / 1000;
  if (state.phase !== 'play') { start(state); return; }
  if (inside(p, HATCH)) { serve(state, t); return; }
  if (inside(p, DISH)) { toPlate(state, t); return; }
  if (inside(p, STOVE)) { toPan(state, t); return; }
  if (inside(p, CHOP)) { chop(state, t); return; }
  const bin = BINS.find((b) => inside(p, b));
  if (bin) pick(state, bin.kind);
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  update(state, dt, t);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawKitchen(ctx, state, t);
  drawHud(ctx, state, t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
