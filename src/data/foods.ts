// SAMPLE DATA: the 11 LDL foods from V2-7-AllFoods, with the longer copy from V2-7-Foods where that
// screen shows the food. Tiers are provisional until the evidence rubric is final.
import type { Allergen } from './setupOptions';

export type Tier = 'A' | 'B' | 'C';
export type IconKey = 'grain' | 'bean' | 'seed' | 'cube' | 'fruit' | 'veg' | 'drop' | 'nut' | 'bottle' | 'clove';

export type Food = {
  id: string;
  tier: Tier;
  name: string;
  shortName: string; // week-screen food strip
  icon: IconKey;
  nutrient: string;
  how: string; // All LDL foods copy
  src: string;
  // Longer copy used on the Foods for healthy LDL screen, when it differs.
  foodsScreen?: { nutrient?: string; how: string; src: string };
  allergen?: Allergen; // shows "You avoid …" when the user avoids it
  avoidHow?: string; // extra sentence shown when the allergen is avoided
  notDinner?: boolean; // "Not in our dinners"
  dinnersLabel: string; // "Dinners with …"
};

export const TIERS: Record<Tier, { label: string; legend: string; desc: string; bg: string }> = {
  A: { label: 'FDA-authorized claim', legend: 'FDA-authorized health claim', desc: 'The strongest evidence: an FDA-approved health claim', bg: 'var(--mint)' },
  B: { label: 'Strong research', legend: 'Strong research, no authorized claim', desc: 'Consistent trials, or an FDA qualified claim', bg: 'var(--mustard)' },
  C: { label: 'Early research', legend: 'Early research, promising but limited', desc: 'Promising but limited or mixed', bg: 'var(--white)' },
};

export const FOODS: Food[] = [
  { id: 'oats', tier: 'A', name: 'Oats and barley', shortName: 'Oats', icon: 'grain', nutrient: 'Soluble fiber (beta-glucan)', dinnersLabel: 'Dinners with oats and barley',
    how: 'Beta-glucan turns into a thick gel in your gut. It traps bile acids, which your body makes from cholesterol, and carries them out. To make more, your liver pulls LDL cholesterol from your blood.',
    src: 'FDA authorized health claim, 21 CFR 101.81' },
  { id: 'beans', tier: 'A', name: 'Beans and lentils', shortName: 'Beans', icon: 'bean', nutrient: 'Soluble fiber + plant protein', dinnersLabel: 'Dinners with beans and lentils',
    how: 'Their fiber traps bile acids like oats do. When beans stand in for some of the meat in a dish, it also has less saturated fat.',
    src: 'FDA authorized health claim, 21 CFR 101.77',
    foodsScreen: { how: 'Their fiber traps bile acids like oats do. And when beans stand in for some of the meat in a dish, it has less saturated fat, the fat most tied to higher LDL.', src: 'FDA authorized health claim, 21 CFR 101.77; Dietary Guidelines for Americans' } },
  { id: 'fruit', tier: 'A', name: 'Apples, pears and citrus', shortName: 'Citrus', icon: 'fruit', nutrient: 'Soluble fiber (pectin)', dinnersLabel: 'Dinners with apples, pears or citrus',
    how: 'Pectin forms a gel in your gut and traps bile acids the way oats do.',
    src: 'FDA authorized health claim, 21 CFR 101.77',
    foodsScreen: { how: 'Pectin, the fiber that makes jam set, forms the same kind of gel in your gut and traps bile acids the way oats do. Eat the peel where you can.', src: 'FDA authorized health claim, 21 CFR 101.77' } },
  { id: 'grains', tier: 'A', name: 'Whole grains', shortName: 'Whole grains', icon: 'grain', nutrient: 'Fiber', dinnersLabel: 'Dinners with whole grains',
    how: 'Swapping refined grains for whole grains adds fiber to dinners you already make.',
    src: 'FDA authorized health claim, 21 CFR 101.77',
    foodsScreen: { how: 'Swapping refined grains for whole grains adds fiber to the same dinners you already make, from grain bowls to stir-fries.', src: 'FDA authorized health claim, 21 CFR 101.77' } },
  { id: 'sterols', tier: 'A', name: 'Plant sterol-fortified foods', shortName: 'Sterols', icon: 'bottle', nutrient: 'Plant sterols and stanols', notDinner: true, dinnersLabel: '',
    how: "Sterols look like cholesterol and block some of it from being absorbed. The benefit depends on a daily amount from fortified spreads or drinks, so we don't build dinners around them. Ask your clinician whether they fit your plan.",
    src: 'FDA authorized health claim, 21 CFR 101.83' },
  { id: 'soy', tier: 'B', name: 'Tofu, edamame and tempeh', shortName: 'Tofu', icon: 'cube', nutrient: 'Plant protein', allergen: 'Soy', dinnersLabel: 'Dinners with soy',
    how: 'The biggest win is what soy replaces: meat and cheese with more saturated fat. Soy protein itself shows a small, direct effect on LDL.',
    src: 'Blanco Mejia et al., 2019 (meta-analysis of 46 trials)',
    foodsScreen: { how: 'The biggest win is what tofu replaces: meat and cheese with more saturated fat. Studies of soy protein itself show a small, direct effect on LDL too.', src: 'Blanco Mejia et al., 2019 (meta-analysis of 46 trials)' } },
  { id: 'oil', tier: 'B', name: 'Olive oil and avocado', shortName: 'Olive oil', icon: 'drop', nutrient: 'Unsaturated fats', dinnersLabel: 'Dinners with olive oil or avocado',
    how: 'Using them instead of butter swaps saturated fat for unsaturated fat, one of the best-studied ways to keep LDL in a healthy range.',
    src: 'FDA qualified health claim for oleic acid oils (2018)',
    foodsScreen: { how: 'Cooking with olive oil instead of butter, and adding avocado, swaps saturated fat for unsaturated fat. That swap is one of the best-studied ways to keep LDL in a healthy range.', src: 'FDA qualified health claim for oleic acid oils (2018); Dietary Guidelines for Americans' } },
  { id: 'nuts', tier: 'B', name: 'Walnuts and almonds', shortName: 'Nuts', icon: 'nut', nutrient: 'Unsaturated fats + fiber', allergen: 'Tree nuts', dinnersLabel: 'Dinners with walnuts or almonds',
    how: 'Nuts are part of the Portfolio diet and carry an FDA qualified health claim.',
    avoidHow: 'You avoid tree nuts, so your dinners use other fats instead.',
    src: 'FDA qualified health claim for nuts (2003); Portfolio diet trials' },
  { id: 'okra', tier: 'B', name: 'Okra and eggplant', shortName: 'Okra', icon: 'veg', nutrient: 'Gel-forming (viscous) fiber', dinnersLabel: 'Dinners with okra or eggplant',
    how: 'Sticky, gel-forming fiber in a vegetable, part of the Portfolio diet trials.',
    src: 'Portfolio diet trials, Chiavaroli et al., 2018',
    foodsScreen: { how: 'Okra and eggplant bring sticky, gel-forming fiber in a vegetable. They were part of the Portfolio diet trials that lowered LDL alongside other foods.', src: 'Portfolio diet trials, Chiavaroli et al., 2018' } },
  { id: 'seeds', tier: 'C', name: 'Pumpkin and sunflower seeds', shortName: 'Seeds', icon: 'seed', nutrient: 'Unsaturated fats + plant sterols', dinnersLabel: 'Dinners with seeds',
    how: 'Mostly unsaturated fats and small amounts of plant sterols. Research on seeds themselves is still limited.',
    src: 'Small clinical trials',
    foodsScreen: { how: 'Their fats are mostly unsaturated, which helps when they replace butter or fatty meat. They carry small amounts of plant sterols, which compete with cholesterol for absorption. The research on seeds themselves is still limited.', src: 'Small clinical trials; Portfolio diet framework, Chiavaroli et al., 2018' } },
  { id: 'garlic', tier: 'C', name: 'Garlic', shortName: 'Garlic', icon: 'clove', nutrient: 'Allium compounds', dinnersLabel: 'Dinners with garlic',
    how: 'Some studies show a small effect on cholesterol; others show none. We use it for flavor, not as an LDL food.',
    src: 'Mixed results across meta-analyses' },
];

export const foodById = (id: string) => FOODS.find((f) => f.id === id)!;

// The four slots on V2-7-Foods, each with its "Not a fan? Try …" alternative.
export const FOOD_SLOTS: { k: string; main: string; alt: string }[] = [
  { k: 'oats', main: 'oats', alt: 'fruit' },
  { k: 'beans', main: 'beans', alt: 'okra' },
  { k: 'seeds', main: 'seeds', alt: 'oil' },
  { k: 'tofu', main: 'soy', alt: 'grains' },
];

// Stroke paths for the food icons (24px viewBox), from the screens.
export const ICON_PATHS: Record<IconKey, string[]> = {
  grain: ['M12 22V8', 'M12 8c0-2.5 1.5-4.5 3.5-5c0 2.5-1.5 4.5-3.5 5z', 'M12 8c0-2.5-1.5-4.5-3.5-5c0 2.5 1.5 4.5 3.5 5z', 'M12 14c0-2.5 1.5-4.5 3.5-5c0 2.5-1.5 4.5-3.5 5z'],
  bean: ['M6 15c-2-2-2-6 1-7.5c2.5-1.2 4 .5 4 2.5c0 1.5 1.5 2 2.5 2.5c2 1 2 4-.5 5.5c-2.5 1.5-5 .5-7-3z', 'M15 6.5c1.5-1.5 4-1.5 5 .5s0 4-2 4.5'],
  seed: ['M8 4c2 2 2 5 0 7c-2-2-2-5 0-7z', 'M16 6c2 2 2 5 0 7c-2-2-2-5 0-7z', 'M11 13c2 2 2 5 0 7c-2-2-2-5 0-7z'],
  cube: ['M12 3l8 4.5v9L12 21l-8-4.5v-9z', 'M4 7.5l8 4.5l8-4.5', 'M12 12v9'],
  fruit: ['M12 7c-4-2-8 1-7 6c1 5 4 8 7 7c3 1 6-2 7-7c1-5-3-8-7-6z', 'M12 7c0-2 1-4 3-4'],
  veg: ['M15 5c3 1 5 4 3 8c-2 4-6 7-9 7c-3 0-4-3-2-6c2-3 3-5 4-7c1-2 2-2.5 4-2z', 'M15 5c0-1.5 1-2.5 2.5-3'],
  drop: ['M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z'],
  nut: ['M12 4c4 0 7 3 7 8s-3 8-7 8s-7-3-7-8s3-8 7-8z', 'M12 4v16'],
  bottle: ['M9 3h6', 'M10 3v4l-3 4v9h10v-9l-3-4V3'],
  clove: ['M12 3c-4 3-6 7-6 11a6 6 0 0 0 12 0c0-4-2-8-6-11z', 'M12 3v17'],
};
