'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { ButtonLink, Button, Chip, FamilyTag, FilterTag, GoalTag, Sheet, Toast, ui } from '@/components/ui';
import { CalendarIcon, ChevronRight, FoodIcon, PersonIcon, SkipIcon, SwapIcon } from '@/components/Icons';
import { GOAL } from '@/data/goal';
import { foodById } from '@/data/foods';
import { recipeById, type Recipe } from '@/data/recipes';
import { DAYS, SWAP_REASONS, dayName, type DayKey } from '@/data/setupOptions';
import { useRequireSetup, useStore } from '@/lib/store';
import { liveEntries, moveEntry, skipEntry, sortedEntries, swapEntry, swapOptions, unskipEntry } from '@/lib/plan';
import { recipeFoodIds } from '@/lib/goalBar';
import { recipeHave } from '@/lib/list';
import { track } from '@/lib/analytics';
import type { Plan, PlanEntry, SkipMode } from '@/lib/types';
import s from './week.module.css';

type SheetState = { mode: 'swap' | 'move' | 'skip'; entryId: string } | null;

export default function WeekScreen() {
  const ready = useRequireSetup();
  const { state, dispatch } = useStore();
  const [sheet, setSheet] = useState<SheetState>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [skipMode, setSkipMode] = useState<SkipMode>('drop');
  const [toast, setToast] = useState('');
  const close = useCallback(() => setSheet(null), []);

  if (!ready || !state.plan) return null;
  const plan = state.plan;
  const entries = sortedEntries(plan);
  const live = liveEntries(plan);
  const setup = state.setup;
  const inputs = { setup, foodSwaps: state.foodSwaps };

  const change = (next: Plan, message: string) => {
    dispatch({ type: 'planChange', plan: next });
    setSheet(null);
    setToast(message);
  };
  const undo = () => {
    dispatch({ type: 'undoPlan' });
    setToast('');
    track('week_change_undone', {});
  };

  const foodsInWeek = [...new Set(live.flatMap((e) => recipeFoodIds(recipeById(e.recipeId)!)))]
    .map(foodById)
    .sort((a, b) => a.tier.localeCompare(b.tier));
  const whyHref = live[0] ? `/recipe/${live[0].recipeId}/why` : '/foods';

  const target = sheet ? entries.find((e) => e.id === sheet.entryId)! : null;
  const tRecipe = target ? recipeById(target.recipeId)! : null;
  const tNight = target ? dayName(target.night) : '';

  return (
    <main className={s.page}>
      <header className={s.header}>
        <span className={ui.wordmark}>panny</span>
        <Link href="/setup/nights" aria-label="Settings" className={ui.iconBtn}><PersonIcon /></Link>
      </header>
      <div className={s.intro}>
        <h1 className={s.h1}>Your week</h1>
        <p style={{ fontSize: 16 }}>{live.length} {live.length === 1 ? 'dinner' : 'dinners'} this week · for {setup.servings}</p>
        <p style={{ fontSize: 14, lineHeight: 1.45 }}>Every dinner here is {GOAL.tag}: low in saturated fat, with real fiber. <Link href={whyHref} style={{ fontWeight: 700 }}>What that means</Link></p>
      </div>

      {foodsInWeek.length > 0 && (
        <section aria-label="LDL foods this week" className={s.strip}>
          <div className={s.stripHead}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>LDL foods this week</span>
            <Link href="/foods" style={{ fontSize: 14, fontWeight: 700, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>How they work</Link>
          </div>
          <div className={s.stripRow}>
            {foodsInWeek.map((f) => (
              <span key={f.id} className={s.food}>
                <span className={s.fimg}><FoodIcon icon={f.icon} size={20} /></span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{f.shortName}</span>
                  <span style={{ fontSize: 12 }}>Evidence {f.tier}</span>
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <div className={s.meals}>
        {entries.length === 0 && (
          <p className={s.empty}>We couldn&apos;t find dinners that fit everything you picked. Try fewer foods to avoid in setup.</p>
        )}
        {entries.map((e) => (
          <MealCard key={e.id} entry={e} onSwap={() => { setReason(null); setSheet({ mode: 'swap', entryId: e.id }); }}
            onMove={() => setSheet({ mode: 'move', entryId: e.id })}
            onSkip={() => { setSkipMode('drop'); setSheet({ mode: 'skip', entryId: e.id }); }}
            onUnskip={() => { dispatch({ type: 'planChange', plan: unskipEntry(plan, e.id) }); setToast(''); }} />
        ))}

        <Link href="/week/usual" className={s.usual}>
          <span className={s.usualTitle}>Have a dinner your family already loves?</span>
          <span style={{ fontSize: 14, lineHeight: 1.45 }}>Tell us your usual. Our test kitchen will make an {GOAL.tag} version that still tastes like home.</span>
          <span className={s.under}>Make my usual dinner work<ChevronRight /></span>
        </Link>
        <span className={s.fine}>Per serving, calculated from each recipe&apos;s amounts with USDA data. Sample values in this mock.</span>
      </div>

      <div style={{ flex: 1, minHeight: 28 }} />
      {toast && !sheet && <div className={s.toastWrap}><Toast message={toast} onUndo={state.prevPlan ? undo : undefined} /></div>}
      <div className={ui.stickyFoot}><ButtonLink href="/list">See this week&apos;s list</ButtonLink></div>

      {sheet?.mode === 'swap' && target && tRecipe && (() => {
        const { heading, options } = swapOptions(plan, target.id, reason, inputs);
        return (
          <Sheet label={`Swap ${tNight}'s dinner`} onClose={close}>
            <div className={s.sheetHead}><h2 className={ui.sheetTitle}>Swap {tNight}&apos;s dinner</h2><span style={{ fontSize: 14 }}>Replacing {tRecipe.title}</span></div>
            <div className={s.stack}>
              <span className={s.lab}>What&apos;s not working? (optional)</span>
              <div role="radiogroup" aria-label="Reason" className={s.chips}>
                {SWAP_REASONS.map((r) => <Chip key={r} radio small on={reason === r} onClick={() => setReason(reason === r ? null : r)}>{r}</Chip>)}
              </div>
            </div>
            <div className={s.stack}>
              <span className={s.lab}>{heading}</span>
              {options.length === 0 && <span style={{ fontSize: 14 }}>No other dinners fit everything you picked yet.</span>}
              {options.map((o) => (
                <button key={o.id} type="button" className={s.row} aria-label={`Swap in ${o.title}`} onClick={() => {
                  change(swapEntry(plan, target.id, o.id), `${tNight}'s dinner swapped. Your list is updated.`);
                  track('dinner_swapped', { recipe_id: o.id, from_recipe_id: tRecipe.id, reason, night: target.night });
                }}>
                  <span className={s.athumb}>[Photo]</span>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span className={s.altTitle}>{o.title}</span>
                    <span style={{ fontSize: 13 }}>{o.minutes} min · {o.nutrition.fiberG} g fiber · {o.nutrition.proteinG} g protein</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{GOAL.tag}{o.familiar ? ' · Family favorite' : ''}</span>
                  </span>
                </button>
              ))}
            </div>
            <span style={{ fontSize: 13 }}>This week&apos;s list updates automatically.</span>
            <button type="button" className={ui.linkBtn} style={{ alignSelf: 'center' }} onClick={close}>Keep {tNight}&apos;s dinner</button>
          </Sheet>
        );
      })()}

      {sheet?.mode === 'move' && target && tRecipe && (
        <Sheet label={`Move ${tNight}'s dinner`} onClose={close}>
          <div className={s.sheetHead}><h2 className={ui.sheetTitle}>Move {tRecipe.title}</h2><span style={{ fontSize: 14 }}>Now on {tNight}. Pick a new night.</span></div>
          <div className={s.stack}>
            {DAYS.filter((d) => d.key !== target.night).map((d) => {
              const other = entries.find((e) => e.night === d.key);
              const note = other ? (other.skipped ? 'Skipped night' : `Trade nights with ${recipeById(other.recipeId)!.title}`) : 'Free night';
              return (
                <button key={d.key} type="button" className={s.row} onClick={() => {
                  change(moveEntry(plan, target.id, d.key as DayKey), `${tRecipe.title} moved to ${d.name}.`);
                  track('dinner_moved', { recipe_id: tRecipe.id, from: target.night, to: d.key, traded_with: other?.recipeId ?? null });
                }}>
                  <span style={{ width: 92, fontWeight: 700, fontSize: 16 }}>{d.name}</span>
                  <span style={{ flex: 1, fontSize: 13 }} className={ui.muted}>{note}</span>
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: 13, lineHeight: 1.45 }}>Your list stays the same. If fresh ingredients won&apos;t keep that long, we&apos;ll tell you.</span>
          <button type="button" className={ui.linkBtn} style={{ alignSelf: 'center' }} onClick={close}>Keep it on {tNight}</button>
        </Sheet>
      )}

      {sheet?.mode === 'skip' && target && tRecipe && (() => {
        const items = recipeHave(tRecipe, setup, {}).listItems;
        const opts: { mode: SkipMode; label: string; note: string }[] = [
          { mode: 'drop', label: 'Take its ingredients off my list', note: `${items} items come off this week's list.` },
          { mode: 'keep', label: 'Save it for next week', note: 'Keep the ingredients and cook it next week.' },
        ];
        return (
          <Sheet label={`Skip ${tNight}`} onClose={close}>
            <div className={s.sheetHead}><h2 className={ui.sheetTitle}>Skip {tNight}?</h2><span style={{ fontSize: 14 }}>No dinner from us that night. It happens.</span></div>
            <div role="radiogroup" aria-label="What to do with this dinner" className={s.stack}>
              {opts.map((o) => (
                <button key={o.mode} type="button" role="radio" aria-checked={skipMode === o.mode} className={s.row} onClick={() => setSkipMode(o.mode)}>
                  <span className={s.radio}>{skipMode === o.mode && <span className={s.radioDot} />}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{o.label}</span>
                    <span style={{ fontSize: 13 }} className={ui.muted}>{o.note}</span>
                  </span>
                </button>
              ))}
            </div>
            <Button onClick={() => {
              change(skipEntry(plan, target.id, skipMode), `${tNight} skipped. ${skipMode === 'keep' ? 'Saved for next week.' : 'Your list is updated.'}`);
              if (skipMode === 'keep') dispatch({ type: 'saveForNextWeek', recipeId: tRecipe.id });
              track('dinner_skipped', { recipe_id: tRecipe.id, choice: skipMode, night: target.night });
            }}>Skip {tNight}</Button>
            <button type="button" className={ui.linkBtn} style={{ alignSelf: 'center' }} onClick={close}>Never mind</button>
          </Sheet>
        );
      })()}
    </main>
  );
}

function MealCard({ entry, onSwap, onMove, onSkip, onUnskip }: { entry: PlanEntry; onSwap: () => void; onMove: () => void; onSkip: () => void; onUnskip: () => void }) {
  const { state } = useStore();
  const r = recipeById(entry.recipeId) as Recipe;
  const night = dayName(entry.night);
  const { have, total, listItems } = recipeHave(r, state.setup, state.listChecked);
  const href = `/recipe/${r.id}`;
  const open = () => track('recipe_opened', { recipe_id: r.id, from: 'week' });

  if (entry.skipped) {
    return (
      <div className={s.skipped}>
        <span className={s.skippedTitle}>{night} · Skipped</span>
        <span style={{ fontSize: 14, lineHeight: 1.45 }}>
          {entry.skipped === 'keep' ? 'Saved for next week. Its ingredients stay on your list.' : `${listItems} items came off this week's list.`}
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          <button type="button" className={ui.linkBtn} onClick={onUnskip}>Undo</button>
          <button type="button" className={ui.linkBtn} onClick={onSwap}>Add a dinner</button>
        </div>
      </div>
    );
  }
  const extraTags = r.filterTags.slice(0, 1);
  const more = r.filterTags.length - extraTags.length;
  return (
    <article className={s.card} aria-label={`${night}: ${r.title}`}>
      <Link href={href} className={s.media} aria-label={`Open ${r.title}`} onClick={open}>
        <span className={s.ph}>[Dish photo: {r.title}]</span>
        <span className={s.scrim} aria-hidden="true" />
        <span className={s.night}>{night}</span>
        <span className={s.tags}>
          <GoalTag />
          {r.familiar && <FamilyTag />}
          {extraTags.map((t) => <FilterTag key={t}>{t}</FilterTag>)}
          {more > 0 && <FilterTag>+{more}</FilterTag>}
        </span>
      </Link>
      <Link href={href} className={s.body} onClick={open}>
        <span className={s.by}>By {r.by}</span>
        <span className={s.title}>{r.title}</span>
        <span className={s.meta}>{r.minutes} min · You have {have} of {total}</span>
        {r.familiar && r.adapt && <span className={s.adapt}><strong>Made {GOAL.tag}:</strong> {r.adapt}</span>}
      </Link>
      <div className={s.nuts} aria-label="Per serving">
        <span className={s.stat}><span className={s.sv}>{r.nutrition.fiberG} g</span><span className={s.sl}>fiber</span></span>
        <span className={s.stat}><span className={s.sv}>{r.nutrition.proteinG} g</span><span className={s.sl}>protein</span></span>
        <span className={s.stat}><span className={s.sv}>{r.nutrition.satFatG} g</span><span className={s.sl}>sat fat</span></span>
      </div>
      <div className={s.foot}>
        <button type="button" className={s.act} onClick={onSwap} aria-label={`Swap ${night}'s dinner`}><SwapIcon />Swap</button>
        <button type="button" className={s.act} onClick={onMove} aria-label={`Move ${night}'s dinner`}><CalendarIcon />Move</button>
        <button type="button" className={s.act} onClick={onSkip} aria-label={`Skip ${night}`}><SkipIcon />Skip</button>
      </div>
    </article>
  );
}
