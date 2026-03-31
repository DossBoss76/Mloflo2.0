export function MloFloLogo() {
  return (
    <img
      src="/My_project_(1).png"
      alt="Mloflo"
      style={{ height: 36, width: 'auto', objectFit: 'contain' }}
    />
  );
}

export function MloFloLogomark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lm-arrow-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ab0f5" />
          <stop offset="100%" stopColor="#7b5ea7" />
        </linearGradient>
      </defs>
      <path
        d="M20.5 8 A9.5 9.5 0 1 0 16.5 19.5"
        stroke="#04d374"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 3.5 L23 7.5 L19 7.5"
        stroke="url(#lm-arrow-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
