// SAMPLE DATA: option lists copied from the v2 setup screens' scripts.

export const ALLERGENS = ['Peanuts', 'Tree nuts', 'Soy', 'Dairy', 'Eggs', 'Wheat', 'Gluten', 'Fish', 'Shellfish', 'Sesame'] as const;
export type Allergen = (typeof ALLERGENS)[number];

export const DIETS = ['Everything', 'Vegetarian', 'Vegan', 'Pescatarian'] as const;
export type Diet = (typeof DIETS)[number];

export const SERVING_OPTIONS = [
  { n: 1, cap: 'Just me' },
  { n: 2, cap: 'Two of us' },
  { n: 4, cap: 'Family of four' },
  { n: 6, cap: 'Six or more' },
] as const;

export const WHO_OPTIONS = ['Just me', 'Partner', 'Kids', 'Teens', 'Parents'] as const;
export const NEED_OPTIONS = ['A picky eater', 'Someone wants meat most nights', 'Kids avoid spicy', 'We often eat different dinners'] as const;

export const PANTRY_STAPLES = ['Olive oil', 'Salt', 'Black pepper', 'Garlic', 'Onions', 'Rice', 'Oats', 'Pasta', 'Canned tomatoes', 'Vinegar', 'Red pepper flakes', 'Soy sauce'];

export const VOTE_OPTIONS = ['More fiber and gut health', 'Steady energy', 'Prediabetes / blood sugar balance'];

export const DAYS = [
  { key: 'Mon', name: 'Monday' },
  { key: 'Tue', name: 'Tuesday' },
  { key: 'Wed', name: 'Wednesday' },
  { key: 'Thu', name: 'Thursday' },
  { key: 'Fri', name: 'Friday' },
  { key: 'Sat', name: 'Saturday' },
  { key: 'Sun', name: 'Sunday' },
] as const;
export type DayKey = (typeof DAYS)[number]['key'];
export const dayName = (k: DayKey) => DAYS.find((d) => d.key === k)!.name;
export const dayIndex = (k: DayKey) => DAYS.findIndex((d) => d.key === k);

export const SEND_OPTIONS = ['Menu + nightly reminders', 'Weekly menu only', 'Nothing for now'] as const;
export const REMIND_TIMES = ['9 am', '4:30 pm', '5 pm', 'Custom'];

export const SWAP_REASONS = ['Not feeling it', 'Too long tonight', "Someone won't eat it", 'Had it recently'] as const;

export const USUAL_KEEPS = ['The cheese', 'The meat', 'The pasta shape', 'Surprise me'];

export const AISLE_ORDER = ['Produce', 'Meat and seafood', 'Refrigerated', 'Canned and dry', 'Bakery', 'Oils and spices'] as const;
export type Aisle = (typeof AISLE_ORDER)[number];
