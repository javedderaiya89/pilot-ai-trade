import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill } from "@/components/ui-bits";
import { SegmentTabs, type MarketSegment } from "@/components/segment-tabs";
import { stocks, commodities, metals, inr, type Stock, type CommodityQuote } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/scanner")({
  head: () => ({ meta: [{ title: "Market Scanner — TradePilot AI" }] }),
  component: Scanner,
});

type ScanCategory = string;
const scans: Record<string, { label: string; categories: { id: ScanCategory; label: string; fn: (s: typeof stocks[number]) => boolean }[] }> = {
  RSI: {
    label: "RSI Scanner",
    categories: [
      { id: "rsi70", label: "RSI Above 70 (Overbought)", fn: (s) => s.rsi > 70 },
      { id: "rsi60", label: "RSI Above 60", fn: (s) => s.rsi > 60 },
      { id: "rsi40", label: "RSI Below 40", fn: (s) => s.rsi < 40 },
      { id: "rsi30", label: "RSI Below 30 (Oversold)", fn: (s) => s.rsi < 30 },
    ],
  },
  MACD: {
    label: "MACD Scanner",
    categories: [
      { id: "bull", label: "Bullish Crossovers", fn: (s) => s.macd === "bullish" },
      { id: "bear", label: "Bearish Crossovers", fn: (s) => s.macd === "bearish" },
    ],
  },
  EMA: {
    label: "EMA Scanner",
    categories: [
      { id: "20x50", label: "EMA 20 Cross EMA 50 (Bullish)", fn: (s) => s.changePct > 1.5 },
      { id: "50x200", label: "EMA 50 Cross EMA 200 (Golden Cross)", fn: (s) => s.changePct > 2.5 },
    ],
  },
  VOL: {
    label: "Volume Breakout",
    categories: [{ id: "vol", label: "Unusual Volume Spike", fn: (s) => s.volume > 4_000_000 }],
  },
  BO: {
    label: "Breakout Scanner",
    categories: [{ id: "bo", label: "52W High Breakout", fn: (s) => s.changePct > 3 }],
  },
  MOM: {
    label: "Momentum Scanner",
    categories: [{ id: "mom", label: "Strong Momentum", fn: (s) => s.changePct > 2 && s.rsi > 55 }],
  },
};

function Scanner() {
  const [scan, setScan] = useState("RSI");
  const [cat, setCat] = useState(scans["RSI"].categories[0].id);
  const [q, setQ] = useState("");
  const current = scans[scan];
  const fn = current.categories.find((c) => c.id === cat)?.fn ?? (() => true);
  const filtered = stocks.filter(fn).filter((s) => s.symbol.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <PageHeader title="Market Scanner" subtitle="Multi-factor scans on the Indian equity universe — RSI, MACD, EMA, Volume, Breakout, Momentum." />

      <GlassCard className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(scans).map(([k, v]) => (
            <button
              key={k}
              onClick={() => { setScan(k); setCat(v.categories[0].id); }}
              className={"px-3 py-1.5 rounded-lg text-sm font-medium border transition-all " + (scan === k ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-muted-foreground hover:text-foreground")}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          {current.categories.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} className={"px-3 py-1 rounded-md text-xs border " + (cat === c.id ? "bg-accent/15 border-accent/40 text-accent" : "border-border text-muted-foreground")}>{c.label}</button>
          ))}
          <div className="ml-auto relative">
            <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter symbol…" className="bg-input/50 border border-border rounded-md pl-8 pr-2 py-1.5 text-xs w-44" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/50 bg-surface/40">
              <tr>
                <th className="text-left px-4 py-3">Symbol</th>
                <th className="text-left px-4 py-3">Sector</th>
                <th className="text-right px-4 py-3">LTP</th>
                <th className="text-right px-4 py-3">Change %</th>
                <th className="text-right px-4 py-3">RSI</th>
                <th className="text-center px-4 py-3">MACD</th>
                <th className="text-right px-4 py-3">Volume</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.symbol} className="border-b border-border/30 hover:bg-surface/40">
                  <td className="px-4 py-3"><div className="font-semibold">{s.symbol}</div><div className="text-[11px] text-muted-foreground">{s.name}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{s.sector}</td>
                  <td className="px-4 py-3 text-right font-mono">{inr(s.ltp)}</td>
                  <td className={"px-4 py-3 text-right font-mono " + (s.changePct >= 0 ? "text-bull" : "text-bear")}>{s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right font-mono">{s.rsi}</td>
                  <td className="px-4 py-3 text-center"><Pill tone={s.macd === "bullish" ? "bull" : s.macd === "bearish" ? "bear" : "neutral"}>{s.macd}</Pill></td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">{(s.volume/1e6).toFixed(2)}M</td>
                  <td className="px-4 py-3 text-center"><button className="text-xs px-2 py-1 rounded bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25">Trade</button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-muted-foreground text-sm">No matches for this scan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 text-xs text-muted-foreground">
          <span>{filtered.length} results</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded border border-border">Prev</button>
            <button className="px-2 py-1 rounded border border-border bg-surface">1</button>
            <button className="px-2 py-1 rounded border border-border">2</button>
            <button className="px-2 py-1 rounded border border-border">Next</button>
          </div>
        </div>
      </GlassCard>
    </AppShell>
  );
}
