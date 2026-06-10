import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import {
  Link2, ShieldCheck, AlertCircle, ExternalLink, Activity,
  Plug, Unplug, Wifi, WifiOff, Clock, TrendingUp, Lock,
  RefreshCw, CheckCircle2, XCircle, Zap, ServerCrash,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/brokers")({
  component: BrokersPage,
});

type Status = "disconnected" | "pending" | "connected";

interface BrokerConfig {
  id: string;
  key: string;
  name: string;
  tag: string;
  color: string;
  desc: string;
  apiDocUrl: string;
}

const brokersMeta: BrokerConfig[] = [
  {
    id: "angelone",
    key: "angel_one",
    name: "Angel One",
    tag: "SmartAPI v3",
    color: "var(--primary)",
    desc: "Order placement, holdings & live ticks via Angel One SmartAPI. Supports bracket & cover orders.",
    apiDocUrl: "https://smartapi.angelbroking.com/docs",
  },
  {
    id: "zerodha",
    key: "zerodha",
    name: "Zerodha",
    tag: "Kite Connect",
    color: "var(--accent)",
    desc: "Kite Connect for orders, positions, margins & historical candle data. Industry-standard reliability.",
    apiDocUrl: "https://kite.trade/docs/connect/v3/",
  },
  {
    id: "upstox",
    key: "upstox",
    name: "Upstox",
    tag: "Upstox API v2",
    color: "var(--bull)",
    desc: "Real-time market data, order management & portfolio tracking via Upstox v2 REST API.",
    apiDocUrl: "https://upstox.com/developer/api-documentation/",
  },
];

interface DbBroker {
  broker: string;
  status: Status;
  mode: "sandbox" | "live";
  last_sync_at: string | null;
  connected_at: string | null;
  disconnected_at: string | null;
  updated_at: string;
}

interface ActivityItem {
  id: string;
  broker: string;
  action: "connect" | "disconnect" | "sync" | "error";
  details: string | null;
  created_at: string;
}

function BrokersPage() {
  const [records, setRecords] = useState<Record<string, DbBroker>>({});
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const [{ data: conns }, { data: acts }] = await Promise.all([
      supabase.from("broker_connections").select("*").eq("user_id", user.id),
      supabase.from("broker_activity")
        .select("id,broker,action,details,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    const map: Record<string, DbBroker> = {};
    if (conns) {
      for (const c of conns as DbBroker[]) map[c.broker] = c;
    }
    // Ensure every broker has a default record
    for (const b of brokersMeta) {
      if (!map[b.key]) {
        map[b.key] = {
          broker: b.key,
          status: "disconnected",
          mode: "sandbox",
          last_sync_at: null,
          connected_at: null,
          disconnected_at: null,
          updated_at: new Date().toISOString(),
        };
      }
    }
    setRecords(map);
    setActivities((acts as ActivityItem[]) || []);
    setLoading(false);
  }

  async function toggleBroker(key: string) {
    setActionId(key);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setActionId(null); return; }

    const current = records[key];
    const isConnected = current?.status === "connected";
    const nextStatus: Status = isConnected ? "disconnected" : "pending";

    const upsertData = {
      user_id: user.id,
      broker: key,
      status: nextStatus,
      mode: isConnected ? "sandbox" : "live",
      ...(isConnected ? { disconnected_at: new Date().toISOString() } : { connected_at: new Date().toISOString(), last_sync_at: new Date().toISOString() }),
    };

    await supabase.from("broker_connections").upsert(upsertData, { onConflict: "user_id,broker" });

    await supabase.from("broker_activity").insert({
      user_id: user.id,
      broker: key,
      action: isConnected ? "disconnect" : "connect",
      details: isConnected ? "Disconnected via dashboard" : "Connection initiated — awaiting OAuth",
    });

    await loadData();
    setActionId(null);
  }

  const connectedCount = useMemo(
    () => brokersMeta.filter((b) => records[b.key]?.status === "connected").length,
    [records]
  );

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Integrations</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Broker Connections</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Link your brokerage accounts to enable live order execution, portfolio sync, and real-time position tracking directly from Niftex Pilot.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <StatBox icon={<Plug className="size-5" />} label="Connected" value={String(connectedCount)} />
          <StatBox icon={<Unplug className="size-5" />} label="Available" value={String(brokersMeta.length - connectedCount)} />
          <StatBox icon={<Activity className="size-5" />} label="Last Activity" value={activities[0] ? timeAgo(activities[0].created_at) : "—"} />
        </div>

        {/* Alert */}
        <div className="glass-card p-4 rounded-xl flex items-start gap-3 border-l-2 border-l-warning">
          <AlertCircle className="size-4 text-warning mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground">
            Broker integrations are in beta. Live order routing rolls out gradually — your API credentials are encrypted at rest and never leave your account environment.
          </div>
        </div>

        {/* Broker cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {brokersMeta.map((b) => {
            const rec = records[b.key];
            const status: Status = rec?.status ?? "disconnected";
            const isConnected = status === "connected";
            const isPending = status === "pending";
            const isBusy = actionId === b.key;

            return (
              <div key={b.id} className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col">
                <div className="absolute -right-12 -top-12 size-32 rounded-full blur-3xl opacity-25" style={{ background: b.color }} />
                <div className="relative flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl grid place-items-center text-primary-foreground font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, ${b.color}, oklch(0.5 0.15 250))` }}>
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-base">{b.name}</div>
                        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{b.tag}</div>
                      </div>
                    </div>
                    <BrokerStatusPill status={status} />
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed flex-1">{b.desc}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <MiniStat label="Mode" value={isConnected ? "Live" : isPending ? "Sandbox" : "—"} />
                    <MiniStat label="Last Sync" value={rec?.last_sync_at ? timeAgo(rec.last_sync_at) : "—"} />
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => toggleBroker(b.key)}
                      disabled={isBusy}
                      className={
                        "w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all " +
                        (isConnected
                          ? "border border-bear/40 text-bear hover:bg-bear/10"
                          : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90")
                      }
                    >
                      {isBusy ? (
                        <RefreshCw className="size-4 animate-spin" />
                      ) : isConnected ? (
                        <Unplug className="size-4" />
                      ) : (
                        <Plug className="size-4" />
                      )}
                      {isConnected ? "Disconnect" : isPending ? "Complete Setup" : "Connect Broker"}
                    </button>
                    <a
                      href={b.apiDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Setup guide <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity log */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 text-sm font-semibold mb-4">
            <Clock className="size-4 text-primary" /> Connection Activity
          </div>
          {loading ? (
            <div className="text-xs text-muted-foreground">Loading activity…</div>
          ) : activities.length === 0 ? (
            <div className="text-xs text-muted-foreground">No activity yet. Connect a broker to see events here.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Time</th>
                    <th className="text-left py-2 font-medium">Broker</th>
                    <th className="text-left py-2 font-medium">Action</th>
                    <th className="text-left py-2 font-medium hidden sm:table-cell">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => (
                    <tr key={act.id} className="border-b border-border/40 last:border-0">
                      <td className="py-2.5 whitespace-nowrap">{timeAgo(act.created_at)}</td>
                      <td className="py-2.5 font-medium">{brokerDisplayName(act.broker)}</td>
                      <td className="py-2.5">
                        <ActivityBadge action={act.action} />
                      </td>
                      <td className="py-2.5 text-muted-foreground hidden sm:table-cell max-w-xs truncate">{act.details || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <ShieldCheck className="size-4 text-bull" /> Security & Privacy
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <SecurityItem icon={<Lock className="size-4 text-primary" />} title="AES-256 Encryption" desc="API credentials encrypted at rest." />
            <SecurityItem icon={<Zap className="size-4 text-accent" />} title="Scoped Tokens" desc="Read & order placement only — no withdrawals." />
            <SecurityItem icon={<ServerCrash className="size-4 text-warning" />} title="Instant Revoke" desc="Disconnect anytime or revoke from your broker dashboard." />
            <SecurityItem icon={<TrendingUp className="size-4 text-bull" />} title="Audit Trail" desc="Every connect and disconnect is logged." />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card p-4 rounded-xl flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-mono text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-input/30 border border-border p-2.5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-mono text-sm mt-0.5">{value}</div>
    </div>
  );
}

function BrokerStatusPill({ status }: { status: Status }) {
  const map: Record<Status, { t: string; c: string; dot: string }> = {
    disconnected: { t: "Disconnected", c: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
    pending: { t: "Pending", c: "bg-warning/15 text-warning border-warning/30", dot: "bg-warning" },
    connected: { t: "Connected", c: "bg-bull/15 text-bull border-bull/30", dot: "bg-bull animate-pulse" },
  };
  const s = map[status];
  return (
    <span className={"inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest border " + s.c}>
      <span className={"size-1.5 rounded-full " + s.dot} />
      {s.t}
    </span>
  );
}

function ActivityBadge({ action }: { action: ActivityItem["action"] }) {
  const styles: Record<ActivityItem["action"], string> = {
    connect: "bg-bull/15 text-bull border-bull/30",
    disconnect: "bg-bear/15 text-bear border-bear/30",
    sync: "bg-primary/15 text-primary border-primary/30",
    error: "bg-warning/15 text-warning border-warning/30",
  };
  const icons: Record<ActivityItem["action"], React.ReactNode> = {
    connect: <CheckCircle2 className="size-3" />,
    disconnect: <XCircle className="size-3" />,
    sync: <RefreshCw className="size-3" />,
    error: <ServerCrash className="size-3" />,
  };
  return (
    <span className={"inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border " + styles[action]}>
      {icons[action]}
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </span>
  );
}

function SecurityItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-input/20 border border-border/50 p-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="text-xs font-semibold">{title}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function brokerDisplayName(key: string) {
  const map: Record<string, string> = { angel_one: "Angel One", zerodha: "Zerodha", upstox: "Upstox" };
  return map[key] || key;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
