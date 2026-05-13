import { FileText, Upload, Lock } from 'lucide-react';
import { HeroProgressCard } from '../components/ui/HeroProgressCard';
import { FxActionCard } from '../components/ui/FxActionCard';
import { MilestoneList, Milestone } from '../components/ui/MilestoneList';
import { StatusBadge } from '../components/ui/StatusBadge';

interface ComingSoonProps {
  name: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  { id: 'app', title: 'Application', status: 'complete' },
  { id: 'pre', title: 'Pre-Approval', status: 'active', detail: 'Lender review in progress' },
  { id: 'docs', title: 'Documents', status: 'attention', detail: '3 files awaiting upload' },
  { id: 'credit', title: 'Credit Authorization', status: 'pending' },
  { id: 'offers', title: 'Live Lender Offers', status: 'pending' },
  { id: 'select', title: 'Offer Selected', status: 'pending' },
];

export function ComingSoon({ name, description }: ComingSoonProps) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: '#070A12' }}>
      <div className="max-w-[1180px] mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="fx-label mb-1">Module</div>
            <h1 className="text-[28px] font-bold text-fx-text tracking-tight">{name}</h1>
          </div>
          <StatusBadge variant="cyan" pulseDot>Preview Mode</StatusBadge>
        </div>

        <div className="mb-6">
          <HeroProgressCard
            name="Marcus Chen"
            subtitle={description}
            progress={33}
            detail="2 of 6 steps complete"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-[18px] font-bold text-fx-text tracking-tight">Next Steps</h2>
            <StatusBadge variant="gold">3 actions needed</StatusBadge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FxActionCard
              variant="blue"
              icon={<FileText size={18} />}
              title="Complete Your Application"
              description="Finish your 5-step application to unlock the full FloRate matching process."
              estimate="~5 min total"
              cta="Continue →"
            />
            <FxActionCard
              variant="gold"
              icon={<Upload size={18} />}
              title="Upload Documents"
              description="3 documents are waiting for upload to verify your income and assets."
              estimate="~3 min"
              cta="Upload Now →"
            />
            <FxActionCard
              variant="green"
              icon={<Lock size={18} />}
              title="Authorize Credit Check"
              description="A soft pull — no impact on your credit score. Required to match you with lenders."
              estimate="~1 min"
              cta="Authorize →"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-fx-text tracking-tight mb-4">Your Approval Milestones</h2>
          <MilestoneList items={MILESTONES} />
        </div>

        <div className="fx-card p-6 flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(45,140,255,0.12)', border: '1px solid rgba(45,140,255,0.30)' }}
          >
            <FileText size={16} style={{ color: '#2D8CFF' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-fx-text font-semibold text-[14px] mb-1">{name} module is launching soon</div>
            <p className="text-[13px] text-fx-text-2 leading-relaxed">
              Full functionality for this surface is rolling out across the FloRate Exchange platform. The flow above is a live preview of how it will look once enabled for your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
