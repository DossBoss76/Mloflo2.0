import { CheckCircle, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WEEKLY_PLAN, AI_AGENTS } from '../../constants/mockData';

function PanelCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`fx-card p-5 ${className}`}>
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <div className="fx-label mb-3">{children}</div>;
}

function ProgressBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div
      className="mt-1 rounded-full overflow-hidden"
      style={{ height: 5, background: 'rgba(148,163,184,0.18)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, background: color, transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

function WeeklyPlanPanel() {
  return (
    <PanelCard>
      <PanelTitle>Weekly Plan · Tuesday</PanelTitle>
      <div className="flex flex-col gap-3">
        {WEEKLY_PLAN.map((item, i) => {
          const pct = Math.round((item.current / item.total) * 100);
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-fx-text-2 font-medium">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[11px] tabular font-semibold"
                    style={{ color: item.complete ? '#00E58C' : '#64748B' }}
                  >
                    {item.current}/{item.total}
                  </span>
                  {item.complete && <CheckCircle size={11} style={{ color: '#00E58C' }} />}
                </div>
              </div>
              <ProgressBar pct={pct} color={item.color} delay={i * 150} />
            </div>
          );
        })}
      </div>
    </PanelCard>
  );
}

function AiWorkforcePanel() {
  const { openDrawer } = useApp();

  return (
    <PanelCard>
      <PanelTitle>AI Workforce · Running Now</PanelTitle>
      <div className="flex flex-col gap-2.5">
        {AI_AGENTS.map(agent => (
          <div
            key={agent.name}
            className={`flex items-center gap-2.5 rounded-lg px-1 py-1 -mx-1 transition-colors ${agent.clickable ? 'cursor-pointer hover:bg-white/[0.04]' : ''}`}
            onClick={agent.clickable ? () => openDrawer({ type: 'ai-review', title: agent.name }) : undefined}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-dot" style={{ background: agent.color, boxShadow: `0 0 4px ${agent.color}` }}/>
            <span className="text-[12.5px] text-fx-text font-medium flex-1">{agent.name}</span>
            {agent.clickable ? (
              <div className="flex items-center gap-1">
                <span className="text-[11px] tabular font-semibold" style={{ color: '#00E58C' }}>{agent.count}</span>
                <ChevronRight size={12} style={{ color: '#00E58C' }} />
              </div>
            ) : (
              <span className="text-[11px] tabular font-semibold text-[#4d5563]">{agent.count}</span>
            )}
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

const MINI_DEALS = [
  { id: 'd7', borrower: 'Sarah Chen', stage: 'DOCS PENDING · 8 DAYS', commission: '$3,200', color: '#FF4D5E' },
  { id: 'd10', borrower: 'Priya Nair', stage: 'CTC · CLOSING FRI', commission: '$2,640', color: '#00E58C' },
  { id: 'd3', borrower: 'James Okafor', stage: 'PRE-APPROVAL', commission: '$2,800', color: '#2D8CFF' },
  { id: 'd5', borrower: 'Tom & Lisa Park', stage: 'APPLICATION', commission: '$3,800', color: '#FFB020' },
  { id: 'd14', borrower: 'Keisha Brown', stage: 'LEAD · NEW', commission: '$1,900', color: '#64748B' },
];

function DealFloMiniPanel() {
  const { openDrawer, deals } = useApp();

  return (
    <PanelCard>
      <PanelTitle>Deal Flo · Active</PanelTitle>
      <div className="flex flex-col gap-2">
        {MINI_DEALS.map(item => {
          const deal = deals.find(d => d.id === item.id);
          return (
            <div
              key={item.id}
              className="flex items-center gap-2.5 cursor-pointer hover:bg-white/[0.04] -mx-2 px-2 py-1.5 rounded-xl transition-colors group"
              onClick={() => openDrawer({ type: 'deal-detail', deal: deal || { id: item.id, borrower: item.borrower, commission: item.commission } as any })}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-roboto font-medium text-[12px] text-[#e8eaed] truncate group-hover:text-white">
                  {item.borrower}
                </div>
                <div className="text-[10px] text-fx-text-3 truncate uppercase tracking-[0.10em] font-semibold mt-0.5">{item.stage}</div>
              </div>
              <span className="text-[12px] text-fx-text-2 flex-shrink-0 tabular font-semibold">{item.commission}</span>
            </div>
          );
        })}
      </div>
    </PanelCard>
  );
}

export function RightPanel() {
  return (
    <div className="flex flex-col gap-3 w-[280px] flex-shrink-0">
      <WeeklyPlanPanel />
      <AiWorkforcePanel />
      <DealFloMiniPanel />
    </div>
  );
}
