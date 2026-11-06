'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { readEvents, type LoggedEvent } from '@/lib/analytics';
import { resetAll, useStore } from '@/lib/store';

// Hidden page for testing sessions. Not linked from the app.
export default function Debug() {
  const { state } = useStore();
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  useEffect(() => {
    setEvents(readEvents());
    const t = setInterval(() => setEvents(readEvents()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ font: '900 32px/1 var(--font-display)' }}>Debug</h1>
      <Button onClick={() => { if (confirm('Clear all Panny data on this device?')) { resetAll(); location.href = '/'; } }}>Start over</Button>
      <h2 style={{ font: '900 22px/1.1 var(--font-display)' }}>Events ({events.length})</h2>
      <ol reversed style={{ margin: 0, paddingLeft: 24, fontSize: 13, display: 'flex', flexDirection: 'column-reverse', gap: 6 }}>
        {events.map((e, i) => (
          <li key={i}><strong>{e.event}</strong> <span style={{ color: 'var(--navy-muted)' }}>{e.at.slice(11, 19)}</span>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>{JSON.stringify(e.props)}</pre></li>
        ))}
      </ol>
      <h2 style={{ font: '900 22px/1.1 var(--font-display)' }}>State</h2>
      <pre style={{ margin: 0, padding: 12, background: 'var(--white)', border: 'var(--stroke-ink) solid var(--navy)', borderRadius: 'var(--radius-md)', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(state, null, 2)}</pre>
    </main>
  );
}
