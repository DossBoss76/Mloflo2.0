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

  // Map legacy urgency hex to FloRate palette
  const colorMap: Record<string, string> = {
    '#ff5c5c': '#FF4D5E',
    '#6dc2f1': '#2D8CFF',
    '#f5a623': '#FFB020',
    '#04d39e': '#00E58C',
    '#04d374': '#00E58C',
  };
  const accent = colorMap[card.urgencyColor] || card.urgencyColor;
  const dimBg = `${accent}1F`;

  return (
    <div className={`relative ${isRemoving ? 'card-removing' : 'animate-slide-up'}`}>
      <div
        className="rounded-2xl overflow-hidden transition-all"
        style={{
          background: '#101722',
          border: '1px solid rgba(148,163,184,0.12)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        }}
      >
        <div className="h-[3px] w-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}80` }} />

        <div className="px-5 pt-4 pb-4">
          <div className="flex items-start justify-between mb-2.5 gap-3">
            <div className="min-w-0">
              <div className="font-bold text-[15px] text-fx-text tracking-tight">{card.name}</div>
              <div className="text-[11.5px] text-fx-text-3 mt-0.5">{card.context}</div>
            </div>
            <div className="font-bold text-[18px] flex-shrink-0 tabular tracking-tight" style={{ color: accent }}>
              {card.commission}
            </div>
          </div>

          <p className="text-[12.5px] text-fx-text-2 leading-[1.65] mb-4">
            {card.why}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrimary}
              className="font-semibold text-[12px] px-3.5 py-2 rounded-xl transition-all hover:opacity-95 active:scale-[0.98] text-white"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, ${accent}DD 100%)`,
                boxShadow: `0 4px 14px ${accent}40`,
              }}
            >
              {card.primaryBtn}
            </button>
            {card.ghostBtns.map(btn => (
              <button
                key={btn}
                onClick={() => handleGhost(btn)}
                className="fx-btn-ghost text-[11.5px] px-3 py-2"
              >
                {btn}
              </button>
            ))}
            <div className="ml-auto flex-shrink-0">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ color: accent, background: dimBg, border: `1px solid ${accent}55` }}
              >
                {card.tag}
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-0 px-5 py-2.5 border-t"
          style={{ background: 'rgba(8,17,30,0.6)', borderColor: 'rgba(148,163,184,0.08)' }}
        >
          <button
            onClick={handleSnooze}
            className="text-[11px] font-medium text-fx-text-2 hover:text-fx-text hover:bg-white/[0.04] transition-all px-2 py-1 rounded-md"
          >
            Snooze 2hr
          </button>
          <span className="text-[10px] text-fx-text-4 mx-1">·</span>
          <div className="relative">
            <button
              onClick={handleHandToAi}
              className="text-[11px] font-medium text-fx-text-2 hover:text-fx-text hover:bg-white/[0.04] transition-all px-2 py-1 rounded-md"
            >
              Hand to AI
            </button>
            {showAiPopover && (
              <div
                className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl shadow-2xl z-20 p-4"
                style={{ background: '#121C29', border: '1px solid rgba(45,140,255,0.22)' }}
              >
                <div className="text-[12px] text-fx-text-2 leading-relaxed mb-3">
                  Hand this to your AI agent? It will send the follow-up and notify you of any reply.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={confirmHandToAi}
                    className="fx-btn-success flex-1 py-1.5 text-[12px]"
                  >
                    Yes, handle it
                  </button>
                  <button
                    onClick={() => setShowAiPopover(false)}
                    className="fx-btn-ghost px-3 py-1.5 text-[12px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10px] text-fx-text-4 mx-1">·</span>
          <div className="relative" ref={dismissRef}>
            <button
              onClick={() => setShowDismiss(v => !v)}
              className="text-[11px] font-medium text-fx-text-2 hover:text-fx-text hover:bg-white/[0.04] transition-all px-2 py-1 rounded-md flex items-center gap-1"
            >
              Dismiss <ChevronDown size={10} />
            </button>
            {showDismiss && (
              <div
                className="absolute bottom-full left-0 mb-1 w-44 rounded-xl shadow-2xl z-20 overflow-hidden"
                style={{ background: '#121C29', border: '1px solid rgba(45,140,255,0.22)' }}
              >
                {DISMISS_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleDismiss(opt)}
                    className="w-full text-left px-4 py-2.5 text-[12px] text-fx-text-2 hover:text-fx-text hover:bg-white/[0.04] transition-colors"
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
