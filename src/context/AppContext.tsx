import React, { createContext, useContext, useState, useCallback } from 'react';
import { ACTION_CARDS, DEALS, ActionCard, Deal, KanbanStage } from '../constants/mockData';

export type Screen =
  | 'execution'
  | 'deal-flo'
  | 'borrowers'
  | 'partners'
  | 'communications'
  | 'documents'
  | 'buyer-passports'
  | 'mortgage-market'
  | 'ai-workforce'
  | 'analytics'
  | 'playbooks'
  | 'settings';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  removing?: boolean;
}

export type DrawerType =
  | 'call'
  | 'review-message'
  | 'view-deal'
  | 'view-application'
  | 'view-profile'
  | 'ai-review'
  | 'deal-detail'
  | null;

export interface DrawerPayload {
  type: DrawerType;
  card?: ActionCard;
  deal?: Deal;
  title?: string;
}

interface AppContextType {
  activeScreen: Screen;
  setActiveScreen: (s: Screen) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  visibleCards: string[];
  removingCards: string[];
  removeCard: (id: string, message: string) => void;
  deals: Deal[];
  moveDeal: (dealId: string, newStage: KanbanStage) => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  drawer: DrawerPayload;
  openDrawer: (payload: DrawerPayload) => void;
  closeDrawer: () => void;
  actionCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeScreen, setActiveScreen] = useState<Screen>('execution');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>(ACTION_CARDS.map(c => c.id));
  const [removingCards, setRemovingCards] = useState<string[]>([]);
  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [drawer, setDrawer] = useState<DrawerPayload>({ type: null });

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 280);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 280);
  }, []);

  const removeCard = useCallback((id: string, message: string) => {
    setRemovingCards(prev => [...prev, id]);
    setTimeout(() => {
      setVisibleCards(prev => prev.filter(c => c !== id));
      setRemovingCards(prev => prev.filter(c => c !== id));
    }, 350);
    addToast(message, 'success');
  }, [addToast]);

  const moveDeal = useCallback((dealId: string, newStage: KanbanStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
  }, []);

  const openDrawer = useCallback((payload: DrawerPayload) => {
    setDrawer(payload);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer({ type: null });
  }, []);

  const actionCount = visibleCards.length;

  return (
    <AppContext.Provider value={{
      activeScreen, setActiveScreen,
      sidebarOpen, setSidebarOpen,
      visibleCards, removingCards, removeCard,
      deals, moveDeal,
      toasts, addToast, removeToast,
      drawer, openDrawer, closeDrawer,
      actionCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
