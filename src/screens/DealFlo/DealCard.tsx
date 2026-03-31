import { AlertCircle } from 'lucide-react';
import { Deal } from '../../constants/mockData';
import { useApp } from '../../context/AppContext';

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent, dealId: string) => void;
}

export function DealCard({ deal, onDragStart }: DealCardProps) {
  const { openDrawer } = useApp();

  return (
    <div
      className="deal-card rounded-10 px-3 py-3 mb-2 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all hover:translate-y-[-1px]"
      style={{ background: '#1c222c', border: '1px solid rgba(255,255,255,0.08)' }}
      draggable
      onDragStart={e => onDragStart(e, deal.id)}
      onClick={() => openDrawer({ type: 'deal-detail', deal })}
    >
      <div className="flex items-start justify-between mb-1.5">
        <div className="font-palanquin font-semibold text-[13px] text-[#e8eaed] leading-snug flex-1 pr-1">
          {deal.borrower}
        </div>
        {deal.flagged && (
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#ff5c5c' }} />
        )}
      </div>

      <div className="font-barlow font-semibold text-[12px] mb-1" style={{ color: '#04d39e' }}>
        {deal.loanAmount}
      </div>

      <div className="font-barlow text-[10px] text-[#4d5563] mb-1.5">
        Day {deal.dayInStage} in stage
      </div>

      <div className="font-roboto text-[11px] text-[#4d5563] leading-relaxed line-clamp-2">
        {deal.statusNote}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
        <span className="font-barlow text-[11px] text-[#4d5563]">Est. commission</span>
        <span className="font-barlow font-semibold text-[12px] text-[#8c9199]">{deal.commission}</span>
      </div>
    </div>
  );
}
