import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Sparkles, Newspaper, ShieldAlert, Check, Circle } from "lucide-react";
import { notificationsStore, useNotifications, type NotifKind } from "@/lib/notifications-store";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

const tabs: { id: NotifKind; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "signal", label: "Signals", icon: Sparkles },
  { id: "news", label: "News", icon: Newspaper },
  { id: "system", label: "System", icon: ShieldAlert },
];

function NotificationsPage() {
  const items = useNotifications();
  const [tab, setTab] = useState<NotifKind>("signal");
  const visible = items.filter((i) => i.kind === tab);
  const unread = items.filter((i) => !i.read).length;

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Inbox</div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Notification Center</h1>
            <p className="text-sm text-muted-foreground mt-1">{unread} unread • Signal alerts, news intelligence and system updates.</p>
          </div>
          <button onClick={() => notificationsStore.markAllRead()}
            className="h-9 px-3 rounded-lg border border-border text-sm flex items-center gap-1.5 hover:bg-sidebar-accent/60">
            <Check className="size-3.5" /> Mark all read
          </button>
        </div>

        <div className="flex gap-1.5 p-1 glass-card rounded-xl w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            const total = items.filter((i) => i.kind === t.id).length;
            const tabUnread = items.filter((i) => i.kind === t.id && !i.read).length;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={"px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors " +
                  (active ? "bg-gradient-to-r from-primary/20 to-accent/15 text-foreground" : "text-muted-foreground hover:text-foreground")}>
                <Icon className="size-3.5" /> {t.label}
                <span className="ml-1 font-mono opacity-70">{total}</span>
                {tabUnread > 0 && <span className="size-1.5 rounded-full bg-primary" />}
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
                className={"glass-card p-4 rounded-xl flex items-start gap-3 transition-colors " +
                  (!n.read ? "border-l-2 border-l-primary" : "opacity-80")}>
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
                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-[11px] text-muted-foreground font-mono whitespace-nowrap">{n.time}</div>
                  <button onClick={() => notificationsStore.toggleRead(n.id)}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Circle className={"size-2 " + (n.read ? "" : "fill-primary text-primary")} />
                    {n.read ? "Read" : "Unread"}
                  </button>
                </div>
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
