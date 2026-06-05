import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Radar, LineChart, Sparkles, Wallet, Briefcase,
  BookOpen, Newspaper, ShieldAlert, Settings, TrendingUp, Search,
} from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/scanner", label: "Market Scanner", icon: Radar },
  { to: "/options", label: "Options Analysis", icon: LineChart },
  { to: "/signals", label: "AI Signals", icon: Sparkles },
  { to: "/paper-trading", label: "Paper Trading", icon: Wallet },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/journal", label: "Trade Journal", icon: BookOpen },
  { to: "/news", label: "News Intelligence", icon: Newspaper },
  { to: "/risk", label: "Risk Management", icon: ShieldAlert },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center glow-pulse">
            <TrendingUp className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-base leading-none">TradePilot <span className="text-primary">AI</span></div>
            <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">Paper Trading</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {items.map((it) => {
            const active = path === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all " +
                  (active
                    ? "bg-gradient-to-r from-primary/15 to-accent/10 text-foreground border border-primary/20 shadow-[0_0_20px_-8px_var(--glow)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60")
                }
              >
                <Icon className="size-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="glass-card p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Virtual Capital</div>
            <div className="font-mono text-lg font-semibold text-primary mt-0.5">₹1,02,470</div>
            <div className="text-xs text-bull mt-0.5">+₹2,470 (2.47%)</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 glass-panel border-b border-border/40">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            <div className="md:hidden font-bold">TP<span className="text-primary">AI</span></div>
            <div className="flex-1 max-w-md relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search NIFTY, BANKNIFTY, RELIANCE…"
                className="w-full bg-input/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-md bg-bull/15 text-bull font-medium flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-bull animate-pulse" /> MARKET OPEN
              </span>
              <span className="font-mono text-muted-foreground">NSE • {new Date().toLocaleTimeString("en-IN", { hour12: false })}</span>
            </div>
            <div className="size-9 rounded-full bg-gradient-to-br from-accent to-primary grid place-items-center text-sm font-semibold text-primary-foreground">RT</div>
          </div>
          {/* Mobile nav */}
          <div className="md:hidden overflow-x-auto border-t border-border/40">
            <div className="flex gap-1 px-2 py-2 min-w-max">
              {items.map((it) => {
                const active = path === it.to;
                return (
                  <Link key={it.to} to={it.to} className={"text-xs px-3 py-1.5 rounded-md whitespace-nowrap " + (active ? "bg-primary/15 text-primary" : "text-muted-foreground")}>
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
