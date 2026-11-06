import { GOAL_BAR } from '@/data/goal';
import { foodById } from '@/data/foods';
import type { Recipe } from '@/data/recipes';

export const recipeFoodIds = (r: Recipe) => [...new Set(r.ingredients.map((i) => i.food).filter((f): f is string => !!f))];

/** The single LDL-friendly bar. Only recipes that pass go into a plan. */
export function meetsGoalBar(r: Recipe): boolean {
  const n = r.nutrition;
  const hasTierFood = recipeFoodIds(r).some((id) => (GOAL_BAR.qualifyingTiers as readonly string[]).includes(foodById(id).tier));
  return n.satFatG <= GOAL_BAR.maxSatFatG && n.fiberG >= GOAL_BAR.minFiberG && hasTierFood;
}
