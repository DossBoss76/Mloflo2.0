import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Deal, KanbanStage } from '../../constants/mockData';
import { DealCard } from './DealCard';
import { useApp } from '../../context/AppContext';

interface KanbanColumnProps {
  id: KanbanStage;
  label: string;
  color: string;
  deals: Deal[];
  onDragStart: (e: React.DragEvent, dealId: string) => void;
  onDrop: (e: React.DragEvent, stage: KanbanStage) => void;
}

export function KanbanColumn({ id, label, color, deals, onDragStart, onDrop }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { addToast } = useApp();

  const totalCommission = deals.reduce((sum, d) => sum + d.commissionRaw, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalCommission);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e, id);
  };

  return (
    <div
      className={`kanban-col flex flex-col rounded-12 ${isDragOver ? 'drag-over' : ''}`}
      style={{
        background: '#10141a',
        border: `1px solid rgba(255,255,255,0.06)`,
        borderTop: `3px solid ${color}`,
        height: 'fit-content',
        minHeight: 240,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="px-3.5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-0.5">
          <div className="font-palanquin font-semibold text-[13px] text-[#e8eaed]">{label}</div>
          <div className="flex items-center gap-1.5">
            <span
              className="font-barlow text-[11px] font-medium px-1.5 py-0.5 rounded-md"
              style={{ background: `${color}18`, color: color }}
            >
              {deals.length}
            </span>
            <button
              onClick={() => addToast('Add deal form coming soon', 'info')}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#1c222c] text-[#4d5563] hover:text-[#8c9199] transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
        <div className="font-barlow text-[11px] text-[#4d5563]">{formattedTotal}</div>
      </div>

      <div className="p-2.5 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} />
        ))}
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-white/[0.08]">
            <span className="font-barlow text-[10px] text-[#4d5563] uppercase tracking-wide">Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
}
