'use client';
import { ButtonLink, Chip, SetupHeader, ui } from '@/components/ui';
import { ALLERGENS, DIETS } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import s from '../setup.module.css';

export default function AvoidStep() {
  const { state, dispatch } = useStore();
  const { allergies, diet } = state.setup;
  const toggle = (a: (typeof ALLERGENS)[number]) =>
    dispatch({ type: 'setSetup', patch: { allergies: allergies.includes(a) ? allergies.filter((x) => x !== a) : [...allergies, a] } });
  return (
    <main className={s.screen}>
      <SetupHeader back="/setup/goal" step={2} />
      <div className={s.head}>
        <h1 className={ui.displayL}>Anything off the table?</h1>
        <p className={ui.lead}>We&apos;ll never show you these.</p>
      </div>
      <div className={s.block}>
        <span className={ui.eyebrow}>Allergies</span>
        <div role="group" aria-label="Allergies" className={s.chips}>
          {ALLERGENS.map((a) => <Chip key={a} on={allergies.includes(a)} onClick={() => toggle(a)}>{a}</Chip>)}
        </div>
      </div>
      <div className={s.block}>
        <span className={ui.eyebrow}>I eat</span>
        <div role="radiogroup" aria-label="Diet" className={s.chips}>
          {DIETS.map((d) => <Chip key={d} radio on={diet === d} onClick={() => dispatch({ type: 'setSetup', patch: { diet: d } })}>{d}</Chip>)}
        </div>
      </div>
      <div className={s.spacer} />
      <ButtonLink href="/setup/servings" onClick={() => dispatch({ type: 'markDone', step: 'avoid' })}>Next</ButtonLink>
    </main>
  );
}
