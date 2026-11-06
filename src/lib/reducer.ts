import { SETUP_STEPS, type AppState, type Checkin, type Plan, type Setup, type SetupStep, type UsualDinner } from './types';

export type Action =
  | { type: 'replace'; state: AppState }
  | { type: 'setSetup'; patch: Partial<Setup> }
  | { type: 'markDone'; step: SetupStep }
  | { type: 'setFoodSwap'; slot: string; alt: boolean }
  | { type: 'setPlan'; plan: Plan } // fresh generation; no undo
  | { type: 'planChange'; plan: Plan } // swap / move / skip; undoable
  | { type: 'undoPlan' }
  | { type: 'setListItem'; key: string; checked: boolean }
  | { type: 'setServings'; recipeId: string; servings: number }
  | { type: 'toggleSaved'; recipeId: string }
  | { type: 'checkin'; recipeId: string; checkin: Checkin }
  | { type: 'submitUsual'; usual: UsualDinner }
  | { type: 'saveForNextWeek'; recipeId: string };

export function reducer(state: AppState, a: Action): AppState {
  switch (a.type) {
    case 'replace':
      return a.state;
    case 'setSetup':
      return { ...state, setup: { ...state.setup, ...a.patch } };
    case 'markDone':
      return { ...state, done: { ...state.done, [a.step]: true } };
    case 'setFoodSwap':
      return { ...state, foodSwaps: { ...state.foodSwaps, [a.slot]: a.alt } };
    case 'setPlan':
      return { ...state, plan: a.plan, prevPlan: null };
    case 'planChange':
      return { ...state, prevPlan: state.plan, plan: a.plan };
    case 'undoPlan':
      return state.prevPlan ? { ...state, plan: state.prevPlan, prevPlan: null } : state;
    case 'setListItem':
      return { ...state, listChecked: { ...state.listChecked, [a.key]: a.checked } };
    case 'setServings':
      return { ...state, servingsOverride: { ...state.servingsOverride, [a.recipeId]: a.servings } };
    case 'toggleSaved':
      return { ...state, saved: { ...state.saved, [a.recipeId]: !state.saved[a.recipeId] } };
    case 'checkin':
      return { ...state, checkins: { ...state.checkins, [a.recipeId]: a.checkin } };
    case 'submitUsual':
      return { ...state, usual: [...state.usual, a.usual] };
    case 'saveForNextWeek':
      return state.savedForNextWeek.includes(a.recipeId) ? state : { ...state, savedForNextWeek: [...state.savedForNextWeek, a.recipeId] };
  }
}

export const firstUnfinishedStep = (s: AppState) => SETUP_STEPS.find((x) => !s.done[x.step]) ?? null;
export const setupComplete = (s: AppState) => firstUnfinishedStep(s) === null;
