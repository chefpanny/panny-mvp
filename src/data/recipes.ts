// SAMPLE DATA. Recipes, creators, amounts and nutrition are hard-coded placeholders for user testing.
// The first six come from V2-7-Week; the rest exist so allergen and diet filters still leave choices.
// Nutrition is per serving and NOT calculated. TODO(post-MVP): real nutrition from USDA data.
import type { Aisle, Allergen } from './setupOptions';

export type Animal = 'meat' | 'poultry' | 'fish' | 'shellfish' | 'dairy' | 'egg';

export type Ingredient = {
  id: string; // unique within the recipe; steps reference it
  key: string; // shared across recipes so the list can sum the same item
  name: string;
  note: string;
  qty: number | null; // null = to taste
  unit: [string, string]; // singular, plural ('' for counted items)
  aisle: Aisle;
  stepName: string; // how a step names it after the amount
  allergens?: Allergen[];
  animal?: Animal;
  food?: string; // linked LDL food id
  pantry?: string[]; // pantry staple labels that cover this item
};

export type StepPart = string | { ing: string; bare?: boolean };

export type Recipe = {
  id: string;
  by: string; // creator handle
  creatorName: string; // sample name
  platform: 'Instagram' | 'YouTube' | 'TikTok';
  videoLength: string;
  title: string;
  minutes: number;
  servingsBasis: number;
  equipment: string;
  familiar: boolean;
  adapt?: string; // "Made LDL-friendly: …"
  filterTags: string[]; // mint filter pills, e.g. Kid-friendly
  spicy?: boolean;
  testKitchen: boolean;
  ingredients: Ingredient[];
  steps: StepPart[][];
  nutrition: { fiberG: number; solubleG?: number; proteinG: number; satFatG: number; sodiumMg: number };
  nutrientNotes?: { fiber?: string; protein?: string; satFat?: string; sodium?: string };
  fitLine: string; // one line on the recipe page; names the foods, makes no outcome claim
};

const U = (s: string, p?: string): [string, string] => [s, p ?? s];
const NONE: [string, string] = ['', ''];

// Reusable ingredient shapes. Spread and override qty/note per recipe.
const I = {
  oil: (qty: number, note = 'Pantry staple'): Ingredient => ({ id: 'oil', key: 'olive-oil', name: 'Olive oil', note, qty, unit: U('tbsp'), aisle: 'Oils and spices', stepName: 'olive oil', food: 'oil', pantry: ['Olive oil'] }),
  garlic: (qty: number): Ingredient => ({ id: 'garlic', key: 'garlic', name: 'Garlic', note: 'Thinly sliced', qty, unit: U('clove', 'cloves'), aisle: 'Produce', stepName: 'garlic', pantry: ['Garlic'] }),
  onion: (qty: number): Ingredient => ({ id: 'onion', key: 'yellow-onion', name: 'Yellow onion', note: 'Diced', qty, unit: NONE, aisle: 'Produce', stepName: 'yellow onion', pantry: ['Onions'] }),
  saltPepper: (): Ingredient => ({ id: 'salt', key: 'salt-pepper', name: 'Salt and black pepper', note: 'Pantry staple', qty: null, unit: NONE, aisle: 'Oils and spices', stepName: 'salt and pepper', pantry: ['Salt', 'Black pepper'] }),
  blackBeans: (qty: number): Ingredient => ({ id: 'blackbeans', key: 'black-beans', name: 'Black beans', note: 'Drained and rinsed', qty, unit: U('can (15 oz)', 'cans (15 oz)'), aisle: 'Canned and dry', stepName: 'black beans', food: 'beans' }),
  lime: (qty: number): Ingredient => ({ id: 'lime', key: 'lime', name: 'Limes', note: 'Juiced', qty, unit: NONE, aisle: 'Produce', stepName: 'limes' }),
  tortillas: (qty: number): Ingredient => ({ id: 'tortillas', key: 'corn-tortillas', name: 'Corn tortillas', note: 'Warmed', qty, unit: NONE, aisle: 'Bakery', stepName: 'corn tortillas', food: 'grains' }),
  crushedTomatoes: (qty: number): Ingredient => ({ id: 'tomatoes', key: 'crushed-tomatoes', name: 'Crushed tomatoes', note: 'No salt added if you can', qty, unit: U('can (28 oz)', 'cans (28 oz)'), aisle: 'Canned and dry', stepName: 'crushed tomatoes', pantry: ['Canned tomatoes'] }),
  parm: (qty: number): Ingredient => ({ id: 'parm', key: 'parmesan', name: 'Parmesan', note: 'Optional, grated', qty, unit: U('cup', 'cups'), aisle: 'Refrigerated', stepName: 'Parmesan', allergens: ['Dairy'], animal: 'dairy' }),
  broth: (qty: number): Ingredient => ({ id: 'broth', key: 'vegetable-broth', name: 'Vegetable broth', note: 'Low sodium if you have it', qty, unit: U('cup', 'cups'), aisle: 'Canned and dry', stepName: 'vegetable broth' }),
  chili: (qty: number, unit: 'tsp' | 'tbsp' = 'tsp'): Ingredient => ({ id: 'chili', key: 'chili-powder', name: 'Chili powder', note: 'Spice aisle', qty, unit: U(unit), aisle: 'Oils and spices', stepName: 'chili powder' }),
  soy: (qty: number): Ingredient => ({ id: 'soysauce', key: 'soy-sauce', name: 'Low-sodium soy sauce', note: 'Pantry staple', qty, unit: U('tbsp'), aisle: 'Oils and spices', stepName: 'low-sodium soy sauce', allergens: ['Soy', 'Wheat', 'Gluten'], pantry: ['Soy sauce'] }),
};

export const RECIPES: Recipe[] = [
  {
    id: 'white-bean-kale-skillet', by: '@creatorhandle', creatorName: 'Rosa Lin', platform: 'Instagram', videoLength: '0:58',
    title: 'Lemony White Bean & Kale Skillet', minutes: 25, servingsBasis: 2, equipment: '1 skillet', familiar: false, filterTags: [], testKitchen: true,
    ingredients: [
      { id: 'beans', key: 'cannellini-beans', name: 'Cannellini beans', note: 'Drained and rinsed', qty: 1, unit: U('can (15 oz)', 'cans (15 oz)'), aisle: 'Canned and dry', stepName: 'cannellini beans', food: 'beans' },
      { id: 'kale', key: 'lacinato-kale', name: 'Lacinato kale', note: 'Stems removed, torn', qty: 1, unit: U('bunch', 'bunches'), aisle: 'Produce', stepName: 'lacinato kale' },
      { id: 'lemon', key: 'lemon', name: 'Lemon', note: 'Zest and juice', qty: 1, unit: U('lemon', 'lemons'), aisle: 'Produce', stepName: 'lemon' },
      I.garlic(3),
      I.oil(2),
      I.broth(0.5),
      { id: 'flakes', key: 'red-pepper-flakes', name: 'Red pepper flakes', note: 'Optional heat', qty: 0.25, unit: U('tsp'), aisle: 'Oils and spices', stepName: 'red pepper flakes', pantry: ['Red pepper flakes'] },
      I.parm(0.25),
      { id: 'bread', key: 'whole-grain-bread', name: 'Whole-grain bread', note: 'For serving', qty: 2, unit: U('slice', 'slices'), aisle: 'Bakery', stepName: 'whole-grain bread', allergens: ['Wheat', 'Gluten'], food: 'grains' },
      I.saltPepper(),
    ],
    steps: [
      ['Warm ', { ing: 'oil' }, ' in a large skillet over medium heat. Add ', { ing: 'garlic' }, ', sliced, and ', { ing: 'flakes' }, '. Stir until fragrant, about 1 minute.'],
      ['Add ', { ing: 'beans' }, ' and ', { ing: 'broth' }, '. Simmer 4 to 5 minutes, pressing a few beans into the pan to thicken the sauce.'],
      ['Stir in ', { ing: 'kale' }, ', a handful at a time, until it wilts, about 3 minutes.'],
      ['Off the heat, add the zest and juice of ', { ing: 'lemon', bare: true }, '. Season with salt and pepper. Top with ', { ing: 'parm' }, ' and serve with ', { ing: 'bread' }, ', toasted.'],
    ],
    nutrition: { fiberG: 12, solubleG: 3, proteinG: 16, satFatG: 3, sodiumMg: 480 },
    nutrientNotes: { fiber: 'incl. 3 g soluble', protein: 'all plant-based', satFat: 'keep this low', sodium: 'low-sodium broth' },
    fitLine: 'White beans bring gel-forming soluble fiber. Olive oil keeps saturated fat low.',
  },
  {
    id: 'turkey-lentil-bolognese', by: '@creatortwo', creatorName: 'Dev Patel', platform: 'YouTube', videoLength: '1:12',
    title: 'Turkey & Lentil Bolognese', minutes: 30, servingsBasis: 4, equipment: '1 pot', familiar: true, filterTags: ['Kid-friendly'], testKitchen: true,
    adapt: 'half lean turkey, half lentils, whole-wheat spaghetti, Parmesan on the side.',
    ingredients: [
      { id: 'turkey', key: 'ground-turkey', name: 'Lean ground turkey (93%)', note: 'Or 99% lean', qty: 8, unit: U('oz'), aisle: 'Meat and seafood', stepName: 'lean ground turkey', animal: 'poultry' },
      { id: 'lentils', key: 'brown-lentils', name: 'Brown lentils', note: 'Rinsed', qty: 0.5, unit: U('cup dry', 'cups dry'), aisle: 'Canned and dry', stepName: 'brown lentils', food: 'beans' },
      { id: 'pasta', key: 'ww-spaghetti', name: 'Whole-wheat spaghetti', note: 'Or any whole-wheat pasta', qty: 8, unit: U('oz'), aisle: 'Canned and dry', stepName: 'whole-wheat spaghetti', allergens: ['Wheat', 'Gluten'], food: 'grains' },
      I.crushedTomatoes(1),
      I.onion(1),
      I.garlic(3),
      I.oil(1),
      I.parm(0.25),
      I.saltPepper(),
    ],
    steps: [
      ['Warm ', { ing: 'oil' }, ' in a large pot. Cook ', { ing: 'onion' }, ' and ', { ing: 'garlic' }, ' until soft, about 5 minutes.'],
      ['Add ', { ing: 'turkey' }, ' and break it up until no longer pink. Stir in ', { ing: 'lentils' }, ', ', { ing: 'tomatoes' }, ' and 2 cups water.'],
      ['Simmer 20 minutes, until the lentils are tender. Meanwhile, cook ', { ing: 'pasta' }, ' as the package says.'],
      ['Season with salt and pepper. Serve the sauce over the pasta with ', { ing: 'parm' }, ' on the side.'],
    ],
    nutrition: { fiberG: 13, solubleG: 3, proteinG: 32, satFatG: 3, sodiumMg: 520 },
    nutrientNotes: { fiber: 'incl. 3 g soluble', satFat: 'keep this low' },
    fitLine: 'Lentils bring soluble fiber and stand in for half the meat. Whole-wheat pasta adds more.',
  },
  {
    id: 'black-bean-sweet-potato-tacos', by: '@creatorthree', creatorName: 'Ana Ruiz', platform: 'TikTok', videoLength: '0:45',
    title: 'Black Bean & Sweet Potato Tacos', minutes: 25, servingsBasis: 4, equipment: '1 sheet pan', familiar: false, filterTags: [], testKitchen: true,
    ingredients: [
      { id: 'potato', key: 'sweet-potato', name: 'Sweet potatoes', note: 'Cut in ½-inch cubes', qty: 2, unit: U('medium'), aisle: 'Produce', stepName: 'sweet potatoes' },
      I.blackBeans(1),
      I.lime(2),
      I.tortillas(8),
      { id: 'seeds', key: 'pumpkin-seeds', name: 'Pumpkin seeds', note: 'Toasted', qty: 0.25, unit: U('cup', 'cups'), aisle: 'Canned and dry', stepName: 'pumpkin seeds', food: 'seeds' },
      I.oil(1),
      I.chili(2),
      I.saltPepper(),
    ],
    steps: [
      ['Heat the oven to 425°F. Toss ', { ing: 'potato' }, ' with ', { ing: 'oil' }, ' and ', { ing: 'chili' }, '. Roast 18 minutes.'],
      ['Add ', { ing: 'blackbeans' }, ' to the pan for the last 5 minutes.'],
      ['Squeeze ', { ing: 'lime' }, ' over everything and season with salt and pepper.'],
      ['Fill ', { ing: 'tortillas' }, ' and top with ', { ing: 'seeds' }, '.'],
    ],
    nutrition: { fiberG: 14, solubleG: 4, proteinG: 15, satFatG: 2, sodiumMg: 410 },
    nutrientNotes: { fiber: 'incl. 4 g soluble', protein: 'all plant-based', satFat: 'keep this low' },
    fitLine: 'Black beans bring soluble fiber. Olive oil and pumpkin seeds keep the fats mostly unsaturated.',
  },
  {
    id: 'sheet-pan-chicken-fajitas', by: '@sheetpancreator', creatorName: 'Jo Okafor', platform: 'Instagram', videoLength: '0:52',
    title: 'Sheet-Pan Chicken Fajitas & Black Beans', minutes: 25, servingsBasis: 4, equipment: '1 sheet pan', familiar: true, filterTags: [], testKitchen: true,
    adapt: 'skinless chicken breast, black beans in the mix, olive oil, no sour cream.',
    ingredients: [
      { id: 'chicken', key: 'chicken-breast', name: 'Skinless chicken breast', note: 'Sliced thin', qty: 1, unit: U('lb'), aisle: 'Meat and seafood', stepName: 'skinless chicken breast', animal: 'poultry' },
      { id: 'peppers', key: 'bell-pepper', name: 'Bell peppers', note: 'Sliced', qty: 3, unit: NONE, aisle: 'Produce', stepName: 'bell peppers' },
      I.onion(1),
      I.blackBeans(1),
      I.oil(2),
      I.chili(2),
      I.tortillas(8),
      I.lime(1),
    ],
    steps: [
      ['Heat the oven to 425°F. Toss ', { ing: 'chicken' }, ', ', { ing: 'peppers' }, ' and ', { ing: 'onion' }, ' with ', { ing: 'oil' }, ' and ', { ing: 'chili' }, '.'],
      ['Spread on a sheet pan and roast 15 minutes. Add ', { ing: 'blackbeans' }, ' and roast 5 minutes more.'],
      ['Squeeze ', { ing: 'lime' }, ' over the pan and serve in ', { ing: 'tortillas' }, '.'],
    ],
    nutrition: { fiberG: 11, proteinG: 34, satFatG: 2, sodiumMg: 560 },
    nutrientNotes: { satFat: 'keep this low' },
    fitLine: 'Black beans bring soluble fiber. Olive oil and skinless chicken keep saturated fat low.',
  },
  {
    id: 'smoky-black-bean-soup', by: '@soupcreator', creatorName: 'Mei Tan', platform: 'YouTube', videoLength: '1:05',
    title: 'Smoky Black Bean Soup', minutes: 20, servingsBasis: 4, equipment: '1 pot', familiar: false, filterTags: [], testKitchen: true,
    ingredients: [
      I.blackBeans(2),
      I.broth(3),
      I.crushedTomatoes(1),
      I.onion(1),
      I.garlic(3),
      { id: 'paprika', key: 'smoked-paprika', name: 'Smoked paprika', note: 'Spice aisle', qty: 1, unit: U('tsp'), aisle: 'Oils and spices', stepName: 'smoked paprika' },
      I.oil(1),
      I.lime(1),
      I.saltPepper(),
    ],
    steps: [
      ['Warm ', { ing: 'oil' }, ' in a pot. Cook ', { ing: 'onion' }, ' and ', { ing: 'garlic' }, ' for 5 minutes. Stir in ', { ing: 'paprika' }, '.'],
      ['Add ', { ing: 'blackbeans' }, ', ', { ing: 'broth' }, ' and ', { ing: 'tomatoes' }, '. Simmer 10 minutes.'],
      ['Blend half the soup and stir it back in. Finish with ', { ing: 'lime' }, ' and season with salt and pepper.'],
    ],
    nutrition: { fiberG: 15, solubleG: 4, proteinG: 14, satFatG: 1, sodiumMg: 590 },
    nutrientNotes: { fiber: 'incl. 4 g soluble', protein: 'all plant-based', satFat: 'keep this low' },
    fitLine: 'Black beans bring soluble fiber. Olive oil keeps saturated fat low.',
  },
  {
    id: 'salmon-farro-bowls', by: '@saladcreator', creatorName: 'Lena Berg', platform: 'Instagram', videoLength: '0:49',
    title: 'Salmon & Farro Bowls', minutes: 30, servingsBasis: 4, equipment: '1 pot, 1 pan', familiar: false, filterTags: [], testKitchen: true,
    ingredients: [
      { id: 'salmon', key: 'salmon', name: 'Salmon fillets', note: 'Skin on or off', qty: 1, unit: U('lb'), aisle: 'Meat and seafood', stepName: 'salmon', allergens: ['Fish'], animal: 'fish' },
      { id: 'farro', key: 'farro', name: 'Farro', note: 'Rinsed', qty: 1, unit: U('cup', 'cups'), aisle: 'Canned and dry', stepName: 'farro', allergens: ['Wheat', 'Gluten'], food: 'grains' },
      { id: 'cucumber', key: 'cucumber', name: 'Cucumber', note: 'Diced', qty: 1, unit: NONE, aisle: 'Produce', stepName: 'cucumber' },
      { id: 'cherry', key: 'cherry-tomatoes', name: 'Cherry tomatoes', note: 'Halved', qty: 1, unit: U('pint', 'pints'), aisle: 'Produce', stepName: 'cherry tomatoes' },
      { id: 'spinach', key: 'spinach', name: 'Baby spinach', note: 'Washed', qty: 4, unit: U('cup', 'cups'), aisle: 'Produce', stepName: 'baby spinach' },
      { id: 'lemon', key: 'lemon', name: 'Lemon', note: 'Juiced', qty: 1, unit: U('lemon', 'lemons'), aisle: 'Produce', stepName: 'lemon' },
      I.oil(2),
      I.saltPepper(),
    ],
    steps: [
      ['Simmer ', { ing: 'farro' }, ' in salted water until tender, about 25 minutes. Drain.'],
      ['Rub ', { ing: 'salmon' }, ' with 1 tbsp of the ', { ing: 'oil' }, ' and roast at 425°F for 12 minutes.'],
      ['Whisk the rest of the oil with the juice of ', { ing: 'lemon', bare: true }, '. Toss with ', { ing: 'spinach' }, ', ', { ing: 'cucumber' }, ' and ', { ing: 'cherry' }, '.'],
      ['Build bowls with the farro, greens and flaked salmon. Season with salt and pepper.'],
    ],
    nutrition: { fiberG: 9, proteinG: 30, satFatG: 2, sodiumMg: 450 },
    nutrientNotes: { satFat: 'keep this low' },
    fitLine: 'Farro brings whole-grain fiber. Olive oil keeps saturated fat low.',
  },
  {
    id: 'beef-bean-chili', by: '@chilicreator', creatorName: 'Marcus Hale', platform: 'YouTube', videoLength: '1:20',
    title: 'Half-and-Half Beef & Bean Chili', minutes: 35, servingsBasis: 4, equipment: '1 pot', familiar: true, filterTags: [], spicy: true, testKitchen: true,
    adapt: 'half extra-lean beef, half kidney beans, avocado on top instead of cheese.',
    ingredients: [
      { id: 'beef', key: 'lean-beef', name: 'Extra-lean ground beef (95%)', note: 'Or lean turkey', qty: 8, unit: U('oz'), aisle: 'Meat and seafood', stepName: 'extra-lean ground beef', animal: 'meat' },
      { id: 'kidney', key: 'kidney-beans', name: 'Kidney beans', note: 'Drained and rinsed', qty: 2, unit: U('can (15 oz)', 'cans (15 oz)'), aisle: 'Canned and dry', stepName: 'kidney beans', food: 'beans' },
      I.crushedTomatoes(1),
      I.onion(1),
      I.garlic(3),
      I.chili(2, 'tbsp'),
      { id: 'avocado', key: 'avocado', name: 'Avocado', note: 'Sliced, for topping', qty: 1, unit: NONE, aisle: 'Produce', stepName: 'avocado', food: 'oil' },
      I.oil(1),
      I.saltPepper(),
    ],
    steps: [
      ['Warm ', { ing: 'oil' }, ' in a pot. Brown ', { ing: 'beef' }, ' with ', { ing: 'onion' }, ' and ', { ing: 'garlic' }, '.'],
      ['Stir in ', { ing: 'chili' }, ', ', { ing: 'kidney' }, ' and ', { ing: 'tomatoes' }, '. Simmer 25 minutes.'],
      ['Season with salt and pepper and top each bowl with ', { ing: 'avocado' }, '.'],
    ],
    nutrition: { fiberG: 12, solubleG: 3, proteinG: 30, satFatG: 3.5, sodiumMg: 640 },
    nutrientNotes: { fiber: 'incl. 3 g soluble', satFat: 'keep this low' },
    fitLine: 'Kidney beans bring soluble fiber and stand in for half the beef. Avocado tops it instead of cheese.',
  },
  {
    id: 'chicken-edamame-stir-fry', by: '@stirfrycreator', creatorName: 'Kim Vo', platform: 'TikTok', videoLength: '0:40',
    title: 'Chicken & Edamame Stir-Fry with Brown Rice', minutes: 25, servingsBasis: 4, equipment: '1 wok', familiar: true, filterTags: ['Kid-friendly'], testKitchen: true,
    adapt: 'skinless chicken breast, brown rice instead of white, edamame in the mix, low-sodium soy sauce.',
    ingredients: [
      { id: 'chicken', key: 'chicken-breast', name: 'Skinless chicken breast', note: 'Cut in bite-size pieces', qty: 1, unit: U('lb'), aisle: 'Meat and seafood', stepName: 'skinless chicken breast', animal: 'poultry' },
      { id: 'edamame', key: 'edamame', name: 'Shelled edamame', note: 'Frozen is fine', qty: 1.5, unit: U('cup', 'cups'), aisle: 'Refrigerated', stepName: 'shelled edamame', allergens: ['Soy'], food: 'soy' },
      { id: 'rice', key: 'brown-rice', name: 'Brown rice', note: 'Uncooked', qty: 1, unit: U('cup', 'cups'), aisle: 'Canned and dry', stepName: 'brown rice', food: 'grains', pantry: ['Rice'] },
      { id: 'broccoli', key: 'broccoli', name: 'Broccoli', note: 'Cut in florets', qty: 1, unit: U('head', 'heads'), aisle: 'Produce', stepName: 'broccoli' },
      I.soy(3),
      I.garlic(2),
      I.oil(1),
    ],
    steps: [
      ['Cook ', { ing: 'rice' }, ' as the package says.'],
      ['Warm ', { ing: 'oil' }, ' in a wok. Stir-fry ', { ing: 'chicken' }, ' until cooked through, about 6 minutes.'],
      ['Add ', { ing: 'garlic' }, ', ', { ing: 'broccoli' }, ' and ', { ing: 'edamame' }, '. Cook 4 minutes.'],
      ['Toss with ', { ing: 'soysauce' }, ' and serve over the rice.'],
    ],
    nutrition: { fiberG: 7, proteinG: 33, satFatG: 2, sodiumMg: 690 },
    nutrientNotes: { satFat: 'keep this low', sodium: 'low-sodium soy sauce' },
    fitLine: 'Edamame and brown rice bring fiber and plant protein. Olive oil keeps saturated fat low.',
  },
  {
    id: 'oat-crusted-chicken-tenders', by: '@familytablecreator', creatorName: 'Priya Shah', platform: 'Instagram', videoLength: '0:55',
    title: 'Oat-Crusted Chicken Tenders & Crunchy Slaw', minutes: 30, servingsBasis: 4, equipment: '1 sheet pan', familiar: true, filterTags: ['Kid-friendly'], testKitchen: true,
    adapt: 'oat and whole-wheat crumb crust, baked not fried, yogurt-lemon dip instead of ranch.',
    ingredients: [
      { id: 'chicken', key: 'chicken-breast', name: 'Skinless chicken breast', note: 'Cut in strips', qty: 1, unit: U('lb'), aisle: 'Meat and seafood', stepName: 'skinless chicken breast', animal: 'poultry' },
      { id: 'oats', key: 'rolled-oats', name: 'Rolled oats', note: 'Pulsed to crumbs', qty: 1, unit: U('cup', 'cups'), aisle: 'Canned and dry', stepName: 'rolled oats', food: 'oats', pantry: ['Oats'] },
      { id: 'crumbs', key: 'ww-breadcrumbs', name: 'Whole-wheat breadcrumbs', note: 'Panko style', qty: 0.5, unit: U('cup', 'cups'), aisle: 'Bakery', stepName: 'whole-wheat breadcrumbs', allergens: ['Wheat', 'Gluten'], food: 'grains' },
      { id: 'egg', key: 'eggs', name: 'Eggs', note: 'Beaten', qty: 2, unit: NONE, aisle: 'Refrigerated', stepName: 'eggs', allergens: ['Eggs'], animal: 'egg' },
      { id: 'yogurt', key: 'greek-yogurt', name: 'Nonfat Greek yogurt', note: 'For the dip', qty: 0.75, unit: U('cup', 'cups'), aisle: 'Refrigerated', stepName: 'nonfat Greek yogurt', allergens: ['Dairy'], animal: 'dairy' },
      { id: 'slaw', key: 'slaw-mix', name: 'Coleslaw mix', note: 'Bagged', qty: 1, unit: U('bag (14 oz)', 'bags (14 oz)'), aisle: 'Produce', stepName: 'coleslaw mix' },
      { id: 'lemon', key: 'lemon', name: 'Lemon', note: 'Juiced', qty: 1, unit: U('lemon', 'lemons'), aisle: 'Produce', stepName: 'lemon' },
      I.oil(2),
      I.saltPepper(),
    ],
    steps: [
      ['Heat the oven to 425°F. Mix ', { ing: 'oats' }, ' and ', { ing: 'crumbs' }, ' on a plate.'],
      ['Dip ', { ing: 'chicken' }, ' in ', { ing: 'egg' }, ', then press into the crumbs. Lay on a sheet pan and drizzle with 1 tbsp of the ', { ing: 'oil' }, '.'],
      ['Bake 18 minutes, flipping once. Toss ', { ing: 'slaw' }, ' with the rest of the oil, half the lemon juice, salt and pepper.'],
      ['Stir the rest of the juice of ', { ing: 'lemon', bare: true }, ' into ', { ing: 'yogurt' }, ' for dipping.'],
    ],
    nutrition: { fiberG: 6, solubleG: 2, proteinG: 32, satFatG: 2.5, sodiumMg: 430 },
    nutrientNotes: { fiber: 'incl. 2 g soluble', satFat: 'keep this low' },
    fitLine: 'Oats in the crust bring beta-glucan fiber. Baking with olive oil keeps saturated fat low.',
  },
  {
    id: 'crispy-tofu-noodle-bowls', by: '@noodlecreator', creatorName: 'Hana Mori', platform: 'TikTok', videoLength: '0:38',
    title: 'Crispy Tofu & Edamame Noodle Bowls', minutes: 25, servingsBasis: 4, equipment: '1 pan, 1 pot', familiar: false, filterTags: [], testKitchen: false,
    ingredients: [
      { id: 'tofu', key: 'tofu', name: 'Extra-firm tofu', note: 'Pressed and cubed', qty: 14, unit: U('oz'), aisle: 'Refrigerated', stepName: 'extra-firm tofu', allergens: ['Soy'], food: 'soy' },
      { id: 'edamame', key: 'edamame', name: 'Shelled edamame', note: 'Frozen is fine', qty: 1, unit: U('cup', 'cups'), aisle: 'Refrigerated', stepName: 'shelled edamame', allergens: ['Soy'], food: 'soy' },
      { id: 'noodles', key: 'ww-noodles', name: 'Whole-wheat noodles', note: 'Or soba', qty: 8, unit: U('oz'), aisle: 'Canned and dry', stepName: 'whole-wheat noodles', allergens: ['Wheat', 'Gluten'], food: 'grains' },
      { id: 'carrots', key: 'carrot', name: 'Carrots', note: 'Shredded', qty: 2, unit: NONE, aisle: 'Produce', stepName: 'carrots' },
      I.soy(3),
      I.oil(2),
      I.lime(1),
    ],
    steps: [
      ['Cook ', { ing: 'noodles' }, ' with ', { ing: 'edamame' }, ' in the last 3 minutes. Drain.'],
      ['Warm ', { ing: 'oil' }, ' in a pan and crisp ', { ing: 'tofu' }, ', about 8 minutes.'],
      ['Toss everything with ', { ing: 'carrots' }, ', ', { ing: 'soysauce' }, ' and ', { ing: 'lime' }, '.'],
    ],
    nutrition: { fiberG: 8, proteinG: 24, satFatG: 2, sodiumMg: 620 },
    nutrientNotes: { protein: 'all plant-based', satFat: 'keep this low' },
    fitLine: 'Tofu and edamame stand in for meat. Whole-wheat noodles bring fiber.',
  },
  {
    id: 'walnut-lentil-stuffed-peppers', by: '@veggiecreator', creatorName: 'Sam Reyes', platform: 'Instagram', videoLength: '1:02',
    title: 'Walnut & Lentil Stuffed Peppers', minutes: 40, servingsBasis: 4, equipment: '1 baking dish', familiar: false, filterTags: [], testKitchen: false,
    ingredients: [
      { id: 'peppers', key: 'bell-pepper', name: 'Bell peppers', note: 'Halved, seeds out', qty: 4, unit: NONE, aisle: 'Produce', stepName: 'bell peppers' },
      { id: 'lentils', key: 'brown-lentils', name: 'Brown lentils', note: 'Rinsed', qty: 0.75, unit: U('cup dry', 'cups dry'), aisle: 'Canned and dry', stepName: 'brown lentils', food: 'beans' },
      { id: 'walnuts', key: 'walnuts', name: 'Walnuts', note: 'Chopped', qty: 0.5, unit: U('cup', 'cups'), aisle: 'Canned and dry', stepName: 'walnuts', allergens: ['Tree nuts'], food: 'nuts' },
      I.crushedTomatoes(1),
      I.onion(1),
      I.oil(1),
      I.saltPepper(),
    ],
    steps: [
      ['Simmer ', { ing: 'lentils' }, ' in water until tender, about 20 minutes. Drain.'],
      ['Warm ', { ing: 'oil' }, ' and cook ', { ing: 'onion' }, '. Stir in the lentils, ', { ing: 'walnuts' }, ' and half of ', { ing: 'tomatoes' }, '.'],
      ['Fill ', { ing: 'peppers' }, ', spoon the rest of the tomatoes around them and bake at 400°F for 20 minutes. Season with salt and pepper.'],
    ],
    nutrition: { fiberG: 11, solubleG: 3, proteinG: 16, satFatG: 2, sodiumMg: 380 },
    nutrientNotes: { fiber: 'incl. 3 g soluble', protein: 'all plant-based', satFat: 'keep this low' },
    fitLine: 'Lentils bring soluble fiber. Walnuts and olive oil keep the fats mostly unsaturated.',
  },
  {
    // Deliberately FAILS meetsGoalBar (high saturated fat, low fiber, no A/B food) to exercise the filter.
    id: 'four-cheese-mac', by: '@comfortcreator', creatorName: 'Ty Brooks', platform: 'YouTube', videoLength: '1:30',
    title: 'Creamy Four-Cheese Mac', minutes: 30, servingsBasis: 4, equipment: '1 pot', familiar: true, filterTags: ['Kid-friendly'], testKitchen: false,
    ingredients: [
      { id: 'macaroni', key: 'macaroni', name: 'Elbow macaroni', note: '', qty: 12, unit: U('oz'), aisle: 'Canned and dry', stepName: 'elbow macaroni', allergens: ['Wheat', 'Gluten'] },
      { id: 'cheddar', key: 'cheddar', name: 'Sharp cheddar', note: 'Grated', qty: 2, unit: U('cup', 'cups'), aisle: 'Refrigerated', stepName: 'sharp cheddar', allergens: ['Dairy'], animal: 'dairy' },
      { id: 'butter', key: 'butter', name: 'Butter', note: '', qty: 4, unit: U('tbsp'), aisle: 'Refrigerated', stepName: 'butter', allergens: ['Dairy'], animal: 'dairy' },
      { id: 'cream', key: 'heavy-cream', name: 'Heavy cream', note: '', qty: 1, unit: U('cup', 'cups'), aisle: 'Refrigerated', stepName: 'heavy cream', allergens: ['Dairy'], animal: 'dairy' },
    ],
    steps: [
      ['Cook ', { ing: 'macaroni' }, '. Drain.'],
      ['Melt ', { ing: 'butter' }, ', add ', { ing: 'cream' }, ' and stir in ', { ing: 'cheddar' }, ' until smooth. Toss with the pasta.'],
    ],
    nutrition: { fiberG: 3, proteinG: 24, satFatG: 22, sodiumMg: 780 },
    fitLine: '',
  },
];

export const recipeById = (id: string): Recipe | undefined => RECIPES.find((r) => r.id === id);
