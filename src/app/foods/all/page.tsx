'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BackLink, cx, ui } from '@/components/ui';
import { ChevronDown, ChevronRight, FoodIcon } from '@/components/Icons';
import { FOODS, TIERS } from '@/data/foods';
import { recipeById } from '@/data/recipes';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';
import { eligibleRecipes } from '@/lib/plan';
import { recipeFoodIds } from '@/lib/goalBar';
import s from '../foods.module.css';

export default function AllFoods() {
  const { state, hydrated } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { if (hydrated) track('food_library_viewed', {}); }, [hydrated]);

  const weekFoods = new Set((state.plan?.entries ?? []).filter((e) => !e.skipped).flatMap((e) => recipeFoodIds(recipeById(e.recipeId)!)));
  const eligible = eligibleRecipes(state.setup);

  return (
    <main className={s.screenAll}>
      <header className={s.headerBar}><BackLink href="/foods" /></header>
      <div className={s.head}>
        <h1 className={s.h1}>All LDL foods</h1>
        <p className={ui.lead} style={{ lineHeight: 1.5 }}>Every food we build LDL dinners around, grouped by how strong the evidence is.</p>
      </div>
      <section aria-label="How we grade evidence" className={s.grade}>
        <span className={s.lab}>How we grade evidence</span>
        <p>Each grade is for a food&apos;s role in healthy LDL, set with our dietitian advisor from published research. A grade isn&apos;t a ranking of what to eat: the benefit comes from the overall pattern, more fiber and less saturated fat, across your week.</p>
        {/* TODO(post-MVP): link the published evidence rubric. */}
        <a href="#method" style={{ fontSize: 13, fontWeight: 700, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Read our full method</a>
      </section>

      {(['A', 'B', 'C'] as const).map((tier) => (
        <section key={tier} className={s.grp} aria-label={`Tier ${tier}`}>
          <div className={s.gh}>
            <span className={s.tl} style={{ boxShadow: `0 0 0 3px ${TIERS[tier].bg}` }}>{tier}</span>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={s.gTitle}>{tier} · {TIERS[tier].label}</span>
              <span className={s.nut}>{TIERS[tier].desc}</span>
            </span>
          </div>
          <div className={s.box}>
            {FOODS.filter((f) => f.tier === tier).map((f) => {
              const isOpen = open === f.id;
              const avoid = !!f.allergen && state.setup.allergies.includes(f.allergen);
              const inWeek = !avoid && !f.notDinner && weekFoods.has(f.id);
              const count = eligible.filter((r) => recipeFoodIds(r).includes(f.id)).length;
              return (
                <div key={f.id}>
                  <button type="button" className={s.headAll} aria-expanded={isOpen} onClick={() => {
                    setOpen(isOpen ? null : f.id);
                    if (!isOpen) track('ldl_food_opened', { food_id: f.id, tier: f.tier, screen: 'all_foods' });
                  }}>
                    <span className={s.icoSm} style={{ opacity: avoid ? 0.5 : 1 }}><FoodIcon icon={f.icon} /></span>
                    <span className={s.col} style={{ gap: 4 }}>
                      <span className={s.fnAll}>{f.name}</span>
                      <span className={s.nut}>{f.nutrient}</span>
                      {inWeek && <span className={cx(s.note, s.noteWeek)}>In your week</span>}
                      {avoid && <span className={cx(s.note, s.noteAvoid)}>You avoid {f.allergen!.toLowerCase()}</span>}
                      {f.notDinner && <span className={cx(s.note, s.noteNot)}>Not in our dinners</span>}
                    </span>
                    <span className={cx(s.chev, isOpen && s.open)}><ChevronDown size={18} /></span>
                  </button>
                  {isOpen && (
                    <div className={s.bodyAll}>
                      <span className={s.lab}>How it works</span>
                      <p>{f.how}{avoid && f.avoidHow ? ' ' + f.avoidHow : ''}</p>
                      <span className={s.src}>Source: {f.src}</span>
                      {!avoid && !f.notDinner && count > 0 && (
                        <Link href="/week" className={s.dinnersLink}>{f.dinnersLabel} ({count})<ChevronRight /></Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <p className={s.fine}>Education, not medical advice. If you take cholesterol medication or manage a medical condition, check with your clinician or pharmacist before changing your diet. Grades are provisional until our evidence rubric is final.</p>
    </main>
  );
}
