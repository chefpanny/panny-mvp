import type { Allergen, DayKey, Diet } from '@/data/setupOptions';

export type SetupStep = 'goal' | 'avoid' | 'servings' | 'household' | 'kitchen' | 'nights';
export const SETUP_STEPS: { step: SetupStep; path: string }[] = [
  { step: 'goal', path: '/setup/goal' },
  { step: 'avoid', path: '/setup/avoid' },
  { step: 'servings', path: '/setup/servings' },
  { step: 'household', path: '/setup/household' },
  { step: 'kitchen', path: '/setup/kitchen' },
  { step: 'nights', path: '/setup/nights' },
];

export type Setup = {
  goalId: 'ldl';
  vote: string | null;
  voteOther: string;
  allergies: Allergen[];
  diet: Diet;
  servings: number;
  who: string[];
  needs: string[];
  wontTouch: string;
  pantryOff: string[];
  pantryExtra: string[];
  nights: DayKey[];
  send: string;
  remindTime: string;
  customTime: string;
  email: string;
};

export type SkipMode = 'keep' | 'drop';
export type PlanEntry = { id: string; recipeId: string; night: DayKey; skipped: SkipMode | null };
export type Plan = { inputsKey: string; entries: PlanEntry[] };

export type Checkin = { made: string; rating: string | null; again: string | null; at: string };
export type UsualDinner = { dish: string; whatsIn: string; link: string; keeps: string[]; at: string };

export type AppState = {
  v: 1;
  profileId: string;
  setup: Setup;
  done: Partial<Record<SetupStep, boolean>>;
  foodSwaps: Record<string, boolean>; // Foods-screen slot -> using the alternative
  plan: Plan | null;
  prevPlan: Plan | null; // one-level undo for swap/move/skip
  listChecked: Record<string, boolean>; // keyed by ingredient key
  servingsOverride: Record<string, number>; // recipeId -> servings
  saved: Record<string, boolean>;
  checkins: Record<string, Checkin>; // recipeId -> latest check-in
  usual: UsualDinner[];
  savedForNextWeek: string[]; // TODO(post-MVP): carry these into next week's plan
};
