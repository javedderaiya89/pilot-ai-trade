import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { buildOptionChain, indices, inr } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/options")({
  head: () => ({ meta: [{ title: "Options Analysis — TradePilot AI" }] }),
  component: Options,
});

const products = [
  { sym: "NIFTY", step: 50 },
  { sym: "BANKNIFTY", step: 100 },
  { sym: "RELIANCE", step: 20 },
];

function Options() {
  const [sym, setSym] = useState("NIFTY");
  const product = products.find((p) => p.sym === sym)!;
  const spot = indices.find((i) => i.symbol === sym)?.ltp ?? 2945;
  const chain = useMemo(() => buildOptionChain(spot, product.step), [spot, product.step]);

  const totalCallOI = chain.reduce((a, r) => a + r.callOI, 0);
  const totalPutOI = chain.reduce((a, r) => a + r.putOI, 0);
  const pcr = (totalPutOI / totalCallOI).toFixed(2);
  const maxPain = chain.reduce((best, r) => (r.callOI + r.putOI > (best?.callOI + best?.putOI || 0) ? r : best), chain[0]).strike;
  const atm = Math.round(spot / product.step) * product.step;

  const chartData = chain.map((r) => ({ strike: r.strike, Call: r.callOI, Put: r.putOI }));

  const supports = chain.filter((r) => r.strike < spot).sort((a, b) => b.putOI - a.putOI).slice(0, 3).map((r) => r.strike);
  const resistances = chain.filter((r) => r.strike > spot).sort((a, b) => b.callOI - a.callOI).slice(0, 3).map((r) => r.strike);

  return (
    <AppShell>
      <PageHeader title="Options Analysis" subtitle="Open Interest, PCR, Max Pain, strike-wise volume and support/resistance from option chain." />

      <div className="flex flex-wrap gap-2 mb-4">
        {products.map((p) => (
          <button key={p.sym} onClick={() => setSym(p.sym)} className={"px-4 py-2 rounded-lg text-sm font-medium border " + (sym === p.sym ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-muted-foreground")}>
            {p.sym} Options
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {[
          { l: "Spot", v: inr(spot), tone: "neutral" },
          { l: "ATM Strike", v: String(atm), tone: "info" },
          { l: "PCR", v: pcr, tone: Number(pcr) > 1 ? "bull" : "bear" },
          { l: "Max Pain", v: String(maxPain), tone: "warn" },
          { l: "Total OI Chg", v: "+8.4%", tone: "bull" },
        ].map((m) => (
          <GlassCard key={m.l} className="p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
            <div className="font-mono text-lg font-semibold mt-1">{m.v}</div>
            <Pill tone={m.tone as "bull"|"bear"|"neutral"|"warn"|"info"} className="mt-2">{m.l}</Pill>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-4">
        <SectionTitle title="Open Interest Distribution" subtitle="Call vs Put OI across strikes" />
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="strike" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Call" fill="var(--bear)" opacity={0.85} />
              <Bar dataKey="Put" fill="var(--bull)" opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GlassCard>
          <SectionTitle title="Support Levels" />
          <div className="space-y-2">
            {supports.map((s) => (
              <div key={s} className="flex justify-between items-center border border-bull/20 bg-bull/5 rounded-lg px-3 py-2">
                <span className="font-mono font-semibold">{s}</span>
                <Pill tone="bull">Put OI Wall</Pill>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <SectionTitle title="Resistance Levels" />
          <div className="space-y-2">
            {resistances.map((s) => (
              <div key={s} className="flex justify-between items-center border border-bear/20 bg-bear/5 rounded-lg px-3 py-2">
                <span className="font-mono font-semibold">{s}</span>
                <Pill tone="bear">Call OI Wall</Pill>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <SectionTitle title="Strike Analysis" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Most active CE</span><span className="font-mono">{atm} CE</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Most active PE</span><span className="font-mono">{atm} PE</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">CE OI Build-up</span><Pill tone="bear">Bearish</Pill></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PE OI Build-up</span><Pill tone="bull">Bullish</Pill></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Implied Volatility</span><span className="font-mono">14.8%</span></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-semibold">Option Chain — {sym}</h3>
          <Pill tone="info">Live</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="text-[10px] uppercase text-muted-foreground border-b border-border/40 bg-surface/40">
              <tr>
                <th className="px-3 py-2 text-right">Call Vol</th>
                <th className="px-3 py-2 text-right">Call OI Chg</th>
                <th className="px-3 py-2 text-right">Call OI</th>
                <th className="px-3 py-2 text-right">Call LTP</th>
                <th className="px-3 py-2 text-center bg-surface-2">Strike</th>
                <th className="px-3 py-2 text-right">Put LTP</th>
                <th className="px-3 py-2 text-right">Put OI</th>
                <th className="px-3 py-2 text-right">Put OI Chg</th>
                <th className="px-3 py-2 text-right">Put Vol</th>
              </tr>
            </thead>
            <tbody>
              {chain.map((r) => {
                const isAtm = r.strike === atm;
                return (
                  <tr key={r.strike} className={"border-b border-border/20 " + (isAtm ? "bg-primary/5" : "hover:bg-surface/40")}>
                    <td className="px-3 py-2 text-right text-muted-foreground">{(r.callVolume/1000).toFixed(1)}K</td>
                    <td className={"px-3 py-2 text-right " + (r.callOIChange >= 0 ? "text-bull" : "text-bear")}>{r.callOIChange >= 0 ? "+" : ""}{(r.callOIChange/1000).toFixed(1)}K</td>
                    <td className="px-3 py-2 text-right">{(r.callOI/1000).toFixed(1)}K</td>
                    <td className="px-3 py-2 text-right text-bear">{r.callLTP}</td>
                    <td className={"px-3 py-2 text-center font-bold " + (isAtm ? "text-primary" : "")}>{r.strike}</td>
                    <td className="px-3 py-2 text-right text-bull">{r.putLTP}</td>
                    <td className="px-3 py-2 text-right">{(r.putOI/1000).toFixed(1)}K</td>
                    <td className={"px-3 py-2 text-right " + (r.putOIChange >= 0 ? "text-bull" : "text-bear")}>{r.putOIChange >= 0 ? "+" : ""}{(r.putOIChange/1000).toFixed(1)}K</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{(r.putVolume/1000).toFixed(1)}K</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </AppShell>
  );
}
