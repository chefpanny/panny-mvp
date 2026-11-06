import type { Metadata, Viewport } from 'next';
import { Fraunces, Yellowtail, DM_Sans } from 'next/font/google';
import { StoreProvider, ScreenTracker } from '@/lib/store';
import '@/styles/globals.css';

const display = Fraunces({ subsets: ['latin'], weight: ['700', '900'], variable: '--nf-display', display: 'swap' });
const script = Yellowtail({ subsets: ['latin'], weight: '400', variable: '--nf-script', display: 'swap' });
const sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--nf-sans', display: 'swap' });

export const metadata: Metadata = { title: 'panny', description: 'Quick creator dinners for your health goal. Prototype on sample data.' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          <ScreenTracker />
          <div className="app">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
