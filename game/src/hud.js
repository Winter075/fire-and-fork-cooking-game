// The readable layer: order board, clock, score, combo, hearts and key hints.
import { C, FONT, rr, label, food } from './palette.js';
import { recipeText } from './orders.js';

export const BOARD = { x: 934, y: 104, w: 332, h: 470 };

function hearts(ctx, n) {
  for (let i = 0; i < 3; i++) {
    const x = 1068 + i * 30;
    ctx.beginPath();
    ctx.moveTo(x, 36); ctx.bezierCurveTo(x - 14, 24, x - 12, 14, x, 20);
    ctx.bezierCurveTo(x + 12, 14, x + 14, 24, x, 36); ctx.closePath();
    ctx.fillStyle = i < n ? C.bad : '#4a4f68'; ctx.fill();
  }
}

function orderCard(ctx, order, i) {
  const x = BOARD.x + 14, y = BOARD.y + 16 + i * 148, w = BOARD.w - 28, h = 134;
  const urgent = order.left < 10;
  rr(ctx, x, y, w, h, 12, urgent ? '#4a2c3e' : '#232b45', urgent ? C.bad : C.steelDark, urgent ? 4 : 2);
  label(ctx, `#${order.id}  ${order.recipe.name}`, x + 14, y + 22, 19, C.cream);
  label(ctx, recipeText(order), x + 14, y + 48, 14, '#b9c4d6');
  order.recipe.items.forEach((k, j) => food(ctx, k, x + 34 + j * 58, y + 84, 36, 'raw'));
  const p = Math.max(0, order.left / order.total);
  rr(ctx, x + 12, y + 112, w - 24, 10, 5, '#151a2c');
  rr(ctx, x + 12, y + 112, (w - 24) * p, 10, 5, urgent ? C.bad : p < 0.4 ? C.gold : C.good);
  label(ctx, `${Math.ceil(Math.max(0, order.left))}s`, x + w - 16, y + 22, 17, urgent ? C.bad : C.gold, 'right');
}

export function drawHud(ctx, state, t) {
  rr(ctx, 0, 0, 1280, 92, 0, C.night, null, 0);
  ctx.strokeStyle = C.gold; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, 92); ctx.lineTo(1280, 92); ctx.stroke();
  label(ctx, 'FIRE & FORK', 28, 38, 38, C.gold);
  label(ctx, 'a tiny kitchen rush', 30, 68, 15, '#9aa6c2');
  label(ctx, 'SCORE', 500, 26, 14, '#9aa6c2');
  label(ctx, String(state.score).padStart(5, '0'), 500, 56, 30, C.cream);
  label(ctx, 'COMBO', 630, 26, 14, '#9aa6c2');
  label(ctx, `x${state.combo}`, 630, 56, 30, state.combo > 1 ? C.good : C.cream);
  label(ctx, 'SERVED', 740, 26, 14, '#9aa6c2');
  label(ctx, String(state.served), 740, 56, 30, C.cream);
  label(ctx, 'TIME', 836, 26, 14, '#9aa6c2');
  label(ctx, `${Math.max(0, 150 - Math.floor(state.elapsed))}s`, 836, 56, 30, state.rush ? C.hot : C.cream);
  hearts(ctx, state.hearts);

  rr(ctx, BOARD.x, BOARD.y, BOARD.w, BOARD.h, 14, '#1b2137', C.steelDark, 3);
  label(ctx, 'ORDER BOARD', BOARD.x + 18, BOARD.y + 30, 22, C.gold);
  state.orders.forEach((o, i) => orderCard(ctx, o, i));
  label(ctx, state.rush ? 'SERVICE RUSH!' : 'WARMING UP', BOARD.x + BOARD.w / 2, BOARD.y + BOARD.h - 20, 18, state.rush ? C.hot : C.good, 'center');

  ctx.fillStyle = 'rgba(12,15,28,0.82)'; ctx.fillRect(0, 692, 1280, 28);
  label(ctx, '1-5 pick ingredient   C chop   S pan   P plate   ENTER serve   WASD move chef   M mute', 20, 706, 15, '#c7d0e2');

  if (state.phase === 'title') {
    ctx.fillStyle = 'rgba(12,15,28,0.72)'; ctx.fillRect(0, 0, 1280, 720);
    rr(ctx, 240, 190, 800, 330, 20, '#232b45', C.gold, 5);
    label(ctx, 'FIRE & FORK', 640, 270, 66, C.gold, 'center');
    label(ctx, 'Chop. Cook. Plate. Serve before the ticket expires.', 640, 332, 24, C.cream, 'center');
    label(ctx, 'Pick with 1-5 or click the crates. Press ENTER or click PASS to serve.', 640, 380, 18, '#b9c4d6', 'center');
    label(ctx, 'PRESS ENTER OR CLICK TO OPEN THE KITCHEN', 640, 452, 22, C.good, 'center');
  }
  if (state.phase === 'over') {
    ctx.fillStyle = 'rgba(12,15,28,0.78)'; ctx.fillRect(0, 0, 1280, 720);
    rr(ctx, 330, 220, 620, 270, 18, '#232b45', C.bad, 5);
    label(ctx, 'KITCHEN CLOSED', 640, 290, 48, C.bad, 'center');
    label(ctx, `${state.served} plates served  ·  ${state.score} points`, 640, 355, 24, C.cream, 'center');
    label(ctx, 'PRESS ENTER TO COOK AGAIN', 640, 425, 20, C.gold, 'center');
  }
}
