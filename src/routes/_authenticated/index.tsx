import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { indices, topGainers, topLosers, mostActive, sentiment, equityCurve, inr, news } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowDown, ArrowUp, Flame, Activity, Newspaper } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [
    { title: "Dashboard — TradePilot AI" },
    { name: "description", content: "Live NIFTY, BANKNIFTY, FINNIFTY, SENSEX dashboard with market breadth, sentiment, top movers and AI insights." },
  ]}),
  component: Dashboard,
});

function IndexCard({ idx }: { idx: typeof indices[number] }) {
  const up = idx.change >= 0;
  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 size-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
           style={{ background: up ? "var(--bull)" : "var(--bear)" }} />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{idx.name}</div>
          <div className="font-mono text-2xl md:text-3xl font-bold mt-1.5">{inr(idx.ltp)}</div>
          <div className={"flex items-center gap-1 mt-1 text-sm font-medium " + (up ? "text-bull" : "text-bear")}>
            {up ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
            {up ? "+" : ""}{idx.change.toFixed(2)} ({up ? "+" : ""}{idx.changePct.toFixed(2)}%)
          </div>
        </div>
        <Pill tone={up ? "bull" : "bear"}>{idx.symbol}</Pill>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/40 text-xs">
        <div><div className="text-muted-foreground">Open</div><div className="font-mono mt-0.5">{inr(idx.open)}</div></div>
        <div><div className="text-muted-foreground">High</div><div className="font-mono mt-0.5 text-bull">{inr(idx.high)}</div></div>
        <div><div className="text-muted-foreground">Low</div><div className="font-mono mt-0.5 text-bear">{inr(idx.low)}</div></div>
      </div>
    </GlassCard>
  );
}

function Dashboard() {
  const sentLabel = sentiment.score >= 75 ? "Strong Bullish" : sentiment.score >= 55 ? "Bullish" : sentiment.score >= 45 ? "Neutral" : sentiment.score >= 25 ? "Bearish" : "Strong Bearish";
  const sentTone = sentiment.score >= 55 ? "bull" : sentiment.score >= 45 ? "neutral" : "bear";
  return (
    <AppShell>
      <PageHeader
        title="Market Command Center"
        subtitle="Real-time pulse of Indian indices, breadth, sentiment and AI-driven opportunities."
        actions={<Pill tone="info"><Activity className="size-3" /> Live</Pill>}
      />

      {/* Ticker */}
      <div className="glass-panel rounded-xl overflow-hidden mb-6">
        <div className="flex gap-8 py-2.5 px-4 overflow-x-auto whitespace-nowrap text-xs font-mono">
          {[...indices, ...indices].map((i, k) => (
            <span key={k} className="inline-flex items-center gap-2">
              <span className="text-muted-foreground">{i.symbol}</span>
              <span className="font-semibold">{inr(i.ltp)}</span>
              <span className={i.change >= 0 ? "text-bull" : "text-bear"}>{i.change >= 0 ? "▲" : "▼"} {i.changePct.toFixed(2)}%</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {indices.map((i) => <IndexCard key={i.symbol} idx={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <GlassCard className="lg:col-span-2">
          <SectionTitle title="NIFTY 50 — Intraday" subtitle="1-minute chart (sample data)" right={<Pill tone="bull">+0.58%</Pill>} />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--bull)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--bull)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={["dataMin - 500", "dataMax + 500"]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="equity" stroke="var(--bull)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle title="Market Sentiment" />
          <div className="flex flex-col items-center">
            <div className="relative size-44">
              <svg viewBox="0 0 200 120" className="w-full">
                <defs>
                  <linearGradient id="gauge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--bear)" />
                    <stop offset="50%" stopColor="var(--warning)" />
                    <stop offset="100%" stopColor="var(--bull)" />
                  </linearGradient>
                </defs>
                <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="16" strokeLinecap="round" />
                <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="url(#gauge)" strokeWidth="16" strokeLinecap="round"
                  strokeDasharray={`${sentiment.score * 2.51} 999`} />
                <text x="100" y="95" textAnchor="middle" className="fill-foreground font-mono" fontSize="28" fontWeight="700">{sentiment.score}</text>
              </svg>
            </div>
            <Pill tone={sentTone as "bull" | "bear" | "neutral"} className="text-xs"><Flame className="size-3" /> {sentLabel}</Pill>
            <div className="grid grid-cols-3 gap-3 w-full mt-4 text-center text-xs">
              <div><div className="text-bull font-mono font-semibold">{sentiment.advances}</div><div className="text-muted-foreground">Advances</div></div>
              <div><div className="text-bear font-mono font-semibold">{sentiment.declines}</div><div className="text-muted-foreground">Declines</div></div>
              <div><div className="font-mono font-semibold">{sentiment.unchanged}</div><div className="text-muted-foreground">Unchanged</div></div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <MoversCard title="Top Gainers" tone="bull" rows={topGainers} />
        <MoversCard title="Top Losers" tone="bear" rows={topLosers} />
        <MoversCard title="Most Active" tone="neutral" rows={mostActive} showVol />
      </div>

      <GlassCard>
        <SectionTitle title="News Intelligence" subtitle="Curated headlines with AI sentiment tagging" right={<Pill tone="info"><Newspaper className="size-3" /> {news.length} items</Pill>} />
        <div className="grid md:grid-cols-2 gap-3">
          {news.slice(0, 4).map((n) => (
            <div key={n.id} className="rounded-lg border border-border/50 bg-surface/40 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Pill tone={n.sentiment === "Positive" ? "bull" : n.sentiment === "Negative" ? "bear" : "neutral"}>{n.sentiment}</Pill>
                <span>{n.source}</span><span>•</span><span>{n.time}</span>
              </div>
              <div className="font-medium mt-2 text-sm leading-snug">{n.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{n.summary}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      
    </AppShell>
  );
}

function MoversCard({ title, rows, tone, showVol }: { title: string; rows: typeof topGainers; tone: "bull" | "bear" | "neutral"; showVol?: boolean }) {
  return (
    <GlassCard>
      <SectionTitle title={title} />
      <div className="space-y-2">
        {rows.map((s) => (
          <div key={s.symbol} className="flex items-center justify-between text-sm py-1.5 border-b border-border/30 last:border-0">
            <div>
              <div className="font-semibold">{s.symbol}</div>
              <div className="text-[11px] text-muted-foreground">{s.sector}</div>
            </div>
            <div className="text-right">
              <div className="font-mono">{inr(s.ltp)}</div>
              {showVol ? (
                <div className="text-[11px] text-muted-foreground font-mono">Vol {(s.volume/1e6).toFixed(2)}M</div>
              ) : (
                <div className={"text-xs font-medium " + (tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "text-muted-foreground")}>
                  {s.changePct > 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
