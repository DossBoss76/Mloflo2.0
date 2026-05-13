import { Check } from 'lucide-react';

export type MilestoneStatus = 'complete' | 'active' | 'pending' | 'blocked' | 'attention';

export interface Milestone {
  id: string;
  title: string;
  status: MilestoneStatus;
  detail?: string;
}

const STATUS: Record<MilestoneStatus, { color: string; bg: string; label: string; ring?: string }> = {
  complete:  { color: '#00E58C', bg: 'rgba(0,229,140,0.15)',  label: 'Complete' },
  active:    { color: '#2D8CFF', bg: 'rgba(45,140,255,0.12)', label: 'In Progress', ring: 'rgba(45,140,255,0.40)' },
  pending:   { color: '#64748B', bg: 'rgba(148,163,184,0.10)', label: 'Up Next' },
  blocked:   { color: '#FF4D5E', bg: 'rgba(255,77,94,0.12)',  label: 'Blocked' },
  attention: { color: '#FFB020', bg: 'rgba(255,176,32,0.12)', label: 'Needs Attention' },
};

export function MilestoneList({ items }: { items: Milestone[] }) {
  return (
    <div className="fx-card p-5 md:p-6">
      <div className="flex flex-col">
        {items.map((m, idx) => {
          const s = STATUS[m.status];
          const isLast = idx === items.length - 1;
          return (
            <div key={m.id} className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center" style={{ width: 28 }}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.status === 'active' ? 'animate-pulse-glow' : ''}`}
                  style={{
                    background: s.bg,
                    border: `1.5px solid ${s.color}`,
                    boxShadow: m.status === 'active' && s.ring ? `0 0 0 4px ${s.ring}` : 'none',
                  }}
                >
                  {m.status === 'complete' ? (
                    <Check size={13} style={{ color: s.color }} strokeWidth={3} />
                  ) : (
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  )}
                </div>
                {!isLast && <div className="w-px flex-1 my-1" style={{ background: 'rgba(148,163,184,0.12)', minHeight: 28 }} />}
              </div>
              <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-fx-text font-semibold text-[14px] tracking-tight">{m.title}</div>
                </div>
                <div className="text-[11px] font-semibold mt-0.5" style={{ color: s.color }}>
                  {s.label}{m.detail ? ` · ${m.detail}` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
