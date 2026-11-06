'use client';
import { useState } from 'react';
import { ButtonLink, Chip, SetupHeader, ui } from '@/components/ui';
import { CheckIcon } from '@/components/Icons';
import { PANTRY_STAPLES } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import s from '../setup.module.css';

export default function KitchenStep() {
  const { state, dispatch } = useStore();
  const { pantryOff, pantryExtra } = state.setup;
  const [draft, setDraft] = useState('');
  const labels = [...PANTRY_STAPLES, ...pantryExtra];
  const count = labels.filter((l) => !pantryOff.includes(l)).length;
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    const v2 = v.charAt(0).toUpperCase() + v.slice(1);
    if (!labels.includes(v2)) dispatch({ type: 'setSetup', patch: { pantryExtra: [...pantryExtra, v2] } });
    setDraft('');
  };
  const toggle = (l: string) => {
    // Unticking a custom staple removes it; built-in staples just switch off.
    if (pantryExtra.includes(l)) dispatch({ type: 'setSetup', patch: { pantryExtra: pantryExtra.filter((x) => x !== l) } });
    else dispatch({ type: 'setSetup', patch: { pantryOff: pantryOff.includes(l) ? pantryOff.filter((x) => x !== l) : [...pantryOff, l] } });
  };
  return (
    <main className={s.screen} style={{ gap: 18 }}>
      <SetupHeader back="/setup/household" step={5} />
      <div className={s.head}>
        <h1 className={ui.displayL}>What&apos;s always in your kitchen?</h1>
        <p className={ui.lead}>Untick anything you don&apos;t keep. We&apos;ll leave the rest off your list.</p>
      </div>
      <div role="group" aria-label="Pantry staples" className={s.chips}>
        {labels.map((l) => {
          const on = !pantryOff.includes(l);
          return <Chip key={l} small on={on} onClick={() => toggle(l)}>{on && <CheckIcon size={14} />}{l}</Chip>;
        })}
      </div>
      <div className={s.head}>
        <label htmlFor="addstaple" className={s.label}>Something else you always have?</label>
        <div className={s.addRow}>
          <input id="addstaple" type="text" className={ui.input} placeholder="e.g. tahini, frozen peas" value={draft}
            onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          <button type="button" className={s.addBtn} onClick={add}>Add</button>
        </div>
      </div>
      <p style={{ fontSize: 15, fontWeight: 700 }}>{count} staples in your kitchen</p>
      <div className={s.spacer} />
      <ButtonLink href="/setup/nights" onClick={() => dispatch({ type: 'markDone', step: 'kitchen' })}>Next</ButtonLink>
    </main>
  );
}
