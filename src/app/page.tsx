'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonLink } from '@/components/ui';
import { useStore } from '@/lib/store';
import { setupComplete, firstUnfinishedStep } from '@/lib/reducer';
import s from './setup/setup.module.css';

export default function Welcome() {
  const { state, hydrated } = useStore();
  const router = useRouter();
  // The week is home once setup is done.
  useEffect(() => {
    if (hydrated && setupComplete(state)) router.replace('/week');
  }, [hydrated, state, router]);
  const start = firstUnfinishedStep(state)?.path ?? '/setup/goal';

  return (
    <main className={s.welcome}>
      <div aria-hidden="true" className={s.halftone} />
      <div className={s.wordmark}>panny</div>
      <div className={s.hero}>
        <div className={s.disc} />
        <svg className={s.pan} width="220" height="168" viewBox="0 0 210 160" aria-hidden="true">
          <path d="M70 30c-8-10 8-16 0-26M105 26c-8-10 8-16 0-26M140 30c-8-10 8-16 0-26" fill="none" stroke="var(--navy)" strokeWidth="3" strokeLinecap="round" />
          <path d="M150 58L196 20" stroke="var(--navy)" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="105" cy="62" rx="88" ry="16" fill="var(--mustard)" stroke="var(--navy)" strokeWidth="2.5" />
          <circle cx="78" cy="53" r="6" fill="var(--paper)" stroke="var(--navy)" strokeWidth="1.5" />
          <circle cx="98" cy="56" r="6" fill="var(--paper)" stroke="var(--navy)" strokeWidth="1.5" />
          <circle cx="122" cy="52" r="6" fill="var(--paper)" stroke="var(--navy)" strokeWidth="1.5" />
          <path d="M132 56c6-8 16-8 22 0" fill="none" stroke="var(--mint)" strokeWidth="5" strokeLinecap="round" />
          <path d="M17 62c4 52 40 80 88 80s84-28 88-80z" fill="var(--cherry)" stroke="var(--navy)" strokeWidth="2.5" />
          <path d="M45 100h120" stroke="var(--paper)" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <span className={s.burst}>
          <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,2 58,16 74,8 75,25 92,26 84,42 98,50 84,58 92,74 75,75 74,92 58,84 50,98 42,84 26,92 25,75 8,74 16,58 2,50 16,42 8,26 25,25 26,8 42,16" fill="var(--mustard)" stroke="var(--navy)" strokeWidth="2" />
          </svg>
          <span className={s.burstText}>One pan!</span>
        </span>
      </div>
      <div className={s.spacer} />
      <div className={s.copy}>
        <span className={s.script} aria-hidden="true">Hello, dinner!</span>
        <h1 className={s.h1xl}>Cook for your health goal. With ease.</h1>
        <p className={s.body17}>Tell us your health goal. We&apos;ll find quick, evidence-graded recipes from cooks you&apos;ll love and write the shopping list for you.</p>
      </div>
      <div style={{ height: 28 }} />
      <ButtonLink href={start}>Get my dinners</ButtonLink>
    </main>
  );
}
