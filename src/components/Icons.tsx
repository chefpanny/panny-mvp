// Simple 2px-stroke line icons. No icon set chosen yet (README flag).
import { ICON_PATHS, type IconKey } from '@/data/foods';

type P = { size?: number; strokeWidth?: number };
const base = (size: number, sw: number) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true,
});

export const CheckIcon = ({ size = 22, strokeWidth = 3 }: P) => <svg {...base(size, strokeWidth)}><path d="M20 6L9 17l-5-5" /></svg>;
export const BackIcon = ({ size = 22, strokeWidth = 2.5 }: P) => <svg {...base(size, strokeWidth)}><path d="M15 18l-6-6 6-6" /></svg>;
export const CloseIcon = ({ size = 22, strokeWidth = 2.5 }: P) => <svg {...base(size, strokeWidth)}><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>;
export const ChevronRight = ({ size = 16, strokeWidth = 2.5 }: P) => <svg {...base(size, strokeWidth)}><path d="M9 18l6-6-6-6" /></svg>;
export const ChevronDown = ({ size = 20, strokeWidth = 2.5 }: P) => <svg {...base(size, strokeWidth)}><path d="M6 9l6 6 6-6" /></svg>;
export const SwapIcon = ({ size = 15, strokeWidth = 2.4 }: P) => <svg {...base(size, strokeWidth)}><path d="M4 9h13l-3-3" /><path d="M20 15H7l3 3" /></svg>;
export const CalendarIcon = ({ size = 15, strokeWidth = 2.2 }: P) => <svg {...base(size, strokeWidth)}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16" /><path d="M9 3v4" /><path d="M15 3v4" /></svg>;
export const SkipIcon = ({ size = 15, strokeWidth = 2.4 }: P) => <svg {...base(size, strokeWidth)}><path d="M5 5l14 14" /><circle cx="12" cy="12" r="9" /></svg>;
export const PersonIcon = ({ size = 22, strokeWidth = 2 }: P) => <svg {...base(size, strokeWidth)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>;
export const BookmarkIcon = ({ size = 20, strokeWidth = 2, filled = false }: P & { filled?: boolean }) => <svg {...base(size, strokeWidth)} fill={filled ? 'currentColor' : 'none'}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>;
export const FlipIcon = ({ size = 18, strokeWidth = 2.4 }: P) => <svg {...base(size, strokeWidth)}><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 21v-5h5" /></svg>;
export const ExternalIcon = ({ size = 14, strokeWidth = 2.4 }: P) => <svg {...base(size, strokeWidth)}><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
export const CameraIcon = ({ size = 20, strokeWidth = 2 }: P) => <svg {...base(size, strokeWidth)}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>;
export const BowlIcon = ({ size = 22, strokeWidth = 2.2 }: P) => <svg {...base(size, strokeWidth)}><path d="M3 11h18" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 4v3" /></svg>;
export const PlayIcon = ({ size = 14 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>;

export function FoodIcon({ icon, size = 22 }: { icon: IconKey; size?: number }) {
  return (
    <svg {...base(size, 2)}>
      {ICON_PATHS[icon].map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
