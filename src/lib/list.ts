// The one shopping list. Always derived from the current plan; never stored.
import { recipeById, type Ingredient, type Recipe } from '@/data/recipes';
import { AISLE_ORDER, PANTRY_STAPLES, type Aisle, type DayKey } from '@/data/setupOptions';
import { formatAmount, scaleQty } from './amounts';
import { sortedEntries } from './plan';
import type { Plan, Setup } from './types';

export function activeStaples(setup: Setup): string[] {
  return [...PANTRY_STAPLES.filter((s) => !setup.pantryOff.includes(s)), ...setup.pantryExtra];
}

export function inPantry(ing: Ingredient, setup: Setup): boolean {
  const staples = activeStaples(setup);
  if (ing.pantry?.length && ing.pantry.every((p) => staples.includes(p))) return true;
  const name = ing.name.toLowerCase();
  return setup.pantryExtra.some((x) => {
    const e = x.toLowerCase().trim();
    return e.length > 2 && (name.includes(e) || e.includes(name));
  });
}

export type ListItem = { key: string; name: string; aisle: Aisle; amount: string; nights: DayKey[]; nextWeekOnly: boolean };
export type ShoppingList = {
  groups: { aisle: Aisle; items: ListItem[] }[];
  kitchen: string[];
  dinnerCount: number;
  itemCount: number;
};

export const servingsFor = (recipeId: string, setup: Setup, overrides: Record<string, number>) => overrides[recipeId] ?? setup.servings;

export function deriveList(plan: Plan | null, setup: Setup, overrides: Record<string, number> = {}): ShoppingList {
  const empty: ShoppingList = { groups: [], kitchen: [], dinnerCount: 0, itemCount: 0 };
  if (!plan) return empty;
  type Acc = { key: string; name: string; aisle: Aisle; byUnit: Map<string, { qty: number | null; unit: [string, string] }>; nights: DayKey[]; nextWeekOnly: boolean };
  const acc = new Map<string, Acc>();
  const kitchen: string[] = [];
  let dinnerCount = 0;
  for (const e of sortedEntries(plan)) {
    // "Save it for next week" keeps the ingredients on the list (per V2-7-Week copy); "drop" removes them.
    if (e.skipped === 'drop') continue;
    if (!e.skipped) dinnerCount++;
    const r = recipeById(e.recipeId);
    if (!r) continue;
    const servings = servingsFor(r.id, setup, overrides);
    for (const ing of r.ingredients) {
      if (inPantry(ing, setup)) {
        if (!kitchen.includes(ing.name)) kitchen.push(ing.name);
        continue;
      }
      let a = acc.get(ing.key);
      if (!a) {
        a = { key: ing.key, name: ing.name, aisle: ing.aisle, byUnit: new Map(), nights: [], nextWeekOnly: true };
        acc.set(ing.key, a);
      }
      const unitKey = ing.unit[0];
      const q = scaleQty(ing, r, servings);
      const prev = a.byUnit.get(unitKey);
      a.byUnit.set(unitKey, { unit: ing.unit, qty: prev ? (prev.qty === null || q === null ? null : prev.qty + q) : q });
      if (!a.nights.includes(e.night)) a.nights.push(e.night);
      if (!e.skipped) a.nextWeekOnly = false;
    }
  }
  const groups = AISLE_ORDER.map((aisle) => ({
    aisle,
    items: [...acc.values()]
      .filter((a) => a.aisle === aisle)
      .map((a) => ({
        key: a.key,
        name: a.name,
        aisle: a.aisle,
        nights: a.nights,
        nextWeekOnly: a.nextWeekOnly,
        amount: [...a.byUnit.values()].map((u) => formatAmount(u.qty, u.unit)).join(' + '),
      })),
  })).filter((g) => g.items.length);
  return { groups, kitchen, dinnerCount, itemCount: groups.reduce((n, g) => n + g.items.length, 0) };
}

/** Pantry match for one recipe: items you have (pantry or checked off the list) out of all. */
export function recipeHave(r: Recipe, setup: Setup, checked: Record<string, boolean>) {
  const pantry = r.ingredients.filter((i) => inPantry(i, setup)).length;
  const have = r.ingredients.filter((i) => inPantry(i, setup) || checked[i.key]).length;
  return { have, total: r.ingredients.length, listItems: r.ingredients.length - pantry };
}

export function listAsText(list: ShoppingList, checked: Record<string, boolean>): string {
  const lines = ["This week's list", ''];
  for (const g of list.groups) {
    lines.push(g.aisle);
    for (const i of g.items) lines.push(`${checked[i.key] ? '[x]' : '[ ]'} ${i.name}, ${i.amount} (for ${i.nights.join(', ')})`);
    lines.push('');
  }
  if (list.kitchen.length) lines.push(`Already in your kitchen: ${list.kitchen.join(', ')}`);
  return lines.join('\n').trim();
}
