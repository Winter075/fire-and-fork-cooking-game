// Recipes and the order board: what the kitchen is asked to cook, and how long it has.
import { C } from './palette.js';

export const INGREDIENTS = ['tomato', 'mushroom', 'shrimp', 'rice', 'greens'];

export const RECIPES = [
  { id: 'sunrise', name: 'Sunrise Bowl', items: ['rice', 'tomato', 'greens'], tint: C.gold },
  { id: 'garden', name: 'Garden Toast', items: ['mushroom', 'greens', 'tomato'], tint: C.good },
  { id: 'catch', name: 'Pepper Catch', items: ['shrimp', 'tomato', 'rice'], tint: C.hot },
  { id: 'comfort', name: 'Comfort Pot', items: ['mushroom', 'rice', 'greens'], tint: C.mushroom },
  { id: 'surf', name: 'Surf Plate', items: ['shrimp', 'greens', 'rice'], tint: C.shrimp },
];

let nextId = 1;

export function makeOrder(idx, seconds = 38) {
  const recipe = RECIPES[idx % RECIPES.length];
  return {
    id: nextId++,
    recipe,
    left: seconds,
    total: seconds,
    x: 0,
    y: 0,
  };
}

export function matches(order, cookedItems) {
  if (!order || cookedItems.length !== order.recipe.items.length) return false;
  const want = [...order.recipe.items].sort().join('|');
  const got = [...cookedItems].sort().join('|');
  return want === got;
}

export function recipeText(order) {
  return order.recipe.items.map((k) => k[0].toUpperCase() + k.slice(1)).join(' + ');
}
