import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { aiSignals, inr } from "@/lib/mock-data";
import { Sparkles, Target, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/signals")({
  head: () => ({ meta: [{ title: "AI Signals — TradePilot AI" }] }),
  component: Signals,
});

function Signals() {
  const [filter, setFilter] = useState<"All" | "Intraday" | "Swing" | "Positional">("All");
  const rows = aiSignals.filter((s) => filter === "All" ? true : s.tradeType === filter);
  return (
    <AppShell>
      <PageHeader title="AI Signals" subtitle="Algorithmically generated trade ideas with entries, stops and multi-target risk-reward profiles." actions={<Pill tone="info"><Sparkles className="size-3" /> {aiSignals.length} active</Pill>} />

      <div className="flex flex-wrap gap-2 mb-4">
        {(["All","Intraday","Swing","Positional"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={"px-3 py-1.5 rounded-lg text-sm font-medium border " + (filter === f ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-muted-foreground")}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map((s) => {
          const buy = s.type === "BUY";
          return (
            <GlassCard key={s.id} className="relative overflow-hidden">
              <div className="absolute -top-12 -right-12 size-32 rounded-full blur-3xl opacity-30" style={{ background: buy ? "var(--bull)" : "var(--bear)" }} />
              <div className="flex items-start justify-between relative">
                <div>
                  <div className="font-bold text-lg">{s.symbol}</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{s.tradeType} • {s.timeframe}</div>
                </div>
                <Pill tone={buy ? "bull" : "bear"}>{buy ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />} {s.type}</Pill>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Entry</div>
                  <div className="font-mono font-semibold">{inr(s.entry)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Stop Loss</div>
                  <div className="font-mono font-semibold text-bear">{inr(s.stopLoss)}</div>
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {[
                  { l: "T1", v: s.target1 }, { l: "T2", v: s.target2 }, { l: "T3", v: s.target3 },
                ].map((t, i) => (
                  <div key={t.l} className="flex items-center gap-2">
                    <Target className="size-3 text-bull" />
                    <span className="text-xs text-muted-foreground w-7">{t.l}</span>
                    <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-bull/60 to-bull" style={{ width: `${(i+1) * 33}%` }} />
                    </div>
                    <span className="font-mono text-xs text-bull">{inr(t.v)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-accent" />
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold text-accent">{s.confidence}%</span>
                </div>
                <div className="text-muted-foreground">R:R <span className="text-foreground font-semibold">1:{s.rr}</span></div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 italic">"{s.reason}"</p>

              <div className="mt-3 flex gap-2">
                <button className={"flex-1 py-2 rounded-lg text-sm font-semibold " + (buy ? "bg-bull text-background hover:opacity-90" : "bg-bear text-background hover:opacity-90")}>{buy ? "Paper Buy" : "Paper Sell"}</button>
                <button className="px-3 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground">Save</button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppShell>
  );
}
