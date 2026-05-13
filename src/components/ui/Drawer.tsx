import { useEffect, useState } from 'react';
import { X, PhoneOff, Clock, Send, CreditCard as Edit3, Trash2, DollarSign, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActionCard } from '../../constants/mockData';

export function Drawer() {
  const { drawer, closeDrawer } = useApp();
  const { type, card, deal, title } = drawer;

  const isOpen = type !== null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 drawer-overlay transition-opacity duration-250 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />
      <div
        className="fixed top-0 right-0 h-full w-[440px] z-50 flex flex-col shadow-fx-modal transition-transform duration-[250ms] ease-out"
        style={{ background: '#0C111A', borderLeft: '1px solid rgba(45,140,255,0.22)', transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {isOpen && (
          <>
            {type === 'call' && <CallDrawer card={card} />}
            {type === 'review-message' && <MessageDrawer card={card} />}
            {(type === 'view-deal' || type === 'deal-detail' || type === 'view-application' || type === 'view-profile') && (
              <DealDetailDrawer card={card} deal={deal} />
            )}
            {type === 'ai-review' && <AiReviewDrawer title={title} />}
          </>
        )}
      </div>
    </>
  );
}

function DrawerHeader({ name, subtitle, onClose }: { name: string; subtitle?: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
      <div>
        <div className="font-palanquin font-semibold text-[16px] text-fx-text">{name}</div>
        {subtitle && <div className="font-barlow text-[11px] text-fx-text-2 uppercase tracking-wide mt-0.5">{subtitle}</div>}
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.04] text-fx-text-2 hover:text-fx-text transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function Avatar({ name, size = 52 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-roboto font-500 text-[#052016] flex-shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.32,
        background: 'linear-gradient(135deg, #00E58C, #2D8CFF)',
      }}
    >
      {initials}
    </div>
  );
}

function CallDrawer({ card }: { card?: ActionCard }) {
  const { closeDrawer, removeCard } = useApp();
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setCallState('connected'), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleDisposition = (action: string) => {
    if (card) {
      removeCard(card.id, `✓ Action logged — ${action}`);
    }
    closeDrawer();
  };

  if (!card) return null;

  return (
    <>
      <DrawerHeader name={card.name} subtitle="Voice call" onClose={closeDrawer} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <Avatar name={card.name} size={72} />
        <div className="text-center">
          <div className="font-palanquin font-semibold text-[18px] text-fx-text">{card.name}</div>
          <div className="font-roboto text-[13px] text-fx-text-2 mt-1">{card.phone}</div>
        </div>

        {callState === 'connecting' && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fx-green animate-pulse-dot" />
            <span className="font-barlow text-[13px] text-fx-text-2 tracking-wide uppercase">Connecting...</span>
          </div>
        )}

        {callState === 'connected' && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fx-green" style={{ boxShadow: '0 0 6px #00E58C' }} />
              <span className="font-barlow text-[13px] text-fx-green tracking-wide uppercase">Connected</span>
            </div>
            <div className="flex items-center gap-1.5 font-barlow text-[20px] text-fx-text">
              <Clock size={14} className="text-fx-text-2" />
              {formatTime(elapsed)}
            </div>
          </div>
        )}

        <div className="w-full">
          <label className="block font-barlow text-[10px] text-fx-text-2 uppercase tracking-wider mb-2">Call notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Type notes during the call..."
            className="w-full bg-card border border-border-card rounded-xl px-4 py-3 font-roboto text-[13px] text-fx-text placeholder-fx-text-4 resize-none focus:outline-none focus:border-[#2D8CFF]/40 transition-colors"
            rows={4}
          />
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/10 flex-shrink-0 flex flex-col gap-2">
        <div className="font-barlow text-[10px] text-fx-text-2 uppercase tracking-wider mb-1">Call disposition</div>
        <button
          onClick={() => handleDisposition('Left voicemail')}
          className="w-full py-2.5 rounded-10 bg-card border border-border-card hover:border-white/20 font-roboto font-medium text-[13px] text-fx-text hover:text-white transition-all text-left px-4"
        >
          Left voicemail
        </button>
        <button
          onClick={() => handleDisposition('Spoke — schedule follow-up')}
          className="w-full py-2.5 rounded-10 bg-fx-green/10 border border-fx-green/30 hover:bg-fx-green/20 font-roboto font-medium text-[13px] text-fx-green transition-all text-left px-4"
        >
          Spoke — schedule follow-up
        </button>
        <button
          onClick={() => handleDisposition('Not interested')}
          className="w-full py-2.5 rounded-10 bg-card border border-border-card hover:border-[#FF4D5E]/30 font-roboto font-medium text-[13px] text-fx-text-2 hover:text-[#FF4D5E] transition-all text-left px-4"
        >
          Not interested
        </button>
        <button
          onClick={closeDrawer}
          className="w-full py-2 rounded-10 flex items-center justify-center gap-2 bg-[#FF4D5E]/10 border border-[#FF4D5E]/20 hover:bg-[#FF4D5E]/20 font-roboto font-medium text-[12px] text-[#FF4D5E] transition-all mt-1"
        >
          <PhoneOff size={13} /> End call
        </button>
      </div>
    </>
  );
}

function MessageDrawer({ card }: { card?: ActionCard }) {
  const { closeDrawer, removeCard } = useApp();
  const [message, setMessage] = useState(card?.draftMessage || '');

  const handleSend = () => {
    if (card) removeCard(card.id, '✓ Message sent successfully');
    closeDrawer();
  };

  if (!card) return null;

  return (
    <>
      <DrawerHeader name={card.name} subtitle="AI-drafted message" onClose={closeDrawer} />
      <div className="flex-1 flex flex-col px-5 py-4 gap-4 overflow-y-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border-card">
          <Avatar name={card.name} size={40} />
          <div>
            <div className="font-palanquin font-semibold text-[14px] text-fx-text">{card.name}</div>
            <div className="font-roboto text-[12px] text-fx-text-2">{card.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fx-green/10 border border-fx-green/20">
          <div className="w-1.5 h-1.5 rounded-full bg-fx-green animate-pulse-dot" />
          <span className="font-barlow text-[11px] text-fx-green uppercase tracking-wide">AI-drafted · review before sending</span>
        </div>

        <div>
          <label className="block font-barlow text-[10px] text-fx-text-2 uppercase tracking-wider mb-2">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full bg-card border border-border-card rounded-xl px-4 py-3 font-roboto text-[13px] text-fx-text placeholder-fx-text-4 resize-none focus:outline-none focus:border-[#2D8CFF]/40 transition-colors leading-relaxed"
            rows={12}
          />
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/10 flex-shrink-0 flex gap-2">
        <button
          onClick={handleSend}
          className="flex-1 py-2.5 rounded-10 bg-fx-green hover:bg-fx-green/90 font-roboto font-medium text-[13px] text-[#052016] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Send size={14} /> Send now
        </button>
        <button
          onClick={handleSend}
          className="py-2.5 px-4 rounded-10 bg-white/[0.04] border border-white/10 hover:border-white/20 font-roboto font-medium text-[13px] text-fx-text flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          <Edit3 size={14} /> Edit & send
        </button>
        <button
          onClick={closeDrawer}
          className="py-2.5 px-3 rounded-10 bg-white/[0.04] border border-white/10 hover:border-white/20 font-roboto font-medium text-[13px] text-fx-text-2 transition-all active:scale-[0.98]"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </>
  );
}

function DealDetailDrawer({ card, deal }: { card?: ActionCard; deal?: any }) {
  const { closeDrawer, addToast } = useApp();

  const name = card?.name || deal?.borrower || 'Deal Details';
  const loanAmount = card?.loanAmount || deal?.loanAmount || '—';
  const stage = card?.stage || deal?.stage || '—';
  const lastContact = card?.lastContact || deal?.lastContact || '—';
  const commission = card?.commission || deal?.commission || '—';
  const email = card?.email || deal?.email || '—';
  const phone = card?.phone || deal?.phone || '—';
  const nextAction = deal?.nextAction || 'Review and follow up';
  const statusNote = deal?.statusNote || '';

  return (
    <>
      <DrawerHeader name={name} subtitle="Deal details" onClose={closeDrawer} />
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border-card">
          <Avatar name={name} size={52} />
          <div>
            <div className="font-palanquin font-semibold text-[16px] text-fx-text">{name}</div>
            <div className="font-roboto text-[12px] text-fx-text-2 mt-0.5">{email}</div>
            <div className="font-roboto text-[12px] text-fx-text-2">{phone}</div>
          </div>
        </div>

        {statusNote && (
          <div className="px-3 py-2 rounded-xl bg-[#FFB020]/10 border border-[#FFB020]/20 font-roboto text-[12px] text-[#FFB020]">
            {statusNote}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: DollarSign, label: 'LOAN AMOUNT', value: loanAmount },
            { icon: DollarSign, label: 'COMMISSION', value: commission },
            { icon: MapPin, label: 'STAGE', value: stage },
            { icon: Calendar, label: 'LAST CONTACT', value: lastContact },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-card border border-border-card">
              <div className="font-barlow text-[10px] text-fx-text-2 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Icon size={11} /> {label}
              </div>
              <div className="font-barlow font-semibold text-[14px] text-fx-text">{value}</div>
            </div>
          ))}
        </div>

        {nextAction && (
          <div className="p-3 rounded-xl bg-fx-green/10 border border-fx-green/20">
            <div className="font-barlow text-[10px] text-fx-green uppercase tracking-wider mb-1.5">Next recommended action</div>
            <div className="font-roboto text-[13px] text-fx-text">{nextAction}</div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-white/10 flex-shrink-0 flex gap-2">
        <button
          onClick={() => { closeDrawer(); addToast('✓ Action logged — deal updated'); }}
          className="flex-1 py-2.5 rounded-10 bg-fx-green hover:bg-fx-green/90 font-roboto font-medium text-[13px] text-[#052016] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <CheckCircle size={14} /> Log action
        </button>
        <button
          onClick={() => { closeDrawer(); addToast('Opening full deal view...', 'info'); }}
          className="py-2.5 px-4 rounded-10 bg-white/[0.04] border border-white/10 hover:border-white/20 font-roboto font-medium text-[13px] text-fx-text transition-all active:scale-[0.98]"
        >
          Full view
        </button>
      </div>
    </>
  );
}

function AiReviewDrawer({ title }: { title?: string }) {
  const { closeDrawer, addToast } = useApp();
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => {
      closeDrawer();
      addToast('✓ AI agent approved — sending now');
    }, 800);
  };

  return (
    <>
      <DrawerHeader name="AI Agent Review" subtitle={title || 'Realtor nurture agent'} onClose={closeDrawer} />
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fx-green/10 border border-fx-green/20">
          <div className="w-1.5 h-1.5 rounded-full bg-fx-green animate-pulse-dot" />
          <span className="font-barlow text-[11px] text-fx-green uppercase tracking-wide">1 message pending your review</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-palanquin font-semibold text-[14px] text-fx-text">Dana Wu</div>
              <div className="font-roboto text-[12px] text-fx-text-2">Top realtor · Realtor nurture agent</div>
            </div>
            <div className="font-barlow text-[10px] text-[#FFB020] bg-[#FFB020]/10 border border-[#FFB020]/20 px-2 py-1 rounded">Pending review</div>
          </div>

          <div className="font-roboto text-[13px] text-fx-text-2 leading-relaxed">
            Hey Dana — hope you're crushing it out there! Just wanted to check in... I have a couple pre-approved buyers without an agent right now. Want me to loop you in? — Marcus
          </div>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border-card">
          <div className="font-barlow text-[10px] text-fx-text-2 uppercase tracking-wider mb-2">AI reasoning</div>
          <div className="font-roboto text-[12px] text-fx-text-2 leading-relaxed">
            Dana hasn't sent a deal in 21 days. Her average is 1-2/mo. A check-in + buyer introduction maintains the relationship and creates mutual value. Timing: Tuesday morning, optimal engagement window.
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/10 flex-shrink-0 flex gap-2">
        <button
          onClick={handleApprove}
          disabled={approved}
          className={`flex-1 py-2.5 rounded-10 font-roboto font-medium text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${approved ? 'bg-fx-green/50 text-[#052016]/60' : 'bg-fx-green hover:bg-fx-green/90 text-[#052016]'}`}
        >
          {approved ? <><div className="w-3 h-3 border-2 border-[#052016]/60 border-t-transparent rounded-full animate-spin" /> Sending...</> : <><CheckCircle size={14} /> Approve & send</>}
        </button>
        <button
          onClick={() => { closeDrawer(); addToast('Message edited and saved', 'info'); }}
          className="py-2.5 px-4 rounded-10 bg-white/[0.04] border border-white/10 hover:border-white/20 font-roboto font-medium text-[13px] text-fx-text transition-all active:scale-[0.98]"
        >
          Edit
        </button>
        <button
          onClick={() => { closeDrawer(); addToast('Message discarded', 'info'); }}
          className="py-2.5 px-3 rounded-10 bg-white/[0.04] border border-white/10 hover:border-white/20 font-roboto font-medium text-[13px] text-fx-text-2 transition-all active:scale-[0.98]"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </>
  );
}
