import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { positions, inr, equityCurve } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/paper-trading")({
  head: () => ({ meta: [{ title: "Paper Trading — TradePilot AI" }] }),
  component: Paper,
});

function Paper() {
  const totalPnl = positions.reduce((a, p) => a + p.pnl, 0);
  const dayPnl = totalPnl;
  const winRate = 68.4;
  return (
    <AppShell>
      <PageHeader title="Paper Trading Desk" subtitle="Practice with ₹1,00,000 virtual capital — execute mock buy/sell orders, track positions and P&L." actions={<Pill tone="info"><Wallet className="size-3" /> Virtual Mode</Pill>} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {[
          { l: "Virtual Capital", v: "₹1,00,000", t: "neutral" },
          { l: "Current Equity", v: "₹1,02,470", t: "bull" },
          { l: "Open P&L", v: (totalPnl >= 0 ? "+" : "") + "₹" + inr(totalPnl), t: totalPnl >= 0 ? "bull" : "bear" },
          { l: "Day P&L", v: (dayPnl >= 0 ? "+" : "") + "₹" + inr(dayPnl), t: dayPnl >= 0 ? "bull" : "bear" },
          { l: "Win Rate", v: winRate + "%", t: "info" },
        ].map((m) => (
          <GlassCard key={m.l} className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
            <div className="font-mono text-xl font-semibold mt-1">{m.v}</div>
            <Pill tone={m.t as "bull"|"bear"|"neutral"|"info"} className="mt-2">{m.l.split(" ")[0]}</Pill>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GlassCard className="lg:col-span-2">
          <SectionTitle title="Equity Curve" subtitle="Performance over the last 40 sessions" right={<Pill tone="bull">+2.47%</Pill>} />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={["dataMin - 1000", "dataMax + 1000"]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="equity" stroke="var(--primary)" strokeWidth={2} fill="url(#eq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Quick Order" />
          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Symbol</label>
              <input defaultValue="RELIANCE" className="w-full mt-1 bg-input/50 border border-border rounded-lg px-3 py-2 font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Qty</label>
                <input defaultValue="25" className="w-full mt-1 bg-input/50 border border-border rounded-lg px-3 py-2 font-mono text-sm" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Price</label>
                <input defaultValue="2945.20" className="w-full mt-1 bg-input/50 border border-border rounded-lg px-3 py-2 font-mono text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Stop Loss</label>
                <input defaultValue="2898" className="w-full mt-1 bg-input/50 border border-border rounded-lg px-3 py-2 font-mono text-sm" />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Target</label>
                <input defaultValue="3025" className="w-full mt-1 bg-input/50 border border-border rounded-lg px-3 py-2 font-mono text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button className="py-2.5 rounded-lg font-semibold bg-bull text-background">BUY</button>
              <button className="py-2.5 rounded-lg font-semibold bg-bear text-background">SELL</button>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-semibold">Open Positions</h3>
          <Pill tone="info">{positions.length} active</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/40 bg-surface/40">
              <tr>
                <th className="text-left px-4 py-3">Symbol</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Qty</th>
                <th className="text-right px-4 py-3">Avg Price</th>
                <th className="text-right px-4 py-3">LTP</th>
                <th className="text-right px-4 py-3">P&L</th>
                <th className="text-right px-4 py-3">P&L %</th>
                <th className="text-left px-4 py-3">Opened</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-surface/40">
                  <td className="px-4 py-3 font-semibold">{p.symbol}</td>
                  <td className="px-4 py-3"><Pill tone={p.type === "LONG" ? "bull" : "bear"}>{p.type} • {p.instrument}</Pill></td>
                  <td className="px-4 py-3 text-right font-mono">{p.qty}</td>
                  <td className="px-4 py-3 text-right font-mono">{inr(p.avgPrice)}</td>
                  <td className="px-4 py-3 text-right font-mono">{inr(p.ltp)}</td>
                  <td className={"px-4 py-3 text-right font-mono font-semibold " + (p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnl >= 0 ? "+" : ""}₹{inr(p.pnl)}</td>
                  <td className={"px-4 py-3 text-right font-mono " + (p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.openedAt}</td>
                  <td className="px-4 py-3 text-center"><button className="text-xs px-3 py-1 rounded bg-bear/15 text-bear border border-bear/30 hover:bg-bear/25">Square Off</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </AppShell>
  );
}
