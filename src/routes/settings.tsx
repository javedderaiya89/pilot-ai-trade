import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — TradePilot AI" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Profile, preferences, notifications and broker integrations." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <SectionTitle title="User Profile" />
          <div className="flex items-center gap-4 mb-4">
            <div className="size-16 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-xl font-bold text-primary-foreground">RT</div>
            <div>
              <div className="font-semibold">Rahul Trader</div>
              <div className="text-sm text-muted-foreground">rahul@tradepilot.ai</div>
              <Pill tone="info" className="mt-1">PRO • Paper Account</Pill>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { l: "Display Name", v: "Rahul Trader" },
              { l: "Email", v: "rahul@tradepilot.ai" },
              { l: "Default Capital (₹)", v: "100000" },
              { l: "Timezone", v: "Asia/Kolkata (IST)" },
            ].map((f) => (
              <div key={f.l}>
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground">{f.l}</label>
                <input defaultValue={f.v} className="w-full mt-1 bg-input/50 border border-border rounded-lg px-3 py-2 text-sm" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Theme & Preferences" />
          {[
            { l: "Dark Premium Theme", on: true },
            { l: "Glassmorphism Effects", on: true },
            { l: "Compact Density", on: false },
            { l: "Show P&L in Header", on: true },
            { l: "Sound Alerts", on: false },
          ].map((p) => (
            <div key={p.l} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
              <span className="text-sm">{p.l}</span>
              <button className={"relative w-11 h-6 rounded-full transition-colors " + (p.on ? "bg-primary" : "bg-surface")}>
                <span className={"absolute top-0.5 size-5 rounded-full bg-background transition-all " + (p.on ? "left-5" : "left-0.5")} />
              </button>
            </div>
          ))}
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Notifications" />
          {[
            "AI Signal Alerts",
            "Price Breakout Alerts",
            "Stop Loss / Target Hit",
            "Daily Market Recap (Email)",
            "Weekly Performance Report",
          ].map((n) => (
            <div key={n} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0 text-sm">
              <span>{n}</span>
              <div className="flex gap-2 text-xs">
                <Pill tone="info">Push</Pill>
                <Pill tone="neutral">Email</Pill>
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Broker Integrations" subtitle="Coming soon — paper trading only at this time" />
          {[
            { name: "Angel One", desc: "SmartAPI integration", status: "Coming Soon" },
            { name: "Zerodha Kite", desc: "Kite Connect API", status: "Coming Soon" },
            { name: "Upstox", desc: "Upstox Pro API", status: "Coming Soon" },
            { name: "Dhan", desc: "Dhan HQ API", status: "Coming Soon" },
          ].map((b) => (
            <div key={b.name} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div>
                <div className="font-semibold text-sm">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
              </div>
              <Pill tone="warn">{b.status}</Pill>
            </div>
          ))}
        </GlassCard>
      </div>
    </AppShell>
  );
}
