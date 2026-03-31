import { useApp } from '../../context/AppContext';

export function EmptyState() {
  const { addToast } = useApp();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-6">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="rgba(4,211,158,0.2)" strokeWidth="2" />
          <path
            d="M20 32 L28 40 L44 24"
            stroke="#04d39e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              strokeDasharray: 50,
              strokeDashoffset: 0,
              animation: 'draw-check 0.6s ease forwards',
            }}
          />
        </svg>
      </div>

      <div className="font-palanquin font-semibold text-[20px] text-[#e8eaed] mb-2">
        You're done for now.
      </div>
      <p className="font-roboto text-[13px] text-[#4d5563] max-w-[320px] leading-relaxed mb-5">
        Your projected commission moved to{' '}
        <span className="text-[#04d39e]">$15,960</span>{' '}
        — up $1,760 from this morning. The AI workforce is handling 4 follow-ups in the background. Check back at 3 PM.
      </p>
      <button
        onClick={() => addToast('AI workforce activity loaded', 'info')}
        className="font-roboto text-[13px] text-[#04d39e]/70 hover:text-[#04d39e] transition-colors underline underline-offset-2"
      >
        View what AI is handling →
      </button>
    </div>
  );
}
