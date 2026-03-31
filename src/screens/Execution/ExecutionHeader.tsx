import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export function ExecutionHeader() {
  const { actionCount } = useApp();
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgressWidth(65), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-[#0a0c0f] border-b border-white/[0.06]">
      <div>
        <div className="font-palanquin font-semibold text-[20px] text-[#e8eaed]">Good morning, Marcus.</div>
        <div className="font-barlow text-[11px] text-[#4d5563] uppercase tracking-[0.12em] mt-0.5">
          Tuesday · March 18 · {actionCount} action{actionCount !== 1 ? 's' : ''} need you · 9 days left in March
        </div>
      </div>

      <div className="flex items-stretch gap-0 rounded-12 overflow-hidden border border-white/10 bg-[#1c222c]" style={{ padding: '12px 18px' }}>
        <div className="flex flex-col justify-center pr-5" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="font-barlow text-[9px] text-[#4d5563] uppercase tracking-[0.12em] mb-1">Projected this month</div>
          <div className="font-palanquin font-semibold text-[24px] text-[#e8eaed] leading-none">$14,200</div>
          <div className="font-roboto text-[11px] text-[#4d5563] mt-0.5">of $22,000 goal</div>
        </div>

        <div className="flex flex-col justify-center px-5" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="font-barlow text-[9px] text-[#4d5563] uppercase tracking-[0.12em] mb-1">Gap to close</div>
          <div className="font-palanquin font-semibold text-[18px] leading-none" style={{ color: '#f5a623' }}>$7,800</div>
          <div className="font-roboto text-[11px] text-[#4d5563] mt-0.5">9 days remaining</div>
        </div>

        <div className="flex flex-col justify-center pl-5">
          <div className="font-barlow text-[9px] text-[#4d5563] uppercase tracking-[0.12em] mb-1">Monthly goal</div>
          <div className="font-barlow font-semibold text-[18px] leading-none" style={{ color: '#04d39e' }}>65%</div>
          <div className="mt-1.5 mb-0.5 rounded-full overflow-hidden" style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressWidth}%`, background: 'linear-gradient(to right, #04d39e, #4aa2eb)' }}
            />
          </div>
          <div className="font-roboto text-[11px] text-[#4d5563]">to monthly goal</div>
        </div>
      </div>
    </div>
  );
}
