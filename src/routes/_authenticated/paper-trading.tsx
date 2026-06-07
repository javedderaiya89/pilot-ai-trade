import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { positions, closedPositions, inr, equityCurve } from "@/lib/mock-data";
import {
  Area, AreaChart, Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from "recharts";
import { Wallet, Calculator, TrendingUp, TrendingDown, Target, ShieldAlert, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/paper-trading")({
  head: () => ({ meta: [{ title: "Paper Trading — TradePilot AI" }] }),
  component: Paper,
});

// Realistic daily / weekly / monthly P&L for the prop dashboard
const dailyPnl = [
  { d: "Mon", pnl: 1240 }, { d: "Tue", pnl: -620 }, { d: "Wed", pnl: 2180 },
  { d: "Thu", pnl: 940 }, { d: "Fri", pnl: -310 }, { d: "Sat", pnl: 0 }, { d: "Sun", pnl: 0 },
];
const weeklyPnl = [
  { w: "W1", pnl: 4280 }, { w: "W2", pnl: -1820 }, { w: "W3", pnl: 6420 }, { w: "W4", pnl: 3825 },
];
const monthlyPnl = [
  { m: "Jan", pnl: 8420 }, { m: "Feb", pnl: -3120 }, { m: "Mar", pnl: 12480 },
  { m: "Apr", pnl: 6210 }, { m: "May", pnl: 14230 }, { m: "Jun", pnl: 3825 },
];

function Paper() {
  // Virtual capital & risk settings
  const [capital, setCapital] = useState(100000);
  const [riskPct, setRiskPct] = useState(1.0);

  // Position sizing inputs
  const [entry, setEntry] = useState(2945.20);
  const [stopLoss, setStopLoss] = useState(2898);
  const [target, setTarget] = useState(3025);
  const [symbol, setSymbol] = useState("RELIANCE");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");

  // Exit form
  const [exitSymbol, setExitSymbol] = useState("RELIANCE");
  const [exitQty, setExitQty] = useState(25);
  const [exitPrice, setExitPrice] = useState(2965);

  const calc = useMemo(() => {
    const riskAmt = (capital * riskPct) / 100;
    const slDist = Math.abs(entry - stopLoss);
    const rwDist = Math.abs(target - entry);
    const qty = slDist > 0 ? Math.floor(riskAmt / slDist) : 0;
    const rr = slDist > 0 ? +(rwDist / slDist).toFixed(2) : 0;
    const capitalRequired = +(qty * entry).toFixed(2);
    const potentialReward = +(qty * rwDist).toFixed(2);
    return { riskAmt, slDist, rwDist, qty, rr, capitalRequired, potentialReward };
  }, [capital, riskPct, entry, stopLoss, target]);

  const openPnl = positions.reduce((a, p) => a + p.pnl, 0);
  const closedPnl = closedPositions.reduce((a, p) => a + p.pnl, 0);
  const equity = capital + openPnl + closedPnl;
  const dayTotal = dailyPnl.reduce((a, x) => a + x.pnl, 0);
  const weekTotal = weeklyPnl.reduce((a, x) => a + x.pnl, 0);
  const monthTotal = monthlyPnl.reduce((a, x) => a + x.pnl, 0);
  const wins = closedPositions.filter((p) => p.pnl > 0).length;
  const winRate = ((wins / closedPositions.length) * 100).toFixed(1);

  return (
    <AppShell>
      <PageHeader
        title="Paper Trading Desk"
        subtitle="Prop-style virtual trading: capital management, position sizing, live P&L tracking and equity analytics."
        actions={<Pill tone="info"><Wallet className="size-3" /> Virtual Mode</Pill>}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <KPI label="Virtual Capital" value={`₹${inr(capital)}`} tone="neutral" />
        <KPI label="Current Equity" value={`₹${inr(equity)}`} tone={equity >= capital ? "bull" : "bear"} delta={`${equity >= capital ? "+" : ""}${(((equity - capital) / capital) * 100).toFixed(2)}%`} />
        <KPI label="Open P&L" value={fmtPnl(openPnl)} tone={openPnl >= 0 ? "bull" : "bear"} />
        <KPI label="Realized P&L" value={fmtPnl(closedPnl)} tone={closedPnl >= 0 ? "bull" : "bear"} />
        <KPI label="Win Rate" value={`${winRate}%`} tone="info" />
        <KPI label="Risk / Trade" value={`${riskPct}%`} delta={`₹${inr(calc.riskAmt)}`} tone="warn" />
      </div>

      {/* Settings + Sizing Calculator + Entry */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        {/* Virtual Capital Settings */}
        <GlassCard className="xl:col-span-3">
          <SectionTitle title="Capital Settings" right={<Settings2 className="size-4 text-muted-foreground" />} />
          <Field label="Virtual Capital (₹)">
            <input type="number" value={capital} onChange={(e) => setCapital(+e.target.value || 0)} className={inputCls} />
          </Field>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[100000, 500000, 1000000].map((v) => (
              <button key={v} onClick={() => setCapital(v)} className="text-[11px] px-2 py-1.5 rounded border border-border/60 text-muted-foreground hover:text-foreground">
                ₹{v >= 100000 ? `${v / 100000}L` : v}
              </button>
            ))}
          </div>
          <Field label="Risk Per Trade (%)" className="mt-3">
            <div className="flex items-center gap-3">
              <input type="range" min={0.25} max={5} step={0.25} value={riskPct} onChange={(e) => setRiskPct(+e.target.value)} className="accent-primary flex-1" />
              <span className="font-mono text-sm text-accent w-12 text-right">{riskPct.toFixed(2)}%</span>
            </div>
          </Field>
          <div className="mt-3 p-3 rounded-lg bg-surface/40 border border-border/30">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Max Risk / Trade</span>
              <span className="font-mono font-semibold text-warning">₹{inr(calc.riskAmt)}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted-foreground">Daily Loss Limit</span>
              <span className="font-mono font-semibold text-bear">₹{inr(calc.riskAmt * 3)}</span>
            </div>
          </div>
        </GlassCard>

        {/* Position Sizing Calculator */}
        <GlassCard className="xl:col-span-4">
          <SectionTitle title="Position Sizing" right={<Pill tone="info"><Calculator className="size-3" /> Auto Qty</Pill>} />
          <div className="grid grid-cols-3 gap-2">
            <Field label="Entry"><input type="number" value={entry} onChange={(e) => setEntry(+e.target.value)} className={inputCls} /></Field>
            <Field label="Stop Loss"><input type="number" value={stopLoss} onChange={(e) => setStopLoss(+e.target.value)} className={inputCls} /></Field>
            <Field label="Target"><input type="number" value={target} onChange={(e) => setTarget(+e.target.value)} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Metric label="Auto Qty" value={calc.qty.toString()} tone="accent" big />
            <Metric label="Risk : Reward" value={`1 : ${calc.rr}`} tone={calc.rr >= 2 ? "bull" : "warn"} big />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Metric label="SL Distance" value={`₹${calc.slDist.toFixed(2)}`} tone="bear" />
            <Metric label="Capital Req" value={`₹${inr(calc.capitalRequired)}`} tone="neutral" />
            <Metric label="Potential" value={`₹${inr(calc.potentialReward)}`} tone="bull" />
          </div>
        </GlassCard>

        {/* Trade Entry Form */}
        <GlassCard className="xl:col-span-5">
          <SectionTitle title="Trade Entry" right={
            <div className="flex rounded-md overflow-hidden border border-border/60">
              <button onClick={() => setSide("BUY")} className={cn("px-3 py-1 text-xs font-bold", side === "BUY" ? "bg-bull text-background" : "text-muted-foreground")}>BUY</button>
              <button onClick={() => setSide("SELL")} className={cn("px-3 py-1 text-xs font-bold", side === "SELL" ? "bg-bear text-background" : "text-muted-foreground")}>SELL</button>
            </div>
          } />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Symbol"><input value={symbol} onChange={(e) => setSymbol(e.target.value)} className={inputCls} /></Field>
            <Field label="Instrument">
              <select className={inputCls}>
                <option>EQ</option><option>FUT</option><option>CE</option><option>PE</option>
              </select>
            </Field>
            <Field label="Quantity"><input type="number" value={calc.qty} readOnly className={cn(inputCls, "text-accent")} /></Field>
            <Field label="Order Type">
              <select className={inputCls}><option>MARKET</option><option>LIMIT</option><option>SL</option><option>SL-M</option></select>
            </Field>
            <Field label="Entry Price"><input type="number" value={entry} onChange={(e) => setEntry(+e.target.value)} className={inputCls} /></Field>
            <Field label="Stop Loss"><input type="number" value={stopLoss} onChange={(e) => setStopLoss(+e.target.value)} className={inputCls} /></Field>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-surface/40 border border-border/30 grid grid-cols-3 gap-2 text-xs">
            <div><span className="text-muted-foreground">Margin</span><div className="font-mono font-semibold">₹{inr(calc.capitalRequired)}</div></div>
            <div><span className="text-muted-foreground">Max Loss</span><div className="font-mono font-semibold text-bear">₹{inr(calc.qty * calc.slDist)}</div></div>
            <div><span className="text-muted-foreground">Max Gain</span><div className="font-mono font-semibold text-bull">₹{inr(calc.potentialReward)}</div></div>
          </div>
          <button className={cn("w-full mt-3 py-2.5 rounded-lg font-bold text-sm", side === "BUY" ? "bg-bull text-background" : "bg-bear text-background")}>
            Place Paper {side} Order
          </button>
        </GlassCard>
      </div>

      {/* Equity Curve + Trade Exit */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <GlassCard className="xl:col-span-2">
          <SectionTitle title="Equity Curve" subtitle="40-session performance vs. starting capital" right={<Pill tone={equity >= capital ? "bull" : "bear"}>{equity >= capital ? "+" : ""}{(((equity - capital) / capital) * 100).toFixed(2)}%</Pill>} />
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
                <ReferenceLine y={100000} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="equity" stroke="var(--primary)" strokeWidth={2} fill="url(#eq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Trade Exit" right={<Pill tone="warn"><X className="size-3" /> Square Off</Pill>} />
          <Field label="Position"><input value={exitSymbol} onChange={(e) => setExitSymbol(e.target.value)} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Field label="Quantity"><input type="number" value={exitQty} onChange={(e) => setExitQty(+e.target.value)} className={inputCls} /></Field>
            <Field label="Exit Price"><input type="number" value={exitPrice} onChange={(e) => setExitPrice(+e.target.value)} className={inputCls} /></Field>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-surface/40 border border-border/30 space-y-1.5 text-xs">
            <Row k="Avg Entry" v={`₹${inr(2918.40)}`} />
            <Row k="Exit Price" v={`₹${inr(exitPrice)}`} />
            <Row k="Quantity" v={exitQty.toString()} />
            <Row k="Est. P&L" v={fmtPnl((exitPrice - 2918.40) * exitQty)} tone={exitPrice >= 2918.40 ? "bull" : "bear"} />
          </div>
          <button className="w-full mt-3 py-2.5 rounded-lg font-bold text-sm bg-warning text-background">Close Position</button>
        </GlassCard>
      </div>

      {/* Daily / Weekly / Monthly P&L */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <PnlChart title="Daily P&L" subtitle="This week" total={dayTotal} data={dailyPnl} xKey="d" />
        <PnlChart title="Weekly P&L" subtitle="This month" total={weekTotal} data={weeklyPnl} xKey="w" />
        <PnlChart title="Monthly P&L" subtitle="YTD" total={monthTotal} data={monthlyPnl} xKey="m" />
      </div>

      {/* Open Positions */}
      <GlassCard className="p-0 overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Open Positions</h3>
            <p className="text-[11px] text-muted-foreground">Live mark-to-market on virtual capital</p>
          </div>
          <Pill tone="info">{positions.length} active</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/40 bg-surface/40">
              <tr>
                <Th>Symbol</Th><Th>Side</Th><Th right>Qty</Th><Th right>Entry</Th><Th right>LTP</Th>
                <Th right>Stop Loss</Th><Th right>Target</Th><Th right>P&L</Th><Th right>P&L %</Th><Th right>R:R</Th><Th center>Action</Th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => {
                const sl = +(p.avgPrice * 0.985).toFixed(2);
                const tgt = +(p.avgPrice * 1.03).toFixed(2);
                const rr = ((tgt - p.avgPrice) / Math.max(0.01, p.avgPrice - sl)).toFixed(2);
                return (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-surface/40">
                    <td className="px-4 py-3 font-semibold">{p.symbol}</td>
                    <td className="px-4 py-3"><Pill tone={p.type === "LONG" ? "bull" : "bear"}>{p.type} • {p.instrument}</Pill></td>
                    <td className="px-4 py-3 text-right font-mono">{p.qty}</td>
                    <td className="px-4 py-3 text-right font-mono">{inr(p.avgPrice)}</td>
                    <td className="px-4 py-3 text-right font-mono">{inr(p.ltp)}</td>
                    <td className="px-4 py-3 text-right font-mono text-bear">{inr(sl)}</td>
                    <td className="px-4 py-3 text-right font-mono text-bull">{inr(tgt)}</td>
                    <td className={cn("px-4 py-3 text-right font-mono font-semibold", p.pnl >= 0 ? "text-bull" : "text-bear")}>{fmtPnl(p.pnl)}</td>
                    <td className={cn("px-4 py-3 text-right font-mono", p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-right font-mono">1:{rr}</td>
                    <td className="px-4 py-3 text-center"><button className="text-[11px] px-2.5 py-1 rounded bg-bear/15 text-bear border border-bear/30 hover:bg-bear/25">Exit</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Closed Positions */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Closed Positions</h3>
            <p className="text-[11px] text-muted-foreground">Realized trades — entry, exit, P&L and R:R</p>
          </div>
          <Pill tone={closedPnl >= 0 ? "bull" : "bear"}>Net {fmtPnl(closedPnl)}</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/40 bg-surface/40">
              <tr>
                <Th>Symbol</Th><Th>Side</Th><Th right>Qty</Th><Th right>Entry</Th><Th right>Exit</Th>
                <Th right>Stop Loss</Th><Th right>Target</Th><Th right>P&L</Th><Th right>P&L %</Th><Th right>R:R</Th><Th>Closed</Th>
              </tr>
            </thead>
            <tbody>
              {closedPositions.map((p) => {
                const sl = +(p.avgPrice * 0.985).toFixed(2);
                const tgt = +(p.avgPrice * 1.03).toFixed(2);
                const rr = ((tgt - p.avgPrice) / Math.max(0.01, p.avgPrice - sl)).toFixed(2);
                return (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-surface/40">
                    <td className="px-4 py-3 font-semibold">{p.symbol}</td>
                    <td className="px-4 py-3"><Pill tone={p.type === "LONG" ? "bull" : "bear"}>{p.type} • {p.instrument}</Pill></td>
                    <td className="px-4 py-3 text-right font-mono">{p.qty}</td>
                    <td className="px-4 py-3 text-right font-mono">{inr(p.avgPrice)}</td>
                    <td className="px-4 py-3 text-right font-mono">{inr(p.ltp)}</td>
                    <td className="px-4 py-3 text-right font-mono text-bear">{inr(sl)}</td>
                    <td className="px-4 py-3 text-right font-mono text-bull">{inr(tgt)}</td>
                    <td className={cn("px-4 py-3 text-right font-mono font-semibold", p.pnl >= 0 ? "text-bull" : "text-bear")}>{fmtPnl(p.pnl)}</td>
                    <td className={cn("px-4 py-3 text-right font-mono", p.pnl >= 0 ? "text-bull" : "text-bear")}>{p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-right font-mono">1:{rr}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.openedAt}</td>
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

/* ---------- helpers ---------- */
const inputCls = "w-full mt-1 bg-input/40 border border-border/60 rounded-lg px-3 py-2 font-mono text-sm outline-none focus:border-primary/60";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Th({ children, right, center }: { children: React.ReactNode; right?: boolean; center?: boolean }) {
  return <th className={cn("px-4 py-3 font-medium", right && "text-right", center && "text-center", !right && !center && "text-left")}>{children}</th>;
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "bull" | "bear" }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={cn("font-mono font-semibold", tone === "bull" && "text-bull", tone === "bear" && "text-bear")}>{v}</span>
    </div>
  );
}

function KPI({ label, value, tone, delta }: { label: string; value: string; tone: "bull" | "bear" | "neutral" | "info" | "warn"; delta?: string }) {
  const toneCls = {
    bull: "text-bull", bear: "text-bear", neutral: "text-foreground", info: "text-accent", warn: "text-warning",
  }[tone];
  return (
    <GlassCard className="p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("font-mono text-xl font-semibold mt-1", toneCls)}>{value}</div>
      {delta && <div className="text-[11px] text-muted-foreground mt-0.5">{delta}</div>}
    </GlassCard>
  );
}

function Metric({ label, value, tone, big }: { label: string; value: string; tone: "bull" | "bear" | "neutral" | "accent" | "warn"; big?: boolean }) {
  const toneCls = {
    bull: "text-bull", bear: "text-bear", neutral: "text-foreground", accent: "text-accent", warn: "text-warning",
  }[tone];
  return (
    <div className="p-3 rounded-lg bg-surface/40 border border-border/30">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("font-mono font-semibold mt-1", big ? "text-xl" : "text-sm", toneCls)}>{value}</div>
    </div>
  );
}

function PnlChart({ title, subtitle, total, data, xKey }: { title: string; subtitle: string; total: number; data: Array<Record<string, number | string>>; xKey: string }) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className={cn("font-mono text-lg font-bold flex items-center gap-1", total >= 0 ? "text-bull" : "text-bear")}>
          {total >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          {fmtPnl(total)}
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
            <XAxis dataKey={xKey} stroke="var(--muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
            <ReferenceLine y={0} stroke="var(--border)" />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={(d.pnl as number) >= 0 ? "var(--bull)" : "var(--bear)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function fmtPnl(n: number) {
  return `${n >= 0 ? "+" : "-"}₹${inr(Math.abs(n))}`;
}
