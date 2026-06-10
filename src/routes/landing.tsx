import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp, Sparkles, Radar, FlaskConical, Wallet, Activity, Newspaper,
  ShieldAlert, ArrowRight, Check, Star, Mail, ChevronDown, BarChart3,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/landing")({
  head: () => ({ meta: [
    { title: "Niftex Pilot — AI-powered Indian market intelligence" },
    { name: "description", content: "AI signals, market scanner, options analytics, paper trading and signal performance — all in one premium fintech terminal for Indian markets." },
    { property: "og:title", content: "Niftex Pilot — AI trading terminal for Indian markets" },
    { property: "og:description", content: "Trade smarter with AI signals, research center, paper trading and live accuracy tracking." },
  ]}),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <Showcase
        eyebrow="AI Signals"
        title="Conviction-scored signals, every session"
        body="Get BUY/SELL calls for NIFTY, BANKNIFTY, FINNIFTY and 200+ stocks with entry, three targets, stop loss and confidence score."
        bullets={["Entry, SL, T1/T2/T3", "Risk:Reward on every call", "Filter by segment & side"]}
        tone="primary"
        icon={<Sparkles className="size-5" />}
      />
      <Showcase
        eyebrow="Research Center"
        title="Institutional-grade scanner & news intelligence"
        body="Surface unusual volume, breakouts, options flow and macro headlines that actually move price."
        bullets={["Multi-factor market scanner", "Curated news with impact tags", "Gold & silver dedicated desk"]}
        tone="accent"
        icon={<Radar className="size-5" />}
        reverse
      />
      <Showcase
        eyebrow="Paper Trading"
        title="A prop-desk simulator — without the risk"
        body="Virtual capital, auto position sizing, equity curve and full P&L analytics. Build the habits before risking real money."
        bullets={["Auto qty from risk %", "Open & closed positions", "Daily / weekly / monthly P&L"]}
        tone="primary"
        icon={<Wallet className="size-5" />}
      />
      <Showcase
        eyebrow="Accuracy Tracking"
        title="See the edge before you trade it"
        body="Every signal logged. Every outcome scored. Verified accuracy %, win rate and average R:R — fully transparent."
        bullets={["Cumulative accuracy chart", "Win / loss distribution", "Monthly performance breakdown"]}
        tone="accent"
        icon={<Activity className="size-5" />}
        reverse
      />
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
          <div className="font-bold tracking-tight">Niftex <span className="text-primary">Pilot</span></div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
          <Link to="/subscription" className="hover:text-foreground">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="text-sm px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link to="/auth" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center gap-1.5">
            Get started <ArrowRight className="size-3.5" />
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
          Signals, scanner, research, paper trading and verified accuracy — one premium terminal for serious retail traders.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/auth" className="h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold inline-flex items-center gap-2 glow-pulse">
            Start free <ArrowRight className="size-4" />
          </Link>
          <Link to="/subscription" className="h-11 px-6 rounded-lg border border-border text-foreground font-medium inline-flex items-center gap-2 hover:bg-sidebar-accent/60">
            View pricing
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
  { icon: FlaskConical, t: "Research Center", d: "Curated setups across indices and stocks." },
  { icon: Wallet, t: "Paper Trading", d: "Prop-desk simulator with auto sizing." },
  { icon: Newspaper, t: "News Intelligence", d: "Impact-tagged market headlines." },
  { icon: BarChart3, t: "Options Analysis", d: "OI, Greeks and PCR at a glance." },
  { icon: ShieldAlert, t: "Risk Management", d: "Per-trade risk and exposure control." },
  { icon: Activity, t: "Signal Performance", d: "Verified accuracy, R:R and win rate." },
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

function Showcase({ eyebrow, title, body, bullets, tone, icon, reverse }: {
  eyebrow: string; title: string; body: string; bullets: string[];
  tone: "primary" | "accent"; icon: React.ReactNode; reverse?: boolean;
}) {
  return (
    <section className="py-20">
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
          <div className="rounded-xl bg-background/60 p-6 h-72 grid-bg relative overflow-hidden">
            <div className="absolute -right-16 -top-16 size-60 rounded-full blur-3xl opacity-30"
                 style={{ background: tone === "primary" ? "var(--primary)" : "var(--accent)" }} />
            <div className="relative h-full grid place-items-center text-muted-foreground">
              <div className="text-center">
                <div className="font-mono text-5xl font-bold text-foreground/80">{eyebrow.split(" ")[0]}</div>
                <div className="text-xs uppercase tracking-widest mt-2">Module Preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
    { q: "Is this real trading or paper trading?", a: "Niftex Pilot is a research, signals and paper trading platform. Real broker execution is on the roadmap via broker connections." },
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
            <a href="mailto:hello@niftexpilot.app" className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
              <Mail className="size-4" /> hello@niftexpilot.app
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
          <span>© {new Date().getFullYear()} Niftex Pilot. For educational use — not investment advice.</span>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/subscription" className="hover:text-foreground">Pricing</Link>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
          <Link to="/auth" className="hover:text-foreground">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
