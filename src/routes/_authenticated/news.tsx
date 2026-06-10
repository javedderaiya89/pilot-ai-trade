import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill } from "@/components/ui-bits";
import { SegmentTabs, type MarketSegment } from "@/components/segment-tabs";
import { news, commodityNews, type NewsItem } from "@/lib/mock-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/news")({
  head: () => ({ meta: [{ title: "News Intelligence — TradePilot AI" }] }),
  component: News,
});

const ALL: NewsItem[] = [
  ...news.map((n) => ({ ...n, segment: "Equity" as MarketSegment })),
  ...commodityNews,
];

const CATS = ["All", "Global", "Indian", "Company", "Sector", "Commodity", "MCX", "Metals", "Energy"] as const;
type Cat = typeof CATS[number];

function News() {
  const [segment, setSegment] = useState<MarketSegment>("All");
  const [cat, setCat] = useState<Cat>("All");

  const rows = useMemo(() => ALL.filter((n) => {
    if (segment !== "All" && (n.segment ?? "Equity") !== segment) return false;
    if (cat !== "All" && n.category !== cat) return false;
    return true;
  }), [segment, cat]);

  return (
    <AppShell>
      <PageHeader
        title="News Intelligence"
        subtitle="AI-classified market news from global and Indian sources covering Equity, Commodity, MCX, Metals and Energy markets — with sentiment tagging and impacted symbols."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SegmentTabs value={segment} onChange={(v) => { setSegment(v); setCat("All"); }} />
        <Pill tone="info">{rows.length} headlines</Pill>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={"px-3 py-1.5 rounded-lg text-sm font-medium border " +
              (cat === c ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-muted-foreground hover:text-foreground")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rows.map((n) => (
          <GlassCard key={n.id}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex-wrap">
              <Pill tone={n.sentiment === "Positive" ? "bull" : n.sentiment === "Negative" ? "bear" : "neutral"}>{n.sentiment}</Pill>
              <Pill tone="info">{n.category}</Pill>
              {n.segment && n.segment !== "Equity" && <Pill tone="warn">{n.segment}</Pill>}
              <span className="ml-auto">{n.source} • {n.time}</span>
            </div>
            <h3 className="font-semibold leading-snug">{n.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{n.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {n.symbols.map((s) => <Pill key={s} tone="neutral">{s}</Pill>)}
            </div>
          </GlassCard>
        ))}
        {rows.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-12">No headlines for this filter.</div>
        )}
      </div>
    </AppShell>
  );
}
