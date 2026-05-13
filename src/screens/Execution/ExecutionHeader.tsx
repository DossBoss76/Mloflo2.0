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
    <div
      className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 py-5"
      style={{ background: '#070A12', borderBottom: '1px solid rgba(45,140,255,0.15)' }}
    >
      <div>
        <div className="fx-label mb-1.5">Welcome Back</div>
        <div className="font-bold text-[24px] text-fx-text tracking-tight leading-tight">Good morning, Marcus.</div>
        <div className="text-[12px] text-fx-text-3 mt-1">
          Tuesday · March 18 · <span className="text-fx-text-2 font-semibold">{actionCount} action{actionCount !== 1 ? 's' : ''}</span> need you · 9 days left in March
        </div>
      </div>

      <div
        className="flex items-stretch rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B1726 0%, #0F2635 100%)',
          border: '1px solid rgba(34,211,238,0.20)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          padding: '14px 22px',
        }}
      >
        <div className="flex flex-col justify-center pr-6" style={{ borderRight: '1px solid rgba(148,163,184,0.10)' }}>
          <div className="fx-label mb-1.5">Projected</div>
          <div className="font-bold text-[24px] text-fx-text leading-none tabular">$14,200</div>
          <div className="text-[11px] text-fx-text-3 mt-1 tabular">of $22,000 goal</div>
        </div>

        <div className="flex flex-col justify-center px-6" style={{ borderRight: '1px solid rgba(148,163,184,0.10)' }}>
          <div className="fx-label mb-1.5">Gap</div>
          <div className="font-bold text-[20px] leading-none tabular" style={{ color: '#FFB020' }}>$7,800</div>
          <div className="text-[11px] text-fx-text-3 mt-1">9 days remaining</div>
        </div>

        <div className="flex flex-col justify-center pl-6">
          <div className="fx-label mb-1.5">Goal</div>
          <div className="font-bold text-[20px] leading-none tabular" style={{ color: '#00E58C' }}>65%</div>
          <div className="mt-2 mb-1 fx-track" style={{ width: 100, height: 5 }}>
            <div className="fx-track-fill" style={{ width: `${progressWidth}%` }} />
          </div>
          <div className="text-[11px] text-fx-text-3">to monthly goal</div>
        </div>
      </div>
    </div>
  );
}
