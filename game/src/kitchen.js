// The kitchen itself: tiles, counter, stations, chef and the food in progress.
import { C, FONT, rr, label, food, plate, steam } from './palette.js';
import { INGREDIENTS } from './orders.js';

export const BINS = INGREDIENTS.map((kind, i) => ({ kind, x: 40 + i * 82, y: 474, w: 76, h: 128 }));
export const CHOP = { x: 444, y: 466, w: 140, h: 136 };
export const STOVE = { x: 600, y: 466, w: 142, h: 136 };
export const DISH = { x: 758, y: 466, w: 140, h: 136 };
export const HATCH = { x: 758, y: 262, w: 140, h: 156 };
export const ROOM = { x: 20, y: 104, w: 894, h: 596 };

function tiles(ctx, t) {
  ctx.fillStyle = C.wall; ctx.fillRect(ROOM.x, ROOM.y, ROOM.w, ROOM.h);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
  for (let x = ROOM.x; x < ROOM.x + ROOM.w; x += 56) { ctx.beginPath(); ctx.moveTo(x, ROOM.y); ctx.lineTo(x, 452); ctx.stroke(); }
  for (let y = ROOM.y; y < 452; y += 48) { ctx.beginPath(); ctx.moveTo(ROOM.x, y); ctx.lineTo(ROOM.x + ROOM.w, y); ctx.stroke(); }
  // Window with a warm evening sky.
  rr(ctx, 120, 130, 210, 132, 12, '#3b5f88', C.woodDark, 6);
  const g = ctx.createLinearGradient(0, 140, 0, 255);
  g.addColorStop(0, '#f6b56b'); g.addColorStop(1, '#c96d70');
  ctx.fillStyle = g; ctx.fillRect(128, 138, 194, 116);
  ctx.fillStyle = '#3b5f88'; ctx.fillRect(224, 138, 6, 116); ctx.fillRect(128, 194, 194, 6);
  // Shelves of jars.
  [370, 540, 710].forEach((x, i) => {
    rr(ctx, x, 168, 152, 12, 3, C.wood, C.woodDark, 2);
    for (let j = 0; j < 3; j++) {
      const col = [C.tomato, C.greens, C.gold][(i + j) % 3];
      rr(ctx, x + 16 + j * 46, 128, 30, 40, 5, col, C.ink, 2);
      rr(ctx, x + 20 + j * 46, 122, 22, 8, 2, C.steel, C.ink, 2);
    }
  });
  rr(ctx, 20, 440, 894, 30, 4, C.tile, C.tileLine, 3);
  ctx.fillStyle = C.tileLine; ctx.fillRect(20, 466, 894, 6);
}

function counter(ctx) {
  rr(ctx, 18, 470, 898, 222, 12, C.wood, C.woodDark, 5);
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 2;
  for (let y = 500; y < 690; y += 38) { ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(910, y); ctx.stroke(); }
}

function bin(ctx, b, selected) {
  rr(ctx, b.x, b.y, b.w, b.h, 10, selected ? '#fff0c9' : '#e8d5b4', C.woodDark, 3);
  rr(ctx, b.x + 4, b.y + 4, b.w - 8, 20, 6, selected ? C.gold : C.steel, C.ink, 2);
  food(ctx, b.kind, b.x + b.w / 2, b.y + 62, 46, 'raw');
  label(ctx, b.kind, b.x + b.w / 2, b.y + 106, 15, C.ink, 'center');
  if (selected) rr(ctx, b.x - 3, b.y - 3, b.w + 6, b.h + 6, 12, null, C.gold, 4);
}

function board(ctx, s, b) {
  rr(ctx, s.x, s.y, s.w, s.h, 10, '#d9ad78', C.woodDark, 3);
  label(ctx, 'CHOP', s.x + s.w / 2, s.y + 18, 15, C.ink, 'center');
  if (b.item) {
    food(ctx, b.item, s.x + s.w / 2, s.y + 72, 52, b.done ? 'chopped' : 'raw');
    const pips = Math.min(3, b.chops);
    for (let i = 0; i < 3; i++) {
      rr(ctx, s.x + 44 + i * 18, s.y + 108, 13, 8, 3, i < pips ? C.gold : '#b08b64');
    }
  } else {
    label(ctx, '1-5 pick', s.x + s.w / 2, s.y + 78, 14, '#8a6748', 'center');
  }
  ctx.save();
  ctx.translate(s.x + s.w - 22, s.y + 62); ctx.rotate(-0.5);
  rr(ctx, -5, -26, 10, 46, 3, C.steel, C.ink, 2);
  rr(ctx, -13, -34, 26, 12, 3, C.woodDark, C.ink, 2);
  ctx.restore();
}

function stove(ctx, s, pan, t) {
  rr(ctx, s.x, s.y, s.w, s.h, 10, '#39415c', C.ink, 3);
  ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 76, 52, 30, 0, 0, 7);
  ctx.fillStyle = C.steelDark; ctx.fill();
  if (pan.item) {
    ctx.beginPath(); ctx.ellipse(s.x + s.w / 2, s.y + 70, 47, 25, 0, 0, 7);
    ctx.fillStyle = pan.burnt ? '#4a3c3a' : C.steel; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
    rr(ctx, s.x + s.w - 12, s.y + 62, 34, 12, 5, C.steelDark, C.ink, 2);
    food(ctx, pan.item, s.x + s.w / 2, s.y + 64, 40, pan.burnt ? 'burnt' : 'cooked');
    if (!pan.burnt && pan.progress > 0.15) steam(ctx, s.x + s.w / 2, s.y + 44, t);
    const w = 104, p = Math.min(1.6, pan.progress) / 1.6;
    rr(ctx, s.x + 19, s.y + 112, w, 10, 5, '#252b42');
    rr(ctx, s.x + 19, s.y + 112, w * p, 10, 5, pan.burnt ? C.bad : p > 0.65 ? C.good : C.gold);
    label(ctx, pan.burnt ? 'BURNT' : pan.progress < 1 ? 'COOKING' : 'READY', s.x + s.w / 2, s.y + 18, 14, pan.burnt ? C.bad : C.cream, 'center');
  } else {
    label(ctx, 'STOVE', s.x + s.w / 2, s.y + 74, 16, '#9aa6c2', 'center');
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.moveTo(s.x + 60 + i * 12, s.y + 92);
      ctx.quadraticCurveTo(s.x + 66 + i * 12, s.y + 76, s.x + 60 + i * 12, s.y + 66);
      ctx.strokeStyle = '#ff8a4c'; ctx.lineWidth = 3; ctx.stroke();
    }
  }
}

function dishStation(ctx, s, items) {
  rr(ctx, s.x, s.y, s.w, s.h, 10, '#e8dcc2', C.woodDark, 3);
  label(ctx, 'PLATE', s.x + s.w / 2, s.y + 18, 15, C.ink, 'center');
  plate(ctx, s.x + s.w / 2, s.y + 78, items, 0);
  if (items.length === 3) label(ctx, 'READY TO SERVE', s.x + s.w / 2, s.y + 116, 13, '#a4632d', 'center');
}

function hatch(ctx, s, ready) {
  rr(ctx, s.x, s.y, s.w, s.h, 10, ready ? '#3d5a50' : '#33405c', C.ink, 4);
  label(ctx, 'PASS', s.x + s.w / 2, s.y + 20, 15, ready ? C.good : '#9aa6c2', 'center');
  ctx.fillStyle = '#1d2338'; ctx.fillRect(s.x + 14, s.y + 34, s.w - 28, 76);
  rr(ctx, s.x + 14, s.y + 34, s.w - 28, 76, 6, null, C.steelDark, 2);
  ctx.beginPath(); ctx.arc(s.x + s.w / 2, s.y + 132, 8, 0, 7);
  ctx.fillStyle = ready ? C.gold : '#66708d'; ctx.fill();
  if (ready) label(ctx, 'SERVE!', s.x + s.w / 2, s.y + 108, 16, C.gold, 'center');
}

function chef(ctx, x, y, t, busy) {
  ctx.save();
  ctx.beginPath(); ctx.ellipse(x, y + 52, 30, 8, 0, 0, 7); ctx.fillStyle = C.shadow; ctx.fill();
  rr(ctx, x - 22, y - 2, 44, 52, 10, C.cream, C.ink, 2);
  ctx.beginPath(); ctx.arc(x, y - 20, 22, 0, 7); ctx.fillStyle = '#f3c9a0'; ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
  rr(ctx, x - 21, y - 44, 42, 16, 7, C.cream, C.ink, 2);
  rr(ctx, x - 16, y - 54, 32, 15, 6, C.cream, C.ink, 2);
  ctx.fillStyle = C.ink;
  ctx.beginPath(); ctx.arc(x - 7, y - 20, 2.6, 0, 7); ctx.arc(x + 7, y - 20, 2.6, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y - 11, 5, 0, Math.PI); ctx.strokeStyle = '#9b5c48'; ctx.lineWidth = 2; ctx.stroke();
  const swing = busy ? Math.sin(t * 16) * 12 : Math.sin(t * 3) * 3;
  ctx.strokeStyle = '#f3c9a0'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 18, y + 8); ctx.lineTo(x - 30, y + 20 + swing); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 18, y + 8); ctx.lineTo(x + 30, y + 20 - swing); ctx.stroke();
  ctx.restore();
}

export function drawKitchen(ctx, state, t) {
  tiles(ctx, t);
  counter(ctx);
  BINS.forEach((b) => bin(ctx, b, state.selected === b.kind));
  board(ctx, CHOP, state.board);
  stove(ctx, STOVE, state.pan, t);
  dishStation(ctx, DISH, state.plate);
  hatch(ctx, HATCH, state.plate.length === 3);
  chef(ctx, state.chef.x, state.chef.y, t, state.board.chops > 0 && !state.board.done);
  if (state.flash && t - state.flash.at < 0.9) {
    ctx.globalAlpha = Math.max(0, 1 - (t - state.flash.at) / 0.9);
    label(ctx, state.flash.text, 480, 300, 44, state.flash.good ? C.good : C.bad, 'center');
    ctx.globalAlpha = 1;
  }
}
