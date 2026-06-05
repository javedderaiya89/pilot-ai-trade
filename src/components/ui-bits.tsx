import { cn } from "@/lib/utils";

export function GlassCard({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-card p-5", className)} {...p}>{children}</div>;
}

export function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">TradePilot AI</div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Pill({ tone = "neutral", children, className }: { tone?: "bull" | "bear" | "neutral" | "warn" | "info"; children: React.ReactNode; className?: string }) {
  const map = {
    bull: "bg-bull/15 text-bull border-bull/30",
    bear: "bg-bear/15 text-bear border-bear/30",
    neutral: "bg-muted text-muted-foreground border-border",
    warn: "bg-warning/15 text-warning border-warning/30",
    info: "bg-accent/15 text-accent border-accent/30",
  } as const;
  return <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border", map[tone], className)}>{children}</span>;
}

export function Stat({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: "bull" | "bear" }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-mono text-xl md:text-2xl font-semibold mt-1">{value}</div>
      {delta && <div className={cn("text-xs mt-0.5 font-medium", tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "text-muted-foreground")}>{delta}</div>}
    </div>
  );
}
