import { ReactNode } from 'react';
import { Clock } from 'lucide-react';

type Variant = 'blue' | 'gold' | 'green';

const VARIANTS: Record<Variant, { border: string; iconBg: string; iconColor: string; btnClass: string; glow: string }> = {
  blue:  { border: '#2D8CFF', iconBg: 'rgba(45,140,255,0.15)',  iconColor: '#2D8CFF', btnClass: 'fx-btn-primary', glow: 'rgba(45,140,255,0.20)' },
  gold:  { border: '#FFB020', iconBg: 'rgba(255,176,32,0.15)',  iconColor: '#FFB020', btnClass: 'fx-btn-warning', glow: 'rgba(255,176,32,0.20)' },
  green: { border: '#00E58C', iconBg: 'rgba(0,229,140,0.15)',   iconColor: '#00E58C', btnClass: 'fx-btn-success', glow: 'rgba(0,229,140,0.20)' },
};

interface Props {
  variant: Variant;
  icon: ReactNode;
  title: string;
  description: string;
  estimate: string;
  cta: string;
  onClick?: () => void;
}

export function FxActionCard({ variant, icon, title, description, estimate, cta, onClick }: Props) {
  const v = VARIANTS[variant];
  return (
    <div
      className="relative group rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
      style={{
        background: '#101722',
        border: '1px solid rgba(148,163,184,0.12)',
        borderTop: `3px solid ${v.border}`,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 32px ${v.glow}, 0 0 0 1px ${v.border}40`;
        e.currentTarget.style.borderColor = `${v.border}50`;
        e.currentTarget.style.borderTopColor = v.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)';
        e.currentTarget.style.borderTopColor = v.border;
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: v.iconBg, color: v.iconColor }}
      >
        {icon}
      </div>
      <h3 className="text-fx-text font-semibold text-[15px] mb-1.5 tracking-tight">{title}</h3>
      <p className="text-fx-text-2 text-[12.5px] leading-relaxed mb-5 min-h-[40px]">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-fx-text-3 text-[11px]">
          <Clock size={11} /> <span className="tabular">{estimate}</span>
        </div>
        <button className={`${v.btnClass} text-[12px] px-3.5 py-2`}>
          {cta}
        </button>
      </div>
    </div>
  );
}
