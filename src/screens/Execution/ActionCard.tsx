import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { ActionCard as ActionCardType } from '../../constants/mockData';
import { useApp } from '../../context/AppContext';

interface ActionCardProps {
  card: ActionCardType;
}

const DISMISS_OPTIONS = ['Already handled', 'Not a real lead', 'Relationship ended'];

export function ActionCard({ card }: ActionCardProps) {
  const { removeCard, addToast, openDrawer, removingCards } = useApp();
  const [showAiPopover, setShowAiPopover] = useState(false);
  const [showDismiss, setShowDismiss] = useState(false);
  const dismissRef = useRef<HTMLDivElement>(null);

  const isRemoving = removingCards.includes(card.id);

  const handlePrimary = () => {
    const drawerTypeMap: Record<string, 'call' | 'review-message' | 'view-deal' | 'view-application' | 'view-profile'> = {
      'call': 'call',
      'review-message': 'review-message',
      'view-deal': 'view-deal',
      'view-application': 'view-deal',
      'view-profile': 'view-deal',
      'send-update': 'review-message',
    };
    const drawerType = drawerTypeMap[card.primaryAction] || 'view-deal';
    openDrawer({ type: drawerType, card });
  };

  const handleGhost = (btn: string) => {
    const lower = btn.toLowerCase();
    if (lower.includes('call')) {
      openDrawer({ type: 'call', card });
    } else if (lower.includes('schedule')) {
      addToast('Opening calendar...', 'info');
    } else if (lower.includes('remind') || lower.includes('send') || lower.includes('draft') || lower.includes('message') || lower.includes('update') || lower.includes('market') || lower.includes('text')) {
      openDrawer({ type: 'review-message', card });
    } else if (lower.includes('view') || lower.includes('deal') || lower.includes('application') || lower.includes('profile')) {
      openDrawer({ type: 'view-deal', card });
    } else if (lower.includes('nurture')) {
      addToast('Added to nurture sequence', 'info');
    } else {
      addToast(`Action: ${btn}`, 'info');
    }
  };

  const handleHandToAi = () => {
    setShowAiPopover(true);
  };

  const confirmHandToAi = () => {
    setShowAiPopover(false);
    removeCard(card.id, 'AI agent assigned — you\'ll be notified of any reply');
  };

  const handleSnooze = () => {
    removeCard(card.id, 'Snoozed — returns at 10:30 AM');
  };

  const handleDismiss = (option: string) => {
    setShowDismiss(false);
    removeCard(card.id, `Dismissed — ${option}`);
  };

  const urgencyDimBg: Record<string, string> = {
    '#ff5c5c': 'rgba(255,92,92,0.08)',
    '#6dc2f1': 'rgba(109,194,241,0.08)',
    '#f5a623': 'rgba(245,166,35,0.08)',
    '#04d39e': 'rgba(4,211,158,0.08)',
    '#04d374': 'rgba(4,211,116,0.08)',
  };

  const dimBg = urgencyDimBg[card.urgencyColor] || 'rgba(255,255,255,0.06)';

  return (
    <div className={`relative ${isRemoving ? 'card-removing' : 'animate-slide-up'}`}>
      <div
        className="rounded-12 overflow-hidden"
        style={{ background: '#1c222c', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="h-[3px] w-full" style={{ background: card.urgencyColor }} />

        <div className="px-4 pt-3.5 pb-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-palanquin font-semibold text-[14px] text-[#e8eaed]">{card.name}</div>
              <div className="font-barlow text-[11px] text-[#4d5563] mt-0.5">{card.context}</div>
            </div>
            <div className="font-barlow font-semibold text-[17px] ml-3 flex-shrink-0" style={{ color: card.urgencyColor }}>
              {card.commission}
            </div>
          </div>

          <p className="font-roboto text-[12px] text-[#8c9199] leading-[1.6] mb-3">
            {card.why}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrimary}
              className="font-roboto font-medium text-[11px] px-3 py-1.5 rounded-[7px] transition-all hover:opacity-90 active:scale-[0.98] text-[#0a0c0f]"
              style={{ background: card.urgencyColor }}
            >
              {card.primaryBtn}
            </button>
            {card.ghostBtns.map(btn => (
              <button
                key={btn}
                onClick={() => handleGhost(btn)}
                className="font-roboto font-medium text-[11px] px-3 py-1.5 rounded-[7px] bg-[#222832] border border-white/10 text-[#e8eaed] hover:border-white/20 hover:text-white transition-all active:scale-[0.98]"
              >
                {btn}
              </button>
            ))}
            <div className="ml-auto flex-shrink-0">
              <span
                className="font-barlow text-[10px] px-2 py-1 rounded"
                style={{ color: card.urgencyColor, background: dimBg, border: `1px solid ${card.urgencyColor}22` }}
              >
                {card.tag}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-0 px-4 py-2 border-t"
          style={{ background: '#161b23', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={handleSnooze}
            className="font-barlow text-[10px] text-[#4d5563] hover:text-[#8c9199] transition-colors py-0.5"
          >
            Snooze 2hr
          </button>
          <span className="font-barlow text-[10px] text-[#4d5563] mx-2">·</span>
          <div className="relative">
            <button
              onClick={handleHandToAi}
              className="font-barlow text-[10px] text-[#4d5563] hover:text-[#8c9199] transition-colors py-0.5"
            >
              Hand to AI
            </button>
            {showAiPopover && (
              <div
                className="absolute bottom-full left-0 mb-2 w-64 rounded-12 shadow-2xl z-20 p-4"
                style={{ background: '#1c222c', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="font-roboto text-[12px] text-[#8c9199] leading-relaxed mb-3">
                  Hand this to your AI agent? It will send the follow-up and notify you of any reply.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={confirmHandToAi}
                    className="flex-1 py-1.5 rounded-[7px] bg-[#04d39e] font-roboto font-medium text-[12px] text-[#0a0c0f] hover:bg-[#04d39e]/90 transition-all"
                  >
                    Yes, handle it
                  </button>
                  <button
                    onClick={() => setShowAiPopover(false)}
                    className="px-3 py-1.5 rounded-[7px] bg-[#222832] border border-white/10 font-roboto font-medium text-[12px] text-[#8c9199] hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <span className="font-barlow text-[10px] text-[#4d5563] mx-2">·</span>
          <div className="relative" ref={dismissRef}>
            <button
              onClick={() => setShowDismiss(v => !v)}
              className="font-barlow text-[10px] text-[#4d5563] hover:text-[#8c9199] transition-colors py-0.5 flex items-center gap-0.5"
            >
              Dismiss <ChevronDown size={10} />
            </button>
            {showDismiss && (
              <div
                className="absolute bottom-full left-0 mb-1 w-44 rounded-xl shadow-2xl z-20 overflow-hidden"
                style={{ background: '#1c222c', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {DISMISS_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleDismiss(opt)}
                    className="w-full text-left px-4 py-2.5 font-roboto text-[12px] text-[#8c9199] hover:text-[#e8eaed] hover:bg-[#222832] transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
