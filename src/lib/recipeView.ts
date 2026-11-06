import { DAILY_VALUE } from '@/data/goal';
import type { Recipe } from '@/data/recipes';
import type { AppState } from './types';
import { dayName } from '@/data/setupOptions';

export function recipeFacts(r: Recipe): string[] {
  const animals = new Set(r.ingredients.map((i) => i.animal).filter(Boolean));
  const diet = animals.size === 0 ? 'Vegan'
    : [...animals].every((a) => a === 'dairy' || a === 'egg') ? 'Vegetarian'
      : [...animals].every((a) => a === 'dairy' || a === 'egg' || a === 'fish' || a === 'shellfish') ? 'Pescatarian' : null;
  const nutFree = !r.ingredients.some((i) => i.allergens?.some((a) => a === 'Tree nuts' || a === 'Peanuts'));
  return [`${r.minutes} min`, r.equipment, ...(diet ? [diet] : []), ...(nutFree ? ['Nut-free'] : [])];
}

export function nutrientTiles(r: Recipe) {
  const n = r.nutrition;
  const pct = (v: number, dv: number) => Math.round((v / dv) * 100);
  return [
    { label: 'Fiber', value: `${n.fiberG} g`, dv: pct(n.fiberG, DAILY_VALUE.fiberG), note: r.nutrientNotes?.fiber ?? (n.solubleG ? `incl. ${n.solubleG} g soluble` : '') },
    { label: 'Protein', value: `${n.proteinG} g`, dv: pct(n.proteinG, DAILY_VALUE.proteinG), note: r.nutrientNotes?.protein ?? '' },
    { label: 'Saturated fat', value: `${n.satFatG} g`, dv: pct(n.satFatG, DAILY_VALUE.satFatG), note: r.nutrientNotes?.satFat ?? '' },
    { label: 'Sodium', value: `${n.sodiumMg} mg`, dv: pct(n.sodiumMg, DAILY_VALUE.sodiumMg), note: r.nutrientNotes?.sodium ?? '' },
  ];
}

export const recipeServings = (state: AppState, recipeId: string) => state.servingsOverride[recipeId] ?? state.setup.servings;

export function recipeNight(state: AppState, recipeId: string): string | null {
  const e = state.plan?.entries.find((x) => x.recipeId === recipeId && !x.skipped);
  return e ? dayName(e.night) : null;
}
