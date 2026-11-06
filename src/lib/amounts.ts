// One source for amounts: the ingredient list, the steps, cooking mode and the list all call these.
import type { Ingredient, Recipe, StepPart } from '@/data/recipes';

const FRACTIONS: Record<number, string> = { 1: '⅛', 2: '¼', 3: '⅜', 4: '½', 5: '⅝', 6: '¾', 7: '⅞' };

export function formatQty(n: number): string {
  const eighths = Math.round(n * 8);
  if (eighths === 0) return FRACTIONS[1];
  const whole = Math.floor(eighths / 8);
  const frac = eighths % 8;
  if (frac === 0) return String(whole);
  return (whole ? String(whole) : '') + FRACTIONS[frac];
}

export function formatAmount(qty: number | null, unit: [string, string]): string {
  if (qty === null) return 'To taste';
  const u = qty > 1 ? unit[1] : unit[0];
  return formatQty(qty) + (u ? ' ' + u : '');
}

export const scaleQty = (ing: Ingredient, recipe: Recipe, servings: number) =>
  ing.qty === null ? null : (ing.qty * servings) / recipe.servingsBasis;

export const ingredientAmount = (recipe: Recipe, ing: Ingredient, servings: number) =>
  formatAmount(scaleQty(ing, recipe, servings), ing.unit);

export type TextPart = { text: string; amount: boolean };

export function stepParts(recipe: Recipe, step: StepPart[], servings: number): TextPart[] {
  return step.map((p) => {
    if (typeof p === 'string') return { text: p, amount: false };
    const ing = recipe.ingredients.find((i) => i.id === p.ing);
    if (!ing) throw new Error(`Step references unknown ingredient ${p.ing} in ${recipe.id}`);
    const amt = ingredientAmount(recipe, ing, servings);
    return { text: p.bare ? amt : `${amt} ${ing.stepName}`, amount: true };
  });
}
