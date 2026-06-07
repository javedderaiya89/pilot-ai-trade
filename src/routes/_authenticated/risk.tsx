import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { inr } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/risk")({
  head: () => ({ meta: [{ title: "Risk Management — TradePilot AI" }] }),
  component: Risk,
});

function Risk() {
  const [capital, setCapital] = useState(100000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(2945);
  const [stop, setStop] = useState(2898);
  const riskRupees = (capital * riskPct) / 100;
  const slDist = Math.abs(entry - stop);
  const positionSize = slDist > 0 ? Math.floor(riskRupees / slDist) : 0;
  const tradeValue = positionSize * entry;

  return (
    <AppShell>
      <PageHeader title="Risk Management" subtitle="Position sizing, daily/weekly loss limits and drawdown guardrails." actions={<Pill tone="warn"><ShieldAlert className="size-3"/> Within limits</Pill>} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GlassCard>
          <SectionTitle title="Position Size Calculator" subtitle="Based on fixed-fractional risk model" />
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Capital (₹)", v: capital, set: setCapital },
              { l: "Risk per Trade (%)", v: riskPct, set: setRiskPct },
              { l: "Entry Price", v: entry, set: setEntry },
              { l: "Stop Loss", v: stop, set: setStop },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground">{f.l}</label>
                <input type="number" value={f.v} onChange={(e) => f.set(+e.target.value)} className="w-full mt-1 bg-input/50 border border-border rounded-lg px-3 py-2 font-mono text-sm" />
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border/40 grid grid-cols-3 gap-3 text-sm">
            <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk Amount</div><div className="font-mono text-lg font-semibold text-bear mt-1">₹{inr(riskRupees)}</div></div>
            <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Position Size</div><div className="font-mono text-lg font-semibold text-primary mt-1">{positionSize} qty</div></div>
            <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Trade Value</div><div className="font-mono text-lg font-semibold mt-1">₹{inr(tradeValue)}</div></div>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Loss Limits" subtitle="Auto-pause trading when limits are hit" />
          {[
            { l: "Daily Loss Limit", used: 320, max: 2000, tone: "bull" },
            { l: "Weekly Loss Limit", used: 1840, max: 6000, tone: "warn" },
            { l: "Monthly Drawdown", used: 3120, max: 12000, tone: "warn" },
          ].map((r) => {
            const pct = (r.used / r.max) * 100;
            return (
              <div key={r.l} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{r.l}</span>
                  <span className="font-mono">₹{inr(r.used)} / ₹{inr(r.max)}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: pct > 75 ? "var(--bear)" : pct > 50 ? "var(--warning)" : "var(--bull)" }} />
                </div>
              </div>
            );
          })}
        </GlassCard>
      </div>

      <GlassCard>
        <SectionTitle title="Risk Guardrails Status" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Max Open Positions", v: "4 / 8", tone: "bull" },
            { l: "Exposure", v: "42%", tone: "bull" },
            { l: "Leverage", v: "1.0x", tone: "bull" },
            { l: "Correlation Risk", v: "Moderate", tone: "warn" },
          ].map((m) => (
            <div key={m.l} className="border border-border/40 rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
              <div className="font-mono text-lg font-semibold mt-1">{m.v}</div>
              <Pill tone={m.tone as "bull"|"warn"} className="mt-2">OK</Pill>
            </div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  );
}
