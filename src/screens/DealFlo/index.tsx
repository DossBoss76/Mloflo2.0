import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, LayoutGrid, List, Focus, Heart, Plus, ChevronDown, Zap, BarChart2, X, Phone, Mail, MessageSquare, Calendar, Clock, AlertTriangle, DollarSign, ChevronRight, ChevronLeft, CheckCircle, PhoneOff, AlertCircle, MoreHorizontal, Mic, MicOff, Timer, FileText, Star, TrendingUp, Users, Activity, Send, Eye, RefreshCw, Voicemail as VoicemailIcon } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode = 'board' | 'list' | 'focus';
type UrgencyLevel = 'critical' | 'high' | 'amber' | 'green' | 'blue';
type ActionFilter = 'all' | 'overdue' | 'today' | 'week';
type CallOutcome = 'connected' | 'voicemail' | 'no-answer' | 'bad-number';
type WorkMode = 'call' | 'email' | 'follow-up' | null;
type Tab = 'timeline' | 'notes' | 'deal' | 'documents';

interface Stage {
  id: string;
  label: string;
  color: string;
}

interface Deal {
  id: string;
  name: string;
  company: string;
  amount: string;
  amountRaw: number;
  stage: string;
  urgency: UrgencyLevel;
  nextStep: string;
  primaryAction: string;
  actionType: WorkMode;
  phone: string;
  email: string;
  avatar: string;
  lastContact: string;
  commission: string;
  timeline: TimelineEntry[];
  notes: string;
}

interface TimelineEntry {
  id: string;
  type: 'call' | 'email' | 'note' | 'stage';
  text: string;
  time: string;
}

interface ActionRow {
  id: string;
  name: string;
  context: string;
  impact: string;
  impactRaw: number;
  urgency: UrgencyLevel;
  actionType: WorkMode;
  primaryBtn: string;
  filter: ActionFilter[];
  dealId: string;
}

interface Flo {
  id: string;
  name: string;
  dealCount: number;
  healthScore: number;
  stages: Stage[];
  deals: Deal[];
  actions: ActionRow[];
}

// ─── Color helpers ────────────────────────────────────────────────────────────

const URGENCY_COLOR: Record<UrgencyLevel, string> = {
  critical: '#ff5c5c',
  high: '#ff8c42',
  amber: '#f5a623',
  green: '#04d39e',
  blue: '#6dc2f1',
};

const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  critical: 'Critical',
  high: 'High',
  amber: 'Amber',
  green: 'Active',
  blue: 'Info',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FLOS: Flo[] = [
  {
    id: 'borrower-approval',
    name: 'Borrower Approval',
    dealCount: 19,
    healthScore: 72,
    stages: [
      { id: 'new-leads', label: 'New Leads', color: '#4d6070' },
      { id: 'pre-approval', label: 'Pre-Approval', color: '#6dc2f1' },
      { id: 'application', label: 'Application', color: '#f5a623' },
      { id: 'processing', label: 'Processing', color: '#b06dff' },
      { id: 'ctc', label: 'CTC', color: '#04d39e' },
      { id: 'closed', label: 'Closed', color: '#04d374' },
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
    id: 'realtor-growth',
    name: 'Realtor Growth',
    dealCount: 8,
    healthScore: 85,
    stages: [
      { id: 'prospect', label: 'Prospect', color: '#4d6070' },
      { id: 'active', label: 'Active Partner', color: '#6dc2f1' },
      { id: 'nurture', label: 'Nurture', color: '#f5a623' },
      { id: 'vip', label: 'VIP', color: '#04d39e' },
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
    id: 'retention',
    name: 'Retention',
    dealCount: 4,
    healthScore: 91,
    stages: [
      { id: 'past-client', label: 'Past Client', color: '#6dc2f1' },
      { id: 'refi-candidate', label: 'Refi Candidate', color: '#04d39e' },
      { id: 'vip-db', label: 'VIP Database', color: '#f5a623' },
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function UrgencyDot({ level }: { level: UrgencyLevel }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: URGENCY_COLOR[level],
      boxShadow: level === 'critical' ? `0 0 6px ${URGENCY_COLOR[level]}` : 'none',
      flexShrink: 0,
    }} />
  );
}

function Avatar({ initials, size = 48 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #1a2535 0%, #1f3044 100%)',
      border: '2px solid rgba(109,194,241,0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.3,
      fontFamily: 'Geist Mono, monospace',
      fontWeight: 600,
      color: '#6dc2f1',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function HealthPill({ score }: { score: number }) {
  const color = score >= 80 ? '#04d39e' : score >= 60 ? '#f5a623' : '#ff5c5c';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 20,
      background: `${color}14`,
      border: `1px solid ${color}30`,
    }}>
      <Heart size={11} style={{ color }} />
      <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: 'Geist Mono, monospace' }}>
        {score}
      </span>
    </div>
  );
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────

function KanbanCard({
  deal,
  onCardClick,
  onActionClick,
}: {
  deal: Deal;
  onCardClick: (deal: Deal) => void;
  onActionClick: (deal: Deal) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const urgColor = URGENCY_COLOR[deal.urgency];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCardClick(deal)}
      style={{
        background: hovered ? '#14192280' : '#0f1419',
        border: `1px solid ${hovered ? 'rgba(109,194,241,0.2)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 10,
        padding: '10px 11px',
        marginBottom: 7,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#dde3ec', fontFamily: 'Geist, sans-serif', lineHeight: 1.3 }}>
          {deal.name}
        </span>
        <button
          onClick={e => e.stopPropagation()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#4a5568', display: 'flex' }}
        >
          <MoreHorizontal size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: '#5a6474', fontFamily: 'Geist, sans-serif' }}>{deal.company}</span>
        <span style={{ fontSize: 10, color: '#3a4252' }}>·</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6dc2f1', fontFamily: 'Geist Mono, monospace' }}>{deal.amount}</span>
        <span style={{
          fontSize: 9, fontWeight: 600,
          color: urgColor,
          background: `${urgColor}15`,
          padding: '1px 5px', borderRadius: 4,
          fontFamily: 'Geist, sans-serif',
          marginLeft: 2,
        }}>
          {URGENCY_LABEL[deal.urgency]}
        </span>
      </div>

      <div style={{ fontSize: 10, color: '#4d5a6e', marginBottom: 8, lineHeight: 1.4, fontFamily: 'Geist, sans-serif' }}>
        {deal.nextStep}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <UrgencyDot level={deal.urgency} />
        {deal.actionType && (
          <button
            onClick={e => { e.stopPropagation(); onActionClick(deal); }}
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#0D0D12',
              background: urgColor,
              border: 'none',
              borderRadius: 6,
              padding: '3px 9px',
              cursor: 'pointer',
              fontFamily: 'Geist, sans-serif',
              transition: 'opacity 0.15s',
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

function KanbanCol({
  stage,
  deals,
  onCardClick,
  onActionClick,
}: {
  stage: Stage;
  deals: Deal[];
  onCardClick: (deal: Deal) => void;
  onActionClick: (deal: Deal) => void;
}) {
  const totalAmt = deals.reduce((s, d) => s + d.amountRaw, 0);
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalAmt);

  return (
    <div style={{
      flex: '1 1 0',
      minWidth: 180,
      display: 'flex',
      flexDirection: 'column',
      background: '#090e14',
      border: '1px solid rgba(255,255,255,0.05)',
      borderTop: `2px solid ${stage.color}`,
      borderRadius: 10,
    }}>
      <div style={{
        padding: '10px 12px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#c8d0dc', fontFamily: 'Geist, sans-serif', letterSpacing: '0.01em' }}>
            {stage.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: stage.color,
              background: `${stage.color}15`, padding: '1px 6px',
              borderRadius: 5, fontFamily: 'Geist Mono, monospace',
            }}>
              {deals.length}
            </span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a4252', display: 'flex', padding: 0 }}>
              <Plus size={12} />
            </button>
          </div>
        </div>
        {totalAmt > 0 && (
          <span style={{ fontSize: 9, color: '#3a4252', fontFamily: 'Geist Mono, monospace' }}>{fmt}</span>
        )}
      </div>

      <div style={{ padding: '8px', overflowY: 'auto', flex: 1, maxHeight: 'calc(100vh - 240px)' }}>
        {deals.map(deal => (
          <KanbanCard key={deal.id} deal={deal} onCardClick={onCardClick} onActionClick={onActionClick} />
        ))}
        {deals.length === 0 && (
          <div style={{
            border: '1px dashed rgba(255,255,255,0.06)',
            borderRadius: 8, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 9, color: '#2a3040', fontFamily: 'Geist, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Actions Drawer ───────────────────────────────────────────────────────────

function ActionsDrawer({
  flo,
  onClose,
  onStartWork,
}: {
  flo: Flo;
  onClose: () => void;
  onStartWork: (deal: Deal, mode: WorkMode) => void;
}) {
  const [filter, setFilter] = useState<ActionFilter>('all');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());

  const filterTabs: { id: ActionFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'today', label: 'Due Today' },
    { id: 'week', label: 'This Week' },
  ];

  const visible = flo.actions.filter(a =>
    !dismissed.has(a.id) && !snoozed.has(a.id) &&
    (filter === 'all' || a.filter.includes(filter))
  );
  const totalImpact = visible.reduce((s, a) => s + a.impactRaw, 0);
  const fmtImpact = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalImpact);

  return (
    <div style={{ width: 560, height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0f16', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6dc2f1 0%, #3a9fd8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} style={{ color: '#0D0D12' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#dde3ec', fontFamily: 'Geist, sans-serif' }}>Flo Actions</div>
              <div style={{ fontSize: 11, color: '#4a5568', fontFamily: 'Geist, sans-serif' }}>{visible.length} actions · {fmtImpact} at risk</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#060a0f', borderRadius: 8, padding: 3 }}>
          {filterTabs.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flex: 1, padding: '5px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, fontFamily: 'Geist, sans-serif',
              background: filter === f.id ? '#162030' : 'transparent',
              color: filter === f.id ? '#6dc2f1' : '#3a4558',
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
          const urgColor = URGENCY_COLOR[action.urgency];
          return (
            <div key={action.id} style={{
              background: '#0c1219', border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `3px solid ${urgColor}`, borderRadius: 10, padding: '12px 14px', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <Avatar initials={action.name.split(' ').map(p => p[0]).join('').slice(0, 2)} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#dde3ec', fontFamily: 'Geist, sans-serif' }}>{action.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <DollarSign size={10} style={{ color: urgColor }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: urgColor, fontFamily: 'Geist Mono, monospace' }}>{action.impact}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#4a5568', fontFamily: 'Geist, sans-serif', lineHeight: 1.4 }}>{action.context}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => deal && action.actionType && onStartWork(deal, action.actionType)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Geist, sans-serif',
                    background: 'linear-gradient(135deg, #6dc2f1 0%, #3a8fc7 100%)', transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {action.primaryBtn}
                </button>
                <button
                  onClick={() => setSnoozed(prev => new Set([...prev, action.id]))}
                  style={{
                    padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#4a5568',
                    fontFamily: 'Geist, sans-serif', background: 'transparent', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#8c9199'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4a5568'; e.currentTarget.style.background = 'transparent'; }}
                >
                  Snooze
                </button>
                <button
                  onClick={() => setDismissed(prev => new Set([...prev, action.id]))}
                  style={{
                    padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#4a5568',
                    fontFamily: 'Geist, sans-serif', background: 'transparent', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ff5c5c'; e.currentTarget.style.background = 'rgba(255,92,92,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4a5568'; e.currentTarget.style.background = 'transparent'; }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle size={32} style={{ color: '#04d39e', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#4a5568', fontFamily: 'Geist, sans-serif' }}>All clear</div>
            <div style={{ fontSize: 12, color: '#2a3040', fontFamily: 'Geist, sans-serif', marginTop: 4 }}>No actions in this filter</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Insights Drawer ──────────────────────────────────────────────────────────

function InsightsDrawer({ flo, onClose }: { flo: Flo; onClose: () => void }) {
  const criticalCount = flo.deals.filter(d => d.urgency === 'critical').length;
  const highCount = flo.deals.filter(d => d.urgency === 'high').length;
  const amberCount = flo.deals.filter(d => d.urgency === 'amber').length;
  const totalPipeline = flo.deals.reduce((s, d) => s + d.amountRaw, 0);
  const atRisk = flo.deals.filter(d => ['critical', 'high'].includes(d.urgency)).reduce((s, d) => s + d.amountRaw, 0);
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' } as Intl.NumberFormatOptions).format(n);
  const scoreColor = flo.healthScore >= 80 ? '#04d39e' : flo.healthScore >= 60 ? '#f5a623' : '#ff5c5c';

  return (
    <div style={{ width: 560, height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0f16', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #04d39e 0%, #02a87e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={15} style={{ color: '#0D0D12' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#dde3ec', fontFamily: 'Geist, sans-serif' }}>Flo Insights</div>
              <div style={{ fontSize: 11, color: '#4a5568', fontFamily: 'Geist, sans-serif' }}>{flo.name} · Live analysis</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{ background: '#0c1219', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px', marginBottom: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#4a5568', fontFamily: 'Geist, sans-serif', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Flo Health Score</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: scoreColor, fontFamily: 'Geist Mono, monospace', lineHeight: 1 }}>{flo.healthScore}</div>
          <div style={{ fontSize: 11, color: '#3a4558', fontFamily: 'Geist, sans-serif', marginTop: 4 }}>out of 100</div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', marginTop: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${flo.healthScore}%`, borderRadius: 3, background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})` }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Total Pipeline', value: fmt(totalPipeline), Icon: TrendingUp, color: '#6dc2f1' },
            { label: 'Revenue at Risk', value: fmt(atRisk), Icon: AlertTriangle, color: '#ff5c5c' },
            { label: 'Active Deals', value: String(flo.deals.length), Icon: Users, color: '#04d39e' },
            { label: 'Actions Needed', value: String(flo.actions.length), Icon: Activity, color: '#f5a623' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#0c1219', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px' }}>
              <stat.Icon size={16} style={{ color: stat.color, marginBottom: 8 }} />
              <div style={{ fontSize: 20, fontWeight: 800, color: '#dde3ec', fontFamily: 'Geist Mono, monospace', marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: '#3a4558', fontFamily: 'Geist, sans-serif' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0c1219', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8c9199', fontFamily: 'Geist, sans-serif', marginBottom: 12 }}>Urgency Breakdown</div>
          {[
            { label: 'Critical', count: criticalCount, color: '#ff5c5c' },
            { label: 'High', count: highCount, color: '#ff8c42' },
            { label: 'Amber', count: amberCount, color: '#f5a623' },
            { label: 'Active', count: flo.deals.filter(d => d.urgency === 'green').length, color: '#04d39e' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6a7585', fontFamily: 'Geist, sans-serif', flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.color, fontFamily: 'Geist Mono, monospace' }}>{row.count}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #0c1a2a 0%, #0a1520 100%)', border: '1px solid rgba(109,194,241,0.15)', borderRadius: 12, padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Star size={13} style={{ color: '#6dc2f1' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6dc2f1', fontFamily: 'Geist, sans-serif' }}>AI Guidance</span>
          </div>
          <div style={{ fontSize: 12, color: '#5a6474', fontFamily: 'Geist, sans-serif', lineHeight: 1.6 }}>
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

function CallMode({ deal, onOutcome }: { deal: Deal; onOutcome: (outcome: CallOutcome) => void }) {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const OUTCOMES: { id: CallOutcome; label: string; Icon: React.FC<{ size: number }>; color: string }[] = [
    { id: 'connected', label: 'Connected', Icon: CheckCircle, color: '#04d39e' },
    { id: 'voicemail', label: 'Voicemail', Icon: VoicemailIcon, color: '#6dc2f1' },
    { id: 'no-answer', label: 'No Answer', Icon: PhoneOff, color: '#f5a623' },
    { id: 'bad-number', label: 'Bad Number', Icon: AlertCircle, color: '#ff5c5c' },
  ];

  const NEXT_STEPS = ['Schedule follow-up call', 'Send text recap', 'Request missing docs', 'Send rate quote', 'Email next steps', 'Mark as nurture'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!outcome && (
        <div style={{
          background: 'linear-gradient(135deg, #0a1a0d 0%, #071410 100%)',
          border: '1px solid rgba(4,211,158,0.2)', borderRadius: 12, padding: '18px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <div style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              background: 'rgba(4,211,158,0.12)', animation: 'callPulse 1.5s ease-in-out infinite',
            }} />
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #04d39e 0%, #02a87e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={24} style={{ color: '#0D0D12' }} />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#04d39e', fontFamily: 'Geist Mono, monospace' }}>{fmt(seconds)}</div>
          <div style={{ fontSize: 12, color: '#2a5040', fontFamily: 'Geist, sans-serif' }}>Call in progress · {deal.phone}</div>
          <button
            onClick={() => setMuted(m => !m)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
              border: `1px solid ${muted ? '#ff5c5c40' : 'rgba(255,255,255,0.08)'}`,
              background: muted ? 'rgba(255,92,92,0.08)' : 'transparent',
              color: muted ? '#ff5c5c' : '#4a5568', cursor: 'pointer',
              fontSize: 11, fontFamily: 'Geist, sans-serif',
            }}
          >
            {muted ? <MicOff size={13} /> : <Mic size={13} />}
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      )}

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4a5568', fontFamily: 'Geist, sans-serif', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Call Notes</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Type notes while you talk..."
          style={{
            width: '100%', minHeight: 90, background: '#060a0f',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8,
            padding: '10px 12px', color: '#c8d0dc', fontSize: 12,
            fontFamily: 'Geist, sans-serif', resize: 'vertical', outline: 'none',
            lineHeight: 1.6, boxSizing: 'border-box',
          }}
        />
      </div>

      {!outcome ? (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a5568', fontFamily: 'Geist, sans-serif', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Call Outcome</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {OUTCOMES.map(o => (
              <button
                key={o.id}
                onClick={() => { setOutcome(o.id); onOutcome(o.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8,
                  border: `1px solid ${o.color}25`, background: `${o.color}08`,
                  color: o.color, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  fontFamily: 'Geist, sans-serif', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${o.color}14`; e.currentTarget.style.borderColor = `${o.color}50`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${o.color}08`; e.currentTarget.style.borderColor = `${o.color}25`; }}
              >
                <o.Icon size={14} /> {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a5568', fontFamily: 'Geist, sans-serif', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested Next Step</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {NEXT_STEPS.map(step => (
              <button key={step} style={{
                padding: '6px 12px', borderRadius: 20,
                border: '1px solid rgba(109,194,241,0.2)', background: 'rgba(109,194,241,0.06)',
                color: '#6dc2f1', cursor: 'pointer', fontSize: 11, fontFamily: 'Geist, sans-serif', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,194,241,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(109,194,241,0.06)'; }}>
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
  const [body, setBody] = useState(
    mode === 'email'
      ? `Hi ${deal.name.split(' ')[0]},\n\nI wanted to follow up on your loan application and make sure everything is moving smoothly.\n\nPlease let me know if you have any questions — I'm here to help every step of the way.\n\nBest,\nMarcus Cole\nSenior Loan Officer`
      : `Hi ${deal.name.split(' ')[0]},\n\nJust checking in to see how things are going. ${deal.nextStep}.\n\nLet me know if you need anything!\n\n— Marcus`
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#060a0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 11, color: '#3a4558', fontFamily: 'Geist, sans-serif' }}>
            To: <span style={{ color: '#6dc2f1' }}>{deal.email}</span>
          </div>
        </div>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{
            width: '100%', minHeight: 220, background: 'transparent', border: 'none',
            padding: '12px 14px', color: '#c8d0dc', fontSize: 12,
            fontFamily: 'Geist, sans-serif', resize: 'vertical', outline: 'none',
            lineHeight: 1.7, boxSizing: 'border-box',
          }}
        />
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Geist, sans-serif',
        background: 'linear-gradient(135deg, #6dc2f1 0%, #3a8fc7 100%)',
      }}>
        <Send size={14} /> Send {mode === 'email' ? 'Email' : 'Follow-up'}
      </button>
    </div>
  );
}

// ─── Profile Workspace ────────────────────────────────────────────────────────

function ProfileWorkspace({
  deal, flo, workMode, onClose, onPrev, onNext, hasPrev, hasNext, callOutcome, onCallOutcome,
}: {
  deal: Deal; flo: Flo; workMode: WorkMode; onClose: () => void;
  onPrev: () => void; onNext: () => void; hasPrev: boolean; hasNext: boolean;
  callOutcome: CallOutcome | null; onCallOutcome: (o: CallOutcome) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('timeline');
  const [confirmClose, setConfirmClose] = useState(false);
  const [noteText, setNoteText] = useState(deal.notes);
  const stageIdx = flo.stages.findIndex(s => s.id === deal.stage);
  const nextStage = stageIdx < flo.stages.length - 1 ? flo.stages[stageIdx + 1] : null;
  const urgColor = URGENCY_COLOR[deal.urgency];

  const handleClose = () => {
    if (workMode === 'call' && !callOutcome) { setConfirmClose(true); }
    else { onClose(); }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'notes', label: 'Notes' },
    { id: 'deal', label: 'Deal Details' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div style={{ width: 720, height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0f16', borderLeft: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={onPrev} disabled={!hasPrev} style={{ background: 'none', border: 'none', cursor: hasPrev ? 'pointer' : 'default', color: hasPrev ? '#6dc2f1' : '#2a3040', display: 'flex' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={onNext} disabled={!hasNext} style={{ background: 'none', border: 'none', cursor: hasNext ? 'pointer' : 'default', color: hasNext ? '#6dc2f1' : '#2a3040', display: 'flex' }}>
              <ChevronRight size={16} />
            </button>
            <div style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: urgColor, background: `${urgColor}15`, padding: '3px 8px', borderRadius: 5, fontFamily: 'Geist, sans-serif',
            }}>
              {URGENCY_LABEL[deal.urgency]}
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <Avatar initials={deal.avatar} size={48} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#dde3ec', fontFamily: 'Geist, sans-serif', marginBottom: 3 }}>{deal.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#4a5568', fontFamily: 'Geist, sans-serif' }}>{deal.company}</span>
              <span style={{ fontSize: 10, color: '#2a3040' }}>·</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6dc2f1', fontFamily: 'Geist Mono, monospace' }}>{deal.amount}</span>
              <span style={{ fontSize: 10, color: '#2a3040' }}>·</span>
              <span style={{
                fontSize: 10, color: flo.stages[stageIdx]?.color || '#4a5568',
                background: `${flo.stages[stageIdx]?.color || '#4a5568'}15`,
                padding: '2px 7px', borderRadius: 4, fontFamily: 'Geist, sans-serif',
              }}>
                {flo.stages[stageIdx]?.label || deal.stage}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {[
            { Icon: Phone, label: 'Call', color: '#04d39e' },
            { Icon: MessageSquare, label: 'Text', color: '#6dc2f1' },
            { Icon: Mail, label: 'Email', color: '#6dc2f1' },
            { Icon: Calendar, label: 'Schedule', color: '#f5a623' },
          ].map(btn => (
            <button key={btn.label} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
              border: `1px solid ${btn.color}25`, background: `${btn.color}08`,
              color: btn.color, cursor: 'pointer', fontSize: 11, fontWeight: 600,
              fontFamily: 'Geist, sans-serif', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${btn.color}14`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${btn.color}08`; }}>
              <btn.Icon size={13} /> {btn.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: '#3a4558', fontFamily: 'Geist Mono, monospace', alignSelf: 'center' }}>{deal.phone}</span>
        </div>
      </div>

      {/* Work zone */}
      {workMode && (
        <div style={{ flexShrink: 0, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#07090e', overflowY: 'auto', maxHeight: '55%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            {workMode === 'call' && <Phone size={14} style={{ color: '#04d39e' }} />}
            {workMode === 'email' && <Mail size={14} style={{ color: '#6dc2f1' }} />}
            {workMode === 'follow-up' && <RefreshCw size={14} style={{ color: '#f5a623' }} />}
            <span style={{
              fontSize: 12, fontWeight: 700, fontFamily: 'Geist, sans-serif',
              color: workMode === 'call' ? '#04d39e' : workMode === 'email' ? '#6dc2f1' : '#f5a623',
            }}>
              {workMode === 'call' ? 'Active Call' : workMode === 'email' ? 'Compose Email' : 'Follow Up'}
            </span>
          </div>
          {workMode === 'call' ? <CallMode deal={deal} onOutcome={onCallOutcome} /> : <CommsMode deal={deal} mode={workMode} />}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '11px 14px', background: 'none', border: 'none',
            borderBottom: `2px solid ${activeTab === tab.id ? '#6dc2f1' : 'transparent'}`,
            color: activeTab === tab.id ? '#6dc2f1' : '#3a4558',
            cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Geist, sans-serif',
            transition: 'all 0.15s', marginBottom: -1,
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {activeTab === 'timeline' && (
          <div>
            {deal.timeline.length === 0 && <div style={{ fontSize: 12, color: '#3a4558', fontFamily: 'Geist, sans-serif', textAlign: 'center', padding: '20px 0' }}>No activity yet</div>}
            {deal.timeline.map(entry => (
              <div key={entry.id} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0c1219', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {entry.type === 'call' && <Phone size={11} style={{ color: '#04d39e' }} />}
                  {entry.type === 'email' && <Mail size={11} style={{ color: '#6dc2f1' }} />}
                  {entry.type === 'note' && <FileText size={11} style={{ color: '#f5a623' }} />}
                  {entry.type === 'stage' && <ChevronRight size={11} style={{ color: '#b06dff' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#8c9199', fontFamily: 'Geist, sans-serif', lineHeight: 1.5 }}>{entry.text}</div>
                  <div style={{ fontSize: 10, color: '#3a4558', fontFamily: 'Geist Mono, monospace', marginTop: 2 }}>{entry.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'notes' && (
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add notes about this deal..." style={{
            width: '100%', minHeight: 200, background: '#060a0f', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8, padding: '12px 14px', color: '#c8d0dc', fontSize: 12,
            fontFamily: 'Geist, sans-serif', resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box',
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
              <div key={item.label} style={{ background: '#060a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#3a4558', fontFamily: 'Geist, sans-serif', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#8c9199', fontFamily: 'Geist, sans-serif' }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'documents' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <FileText size={32} style={{ color: '#2a3040', margin: '0 auto 10px' }} />
            <div style={{ fontSize: 13, color: '#3a4558', fontFamily: 'Geist, sans-serif' }}>No documents uploaded</div>
          </div>
        )}
      </div>

      {/* Stage footer */}
      {nextStage && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#070b10' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {flo.stages.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: i <= stageIdx ? s.color : '#0c1219',
                  border: `1px solid ${i <= stageIdx ? s.color : 'rgba(255,255,255,0.06)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: i <= stageIdx ? '#0D0D12' : '#2a3040',
                  fontFamily: 'Geist Mono, monospace', fontWeight: 700, flexShrink: 0,
                }}>
                  {i < stageIdx ? '✓' : i === stageIdx ? '●' : String(i + 1)}
                </div>
                {i < flo.stages.length - 1 && <div style={{ width: 14, height: 1, background: i < stageIdx ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)' }} />}
              </div>
            ))}
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
            border: `1px solid ${nextStage.color}40`, background: `${nextStage.color}10`,
            color: nextStage.color, cursor: 'pointer', fontSize: 12, fontWeight: 700,
            fontFamily: 'Geist, sans-serif', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${nextStage.color}18`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${nextStage.color}10`; }}>
            Move to {nextStage.label} <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Mid-call close warning */}
      {confirmClose && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0c1219', border: '1px solid rgba(255,92,92,0.3)', borderRadius: 14, padding: '24px', width: 320, textAlign: 'center' }}>
            <AlertTriangle size={28} style={{ color: '#ff5c5c', marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: '#dde3ec', fontFamily: 'Geist, sans-serif', marginBottom: 8 }}>Call in progress</div>
            <div style={{ fontSize: 12, color: '#4a5568', fontFamily: 'Geist, sans-serif', marginBottom: 18, lineHeight: 1.5 }}>
              You haven't logged an outcome yet. Please select one before closing.
            </div>
            <button onClick={() => setConfirmClose(false)} style={{
              width: '100%', padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #6dc2f1, #3a8fc7)',
              fontFamily: 'Geist, sans-serif',
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

function FloPicker({ onSelect }: { onSelect: (flo: Flo) => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0D0D12', padding: 40 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(109,194,241,0.08)', border: '1px solid rgba(109,194,241,0.15)', marginBottom: 20 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#04d39e' }} />
        <span style={{ fontSize: 11, color: '#6dc2f1', fontFamily: 'Geist, sans-serif', fontWeight: 600 }}>Deal Flo</span>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#dde3ec', fontFamily: 'Geist, sans-serif', marginBottom: 6, textAlign: 'center', margin: '0 0 6px' }}>
        Select a Flo
      </h1>
      <p style={{ fontSize: 13, color: '#3a4558', fontFamily: 'Geist, sans-serif', marginBottom: 40, textAlign: 'center' }}>
        Choose a workflow to open its deal board
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760 }}>
        {FLOS.map(flo => {
          const scoreColor = flo.healthScore >= 80 ? '#04d39e' : flo.healthScore >= 60 ? '#f5a623' : '#ff5c5c';
          return (
            <button
              key={flo.id}
              onClick={() => onSelect(flo)}
              style={{ width: 220, background: '#0c1219', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(109,194,241,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #162030, #0f1a28)', border: '1px solid rgba(109,194,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Activity size={16} style={{ color: '#6dc2f1' }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#dde3ec', fontFamily: 'Geist, sans-serif', marginBottom: 4 }}>{flo.name}</div>
              <div style={{ fontSize: 11, color: '#3a4558', fontFamily: 'Geist, sans-serif', marginBottom: 14 }}>{flo.dealCount} deals · {flo.stages.length} stages</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {flo.stages.slice(0, 4).map(s => (
                    <div key={s.id} style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                  ))}
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
  actions: ActionRow[];
  activeDealId: string;
  onSelectDeal: (deal: Deal, mode: WorkMode) => void;
  flo: Flo;
}) {
  return (
    <div style={{ width: 240, height: '100%', background: '#07090e', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4a5568', fontFamily: 'Geist, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Action Queue</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {actions.map(action => {
          const deal = flo.deals.find(d => d.id === action.dealId);
          const isActive = action.dealId === activeDealId;
          const urgColor = URGENCY_COLOR[action.urgency];
          return (
            <button
              key={action.id}
              onClick={() => deal && onSelectDeal(deal, action.actionType)}
              style={{
                width: '100%', background: isActive ? '#162030' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(109,194,241,0.25)' : 'rgba(255,255,255,0.04)'}`,
                borderLeft: `3px solid ${isActive ? '#6dc2f1' : urgColor}`,
                borderRadius: 8, padding: '8px 10px', marginBottom: 5,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <UrgencyDot level={action.urgency} />
                <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? '#dde3ec' : '#5a6474', fontFamily: 'Geist, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {action.name}
                </span>
              </div>
              <div style={{ fontSize: 9, color: '#3a4558', fontFamily: 'Geist, sans-serif', marginTop: 3, marginLeft: 14 }}>{action.primaryBtn}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main DealFlo Screen ──────────────────────────────────────────────────────

export function DealFloScreen() {
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
    setActiveDeal(deal);
    setWorkMode(mode);
    setCallOutcome(null);
    if (selectedFlo) {
      const idx = selectedFlo.deals.findIndex(d => d.id === deal.id);
      setDealIndex(idx >= 0 ? idx : 0);
    }
  }, [selectedFlo]);

  const closeProfile = useCallback(() => {
    setActiveDeal(null);
    setWorkMode(null);
    setCallOutcome(null);
  }, []);

  const navDeal = useCallback((dir: 1 | -1) => {
    if (!selectedFlo) return;
    const newIdx = dealIndex + dir;
    if (newIdx < 0 || newIdx >= selectedFlo.deals.length) return;
    setDealIndex(newIdx);
    setActiveDeal(selectedFlo.deals[newIdx]);
    setWorkMode(null);
    setCallOutcome(null);
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

  if (!selectedFlo) return <FloPicker onSelect={flo => setSelectedFlo(flo)} />;

  const stageDeals = (stageId: string) => selectedFlo.deals.filter(d => d.stage === stageId);
  const totalPipeline = selectedFlo.deals.reduce((s, d) => s + d.amountRaw, 0);
  const fmtPipeline = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' } as Intl.NumberFormatOptions).format(totalPipeline);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0D0D12', fontFamily: 'Geist, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0f14', flexShrink: 0, zIndex: 10,
      }}>
        <button
          onClick={() => { setSelectedFlo(null); setActiveDeal(null); setOpenDrawerType(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568', fontSize: 12, fontFamily: 'Geist, sans-serif', padding: '4px 8px', borderRadius: 6, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#8c9199')}
          onMouseLeave={e => (e.currentTarget.style.color = '#4a5568')}
        >
          <ArrowLeft size={14} /> Deal Flo
        </button>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#dde3ec' }}>{selectedFlo.name}</span>
          <span style={{ fontSize: 11, color: '#3a4558', fontFamily: 'Geist Mono, monospace' }}>{selectedFlo.dealCount} deals</span>
          <span style={{ fontSize: 11, color: '#3a4558' }}>·</span>
          <span style={{ fontSize: 11, color: '#4a5568', fontFamily: 'Geist Mono, monospace' }}>{fmtPipeline}</span>
        </div>
        <div style={{ flex: 1 }} />

        {/* View switcher */}
        <div style={{ display: 'flex', background: '#060a0f', borderRadius: 8, padding: 3, border: '1px solid rgba(255,255,255,0.06)', gap: 2 }}>
          {([
            { id: 'board' as ViewMode, Icon: LayoutGrid },
            { id: 'list' as ViewMode, Icon: List },
            { id: 'focus' as ViewMode, Icon: Focus },
          ]).map(v => (
            <button key={v.id} onClick={() => setViewMode(v.id)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: viewMode === v.id ? '#162030' : 'transparent',
              color: viewMode === v.id ? '#6dc2f1' : '#3a4558', transition: 'all 0.15s',
            }}>
              <v.Icon size={13} />
            </button>
          ))}
        </div>

        <HealthPill score={selectedFlo.healthScore} />

        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
          border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#0D0D12',
          background: '#04d39e', fontFamily: 'Geist, sans-serif', transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          <Plus size={13} /> Add Deal
        </button>

        <button
          onClick={() => setOpenDrawerType(d => d === 'actions' ? null : 'actions')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
            border: `1px solid ${openDrawerType === 'actions' ? 'rgba(109,194,241,0.35)' : 'rgba(255,255,255,0.08)'}`,
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            color: openDrawerType === 'actions' ? '#6dc2f1' : '#5a6474',
            background: openDrawerType === 'actions' ? 'rgba(109,194,241,0.08)' : 'transparent',
            fontFamily: 'Geist, sans-serif', transition: 'all 0.15s',
          }}
        >
          <Zap size={12} /> Actions
          {selectedFlo.actions.length > 0 && (
            <span style={{ background: '#ff5c5c', color: '#fff', borderRadius: 10, fontSize: 9, fontWeight: 800, padding: '1px 5px', fontFamily: 'Geist Mono, monospace' }}>
              {selectedFlo.actions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setOpenDrawerType(d => d === 'insights' ? null : 'insights')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
            border: `1px solid ${openDrawerType === 'insights' ? 'rgba(4,211,158,0.35)' : 'rgba(255,255,255,0.08)'}`,
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            color: openDrawerType === 'insights' ? '#04d39e' : '#5a6474',
            background: openDrawerType === 'insights' ? 'rgba(4,211,158,0.08)' : 'transparent',
            fontFamily: 'Geist, sans-serif', transition: 'all 0.15s',
          }}
        >
          <BarChart2 size={12} /> Insights
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {isWorkSession && (
          <MiniQueue actions={selectedFlo.actions} activeDealId={activeDeal!.id} onSelectDeal={openProfile} flo={selectedFlo} />
        )}

        {/* Board */}
        <div style={{
          flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '16px',
          transition: 'filter 0.3s, opacity 0.3s',
          filter: boardScrim > 0 ? `brightness(${1 - boardScrim * 0.6})` : 'none',
          minWidth: 0,
        }}>
          {viewMode === 'board' && (
            <div style={{ display: 'flex', gap: 10, height: '100%', minWidth: selectedFlo.stages.length * 195 }}>
              {selectedFlo.stages.map(stage => (
                <KanbanCol key={stage.id} stage={stage} deals={stageDeals(stage.id)} onCardClick={deal => openProfile(deal)} onActionClick={deal => openProfile(deal, deal.actionType)} />
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
                    marginBottom: 5, background: '#0c1219', border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(109,194,241,0.2)'; e.currentTarget.style.background = '#0e1520'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = '#0c1219'; }}>
                    <UrgencyDot level={deal.urgency} />
                    <Avatar initials={deal.avatar} size={28} />
                    <span style={{ flex: '2 1 0', fontSize: 13, fontWeight: 600, color: '#dde3ec' }}>{deal.name}</span>
                    <span style={{ flex: '2 1 0', fontSize: 11, color: '#4a5568' }}>{deal.company}</span>
                    <span style={{ flex: '1 1 0', fontSize: 12, fontWeight: 700, color: '#6dc2f1', fontFamily: 'Geist Mono, monospace' }}>{deal.amount}</span>
                    <span style={{ flex: '1 1 0', fontSize: 10, color: stageInfo?.color || '#4a5568', background: `${stageInfo?.color || '#4a5568'}12`, padding: '2px 7px', borderRadius: 4 }}>
                      {stageInfo?.label || deal.stage}
                    </span>
                    <span style={{ flex: '3 1 0', fontSize: 11, color: '#3a4558', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.nextStep}</span>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'focus' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, maxWidth: 900 }}>
              {selectedFlo.deals.filter(d => ['critical', 'high'].includes(d.urgency)).map(deal => {
                const urgColor = URGENCY_COLOR[deal.urgency];
                return (
                  <div key={deal.id} onClick={() => openProfile(deal)} style={{
                    width: 240, padding: '16px', background: '#0c1219',
                    border: `1px solid ${urgColor}25`, borderLeft: `3px solid ${urgColor}`,
                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <Avatar initials={deal.avatar} size={32} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#dde3ec' }}>{deal.name}</div>
                        <div style={{ fontSize: 10, color: urgColor, fontWeight: 600 }}>{URGENCY_LABEL[deal.urgency]}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.5, marginBottom: 10 }}>{deal.nextStep}</div>
                    {deal.actionType && (
                      <button onClick={e => { e.stopPropagation(); openProfile(deal, deal.actionType); }} style={{
                        width: '100%', padding: '7px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
                        fontSize: 11, fontWeight: 700, color: '#0D0D12', background: urgColor, fontFamily: 'Geist, sans-serif',
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

        {/* Right panels */}
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;600;700;800&display=swap');
        @keyframes callPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
