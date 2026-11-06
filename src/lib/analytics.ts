// Analytics stub: console + a capped list in localStorage. No vendor.
// TODO(post-MVP): send to a real analytics pipeline.
import { GOAL } from '@/data/goal';
import { recipeById } from '@/data/recipes';
import { meetsGoalBar } from './goalBar';

export const EVENTS_KEY = 'panny:events';
const CAP = 500;

export type PrdEvent =
  | 'account_created' | 'household_profile_set' | 'plan_generated' | 'ldl_food_opened' | 'how_it_works_viewed'
  | 'food_library_viewed' | 'dinner_swapped' | 'dinner_moved' | 'dinner_skipped' | 'usual_dinner_submitted'
  | 'recipe_card_flipped' | 'list_copied' | 'checkin_household';
// Added beyond the PRD list (reported in the build summary).
export type ExtraEvent = 'screen_viewed' | 'recipe_opened' | 'cooking_started' | 'list_item_checked' | 'week_change_undone' | 'ldl_food_swapped';
export type EventName = PrdEvent | ExtraEvent;

export type LoggedEvent = { event: EventName; props: Record<string, unknown>; at: string };

export function track(event: EventName, props: Record<string, unknown> = {}): void {
  const full: Record<string, unknown> = { goal_id: GOAL.goal_id, ...props };
  if (typeof full.recipe_id === 'string' && full.meets_goal_bar === undefined) {
    const r = recipeById(full.recipe_id);
    full.meets_goal_bar = r ? meetsGoalBar(r) : false;
  }
  const entry: LoggedEvent = { event, props: full, at: new Date().toISOString() };
  console.log('[track]', event, full);
  try {
    const list: LoggedEvent[] = JSON.parse(localStorage.getItem(EVENTS_KEY) ?? '[]');
    list.push(entry);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(list.slice(-CAP)));
  } catch {
    // storage unavailable; console only
  }
}

export function readEvents(): LoggedEvent[] {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) ?? '[]');
  } catch {
    return [];
  }
}
