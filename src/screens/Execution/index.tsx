import { useApp } from '../../context/AppContext';
import { ACTION_CARDS } from '../../constants/mockData';
import { ExecutionHeader } from './ExecutionHeader';
import { AiBriefing } from './AiBriefing';
import { ActionCard } from './ActionCard';
import { RightPanel } from './RightPanel';
import { EmptyState } from './EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function ExecutionScreen() {
  const { visibleCards, actionCount } = useApp();

  const cards = ACTION_CARDS.filter(c => visibleCards.includes(c.id));

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#070A12' }}>
      <ExecutionHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-6 px-6 py-6 min-h-full max-w-[1480px] mx-auto w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <AiBriefing />

            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[18px] font-bold text-fx-text tracking-tight">Today's Actions</h2>
                  <StatusBadge variant="gold" pulseDot>{actionCount} need you</StatusBadge>
                </div>
                <span className="fx-label">Ranked by revenue impact</span>
              </div>

              {cards.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {cards.map(card => (
                    <ActionCard key={card.id} card={card} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-0">
              <RightPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
