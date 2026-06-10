import { cn } from "@/lib/utils";

export type MarketSegment = "All" | "Equity" | "Commodities" | "Metals";
export const MARKET_SEGMENTS: MarketSegment[] = ["All", "Equity", "Commodities", "Metals"];

export function SegmentTabs({
  value,
  onChange,
  className,
  segments = MARKET_SEGMENTS,
}: {
  value: MarketSegment;
  onChange: (s: MarketSegment) => void;
  className?: string;
  segments?: MarketSegment[];
}) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1 p-1 rounded-lg border border-border/60 bg-surface/40 backdrop-blur",
        className,
      )}
      role="tablist"
      aria-label="Market segment"
    >
      {segments.map((s) => (
        <button
          key={s}
          role="tab"
          aria-selected={value === s}
          onClick={() => onChange(s)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
            value === s
              ? "bg-primary/20 text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
