import { useApp } from '../../context/AppContext';

export function EmptyState() {
  const { addToast } = useApp();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-6">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="33" stroke="rgba(4,211,158,0.15)" strokeWidth="1.5"/>
          <circle cx="36" cy="36" r="28" stroke="rgba(4,211,158,0.08)" strokeWidth="1"/>
          <path
            d="M22 36 L31 45 L50 26"
            stroke="#04d39e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{ strokeDasharray: 42, strokeDashoffset: 0, animation: 'draw-check 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
          />
        </svg>
      </div>
      <div className="font-palanquin font-semibold text-[20px] text-[#e8eaed] mb-2">You're done for now.</div>
      <p className="font-roboto text-[13px] text-[#4d5563] max-w-[320px] leading-relaxed mb-5">
        Your projected commission moved to <span style={{ color: '#04d39e' }}>$15,960</span> — up $1,760 from this morning. The AI workforce is handling 4 follow-ups in the background. Check back at 3 PM.
      </p>
      <button onClick={() => addToast('AI workforce activity loaded', 'info')} className="font-roboto text-[13px] hover:opacity-100 transition-opacity" style={{ color: 'rgba(4,211,158,0.7)' }}>
        View what AI is handling →
      </button>
    </div>
  );
}
