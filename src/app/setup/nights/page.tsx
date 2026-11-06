'use client';
import { useRouter } from 'next/navigation';
import { Button, Chip, SetupHeader, cx, ui } from '@/components/ui';
import { DAYS, REMIND_TIMES, SEND_OPTIONS, type DayKey } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import s from '../setup.module.css';

// Saves choices only. TODO(post-MVP): actually send menus and reminders.
export default function NightsStep() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const { nights, send, remindTime, customTime, email } = state.setup;
  const set = (patch: Partial<typeof state.setup>) => dispatch({ type: 'setSetup', patch });
  const toggleDay = (k: DayKey) => set({ nights: nights.includes(k) ? nights.filter((x) => x !== k) : [...nights, k] });
  const rem = send === 'Menu + nightly reminders';
  const weekly = send === 'Weekly menu only';
  const optOut = !rem && !weekly;
  const signIn = " We'll also email a one-tap sign-in link, so you can open your plan on any device.";
  const emailLabel = rem ? 'Email for your menu and reminders' : weekly ? 'Email for your weekly menu' : 'Email to save your plan';
  const emailNote = rem
    ? 'One weekly email with a printable menu and shopping list, plus a short reminder on each cooking night. Pause anytime.' + signIn
    : weekly
      ? 'One weekly email with a printable menu and shopping list. Pause anytime.' + signIn
      : "We won't send menus or reminders. Your plan is saved on this device. Add an email if you want to open it on another device; we'll only use it to send you a sign-in link.";
  const noNights = nights.length === 0;

  return (
    <main className={s.screen} style={{ gap: 18, paddingBottom: 28 }}>
      <SetupHeader back="/setup/kitchen" step={6} />
      <h1 className={ui.displayL}>Which nights do you cook?</h1>
      <div role="group" aria-label="Cooking nights" className={s.days}>
        {DAYS.map((d) => {
          const on = nights.includes(d.key);
          return <button key={d.key} type="button" aria-pressed={on} aria-label={d.name} className={cx(s.day, on && s.dayOn)} onClick={() => toggleDay(d.key)}>{d.key.charAt(0)}</button>;
        })}
      </div>
      <div className={s.block}>
        <span className={s.label}>Send me</span>
        <div role="radiogroup" aria-label="What to send" className={s.chips}>
          {SEND_OPTIONS.map((l) => <Chip key={l} small radio on={send === l} onClick={() => set({ send: l })}>{l}</Chip>)}
        </div>
      </div>
      {rem && (
        <div className={s.block}>
          <span className={s.label}>Remind me at</span>
          <div role="radiogroup" aria-label="Reminder time" className={s.chips}>
            {REMIND_TIMES.map((t) => <Chip key={t} small radio on={remindTime === t} onClick={() => set({ remindTime: t })}>{t}</Chip>)}
          </div>
          {remindTime === 'Custom' && (
            <label className={s.inline}>Pick a time <input type="time" className={s.time} value={customTime} onChange={(e) => set({ customTime: e.target.value })} aria-label="Custom reminder time" /></label>
          )}
        </div>
      )}
      <div className={s.head}>
        <label htmlFor="email" className={s.label}>{emailLabel} {optOut && <span className={ui.muted} style={{ fontWeight: 500 }}>(optional)</span>}</label>
        {/* Saved locally only. Nothing is sent. */}
        <input id="email" type="email" className={ui.input} placeholder="you@email.com" autoComplete="email" value={email} onChange={(e) => set({ email: e.target.value })} />
        <span className={s.small}>{emailNote}</span>
      </div>
      <div className={s.spacer} />
      {noNights && <p className={s.small} role="status">Pick at least one night.</p>}
      <Button aria-disabled={noNights} onClick={() => {
        if (noNights) return;
        dispatch({ type: 'markDone', step: 'nights' });
        router.push('/foods');
      }}>Show my dinners</Button>
    </main>
  );
}
