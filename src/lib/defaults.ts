import type { AppState, Setup } from './types';

export const defaultSetup = (): Setup => ({
  goalId: 'ldl',
  vote: null,
  voteOther: '',
  allergies: [],
  diet: 'Everything',
  servings: 4,
  who: [],
  needs: [],
  wontTouch: '',
  pantryOff: [],
  pantryExtra: [],
  nights: ['Mon', 'Tue', 'Thu'],
  send: 'Menu + nightly reminders',
  remindTime: '4:30 pm',
  customTime: '17:45',
  email: '',
});

const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);

export const freshState = (): AppState => ({
  v: 1,
  profileId: randomId(),
  setup: defaultSetup(),
  done: {},
  foodSwaps: {},
  plan: null,
  prevPlan: null,
  listChecked: {},
  servingsOverride: {},
  saved: {},
  checkins: {},
  usual: [],
  savedForNextWeek: [],
});
