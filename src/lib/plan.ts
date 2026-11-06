// Deterministic plan rules over the seed data. No AI.
import { RECIPES, recipeById, type Recipe } from '@/data/recipes';
import { FOOD_SLOTS } from '@/data/foods';
import { dayIndex, type DayKey } from '@/data/setupOptions';
import { meetsGoalBar, recipeFoodIds } from './goalBar';
import type { Plan, PlanEntry, Setup, SkipMode } from './types';

export type PlanInputs = { setup: Setup; foodSwaps: Record<string, boolean> };

const ANIMALS_EXCLUDED: Record<string, string[]> = {
  Everything: [],
  Vegetarian: ['meat', 'poultry', 'fish', 'shellfish'],
  Vegan: ['meat', 'poultry', 'fish', 'shellfish', 'dairy', 'egg'],
  Pescatarian: ['meat', 'poultry'],
};

/** Words from "Foods someone won't touch", lightly normalized. */
export function wontTouchTerms(text: string): string[] {
  return text
    .toLowerCase()
    .split(/,|;|\band\b|\bor\b/)
    .map((s) => s.replace(/\banything\b|\bno\b/g, '').trim())
    .filter((s) => s.length > 1)
    .map((s) => (s.endsWith('es') && s.length > 4 ? s.slice(0, -2) : s.endsWith('s') && s.length > 3 ? s.slice(0, -1) : s));
}

export function violates(r: Recipe, setup: Setup): string | null {
  for (const ing of r.ingredients) {
    const hit = ing.allergens?.find((a) => setup.allergies.includes(a));
    if (hit) return `allergen:${hit}`;
    if (ing.animal && ANIMALS_EXCLUDED[setup.diet].includes(ing.animal)) return `diet:${setup.diet}`;
  }
  const terms = wontTouchTerms(setup.wontTouch);
  for (const t of terms) {
    if (t.startsWith('spic') && r.spicy) return `wont:${t}`;
    if (r.ingredients.some((i) => i.name.toLowerCase().includes(t) || i.stepName.toLowerCase().includes(t))) return `wont:${t}`;
    if (r.title.toLowerCase().includes(t)) return `wont:${t}`;
  }
  if (setup.needs.includes('Kids avoid spicy') && r.spicy) return 'spicy';
  return null;
}

/** Every recipe a plan or swap may use: passes the bar and every household constraint. */
export const eligibleRecipes = (setup: Setup) => RECIPES.filter((r) => meetsGoalBar(r) && !violates(r, setup));

function score(r: Recipe, { setup, foodSwaps }: PlanInputs): number {
  const foods = recipeFoodIds(r);
  let s = 0;
  for (const slot of FOOD_SLOTS) {
    if (!foodSwaps[slot.k]) continue;
    if (foods.includes(slot.main)) s -= 2; // "Not a fan?" of the main food
    if (foods.includes(slot.alt)) s += 1;
  }
  const hasMeat = r.ingredients.some((i) => i.animal === 'meat' || i.animal === 'poultry' || i.animal === 'fish');
  if (setup.needs.includes('Someone wants meat most nights') && hasMeat) s += 1;
  if (setup.needs.includes('A picky eater') && r.familiar) s += 1;
  return s;
}

/** Eligible recipes, best first; ties keep seed order so results are stable. */
export function rankedRecipes(inputs: PlanInputs): Recipe[] {
  const order = new Map(RECIPES.map((r, i) => [r.id, i]));
  return eligibleRecipes(inputs.setup)
    .map((r) => ({ r, s: score(r, inputs) }))
    .sort((a, b) => b.s - a.s || order.get(a.r.id)! - order.get(b.r.id)!)
    .map((x) => x.r);
}

export const planInputsKey = ({ setup, foodSwaps }: PlanInputs) =>
  JSON.stringify([setup.allergies, setup.diet, setup.servings, setup.needs, setup.wontTouch, [...setup.nights].sort(), foodSwaps]);

export function generatePlan(inputs: PlanInputs): Plan {
  const nights = [...inputs.setup.nights].sort((a, b) => dayIndex(a) - dayIndex(b));
  const ranked = rankedRecipes(inputs);
  const picks = ranked.slice(0, nights.length);
  // At least one Family favorite per week.
  if (picks.length && !picks.some((r) => r.familiar)) {
    const fav = ranked.find((r) => r.familiar);
    if (fav) picks[picks.length - 1] = fav;
  }
  const entries: PlanEntry[] = picks.map((r, i) => ({ id: `e${i}`, recipeId: r.id, night: nights[i], skipped: null }));
  return { inputsKey: planInputsKey(inputs), entries };
}

export const sortedEntries = (plan: Plan) => [...plan.entries].sort((a, b) => dayIndex(a.night) - dayIndex(b.night));
export const liveEntries = (plan: Plan) => sortedEntries(plan).filter((e) => !e.skipped);

// ---------- Swap ----------

export function isLastFamiliar(plan: Plan, entryId: string): boolean {
  const target = plan.entries.find((e) => e.id === entryId);
  if (!target || !recipeById(target.recipeId)?.familiar) return false;
  return !plan.entries.some((e) => e.id !== entryId && !e.skipped && recipeById(e.recipeId)?.familiar);
}

export function swapOptions(plan: Plan, entryId: string, reason: string | null, inputs: PlanInputs) {
  const inWeek = new Set(plan.entries.map((e) => e.recipeId));
  const lastFamiliar = isLastFamiliar(plan, entryId);
  const tooLong = reason === 'Too long tonight';
  const pool = rankedRecipes(inputs).filter((r) => !inWeek.has(r.id));
  const rank = new Map(pool.map((r, i) => [r.id, i]));
  const sorted = [...pool].sort(
    (a, b) =>
      (lastFamiliar ? Number(b.familiar) - Number(a.familiar) : 0) ||
      (tooLong ? a.minutes - b.minutes : 0) ||
      rank.get(a.id)! - rank.get(b.id)!,
  );
  const heading = lastFamiliar
    ? tooLong ? 'Family favorites first, then fastest' : 'Keep a family favorite this week'
    : tooLong ? 'Fastest first' : 'Try one of these';
  return { heading, options: sorted.slice(0, 3) };
}

export const swapEntry = (plan: Plan, entryId: string, recipeId: string): Plan => ({
  ...plan,
  entries: plan.entries.map((e) => (e.id === entryId ? { ...e, recipeId, skipped: null } : e)),
});

// ---------- Move ----------

export function moveEntry(plan: Plan, entryId: string, to: DayKey): Plan {
  const target = plan.entries.find((e) => e.id === entryId)!;
  const from = target.night;
  return {
    ...plan,
    entries: plan.entries.map((e) => (e.id === entryId ? { ...e, night: to } : e.night === to ? { ...e, night: from } : e)),
  };
}

// ---------- Skip ----------

export const skipEntry = (plan: Plan, entryId: string, mode: SkipMode): Plan => ({
  ...plan,
  entries: plan.entries.map((e) => (e.id === entryId ? { ...e, skipped: mode } : e)),
});

export const unskipEntry = (plan: Plan, entryId: string): Plan => ({
  ...plan,
  entries: plan.entries.map((e) => (e.id === entryId ? { ...e, skipped: null } : e)),
});
