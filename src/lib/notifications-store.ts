import { useEffect, useState } from "react";

export type NotifKind = "signal" | "news" | "system";
export interface Notif {
  id: number;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const seed: Notif[] = [
  { id: 1, kind: "signal", title: "BUY signal: RELIANCE", body: "Entry ₹2,940 • SL ₹2,905 • T1 ₹2,980 — Confidence 82%", time: "2m ago", read: false },
  { id: 2, kind: "signal", title: "SELL signal: BANKNIFTY", body: "Entry 49,820 • SL 49,950 • T1 49,650 — Confidence 76%", time: "14m ago", read: false },
  { id: 3, kind: "news", title: "RBI policy: status quo on repo rate", body: "Inflation guidance steady. Banking sector neutral-to-positive.", time: "1h ago", read: false },
  { id: 4, kind: "system", title: "Paper trading P&L weekly report", body: "Your weekly P&L: +₹4,820 across 12 trades. Win rate 58%.", time: "3h ago", read: true },
  { id: 5, kind: "news", title: "Crude oil drops 2.4%", body: "OMC stocks may see momentum at open. Watch BPCL, HPCL, IOC.", time: "5h ago", read: true },
  { id: 6, kind: "signal", title: "T1 hit: HDFCBANK BUY", body: "Booked +1.2% on first target. Trailing SL to entry.", time: "Yesterday", read: true },
  { id: 7, kind: "system", title: "Subscription reminder", body: "Your Pro trial ends in 5 days. Subscribe to keep full access.", time: "Yesterday", read: true },
];

let state: Notif[] = seed;
const listeners = new Set<(n: Notif[]) => void>();

function emit() { listeners.forEach((l) => l(state)); }

export const notificationsStore = {
  get: () => state,
  set: (next: Notif[]) => { state = next; emit(); },
  markAllRead: () => { state = state.map((n) => ({ ...n, read: true })); emit(); },
  toggleRead: (id: number) => {
    state = state.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    emit();
  },
  subscribe: (cb: (n: Notif[]) => void) => { listeners.add(cb); return () => listeners.delete(cb); },
};

export function useNotifications() {
  const [items, setItems] = useState<Notif[]>(notificationsStore.get());
  useEffect(() => { const unsub = notificationsStore.subscribe(setItems); return () => { unsub(); }; }, []);
  return items;
}

export function useUnreadCount() {
  const items = useNotifications();
  return items.filter((n) => !n.read).length;
}
