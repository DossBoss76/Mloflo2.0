import { ReactNode } from 'react';

type Variant = 'blue' | 'green' | 'gold' | 'red' | 'cyan' | 'neutral';

const STYLES: Record<Variant, { bg: string; text: string; border: string }> = {
  blue:    { bg: 'rgba(45,140,255,0.12)', text: '#2D8CFF', border: 'rgba(45,140,255,0.35)' },
  green:   { bg: 'rgba(0,229,140,0.12)',  text: '#00E58C', border: 'rgba(0,229,140,0.35)' },
  gold:    { bg: 'rgba(255,176,32,0.12)', text: '#FFB020', border: 'rgba(255,176,32,0.35)' },
  red:     { bg: 'rgba(255,77,94,0.12)',  text: '#FF4D5E', border: 'rgba(255,77,94,0.35)' },
  cyan:    { bg: 'rgba(34,211,238,0.12)', text: '#22D3EE', border: 'rgba(34,211,238,0.35)' },
  neutral: { bg: 'rgba(148,163,184,0.10)', text: '#94A3B8', border: 'rgba(148,163,184,0.20)' },
};

interface Props {
  variant?: Variant;
  children: ReactNode;
  pulseDot?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ variant = 'blue', children, pulseDot, size = 'sm' }: Props) {
  const s = STYLES[variant];
  const padding = size === 'sm' ? 'px-2.5 py-0.5' : 'px-3 py-1';
  const fontSize = size === 'sm' ? 'text-[10px]' : 'text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${padding} ${fontSize}`}
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {pulseDot && (
        <span
          className="relative w-1.5 h-1.5 rounded-full animate-pulse-dot"
          style={{ background: s.text }}
        />
      )}
      {children}
    </span>
  );
}
