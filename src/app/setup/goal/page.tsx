'use client';
import { ButtonLink, OptionButton, SetupHeader, ui } from '@/components/ui';
import { GOAL } from '@/data/goal';
import { VOTE_OPTIONS } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import s from '../setup.module.css';

export default function GoalStep() {
  const { state, dispatch } = useStore();
  const { vote, voteOther } = state.setup;
  return (
    <main className={s.screen} style={{ gap: 18 }}>
      <SetupHeader back="/" step={1} />
      <h1 className={ui.displayL}>What are you cooking for?</h1>
      {/* Only LDL is live. The option reads the goal name from config (README: goal vs. tag). */}
      <OptionButton on>{GOAL.name}</OptionButton>
      <span className={ui.eyebrow}>Coming soon</span>
      <span className={s.title21}>Vote for what we cook for next</span>
      <div role="radiogroup" aria-label="Vote for the next goal" className={s.list}>
        {VOTE_OPTIONS.map((l) => (
          <OptionButton key={l} radio light on={vote === l} onClick={() => dispatch({ type: 'setSetup', patch: { vote: vote === l ? null : l } })}>{l}</OptionButton>
        ))}
      </div>
      <label htmlFor="tellus" style={{ fontSize: 14, fontWeight: 700, paddingTop: 4 }}>Something else? Tell us.</label>
      <input id="tellus" type="text" className={ui.input} placeholder="e.g. pregnancy, kids' lunches" value={voteOther}
        onChange={(e) => dispatch({ type: 'setSetup', patch: { voteOther: e.target.value } })} />
      <div className={s.spacer} />
      <p className={s.small}>If you take cholesterol medication or manage a medical condition, check with your clinician or pharmacist before changing your diet.</p>
      <ButtonLink href="/setup/avoid" onClick={() => dispatch({ type: 'markDone', step: 'goal' })}>Next</ButtonLink>
    </main>
  );
}
