// Colours, typography and the little food drawings shared by the game's views.
export const C = {
  night: '#171a2b',
  wall: '#2a2f4a',
  wallHi: '#39405f',
  tile: '#f3e7d0',
  tileLine: '#d8c6a6',
  wood: '#b9784b',
  woodDark: '#8a5636',
  steel: '#b9c4d6',
  steelDark: '#75829b',
  cream: '#fff8e8',
  ink: '#202438',
  tomato: '#e8524a',
  mushroom: '#d9b98f',
  shrimp: '#f28b7c',
  rice: '#f7f2df',
  greens: '#6fbf73',
  gold: '#ffc857',
  hot: '#ff6b4a',
  good: '#67d6a5',
  bad: '#ff7d7d',
  shadow: 'rgba(14,16,30,0.28)',
};

export const FONT = '"Trebuchet MS", "Segoe UI", sans-serif';

export function rr(ctx, x, y, w, h, r, fill, stroke, lw = 2) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}

export function label(ctx, text, x, y, size = 20, color = C.cream, align = 'left', weight = 'bold') {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

export function steam(ctx, x, y, t) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const px = x - 12 + i * 12;
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.bezierCurveTo(px - 6, y - 12, px + 8, y - 20, px, y - 34 - ((t * 14 + i * 9) % 14));
    ctx.stroke();
  }
  ctx.restore();
}

// One ingredient, drawn three ways: raw in its crate, chopped on the board,
// cooked in the pan or on a plate. All shapes are made here, no image files.
export function food(ctx, kind, x, y, size, state = 'raw') {
  const s = size / 40;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const cooked = state === 'cooked';
  if (state === 'chopped') {
    const tint = kind === 'greens' ? C.greens : kind === 'shrimp' ? C.shrimp : kind === 'rice' ? C.rice : kind === 'mushroom' ? C.mushroom : C.tomato;
    for (let i = -1; i <= 1; i++) {
      rr(ctx, i * 11 - 5, -7 + (i === 0 ? -3 : 0), 11, 13, 3, tint, C.ink, 1.5);
    }
  } else if (kind === 'tomato') {
    ctx.beginPath(); ctx.arc(0, 2, 17, 0, Math.PI * 2);
    ctx.fillStyle = cooked ? '#c9433f' : C.tomato; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-9, -20); ctx.lineTo(0, -17); ctx.lineTo(9, -20); ctx.closePath();
    ctx.fillStyle = C.greens; ctx.fill();
    ctx.beginPath(); ctx.arc(-6, -3, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fill();
  } else if (kind === 'mushroom') {
    rr(ctx, -7, 0, 14, 18, 5, cooked ? '#c9a273' : C.mushroom, C.ink, 2);
    ctx.beginPath(); ctx.arc(0, 1, 19, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = cooked ? '#b98b63' : '#e7c9a2'; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff1db';
    ctx.beginPath(); ctx.arc(-8, -6, 3, 0, 7); ctx.arc(5, -9, 3, 0, 7); ctx.fill();
  } else if (kind === 'shrimp') {
    ctx.beginPath(); ctx.arc(0, 0, 16, Math.PI * 0.15, Math.PI * 1.5);
    ctx.strokeStyle = cooked ? '#e26c5c' : C.shrimp; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, 12); ctx.lineTo(17, 17); ctx.lineTo(12, 5); ctx.closePath();
    ctx.fillStyle = cooked ? '#e26c5c' : C.shrimp; ctx.fill();
  } else if (kind === 'rice') {
    rr(ctx, -18, -2, 36, 19, 5, cooked ? '#e8dfbf' : C.steel, C.ink, 2);
    ctx.fillStyle = C.rice;
    for (let i = -13; i <= 13; i += 6) {
      ctx.beginPath(); ctx.ellipse(i, -4 - (i % 2 ? 3 : 0), 4, 2.5, 0.3, 0, 7); ctx.fill();
    }
  } else if (kind === 'greens') {
    for (let i = -1; i <= 1; i++) {
      ctx.save(); ctx.rotate(i * 0.5);
      ctx.beginPath(); ctx.ellipse(0, -9, 7, 14, 0, 0, 7);
      ctx.fillStyle = cooked ? '#4f9b59' : C.greens; ctx.fill();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}

export function plate(ctx, x, y, items, t) {
  ctx.save();
  ctx.beginPath(); ctx.ellipse(x, y + 6, 54, 15, 0, 0, 7); ctx.fillStyle = C.shadow; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y, 52, 20, 0, 0, 7);
  ctx.fillStyle = C.cream; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, 39, 12, 0, 0, 7); ctx.strokeStyle = '#e0d3b7'; ctx.lineWidth = 2; ctx.stroke();
  items.forEach((kind, i) => {
    const a = -0.7 + i * 0.7;
    food(ctx, kind, x + Math.sin(a) * 22, y - 6 + Math.cos(a) * 4, 30, 'cooked');
  });
  if (items.length && t) steam(ctx, x, y - 18, t);
  ctx.restore();
}
