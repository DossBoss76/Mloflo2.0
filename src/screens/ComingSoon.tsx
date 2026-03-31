import { Clock } from 'lucide-react';

interface ComingSoonProps {
  name: string;
  description: string;
}

export function ComingSoon({ name, description }: ComingSoonProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 bg-[#0a0c0f]">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
        style={{ background: 'rgba(109,194,241,0.08)', border: '1px solid rgba(109,194,241,0.15)' }}
      >
        <Clock size={22} style={{ color: '#6dc2f1' }} />
      </div>

      <div className="font-palanquin font-semibold text-[28px] text-[#e8eaed] text-center mb-2">
        {name}
      </div>

      <p className="font-roboto text-[14px] text-[#4d5563] text-center max-w-[320px] leading-relaxed">
        {description}
      </p>

      <div
        className="mt-8 px-4 py-2 rounded-xl"
        style={{ background: 'rgba(109,194,241,0.06)', border: '1px solid rgba(109,194,241,0.12)' }}
      >
        <span className="font-barlow text-[11px] uppercase tracking-[0.14em]" style={{ color: '#6dc2f1' }}>
          Coming soon · Mloflo v2.0
        </span>
      </div>
    </div>
  );
}
