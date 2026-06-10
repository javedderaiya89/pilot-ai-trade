import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp, Sparkles, Radar, Wallet, Activity, Newspaper,
  ShieldAlert, ArrowRight, Check, Star, Mail, ChevronDown, BarChart3,
  Zap, Target, LineChart, Filter, Layers, Crown, Trophy, TrendingDown,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/landing")({
  head: () => ({ meta: [
    { title: "TradePilot AI — AI-powered Indian market intelligence" },
    { name: "description", content: "AI signals, market scanner, paper trading and verified accuracy — one premium fintech terminal built for Indian markets." },
    { property: "og:title", content: "TradePilot AI — AI trading terminal for Indian markets" },
    { property: "og:description", content: "Trade smarter with AI signals, market scanner, paper trading and live accuracy tracking." },
  ]}),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <AISignals />
      <MarketScanner />
      <PaperTrading />
      <SignalPerformance />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border/40">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/landing" className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center glow-pulse">
            <TrendingUp className="size-5 text-primary-foreground" />
          </div>
          <div className="font-bold tracking-tight">TradePilot <span className="text-primary">AI</span></div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#signals" className="hover:text-foreground">Signals</a>
          <a href="#scanner" className="hover:text-foreground">Scanner</a>
          <a href="#performance" className="hover:text-foreground">Performance</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="text-sm px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground">Login</Link>
          <Link to="/auth" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center gap-1.5">
            Start Free Trial <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden grid-bg">
      <div className="max-w-7xl mx-auto px-5 py-24 md:py-32 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs text-muted-foreground mb-6">
          <span className="size-1.5 rounded-full bg-bull animate-pulse" />
          Built for NSE & BSE — Powered by AI
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          The AI co-pilot for <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Indian markets</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Signals, scanner, paper trading and verified accuracy — one premium terminal for serious retail traders.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/auth" className="h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold inline-flex items-center gap-2 glow-pulse">
            Start Free Trial <ArrowRight className="size-4" />
          </Link>
          <Link to="/auth" className="h-11 px-6 rounded-lg border border-border text-foreground font-medium inline-flex items-center gap-2 hover:bg-sidebar-accent/60">
            Login
          </Link>
        </div>

        <div className="mt-16 max-w-5xl mx-auto glass-card p-2 rounded-2xl">
          <div className="rounded-xl bg-background/60 p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { k: "Signals/day", v: "40+" },
              { k: "Avg accuracy", v: "72%" },
              { k: "Avg R:R", v: "1:2.3" },
              { k: "Tracked symbols", v: "500+" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-mono text-2xl md:text-3xl font-bold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">{s.v}</div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const featureList = [
  { icon: Sparkles, t: "AI Signals", d: "BUY/SELL calls with entry, SL and 3 targets." },
  { icon: Radar, t: "Market Scanner", d: "Real-time technical & momentum scans." },
  { icon: Wallet, t: "Paper Trading", d: "Prop-desk simulator with auto sizing." },
  { icon: Activity, t: "Accuracy Tracking", d: "Verified accuracy, R:R and win rate." },
  { icon: Newspaper, t: "News Intelligence", d: "Impact-tagged market headlines." },
  { icon: BarChart3, t: "Options Analysis", d: "OI, Greeks and PCR at a glance." },
  { icon: ShieldAlert, t: "Risk Management", d: "Per-trade risk and exposure control." },
  { icon: Zap, t: "Real-time Alerts", d: "Push, email and in-app notifications." },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary">Everything you need</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">A complete trading workstation</h2>
          <p className="text-muted-foreground mt-3">Built from the ground up for Indian markets — indices, stocks, options and commodities.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {featureList.map((f) => (
            <div key={f.t} className="glass-card p-5 rounded-xl hover:border-primary/40 transition-colors">
              <div className="size-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center text-primary mb-4">
                <f.icon className="size-5" />
              </div>
              <div className="font-semibold">{f.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionShell({ id, eyebrow, icon, tone, title, body, bullets, reverse, preview }: {
  id: string; eyebrow: string; icon: React.ReactNode; tone: "primary" | "accent";
  title: string; body: string; bullets: string[]; reverse?: boolean; preview: React.ReactNode;
}) {
  return (
    <section id={id} className="py-20">
      <div className={"max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center " + (reverse ? "md:[&>*:first-child]:order-2" : "")}>
        <div>
          <div className={"inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-widest " + (tone === "primary" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent")}>
            {icon} {eyebrow}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">{title}</h3>
          <p className="text-muted-foreground mt-3 text-base">{body}</p>
          <ul className="mt-6 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm">
                <span className={"size-5 rounded-full grid place-items-center " + (tone === "primary" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent")}>
                  <Check className="size-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-2 rounded-2xl">
          <div className="rounded-xl bg-background/60 p-5 relative overflow-hidden grid-bg">
            <div className="absolute -right-16 -top-16 size-60 rounded-full blur-3xl opacity-25"
                 style={{ background: tone === "primary" ? "var(--primary)" : "var(--accent)" }} />
            <div className="relative">{preview}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketScanner() {
  const rows = [
    { s: "RELIANCE", ch: "+2.41%", v: "3.2x", tag: "Breakout" },
    { s: "HDFCBANK", ch: "+1.08%", v: "2.1x", tag: "Volume" },
    { s: "TATAMOTORS", ch: "-1.62%", v: "1.8x", tag: "Reversal" },
    { s: "INFY", ch: "+0.94%", v: "1.4x", tag: "Momentum" },
  ];
  return (
    <SectionShell
      id="scanner"
      eyebrow="Market Scanner"
      icon={<Radar className="size-3.5" />}
      tone="accent"
      title="Institutional-grade scanner across 500+ symbols"
      body="Surface unusual volume, breakouts, momentum bursts and reversals the moment they print."
      bullets={["Multi-factor filters", "Live volume & price action", "Custom watchlists"]}
      preview={
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Filter className="size-3" /> Live scan • NSE
          </div>
          {rows.map((r) => (
            <div key={r.s} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-background/60 border border-border/40">
              <div className="font-mono text-sm font-semibold">{r.s}</div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Vol {r.v}</span>
                <span className={r.ch.startsWith("+") ? "text-bull" : "text-bear"}>{r.ch}</span>
                <span className="px-2 py-0.5 rounded bg-accent/15 text-accent">{r.tag}</span>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}

function AISignals() {
  return (
    <SectionShell
      id="signals"
      eyebrow="AI Signals"
      icon={<Sparkles className="size-3.5" />}
      tone="primary"
      title="Conviction-scored BUY / SELL calls, every session"
      body="Entry, stop loss, three targets and a confidence score — for NIFTY, BANKNIFTY, FINNIFTY and 200+ stocks."
      bullets={["Risk:Reward on every call", "Filter by segment & side", "Outcome logged automatically"]}
      reverse
      preview={
        <div className="space-y-3">
          <div className="rounded-lg bg-background/70 border border-border/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">BANKNIFTY</div>
                <div className="font-mono font-bold text-lg">48,210</div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-bull/15 text-bull text-xs font-semibold">BUY</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4 text-center text-[10px]">
              {[["Entry","48,210"],["SL","47,980"],["T1","48,420"],["T2","48,680"]].map(([k,v]) => (
                <div key={k} className="rounded-md bg-surface/60 py-2">
                  <div className="text-muted-foreground uppercase tracking-widest">{k}</div>
                  <div className="font-mono font-semibold mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-muted-foreground">Confidence</span>
              <span className="text-primary font-semibold">86%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Target className="size-3.5 text-primary" /> R:R 1:2.4</div>
            <div>Generated 09:24 IST</div>
          </div>
        </div>
      }
    />
  );
}

function PaperTrading() {
  return (
    <SectionShell
      id="paper"
      eyebrow="Paper Trading"
      icon={<Wallet className="size-3.5" />}
      tone="accent"
      title="A prop-desk simulator — without the risk"
      body="Virtual capital, auto position sizing and a full equity curve. Build the habits before risking real money."
      bullets={["Auto qty from risk %", "Open & closed positions", "Daily / weekly / monthly P&L"]}
      preview={
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[["Capital","₹5.0L"],["Equity","₹5.42L"],["P&L","+₹42,180"]].map(([k,v]) => (
              <div key={k} className="rounded-md bg-background/70 border border-border/40 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
                <div className="font-mono font-semibold mt-1 text-sm">{v}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-background/70 border border-border/40 p-4 h-32 relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <LineChart className="size-3" /> Equity curve
            </div>
            <svg viewBox="0 0 200 60" className="w-full h-20 mt-1">
              <defs>
                <linearGradient id="eq" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,45 L25,40 L50,42 L75,32 L100,28 L125,30 L150,18 L175,14 L200,8 L200,60 L0,60 Z" fill="url(#eq)" />
              <path d="M0,45 L25,40 L50,42 L75,32 L100,28 L125,30 L150,18 L175,14 L200,8" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      }
    />
  );
}

function Testimonials() {
  const items = [
    { n: "Arjun S.", r: "Swing Trader, Mumbai", q: "The accuracy tracker convinced me. I follow the high-confidence setups and my win rate has jumped." },
    { n: "Priya K.", r: "Options Trader, Bengaluru", q: "Paper trading with auto-sizing rebuilt my discipline. Now I never break my risk rules." },
    { n: "Rohan M.", r: "Full-time trader, Pune", q: "It feels like a hedge-fund terminal — premium, fast and built for Indian markets." },
  ];
  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-surface/40 to-transparent">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary">Loved by traders</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">Built for serious retail traders</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {items.map((t) => (
            <div key={t.n} className="glass-card p-6 rounded-xl">
              <div className="flex gap-0.5 text-primary mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <p className="text-sm leading-relaxed">"{t.q}"</p>
              <div className="mt-4 pt-4 border-t border-border/40">
                <div className="text-sm font-semibold">{t.n}</div>
                <div className="text-xs text-muted-foreground">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is this real trading or paper trading?", a: "TradePilot AI is a research, signals and paper trading platform. Real broker execution is on the roadmap via broker connections." },
    { q: "Which markets are supported?", a: "NSE & BSE — NIFTY, BANKNIFTY, FINNIFTY, SENSEX indices, F&O and 500+ stocks. Gold & silver desks included." },
    { q: "How accurate are the AI signals?", a: "Every signal is logged with outcome. Track verified accuracy in the Signal Performance Center — no cherry-picking." },
    { q: "Do you offer a free trial?", a: "Yes, you can sign up and explore all modules. The Pro plan unlocks unlimited signals and full history." },
    { q: "Can I connect my broker?", a: "Broker connection cards for Angel One, Zerodha and Upstox are available with live integrations rolling out." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary">FAQ</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">Frequently asked questions</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="glass-card rounded-xl">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left">
                <span className="font-medium text-sm">{f.q}</span>
                <ChevronDown className={"size-4 text-muted-foreground transition-transform " + (open === i ? "rotate-180" : "")} />
              </button>
              {open === i && <div className="px-5 pb-4 text-sm text-muted-foreground">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const features = [
    "Unlimited AI signals across indices & stocks",
    "Full market scanner with custom filters",
    "Paper trading with auto position sizing",
    "Verified accuracy & performance analytics",
    "News & options intelligence",
    "Broker connection (Angel One, Zerodha, Upstox)",
    "Priority email & in-app support",
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary">Pricing</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">One plan. Every module unlocked.</h2>
          <p className="text-muted-foreground mt-3">No tiers, no upsells. Get the full TradePilot AI terminal.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-5 gap-6 items-stretch">
          <div className="md:col-span-3 glass-card p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 size-72 rounded-full blur-3xl opacity-25" style={{ background: "var(--primary)" }} />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Crown className="size-4 text-primary" />
                <div className="text-[11px] uppercase tracking-[0.2em] text-primary">TradePilot AI Pro</div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-5xl font-bold">₹1,499</span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Billed monthly. Cancel anytime.</div>
              <ul className="mt-7 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="size-5 rounded-full grid place-items-center bg-primary/15 text-primary">
                      <Check className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="mt-8 h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold inline-flex items-center gap-2">
                Start Free Trial <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 grid gap-4">
            {[
              { i: Layers, t: "Every module", d: "Signals, scanner, paper trading, accuracy and research — included." },
              { i: ShieldAlert, t: "Risk-first", d: "Per-trade risk %, exposure caps and audit logs." },
              { i: Zap, t: "Cancel anytime", d: "No contracts, prorated to the day." },
            ].map((c) => (
              <div key={c.t} className="glass-card p-5 rounded-xl">
                <div className="size-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center text-primary mb-3">
                  <c.i className="size-4" />
                </div>
                <div className="font-semibold text-sm">{c.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="max-w-4xl mx-auto px-5">
        <div className="glass-card p-10 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute -right-20 -top-20 size-72 rounded-full blur-3xl opacity-25" style={{ background: "var(--primary)" }} />
          <div className="absolute -left-20 -bottom-20 size-72 rounded-full blur-3xl opacity-20" style={{ background: "var(--accent)" }} />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary">Get in touch</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">Talk to the team</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Questions about features, pricing or enterprise access? We respond within one business day.</p>
            <a href="mailto:hello@tradepilotai.app" className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
              <Mail className="size-4" /> hello@tradepilotai.app
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-5 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center">
            <TrendingUp className="size-3.5 text-primary-foreground" />
          </div>
          <span>© {new Date().getFullYear()} TradePilot AI. For educational use — not investment advice.</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
          <Link to="/auth" className="hover:text-foreground">Login</Link>
        </div>
      </div>
    </footer>
  );
}
