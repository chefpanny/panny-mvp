'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, ButtonLink, cx, ui } from '@/components/ui';
import { CloseIcon } from '@/components/Icons';
import Link from 'next/link';
import { recipeById } from '@/data/recipes';
import { dayIndex, dayName } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import { liveEntries } from '@/lib/plan';
import { track } from '@/lib/analytics';
import s from './checkin.module.css';

const MADE = ['Made it', 'Not this time'];
const RATINGS = ['Everyone ate it', 'Most of us did', 'Someone ate something else', 'Not a hit'];
const AGAIN = ['Yes', 'Maybe', 'No'];

export default function Checkin() {
  const { id } = useParams<{ id: string }>();
  const r = recipeById(id);
  const { state, dispatch, hydrated } = useStore();
  const [made, setMade] = useState('Made it');
  const [rating, setRating] = useState<string | null>(null);
  const [again, setAgain] = useState<string | null>(null);
  const [done, setDone] = useState<null | { title: string; line: string }>(null);
  if (!hydrated || !r) return null;
  const madeIt = made === 'Made it';

  const finish = () => {
    const checkin = { made, rating: madeIt ? rating : null, again: madeIt ? again : null, at: new Date().toISOString() };
    dispatch({ type: 'checkin', recipeId: r.id, checkin });
    track('checkin_household', { recipe_id: r.id, made, rating: checkin.rating, make_again: checkin.again });
    let line: string;
    if (!madeIt) line = "Want an easier dinner next time? We'll suggest a shorter one.";
    else if (rating === 'Everyone ate it') {
      const live = state.plan ? liveEntries(state.plan) : [];
      const checked = { ...state.checkins, [r.id]: checkin };
      const count = live.filter((e) => checked[e.recipeId]?.made === 'Made it').length;
      const mine = live.find((e) => e.recipeId === r.id);
      const next = live.find((e) => !checked[e.recipeId] && (!mine || dayIndex(e.night) > dayIndex(mine.night)));
      line = live.length
        ? `That's ${Math.max(count, 1)} of ${live.length} this week.` + (next ? ` Next up: ${recipeById(next.recipeId)!.title} on ${dayName(next.night)}.` : '')
        : 'Thanks, that helps.';
    } else line = "Thanks, that helps. We'll lean toward dinners everyone at your table will eat.";
    setDone({ title: madeIt ? 'Nice cooking.' : 'No stress.', line });
  };

  const group = (label: string, opts: string[], value: string | null, set: (v: string) => void, big?: boolean) => (
    <div role="radiogroup" aria-label={label} className={big ? s.row : s.wrap}>
      {opts.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} className={cx(big ? s.big : s.chip, value === o && s.on)} onClick={() => set(o)}>{o}</button>
      ))}
    </div>
  );

  return (
    <main className={s.screen}>
      <Link href={`/recipe/${r.id}`} className={ui.iconBtn} aria-label="Close"><CloseIcon /></Link>
      {!done ? (
        <div className={s.col}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1 className={s.h1}>Did you make it?</h1>
            <p style={{ fontSize: 16 }}>{r.title}</p>
          </div>
          {group('Did you make it', MADE, made, setMade, true)}
          {madeIt && (
            <div className={s.col} style={{ flex: 'none' }}>
              <div className={s.q}><span className={s.lab}>Did everyone eat it?</span>{group('Did everyone eat it', RATINGS, rating, setRating)}</div>
              <div className={s.q}><span className={s.lab}>Make it again?</span>{group('Make it again', AGAIN, again, setAgain)}</div>
            </div>
          )}
          <div style={{ flex: 1 }} />
          <Button onClick={finish}>Done</Button>
        </div>
      ) : (
        <div className={s.col} style={{ gap: 16 }}>
          <div style={{ flex: 1 }} />
          <h1 className={s.doneTitle}>{done.title}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.45 }}>{done.line}</p>
          <div style={{ flex: 1 }} />
          <ButtonLink href="/week">Back to this week</ButtonLink>
        </div>
      )}
    </main>
  );
}
