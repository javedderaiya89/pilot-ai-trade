import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { GlassCard, PageHeader, Pill, SectionTitle } from "@/components/ui-bits";
import { news } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "News Intelligence — TradePilot AI" }] }),
  component: News,
});

const cats = ["All", "Global", "Indian", "Company", "Sector"] as const;
function News() {
  const [cat, setCat] = useState<typeof cats[number]>("All");
  const rows = news.filter((n) => cat === "All" ? true : n.category === cat);
  return (
    <AppShell>
      <PageHeader title="News Intelligence" subtitle="AI-classified market news from global and Indian sources with sentiment tagging and impacted symbols." />

      <div className="flex flex-wrap gap-2 mb-4">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={"px-3 py-1.5 rounded-lg text-sm font-medium border " + (cat === c ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-muted-foreground")}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rows.map((n) => (
          <GlassCard key={n.id}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              <Pill tone={n.sentiment === "Positive" ? "bull" : n.sentiment === "Negative" ? "bear" : "neutral"}>{n.sentiment}</Pill>
              <Pill tone="info">{n.category}</Pill>
              <span className="ml-auto">{n.source} • {n.time}</span>
            </div>
            <h3 className="font-semibold leading-snug">{n.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{n.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {n.symbols.map((s) => <Pill key={s} tone="neutral">{s}</Pill>)}
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
