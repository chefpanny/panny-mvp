'use client';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { GOAL } from '@/data/goal';
import { TIERS, type Tier } from '@/data/foods';
import { BackIcon, CheckIcon } from './Icons';
import s from './ui.module.css';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

type BtnVariant = 'primary' | 'secondary';
export function ButtonLink({ href, children, variant = 'primary', className, onClick }: { href: string; children: ReactNode; variant?: BtnVariant; className?: string; onClick?: () => void }) {
  return <Link href={href} className={cx(s.btn, s[variant], className)} onClick={onClick}>{children}</Link>;
}
export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return <button type="button" className={cx(s.btn, s[variant], className)} {...rest} />;
}

/** Toggle chip. Selected chips invert to navy and set aria-pressed (or aria-checked in a radiogroup). */
export function Chip({ on, onClick, children, radio, small }: { on: boolean; onClick: () => void; children: ReactNode; radio?: boolean; small?: boolean }) {
  const aria = radio ? { role: 'radio', 'aria-checked': on } : { 'aria-pressed': on };
  return <button type="button" className={cx(s.chip, small && s.chipSm, on && s.on)} onClick={onClick} {...aria}>{children}</button>;
}

export function OptionButton({ on, onClick, children, radio, light }: { on: boolean; onClick?: () => void; children: ReactNode; radio?: boolean; light?: boolean }) {
  const aria = radio ? { role: 'radio', 'aria-checked': on } : { 'aria-pressed': on };
  return (
    <button type="button" className={cx(s.opt, light && s.optLight, on && s.on)} onClick={onClick} {...aria}>
      {children}
      {on && <span className={s.optCheck}><CheckIcon /></span>}
    </button>
  );
}

export const GoalTag = () => <span className={cx(s.pill, s.goalTag)}><CheckIcon size={13} />{GOAL.tag}</span>;
export const FamilyTag = () => <span className={cx(s.pill, s.familyTag)}>Family favorite</span>;
export const FilterTag = ({ children }: { children: ReactNode }) => <span className={cx(s.pill, s.filterTag)}>{children}</span>;

export function TierPill({ tier }: { tier: Tier }) {
  return <span className={s.tier} style={{ background: TIERS[tier].bg }}><span className={s.tierLetter}>{tier}</span>{TIERS[tier].label}</span>;
}

export function BackLink({ href, label = 'Back' }: { href: string; label?: string }) {
  return <Link href={href} className={s.iconBtn} aria-label={label}><BackIcon /></Link>;
}

export function SetupHeader({ back, step }: { back: string; step: number }) {
  return (
    <div className={s.setupHead}>
      <BackLink href={back} />
      <div className={s.bars} role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={6} aria-valuenow={step}>
        {Array.from({ length: 6 }, (_, i) => <span key={i} className={cx(s.bar, i >= step && s.barOff)} />)}
      </div>
    </div>
  );
}

export function Toast({ message, onUndo }: { message: string; onUndo?: () => void }) {
  return (
    <div role="status" className={s.toast}>
      <span>{message}</span>
      {onUndo && <button type="button" className={s.toastUndo} onClick={onUndo}>Undo</button>}
    </div>
  );
}

export function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <>
      <div className={s.scrim} onClick={onClose} aria-hidden="true" />
      <section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className={s.sheet}>
        <span aria-hidden="true" className={s.grabber} />
        {children}
      </section>
    </>
  );
}

export { s as ui };
