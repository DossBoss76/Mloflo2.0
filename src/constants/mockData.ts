export type UrgencyLevel = 'critical' | 'high' | 'amber' | 'green' | 'blue';

export interface ActionCard {
  id: string;
  name: string;
  context: string;
  commission: string;
  commissionRaw: number;
  why: string;
  primaryBtn: string;
  primaryAction: 'call' | 'review-message' | 'view-deal' | 'view-application' | 'view-profile' | 'send-update';
  ghostBtns: string[];
  tag: string;
  urgency: UrgencyLevel;
  urgencyColor: string;
  phone?: string;
  email?: string;
  loanAmount?: string;
  stage?: string;
  lastContact?: string;
  draftMessage?: string;
}

export const ACTION_CARDS: ActionCard[] = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    context: 'Rate lock expires in 6 days · Docs 60% complete',
    commission: '$3,200',
    commissionRaw: 3200,
    why: 'Missing: 2023 W2 and bank statement page 3. She opened your last message but didn\'t respond. A 2-minute call closes this today before it falls out.',
    primaryBtn: 'Call now',
    primaryAction: 'call',
    ghostBtns: ['Send reminder', 'View deal'],
    tag: 'Critical',
    urgency: 'critical',
    urgencyColor: '#ff5c5c',
    phone: '(415) 882-3301',
    email: 'sarah.chen@email.com',
    loanAmount: '$480,000',
    stage: 'Processing',
    lastContact: '2 days ago',
  },
  {
    id: 'james-okafor',
    name: 'James Okafor',
    context: 'Warm lead · Replied to your text at 4:32pm yesterday',
    commission: '$2,800',
    commissionRaw: 2800,
    why: 'He said \'yes still interested, just been busy.\' Draft reply is ready. Leads that go 48hrs without follow-up lose 60% conversion rate — act this morning.',
    primaryBtn: 'Review draft',
    primaryAction: 'review-message',
    ghostBtns: ['Call now', 'Schedule call'],
    tag: 'High value',
    urgency: 'blue',
    urgencyColor: '#6dc2f1',
    phone: '(510) 774-9902',
    email: 'james.okafor@email.com',
    loanAmount: '$420,000',
    stage: 'Pre-Approval',
    lastContact: 'Yesterday',
    draftMessage: `Hi James — great to hear from you! Life gets busy, totally get it.\n\nI wanted to follow up because rates have moved in a good direction this week, and I'd love to lock something in for you before they shift again.\n\nAre you free for a quick 15-minute call tomorrow morning or Thursday afternoon? I can walk you through exactly where you stand and what your monthly payment would look like.\n\nLooking forward to connecting — Marcus`,
  },
  {
    id: 'dana-wu',
    name: 'Dana Wu',
    context: 'Top realtor · No deal sent in 21 days · Usually 1–2/mo',
    commission: '~$5,600',
    commissionRaw: 5600,
    why: 'Dana is your #2 referral source. 21 days of silence is unusual. A personalized market update or quick check-in call protects ~$5,600/mo in referral value.',
    primaryBtn: 'Review message',
    primaryAction: 'review-message',
    ghostBtns: ['Call Dana', 'Send market update'],
    tag: 'Relationship',
    urgency: 'amber',
    urgencyColor: '#f5a623',
    phone: '(650) 331-4478',
    email: 'dana.wu@realty.com',
    loanAmount: 'N/A',
    stage: 'Realtor Partner',
    lastContact: '21 days ago',
    draftMessage: `Hey Dana — hope you're crushing it out there!\n\nJust wanted to check in — haven't chatted in a few weeks and wanted to make sure you're set up for success going into spring.\n\nInventory is ticking up in your market and I'm seeing more buyers qualify than I expected at current rates. I put together a quick market snapshot I think your clients would love — happy to send it over.\n\nAlso have a couple pre-approved buyers right now without an agent. Want me to loop you in?\n\nLet's connect soon — Marcus`,
  },
  {
    id: 'marcus-t',
    name: 'Marcus T.',
    context: 'Zillow lead form · 47 minutes ago · No contact yet',
    commission: '$2,100',
    commissionRaw: 2100,
    why: 'First contact within 5 minutes = 9× more likely to qualify. It\'s been 47 minutes. Draft text and call script are ready. Act now before this goes cold.',
    primaryBtn: 'Call now',
    primaryAction: 'call',
    ghostBtns: ['Send text draft', 'Add to nurture'],
    tag: 'Speed to lead',
    urgency: 'green',
    urgencyColor: '#04d39e',
    phone: '(925) 660-1847',
    email: 'marcust@email.com',
    loanAmount: '$315,000',
    stage: 'New Lead',
    lastContact: 'Never',
  },
  {
    id: 'tom-lisa-park',
    name: 'Tom & Lisa Park',
    context: 'Application submitted · Awaiting income verification',
    commission: '$3,800',
    commissionRaw: 3800,
    why: 'Application came in 2 days ago with no follow-up. Borrowers who don\'t hear within 48hrs of submission have 3× higher fall-through rate.',
    primaryBtn: 'Send update',
    primaryAction: 'review-message',
    ghostBtns: ['Request docs', 'View application'],
    tag: 'Follow-up',
    urgency: 'blue',
    urgencyColor: '#6dc2f1',
    phone: '(408) 559-2230',
    email: 'tpark@email.com',
    loanAmount: '$570,000',
    stage: 'Application',
    lastContact: '2 days ago',
    draftMessage: `Hi Tom & Lisa — thank you for submitting your application, we're thrilled to work with you!\n\nI wanted to personally reach out to confirm we received everything and let you know your file is being reviewed. To keep things moving, we'll need income verification documents (recent pay stubs + 2 years W2s).\n\nYou'll receive a secure upload link shortly. Once we have those, we can typically move to conditional approval within 2-3 business days.\n\nPlease don't hesitate to reach out with any questions — I'm here for you every step of the way.\n\n— Marcus Cole, Senior Loan Officer`,
  },
  {
    id: 'keisha-brown',
    name: 'Keisha Brown',
    context: 'Database · Rate dropped 0.4% · Refi candidate',
    commission: '$1,900',
    commissionRaw: 1900,
    why: 'Keisha closed with you 2 years ago. Her current rate is 7.2%. Today\'s rate saves her $340/mo. AI drafted a personalized refi reach-out.',
    primaryBtn: 'Review message',
    primaryAction: 'review-message',
    ghostBtns: ['Call Keisha', 'View profile'],
    tag: 'Retention',
    urgency: 'green',
    urgencyColor: '#04d39e',
    phone: '(707) 443-8821',
    email: 'keisha.brown@email.com',
    loanAmount: '$285,000',
    stage: 'Past Client',
    lastContact: '8 months ago',
    draftMessage: `Hi Keisha — hope all is well with you and the family in the new home!\n\nI was reviewing my portfolio this morning and I noticed something exciting — rates have moved significantly since you closed in 2022, and based on your current rate of 7.2%, you could potentially refinance to around 6.5% today.\n\nThat translates to roughly $340/month in savings — about $4,080/year.\n\nI'd love to run a quick no-obligation analysis for you. Takes about 10 minutes on a call and I can tell you exactly what makes sense. Would this week work?\n\nAlways great working with past clients — Marcus`,
  },
];

export interface Deal {
  id: string;
  borrower: string;
  loanAmount: string;
  loanAmountRaw: number;
  stage: KanbanStage;
  dayInStage: number;
  statusNote: string;
  commission: string;
  commissionRaw: number;
  flagged?: boolean;
  phone?: string;
  email?: string;
  lastContact?: string;
  nextAction?: string;
}

export type KanbanStage = 'new-leads' | 'pre-approval' | 'application' | 'processing' | 'ctc' | 'closed';

export interface KanbanColumn {
  id: KanbanStage;
  label: string;
  color: string;
  deals: Deal[];
}

export const DEALS: Deal[] = [
  { id: 'd1', borrower: 'Marcus T.', loanAmount: '$315,000', loanAmountRaw: 315000, stage: 'new-leads', dayInStage: 0, statusNote: 'Zillow lead · no contact yet', commission: '$1,900', commissionRaw: 1900, flagged: true, phone: '(925) 660-1847', email: 'marcust@email.com', lastContact: 'Never', nextAction: 'Call immediately' },
  { id: 'd2', borrower: 'Elena Torres', loanAmount: '$395,000', loanAmountRaw: 395000, stage: 'new-leads', dayInStage: 1, statusNote: 'Referral from Dana Wu · needs call', commission: '$2,370', commissionRaw: 2370, phone: '(415) 777-2291', email: 'elena.t@email.com', lastContact: 'Yesterday', nextAction: 'Initial consultation call' },
  { id: 'd3', borrower: 'James Okafor', loanAmount: '$420,000', loanAmountRaw: 420000, stage: 'pre-approval', dayInStage: 3, statusNote: 'Credit pull pending · warm interest', commission: '$2,800', commissionRaw: 2800, flagged: true, phone: '(510) 774-9902', email: 'james.okafor@email.com', lastContact: 'Yesterday', nextAction: 'Follow up on reply' },
  { id: 'd4', borrower: 'Yuki Tanaka', loanAmount: '$610,000', loanAmountRaw: 610000, stage: 'pre-approval', dayInStage: 7, statusNote: 'Pre-approval letter issued · house hunting', commission: '$4,270', commissionRaw: 4270, phone: '(650) 881-3302', email: 'yuki.t@email.com', lastContact: '3 days ago', nextAction: 'Check in on house hunt' },
  { id: 'd5', borrower: 'Tom & Lisa Park', loanAmount: '$570,000', loanAmountRaw: 570000, stage: 'application', dayInStage: 2, statusNote: 'Awaiting income verification docs', commission: '$3,800', commissionRaw: 3800, flagged: true, phone: '(408) 559-2230', email: 'tpark@email.com', lastContact: '2 days ago', nextAction: 'Send doc request reminder' },
  { id: 'd6', borrower: 'Andre Mitchell', loanAmount: '$330,000', loanAmountRaw: 330000, stage: 'application', dayInStage: 4, statusNote: 'All docs submitted · in review', commission: '$2,200', commissionRaw: 2200, phone: '(916) 443-0091', email: 'a.mitchell@email.com', lastContact: 'Today', nextAction: 'Underwriter review update' },
  { id: 'd7', borrower: 'Sarah Chen', loanAmount: '$480,000', loanAmountRaw: 480000, stage: 'processing', dayInStage: 8, statusNote: 'Missing W2 + bank stmt pg 3 · rate lock in 6d', commission: '$3,200', commissionRaw: 3200, flagged: true, phone: '(415) 882-3301', email: 'sarah.chen@email.com', lastContact: '2 days ago', nextAction: 'Call for missing docs' },
  { id: 'd8', borrower: 'Fatima Al-Hassan', loanAmount: '$445,000', loanAmountRaw: 445000, stage: 'processing', dayInStage: 5, statusNote: 'UW conditions issued · 3 open items', commission: '$2,960', commissionRaw: 2960, phone: '(510) 229-4415', email: 'fatima.ah@email.com', lastContact: 'Today', nextAction: 'Clear UW conditions' },
  { id: 'd9', borrower: 'Derek Sampson', loanAmount: '$390,000', loanAmountRaw: 390000, stage: 'processing', dayInStage: 11, statusNote: 'Appraisal ordered · ETA 3 days', commission: '$2,600', commissionRaw: 2600, phone: '(707) 654-7712', email: 'd.sampson@email.com', lastContact: '1 day ago', nextAction: 'Follow up on appraisal' },
  { id: 'd10', borrower: 'Priya Nair', loanAmount: '$440,000', loanAmountRaw: 440000, stage: 'ctc', dayInStage: 1, statusNote: 'Clear to close · closing this Friday', commission: '$2,640', commissionRaw: 2640, phone: '(408) 992-0033', email: 'priya.nair@email.com', lastContact: 'Today', nextAction: 'Confirm closing time' },
  { id: 'd11', borrower: 'Michael & Jen Cross', loanAmount: '$680,000', loanAmountRaw: 680000, stage: 'ctc', dayInStage: 2, statusNote: 'Docs out to title · closing next week', commission: '$4,760', commissionRaw: 4760, phone: '(650) 337-8819', email: 'mcross@email.com', lastContact: 'Today', nextAction: 'Final walkthrough confirm' },
  { id: 'd12', borrower: 'Roshan Patel', loanAmount: '$520,000', loanAmountRaw: 520000, stage: 'closed', dayInStage: 0, statusNote: 'Funded Mar 14 · $3,640 earned', commission: '$3,640', commissionRaw: 3640, phone: '(415) 200-1122', email: 'rpatel@email.com', lastContact: '5 days ago', nextAction: 'Send thank you + ask for referral' },
  { id: 'd13', borrower: 'Danielle Frost', loanAmount: '$370,000', loanAmountRaw: 370000, stage: 'closed', dayInStage: 0, statusNote: 'Funded Mar 7 · $2,590 earned', commission: '$2,590', commissionRaw: 2590, phone: '(510) 881-6643', email: 'd.frost@email.com', lastContact: '12 days ago', nextAction: 'Database drip campaign' },
  { id: 'd14', borrower: 'Keisha Brown', loanAmount: '$285,000', loanAmountRaw: 285000, stage: 'new-leads', dayInStage: 0, statusNote: 'Refi outreach · past client', commission: '$1,900', commissionRaw: 1900, phone: '(707) 443-8821', email: 'keisha.brown@email.com', lastContact: '8 months ago', nextAction: 'Send refi proposal' },
];

export const KANBAN_COLUMNS: { id: KanbanStage; label: string; color: string }[] = [
  { id: 'new-leads', label: 'New Leads', color: '#4d5563' },
  { id: 'pre-approval', label: 'Pre-Approval', color: '#6dc2f1' },
  { id: 'application', label: 'Application', color: '#f5a623' },
  { id: 'processing', label: 'Processing', color: '#9b6dff' },
  { id: 'ctc', label: 'CTC / Clear to Close', color: '#04d39e' },
  { id: 'closed', label: 'Closed', color: '#04d374' },
];

export const WEEKLY_PLAN = [
  { label: 'Realtor touchpoints', current: 9, total: 18, color: '#04d39e' },
  { label: 'Lead contacts', current: 3, total: 12, color: '#6dc2f1' },
  { label: 'Database reach-outs', current: 6, total: 6, color: '#04d39e', complete: true },
  { label: 'Applications followed up', current: 2, total: 5, color: '#f5a623' },
];

export const AI_AGENTS = [
  { name: 'Retention agent', count: '3 sent today', color: '#04d39e', clickable: false },
  { name: 'Lead follow-up agent', count: '7 queued', color: '#6dc2f1', clickable: false },
  { name: 'Doc chaser agent', count: '2 active', color: '#f5a623', clickable: false },
  { name: 'Realtor nurture agent', count: '1 pending review', color: '#04d39e', clickable: true },
];

export const NAV_ITEMS = [
  {
    section: 'EXECUTE',
    items: [
      { id: 'execution', label: 'Execution', icon: 'Zap', badge: '6', badgeColor: 'green' },
      { id: 'deal-flo', label: 'Deal Flo', icon: 'GitBranch', badge: '24', badgeColor: 'blue' },
    ],
  },
  {
    section: 'MANAGE',
    items: [
      { id: 'borrowers', label: 'Borrowers', icon: 'Users', badge: null },
      { id: 'partners', label: 'Partners', icon: 'Handshake', badge: null },
      { id: 'communications', label: 'Communications', icon: 'MessageSquare', badge: '7', badgeColor: 'amber' },
      { id: 'documents', label: 'Documents', icon: 'FileText', badge: null },
      { id: 'buyer-passports', label: 'Buyer Passports', icon: 'CreditCard', badge: null },
      { id: 'mortgage-market', label: 'Mortgage Market', icon: 'TrendingUp', badge: 'Live', badgeColor: 'green-outline' },
    ],
  },
  {
    section: 'INTELLIGENCE',
    items: [
      { id: 'ai-workforce', label: 'AI Workforce', icon: 'Bot', badge: null },
      { id: 'analytics', label: 'Analytics', icon: 'BarChart2', badge: null },
      { id: 'playbooks', label: 'Playbooks', icon: 'BookOpen', badge: null },
      { id: 'settings', label: 'Settings', icon: 'Settings', badge: null },
    ],
  },
];
