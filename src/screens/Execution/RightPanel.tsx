import { CheckCircle, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WEEKLY_PLAN, AI_AGENTS } from '../../constants/mockData';

function PanelCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-12 p-4 ${className}`}
      style={{ background: '#1c222c', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-barlow text-[10px] text-[#4d5563] uppercase tracking-[0.14em] mb-3">
      {children}
    </div>
  );
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
      style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}
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
                <span className="font-roboto text-[12px] text-[#8c9199]">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-barlow text-[11px]"
                    style={{ color: item.complete ? '#04d39e' : '#4d5563' }}
                  >
                    {item.current}/{item.total}
                  </span>
                  {item.complete && <CheckCircle size={11} style={{ color: '#04d39e' }} />}
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
            className={`flex items-center gap-2.5 rounded-lg px-1 py-1 -mx-1 transition-colors ${agent.clickable ? 'cursor-pointer hover:bg-[#222832]' : ''}`}
            onClick={agent.clickable ? () => openDrawer({ type: 'ai-review', title: agent.name }) : undefined}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-dot" style={{ background: agent.color, boxShadow: `0 0 4px ${agent.color}` }}/>
            <span className="font-roboto text-[12px] text-[#e8eaed] flex-1">{agent.name}</span>
            {agent.clickable ? (
              <div className="flex items-center gap-1">
                <span className="font-barlow text-[11px] underline underline-offset-2" style={{ color: '#04d39e' }}>{agent.count}</span>
                <ChevronRight size={12} style={{ color: '#04d39e' }} />
              </div>
            ) : (
              <span className="font-barlow text-[11px] text-[#4d5563]">{agent.count}</span>
            )}
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

const MINI_DEALS = [
  { id: 'd7', borrower: 'Sarah Chen', stage: 'DOCS PENDING · 8 DAYS', commission: '$3,200', color: '#ff5c5c' },
  { id: 'd10', borrower: 'Priya Nair', stage: 'CTC · CLOSING FRI', commission: '$2,640', color: '#04d39e' },
  { id: 'd3', borrower: 'James Okafor', stage: 'PRE-APPROVAL', commission: '$2,800', color: '#6dc2f1' },
  { id: 'd5', borrower: 'Tom & Lisa Park', stage: 'APPLICATION', commission: '$3,800', color: '#f5a623' },
  { id: 'd14', borrower: 'Keisha Brown', stage: 'LEAD · NEW', commission: '$1,900', color: '#4d5563' },
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
              className="flex items-center gap-2.5 cursor-pointer hover:bg-[#222832] -mx-2 px-2 py-1.5 rounded-xl transition-colors group"
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
                <div className="font-barlow text-[10px] text-[#4d5563] truncate">{item.stage}</div>
              </div>
              <span className="font-barlow text-[12px] text-[#8c9199] flex-shrink-0">{item.commission}</span>
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
