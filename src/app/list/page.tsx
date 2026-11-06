'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BackLink, Button, Toast, cx, ui } from '@/components/ui';
import { CheckIcon } from '@/components/Icons';
import { useRequireSetup, useStore } from '@/lib/store';
import { deriveList, listAsText } from '@/lib/list';
import { track } from '@/lib/analytics';
import s from './list.module.css';

export default function ListScreen() {
  const ready = useRequireSetup();
  const { state, dispatch } = useStore();
  const [status, setStatus] = useState('');
  if (!ready) return null;

  // Derived from the plan every render; never stored.
  const list = deriveList(state.plan, state.setup, state.servingsOverride);
  const items = list.groups.flatMap((g) => g.items);
  const left = items.filter((i) => !state.listChecked[i.key]).length;

  const copy = async (method: 'copy' | 'share') => {
    const text = listAsText(list, state.listChecked);
    try {
      if (method === 'share' && typeof navigator.share === 'function') {
        await navigator.share({ title: "This week's list", text });
      } else {
        await navigator.clipboard.writeText(text);
        setStatus('List copied.');
        method = 'copy';
      }
      track('list_copied', { method, item_count: items.length, left });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setStatus("Couldn't copy the list on this browser.");
    }
  };

  return (
    <main className={s.page}>
      <header className={s.header}><BackLink href="/week" label="Back to this week" /></header>
      <div className={s.intro}>
        <h1 className={s.h1}>This week&apos;s list</h1>
        <p style={{ fontSize: 16 }}>{list.dinnerCount} {list.dinnerCount === 1 ? 'dinner' : 'dinners'} · {left} of {items.length} left to grab</p>
        <div className={s.note}>
          <CheckIcon size={20} strokeWidth={2.4} />
          <span><strong>One list for your whole week.</strong> Swaps, moves and skips update it automatically, so nothing is ever doubled.</span>
        </div>
      </div>
      <div className={s.groups}>
        {list.groups.map((g) => (
          <section key={g.aisle} className={s.group} aria-label={g.aisle}>
            <span className={s.grp}>{g.aisle}</span>
            <div className={s.box}>
              {g.items.map((i) => {
                const got = !!state.listChecked[i.key];
                return (
                  <label key={i.key} htmlFor={`l-${i.key}`} className={s.row}>
                    <input type="checkbox" id={`l-${i.key}`} checked={got} onChange={(e) => {
                      dispatch({ type: 'setListItem', key: i.key, checked: e.target.checked });
                      track('list_item_checked', { item: i.key, checked: e.target.checked, source: 'list' });
                    }} />
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span className={cx(s.name, got && s.got)}>{i.name}</span>
                      <span style={{ fontSize: 12 }} className={ui.muted}>{i.nextWeekOnly ? 'For next week' : `For ${i.nights.join(', ')}`}</span>
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>{i.amount}</span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
        {list.kitchen.length > 0 && (
          <section aria-label="Already in your kitchen" className={s.kitchen}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Already in your kitchen</span>
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>{list.kitchen.map((k, n) => (n === 0 ? k : k.toLowerCase())).join(', ')}</span>
            <Link href="/setup/kitchen" style={{ fontSize: 14, fontWeight: 700, minHeight: 44, display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start' }}>Edit your kitchen</Link>
          </section>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 32 }} />
      {status && <div className={s.toast}><Toast message={status} /></div>}
      <footer className={ui.stickyFoot} style={{ padding: '12px 16px 26px' }}>
        <Button variant="secondary" style={{ width: 'auto', flexShrink: 0 }} onClick={() => copy('share')}>Share</Button>
        <Button style={{ flex: 1 }} onClick={() => copy('copy')}>Copy list</Button>
      </footer>
    </main>
  );
}
