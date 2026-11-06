'use client';
import { ButtonLink, Chip, SetupHeader, ui } from '@/components/ui';
import { BowlIcon } from '@/components/Icons';
import { NEED_OPTIONS, WHO_OPTIONS } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';
import s from '../setup.module.css';

const flip = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function HouseholdStep() {
  const { state, dispatch } = useStore();
  const { who, needs, wontTouch } = state.setup;
  return (
    <main className={s.screen}>
      <SetupHeader back="/setup/servings" step={4} />
      <div className={s.head}>
        <h1 className={ui.displayL}>Who&apos;s at the table?</h1>
        <p className={ui.lead}>So your week works for everyone, not just you.</p>
      </div>
      <div className={s.block}>
        <span className={ui.eyebrow}>I&apos;m cooking for</span>
        <div role="group" aria-label="Who you cook for" className={s.chips}>
          {WHO_OPTIONS.map((l) => <Chip key={l} on={who.includes(l)} onClick={() => dispatch({ type: 'setSetup', patch: { who: flip(who, l) } })}>{l}</Chip>)}
        </div>
      </div>
      <div className={s.block}>
        <span className={ui.eyebrow}>Anything we should plan around?</span>
        <div role="group" aria-label="Household needs" className={s.chips}>
          {NEED_OPTIONS.map((l) => <Chip key={l} on={needs.includes(l)} onClick={() => dispatch({ type: 'setSetup', patch: { needs: flip(needs, l) } })}>{l}</Chip>)}
        </div>
      </div>
      <div className={s.head}>
        <label htmlFor="wonttouch" className={s.label}>Foods someone won&apos;t touch</label>
        <input id="wonttouch" type="text" className={ui.input} placeholder="e.g. mushrooms, tofu, anything spicy" value={wontTouch}
          onChange={(e) => dispatch({ type: 'setSetup', patch: { wontTouch: e.target.value } })} />
      </div>
      <div className={s.note}>
        <BowlIcon />
        <span>Every week includes at least one familiar dinner, like a lean-meat favorite made LDL-friendly. Healthy LDL is about less saturated fat and more fiber, not giving up meat.</span>
      </div>
      <div className={s.spacer} />
      <ButtonLink href="/setup/kitchen" onClick={() => {
        dispatch({ type: 'markDone', step: 'household' });
        track('household_profile_set', { who, needs, wont_touch: wontTouch, servings: state.setup.servings });
      }}>Next</ButtonLink>
    </main>
  );
}
