import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill } from "@/components/ui-bits";
import { aiSignals, inr, type AISignal } from "@/lib/mock-data";
import { Sparkles, TrendingUp, TrendingDown, Search, Activity, Target, ShieldAlert, Filter } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/signals")({
  head: () => ({ meta: [{ title: "AI Signals — TradePilot AI" }] }),
  component: Signals,
});

type Segment = "All" | "NIFTY" | "BANKNIFTY" | "FINNIFTY" | "Stocks";
const SEGMENTS: Segment[] = ["All", "NIFTY", "BANKNIFTY", "FINNIFTY", "Stocks"];

// Extra realistic paper-trading signals to make the terminal feel populated
const extraSignals: AISignal[] = [
  { id: "s9", symbol: "NIFTY", type: "BUY", entry: 24812, stopLoss: 24720, target1: 24880, target2: 24960, target3: 25080, confidence: 88, rr: 2.9, tradeType: "Intraday", timeframe: "5m", reason: "VWAP reclaim with rising delta; OI build on 24800 PE" },
  { id: "s10", symbol: "FINNIFTY", type: "BUY", entry: 24165, stopLoss: 24080, target1: 24240, target2: 24320, target3: 24420, confidence: 74, rr: 2.2, tradeType: "Intraday", timeframe: "15m", reason: "Higher low on 15m; financials leading" },
  { id: "s11", symbol: "ICICIBANK", type: "BUY", entry: 1242.5, stopLoss: 1226.0, target1: 1258, target2: 1274, target3: 1295, confidence: 83, rr: 2.5, tradeType: "Swing", timeframe: "1D", reason: "Flag breakout on daily; sector tailwind" },
  { id: "s12", symbol: "WIPRO", type: "SELL", entry: 528.40, stopLoss: 538.00, target1: 518, target2: 510, target3: 498, confidence: 70, rr: 2.0, tradeType: "Swing", timeframe: "1D", reason: "Failed breakout; bearish divergence on RSI" },
  { id: "s13", symbol: "BANKNIFTY", type: "BUY", entry: 53420, stopLoss: 53250, target1: 53620, target2: 53820, target3: 54100, confidence: 79, rr: 2.4, tradeType: "Intraday", timeframe: "15m", reason: "Demand zone test; PCR turning supportive" },
  { id: "s14", symbol: "LT", type: "BUY", entry: 3612, stopLoss: 3568, target1: 3660, target2: 3712, target3: 3780, confidence: 81, rr: 2.6, tradeType: "Positional", timeframe: "1W", reason: "Order book momentum; multi-week consolidation breakout" },
];

const ALL: AISignal[] = [...aiSignals, ...extraSignals];

function segmentOf(sym: string): Segment {
  if (sym.startsWith("NIFTY")) return "NIFTY";
  if (sym.startsWith("BANKNIFTY")) return "BANKNIFTY";
  if (sym.startsWith("FINNIFTY")) return "FINNIFTY";
  return "Stocks";
}

function Signals() {
  const [segment, setSegment] = useState<Segment>("All");
  const [side, setSide] = useState<"All" | "BUY" | "SELL">("All");
  const [tradeType, setTradeType] = useState<"All" | "Intraday" | "Swing" | "Positional">("All");
  const [minConf, setMinConf] = useState(60);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"confidence" | "rr" | "symbol">("confidence");

  const rows = useMemo(() => {
    const filtered = ALL.filter((s) => {
      if (segment !== "All" && segmentOf(s.symbol) !== segment) return false;
      if (side !== "All" && s.type !== side) return false;
      if (tradeType !== "All" && s.tradeType !== tradeType) return false;
      if (s.confidence < minConf) return false;
      if (query && !s.symbol.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      if (sortKey === "symbol") return a.symbol.localeCompare(b.symbol);
      return (b[sortKey] as number) - (a[sortKey] as number);
    });
  }, [segment, side, tradeType, minConf, query, sortKey]);

  const buyCount = rows.filter((r) => r.type === "BUY").length;
  const sellCount = rows.filter((r) => r.type === "SELL").length;
  const avgConf = rows.length ? Math.round(rows.reduce((a, r) => a + r.confidence, 0) / rows.length) : 0;
  const avgRR = rows.length ? (rows.reduce((a, r) => a + r.rr, 0) / rows.length).toFixed(2) : "—";

  return (
    <AppShell>
      <PageHeader
        title="AI Signals Terminal"
        subtitle="Algorithmic trade ideas across NIFTY, BANKNIFTY, FINNIFTY and equities — entries, stops, multi-target RR with confidence scoring."
        actions={<Pill tone="info"><Sparkles className="size-3" /> {ALL.length} signals live</Pill>}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <GlassCard className="py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Filtered</div>
          <div className="font-mono text-2xl font-semibold mt-1">{rows.length}</div>
        </GlassCard>
        <GlassCard className="py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Buy / Sell</div>
          <div className="font-mono text-2xl font-semibold mt-1"><span className="text-bull">{buyCount}</span> <span className="text-muted-foreground">/</span> <span className="text-bear">{sellCount}</span></div>
        </GlassCard>
        <GlassCard className="py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Confidence</div>
          <div className="font-mono text-2xl font-semibold mt-1 text-accent">{avgConf}%</div>
        </GlassCard>
        <GlassCard className="py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg R:R</div>
          <div className="font-mono text-2xl font-semibold mt-1">1:{avgRR}</div>
        </GlassCard>
      </div>

      {/* Filter bar */}
      <GlassCard className="mb-4 p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground pr-2 border-r border-border/40">
              <Filter className="size-3" /> Segment
            </div>
            {SEGMENTS.map((s) => (
              <button
                key={s}
                onClick={() => setSegment(s)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors",
                  segment === s
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-md overflow-hidden border border-border/60">
              {(["All","BUY","SELL"] as const).map((s) => (
                <button key={s} onClick={() => setSide(s)} className={cn("px-3 py-1.5 text-xs font-semibold",
                  side === s ? (s === "BUY" ? "bg-bull/20 text-bull" : s === "SELL" ? "bg-bear/20 text-bear" : "bg-primary/15 text-primary") : "text-muted-foreground hover:text-foreground")}>{s}</button>
              ))}
            </div>

            <div className="flex rounded-md overflow-hidden border border-border/60">
              {(["All","Intraday","Swing","Positional"] as const).map((t) => (
                <button key={t} onClick={() => setTradeType(t)} className={cn("px-3 py-1.5 text-xs font-semibold",
                  tradeType === t ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground")}>{t}</button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/60">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Min Conf</span>
              <input type="range" min={50} max={95} value={minConf} onChange={(e) => setMinConf(+e.target.value)} className="accent-primary" />
              <span className="font-mono text-xs text-accent w-9 text-right">{minConf}%</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/60 flex-1 min-w-[180px]">
              <Search className="size-3.5 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search symbol..." className="bg-transparent outline-none text-xs flex-1 placeholder:text-muted-foreground" />
            </div>

            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as typeof sortKey)} className="px-3 py-1.5 rounded-md border border-border/60 text-xs bg-transparent text-muted-foreground">
              <option value="confidence">Sort: Confidence</option>
              <option value="rr">Sort: R:R</option>
              <option value="symbol">Sort: Symbol</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Terminal Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[1100px]">
            <thead className="bg-surface/60 border-b border-border/40 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Symbol</th>
                <th className="text-left px-3 py-3 font-medium">Side</th>
                <th className="text-left px-3 py-3 font-medium">Type</th>
                <th className="text-right px-3 py-3 font-medium">Entry</th>
                <th className="text-right px-3 py-3 font-medium">Stop Loss</th>
                <th className="text-right px-3 py-3 font-medium">Target 1</th>
                <th className="text-right px-3 py-3 font-medium">Target 2</th>
                <th className="text-right px-3 py-3 font-medium">Target 3</th>
                <th className="text-center px-3 py-3 font-medium">Confidence</th>
                <th className="text-right px-3 py-3 font-medium">R:R</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => {
                const buy = s.type === "BUY";
                return (
                  <tr key={s.id} className={cn("border-b border-border/20 hover:bg-surface/40 transition-colors", i % 2 === 0 ? "bg-transparent" : "bg-surface/20")}>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{s.symbol}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{segmentOf(s.symbol)} • {s.timeframe}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold border",
                        buy ? "bg-bull/15 text-bull border-bull/30" : "bg-bear/15 text-bear border-bear/30")}>
                        {buy ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />} {s.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{s.tradeType}</td>
                    <td className="px-3 py-3 text-right font-mono font-semibold">{inr(s.entry)}</td>
                    <td className="px-3 py-3 text-right font-mono text-bear">
                      <span className="inline-flex items-center gap-1 justify-end"><ShieldAlert className="size-3" />{inr(s.stopLoss)}</span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-bull/80">{inr(s.target1)}</td>
                    <td className="px-3 py-3 text-right font-mono text-bull/90">{inr(s.target2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-bull">
                      <span className="inline-flex items-center gap-1 justify-end"><Target className="size-3" />{inr(s.target3)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden min-w-[60px]">
                          <div className={cn("h-full rounded-full", s.confidence >= 85 ? "bg-bull" : s.confidence >= 75 ? "bg-accent" : "bg-warning")} style={{ width: `${s.confidence}%` }} />
                        </div>
                        <span className="font-mono font-semibold text-xs w-9 text-right">{s.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-semibold">1:{s.rr}</td>
                    <td className="px-4 py-3 text-right">
                      <button className={cn("px-3 py-1.5 rounded-md text-[11px] font-bold transition-opacity hover:opacity-90",
                        buy ? "bg-bull text-background" : "bg-bear text-background")}>
                        Paper {buy ? "Buy" : "Sell"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                    <Activity className="size-6 mx-auto mb-2 opacity-50" />
                    No signals match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <p className="text-[11px] text-muted-foreground mt-3 italic">
        Paper trading demo. Signals are simulated for illustration and do not constitute investment advice.
      </p>
    </AppShell>
  );
}
