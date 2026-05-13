import { CircularProgress } from './CircularProgress';

interface Props {
  eyebrow?: string;
  name: string;
  subtitle: string;
  progress: number;
  progressLabel?: string;
  detail?: string;
}

export function HeroProgressCard({ eyebrow = 'Welcome Back', name, subtitle, progress, progressLabel, detail }: Props) {
  return (
    <div className="fx-hero relative overflow-hidden p-7 md:p-9">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-1 min-w-0">
          <div className="fx-label mb-3">{eyebrow}</div>
          <h1 className="text-fx-text font-bold tracking-tight text-[28px] md:text-[34px] leading-[1.15] mb-2">
            {name}
          </h1>
          <p className="text-fx-text-2 text-[14px] md:text-[15px] leading-relaxed mb-6 max-w-[460px]">
            {subtitle}
          </p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-fx-text-2 text-[12px] font-medium">{progressLabel ?? 'Your Progress'}</span>
            <span className="text-fx-green text-[12px] font-bold tabular">{progress}% Complete</span>
          </div>
          <div className="fx-track h-2">
            <div className="fx-track-fill" style={{ width: `${progress}%` }} />
          </div>
          {detail && <div className="text-fx-text-3 text-[11px] mt-2 tabular">{detail}</div>}
        </div>

        <div className="flex-shrink-0 self-center">
          <CircularProgress value={progress} size={132} />
        </div>
      </div>
    </div>
  );
}
