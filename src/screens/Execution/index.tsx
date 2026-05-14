import { useApp } from '../../context/AppContext';
import { ACTION_CARDS } from '../../constants/mockData';
import { ExecutionHeader } from './ExecutionHeader';
import { AiBriefing } from './AiBriefing';
import { ActionCard } from './ActionCard';
import { RightPanel } from './RightPanel';
import { EmptyState } from './EmptyState';

export function ExecutionScreen() {
  const { visibleCards, actionCount } = useApp();

  const cards = ACTION_CARDS.filter(c => visibleCards.includes(c.id));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ExecutionHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-5 px-6 py-5 min-h-full">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <AiBriefing />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-barlow text-[10px] text-[#4d5563] uppercase tracking-[0.14em]">
                  Today's Actions
                </span>
                <span className="font-barlow text-[10px] text-[#4d5563] uppercase tracking-[0.10em]">
                  {actionCount} remaining · ranked by revenue impact
                </span>
              </div>

              {cards.length > 0 ? (
                <div className="flex flex-col gap-[10px]">
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
