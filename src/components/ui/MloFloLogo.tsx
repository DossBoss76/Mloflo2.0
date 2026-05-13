export function MloFloLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #00E58C 0%, #14F1B0 35%, #2D8CFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,229,140,0.30), 0 0 0 1px rgba(255,255,255,0.06) inset',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: 19,
            fontWeight: 800,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          F
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#F4F7FB',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          FloRate
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: '#64748B',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.24em',
            marginTop: 3,
          }}
        >
          EXCHANGE
        </span>
      </div>
    </div>
  );
}

export function MloFloLogomark({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: 'linear-gradient(135deg, #00E58C 0%, #14F1B0 35%, #2D8CFF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: '#fff',
          fontSize: size * 0.55,
          fontWeight: 800,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        F
      </span>
    </div>
  );
}
