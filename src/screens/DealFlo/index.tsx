import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import {
  ArrowLeft, LayoutGrid, List, Focus, Heart, Plus, Zap, BarChart2, X,
  Phone, Mail, MessageSquare, Calendar, AlertTriangle, DollarSign,
  ChevronRight, ChevronLeft, CheckCircle, PhoneOff, AlertCircle,
  MoreHorizontal, Mic, MicOff, FileText, Star, TrendingUp, Users,
  Activity, Send, RefreshCw, Voicemail as VoicemailIcon, Sun, Moon
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode = 'board' | 'list' | 'focus';
type UrgencyLevel = 'critical' | 'high' | 'amber' | 'green' | 'blue';
type ActionFilter = 'all' | 'overdue' | 'today' | 'week';
type CallOutcome = 'connected' | 'voicemail' | 'no-answer' | 'bad-number';
type WorkMode = 'call' | 'email' | 'follow-up' | null;
type Tab = 'timeline' | 'notes' | 'deal' | 'documents';
type ThemeMode = 'dark' | 'light';

interface Stage { id: string; label: string; color: string; }
interface TimelineEntry { id: string; type: 'call' | 'email' | 'note' | 'stage'; text: string; time: string; }
interface Deal {
  id: string; name: string; company: string; amount: string; amountRaw: number;
  stage: string; urgency: UrgencyLevel; nextStep: string; primaryAction: string;
  actionType: WorkMode; phone: string; email: string; avatar: string;
  lastContact: string; commission: string; timeline: TimelineEntry[]; notes: string;
}
interface ActionRow {
  id: string; name: string; context: string; impact: string; impactRaw: number;
  urgency: UrgencyLevel; actionType: WorkMode; primaryBtn: string;
  filter: ActionFilter[]; dealId: string;
}
interface Flo {
  id: string; name: string; dealCount: number; healthScore: number;
  stages: Stage[]; deals: Deal[]; actions: ActionRow[];
}

// ─── Theme ────────────────────────────────────────────────────────────────────

interface Theme {
  mode: ThemeMode;
  // Backgrounds
  bg: string;          // root bg
  panel: string;       // header / drawer bg
  surface: string;     // column / drawer body
  card: string;        // card bg
  cardHover: string;
  inset: string;       // pill / search bg
  // Text
  text: string;        // primary
  textMuted: string;   // secondary
  textSubtle: string;  // labels
  textFaint: string;   // ghosts
  // Borders
  border: string;
  borderStrong: string;
  // Brand
  brandBlue: string;
  brandBlueDeep: string;
  brandGreen: string;
  // Status
  danger: string;
  warning: string;
  info: string;
  // Misc
  shadow: string;
  scrim: string;
}

const DARK: Theme = {
  mode: 'dark',
  bg: '#0D0D12',
  panel: '#0a0f14',
  surface: '#090e14',
  card: '#0f1419',
  cardHover: '#141922',
  inset: '#060a0f',
  text: '#dde3ec',
  textMuted: '#8c9199',
  textSubtle: '#5a6474',
  textFaint: '#3a4558',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.15)',
  brandBlue: '#6DC2F1',
  brandBlueDeep: '#3a8fc7',
  brandGreen: '#04D39E',
  danger: '#ff5c5c',
  warning: '#f5a623',
  info: '#6dc2f1',
  shadow: '0 4px 16px rgba(0,0,0,0.4)',
  scrim: 'rgba(0,0,0,0.55)',
};

const LIGHT: Theme = {
  mode: 'light',
  bg: '#F4F7FB',
  panel: '#ffffff',
  surface: '#ffffff',
  card: '#ffffff',
  cardHover: '#F8FAFD',
  inset: '#F1F4F9',
  text: '#0F1A2A',
  textMuted: '#5A6478',
  textSubtle: '#7A8597',
  textFaint: '#A8B0BD',
  border: 'rgba(15,26,42,0.08)',
  borderStrong: 'rgba(15,26,42,0.16)',
  brandBlue: '#1B6CFF',
  brandBlueDeep: '#0E4FCC',
  brandGreen: '#04A87E',
  danger: '#E0394A',
  warning: '#E58A12',
  info: '#1B6CFF',
  shadow: '0 4px 14px rgba(15,26,42,0.08)',
  scrim: 'rgba(15,26,42,0.18)',
};

const ThemeContext = createContext<Theme>(DARK);
const useTheme = () => useContext(ThemeContext);

const URGENCY_COLOR = (t: Theme): Record<UrgencyLevel, string> => ({
  critical: t.danger,
  high: t.mode === 'dark' ? '#ff8c42' : '#E76F1A',
  amber: t.warning,
  green: t.brandGreen,
  blue: t.brandBlue,
});

const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  critical: 'Critical', high: 'High', amber: 'Amber', green: 'Active', blue: 'Info',
};

// ─── FloRate Logo ─────────────────────────────────────────────────────────────

function FloRateLogo({ size = 28 }: { size?: number }) {
  const t = useTheme();
  const blue = t.mode === 'dark' ? '#1f5fea' : '#1B6CFF';
  const blueDeep = t.mode === 'dark' ? '#0a3fb3' : '#0E4FCC';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.28,
        background: `linear-gradient(135deg, ${blue} 0%, ${blueDeep} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: t.mode === 'light' ? '0 2px 6px rgba(27,108,255,0.25)' : '0 0 0 1px rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <span style={{
          color: '#fff', fontSize: size * 0.55, fontWeight: 800,
          fontFamily: 'Geist, sans-serif', lineHeight: 1, letterSpacing: '-0.02em',
        }}>F</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontSize: 14, fontWeight: 800, color: t.text,
          fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em',
        }}>FloRate</span>
        <span style={{
          fontSize: 8, fontWeight: 600, color: t.textSubtle,
          fontFamily: 'Geist, sans-serif', letterSpacing: '0.18em', marginTop: 2,
        }}>EXCHANGE</span>
      </div>
    </div>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  const t = useTheme();
  const isLight = mode === 'light';
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 10px 5px 8px', borderRadius: 20,
        border: `1px solid ${t.border}`,
        background: t.inset, cursor: 'pointer',
        fontFamily: 'Geist, sans-serif', transition: 'all 0.15s',
      }}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {isLight ? <Sun size={12} style={{ color: t.warning }} /> : <Moon size={12} style={{ color: t.brandBlue }} />}
      <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>
        {isLight ? 'Light' : 'Dark'}
      </span>
      <div style={{
        width: 26, height: 14, borderRadius: 8,
        background: isLight ? t.brandBlue : t.borderStrong,
        position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 1, left: isLight ? 13 : 1,
          width: 12, height: 12, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }} />
      </div>
    </button>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FLOS: Flo[] = [
  {
    id: 'borrower-approval', name: 'Borrower Approval', dealCount: 19, healthScore: 72,
    stages: [
      { id: 'new-leads', label: 'New Leads', color: '#7A8597' },
      { id: 'pre-approval', label: 'Pre-Approval', color: '#1B6CFF' },
      { id: 'application', label: 'Application', color: '#E58A12' },
      { id: 'processing', label: 'Processing', color: '#9b6dff' },
      { id: 'ctc', label: 'CTC', color: '#04A87E' },
      { id: 'closed', label: 'Closed', color: '#04D39E' },
    ],
    actions: [
      { id: 'a1', name: 'Sarah Chen', context: 'Rate lock expires in 6 days · Missing 2 docs', impact: '$3,200', impactRaw: 3200, urgency: 'critical', actionType: 'call', primaryBtn: 'Call Now', filter: ['all', 'overdue'], dealId: 'd7' },
      { id: 'a2', name: 'Tom & Lisa Park', context: 'No contact 48h since application submission', impact: '$3,800', impactRaw: 3800, urgency: 'high', actionType: 'email', primaryBtn: 'Send Update', filter: ['all', 'today'], dealId: 'd5' },
      { id: 'a3', name: 'James Okafor', context: 'Warm reply · 60% drop if no follow-up today', impact: '$2,800', impactRaw: 2800, urgency: 'blue', actionType: 'follow-up', primaryBtn: 'Follow Up', filter: ['all', 'today'], dealId: 'd3' },
      { id: 'a4', name: 'Marcus T.', context: 'New Zillow lead · 47 min no contact', impact: '$2,100', impactRaw: 2100, urgency: 'green', actionType: 'call', primaryBtn: 'Call Now', filter: ['all', 'overdue'], dealId: 'd1' },
      { id: 'a5', name: 'Derek Sampson', context: 'Appraisal ETA overdue by 1 day', impact: '$2,600', impactRaw: 2600, urgency: 'amber', actionType: 'follow-up', primaryBtn: 'Follow Up', filter: ['all', 'week'], dealId: 'd9' },
    ],
    deals: [
      { id: 'd1', name: 'Marcus T.', company: 'Zillow Lead', amount: '$315k', amountRaw: 315000, stage: 'new-leads', urgency: 'critical', nextStep: 'Call immediately — 47 min cold', primaryAction: 'Call Now', actionType: 'call', phone: '(925) 660-1847', email: 'marcust@email.com', avatar: 'MT', lastContact: 'Never', commission: '$1,900', notes: '', timeline: [{ id: 't1', type: 'stage', text: 'Lead created via Zillow form', time: '47 min ago' }] },
      { id: 'd2', name: 'Elena Torres', company: 'Referral · Dana Wu', amount: '$395k', amountRaw: 395000, stage: 'new-leads', urgency: 'blue', nextStep: 'Schedule initial consultation', primaryAction: 'Call', actionType: 'call', phone: '(415) 777-2291', email: 'elena.t@email.com', avatar: 'ET', lastContact: 'Yesterday', commission: '$2,370', notes: '', timeline: [{ id: 't1', type: 'note', text: 'Referred by Dana Wu — high intent buyer', time: '1 day ago' }] },
      { id: 'd3', name: 'James Okafor', company: 'Direct', amount: '$420k', amountRaw: 420000, stage: 'pre-approval', urgency: 'high', nextStep: 'Follow up on warm reply', primaryAction: 'Follow Up', actionType: 'follow-up', phone: '(510) 774-9902', email: 'james.okafor@email.com', avatar: 'JO', lastContact: 'Yesterday', commission: '$2,800', notes: 'Very interested, just busy. Wants to move fast once ready.', timeline: [{ id: 't1', type: 'email', text: 'Replied "yes still interested"', time: 'Yesterday' }, { id: 't2', type: 'call', text: 'Initial discovery call — 18 min', time: '3 days ago' }] },
      { id: 'd4', name: 'Yuki Tanaka', company: 'Direct', amount: '$610k', amountRaw: 610000, stage: 'pre-approval', urgency: 'green', nextStep: 'Check in on house hunt', primaryAction: 'Email', actionType: 'email', phone: '(650) 881-3302', email: 'yuki.t@email.com', avatar: 'YT', lastContact: '3 days ago', commission: '$4,270', notes: '', timeline: [{ id: 't1', type: 'stage', text: 'Pre-approval letter issued', time: '3 days ago' }] },
      { id: 'd5', name: 'Tom & Lisa Park', company: 'Referral', amount: '$570k', amountRaw: 570000, stage: 'application', urgency: 'high', nextStep: 'Send doc request reminder', primaryAction: 'Send Update', actionType: 'email', phone: '(408) 559-2230', email: 'tpark@email.com', avatar: 'TP', lastContact: '2 days ago', commission: '$3,800', notes: '', timeline: [{ id: 't1', type: 'stage', text: 'Application submitted', time: '2 days ago' }] },
      { id: 'd6', name: 'Andre Mitchell', company: 'Direct', amount: '$330k', amountRaw: 330000, stage: 'application', urgency: 'blue', nextStep: 'Underwriter review update', primaryAction: 'View', actionType: null, phone: '(916) 443-0091', email: 'a.mitchell@email.com', avatar: 'AM', lastContact: 'Today', commission: '$2,200', notes: '', timeline: [{ id: 't1', type: 'email', text: 'Docs received — in review', time: 'Today' }] },
      { id: 'd7', name: 'Sarah Chen', company: 'Direct', amount: '$480k', amountRaw: 480000, stage: 'processing', urgency: 'critical', nextStep: 'Call for missing W2 + bank stmt', primaryAction: 'Call Now', actionType: 'call', phone: '(415) 882-3301', email: 'sarah.chen@email.com', avatar: 'SC', lastContact: '2 days ago', commission: '$3,200', notes: 'Missing 2023 W2 and bank statement page 3. Rate lock in 6 days.', timeline: [{ id: 't1', type: 'call', text: 'Called — no answer', time: '2 days ago' }, { id: 't2', type: 'stage', text: 'Moved to Processing', time: '5 days ago' }] },
      { id: 'd8', name: 'Fatima Al-Hassan', company: 'Referral', amount: '$445k', amountRaw: 445000, stage: 'processing', urgency: 'amber', nextStep: 'Clear 3 UW conditions', primaryAction: 'Follow Up', actionType: 'follow-up', phone: '(510) 229-4415', email: 'fatima.ah@email.com', avatar: 'FA', lastContact: 'Today', commission: '$2,960', notes: '', timeline: [{ id: 't1', type: 'note', text: '3 UW conditions issued', time: 'Today' }] },
      { id: 'd9', name: 'Derek Sampson', company: 'Direct', amount: '$390k', amountRaw: 390000, stage: 'processing', urgency: 'amber', nextStep: 'Follow up on appraisal', primaryAction: 'Follow Up', actionType: 'follow-up', phone: '(707) 654-7712', email: 'd.sampson@email.com', avatar: 'DS', lastContact: '1 day ago', commission: '$2,600', notes: '', timeline: [{ id: 't1', type: 'note', text: 'Appraisal ordered — ETA 3 days (overdue)', time: '4 days ago' }] },
      { id: 'd10', name: 'Priya Nair', company: 'Direct', amount: '$440k', amountRaw: 440000, stage: 'ctc', urgency: 'green', nextStep: 'Confirm closing time Friday', primaryAction: 'Call', actionType: 'call', phone: '(408) 992-0033', email: 'priya.nair@email.com', avatar: 'PN', lastContact: 'Today', commission: '$2,640', notes: '', timeline: [{ id: 't1', type: 'stage', text: 'Clear to Close issued', time: 'Today' }] },
      { id: 'd11', name: 'Michael & Jen Cross', company: 'Referral', amount: '$680k', amountRaw: 680000, stage: 'ctc', urgency: 'blue', nextStep: 'Final walkthrough confirm', primaryAction: 'Email', actionType: 'email', phone: '(650) 337-8819', email: 'mcross@email.com', avatar: 'MC', lastContact: 'Today', commission: '$4,760', notes: '', timeline: [{ id: 't1', type: 'stage', text: 'Docs out to title', time: 'Today' }] },
      { id: 'd12', name: 'Roshan Patel', company: 'Direct', amount: '$520k', amountRaw: 520000, stage: 'closed', urgency: 'green', nextStep: 'Send thank you + ask for referral', primaryAction: 'Email', actionType: 'email', phone: '(415) 200-1122', email: 'rpatel@email.com', avatar: 'RP', lastContact: '5 days ago', commission: '$3,640', notes: '', timeline: [{ id: 't1', type: 'stage', text: 'Funded — $3,640 earned', time: '5 days ago' }] },
      { id: 'd13', name: 'Danielle Frost', company: 'Direct', amount: '$370k', amountRaw: 370000, stage: 'closed', urgency: 'blue', nextStep: 'Database drip campaign', primaryAction: 'Email', actionType: 'email', phone: '(510) 881-6643', email: 'd.frost@email.com', avatar: 'DF', lastContact: '12 days ago', commission: '$2,590', notes: '', timeline: [{ id: 't1', type: 'stage', text: 'Funded — $2,590 earned', time: '12 days ago' }] },
      { id: 'd14', name: 'Keisha Brown', company: 'Past Client', amount: '$285k', amountRaw: 285000, stage: 'new-leads', urgency: 'green', nextStep: 'Send refi proposal', primaryAction: 'Send Proposal', actionType: 'email', phone: '(707) 443-8821', email: 'keisha.brown@email.com', avatar: 'KB', lastContact: '8 months ago', commission: '$1,900', notes: 'Current rate 7.2% — could save $340/mo with refi.', timeline: [{ id: 't1', type: 'note', text: 'Rate drop alert — refi candidate', time: 'Today' }] },
    ],
  },
  {
    id: 'realtor-growth', name: 'Realtor Growth', dealCount: 8, healthScore: 85,
    stages: [
      { id: 'prospect', label: 'Prospect', color: '#7A8597' },
      { id: 'active', label: 'Active Partner', color: '#1B6CFF' },
      { id: 'nurture', label: 'Nurture', color: '#E58A12' },
      { id: 'vip', label: 'VIP', color: '#04A87E' },
    ],
    actions: [
      { id: 'b1', name: 'Dana Wu', context: '21 days silence · Top referral source', impact: '~$5,600', impactRaw: 5600, urgency: 'amber', actionType: 'follow-up', primaryBtn: 'Review Message', filter: ['all', 'overdue'], dealId: 'r3' },
      { id: 'b2', name: 'Chris Evans', context: 'Market update ready to send', impact: '~$2,800', impactRaw: 2800, urgency: 'blue', actionType: 'email', primaryBtn: 'Send Update', filter: ['all', 'today'], dealId: 'r1' },
    ],
    deals: [
      { id: 'r1', name: 'Chris Evans', company: 'Compass Realty', amount: '8 ref/yr', amountRaw: 0, stage: 'active', urgency: 'blue', nextStep: 'Send market update', primaryAction: 'Send Update', actionType: 'email', phone: '(415) 556-9090', email: 'cevans@compass.com', avatar: 'CE', lastContact: 'Yesterday', commission: '~$2,800', notes: '', timeline: [] },
      { id: 'r2', name: 'Maria Santos', company: 'Keller Williams', amount: '5 ref/yr', amountRaw: 0, stage: 'active', urgency: 'green', nextStep: 'Monthly check-in', primaryAction: 'Call', actionType: 'call', phone: '(650) 440-2211', email: 'm.santos@kw.com', avatar: 'MS', lastContact: '1 week ago', commission: '~$1,750', notes: '', timeline: [] },
      { id: 'r3', name: 'Dana Wu', company: 'Sothebys', amount: '12 ref/yr', amountRaw: 0, stage: 'nurture', urgency: 'amber', nextStep: 'Break 21-day silence', primaryAction: 'Call Dana', actionType: 'call', phone: '(650) 331-4478', email: 'dana.wu@realty.com', avatar: 'DW', lastContact: '21 days ago', commission: '~$5,600', notes: '', timeline: [] },
      { id: 'r4', name: 'Alex Johnson', company: 'Redfin', amount: '3 ref/yr', amountRaw: 0, stage: 'prospect', urgency: 'blue', nextStep: 'Initial coffee meeting', primaryAction: 'Schedule', actionType: 'follow-up', phone: '(510) 223-8870', email: 'alex.j@redfin.com', avatar: 'AJ', lastContact: '5 days ago', commission: 'TBD', notes: '', timeline: [] },
    ],
  },
  {
    id: 'retention', name: 'Retention', dealCount: 4, healthScore: 91,
    stages: [
      { id: 'past-client', label: 'Past Client', color: '#1B6CFF' },
      { id: 'refi-candidate', label: 'Refi Candidate', color: '#04A87E' },
      { id: 'vip-db', label: 'VIP Database', color: '#E58A12' },
    ],
    actions: [
      { id: 'c1', name: 'Keisha Brown', context: 'Rate drop 0.4% — saves $340/mo refi', impact: '$1,900', impactRaw: 1900, urgency: 'green', actionType: 'email', primaryBtn: 'Review Message', filter: ['all', 'today'], dealId: 'ret1' },
    ],
    deals: [
      { id: 'ret1', name: 'Keisha Brown', company: 'Past Client 2022', amount: '$285k refi', amountRaw: 285000, stage: 'refi-candidate', urgency: 'green', nextStep: 'Send refi savings breakdown', primaryAction: 'Review Message', actionType: 'email', phone: '(707) 443-8821', email: 'keisha.brown@email.com', avatar: 'KB', lastContact: '8 months ago', commission: '$1,900', notes: 'Current rate 7.2%. New rate ~6.5%. Monthly savings $340.', timeline: [] },
      { id: 'ret2', name: 'Roshan Patel', company: 'Past Client 2024', amount: 'Closed $520k', amountRaw: 520000, stage: 'vip-db', urgency: 'blue', nextStep: 'Ask for referral', primaryAction: 'Email', actionType: 'email', phone: '(415) 200-1122', email: 'rpatel@email.com', avatar: 'RP', lastContact: '5 days ago', commission: 'Referral', notes: 'Very happy client. Strong candidate for referral ask.', timeline: [] },
      { id: 'ret3', name: 'Danielle Frost', company: 'Past Client 2024', amount: 'Closed $370k', amountRaw: 370000, stage: 'past-client', urgency: 'blue', nextStep: 'Add to drip campaign', primaryAction: 'Set Up Drip', actionType: null, phone: '(510) 881-6643', email: 'd.frost@email.com', avatar: 'DF', lastContact: '12 days ago', commission: 'Referral', notes: '', timeline: [] },
      { id: 'ret4', name: 'Michael Cross', company: 'Past Client 2023', amount: 'Closed $420k', amountRaw: 420000, stage: 'vip-db', urgency: 'green', nextStep: 'Anniversary check-in', primaryAction: 'Call', actionType: 'call', phone: '(650) 337-8881', email: 'mxcross@email.com', avatar: 'MC', lastContact: '3 months ago', commission: 'Referral', notes: '', timeline: [] },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtUSD = (n: number, compact = false) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, ...(compact ? { notation: 'compact' } : {}) } as Intl.NumberFormatOptions).format(n);

// Adjust hex with alpha
const alpha = (hex: string, a: number) => {
  const ah = Math.round(a * 255).toString(16).padStart(2, '0');
  return `${hex}${ah}`;
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

function UrgencyDot({ level }: { level: UrgencyLevel }) {
  const t = useTheme();
  const color = URGENCY_COLOR(t)[level];
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: color,
      boxShadow: level === 'critical' ? `0 0 6px ${color}` : 'none',
      flexShrink: 0,
    }} />
  );
}

function Avatar({ initials, size = 48 }: { initials: string; size?: number }) {
  const t = useTheme();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: t.mode === 'dark'
        ? 'linear-gradient(135deg, #1a2535 0%, #1f3044 100%)'
        : 'linear-gradient(135deg, #E7EFFD 0%, #D6E5FB 100%)',
      border: `2px solid ${alpha(t.brandBlue, t.mode === 'dark' ? 0.25 : 0.35)}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontFamily: 'Geist Mono, monospace', fontWeight: 700,
      color: t.brandBlue, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function HealthPill({ score }: { score: number }) {
  const t = useTheme();
  const color = score >= 80 ? t.brandGreen : score >= 60 ? t.warning : t.danger;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      background: alpha(color, 0.12),
      border: `1px solid ${alpha(color, 0.3)}`,
    }}>
      <Heart size={11} style={{ color }} />
      <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'Geist Mono, monospace' }}>{score}</span>
    </div>
  );
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────

function KanbanCard({ deal, onCardClick, onActionClick }: {
  deal: Deal; onCardClick: (deal: Deal) => void; onActionClick: (deal: Deal) => void;
}) {
  const t = useTheme();
  const [hovered, setHovered] = useState(false);
  const urgColor = URGENCY_COLOR(t)[deal.urgency];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCardClick(deal)}
      style={{
        background: hovered ? t.cardHover : t.card,
        border: `1px solid ${hovered ? alpha(t.brandBlue, 0.25) : t.border}`,
        borderRadius: 10, padding: '10px 11px', marginBottom: 7, cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? t.shadow : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{deal.name}</span>
        <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: t.textSubtle, display: 'flex' }}>
          <MoreHorizontal size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: t.textSubtle }}>{deal.company}</span>
        <span style={{ fontSize: 10, color: t.textFaint }}>·</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.brandBlue, fontFamily: 'Geist Mono, monospace' }}>{deal.amount}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, color: urgColor,
          background: alpha(urgColor, 0.12), padding: '1px 5px', borderRadius: 4, marginLeft: 2,
        }}>
          {URGENCY_LABEL[deal.urgency]}
        </span>
      </div>

      <div style={{ fontSize: 10, color: t.textSubtle, marginBottom: 8, lineHeight: 1.4 }}>{deal.nextStep}</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <UrgencyDot level={deal.urgency} />
        {deal.actionType && (
          <button
            onClick={e => { e.stopPropagation(); onActionClick(deal); }}
            style={{
              fontSize: 10, fontWeight: 700, color: '#fff',
              background: urgColor, border: 'none', borderRadius: 6,
              padding: '4px 10px', cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {deal.primaryAction}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanCol({ stage, deals, onCardClick, onActionClick }: {
  stage: Stage; deals: Deal[];
  onCardClick: (deal: Deal) => void; onActionClick: (deal: Deal) => void;
}) {
  const t = useTheme();
  const totalAmt = deals.reduce((s, d) => s + d.amountRaw, 0);

  return (
    <div style={{
      flex: '1 1 0', minWidth: 180, display: 'flex', flexDirection: 'column',
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderTop: `2px solid ${stage.color}`,
      borderRadius: 10,
    }}>
      <div style={{ padding: '10px 12px 8px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{stage.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: stage.color,
              background: alpha(stage.color, 0.12), padding: '1px 6px',
              borderRadius: 5, fontFamily: 'Geist Mono, monospace',
            }}>
              {deals.length}
            </span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textFaint, display: 'flex', padding: 0 }}>
              <Plus size={12} />
            </button>
          </div>
        </div>
        {totalAmt > 0 && (
          <span style={{ fontSize: 9, color: t.textFaint, fontFamily: 'Geist Mono, monospace' }}>{fmtUSD(totalAmt)}</span>
        )}
      </div>

      <div style={{ padding: 8, overflowY: 'auto', flex: 1, maxHeight: 'calc(100vh - 240px)' }}>
        {deals.map(deal => <KanbanCard key={deal.id} deal={deal} onCardClick={onCardClick} onActionClick={onActionClick} />)}
        {deals.length === 0 && (
          <div style={{
            border: `1px dashed ${t.border}`, borderRadius: 8, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 9, color: t.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Actions Drawer ───────────────────────────────────────────────────────────

function ActionsDrawer({ flo, onClose, onStartWork }: {
  flo: Flo; onClose: () => void; onStartWork: (deal: Deal, mode: WorkMode) => void;
}) {
  const t = useTheme();
  const [filter, setFilter] = useState<ActionFilter>('all');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());

  const tabs: { id: ActionFilter; label: string }[] = [
    { id: 'all', label: 'All' }, { id: 'overdue', label: 'Overdue' },
    { id: 'today', label: 'Due Today' }, { id: 'week', label: 'This Week' },
  ];

  const visible = flo.actions.filter(a =>
    !dismissed.has(a.id) && !snoozed.has(a.id) &&
    (filter === 'all' || a.filter.includes(filter))
  );
  const totalImpact = visible.reduce((s, a) => s + a.impactRaw, 0);

  return (
    <div style={{ width: 560, height: '100%', display: 'flex', flexDirection: 'column', background: t.panel, borderLeft: `1px solid ${t.border}` }}>
      <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${t.brandBlue} 0%, ${t.brandBlueDeep} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={15} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Flo Actions</div>
              <div style={{ fontSize: 11, color: t.textSubtle }}>{visible.length} actions · {fmtUSD(totalImpact)} at risk</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSubtle, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 4, background: t.inset, borderRadius: 8, padding: 3 }}>
          {tabs.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flex: 1, padding: '5px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600,
              background: filter === f.id ? (t.mode === 'dark' ? '#162030' : '#fff') : 'transparent',
              color: filter === f.id ? t.brandBlue : t.textSubtle,
              boxShadow: filter === f.id && t.mode === 'light' ? '0 1px 3px rgba(15,26,42,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
        {visible.map(action => {
          const deal = flo.deals.find(d => d.id === action.dealId);
          const urgColor = URGENCY_COLOR(t)[action.urgency];
          return (
            <div key={action.id} style={{
              background: t.card, border: `1px solid ${t.border}`,
              borderLeft: `3px solid ${urgColor}`, borderRadius: 10,
              padding: '12px 14px', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <Avatar initials={action.name.split(' ').map(p => p[0]).join('').slice(0, 2)} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{action.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <DollarSign size={10} style={{ color: urgColor }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: urgColor, fontFamily: 'Geist Mono, monospace' }}>{action.impact}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.4 }}>{action.context}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => deal && action.actionType && onStartWork(deal, action.actionType)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, color: '#fff',
                    background: `linear-gradient(135deg, ${t.brandBlue} 0%, ${t.brandBlueDeep} 100%)`,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {action.primaryBtn}
                </button>
                <button
                  onClick={() => setSnoozed(prev => new Set([...prev, action.id]))}
                  style={{
                    padding: '7px 12px', borderRadius: 8, border: `1px solid ${t.border}`,
                    cursor: 'pointer', fontSize: 11, fontWeight: 600, color: t.textMuted,
                    background: 'transparent', transition: 'all 0.15s',
                  }}
                >
                  Snooze
                </button>
                <button
                  onClick={() => setDismissed(prev => new Set([...prev, action.id]))}
                  style={{
                    padding: '7px 12px', borderRadius: 8, border: `1px solid ${t.border}`,
                    cursor: 'pointer', fontSize: 11, fontWeight: 600, color: t.textMuted,
                    background: 'transparent', transition: 'all 0.15s',
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle size={32} style={{ color: t.brandGreen, margin: '0 auto 12px' }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: t.textMuted }}>All clear</div>
            <div style={{ fontSize: 12, color: t.textFaint, marginTop: 4 }}>No actions in this filter</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Insights Drawer ──────────────────────────────────────────────────────────

function InsightsDrawer({ flo, onClose }: { flo: Flo; onClose: () => void }) {
  const t = useTheme();
  const criticalCount = flo.deals.filter(d => d.urgency === 'critical').length;
  const highCount = flo.deals.filter(d => d.urgency === 'high').length;
  const amberCount = flo.deals.filter(d => d.urgency === 'amber').length;
  const totalPipeline = flo.deals.reduce((s, d) => s + d.amountRaw, 0);
  const atRisk = flo.deals.filter(d => ['critical', 'high'].includes(d.urgency)).reduce((s, d) => s + d.amountRaw, 0);
  const scoreColor = flo.healthScore >= 80 ? t.brandGreen : flo.healthScore >= 60 ? t.warning : t.danger;

  return (
    <div style={{ width: 560, height: '100%', display: 'flex', flexDirection: 'column', background: t.panel, borderLeft: `1px solid ${t.border}` }}>
      <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${t.brandGreen} 0%, ${t.mode === 'dark' ? '#02a87e' : '#04835f'} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={15} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Flo Insights</div>
              <div style={{ fontSize: 11, color: t.textSubtle }}>{flo.name} · Live analysis</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSubtle, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 12,
          padding: 18, marginBottom: 12, textAlign: 'center', boxShadow: t.mode === 'light' ? t.shadow : 'none',
        }}>
          <div style={{ fontSize: 11, color: t.textSubtle, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Flo Health Score</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: scoreColor, fontFamily: 'Geist Mono, monospace', lineHeight: 1 }}>{flo.healthScore}</div>
          <div style={{ fontSize: 11, color: t.textFaint, marginTop: 4 }}>out of 100</div>
          <div style={{ height: 6, borderRadius: 3, background: t.inset, marginTop: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%', width: `${flo.healthScore}%`,
              borderRadius: 3, background: `linear-gradient(90deg, ${alpha(scoreColor, 0.5)}, ${scoreColor})`,
            }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Total Pipeline', value: fmtUSD(totalPipeline, true), Icon: TrendingUp, color: t.brandBlue },
            { label: 'Revenue at Risk', value: fmtUSD(atRisk, true), Icon: AlertTriangle, color: t.danger },
            { label: 'Active Deals', value: String(flo.deals.length), Icon: Users, color: t.brandGreen },
            { label: 'Actions Needed', value: String(flo.actions.length), Icon: Activity, color: t.warning },
          ].map(stat => (
            <div key={stat.label} style={{
              background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 14,
              boxShadow: t.mode === 'light' ? t.shadow : 'none',
            }}>
              <stat.Icon size={16} style={{ color: stat.color, marginBottom: 8 }} />
              <div style={{ fontSize: 20, fontWeight: 800, color: t.text, fontFamily: 'Geist Mono, monospace', marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: t.textFaint }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 12,
          padding: 14, marginBottom: 12, boxShadow: t.mode === 'light' ? t.shadow : 'none',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, marginBottom: 12 }}>Urgency Breakdown</div>
          {[
            { label: 'Critical', count: criticalCount, color: t.danger },
            { label: 'High', count: highCount, color: URGENCY_COLOR(t).high },
            { label: 'Amber', count: amberCount, color: t.warning },
            { label: 'Active', count: flo.deals.filter(d => d.urgency === 'green').length, color: t.brandGreen },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: t.textMuted, flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.color, fontFamily: 'Geist Mono, monospace' }}>{row.count}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: t.mode === 'dark'
            ? 'linear-gradient(135deg, #0c1a2a 0%, #0a1520 100%)'
            : 'linear-gradient(135deg, #EAF1FE 0%, #F4F8FF 100%)',
          border: `1px solid ${alpha(t.brandBlue, 0.2)}`,
          borderRadius: 12, padding: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Star size={13} style={{ color: t.brandBlue }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: t.brandBlue }}>AI Guidance</span>
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>
            {criticalCount > 0
              ? `You have ${criticalCount} critical deal${criticalCount > 1 ? 's' : ''} at risk. Prioritize calling borrowers with expiring rate locks — each day of delay increases fall-through probability by ~12%.`
              : 'Your pipeline looks healthy. Focus on moving deals through processing and maintaining realtor relationships to sustain deal flow.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Call Mode ────────────────────────────────────────────────────────────────

function CallMode({ deal, onOutcome }: { deal: Deal; onOutcome: (o: CallOutcome) => void }) {
  const t = useTheme();
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const OUTCOMES: { id: CallOutcome; label: string; Icon: React.FC<{ size: number }>; color: string }[] = [
    { id: 'connected', label: 'Connected', Icon: CheckCircle, color: t.brandGreen },
    { id: 'voicemail', label: 'Voicemail', Icon: VoicemailIcon, color: t.brandBlue },
    { id: 'no-answer', label: 'No Answer', Icon: PhoneOff, color: t.warning },
    { id: 'bad-number', label: 'Bad Number', Icon: AlertCircle, color: t.danger },
  ];

  const NEXT_STEPS = ['Schedule follow-up call', 'Send text recap', 'Request missing docs', 'Send rate quote', 'Email next steps', 'Mark as nurture'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!outcome && (
        <div style={{
          background: t.mode === 'dark' ? 'linear-gradient(135deg, #0a1a0d, #071410)' : 'linear-gradient(135deg, #ECFAF4, #F4FCF8)',
          border: `1px solid ${alpha(t.brandGreen, 0.25)}`,
          borderRadius: 12, padding: 18,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <div style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              background: alpha(t.brandGreen, 0.15), animation: 'callPulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.brandGreen}, ${t.mode === 'dark' ? '#02a87e' : '#048466'})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Phone size={24} style={{ color: '#fff' }} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: t.brandGreen, fontFamily: 'Geist Mono, monospace' }}>{fmt(seconds)}</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>Call in progress · {deal.phone}</div>
          <button onClick={() => setMuted(m => !m)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
            border: `1px solid ${muted ? alpha(t.danger, 0.4) : t.border}`,
            background: muted ? alpha(t.danger, 0.08) : 'transparent',
            color: muted ? t.danger : t.textMuted, cursor: 'pointer',
            fontSize: 11,
          }}>
            {muted ? <MicOff size={13} /> : <Mic size={13} />}
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      )}

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Call Notes</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Type notes while you talk..."
          style={{
            width: '100%', minHeight: 90, background: t.inset,
            border: `1px solid ${t.border}`, borderRadius: 8,
            padding: '10px 12px', color: t.text, fontSize: 12,
            fontFamily: 'Geist, sans-serif', resize: 'vertical', outline: 'none',
            lineHeight: 1.6, boxSizing: 'border-box',
          }}
        />
      </div>

      {!outcome ? (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Call Outcome</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {OUTCOMES.map(o => (
              <button key={o.id} onClick={() => { setOutcome(o.id); onOutcome(o.id); }} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8,
                border: `1px solid ${alpha(o.color, 0.3)}`, background: alpha(o.color, 0.08),
                color: o.color, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
              }}>
                <o.Icon size={14} /> {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested Next Step</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {NEXT_STEPS.map(step => (
              <button key={step} style={{
                padding: '6px 12px', borderRadius: 20,
                border: `1px solid ${alpha(t.brandBlue, 0.25)}`,
                background: alpha(t.brandBlue, 0.08), color: t.brandBlue,
                cursor: 'pointer', fontSize: 11, transition: 'all 0.15s',
              }}>
                {step}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Email/Follow-up Mode ─────────────────────────────────────────────────────

function CommsMode({ deal, mode }: { deal: Deal; mode: 'email' | 'follow-up' }) {
  const t = useTheme();
  const [body, setBody] = useState(
    mode === 'email'
      ? `Hi ${deal.name.split(' ')[0]},\n\nI wanted to follow up on your loan application and make sure everything is moving smoothly.\n\nPlease let me know if you have any questions — I'm here to help every step of the way.\n\nBest,\nMarcus Cole\nSenior Loan Officer`
      : `Hi ${deal.name.split(' ')[0]},\n\nJust checking in to see how things are going. ${deal.nextStep}.\n\nLet me know if you need anything!\n\n— Marcus`
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.inset, border: `1px solid ${t.border}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 11, color: t.textSubtle }}>
            To: <span style={{ color: t.brandBlue }}>{deal.email}</span>
          </div>
        </div>
        <textarea value={body} onChange={e => setBody(e.target.value)} style={{
          width: '100%', minHeight: 220, background: 'transparent', border: 'none',
          padding: '12px 14px', color: t.text, fontSize: 12,
          fontFamily: 'Geist, sans-serif', resize: 'vertical', outline: 'none',
          lineHeight: 1.7, boxSizing: 'border-box',
        }} />
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 700, color: '#fff',
        background: `linear-gradient(135deg, ${t.brandBlue}, ${t.brandBlueDeep})`,
      }}>
        <Send size={14} /> Send {mode === 'email' ? 'Email' : 'Follow-up'}
      </button>
    </div>
  );
}

// ─── Profile Workspace ────────────────────────────────────────────────────────

function ProfileWorkspace({ deal, flo, workMode, onClose, onPrev, onNext, hasPrev, hasNext, callOutcome, onCallOutcome }: {
  deal: Deal; flo: Flo; workMode: WorkMode; onClose: () => void;
  onPrev: () => void; onNext: () => void; hasPrev: boolean; hasNext: boolean;
  callOutcome: CallOutcome | null; onCallOutcome: (o: CallOutcome) => void;
}) {
  const t = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('timeline');
  const [confirmClose, setConfirmClose] = useState(false);
  const [noteText, setNoteText] = useState(deal.notes);
  const stageIdx = flo.stages.findIndex(s => s.id === deal.stage);
  const nextStage = stageIdx < flo.stages.length - 1 ? flo.stages[stageIdx + 1] : null;
  const urgColor = URGENCY_COLOR(t)[deal.urgency];

  const handleClose = () => {
    if (workMode === 'call' && !callOutcome) setConfirmClose(true);
    else onClose();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' }, { id: 'notes', label: 'Notes' },
    { id: 'deal', label: 'Deal Details' }, { id: 'documents', label: 'Documents' },
  ];

  return (
    <div style={{ width: 720, height: '100%', display: 'flex', flexDirection: 'column', background: t.panel, borderLeft: `1px solid ${t.border}`, position: 'relative' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={onPrev} disabled={!hasPrev} style={{ background: 'none', border: 'none', cursor: hasPrev ? 'pointer' : 'default', color: hasPrev ? t.brandBlue : t.textFaint, display: 'flex' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={onNext} disabled={!hasNext} style={{ background: 'none', border: 'none', cursor: hasNext ? 'pointer' : 'default', color: hasNext ? t.brandBlue : t.textFaint, display: 'flex' }}>
              <ChevronRight size={16} />
            </button>
            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: urgColor, background: alpha(urgColor, 0.12), padding: '3px 8px', borderRadius: 5,
            }}>
              {URGENCY_LABEL[deal.urgency]}
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSubtle, display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <Avatar initials={deal.avatar} size={48} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 3 }}>{deal.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: t.textMuted }}>{deal.company}</span>
              <span style={{ fontSize: 10, color: t.textFaint }}>·</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.brandBlue, fontFamily: 'Geist Mono, monospace' }}>{deal.amount}</span>
              <span style={{ fontSize: 10, color: t.textFaint }}>·</span>
              <span style={{
                fontSize: 10, color: flo.stages[stageIdx]?.color || t.textMuted,
                background: alpha(flo.stages[stageIdx]?.color || t.textMuted, 0.12),
                padding: '2px 7px', borderRadius: 4,
              }}>
                {flo.stages[stageIdx]?.label || deal.stage}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { Icon: Phone, label: 'Call', color: t.brandGreen },
            { Icon: MessageSquare, label: 'Text', color: t.brandBlue },
            { Icon: Mail, label: 'Email', color: t.brandBlue },
            { Icon: Calendar, label: 'Schedule', color: t.warning },
          ].map(btn => (
            <button key={btn.label} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
              border: `1px solid ${alpha(btn.color, 0.3)}`, background: alpha(btn.color, 0.08),
              color: btn.color, cursor: 'pointer', fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
            }}>
              <btn.Icon size={13} /> {btn.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: t.textFaint, fontFamily: 'Geist Mono, monospace', alignSelf: 'center' }}>{deal.phone}</span>
        </div>
      </div>

      {workMode && (
        <div style={{ flexShrink: 0, padding: '14px 20px', borderBottom: `1px solid ${t.border}`, background: t.surface, overflowY: 'auto', maxHeight: '55%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {workMode === 'call' && <Phone size={14} style={{ color: t.brandGreen }} />}
            {workMode === 'email' && <Mail size={14} style={{ color: t.brandBlue }} />}
            {workMode === 'follow-up' && <RefreshCw size={14} style={{ color: t.warning }} />}
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: workMode === 'call' ? t.brandGreen : workMode === 'email' ? t.brandBlue : t.warning,
            }}>
              {workMode === 'call' ? 'Active Call' : workMode === 'email' ? 'Compose Email' : 'Follow Up'}
            </span>
          </div>
          {workMode === 'call' ? <CallMode deal={deal} onOutcome={onCallOutcome} /> : <CommsMode deal={deal} mode={workMode} />}
        </div>
      )}

      <div style={{ display: 'flex', padding: '0 20px', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '11px 14px', background: 'none', border: 'none',
            borderBottom: `2px solid ${activeTab === tab.id ? t.brandBlue : 'transparent'}`,
            color: activeTab === tab.id ? t.brandBlue : t.textSubtle,
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            transition: 'all 0.15s', marginBottom: -1,
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {activeTab === 'timeline' && (
          <div>
            {deal.timeline.length === 0 && <div style={{ fontSize: 12, color: t.textFaint, textAlign: 'center', padding: '20px 0' }}>No activity yet</div>}
            {deal.timeline.map(entry => (
              <div key={entry.id} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: t.card,
                  border: `1px solid ${t.border}`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                }}>
                  {entry.type === 'call' && <Phone size={11} style={{ color: t.brandGreen }} />}
                  {entry.type === 'email' && <Mail size={11} style={{ color: t.brandBlue }} />}
                  {entry.type === 'note' && <FileText size={11} style={{ color: t.warning }} />}
                  {entry.type === 'stage' && <ChevronRight size={11} style={{ color: '#9b6dff' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{entry.text}</div>
                  <div style={{ fontSize: 10, color: t.textFaint, fontFamily: 'Geist Mono, monospace', marginTop: 2 }}>{entry.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'notes' && (
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add notes about this deal..." style={{
            width: '100%', minHeight: 200, background: t.inset, border: `1px solid ${t.border}`,
            borderRadius: 8, padding: '12px 14px', color: t.text, fontSize: 12,
            fontFamily: 'Geist, sans-serif', resize: 'vertical', outline: 'none',
            lineHeight: 1.7, boxSizing: 'border-box',
          }} />
        )}
        {activeTab === 'deal' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Loan Amount', value: deal.amount },
              { label: 'Commission', value: deal.commission },
              { label: 'Current Stage', value: flo.stages[stageIdx]?.label || deal.stage },
              { label: 'Last Contact', value: deal.lastContact },
              { label: 'Phone', value: deal.phone },
              { label: 'Email', value: deal.email },
              { label: 'Next Step', value: deal.nextStep },
            ].map(item => (
              <div key={item.label} style={{ background: t.inset, border: `1px solid ${t.border}`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: t.textFaint, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'documents' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <FileText size={32} style={{ color: t.textFaint, margin: '0 auto 10px' }} />
            <div style={{ fontSize: 13, color: t.textFaint }}>No documents uploaded</div>
          </div>
        )}
      </div>

      {nextStage && (
        <div style={{
          padding: '12px 20px', borderTop: `1px solid ${t.border}`,
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: t.surface,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {flo.stages.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: i <= stageIdx ? s.color : t.inset,
                  border: `1px solid ${i <= stageIdx ? s.color : t.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: i <= stageIdx ? '#fff' : t.textFaint,
                  fontFamily: 'Geist Mono, monospace', fontWeight: 700, flexShrink: 0,
                }}>
                  {i < stageIdx ? '✓' : i === stageIdx ? '●' : String(i + 1)}
                </div>
                {i < flo.stages.length - 1 && <div style={{ width: 14, height: 1, background: t.border }} />}
              </div>
            ))}
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
            border: `1px solid ${alpha(nextStage.color, 0.4)}`, background: alpha(nextStage.color, 0.12),
            color: nextStage.color, cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
          }}>
            Move to {nextStage.label} <ChevronRight size={13} />
          </button>
        </div>
      )}

      {confirmClose && (
        <div style={{ position: 'absolute', inset: 0, background: t.scrim, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: t.card, border: `1px solid ${alpha(t.danger, 0.35)}`, borderRadius: 14, padding: 24, width: 320, textAlign: 'center', boxShadow: t.shadow }}>
            <AlertTriangle size={28} style={{ color: t.danger, marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8 }}>Call in progress</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 18, lineHeight: 1.5 }}>
              You haven't logged an outcome yet. Please select one before closing.
            </div>
            <button onClick={() => setConfirmClose(false)} style={{
              width: '100%', padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: '#fff',
              background: `linear-gradient(135deg, ${t.brandBlue}, ${t.brandBlueDeep})`,
            }}>
              Go back and log outcome
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Flo Picker ───────────────────────────────────────────────────────────────

function FloPicker({ onSelect, themeMode, onToggleTheme }: { onSelect: (flo: Flo) => void; themeMode: ThemeMode; onToggleTheme: () => void }) {
  const t = useTheme();
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: t.bg, padding: 40,
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 20, left: 24 }}>
        <FloRateLogo size={28} />
      </div>
      <div style={{ position: 'absolute', top: 22, right: 24 }}>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20,
        background: alpha(t.brandBlue, 0.1), border: `1px solid ${alpha(t.brandBlue, 0.2)}`, marginBottom: 20,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.brandGreen }} />
        <span style={{ fontSize: 11, color: t.brandBlue, fontWeight: 700 }}>Deal Flo</span>
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: t.text, marginBottom: 6, textAlign: 'center', margin: '0 0 6px' }}>
        Select a Flo
      </h1>
      <p style={{ fontSize: 13, color: t.textSubtle, marginBottom: 40, textAlign: 'center' }}>
        Choose a workflow to open its deal board
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760 }}>
        {FLOS.map(flo => {
          const scoreColor = flo.healthScore >= 80 ? t.brandGreen : flo.healthScore >= 60 ? t.warning : t.danger;
          return (
            <button
              key={flo.id} onClick={() => onSelect(flo)}
              style={{
                width: 220, background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: 20, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: t.mode === 'light' ? t.shadow : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = alpha(t.brandBlue, 0.35);
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = t.mode === 'light' ? '0 12px 28px rgba(15,26,42,0.12)' : '0 12px 32px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = t.mode === 'light' ? t.shadow : 'none';
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: t.mode === 'dark' ? 'linear-gradient(135deg, #162030, #0f1a28)' : alpha(t.brandBlue, 0.1),
                border: `1px solid ${alpha(t.brandBlue, 0.2)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                <Activity size={16} style={{ color: t.brandBlue }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 4 }}>{flo.name}</div>
              <div style={{ fontSize: 11, color: t.textSubtle, marginBottom: 14 }}>{flo.dealCount} deals · {flo.stages.length} stages</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {flo.stages.slice(0, 4).map(s => <div key={s.id} style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />)}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: scoreColor, fontFamily: 'Geist Mono, monospace' }}>{flo.healthScore}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mini Queue ───────────────────────────────────────────────────────────────

function MiniQueue({ actions, activeDealId, onSelectDeal, flo }: {
  actions: ActionRow[]; activeDealId: string;
  onSelectDeal: (deal: Deal, mode: WorkMode) => void; flo: Flo;
}) {
  const t = useTheme();
  return (
    <div style={{ width: 240, height: '100%', background: t.surface, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Action Queue</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {actions.map(action => {
          const deal = flo.deals.find(d => d.id === action.dealId);
          const isActive = action.dealId === activeDealId;
          const urgColor = URGENCY_COLOR(t)[action.urgency];
          return (
            <button key={action.id} onClick={() => deal && onSelectDeal(deal, action.actionType)} style={{
              width: '100%',
              background: isActive ? alpha(t.brandBlue, t.mode === 'dark' ? 0.1 : 0.08) : 'transparent',
              border: `1px solid ${isActive ? alpha(t.brandBlue, 0.3) : t.border}`,
              borderLeft: `3px solid ${isActive ? t.brandBlue : urgColor}`,
              borderRadius: 8, padding: '8px 10px', marginBottom: 5,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <UrgencyDot level={action.urgency} />
                <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? t.text : t.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {action.name}
                </span>
              </div>
              <div style={{ fontSize: 9, color: t.textFaint, marginTop: 3, marginLeft: 14 }}>{action.primaryBtn}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main DealFlo Screen ──────────────────────────────────────────────────────

export function DealFloScreen() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const theme = useMemo(() => themeMode === 'dark' ? DARK : LIGHT, [themeMode]);

  const [selectedFlo, setSelectedFlo] = useState<Flo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [openDrawerType, setOpenDrawerType] = useState<'actions' | 'insights' | null>(null);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [workMode, setWorkMode] = useState<WorkMode>(null);
  const [callOutcome, setCallOutcome] = useState<CallOutcome | null>(null);
  const [dealIndex, setDealIndex] = useState(0);

  const isWorkSession = activeDeal !== null;
  const boardScrim = activeDeal ? 0.45 : openDrawerType ? 0.35 : 0;

  const openProfile = useCallback((deal: Deal, mode: WorkMode = null) => {
    setActiveDeal(deal); setWorkMode(mode); setCallOutcome(null);
    if (selectedFlo) {
      const idx = selectedFlo.deals.findIndex(d => d.id === deal.id);
      setDealIndex(idx >= 0 ? idx : 0);
    }
  }, [selectedFlo]);

  const closeProfile = useCallback(() => {
    setActiveDeal(null); setWorkMode(null); setCallOutcome(null);
  }, []);

  const navDeal = useCallback((dir: 1 | -1) => {
    if (!selectedFlo) return;
    const newIdx = dealIndex + dir;
    if (newIdx < 0 || newIdx >= selectedFlo.deals.length) return;
    setDealIndex(newIdx); setActiveDeal(selectedFlo.deals[newIdx]);
    setWorkMode(null); setCallOutcome(null);
  }, [dealIndex, selectedFlo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDeal && workMode === 'call' && !callOutcome) return;
        if (activeDeal) { closeProfile(); return; }
        setOpenDrawerType(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeDeal, workMode, callOutcome, closeProfile]);

  const toggleTheme = () => setThemeMode(m => m === 'dark' ? 'light' : 'dark');

  const fontInject = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;600;700;800&display=swap');
      @keyframes callPulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.35); opacity: 0; }
      }
    `}</style>
  );

  if (!selectedFlo) {
    return (
      <ThemeContext.Provider value={theme}>
        {fontInject}
        <FloPicker onSelect={flo => setSelectedFlo(flo)} themeMode={themeMode} onToggleTheme={toggleTheme} />
      </ThemeContext.Provider>
    );
  }

  const t = theme;
  const stageDeals = (stageId: string) => selectedFlo.deals.filter(d => d.stage === stageId);
  const totalPipeline = selectedFlo.deals.reduce((s, d) => s + d.amountRaw, 0);

  return (
    <ThemeContext.Provider value={theme}>
      {fontInject}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, fontFamily: 'Geist, sans-serif', position: 'relative', overflow: 'hidden' }}>
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
          borderBottom: `1px solid ${t.border}`, background: t.panel, flexShrink: 0, zIndex: 10,
          flexWrap: 'wrap',
        }}>
          <FloRateLogo size={26} />

          <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }} />

          <button
            onClick={() => { setSelectedFlo(null); setActiveDeal(null); setOpenDrawerType(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer',
              color: t.textMuted, fontSize: 12, padding: '4px 8px', borderRadius: 6, transition: 'color 0.15s',
            }}
          >
            <ArrowLeft size={14} /> Deal Flo
          </button>

          <div style={{ width: 1, height: 16, background: t.border }} />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{selectedFlo.name}</span>
            <span style={{ fontSize: 11, color: t.textFaint, fontFamily: 'Geist Mono, monospace' }}>{selectedFlo.dealCount} deals</span>
            <span style={{ fontSize: 11, color: t.textFaint }}>·</span>
            <span style={{ fontSize: 11, color: t.textMuted, fontFamily: 'Geist Mono, monospace' }}>{fmtUSD(totalPipeline, true)}</span>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', background: t.inset, borderRadius: 8, padding: 3, border: `1px solid ${t.border}`, gap: 2 }}>
            {([
              { id: 'board' as ViewMode, Icon: LayoutGrid },
              { id: 'list' as ViewMode, Icon: List },
              { id: 'focus' as ViewMode, Icon: Focus },
            ]).map(v => (
              <button key={v.id} onClick={() => setViewMode(v.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === v.id ? (t.mode === 'dark' ? '#162030' : '#fff') : 'transparent',
                color: viewMode === v.id ? t.brandBlue : t.textSubtle,
                boxShadow: viewMode === v.id && t.mode === 'light' ? '0 1px 3px rgba(15,26,42,0.08)' : 'none',
                transition: 'all 0.15s',
              }}>
                <v.Icon size={13} />
              </button>
            ))}
          </div>

          <HealthPill score={selectedFlo.healthScore} />

          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
            border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#fff',
            background: `linear-gradient(135deg, ${t.brandGreen}, ${t.mode === 'dark' ? '#02a87e' : '#048466'})`,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <Plus size={13} /> Add Deal
          </button>

          <button
            onClick={() => setOpenDrawerType(d => d === 'actions' ? null : 'actions')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
              border: `1px solid ${openDrawerType === 'actions' ? alpha(t.brandBlue, 0.4) : t.border}`,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              color: openDrawerType === 'actions' ? t.brandBlue : t.textMuted,
              background: openDrawerType === 'actions' ? alpha(t.brandBlue, 0.08) : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            <Zap size={12} /> Actions
            {selectedFlo.actions.length > 0 && (
              <span style={{ background: t.danger, color: '#fff', borderRadius: 10, fontSize: 9, fontWeight: 800, padding: '1px 5px', fontFamily: 'Geist Mono, monospace' }}>
                {selectedFlo.actions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpenDrawerType(d => d === 'insights' ? null : 'insights')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
              border: `1px solid ${openDrawerType === 'insights' ? alpha(t.brandGreen, 0.4) : t.border}`,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              color: openDrawerType === 'insights' ? t.brandGreen : t.textMuted,
              background: openDrawerType === 'insights' ? alpha(t.brandGreen, 0.08) : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            <BarChart2 size={12} /> Insights
          </button>

          <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {isWorkSession && (
            <MiniQueue actions={selectedFlo.actions} activeDealId={activeDeal!.id} onSelectDeal={openProfile} flo={selectedFlo} />
          )}

          <div style={{
            flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: 16,
            transition: 'filter 0.3s, opacity 0.3s',
            filter: boardScrim > 0 ? `brightness(${1 - boardScrim * (t.mode === 'dark' ? 0.6 : 0.15)})` : 'none',
            opacity: boardScrim > 0 ? (t.mode === 'light' ? 0.7 : 1) : 1,
            minWidth: 0,
          }}>
            {viewMode === 'board' && (
              <div style={{ display: 'flex', gap: 10, height: '100%', minWidth: selectedFlo.stages.length * 195 }}>
                {selectedFlo.stages.map(stage => (
                  <KanbanCol key={stage.id} stage={stage} deals={stageDeals(stage.id)}
                    onCardClick={deal => openProfile(deal)}
                    onActionClick={deal => openProfile(deal, deal.actionType)} />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div style={{ maxWidth: 900 }}>
                {selectedFlo.deals.map(deal => {
                  const stageInfo = selectedFlo.stages.find(s => s.id === deal.stage);
                  return (
                    <div key={deal.id} onClick={() => openProfile(deal)} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', borderRadius: 9,
                      marginBottom: 5, background: t.card, border: `1px solid ${t.border}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                      <UrgencyDot level={deal.urgency} />
                      <Avatar initials={deal.avatar} size={28} />
                      <span style={{ flex: '2 1 0', fontSize: 13, fontWeight: 600, color: t.text }}>{deal.name}</span>
                      <span style={{ flex: '2 1 0', fontSize: 11, color: t.textMuted }}>{deal.company}</span>
                      <span style={{ flex: '1 1 0', fontSize: 12, fontWeight: 700, color: t.brandBlue, fontFamily: 'Geist Mono, monospace' }}>{deal.amount}</span>
                      <span style={{ flex: '1 1 0', fontSize: 10, color: stageInfo?.color || t.textMuted, background: alpha(stageInfo?.color || t.textMuted, 0.12), padding: '2px 7px', borderRadius: 4 }}>
                        {stageInfo?.label || deal.stage}
                      </span>
                      <span style={{ flex: '3 1 0', fontSize: 11, color: t.textSubtle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.nextStep}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'focus' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, maxWidth: 900 }}>
                {selectedFlo.deals.filter(d => ['critical', 'high'].includes(d.urgency)).map(deal => {
                  const urgColor = URGENCY_COLOR(t)[deal.urgency];
                  return (
                    <div key={deal.id} onClick={() => openProfile(deal)} style={{
                      width: 240, padding: 16, background: t.card,
                      border: `1px solid ${alpha(urgColor, 0.3)}`, borderLeft: `3px solid ${urgColor}`,
                      borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <Avatar initials={deal.avatar} size={32} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{deal.name}</div>
                          <div style={{ fontSize: 10, color: urgColor, fontWeight: 600 }}>{URGENCY_LABEL[deal.urgency]}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5, marginBottom: 10 }}>{deal.nextStep}</div>
                      {deal.actionType && (
                        <button onClick={e => { e.stopPropagation(); openProfile(deal, deal.actionType); }} style={{
                          width: '100%', padding: '7px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
                          fontSize: 11, fontWeight: 700, color: '#fff', background: urgColor,
                        }}>
                          {deal.primaryAction}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {openDrawerType === 'actions' && !isWorkSession && (
            <div style={{ flexShrink: 0, height: '100%', overflow: 'hidden' }}>
              <ActionsDrawer flo={selectedFlo} onClose={() => setOpenDrawerType(null)} onStartWork={(deal, mode) => { setOpenDrawerType(null); openProfile(deal, mode); }} />
            </div>
          )}
          {openDrawerType === 'insights' && !isWorkSession && (
            <div style={{ flexShrink: 0, height: '100%', overflow: 'hidden' }}>
              <InsightsDrawer flo={selectedFlo} onClose={() => setOpenDrawerType(null)} />
            </div>
          )}
          {isWorkSession && activeDeal && (
            <div style={{ flexShrink: 0, height: '100%', overflow: 'hidden', position: 'relative' }}>
              <ProfileWorkspace
                deal={activeDeal} flo={selectedFlo} workMode={workMode}
                onClose={closeProfile} onPrev={() => navDeal(-1)} onNext={() => navDeal(1)}
                hasPrev={dealIndex > 0} hasNext={dealIndex < selectedFlo.deals.length - 1}
                callOutcome={callOutcome} onCallOutcome={o => setCallOutcome(o)}
              />
            </div>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
