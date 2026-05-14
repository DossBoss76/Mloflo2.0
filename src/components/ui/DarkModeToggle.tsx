import { Moon } from 'lucide-react';
import { useState } from 'react';

export function DarkModeToggle() {
  const [enabled, setEnabled] = useState(true);

  return (
    <button
      onClick={() => setEnabled((v) => !v)}
      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-[#161b23] transition-colors"
    >
      <div className="flex items-center gap-2">
        <Moon size={14} className="text-[#6dc2f1]" />
        <span className="text-[12px] font-medium text-[#dde3ec]">Dark Mode</span>
      </div>
      <div
        className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: enabled ? '#1f5fea' : '#2a3140' }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
          style={{ left: enabled ? 18 : 2 }}
        />
      </div>
    </button>
  );
}
