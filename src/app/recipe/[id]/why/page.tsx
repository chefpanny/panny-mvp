'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BackLink, ButtonLink, GoalTag, TierPill, ui } from '@/components/ui';
import { FoodIcon } from '@/components/Icons';
import { GOAL, GOAL_BAR } from '@/data/goal';
import { foodById } from '@/data/foods';
import { recipeById, type Recipe } from '@/data/recipes';
import { OFFICIAL_WORD_101_77, WHY_OVERRIDES, type WhyContent } from '@/data/why';
import { recipeFoodIds } from '@/lib/goalBar';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';
import s from './why.module.css';

/** Assemble Why content from the food library's own copy. */
function buildWhy(r: Recipe): WhyContent {
  const foods = recipeFoodIds(r).map(foodById).filter((f) => f.tier !== 'C').sort((a, b) => a.tier.localeCompare(b.tier));
  const sources: string[] = [];
  const srcIndex = (src: string) => { const i = sources.indexOf(src); if (i >= 0) return i + 1; sources.push(src); return sources.length; };
  const items = foods.map((f) => {
    const copy = f.foodsScreen ?? { how: f.how, src: f.src };
    const names = r.ingredients.filter((i) => i.food === f.id).map((i) => i.name);
    return { tier: f.tier, icon: f.icon, lead: `${names.join(' and ')}: ${(copy.nutrient ?? f.nutrient).toLowerCase()}.`, body: copy.how, source: srcIndex(copy.src) };
  });
  const official = sources.findIndex((x) => x.includes('101.77'));
  return {
    intro: `Every dinner in your week meets the same ${GOAL.tag} bar.`,
    items,
    officialSource: official >= 0 ? official + 1 : null,
    sources,
  };
}

export default function WhyPage() {
  const { id } = useParams<{ id: string }>();
  const r = recipeById(id);
  const { hydrated } = useStore();
  useEffect(() => { if (hydrated && r) track('how_it_works_viewed', { recipe_id: r.id }); }, [hydrated, r]);
  if (!r) return null;
  const why = WHY_OVERRIDES[r.id] ?? buildWhy(r);
  const n = r.nutrition;

  return (
    <main className={s.page}>
      <header className={s.header}>
        <BackLink href={`/recipe/${r.id}`} label="Back to the recipe" />
        <span style={{ fontSize: 14, fontWeight: 700 }}>{r.title}</span>
      </header>
      <div className={s.content}>
        <div className={s.stack10}>
          <span className={s.lab} style={{ color: 'var(--navy-muted)' }}>Your goal · {GOAL.name}</span>
          <span style={{ alignSelf: 'flex-start' }}><GoalTag /></span>
          <h1 className={s.h1}>Why this dinner fits</h1>
          <p style={{ fontSize: 16, lineHeight: 1.5 }}>{why.intro}</p>
        </div>

        <section aria-label={`The ${GOAL.tag} bar`} className={s.bar}>
          <span className={s.lab}>What &quot;{GOAL.tag}&quot; means</span>
          <span style={{ fontSize: 14, lineHeight: 1.5 }}>Per serving: no more than {GOAL_BAR.maxSatFatG} g saturated fat, at least {GOAL_BAR.minFiberG} g fiber, and at least one food from the list with evidence tier {GOAL_BAR.qualifyingTiers.join(' or ')}. Thresholds to be set with our RD advisor.</span>
        </section>
        <section aria-label="Per serving" className={s.stats}>
          <div className={s.stat}><span className={s.sv}>{n.fiberG} g</span><span style={{ fontSize: 13 }}>{n.solubleG ? `fiber, ${n.solubleG} g of it soluble` : 'fiber'}</span></div>
          <div className={s.stat}><span className={s.sv}>{n.satFatG} g</span><span style={{ fontSize: 13 }}>saturated fat</span></div>
        </section>

        <section aria-label="How it works" className={s.card}>
          <span className={s.lab}>How it works, in plain English</span>
          <span className={s.fine}>Evidence tiers: A, FDA-authorized health claim · B, strong research · C, early research.</span>
          {why.items.map((it, i) => (
            <div key={i} className={s.mech}>
              <span className={s.disc}><FoodIcon icon={it.icon} /></span>
              <p>
                <span className={s.pillRow}><TierPill tier={it.tier} /></span>
                <b>{it.lead}</b> {it.body}<a href={`#w-${it.source}`} className={s.fnote} aria-label={`Source ${it.source}`}>{it.source}</a>
              </p>
            </div>
          ))}
          {why.officialSource && (
            <div className={s.official}>
              <span className={s.lab}>The official word</span>
              <p style={{ fontSize: 13, lineHeight: 1.55 }}>{OFFICIAL_WORD_101_77}<a href={`#w-${why.officialSource}`} className={s.fnote} aria-label={`Source ${why.officialSource}`}>{why.officialSource}</a></p>
            </div>
          )}
          <p style={{ fontSize: 14, lineHeight: 1.55 }}>One dinner won&apos;t change a lab result on its own. A week of meals like it is the point.</p>
        </section>

        {why.pairing && (
          <section aria-label="The pairing" className={s.card} style={{ background: 'var(--parchment)' }}>
            <span className={s.lab}>Bonus pairing</span>
            <p style={{ fontSize: 14, lineHeight: 1.55 }}><b>{why.pairing.lead}</b> {why.pairing.body}<a href={`#w-${why.pairing.source}`} className={s.fnote} aria-label={`Source ${why.pairing.source}`}>{why.pairing.source}</a> That&apos;s a bonus, not part of your LDL goal.</p>
          </section>
        )}

        <section aria-label="What we don't claim" className={s.card}>
          <h2 className={s.h2}>What we don&apos;t claim</h2>
          <ul className={s.ul}>
            <li>This recipe doesn&apos;t treat or lower cholesterol by itself.</li>
            <li>It isn&apos;t a substitute for medication or your clinician&apos;s plan.</li>
            <li>The creator didn&apos;t make health claims. Panny wrote this.</li>
          </ul>
        </section>

        <p className={s.disclaimer}>Education, not medical advice. If you take cholesterol medication or manage a medical condition, check with your clinician or pharmacist before changing your diet.</p>

        <section aria-label="Sources" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 className={s.h2} style={{ fontSize: 18 }}>Sources</h2>
          <ol className={s.ul} style={{ fontSize: 13, lineHeight: 1.5 }}>
            {why.sources.map((src, i) => <li key={i} id={`w-${i + 1}`}>{src}</li>)}
          </ol>
          <span className={s.fine}>Reviewed by Panny&apos;s food team. Last checked [date]. Sample values in this mock.</span>
        </section>
      </div>
      <div style={{ flex: 1, minHeight: 32 }} />
      <div className={ui.stickyFoot}>
        <ButtonLink href={`/recipe/${r.id}`}>Back to the recipe</ButtonLink>
      </div>
    </main>
  );
}
