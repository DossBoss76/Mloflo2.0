export function AiBriefing() {
  return (
    <div
      className="rounded-12 overflow-hidden relative"
      style={{
        background: '#1c222c',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, #04d39e, #6dc2f1, #92E3FB, #04d39e)',
          backgroundSize: '200% auto',
        }}
      />

      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: '#04d39e', boxShadow: '0 0 6px #04d39e' }}
            />
            <span className="font-barlow text-[10px] uppercase tracking-[0.14em]" style={{ color: '#04d39e' }}>
              Mloflo Intelligence
            </span>
          </div>
          <span className="font-barlow text-[10px] text-[#4d5563]">
            TUE MAR 18 · 8:04 AM
          </span>
        </div>

        <p className="font-roboto text-[13px] text-[#8c9199] leading-[1.7]">
          You have 2 deals that need movement today or they risk falling out before month-end.{' '}
          <span className="text-[#e8eaed] font-medium">Sarah Chen</span>'s docs have been pending 8 days — her rate lock expires in 6.{' '}
          <span className="text-[#e8eaed] font-medium">James Okafor</span> replied to your text yesterday but hasn't booked a call yet.
          Your top realtor <span className="text-[#e8eaed] font-medium">Dana Wu</span> hasn't sent a deal in 3 weeks — a quick check-in
          today keeps that relationship warm. Focus here first.
        </p>
      </div>
    </div>
  );
}
