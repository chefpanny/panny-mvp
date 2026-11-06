'use client';
import { ButtonLink, SetupHeader, cx, ui } from '@/components/ui';
import { SERVING_OPTIONS } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import s from '../setup.module.css';

export default function ServingsStep() {
  const { state, dispatch } = useStore();
  const pick = state.setup.servings;
  return (
    <main className={s.screen}>
      <SetupHeader back="/setup/avoid" step={3} />
      <h1 className={ui.displayL}>How many are you feeding?</h1>
      <div role="radiogroup" aria-label="Servings" className={s.tiles}>
        {SERVING_OPTIONS.map((o) => (
          <button key={o.n} type="button" role="radio" aria-checked={pick === o.n} className={cx(s.tile, pick === o.n && s.tileOn)}
            onClick={() => dispatch({ type: 'setSetup', patch: { servings: o.n } })}>
            <span className={s.num}>{o.n}</span><span className={s.cap}>{o.cap}</span>
          </button>
        ))}
      </div>
      <p style={{ fontSize: 15 }}>Every recipe and your list scale to this. Feeding 3 or 5? Pick the closest; you can change servings on any dinner.</p>
      <div className={s.spacer} />
      <ButtonLink href="/setup/household" onClick={() => dispatch({ type: 'markDone', step: 'servings' })}>Next</ButtonLink>
    </main>
  );
}
