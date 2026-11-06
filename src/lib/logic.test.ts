import { describe, expect, it } from 'vitest';
import { RECIPES, recipeById } from '@/data/recipes';
import { meetsGoalBar } from './goalBar';
import { generatePlan, moveEntry, skipEntry, swapEntry, swapOptions, unskipEntry, sortedEntries } from './plan';
import { deriveList } from './list';
import { ingredientAmount, stepParts } from './amounts';
import { defaultSetup } from './defaults';
import { reducer } from './reducer';
import { freshState } from './defaults';
import type { AppState, Setup } from './types';

const inputs = (s: Partial<Setup> = {}, foodSwaps = {}) => ({ setup: { ...defaultSetup(), ...s }, foodSwaps });
const allIngredientAllergens = (ids: string[]) => ids.flatMap((id) => recipeById(id)!.ingredients.flatMap((i) => i.allergens ?? []));

describe('meetsGoalBar', () => {
  it('passes the three base dinners', () => {
    for (const id of ['white-bean-kale-skillet', 'turkey-lentil-bolognese', 'black-bean-sweet-potato-tacos']) expect(meetsGoalBar(recipeById(id)!)).toBe(true);
  });
  it('fails the four-cheese mac', () => expect(meetsGoalBar(recipeById('four-cheese-mac')!)).toBe(false));
  it('requires an A or B food, not just numbers', () => {
    const r = { ...recipeById('white-bean-kale-skillet')!, ingredients: recipeById('white-bean-kale-skillet')!.ingredients.map((i) => ({ ...i, food: i.food === 'garlic' ? i.food : undefined })) };
    expect(meetsGoalBar(r)).toBe(false);
  });
  it('fails at 4.5 g sat fat and at 5 g fiber', () => {
    const base = recipeById('white-bean-kale-skillet')!;
    expect(meetsGoalBar({ ...base, nutrition: { ...base.nutrition, satFatG: 4.5 } })).toBe(false);
    expect(meetsGoalBar({ ...base, nutrition: { ...base.nutrition, fiberG: 5 } })).toBe(false);
  });
});

describe('generatePlan', () => {
  it('makes one dinner per night, all passing the bar, with a family favorite', () => {
    const p = generatePlan(inputs());
    expect(p.entries.map((e) => e.night)).toEqual(['Mon', 'Tue', 'Thu']);
    expect(p.entries.map((e) => e.recipeId)).toEqual(['white-bean-kale-skillet', 'turkey-lentil-bolognese', 'black-bean-sweet-potato-tacos']);
    expect(p.entries.every((e) => meetsGoalBar(recipeById(e.recipeId)!))).toBe(true);
    expect(p.entries.some((e) => recipeById(e.recipeId)!.familiar)).toBe(true);
  });
  it('is deterministic', () => expect(generatePlan(inputs())).toEqual(generatePlan(inputs())));
  it('never includes a selected allergen', () => {
    for (const a of ['Tree nuts', 'Dairy', 'Wheat', 'Soy', 'Fish'] as const) {
      const p = generatePlan(inputs({ allergies: [a], nights: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }));
      expect(allIngredientAllergens(p.entries.map((e) => e.recipeId))).not.toContain(a);
    }
  });
  it('respects diet and foods someone won’t touch', () => {
    const veg = generatePlan(inputs({ diet: 'Vegan', nights: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }));
    expect(veg.entries.flatMap((e) => recipeById(e.recipeId)!.ingredients.map((i) => i.animal)).filter(Boolean)).toEqual([]);
    const noTurkey = generatePlan(inputs({ wontTouch: 'turkey, anything spicy' }));
    expect(noTurkey.entries.map((e) => e.recipeId)).not.toContain('turkey-lentil-bolognese');
    expect(noTurkey.entries.some((e) => recipeById(e.recipeId)!.familiar)).toBe(true);
  });
  it('forces a family favorite when the top picks have none', () => {
    const p = generatePlan(inputs({ nights: ['Mon'] }));
    expect(recipeById(p.entries[0].recipeId)!.familiar).toBe(true);
  });
});

describe('swap, move, skip', () => {
  const base = generatePlan(inputs());
  it('swap options exclude the week, meet constraints, and sort by reason', () => {
    const { options, heading } = swapOptions(base, 'e0', 'Too long tonight', inputs({ allergies: ['Tree nuts'] }));
    expect(heading).toBe('Fastest first');
    expect(options).toHaveLength(3);
    expect(options.map((o) => o.minutes)).toEqual([...options.map((o) => o.minutes)].sort((a, b) => a - b));
    expect(options.some((o) => base.entries.some((e) => e.recipeId === o.id))).toBe(false);
    expect(allIngredientAllergens(options.map((o) => o.id))).not.toContain('Tree nuts');
  });
  it('puts family favorites first when swapping the last one', () => {
    const { options, heading } = swapOptions(base, 'e1', null, inputs());
    expect(heading).toBe('Keep a family favorite this week');
    expect(options[0].familiar).toBe(true);
  });
  it('move trades nights with an occupied night', () => {
    const moved = moveEntry(base, 'e0', 'Tue');
    expect(moved.entries.find((e) => e.id === 'e0')!.night).toBe('Tue');
    expect(moved.entries.find((e) => e.id === 'e1')!.night).toBe('Mon');
    expect(moveEntry(base, 'e0', 'Fri').entries.find((e) => e.id === 'e0')!.night).toBe('Fri');
  });
  it('skip and unskip', () => {
    const s = skipEntry(base, 'e2', 'drop');
    expect(s.entries[2].skipped).toBe('drop');
    expect(unskipEntry(s, 'e2')).toEqual(base);
  });
  it('reducer undo restores the previous week', () => {
    let st: AppState = { ...freshState(), plan: base, done: { goal: true, avoid: true, servings: true, household: true, kitchen: true, nights: true } };
    st = reducer(st, { type: 'planChange', plan: swapEntry(base, 'e0', 'smoky-black-bean-soup') });
    expect(st.plan!.entries[0].recipeId).toBe('smoky-black-bean-soup');
    st = reducer(st, { type: 'undoPlan' });
    expect(st.plan).toEqual(base);
    expect(st.prevPlan).toBeNull();
  });
});

describe('deriveList', () => {
  const setup = defaultSetup();
  const base = generatePlan(inputs());
  it('sums across dinners and tags nights', () => {
    const list = deriveList(base, { ...setup, pantryOff: ['Garlic'] });
    const garlic = list.groups.flatMap((g) => g.items).find((i) => i.key === 'garlic')!;
    expect(garlic.amount).toBe('9 cloves'); // 6 (skillet at 4) + 3 (bolognese at 4)
    expect(garlic.nights).toEqual(['Mon', 'Tue']);
  });
  it('puts pantry items in the kitchen section', () => {
    const list = deriveList(base, setup);
    expect(list.kitchen).toContain('Olive oil');
    expect(list.groups.flatMap((g) => g.items).some((i) => i.key === 'olive-oil')).toBe(false);
  });
  it('updates with swaps and drop-skips; keep-skips stay on', () => {
    const dropped = deriveList(skipEntry(base, 'e0', 'drop'), setup);
    expect(dropped.groups.flatMap((g) => g.items).some((i) => i.key === 'lacinato-kale')).toBe(false);
    expect(dropped.dinnerCount).toBe(2);
    const kept = deriveList(skipEntry(base, 'e0', 'keep'), setup);
    expect(kept.groups.flatMap((g) => g.items).find((i) => i.key === 'lacinato-kale')!.nextWeekOnly).toBe(true);
    const swapped = deriveList(swapEntry(base, 'e0', 'smoky-black-bean-soup'), setup);
    expect(swapped.groups.flatMap((g) => g.items).find((i) => i.key === 'black-beans')!.amount).toBe('3 cans (15 oz)');
  });
  it('scales to servings overrides', () => {
    const list = deriveList(base, setup, { 'white-bean-kale-skillet': 2 });
    expect(list.groups.flatMap((g) => g.items).find((i) => i.key === 'lacinato-kale')!.amount).toBe('1 bunch');
  });
});

describe('amounts', () => {
  it('ingredient list and steps agree at any servings', () => {
    const r = recipeById('white-bean-kale-skillet')!;
    for (const s of [1, 2, 4, 6]) {
      const oil = ingredientAmount(r, r.ingredients.find((i) => i.id === 'oil')!, s);
      expect(stepParts(r, r.steps[0], s).find((p) => p.amount)!.text).toBe(`${oil} olive oil`);
    }
    expect(ingredientAmount(r, r.ingredients[0], 1)).toBe('½ can (15 oz)');
  });
  it('every step references a real ingredient', () => {
    for (const r of RECIPES) for (const st of r.steps) expect(() => stepParts(r, st, 4)).not.toThrow();
  });
  it('plan order is by weekday', () => {
    expect(sortedEntries(moveEntry(generatePlan(inputs()), 'e2', 'Mon')).map((e) => e.night)).toEqual(['Mon', 'Tue', 'Thu']);
  });
});
