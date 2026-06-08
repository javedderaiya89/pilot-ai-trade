import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill } from "@/components/ui-bits";
import { inr } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, TrendingDown, Target, ShieldAlert, Search, Filter, Trophy, CircleDot, CheckCircle2, XCircle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";

export const Route = createFileRoute("/_authenticated/signal-performance")({
  head: () => ({ meta: [{ title: "Signal Performance — TradePilot AI" }] }),
  component: SignalPerformance,
});

type Status = "Active" | "Target 1 Hit" | "Target 2 Hit" | "Target 3 Hit" | "Stop Loss Hit";
type Side = "BUY" | "SELL";

interface SignalRecord {
  id: string;
  date: string; // ISO
  symbol: string;
  side: Side;
  entry: number;
  stopLoss: number;
  target1: number;
  target2: number;
  target3: number;
  status: Status;
  segment: "NIFTY" | "BANKNIFTY" | "FINNIFTY" | "Stocks";
}

const SYMBOLS: Array<[string, SignalRecord["segment"]]> = [
  ["NIFTY", "NIFTY"], ["BANKNIFTY", "BANKNIFTY"], ["FINNIFTY", "FINNIFTY"],
  ["RELIANCE", "Stocks"], ["TCS", "Stocks"], ["INFY", "Stocks"], ["HDFCBANK", "Stocks"],
  ["ICICIBANK", "Stocks"], ["SBIN", "Stocks"], ["LT", "Stocks"], ["AXISBANK", "Stocks"],
  ["WIPRO", "Stocks"], ["MARUTI", "Stocks"], ["TATAMOTORS", "Stocks"], ["ITC", "Stocks"],
  ["ADANIENT", "Stocks"], ["BAJFINANCE", "Stocks"], ["KOTAKBANK", "Stocks"], ["HCLTECH", "Stocks"],
];

const STATUSES: Status[] = ["Active", "Target 1 Hit", "Target 2 Hit", "Target 3 Hit", "Stop Loss Hit"];

function seeded(i: number) {
  // deterministic pseudo-random
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function generateSignals(): SignalRecord[] {
  const out: SignalRecord[] = [];
  const today = new Date();
  // 180 signals over ~180 days
  for (let i = 0; i < 220; i++) {
    const [symbol, segment] = SYMBOLS[Math.floor(seeded(i + 1) * SYMBOLS.length)];
    const side: Side = seeded(i + 2) > 0.45 ? "BUY" : "SELL";
    const basePrice = symbol === "NIFTY" ? 24800 : symbol === "BANKNIFTY" ? 53200 : symbol === "FINNIFTY" ? 24100 : 200 + seeded(i + 3) * 3500;
    const entry = +(basePrice * (1 + (seeded(i + 4) - 0.5) * 0.02)).toFixed(2);
    const slPct = 0.005 + seeded(i + 5) * 0.012;
    const t1Pct = slPct * (1.2 + seeded(i + 6) * 0.6);
    const t2Pct = t1Pct * (1.5 + seeded(i + 7) * 0.5);
    const t3Pct = t2Pct * (1.4 + seeded(i + 8) * 0.6);
    const dir = side === "BUY" ? 1 : -1;
    const stopLoss = +(entry * (1 - dir * slPct)).toFixed(2);
    const target1 = +(entry * (1 + dir * t1Pct)).toFixed(2);
    const target2 = +(entry * (1 + dir * t2Pct)).toFixed(2);
    const target3 = +(entry * (1 + dir * t3Pct)).toFixed(2);

    const r = seeded(i + 9);
    let status: Status;
    if (i < 14) status = r < 0.6 ? "Active" : r < 0.8 ? "Target 1 Hit" : "Stop Loss Hit";
    else if (r < 0.32) status = "Target 1 Hit";
    else if (r < 0.55) status = "Target 2 Hit";
    else if (r < 0.7) status = "Target 3 Hit";
    else if (r < 0.92) status = "Stop Loss Hit";
    else status = "Active";

    const d = new Date(today);
    d.setDate(today.getDate() - Math.floor(i * 0.85));
    out.push({
      id: `SIG-${(1000 + i).toString()}`,
      date: d.toISOString().slice(0, 10),
      symbol, segment, side, entry, stopLoss, target1, target2, target3, status,
    });
  }
  return out;
}

const ALL_SIGNALS = generateSignals();

const STATUS_TONE: Record<Status, { cls: string; icon: typeof CircleDot }> = {
  "Active": { cls: "bg-accent/15 text-accent border-accent/30", icon: CircleDot },
  "Target 1 Hit": { cls: "bg-bull/10 text-bull/90 border-bull/25", icon: Target },
  "Target 2 Hit": { cls: "bg-bull/15 text-bull border-bull/30", icon: Target },
  "Target 3 Hit": { cls: "bg-bull/25 text-bull border-bull/40", icon: Trophy },
  "Stop Loss Hit": { cls: "bg-bear/15 text-bear border-bear/30", icon: ShieldAlert },
};

function rrFor(r: SignalRecord): number {
  const reward = Math.abs(r.target1 - r.entry);
  const risk = Math.abs(r.entry - r.stopLoss);
  return risk ? +(reward / risk).toFixed(2) : 0;
}

function isWin(s: Status) {
  return s === "Target 1 Hit" || s === "Target 2 Hit" || s === "Target 3 Hit";
}
function isLoss(s: Status) {
  return s === "Stop Loss Hit";
}

function SignalPerformance() {
  const [segment, setSegment] = useState<"All" | SignalRecord["segment"]>("All");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [side, setSide] = useState<"All" | Side>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const filtered = useMemo(() => {
    return ALL_SIGNALS.filter((s) => {
      if (segment !== "All" && s.segment !== segment) return false;
      if (status !== "All" && s.status !== status) return false;
      if (side !== "All" && s.side !== side) return false;
      if (query && !s.symbol.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [segment, status, side, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Analytics computed across ALL signals (not filtered) — meaningful platform stats
  const stats = useMemo(() => {
    const total = ALL_SIGNALS.length;
    const closed = ALL_SIGNALS.filter((s) => s.status !== "Active");
    const wins = ALL_SIGNALS.filter((s) => isWin(s.status));
    const losses = ALL_SIGNALS.filter((s) => isLoss(s.status));
    const active = total - closed.length;
    const accuracy = closed.length ? (wins.length / closed.length) * 100 : 0;
    const winRate = total ? (wins.length / total) * 100 : 0;
    const avgRR = ALL_SIGNALS.reduce((a, s) => a + rrFor(s), 0) / total;
    const t1 = ALL_SIGNALS.filter((s) => s.status === "Target 1 Hit").length;
    const t2 = ALL_SIGNALS.filter((s) => s.status === "Target 2 Hit").length;
    const t3 = ALL_SIGNALS.filter((s) => s.status === "Target 3 Hit").length;
    return { total, wins: wins.length, losses: losses.length, active, accuracy, winRate, avgRR, t1, t2, t3 };
  }, []);

  // Monthly performance
  const monthly = useMemo(() => {
    const map = new Map<string, { month: string; total: number; wins: number; losses: number }>();
    for (const s of ALL_SIGNALS) {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      const row = map.get(key) ?? { month: label, total: 0, wins: 0, losses: 0 };
      row.total += 1;
      if (isWin(s.status)) row.wins += 1;
      if (isLoss(s.status)) row.losses += 1;
      map.set(key, row);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => ({ ...v, accuracy: v.total ? Math.round((v.wins / Math.max(1, v.wins + v.losses)) * 100) : 0 }));
  }, []);

  // Cumulative accuracy curve (over signal index)
  const curve = useMemo(() => {
    const sorted = [...ALL_SIGNALS].sort((a, b) => a.date.localeCompare(b.date));
    let w = 0, c = 0;
    return sorted.map((s, i) => {
      if (isWin(s.status)) { w++; c++; }
      else if (isLoss(s.status)) { c++; }
      return { i: i + 1, accuracy: c ? +((w / c) * 100).toFixed(1) : 0 };
    }).filter((_, i) => i % 4 === 0);
  }, []);

  const pieData = [
    { name: "Target 1", value: stats.t1, color: "hsl(var(--bull) / 0.55)" },
    { name: "Target 2", value: stats.t2, color: "hsl(var(--bull) / 0.8)" },
    { name: "Target 3", value: stats.t3, color: "hsl(var(--bull))" },
    { name: "Stop Loss", value: stats.losses, color: "hsl(var(--bear))" },
    { name: "Active", value: stats.active, color: "hsl(var(--accent))" },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Signal Performance Center"
        subtitle="Track every algorithmic signal generated by TradePilot AI — entries, targets, accuracy, win-rate and monthly performance."
        actions={<Pill tone="info"><Activity className="size-3" /> {ALL_SIGNALS.length} signals tracked</Pill>}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <KPI label="Total Signals" value={stats.total.toString()} accent="text-foreground" />
        <KPI label="Winning" value={stats.wins.toString()} accent="text-bull" icon={<CheckCircle2 className="size-3.5" />} />
        <KPI label="Losing" value={stats.losses.toString()} accent="text-bear" icon={<XCircle className="size-3.5" />} />
        <KPI label="Accuracy" value={`${stats.accuracy.toFixed(1)}%`} accent="text-accent" />
        <KPI label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} accent="text-primary" />
        <KPI label="Avg R:R" value={`1:${stats.avgRR.toFixed(2)}`} accent="text-foreground" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GlassCard className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Cumulative Accuracy</div>
              <div className="text-sm font-semibold mt-0.5">Platform Edge Over Time</div>
            </div>
            <Pill tone="bull"><TrendingUp className="size-3" /> Trending up</Pill>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curve}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="i" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[40, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#accGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Outcome Distribution</div>
          <div className="text-sm font-semibold mt-0.5 mb-2">Where Signals Land</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2} stroke="hsl(var(--background))">
                  {pieData.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[11px]">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: p.color }} />
                <span className="text-muted-foreground">{p.name}</span>
                <span className="ml-auto font-mono font-semibold">{p.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Monthly Performance */}
      <GlassCard className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Monthly Performance</div>
            <div className="text-sm font-semibold mt-0.5">Wins vs Losses (last 6 months)</div>
          </div>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} barGap={4}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="wins" fill="hsl(var(--bull))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="losses" fill="hsl(var(--bear))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-3">
          {monthly.map((m) => (
            <div key={m.month} className="px-3 py-2 rounded-md border border-border/40 bg-surface/30">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.month}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-sm font-semibold">{m.total}</span>
                <span className="text-[11px] font-semibold text-accent">{m.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Filters */}
      <GlassCard className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground pr-2 border-r border-border/40">
            <Filter className="size-3" /> Filters
          </div>
          <FilterGroup<typeof segment> value={segment} onChange={(v) => { setSegment(v); setPage(1); }} options={["All", "NIFTY", "BANKNIFTY", "FINNIFTY", "Stocks"]} />
          <FilterGroup<typeof side> value={side} onChange={(v) => { setSide(v); setPage(1); }} options={["All", "BUY", "SELL"]} tone="side" />
          <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }} className="px-3 py-1.5 rounded-md border border-border/60 text-xs bg-transparent text-muted-foreground">
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/60 flex-1 min-w-[180px]">
            <Search className="size-3.5 text-muted-foreground" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search symbol..." className="bg-transparent outline-none text-xs flex-1 placeholder:text-muted-foreground" />
          </div>
        </div>
      </GlassCard>

      {/* Signal Log Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
          <div className="text-sm font-semibold">Signal Log <span className="text-muted-foreground font-normal">({filtered.length})</span></div>
          <div className="text-[11px] text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[1100px]">
            <thead className="bg-surface/60 border-b border-border/40 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-3 py-3 font-medium">Symbol</th>
                <th className="text-left px-3 py-3 font-medium">Side</th>
                <th className="text-right px-3 py-3 font-medium">Entry</th>
                <th className="text-right px-3 py-3 font-medium">Stop Loss</th>
                <th className="text-right px-3 py-3 font-medium">Target 1</th>
                <th className="text-right px-3 py-3 font-medium">Target 2</th>
                <th className="text-right px-3 py-3 font-medium">Target 3</th>
                <th className="text-right px-3 py-3 font-medium">R:R</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => {
                const tone = STATUS_TONE[r.status];
                const Icon = tone.icon;
                const buy = r.side === "BUY";
                return (
                  <tr key={r.id} className={cn("border-b border-border/20 hover:bg-surface/40 transition-colors", i % 2 === 0 ? "bg-transparent" : "bg-surface/20")}>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{r.date}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold">{r.symbol}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{r.segment}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold border",
                        buy ? "bg-bull/15 text-bull border-bull/30" : "bg-bear/15 text-bear border-bear/30")}>
                        {buy ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />} {r.side}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-semibold">{inr(r.entry)}</td>
                    <td className="px-3 py-3 text-right font-mono text-bear">{inr(r.stopLoss)}</td>
                    <td className="px-3 py-3 text-right font-mono text-bull/80">{inr(r.target1)}</td>
                    <td className="px-3 py-3 text-right font-mono text-bull/90">{inr(r.target2)}</td>
                    <td className="px-3 py-3 text-right font-mono text-bull">{inr(r.target3)}</td>
                    <td className="px-3 py-3 text-right font-mono font-semibold">1:{rrFor(r).toFixed(2)}</td>
                    <td className="px-3 py-3">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border whitespace-nowrap", tone.cls)}>
                        <Icon className="size-3" /> {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                    <Activity className="size-6 mx-auto mb-2 opacity-50" />
                    No signals match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
          <div className="text-[11px] text-muted-foreground">Page {page} of {totalPages}</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 rounded-md border border-border/60 text-xs disabled:opacity-40 hover:bg-surface/40">«</button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded-md border border-border/60 text-xs disabled:opacity-40 hover:bg-surface/40">Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded-md border border-border/60 text-xs disabled:opacity-40 hover:bg-surface/40">Next</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 rounded-md border border-border/60 text-xs disabled:opacity-40 hover:bg-surface/40">»</button>
          </div>
        </div>
      </GlassCard>

      <p className="text-[11px] text-muted-foreground mt-3 italic">
        Paper trading demo. Signal performance shown for illustration only and does not constitute investment advice.
      </p>
    </AppShell>
  );
}

function KPI({ label, value, accent, icon }: { label: string; value: string; accent?: string; icon?: React.ReactNode }) {
  return (
    <GlassCard className="py-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <div className={cn("font-mono text-2xl font-semibold mt-1", accent)}>{value}</div>
    </GlassCard>
  );
}

function FilterGroup<T extends string>({ value, onChange, options, tone }: { value: T; onChange: (v: T) => void; options: readonly T[]; tone?: "side" }) {
  return (
    <div className="flex rounded-md overflow-hidden border border-border/60">
      {options.map((o) => {
        const active = value === o;
        const cls = active
          ? tone === "side"
            ? o === "BUY" ? "bg-bull/20 text-bull" : o === "SELL" ? "bg-bear/20 text-bear" : "bg-primary/15 text-primary"
            : "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground";
        return (
          <button key={o} onClick={() => onChange(o)} className={cn("px-3 py-1.5 text-xs font-semibold", cls)}>{o}</button>
        );
      })}
    </div>
  );
}
