import {
  Zap, GitBranch, Users, Handshake, MessageSquare, FileText, CreditCard,
  TrendingUp, Bot, BarChart2, BookOpen, Settings, X,
} from 'lucide-react';
import { useState } from 'react';
import { useApp, Screen } from '../../context/AppContext';
import { MloFloLogo } from '../ui/MloFloLogo';
import { DarkModeToggle } from '../ui/DarkModeToggle';
import { NAV_ITEMS } from '../../constants/mockData';

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, GitBranch, Users, Handshake, MessageSquare, FileText, CreditCard,
  TrendingUp, Bot, BarChart2, BookOpen, Settings,
};

type Role = 'Borrower' | 'Realtor' | 'Lender' | 'Admin';
const ROLES: Role[] = ['Borrower', 'Realtor', 'Lender', 'Admin'];

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const { activeScreen, setActiveScreen, setSidebarOpen, actionCount } = useApp();
  const [role, setRole] = useState<Role>('Borrower');

  const handleNav = (id: string) => {
    setActiveScreen(id as Screen);
    if (mobile) setSidebarOpen(false);
  };

  const getBadge = (item: typeof NAV_ITEMS[0]['items'][0]) => {
    if (item.id === 'execution') {
      return { count: actionCount > 0 ? String(actionCount) : '0', variant: 'green' as const };
    }
    if (!item.badge) return null;
    const map: Record<string, 'green' | 'blue' | 'gold' | 'green-outline'> = {
      green: 'green', blue: 'blue', amber: 'gold', 'green-outline': 'green-outline',
    };
    return { count: item.badge, variant: (map[item.badgeColor || 'blue'] || 'blue') };
  };

  const badgeStyles = (variant: string) => {
    if (variant === 'green') return { bg: 'rgba(0,229,140,0.12)', color: '#00E58C', border: 'rgba(0,229,140,0.30)' };
    if (variant === 'gold') return { bg: 'rgba(255,176,32,0.12)', color: '#FFB020', border: 'rgba(255,176,32,0.30)' };
    if (variant === 'green-outline') return { bg: 'transparent', color: '#00E58C', border: 'rgba(0,229,140,0.45)' };
    return { bg: 'rgba(45,140,255,0.12)', color: '#2D8CFF', border: 'rgba(45,140,255,0.30)' };
  };

  return (
    <aside
      className={`flex flex-col h-full select-none ${mobile ? 'w-[240px]' : 'w-[240px] fixed left-0 top-0'}`}
      style={{
        background: '#0C111A',
        borderRight: '1px solid rgba(45,140,255,0.18)',
        zIndex: mobile ? undefined : 30,
      }}
    >
      {mobile && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.04] text-fx-text-2"
        >
          <X size={15} />
        </button>
      )}

      <div className="px-5 pt-5 pb-4 flex-shrink-0">
        <MloFloLogo />
      </div>

      <div className="px-4 pb-3 flex-shrink-0">
        <div className="fx-label mb-2">Role</div>
        <div className="grid grid-cols-2 gap-1.5">
          {ROLES.map((r) => {
            const active = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="text-[11.5px] font-semibold py-1.5 rounded-lg transition-all"
                style={{
                  background: active ? 'rgba(45,140,255,0.12)' : 'rgba(148,163,184,0.04)',
                  color: active ? '#2D8CFF' : '#94A3B8',
                  border: `1px solid ${active ? 'rgba(45,140,255,0.45)' : 'rgba(148,163,184,0.10)'}`,
                  boxShadow: active ? '0 0 0 3px rgba(45,140,255,0.10)' : 'none',
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-3 flex-shrink-0">
        <div
          className="rounded-xl p-3"
          style={{
            background: 'rgba(0,229,140,0.05)',
            border: '1px solid rgba(0,229,140,0.20)',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-fx-green animate-pulse-dot" />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-fx-green">Market Open</span>
            </div>
            <span className="text-[10px] text-fx-text-3 tabular">09:32 EST</span>
          </div>
          <div className="text-[11px] text-fx-text-2 tabular">
            <span className="text-fx-text font-semibold">6.875%</span>
            <span className="text-fx-text-3"> avg</span>
            <span className="text-fx-text-3 mx-1">·</span>
            <span className="text-fx-text font-semibold">24</span>
            <span className="text-fx-text-3"> bids</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {NAV_ITEMS.map((section, sIdx) => (
          <div key={section.section} className="mb-4">
            <div className="flex items-center gap-2 px-2 mb-1.5">
              <span
                className="text-[9px] font-bold tracking-[0.18em] uppercase"
                style={{ color: sIdx === 0 ? '#2D8CFF' : '#64748B' }}
              >
                Stage {sIdx + 1} · {section.section === 'EXECUTE' ? 'Getting Started' : section.section}
              </span>
            </div>
            {section.items.map(item => {
              const Icon = ICON_MAP[item.icon];
              const badge = getBadge(item);
              const isActive = activeScreen === item.id;
              const bs = badge ? badgeStyles(badge.variant) : null;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1 transition-all duration-150 relative text-left"
                  style={{
                    background: isActive ? 'rgba(45,140,255,0.10)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(45,140,255,0.45)' : 'transparent'}`,
                    color: isActive ? '#F4F7FB' : '#94A3B8',
                    boxShadow: isActive ? '0 0 0 3px rgba(45,140,255,0.08)' : 'none',
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(148,163,184,0.04)'; e.currentTarget.style.color = '#F4F7FB'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
                >
                  {Icon && (
                    <Icon
                      size={15}
                      strokeWidth={isActive ? 2 : 1.75}
                      style={{ color: isActive ? '#2D8CFF' : 'currentColor' }}
                    />
                  )}
                  <span className="text-[13px] flex-1 font-medium">{item.label}</span>
                  {badge && bs && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none tabular"
                      style={{ background: bs.bg, color: bs.color, border: `1px solid ${bs.border}` }}
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

      <div className="px-3 py-3 flex-shrink-0 space-y-1" style={{ borderTop: '1px solid rgba(45,140,255,0.12)' }}>
        <DarkModeToggle />
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#052016] font-bold text-[12px] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00E58C, #2D8CFF)' }}
          >
            MC
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[12.5px] text-fx-text truncate">Marcus Chen</div>
            <div className="text-[10.5px] text-fx-text-3 truncate">{role} · Pre-Approved</div>
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
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-250 md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
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
