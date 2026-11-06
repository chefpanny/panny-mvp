'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ButtonLink, TierPill, Toast, cx, ui } from '@/components/ui';
import { ChevronDown, FoodIcon, SwapIcon } from '@/components/Icons';
import { FOOD_SLOTS, TIERS, foodById, type Food } from '@/data/foods';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';
import type { Setup } from '@/lib/types';
import s from './foods.module.css';

const avoided = (f: Food, setup: Setup) => !!f.allergen && setup.allergies.includes(f.allergen);

export default function FoodsScreen() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const slots = FOOD_SLOTS.map((sl) => {
    const main = foodById(sl.main);
    const alt = foodById(sl.alt);
    // A main food you avoid starts on its alternative.
    const isAlt = state.foodSwaps[sl.k] ?? avoided(main, state.setup);
    const f = isAlt ? alt : main;
    const other = isAlt ? main : alt;
    return { sl, f, other, isAlt, canSwap: !avoided(other, state.setup) };
  });

  return (
    <main className={s.screen}>
      {!state.plan && <span style={{ fontSize: 14, fontWeight: 700 }}>You&apos;re all set.</span>}
      <div className={s.head}>
        <h1 className={s.h1}>Foods for healthy LDL</h1>
        <p className={ui.lead}>Your dinners lean on these four. Each one shows how strong the evidence is. Tap to see how it works.</p>
      </div>
      <div aria-label="Evidence tiers" className={s.legend}>
        <span className={s.lab}>How strong is the evidence?</span>
        <div className={s.legendRows}>
          {(['A', 'B', 'C'] as const).map((t) => <span key={t}><strong>{t}</strong> · {TIERS[t].legend}</span>)}
        </div>
        <Link href="/foods/all" style={{ fontSize: 13, fontWeight: 700, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>See all LDL foods and how we grade them</Link>
      </div>
      <div className={s.list}>
        {slots.map(({ sl, f, other, isAlt, canSwap }) => {
          const isOpen = open === sl.k;
          const copy = f.foodsScreen ?? { how: f.how, src: f.src };
          return (
            <div key={sl.k} className={s.food}>
              <button type="button" className={s.headBtn} aria-expanded={isOpen} onClick={() => {
                setOpen(isOpen ? null : sl.k);
                setToast('');
                if (!isOpen) track('ldl_food_opened', { food_id: f.id, tier: f.tier, screen: 'foods' });
              }}>
                <span className={s.ico}><FoodIcon icon={f.icon} size={26} /></span>
                <span className={s.col}>
                  <span className={s.fn}>{f.name}</span>
                  <TierPill tier={f.tier} />
                </span>
                <span className={cx(s.chev, isOpen && s.open)}><ChevronDown /></span>
              </button>
              {isOpen && (
                <div className={s.body}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{copy.nutrient ?? f.nutrient}</span>
                  <div className={s.how}>
                    <span className={s.lab}>How it works</span>
                    <p>{copy.how}</p>
                  </div>
                  <span className={s.src}>Source: {copy.src}</span>
                  {canSwap && (
                    <button type="button" className={ui.linkBtn} style={{ fontSize: 14, alignSelf: 'flex-start' }} onClick={() => {
                      dispatch({ type: 'setFoodSwap', slot: sl.k, alt: !isAlt });
                      setToast(`Done. Your dinners will use ${other.name.toLowerCase()} instead.`);
                      track('ldl_food_swapped', { slot: sl.k, from_food_id: f.id, to_food_id: other.id });
                    }}>
                      <SwapIcon size={16} />
                      {isAlt ? `Switch back to ${other.name.toLowerCase()}` : `Not a fan? Try ${other.name.toLowerCase()}`}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className={s.fine}>Education, not medical advice. If you take cholesterol medication, check with your clinician or pharmacist before changing your diet.</p>
      <div className={s.spacer} />
      {toast && <div className={s.toast}><Toast message={toast} /></div>}
      <ButtonLink href="/week">See my dinners</ButtonLink>
    </main>
  );
}
