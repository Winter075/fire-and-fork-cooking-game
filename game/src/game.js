// The rules of the kitchen: tickets, chopping, cooking, plating and service.
import { makeOrder, matches } from './orders.js';
import { sound } from './audio.js';

export function initialState() {
  return {
    phase: 'title',
    score: 0,
    combo: 0,
    served: 0,
    hearts: 3,
    elapsed: 0,
    rush: false,
    selected: null,
    board: { item: null, chops: 0, done: false },
    pan: { item: null, progress: 0, burnt: false },
    plate: [],
    orders: [makeOrder(0, 46), makeOrder(1, 58), makeOrder(2, 70)],
    chef: { x: 470, y: 420 },
    flash: null,
    nextRush: 14,
  };
}

function moveChef(state, x, y) {
  state.chef.x = Math.max(60, Math.min(880, x));
  state.chef.y = Math.max(330, Math.min(560, y));
}

function flash(state, text, good, t) {
  state.flash = { text, good, at: t };
}

export function start(state) {
  if (state.phase === 'over') Object.assign(state, initialState());
  state.phase = 'play';
}

export function pick(state, kind) {
  if (state.phase !== 'play') return;
  state.selected = kind;
  moveChef(state, 40 + ['tomato', 'mushroom', 'shrimp', 'rice', 'greens'].indexOf(kind) * 82 + 38, 430);
  sound.pick();
}

export function chop(state, t) {
  if (state.phase !== 'play' || !state.selected) return;
  moveChef(state, 512, 430);
  if (state.board.done) { flash(state, 'BOARD FULL', false, t); return; }
  if (state.board.item !== state.selected) {
    state.board.item = state.selected;
    state.board.chops = 1;
  } else {
    state.board.chops += 1;
  }
  sound.chop();
  if (state.board.chops >= 3) {
    state.board.done = true;
    flash(state, 'CHOPPED!', true, t);
  }
}

export function toPan(state, t) {
  if (state.phase !== 'play') return;
  moveChef(state, 670, 430);
  if (!state.board.done) { flash(state, 'CHOP FIRST', false, t); return; }
  state.pan = { item: state.board.item, progress: 0, burnt: false };
  state.board = { item: null, chops: 0, done: false };
  sound.sizzle();
}

export function toPlate(state, t) {
  if (state.phase !== 'play') return;
  moveChef(state, 826, 430);
  if (!state.pan.item) { flash(state, 'PAN EMPTY', false, t); return; }
  if (!state.pan.progress || state.pan.progress < 1) { flash(state, 'NOT COOKED', false, t); return; }
  if (state.pan.burnt) { flash(state, 'BURNT!', false, t); state.pan = { item: null, progress: 0, burnt: false }; return; }
  if (state.plate.length >= 3) { flash(state, 'PLATE FULL', false, t); return; }
  state.plate.push(state.pan.item);
  state.pan = { item: null, progress: 0, burnt: false };
  sound.plate();
}

export function serve(state, t) {
  if (state.phase !== 'play') return;
  moveChef(state, 826, 340);
  if (state.plate.length !== 3) { flash(state, 'NEED 3 ITEMS', false, t); return; }
  if (matches(state.orders[0], state.plate)) {
    state.score += 100 + state.combo * 30;
    state.combo += 1;
    state.served += 1;
    state.orders.shift();
    state.orders.push(makeOrder(state.served + 2, state.rush ? 30 : 46));
    flash(state, state.combo > 2 ? `PERFECT x${state.combo}!` : 'ORDER UP!', true, t);
    sound.serve();
  } else {
    state.combo = 0;
    state.hearts -= 1;
    flash(state, 'WRONG ORDER', false, t);
    sound.miss();
  }
  state.plate = [];
  if (state.hearts <= 0) state.phase = 'over';
}

export function nudgeChef(state, dx, dy) {
  if (state.phase !== 'play') return;
  moveChef(state, state.chef.x + dx * 14, state.chef.y + dy * 10);
}

export function update(state, dt, t) {
  if (state.phase !== 'play' || state.shot) return;
  state.elapsed += dt;
  if (state.pan.item && !state.pan.burnt) {
    state.pan.progress += dt / 3.2;
    if (state.pan.progress > 1.65) state.pan.burnt = true;
  }
  state.orders.forEach((o) => { o.left -= dt; });
  while (state.orders[0] && state.orders[0].left <= 0) {
    state.orders.shift();
    state.orders.push(makeOrder(state.served + 4, state.rush ? 28 : 42));
    state.hearts -= 1;
    state.combo = 0;
    flash(state, 'TICKET LOST', false, t);
    sound.miss();
    if (state.hearts <= 0) { state.phase = 'over'; return; }
  }
  if (!state.rush && state.elapsed >= 40) {
    state.rush = true;
    flash(state, 'SERVICE RUSH!', true, t);
  }
  if (state.rush) {
    state.nextRush -= dt;
    if (state.nextRush <= 0) {
      state.nextRush = 16;
      state.orders[0].left = Math.min(state.orders[0].left, 18);
      flash(state, 'NEW TICKET!', false, t);
    }
  }
}
