import { Menu } from 'lucide-react';
import { Sidebar, MobileSidebarOverlay } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { Drawer } from '../ui/Drawer';
import { useApp } from '../../context/AppContext';
import { ExecutionScreen } from '../../screens/Execution';
import { DealFloScreen } from '../../screens/DealFlo';
import { ComingSoon } from '../../screens/ComingSoon';

const SCREEN_LABELS: Record<string, string> = {
  borrowers: 'Borrowers',
  partners: 'Partners',
  communications: 'Communications',
  documents: 'Documents',
  'buyer-passports': 'Buyer Passports',
  'mortgage-market': 'Mortgage Market',
  'ai-workforce': 'AI Workforce',
  analytics: 'Analytics',
  playbooks: 'Playbooks',
  settings: 'Settings',
};

const SCREEN_DESCS: Record<string, string> = {
  borrowers: 'Manage your borrower pipeline and contact records',
  partners: 'Track realtor and referral partner relationships',
  communications: 'Unified inbox for calls, texts, and emails',
  documents: 'Upload, manage, and track loan documentation',
  'buyer-passports': 'Portable buyer qualification profiles',
  'mortgage-market': 'Live rate feed and market intelligence',
  'ai-workforce': 'Configure and monitor your AI agent fleet',
  analytics: 'Revenue performance and pipeline analytics',
  playbooks: 'Automated workflow sequences and scripts',
  settings: 'Account, notifications, and integrations',
};

export function Layout() {
  const { activeScreen, setSidebarOpen } = useApp();

  const renderScreen = () => {
    if (activeScreen === 'execution') return <ExecutionScreen />;
    if (activeScreen === 'deal-flo') return <DealFloScreen />;
    return (
      <ComingSoon
        name={SCREEN_LABELS[activeScreen] || activeScreen}
        description={SCREEN_DESCS[activeScreen] || 'This feature is coming soon.'}
      />
    );
  };

  return (
    <div className="flex h-full bg-[#0a0c0f]">
      <div className="hidden md:block w-[220px] flex-shrink-0" />
      <Sidebar />
      <MobileSidebarOverlay />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1c222c] text-[#8c9199]"
          >
            <Menu size={18} />
          </button>
          <span className="font-palanquin font-semibold text-[16px] text-[#e8eaed]">Mloflo</span>
        </div>

        <main className="flex-1 overflow-hidden">
          {renderScreen()}
        </main>
      </div>

      <Drawer />
      <ToastContainer />
    </div>
  );
}
