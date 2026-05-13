export function AiBriefing() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0B1726 0%, #0E2233 100%)',
        border: '1px solid rgba(34,211,238,0.22)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.30)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, #00E58C, #22D3EE, #2D8CFF, #00E58C)',
          backgroundSize: '200% auto',
        }}
      />

      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: '#00E58C', boxShadow: '0 0 8px #00E58C' }}
            />
            <span className="text-[10px] uppercase tracking-[0.20em] font-bold" style={{ color: '#00E58C' }}>
              FloRate Intelligence
            </span>
          </div>
          <span className="text-[10px] text-fx-text-3 tabular tracking-wider">
            TUE MAR 18 · 8:04 AM
          </span>
        </div>

        <p className="text-[13.5px] text-fx-text-2 leading-[1.75]">
          You have 2 deals that need movement today or they risk falling out before month-end.{' '}
          <span className="text-fx-text font-semibold">Sarah Chen</span>'s docs have been pending 8 days — her rate lock expires in 6.{' '}
          <span className="text-fx-text font-semibold">James Okafor</span> replied to your text yesterday but hasn't booked a call yet.
          Your top realtor <span className="text-fx-text font-semibold">Dana Wu</span> hasn't sent a deal in 3 weeks — a quick check-in
          today keeps that relationship warm. Focus here first.
        </p>
      </div>
    </div>
  );
}
