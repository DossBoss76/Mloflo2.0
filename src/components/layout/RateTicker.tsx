import { Search, Bell, TrendingDown, TrendingUp } from 'lucide-react';

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
  const color = isUp ? '#ff5c5c' : '#04d39e';
  const Arrow = isUp ? TrendingUp : TrendingDown;
  return (
    <div className="flex items-center gap-2 flex-shrink-0 mr-8">
      <span className="text-[11px] text-[#7A8597] font-medium whitespace-nowrap">{r.label}</span>
      <span className="text-[12px] font-bold text-[#e8eaed] font-mono">{r.rate}</span>
      <Arrow size={11} style={{ color }} />
      <span className="text-[11px] font-mono" style={{ color }}>{r.change}</span>
    </div>
  );
}

export function RateTicker() {
  return (
    <div className="flex items-center gap-4 px-5 py-2 border-b border-white/[0.06] bg-[#0b0f15] flex-shrink-0">
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
        }
        .ticker-mask:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="ticker-mask flex-1 min-w-0 overflow-hidden relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)',
        }}
      >
        <div className="ticker-track flex w-max">
          {RATES.map((r, i) => <RateItem key={`a-${i}`} r={r} />)}
          {RATES.map((r, i) => <RateItem key={`b-${i}`} r={r} />)}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10141a] border border-white/[0.06]">
          <Search size={12} className="text-[#5a6474]" />
          <input
            placeholder="Search deals..."
            className="bg-transparent border-none outline-none text-[12px] text-[#e8eaed] placeholder:text-[#5a6474] w-32"
          />
        </div>
        <button className="relative w-8 h-8 rounded-lg bg-[#10141a] border border-white/[0.06] flex items-center justify-center text-[#8c9199] hover:text-[#e8eaed] transition-colors">
          <Bell size={14} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff5c5c] text-[9px] font-bold text-white flex items-center justify-center font-mono">3</span>
        </button>
      </div>
    </div>
  );
}
