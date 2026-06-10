import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Check, Sparkles, CreditCard, Shield, Zap, Calendar, BadgeCheck,
  TrendingUp, AlertTriangle, X, ArrowUpRight, Wallet, Clock,
} from "lucide-react";

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
  const [status, setStatus] = useState<"active" | "cancelled">("active");
  const [showCancel, setShowCancel] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const renewalDate = new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);
  const renewalLabel = renewalDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const daysLeft = 18;

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Subscription Center</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Your Membership</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            Manage your Niftex Pilot Pro plan, billing and renewal preferences.
          </p>
        </div>

        {/* Active plan hero */}
        <div className="glass-card p-7 rounded-2xl relative overflow-hidden border border-primary/20">
          <div className="absolute -right-24 -top-24 size-72 rounded-full blur-3xl opacity-30" style={{ background: "var(--primary)" }} />
          <div className="absolute -left-24 -bottom-24 size-72 rounded-full blur-3xl opacity-20" style={{ background: "var(--accent)" }} />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-[11px] font-semibold uppercase tracking-widest border border-primary/30">
                  Active Plan
                </span>
                <StatusPill status={status} />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground">
                  <Sparkles className="size-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight">Niftex Pilot Pro</div>
                  <div className="text-xs text-muted-foreground">All modules unlocked • Priority signals</div>
                </div>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <div className="font-mono text-5xl font-bold">₹1,499</div>
                <div className="text-sm text-muted-foreground pb-2">/ month</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Billed monthly in INR • Inclusive of GST</div>

              <div className="flex flex-wrap gap-3 mt-7">
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="h-11 px-5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold flex items-center gap-2 glow-pulse">
                  <ArrowUpRight className="size-4" /> Upgrade to Annual (Save 20%)
                </button>
                {status === "active" ? (
                  <button
                    onClick={() => setShowCancel(true)}
                    className="h-11 px-5 rounded-lg border border-bear/40 text-bear hover:bg-bear/10 text-sm font-semibold flex items-center gap-2">
                    <X className="size-4" /> Cancel Subscription
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus("active")}
                    className="h-11 px-5 rounded-lg border border-bull/40 text-bull hover:bg-bull/10 text-sm font-semibold flex items-center gap-2">
                    <BadgeCheck className="size-4" /> Reactivate
                  </button>
                )}
              </div>
            </div>

            {/* Renewal panel */}
            <div className="glass-card p-5 rounded-xl bg-card/60 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="size-4 text-primary" />
                {status === "active" ? "Next renewal" : "Access until"}
              </div>
              <div>
                <div className="font-mono text-2xl font-semibold">{renewalLabel}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Clock className="size-3" /> {daysLeft} days remaining
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${((30 - daysLeft) / 30) * 100}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <MiniRow icon={<Wallet className="size-3" />} label="Amount due" value="₹1,499" />
                <MiniRow icon={<CreditCard className="size-3" />} label="Method" value="—" muted />
              </div>
            </div>
          </div>
        </div>

        {/* Features + billing */}
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-5">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BadgeCheck className="size-4 text-bull" /> What's included
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 size-5 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center">
                    <Check className="size-3" />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-card p-5 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="size-4 text-primary" /> Billing
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <Row k="Plan" v="Niftex Pilot Pro" />
                <Row k="Price" v="₹1,499 / month" />
                <Row k="Status" v={status === "active" ? "Active" : "Cancelled"} />
                <Row k="Renewal" v={status === "active" ? "Auto-renew" : "Will not renew"} />
                <Row k="Method" v="— not set —" muted />
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
              <div className="flex items-start gap-2"><TrendingUp className="size-3.5 mt-0.5 text-accent" /> Lock in current pricing for 12 months.</div>
            </div>
          </div>
        </div>

        {/* Billing history */}
        <div className="glass-card p-6 rounded-xl">
          <div className="text-sm font-semibold mb-4">Recent invoices</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Invoice</th>
                  <th className="text-left py-2 font-medium">Plan</th>
                  <th className="text-right py-2 font-medium">Amount</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3">{inv.date}</td>
                    <td className="py-3 text-muted-foreground">{inv.id}</td>
                    <td className="py-3">Niftex Pilot Pro</td>
                    <td className="py-3 text-right">₹{inv.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-md bg-bull/15 text-bull text-[11px] border border-bull/30">Paid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel modal */}
      {showCancel && (
        <Modal onClose={() => setShowCancel(false)} title="Cancel subscription?" tone="bear" icon={<AlertTriangle className="size-5" />}>
          <p className="text-sm text-muted-foreground">
            You'll keep Pro access until <span className="font-mono text-foreground">{renewalLabel}</span>. After that, AI signals, scanner and performance analytics will be locked.
          </p>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setShowCancel(false)} className="h-9 px-4 rounded-lg border border-border text-sm">Keep Pro</button>
            <button
              onClick={() => { setStatus("cancelled"); setShowCancel(false); }}
              className="h-9 px-4 rounded-lg bg-bear text-bear-foreground text-sm font-semibold">
              Confirm cancellation
            </button>
          </div>
        </Modal>
      )}

      {/* Upgrade modal */}
      {showUpgrade && (
        <Modal onClose={() => setShowUpgrade(false)} title="Switch to annual billing" tone="primary" icon={<Sparkles className="size-5" />}>
          <p className="text-sm text-muted-foreground">Lock pricing for 12 months and save ₹3,598/year.</p>
          <div className="mt-4 glass-card p-4 rounded-xl bg-card/60">
            <div className="flex items-end gap-2"><div className="font-mono text-3xl font-bold">₹14,390</div><div className="text-xs text-muted-foreground pb-1.5">/ year</div></div>
            <div className="text-[11px] text-bull mt-1">Equivalent to ₹1,199/month</div>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <button onClick={() => setShowUpgrade(false)} className="h-9 px-4 rounded-lg border border-border text-sm">Not now</button>
            <button onClick={() => setShowUpgrade(false)} className="h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold">
              Upgrade — checkout coming soon
            </button>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

const invoices = [
  { id: "INV-20260601", date: "01 Jun 2026", amount: 1499 },
  { id: "INV-20260501", date: "01 May 2026", amount: 1499 },
  { id: "INV-20260401", date: "01 Apr 2026", amount: 1499 },
];

function StatusPill({ status }: { status: "active" | "cancelled" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-bull/15 text-bull text-[11px] font-semibold uppercase tracking-widest border border-bull/30">
        <span className="size-1.5 rounded-full bg-bull animate-pulse" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-warning/15 text-warning text-[11px] font-semibold uppercase tracking-widest border border-warning/30">
      Cancelled
    </span>
  );
}

function MiniRow({ icon, label, value, muted }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">{icon} {label}</div>
      <div className={"font-mono text-sm mt-0.5 " + (muted ? "text-muted-foreground" : "")}>{value}</div>
    </div>
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

function Modal({
  title, children, onClose, tone, icon,
}: { title: string; children: React.ReactNode; onClose: () => void; tone: "bear" | "primary"; icon: React.ReactNode }) {
  const toneClass = tone === "bear" ? "text-bear bg-bear/15 border-bear/30" : "text-primary bg-primary/15 border-primary/30";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card p-6 rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className={"size-10 rounded-xl grid place-items-center border " + toneClass}>{icon}</div>
          <div className="text-lg font-semibold">{title}</div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
