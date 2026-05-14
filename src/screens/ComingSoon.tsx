import { Clock } from 'lucide-react';

interface ComingSoonProps {
  name: string;
  description: string;
}

export function ComingSoon({ name, description }: ComingSoonProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 bg-[#0a0c0f]">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: 'linear-gradient(135deg, rgba(31,95,234,0.15) 0%, rgba(10,63,179,0.15) 100%)',
          border: '1px solid rgba(31,95,234,0.3)',
        }}
      >
        <Clock size={22} style={{ color: '#1f5fea' }} />
      </div>

      <div className="font-semibold text-[28px] text-[#e8eaed] text-center mb-2 tracking-tight">
        {name}
      </div>

      <p className="text-[14px] text-[#7A8597] text-center max-w-[340px] leading-relaxed">
        {description}
      </p>

      <div
        className="mt-8 px-4 py-2 rounded-xl inline-flex items-center gap-2"
        style={{ background: 'rgba(31,95,234,0.08)', border: '1px solid rgba(31,95,234,0.2)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#04d39e]" />
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#1f5fea' }}>
          Mloflo Exchange · Coming Soon
        </span>
      </div>
    </div>
  );
}
