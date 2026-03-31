import { useState } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { KANBAN_COLUMNS, KanbanStage } from '../../constants/mockData';
import { KanbanColumn } from './KanbanColumn';
import { useApp } from '../../context/AppContext';

type FilterType = 'all' | 'my-deals' | 'flagged';

export function DealFloScreen() {
  const { deals, moveDeal, addToast } = useApp();
  const [, setDraggingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredDeals = deals.filter(d => {
    if (filter === 'flagged') return d.flagged;
    return true;
  });

  const totalCommission = deals.reduce((sum, d) => sum + d.commissionRaw, 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalCommission);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
    setDraggingId(dealId);
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '0.4';
  };

  const handleDrop = (e: React.DragEvent, stage: KanbanStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      const deal = deals.find(d => d.id === dealId);
      if (deal && deal.stage !== stage) {
        moveDeal(dealId, stage);
        const stageLabel = KANBAN_COLUMNS.find(c => c.id === stage)?.label || stage;
        addToast(`✓ ${deal.borrower} moved to ${stageLabel}`, 'success');
      }
    }
    setDraggingId(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '';
    setDraggingId(null);
  };

  const wrappedDragStart = (e: React.DragEvent, dealId: string) => {
    handleDragStart(e, dealId);
    (e.currentTarget as HTMLElement).addEventListener('dragend', handleDragEnd as any, { once: true });
  };

  const FILTERS: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'my-deals', label: 'My Deals' },
    { id: 'flagged', label: 'Flagged' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <div className="font-palanquin font-semibold text-[22px] text-[#e8eaed]">Deal Flo</div>
          <div className="font-roboto text-[13px] text-[#4d5563] mt-0.5">
            {deals.length} active deals · {formattedTotal} projected commission
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#1c222c', border: '1px solid rgba(255,255,255,0.08)' }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-[8px] font-barlow text-[12px] transition-all ${
                  filter === f.id
                    ? 'bg-[#04d39e]/15 text-[#04d39e]'
                    : 'text-[#4d5563] hover:text-[#8c9199]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => addToast('Filter options coming soon', 'info')}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#1c222c] text-[#4d5563] hover:text-[#8c9199] transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <SlidersHorizontal size={15} />
          </button>

          <button
            onClick={() => addToast('Add deal form coming soon', 'info')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-roboto font-medium text-[13px] text-[#0a0c0f] transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#04d39e' }}
          >
            <Plus size={15} /> Add Deal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-6 py-5">
        <div className="kanban-board h-full">
          {KANBAN_COLUMNS.map(col => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              color={col.color}
              deals={filteredDeals.filter(d => d.stage === col.id)}
              onDragStart={wrappedDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
