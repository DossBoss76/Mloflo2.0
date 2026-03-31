import {
  Zap, GitBranch, Users, Handshake, MessageSquare, FileText, CreditCard,
  TrendingUp, Bot, BarChart2, BookOpen, Settings, X
} from 'lucide-react';
import { useApp, Screen } from '../../context/AppContext';
import { MloFloLogo } from '../ui/MloFloLogo';
import { NAV_ITEMS } from '../../constants/mockData';

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, GitBranch, Users, Handshake, MessageSquare, FileText, CreditCard,
  TrendingUp, Bot, BarChart2, BookOpen, Settings,
};

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const { activeScreen, setActiveScreen, setSidebarOpen, actionCount } = useApp();

  const handleNav = (id: string) => {
    setActiveScreen(id as Screen);
    if (mobile) setSidebarOpen(false);
  };

  const getBadge = (item: typeof NAV_ITEMS[0]['items'][0]) => {
    if (item.id === 'execution') {
      return { count: actionCount > 0 ? String(actionCount) : '0', color: 'green' };
    }
    if (!item.badge) return null;
    return { count: item.badge, color: item.badgeColor || 'blue' };
  };

  return (
    <aside
      className={`flex flex-col h-full bg-[#10141a] border-r border-white/[0.06] select-none ${mobile ? 'w-[220px]' : 'w-[220px] fixed left-0 top-0'}`}
      style={{ zIndex: mobile ? undefined : 30 }}
    >
      {mobile && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#222832] text-[#8c9199]"
        >
          <X size={15} />
        </button>
      )}

      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        <MloFloLogo />
        <div
          className="mt-2 font-barlow text-[9px] text-[#4d5563] uppercase tracking-[0.18em]"
        >
          Execution Terminal · V2.0
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {NAV_ITEMS.map(section => (
          <div key={section.section} className="mb-4">
            <div className="px-2 mb-1.5 font-barlow text-[9px] text-[#4d5563] uppercase tracking-[0.14em]">
              {section.section}
            </div>
            {section.items.map(item => {
              const Icon = ICON_MAP[item.icon];
              const badge = getBadge(item);
              const isActive = activeScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-[#04d39e]/10 text-[#04d39e]'
                      : 'text-[#8c9199] hover:text-[#e8eaed] hover:bg-[#161b23]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#04d39e]" />
                  )}
                  {Icon && (
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2 : 1.75}
                      className={isActive ? 'text-[#04d39e]' : 'text-current'}
                    />
                  )}
                  <span className={`font-barlow text-[13px] flex-1 text-left ${isActive ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                  {badge && (
                    <span
                      className={`font-barlow text-[10px] font-medium px-1.5 py-0.5 rounded-md leading-none ${
                        badge.color === 'green'
                          ? 'bg-[#04d39e]/15 text-[#04d39e]'
                          : badge.color === 'green-outline'
                          ? 'border border-[#04d39e]/40 text-[#04d39e] bg-transparent'
                          : badge.color === 'amber'
                          ? 'bg-[#f5a623]/15 text-[#f5a623]'
                          : 'bg-[#6dc2f1]/15 text-[#6dc2f1]'
                      }`}
                    >
                      {badge.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-3 py-4 border-t border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#161b23] transition-colors cursor-pointer">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#0a0c0f] font-roboto font-500 text-[12px] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #04d39e, #6dc2f1)' }}
          >
            MC
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-roboto font-medium text-[13px] text-[#e8eaed] truncate">Marcus Cole</div>
            <div className="font-roboto text-[11px] text-[#4d5563] truncate">Senior Loan Officer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebarOverlay() {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-250 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 h-full z-50 transition-transform duration-[250ms] ease-out md:hidden`}
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <Sidebar mobile />
      </div>
    </>
  );
}
