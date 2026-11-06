'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BackLink, Button, GoalTag, cx, ui } from '@/components/ui';
import { BookmarkIcon, CheckIcon, ChevronRight, CloseIcon, ExternalIcon, FlipIcon, PlayIcon } from '@/components/Icons';
import { recipeById } from '@/data/recipes';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';
import { ingredientAmount, stepParts } from '@/lib/amounts';
import { inPantry } from '@/lib/list';
import { nutrientTiles, recipeFacts, recipeNight, recipeServings } from '@/lib/recipeView';
import s from './recipe.module.css';

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const r = recipeById(id);
  const { state, dispatch, hydrated } = useStore();
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    if (hydrated && r) track('recipe_opened', { recipe_id: r.id, from: 'recipe_page' });
  }, [hydrated, r]);

  if (!hydrated) return null;
  if (!r) return <main style={{ padding: 24 }}><p>We couldn&apos;t find that recipe. <Link href="/week">Back to your week</Link></p></main>;

  const servings = recipeServings(state, r.id);
  const night = recipeNight(state, r.id);
  const eyebrow = night ? `Recipe for · ${night}` : 'Recipe';
  const setServings = (n: number) => dispatch({ type: 'setServings', recipeId: r.id, servings: Math.max(1, Math.min(12, n)) });
  const items = r.ingredients.map((ing) => {
    const pantry = inPantry(ing, state.setup);
    return { ing, pantry, have: pantry || !!state.listChecked[ing.key], amt: ingredientAmount(r, ing, servings) };
  });
  const haveCount = items.filter((i) => i.have).length;
  const flip = () => {
    setFlipped(!flipped);
    track('recipe_card_flipped', { recipe_id: r.id, side: flipped ? 'ingredients' : 'steps' });
  };

  return (
    <main className={s.page}>
      <header className={s.header}>
        <BackLink href="/week" label="Back to this week" />
        <span className={ui.wordmark} style={{ fontSize: 20 }}>panny</span>
        <button type="button" className={ui.iconBtn} aria-label="Save recipe" aria-pressed={!!state.saved[r.id]} onClick={() => dispatch({ type: 'toggleSaved', recipeId: r.id })}>
          <BookmarkIcon filled={!!state.saved[r.id]} />
        </button>
      </header>

      <div className={s.content}>
        <section aria-label="Recipe summary" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className={s.h1}>{r.title}</h1>
          <div className={s.tags}>{recipeFacts(r).map((t) => <span key={t} className={s.tag}>{t}</span>)}</div>
        </section>

        <button type="button" className={s.creator} onClick={() => setVideo(true)} aria-label={`Play the creator's ${r.videoLength} video here`}>
          <span className={s.thumb}>
            <span className={s.play}><PlayIcon /></span>
            <span className={s.dur}>{r.videoLength}</span>
          </span>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className={s.creatorName}>Recipe by {r.creatorName}</span>
            <span style={{ fontSize: 13 }} className={ui.muted}>{r.by}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Watch the video here</span>
          </span>
        </button>

        <section aria-label="Nutrition per serving" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className={s.nutHead}><span className={s.lab}>Per serving</span><span style={{ fontSize: 12 }} className={ui.muted}>% of a day&apos;s value</span></div>
          <div className={s.nutGrid}>
            {nutrientTiles(r).map((n) => (
              <div key={n.label} className={s.stat}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}><span className={s.sv}>{n.value}</span><span style={{ fontSize: 12, fontWeight: 700 }}>{n.dv}%</span></div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{n.label}</span>
                <div className={s.bar}><div className={s.fill} style={{ width: `${Math.min(100, n.dv)}%` }} /></div>
                {n.note && <span style={{ fontSize: 11 }} className={ui.muted}>{n.note}</span>}
              </div>
            ))}
          </div>
          <span className={s.tiny}>Calculated from this recipe&apos;s amounts with USDA data; Daily Values from FDA. Sample values in this mock.</span>
        </section>

        <Link href={`/recipe/${r.id}/why`} className={s.why} aria-label="Why this dinner is LDL-friendly">
          <GoalTag />
          <span className={s.whyLine}>{r.fitLine}</span>
          <span className={s.under}>How it works<ChevronRight /></span>
        </Link>

        <section aria-label="Ingredients and steps" className={s.cardWrap}>
          <div className={cx(s.flipper, flipped && s.flipped)}>
            <div className={cx(s.face, s.front)} aria-hidden={flipped} inert={flipped}>
              <div className={s.band} />
              <div className={s.sheet}>
                <div className={s.r56}>
                  <span className={s.lab}>{eyebrow}</span>
                  <div role="group" aria-label="Servings" className={s.stepper}>
                    <button type="button" className={s.stepBtn} aria-label="Fewer servings" onClick={() => setServings(servings - 1)}>–</button>
                    <span aria-live="polite" className={s.serves}>Serves {servings}</span>
                    <button type="button" className={s.stepBtn} aria-label="More servings" onClick={() => setServings(servings + 1)}>+</button>
                  </div>
                </div>
                <div className={s.cardTitle}>Ingredients</div>
                <div className={s.helper}>Tick what you have. We&apos;ll take it off this week&apos;s list.</div>
                {items.map(({ ing, pantry, have, amt }) => (
                  <label key={ing.id} htmlFor={`r-${ing.id}`} className={s.ing}>
                    <input type="checkbox" id={`r-${ing.id}`} checked={have} disabled={pantry} onChange={(e) => {
                      dispatch({ type: 'setListItem', key: ing.key, checked: e.target.checked });
                      track('list_item_checked', { recipe_id: r.id, item: ing.key, checked: e.target.checked, source: 'recipe' });
                    }} />
                    <span className={s.ingText}>
                      <span className={cx(s.ingName, have && s.ingHave)}>{ing.name}</span>
                      <span className={s.ingNote}>{ing.note}</span>
                    </span>
                    <span className={s.amt}>{amt}</span>
                  </label>
                ))}
                <div style={{ flex: 1 }} />
                <div className={s.r56}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{haveCount} on hand · {items.length - haveCount} to buy</span>
                  <Link href="/list" className={s.listLink}><CheckIcon size={16} />On this week&apos;s list</Link>
                </div>
                <div className={s.r56} style={{ justifyContent: 'flex-end' }}>
                  <button type="button" className={s.flipBtn} onClick={flip}>Flip for the steps<FlipIcon /></button>
                </div>
              </div>
            </div>

            <div className={cx(s.face, s.back)} aria-hidden={!flipped} inert={!flipped}>
              <div className={s.band} />
              <div className={s.sheet}>
                <div className={s.r28} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 28 }}>
                  <span className={s.lab}>{eyebrow}</span><span style={{ fontSize: 12 }} className={ui.muted}>Serves {servings}</span>
                </div>
                <div className={s.cardTitle}>Steps</div>
                <ol className={s.steps}>
                  {r.steps.map((st, i) => (
                    <li key={i} className={s.step}>
                      <span className={s.num} aria-hidden="true">{i + 1}</span>
                      <p className={s.stepText}>{stepParts(r, st, servings).map((p, k) => p.amount ? <span key={k} className={s.hl}>{p.text}</span> : <span key={k}>{p.text}</span>)}</p>
                    </li>
                  ))}
                </ol>
                <div style={{ flex: 1, minHeight: 28 }} />
                <div className={s.r56}>
                  <button type="button" className={s.flipBtn} onClick={flip}><FlipIcon />Back to ingredients</button>
                  <Link href={`/checkin/${r.id}`} className={s.listLink}>Made it?</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Recipe credit" className={s.credit}>
          <p>Video by {r.creatorName} through {r.platform}&apos;s embed. Ingredients and steps written by Panny from the public post{r.testKitchen ? ' and cooked in the Panny test kitchen' : ''}.</p>
          <div className={s.creditLinks}>
            {/* TODO(post-MVP): link to the real post. */}
            <a href="#" aria-label={`Open in ${r.platform} (leaves Panny)`}>Open in {r.platform}<ExternalIcon /></a>
            <a href="#claim">Is this yours? Claim it</a>
            <a href="#report" style={{ fontWeight: 500 }}>Report a problem</a>
          </div>
        </section>
      </div>

      <div style={{ flex: 1, minHeight: 28 }} />
      {/* The one way into cooking mode. */}
      <footer className={ui.stickyFoot} style={{ padding: '12px 16px 26px' }}>
        <Button onClick={() => { track('cooking_started', { recipe_id: r.id, servings }); router.push(`/recipe/${r.id}/cook`); }}>Start cooking</Button>
      </footer>

      {video && (
        <div role="dialog" aria-modal="true" aria-label="Creator video" className={s.overlay} onClick={() => setVideo(false)}>
          <div className={s.overlayInner} onClick={(e) => e.stopPropagation()}>
            <div className={s.overlayTop}>
              <span>Playing from {r.platform}</span>
              <button type="button" className={cx(ui.iconBtn, s.closeBtn)} aria-label="Close video" onClick={() => setVideo(false)} autoFocus><CloseIcon size={20} /></button>
            </div>
            {/* TODO(post-MVP): the platform's own player. No embeds or network calls in the MVP. */}
            <div className={s.player}>
              <strong style={{ fontSize: 16 }}>{r.creatorName}&apos;s video plays here.</strong>
              <span style={{ fontSize: 13 }}>{r.title} · {r.by} · {r.videoLength}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
