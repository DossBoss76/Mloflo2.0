import { Moon } from 'lucide-react';
import { useState } from 'react';

export function DarkModeToggle() {
  const [enabled, setEnabled] = useState(true);

  return (
    <button
      onClick={() => setEnabled((v) => !v)}
      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-colors"
      style={{
        background: 'rgba(148,163,184,0.04)',
        border: '1px solid rgba(148,163,184,0.10)',
      }}
    >
      <div className="flex items-center gap-2">
        <Moon size={13} className="text-fx-cyan" />
        <span className="text-[12px] font-semibold text-fx-text">Dark Mode</span>
      </div>
      <div
        className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: enabled ? 'linear-gradient(135deg, #2D8CFF, #0066FF)' : '#1F2A3A' }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: enabled ? 18 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
        />
      </div>
    </button>
  );
}
