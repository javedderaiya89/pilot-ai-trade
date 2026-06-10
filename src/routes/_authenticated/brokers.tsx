import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Link2, ShieldCheck, AlertCircle, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/brokers")({
  component: BrokersPage,
});

type Status = "disconnected" | "pending" | "connected";

const initial: { id: string; name: string; tag: string; color: string; desc: string; status: Status }[] = [
  { id: "angelone", name: "Angel One", tag: "SmartAPI", color: "var(--primary)", desc: "Order placement, holdings, live ticks via SmartAPI.", status: "disconnected" },
  { id: "zerodha", name: "Zerodha", tag: "Kite Connect", color: "var(--accent)", desc: "Kite Connect for orders, positions and historical data.", status: "disconnected" },
  { id: "upstox", name: "Upstox", tag: "Upstox API v2", color: "var(--bull)", desc: "Real-time market data and trading via Upstox v2 API.", status: "disconnected" },
];

function BrokersPage() {
  const [brokers, setBrokers] = useState(initial);

  function toggle(id: string) {
    setBrokers((b) => b.map((x) => {
      if (x.id !== id) return x;
      const next: Status = x.status === "disconnected" ? "pending" : x.status === "pending" ? "connected" : "disconnected";
      return { ...x, status: next };
    }));
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Integrations</div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Broker Connections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect a broker to enable live order execution from signals. Read-only & sandbox modes supported.
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-start gap-3 border-l-2 border-l-warning">
          <AlertCircle className="size-4 text-warning mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground">
            Broker integrations are in beta. Live order routing rolls out gradually — your API keys are encrypted at rest and never leave your account.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {brokers.map((b) => {
            const isConnected = b.status === "connected";
            const isPending = b.status === "pending";
            return (
              <div key={b.id} className="glass-card p-5 rounded-xl relative overflow-hidden">
                <div className="absolute -right-12 -top-12 size-32 rounded-full blur-3xl opacity-30" style={{ background: b.color }} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-base">{b.name}</div>
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{b.tag}</div>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{b.desc}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <Stat label="Mode" value={isConnected ? "Live" : isPending ? "Sandbox" : "—"} />
                    <Stat label="Last sync" value={isConnected ? "Just now" : "—"} />
                  </div>

                  <button onClick={() => toggle(b.id)}
                    className={"mt-5 w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 " +
                      (isConnected
                        ? "border border-bear/40 text-bear hover:bg-bear/10"
                        : "bg-gradient-to-r from-primary to-accent text-primary-foreground")}>
                    <Link2 className="size-4" />
                    {isConnected ? "Disconnect" : isPending ? "Complete setup" : "Connect"}
                  </button>
                  <a href="#" className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                    Setup guide <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-bull" /> Security</div>
          <ul className="mt-3 text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>API credentials encrypted with AES-256 at rest.</li>
            <li>Tokens scoped to read & order placement only — no withdrawals.</li>
            <li>Revoke access anytime from your broker dashboard.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-input/30 border border-border p-2.5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-mono text-sm mt-0.5">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    disconnected: { t: "Disconnected", c: "bg-muted text-muted-foreground border-border" },
    pending: { t: "Pending", c: "bg-warning/15 text-warning border-warning/30" },
    connected: { t: "Connected", c: "bg-bull/15 text-bull border-bull/30" },
  }[status];
  return (
    <span className={"inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest border " + map.c}>
      <span className={"size-1.5 rounded-full " + (status === "connected" ? "bg-bull animate-pulse" : status === "pending" ? "bg-warning" : "bg-muted-foreground")} />
      {map.t}
    </span>
  );
}
