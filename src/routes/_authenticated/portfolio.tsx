import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { SegmentTabs, type MarketSegment } from "@/components/segment-tabs";
import { positions, closedPositions, equityCurve, monthlyPerf, inr, segmentOfSymbol } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Area, AreaChart } from "recharts";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — TradePilot AI" }] }),
  component: Portfolio,
});

// Commodity/metal paper positions to round out the book
const commodityPositions = [
  { id: "pc1", symbol: "GOLD", type: "LONG" as const, instrument: "FUT" as const, qty: 1, avgPrice: 72400, ltp: 72845, pnl: 4450, pnlPct: 0.61, openedAt: "2025-06-04 10:15", segment: "Commodities" as MarketSegment },
  { id: "pc2", symbol: "CRUDEOIL", type: "LONG" as const, instrument: "FUT" as const, qty: 100, avgPrice: 6432, ltp: 6485, pnl: 5300, pnlPct: 0.82, openedAt: "2025-06-05 11:02", segment: "Commodities" as MarketSegment },
  { id: "pm1", symbol: "COPPER", type: "LONG" as const, instrument: "FUT" as const, qty: 2500, avgPrice: 818, ltp: 824.5, pnl: 16250, pnlPct: 0.79, openedAt: "2025-06-03 09:45", segment: "Metals" as MarketSegment },
  { id: "pm2", symbol: "NICKEL", type: "SHORT" as const, instrument: "FUT" as const, qty: 250, avgPrice: 1568, ltp: 1542.8, pnl: 6300, pnlPct: 1.61, openedAt: "2025-06-06 12:30", segment: "Metals" as MarketSegment },
];

function Portfolio() {
  const [segment, setSegment] = useState<MarketSegment>("All");
  const allOpen = [...positions.map((p) => ({ ...p, segment: segmentOfSymbol(p.symbol.split(" ")[0]) as MarketSegment })), ...commodityPositions];
  const allClosed = closedPositions.map((p) => ({ ...p, segment: segmentOfSymbol(p.symbol) as MarketSegment }));
  const openFiltered = useMemo(() => segment === "All" ? allOpen : allOpen.filter((p) => p.segment === segment), [segment, allOpen]);
  const closedFiltered = useMemo(() => segment === "All" ? allClosed : allClosed.filter((p) => p.segment === segment), [segment, allClosed]);
  const totalOpen = openFiltered.reduce((a, p) => a + p.pnl, 0);
  const totalClosed = closedFiltered.reduce((a, p) => a + p.pnl, 0);
  const drawdown = -3120;
  return (
    <AppShell>
      <PageHeader title="Portfolio Analytics" subtitle="Equity, commodity and metal positions — curve, drawdown and monthly performance." />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SegmentTabs value={segment} onChange={setSegment} />
        <Pill tone="info">{openFiltered.length} open · {closedFiltered.length} closed</Pill>
      </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { l: "Open P&L", v: (totalOpen >= 0 ? "+" : "") + "₹" + inr(totalOpen), t: totalOpen >= 0 ? "bull" : "bear" },
          { l: "Realized P&L", v: (totalClosed >= 0 ? "+" : "") + "₹" + inr(totalClosed), t: totalClosed >= 0 ? "bull" : "bear" },
          { l: "Max Drawdown", v: "₹" + inr(drawdown), t: "bear" },
          { l: "Profit Factor", v: "2.14", t: "bull" },
        ].map((m) => (
          <GlassCard key={m.l} className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
            <div className="font-mono text-xl font-semibold mt-1">{m.v}</div>
            <Pill tone={m.t as "bull"|"bear"} className="mt-2">{m.l.split(" ")[0]}</Pill>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GlassCard>
          <SectionTitle title="Equity Curve" />
          <div className="h-60">
            <ResponsiveContainer>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="pe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area dataKey="equity" stroke="var(--accent)" fill="url(#pe)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Monthly P&L" />
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={monthlyPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="pnl" radius={[6,6,0,0]}>
                  {monthlyPerf.map((m, i) => <Cell key={i} fill={m.pnl >= 0 ? "var(--bull)" : "var(--bear)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mb-4">
        <SectionTitle title="Drawdown Analysis" />
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div><div className="text-muted-foreground">Current</div><div className="font-mono text-bear text-lg mt-1">-1.2%</div></div>
          <div><div className="text-muted-foreground">Max DD</div><div className="font-mono text-bear text-lg mt-1">-4.8%</div></div>
          <div><div className="text-muted-foreground">Recovery Days</div><div className="font-mono text-lg mt-1">12</div></div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-semibold">Open Positions</h3>
          <Pill tone="info">{openFiltered.length} trades</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface/40 border-b border-border/40">
              <tr>
                <th className="text-left px-4 py-3">Symbol</th>
                <th className="text-left px-4 py-3">Segment</th>
                <th className="text-right px-4 py-3">Qty</th>
                <th className="text-right px-4 py-3">Avg</th>
                <th className="text-right px-4 py-3">LTP</th>
                <th className="text-right px-4 py-3">P&L</th>
                <th className="text-right px-4 py-3">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {openFiltered.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-surface/40">
                  <td className="px-4 py-3 font-semibold">{p.symbol}</td>
                  <td className="px-4 py-3"><Pill tone={p.segment === "Equity" ? "info" : p.segment === "Commodities" ? "warn" : "neutral"}>{p.segment}</Pill></td>
                  <td className="px-4 py-3 text-right font-mono">{p.qty}</td>
                  <td className="px-4 py-3 text-right font-mono">{inr(p.avgPrice)}</td>
                  <td className="px-4 py-3 text-right font-mono">{inr(p.ltp)}</td>
                  <td className={"px-4 py-3 text-right font-mono font-semibold " + (p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnl >= 0 ? "+" : ""}₹{inr(p.pnl)}</td>
                  <td className={"px-4 py-3 text-right font-mono " + (p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%</td>
                </tr>
              ))}
              {openFiltered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No positions in this segment.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-semibold">Closed Positions</h3>
          <Pill tone="info">{closedFiltered.length} trades</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface/40 border-b border-border/40">
              <tr>
                <th className="text-left px-4 py-3">Symbol</th>
                <th className="text-left px-4 py-3">Segment</th>
                <th className="text-right px-4 py-3">Qty</th>
                <th className="text-right px-4 py-3">Buy Avg</th>
                <th className="text-right px-4 py-3">Sell Avg</th>
                <th className="text-right px-4 py-3">P&L</th>
                <th className="text-right px-4 py-3">P&L %</th>
                <th className="text-left px-4 py-3">Closed</th>
              </tr>
            </thead>
            <tbody>
              {closedFiltered.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-surface/40">
                  <td className="px-4 py-3 font-semibold">{p.symbol}</td>
                  <td className="px-4 py-3"><Pill tone={p.segment === "Equity" ? "info" : p.segment === "Commodities" ? "warn" : "neutral"}>{p.segment}</Pill></td>
                  <td className="px-4 py-3 text-right font-mono">{p.qty}</td>
                  <td className="px-4 py-3 text-right font-mono">{inr(p.avgPrice)}</td>
                  <td className="px-4 py-3 text-right font-mono">{inr(p.ltp)}</td>
                  <td className={"px-4 py-3 text-right font-mono font-semibold " + (p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnl >= 0 ? "+" : ""}₹{inr(p.pnl)}</td>
                  <td className={"px-4 py-3 text-right font-mono " + (p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.openedAt}</td>
                </tr>
              ))}
              {closedFiltered.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No closed trades in this segment.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </AppShell>
  );
}
