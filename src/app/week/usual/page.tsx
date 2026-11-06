'use client';
import { useState } from 'react';
import { BackLink, Button, ButtonLink, Chip, ui } from '@/components/ui';
import { CameraIcon } from '@/components/Icons';
import { GOAL } from '@/data/goal';
import { USUAL_KEEPS } from '@/data/setupOptions';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';
import s from './usual.module.css';

// Saved locally and shown as sent. TODO(post-MVP): route to the test kitchen; nothing is processed here.
export default function UsualDinner() {
  const { dispatch } = useStore();
  const [sent, setSent] = useState(false);
  const [dish, setDish] = useState('');
  const [whatsIn, setWhatsIn] = useState('');
  const [link, setLink] = useState('');
  const [keeps, setKeeps] = useState<string[]>([]);
  const flip = (k: string) => setKeeps(keeps.includes(k) ? keeps.filter((x) => x !== k) : [...keeps, k]);
  const dishName = dish.trim() ? dish.trim().toLowerCase() : 'dinner';

  return (
    <main className={s.screen}>
      <header className={s.header}><BackLink href="/week" label="Back to your week" /></header>
      {!sent ? (
        <div className={s.stack}>
          <div className={s.head}>
            <h1 className={s.h1}>Make my usual dinner work</h1>
            <p className={s.lead}>Tell us a dinner your household already loves. Our test kitchen will send back an {GOAL.tag} version that still tastes like yours.</p>
          </div>
          <div className={s.head}>
            <label htmlFor="dish" className={s.lab}>What&apos;s the dinner?</label>
            <input id="dish" type="text" className={ui.input} placeholder="e.g. my mom's pasta bake" value={dish} onChange={(e) => setDish(e.target.value)} />
          </div>
          <div className={s.head}>
            <label htmlFor="whatsin" className={s.lab}>What goes in it?</label>
            <textarea id="whatsin" className={`${ui.input} ${ui.textarea}`} rows={3} placeholder="List what you usually use" value={whatsIn} onChange={(e) => setWhatsIn(e.target.value)} />
          </div>
          <div className={s.head}>
            <label htmlFor="link" className={s.lab}>Got a link or a photo? <span className={ui.muted} style={{ fontWeight: 500 }}>(optional)</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input id="link" type="url" className={ui.input} style={{ flex: 1, minWidth: 0 }} placeholder="Paste a recipe link" value={link} onChange={(e) => setLink(e.target.value)} />
              {/* TODO(post-MVP): photo upload. */}
              <button type="button" className={s.photo} aria-label="Add a photo"><CameraIcon /></button>
            </div>
          </div>
          <div className={s.head}>
            <span className={s.lab}>What has to stay?</span>
            <div role="group" aria-label="What has to stay" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {USUAL_KEEPS.map((k) => <Chip key={k} small on={keeps.includes(k)} onClick={() => flip(k)}>{k}</Chip>)}
            </div>
          </div>
          <div className={s.changes}><strong>What usually changes:</strong> leaner meat or half meat, half lentils; part-skim cheese, used where you taste it; whole-grain pasta; more vegetables in the sauce.</div>
          <Button onClick={() => {
            dispatch({ type: 'submitUsual', usual: { dish, whatsIn, link, keeps, at: new Date().toISOString() } });
            track('usual_dinner_submitted', { has_link: !!link.trim(), keeps, dish_length: dish.trim().length });
            setSent(true);
          }}>Send to the test kitchen</Button>
          <span className={s.fine}>We&apos;ll reply within 2 days. Your adapted dinner joins next week&apos;s plan.</span>
        </div>
      ) : (
        <div className={s.stack}>
          <span className={s.script} aria-hidden="true">Got it!</span>
          <h1 className={s.h1}>Your {dishName} is in the test kitchen</h1>
          <p className={s.lead}>We&apos;ll send your {GOAL.tag} version by Saturday, in time for next week&apos;s plan.</p>
          <div className={s.expect}>
            <span className={ui.eyebrow} style={{ fontSize: 12 }}>What to expect</span>
            <div className={s.step}><span>1</span><span>Same dish, same cheesy top. We change how it&apos;s made, not what it is.</span></div>
            <div className={s.step}><span>2</span><span>A short note on each change and why it helps your LDL.</span></div>
            <div className={s.step}><span>3</span><span>It shows up in your week as a Family favorite, with its ingredients on your list.</span></div>
          </div>
          <ButtonLink href="/week">Back to my week</ButtonLink>
          <button type="button" className={ui.linkBtn} style={{ alignSelf: 'center' }} onClick={() => { setSent(false); setDish(''); setWhatsIn(''); setLink(''); setKeeps([]); }}>Send another dinner</button>
        </div>
      )}
    </main>
  );
}
