import { Search, Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Rate {
  label: string;
  rate: string;
  change: string;
  direction: 'down' | 'up';
}

const RATES: Rate[] = [
  { label: '30yr FHA', rate: '6.625%', change: '0.008', direction: 'down' },
  { label: '30yr VA', rate: '6.125%', change: '0.000', direction: 'down' },
  { label: '30yr USDA', rate: '6.496%', change: '0.005', direction: 'down' },
  { label: '30yr Conv', rate: '6.881%', change: '0.006', direction: 'up' },
  { label: '15yr Conv', rate: '6.250%', change: '0.000', direction: 'down' },
  { label: '30yr FHA Jumbo', rate: '7.125%', change: '0.012', direction: 'up' },
  { label: '20yr Conv', rate: '6.540%', change: '0.003', direction: 'down' },
  { label: '10yr Treasury', rate: '4.218%', change: '0.014', direction: 'up' },
  { label: '5/1 ARM', rate: '6.020%', change: '0.001', direction: 'down' },
];

function RateItem({ r }: { r: Rate }) {
  const isUp = r.direction === 'up';
  const color = isUp ? '#FF4D5E' : '#00E58C';
  const Arrow = isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0 mr-7 pr-7" style={{ borderRight: '1px solid rgba(148,163,184,0.10)' }}>
      <span className="text-[10.5px] uppercase tracking-[0.10em] text-fx-text-3 font-semibold whitespace-nowrap">{r.label}</span>
      <span className="text-[12.5px] font-bold tabular" style={{ color: '#2D8CFF' }}>{r.rate}</span>
      <span className="flex items-center gap-0.5 text-[11px] font-semibold tabular" style={{ color }}>
        <Arrow size={11} strokeWidth={2.5} />
        {r.change}
      </span>
    </div>
  );
}

export function RateTicker() {
  return (
    <div
      className="flex items-center gap-4 px-5 py-2 flex-shrink-0"
      style={{
        background: '#070A12',
        borderBottom: '1px solid rgba(45,140,255,0.15)',
      }}
    >
      <div
        className="ticker-mask flex-1 min-w-0 overflow-hidden relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
        }}
      >
        <div
          className="flex w-max"
          style={{ animation: 'ticker-scroll 70s linear infinite' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {RATES.map((r, i) => <RateItem key={`a-${i}`} r={r} />)}
          {RATES.map((r, i) => <RateItem key={`b-${i}`} r={r} />)}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: '#101722', border: '1px solid rgba(148,163,184,0.12)' }}
        >
          <Search size={12} className="text-fx-text-3" />
          <input
            placeholder="Search deals..."
            className="bg-transparent border-none outline-none text-[12px] text-fx-text placeholder:text-fx-text-3 w-32"
          />
        </div>
        <button
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-fx-text-2 hover:text-fx-text transition-colors"
          style={{ background: '#101722', border: '1px solid rgba(148,163,184,0.12)' }}
        >
          <Bell size={14} />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center tabular animate-pulse-dot"
            style={{ background: '#FF4D5E' }}
          >3</span>
        </button>
      </div>
    </div>
  );
}
