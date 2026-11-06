'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, ButtonLink, ui } from '@/components/ui';
import { CloseIcon } from '@/components/Icons';
import { recipeById } from '@/data/recipes';
import { useStore } from '@/lib/store';
import { stepParts } from '@/lib/amounts';
import { recipeServings } from '@/lib/recipeView';
import s from './cook.module.css';

// Minimal cooking mode: one step at a time, same scaled amounts, wake lock. No timers in the MVP.
export default function CookingMode() {
  const { id } = useParams<{ id: string }>();
  const r = recipeById(id);
  const { state, hydrated } = useStore();
  const router = useRouter();
  const [i, setI] = useState(0);
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    let cancelled = false;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    const request = async () => {
      try {
        if (!nav.wakeLock) return;
        lock = await nav.wakeLock.request('screen');
        if (cancelled) lock.release(); else setAwake(true);
      } catch { setAwake(false); }
    };
    request();
    const onVis = () => document.visibilityState === 'visible' && request();
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelled = true; document.removeEventListener('visibilitychange', onVis); lock?.release().catch(() => {}); };
  }, []);

  if (!hydrated || !r) return null;
  const servings = recipeServings(state, r.id);
  const total = r.steps.length;
  const last = i === total - 1;

  return (
    <main className={s.screen} aria-label="Cooking mode">
      <div className={s.top}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{awake ? 'Cooking mode · Screen stays on' : 'Cooking mode'}</span>
        <Link href={`/recipe/${r.id}`} className={ui.iconBtn} aria-label="Exit cooking mode"><CloseIcon /></Link>
      </div>
      <div className={s.progress} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={i + 1} aria-label="Step progress">
        <div style={{ width: `${Math.round(((i + 1) / total) * 100)}%` }} />
      </div>
      <span className={s.count}>Step {i + 1} of {total}</span>
      <p className={s.step} aria-live="polite">
        {stepParts(r, r.steps[i], servings).map((p, k) => p.amount ? <span key={k} className={s.hl}>{p.text}</span> : <span key={k}>{p.text}</span>)}
      </p>
      <div style={{ flex: 1 }} />
      <div className={s.nav}>
        <Button variant="secondary" style={{ width: 120 }} onClick={() => (i === 0 ? router.push(`/recipe/${r.id}`) : setI(i - 1))}>Back</Button>
        {last
          ? <ButtonLink href={`/checkin/${r.id}`} className={s.grow}>I made it</ButtonLink>
          : <Button className={s.grow} onClick={() => setI(i + 1)}>Next step</Button>}
      </div>
    </main>
  );
}
