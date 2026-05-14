export function MloFloLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: 'linear-gradient(135deg, #1f5fea 0%, #0a3fb3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 12px rgba(31,95,234,0.35)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 800,
            fontFamily: 'Geist, Inter, sans-serif',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          F
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#e8eaed',
            fontFamily: 'Geist, Inter, sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          FloRate
        </span>
        <span
          style={{
            fontSize: 8.5,
            fontWeight: 600,
            color: '#5a6474',
            fontFamily: 'Geist, Inter, sans-serif',
            letterSpacing: '0.22em',
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
        background: 'linear-gradient(135deg, #1f5fea 0%, #0a3fb3 100%)',
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
          fontFamily: 'Geist, Inter, sans-serif',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        F
      </span>
    </div>
  );
}
