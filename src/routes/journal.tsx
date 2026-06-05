import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { journal, inr } from "@/lib/mock-data";
import { BookOpen, Plus } from "lucide-react";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Trade Journal — TradePilot AI" }] }),
  component: Journal,
});

function Journal() {
  const wins = journal.filter((j) => j.tag === "Win").length;
  const losses = journal.filter((j) => j.tag === "Loss").length;
  const totalPnl = journal.reduce((a, j) => a + j.pnl, 0);
  return (
    <AppShell>
      <PageHeader title="Trade Journal" subtitle="Track every trade with notes, psychology, screenshots and outcomes — the discipline edge." actions={<button className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-1.5"><Plus className="size-4"/> New Entry</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <GlassCard className="p-4"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Trades</div><div className="font-mono text-xl font-semibold mt-1">{journal.length}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Wins</div><div className="font-mono text-xl font-semibold mt-1 text-bull">{wins}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Losses</div><div className="font-mono text-xl font-semibold mt-1 text-bear">{losses}</div></GlassCard>
        <GlassCard className="p-4"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Net P&L</div><div className={"font-mono text-xl font-semibold mt-1 " + (totalPnl >= 0 ? "text-bull" : "text-bear")}>{totalPnl >= 0 ? "+" : ""}₹{inr(totalPnl)}</div></GlassCard>
      </div>

      <div className="space-y-3">
        {journal.map((j) => (
          <GlassCard key={j.id} className="grid md:grid-cols-[1fr,2fr] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill tone={j.tag === "Win" ? "bull" : j.tag === "Loss" ? "bear" : "neutral"}>{j.tag}</Pill>
                <span className="text-xs text-muted-foreground">{j.date}</span>
              </div>
              <div className="font-bold text-lg">{j.symbol}</div>
              {j.contract && <div className="text-xs text-muted-foreground">{j.contract}</div>}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div><div className="text-muted-foreground">Entry</div><div className="font-mono">{inr(j.entry)}</div></div>
                <div><div className="text-muted-foreground">Exit</div><div className="font-mono">{inr(j.exit)}</div></div>
                <div><div className="text-muted-foreground">SL</div><div className="font-mono text-bear">{inr(j.sl)}</div></div>
                <div><div className="text-muted-foreground">Target</div><div className="font-mono text-bull">{inr(j.target)}</div></div>
              </div>
              <div className={"mt-3 font-mono font-bold text-lg " + (j.pnl >= 0 ? "text-bull" : "text-bear")}>
                {j.pnl >= 0 ? "+" : ""}₹{inr(j.pnl)}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1"><BookOpen className="size-3"/> Trade Notes</div>
                <p className="text-sm">{j.notes}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Psychology</div>
                <p className="text-sm text-muted-foreground italic">"{j.psychology}"</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
