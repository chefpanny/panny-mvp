'use client';
// App state: React context + useReducer, persisted to localStorage under one key.
import { createContext, useContext, useEffect, useReducer, useRef, useState, type Dispatch, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { reducer, setupComplete, firstUnfinishedStep, type Action } from './reducer';
import { freshState } from './defaults';
import { generatePlan, planInputsKey } from './plan';
import { track, EVENTS_KEY } from './analytics';
import type { AppState } from './types';

export const STATE_KEY = 'panny:v1';

type Ctx = { state: AppState; dispatch: Dispatch<Action>; hydrated: boolean };
const StoreContext = createContext<Ctx | null>(null);

function load(): AppState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.v !== 1) return null;
    return { ...freshState(), ...parsed, setup: { ...freshState().setup, ...parsed.setup } };
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, freshState);
  const [hydrated, setHydrated] = useState(false);
  const lastGenerated = useRef<string | null>(null);

  useEffect(() => {
    const stored = load();
    if (stored) {
      dispatch({ type: 'replace', state: stored });
    } else {
      const s = freshState();
      localStorage.setItem(STATE_KEY, JSON.stringify(s));
      dispatch({ type: 'replace', state: s });
      track('account_created', { type: 'anonymous', profile_id: s.profileId });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  // Keep the plan in step with setup: generate once setup is done, regenerate when its inputs change.
  useEffect(() => {
    if (!hydrated || !setupComplete(state)) return;
    const key = planInputsKey(state);
    if (state.plan?.inputsKey === key || lastGenerated.current === key) return;
    lastGenerated.current = key;
    const plan = generatePlan(state);
    dispatch({ type: 'setPlan', plan });
    track('plan_generated', {
      nights: plan.entries.map((e) => e.night),
      recipe_ids: plan.entries.map((e) => e.recipeId),
      servings: state.setup.servings,
      dinner_count: plan.entries.length,
    });
  }, [hydrated, state]);

  return <StoreContext.Provider value={{ state, dispatch, hydrated }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore outside StoreProvider');
  return ctx;
}

/** Redirects to the first unfinished setup step. Returns true once it is safe to render. */
export function useRequireSetup(): boolean {
  const { state, hydrated } = useStore();
  const router = useRouter();
  const next = firstUnfinishedStep(state);
  useEffect(() => {
    if (hydrated && next) router.replace(next.path);
  }, [hydrated, next, router]);
  return hydrated && !next;
}

export function resetAll() {
  localStorage.removeItem(STATE_KEY);
  localStorage.removeItem(EVENTS_KEY);
}

export function ScreenTracker() {
  const pathname = usePathname();
  const { hydrated } = useStore();
  useEffect(() => {
    if (hydrated) track('screen_viewed', { path: pathname });
  }, [pathname, hydrated]);
  return null;
}
