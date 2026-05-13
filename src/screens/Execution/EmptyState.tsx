import { useApp } from '../../context/AppContext';

export function EmptyState() {
  const { addToast } = useApp();

  return (
    <div className="fx-card flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-6">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="33" stroke="rgba(0,229,140,0.20)" strokeWidth="1.5"/>
          <circle cx="36" cy="36" r="28" stroke="rgba(0,229,140,0.10)" strokeWidth="1"/>
          <path
            d="M22 36 L31 45 L50 26"
            stroke="#00E58C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{ strokeDasharray: 42, strokeDashoffset: 0, animation: 'draw-check 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
          />
        </svg>
      </div>
      <div className="font-bold text-[22px] text-fx-text mb-2 tracking-tight">You're done for now.</div>
      <p className="text-[13px] text-fx-text-2 max-w-[360px] leading-relaxed mb-5">
        Your projected commission moved to <span className="font-semibold tabular" style={{ color: '#00E58C' }}>$15,960</span> — up $1,760 from this morning. The AI workforce is handling 4 follow-ups in the background. Check back at 3 PM.
      </p>
      <button
        onClick={() => addToast('AI workforce activity loaded', 'info')}
        className="text-[13px] font-semibold transition-colors"
        style={{ color: '#00E58C' }}
      >
        View what AI is handling →
      </button>
    </div>
  );
}
