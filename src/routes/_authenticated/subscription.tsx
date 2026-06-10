import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Check, Sparkles, CreditCard, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/subscription")({
  component: SubscriptionPage,
});

const features = [
  "AI Signals — unlimited, all segments",
  "Market Scanner — real-time technical scans",
  "Research Center — curated daily setups",
  "Paper Trading — prop-desk simulator",
  "News Intelligence — impact-tagged headlines",
  "Gold & Silver Research desk",
  "Risk Management toolkit",
  "Signal Performance Center — verified analytics",
];

function SubscriptionPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Subscription</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Upgrade to Niftex Pilot Pro</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            One plan. Every module unlocked. Built for serious Indian-market traders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 glass-card p-7 rounded-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 size-60 rounded-full blur-3xl opacity-30" style={{ background: "var(--primary)" }} />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[11px] font-semibold uppercase tracking-widest">Most Popular</span>
                <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[11px] font-semibold uppercase tracking-widest">Pro</span>
              </div>
              <div className="mt-4 flex items-end gap-2">
                <div className="font-mono text-5xl font-bold">₹1,499</div>
                <div className="text-sm text-muted-foreground pb-2">/ month</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Billed monthly. Cancel anytime.</div>
              <div className="text-base font-semibold mt-5">Niftex Pilot Pro</div>
              <p className="text-sm text-muted-foreground mt-1">Every module, unlimited signals, full performance history.</p>

              <div className="grid sm:grid-cols-2 gap-2.5 mt-6">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 size-5 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center">
                      <Check className="size-3" />
                    </span>
                    {f}
                  </div>
                ))}
              </div>

              <button className="mt-7 w-full h-12 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 glow-pulse">
                <Sparkles className="size-4" /> Subscribe to Pro
              </button>
              <div className="text-[11px] text-muted-foreground text-center mt-2">Secure checkout • Billing integration coming soon</div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="size-4 text-primary" /> Billing information
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <Row k="Plan" v="Niftex Pilot Pro" />
                <Row k="Price" v="₹1,499 / month" />
                <Row k="Renewal" v="Auto-renew monthly" />
                <Row k="Payment method" v="— not set —" muted />
              </div>
              <button className="mt-4 w-full h-9 rounded-lg border border-border text-sm hover:bg-sidebar-accent/60">
                Add payment method
              </button>
            </div>
            <div className="glass-card p-5 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="size-4 text-bull" /> Guarantees
              </div>
              <div className="flex items-start gap-2"><Zap className="size-3.5 mt-0.5 text-primary" /> Instant activation across all modules.</div>
              <div className="flex items-start gap-2"><Shield className="size-3.5 mt-0.5 text-bull" /> 7-day no-questions refund.</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={"font-mono " + (muted ? "text-muted-foreground" : "")}>{v}</span>
    </div>
  );
}
