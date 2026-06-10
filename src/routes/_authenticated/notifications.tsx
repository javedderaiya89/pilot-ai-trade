import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Bell, Sparkles, Newspaper, ShieldAlert, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

type Kind = "signal" | "news" | "system";

const seed: { id: number; kind: Kind; title: string; body: string; time: string; read: boolean }[] = [
  { id: 1, kind: "signal", title: "BUY signal: RELIANCE", body: "Entry ₹2,940 • SL ₹2,905 • T1 ₹2,980 — Confidence 82%", time: "2m ago", read: false },
  { id: 2, kind: "signal", title: "SELL signal: BANKNIFTY", body: "Entry 49,820 • SL 49,950 • T1 49,650 — Confidence 76%", time: "14m ago", read: false },
  { id: 3, kind: "news", title: "RBI policy: status quo on repo rate", body: "Inflation guidance steady. Banking sector neutral-to-positive.", time: "1h ago", read: false },
  { id: 4, kind: "system", title: "Paper trading P&L weekly report", body: "Your weekly P&L: +₹4,820 across 12 trades. Win rate 58%.", time: "3h ago", read: true },
  { id: 5, kind: "news", title: "Crude oil drops 2.4%", body: "OMC stocks may see momentum at open. Watch BPCL, HPCL, IOC.", time: "5h ago", read: true },
  { id: 6, kind: "signal", title: "T1 hit: HDFCBANK BUY", body: "Booked +1.2% on first target. Trailing SL to entry.", time: "Yesterday", read: true },
  { id: 7, kind: "system", title: "Subscription reminder", body: "Your Pro trial ends in 5 days. Subscribe to keep full access.", time: "Yesterday", read: true },
];

const tabs: { id: "all" | Kind; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "signal", label: "Signals", icon: Sparkles },
  { id: "news", label: "News", icon: Newspaper },
  { id: "system", label: "System", icon: ShieldAlert },
];

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState<"all" | Kind>("all");
  const visible = items.filter((i) => tab === "all" || i.kind === tab);
  const unread = items.filter((i) => !i.read).length;

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Inbox</div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">{unread} unread • Signal alerts, news intelligence and system updates.</p>
          </div>
          <button onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}
            className="h-9 px-3 rounded-lg border border-border text-sm flex items-center gap-1.5 hover:bg-sidebar-accent/60">
            <Check className="size-3.5" /> Mark all read
          </button>
        </div>

        <div className="flex gap-1.5 p-1 glass-card rounded-xl w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            const count = t.id === "all" ? items.length : items.filter((i) => i.kind === t.id).length;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={"px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 " + (active ? "bg-gradient-to-r from-primary/20 to-accent/15 text-foreground" : "text-muted-foreground hover:text-foreground")}>
                <Icon className="size-3.5" /> {t.label}
                <span className="ml-1 font-mono opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {visible.map((n) => {
            const tone = n.kind === "signal" ? "primary" : n.kind === "news" ? "accent" : "bull";
            const Icon = n.kind === "signal" ? Sparkles : n.kind === "news" ? Newspaper : ShieldAlert;
            return (
              <div key={n.id}
                className={"glass-card p-4 rounded-xl flex items-start gap-3 " + (!n.read ? "border-l-2 border-l-primary" : "")}>
                <div className={"size-9 shrink-0 rounded-lg grid place-items-center " +
                  (tone === "primary" ? "bg-primary/15 text-primary" : tone === "accent" ? "bg-accent/15 text-accent" : "bg-bull/15 text-bull")}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm truncate">{n.title}</div>
                    {!n.read && <span className="size-1.5 rounded-full bg-primary" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono whitespace-nowrap">{n.time}</div>
              </div>
            );
          })}
          {visible.length === 0 && (
            <div className="glass-card p-10 rounded-xl text-center text-sm text-muted-foreground">No notifications in this category.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
