import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { TrendingUp, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Check your email to confirm your account, then sign in." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Password reset email sent. Check your inbox." });
      }
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setMsg({ kind: "err", text: result.error.message || "Google sign-in failed" });
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(60% 50% at 80% 10%, oklch(0.55 0.18 250 / 0.25), transparent 60%), radial-gradient(50% 40% at 10% 90%, oklch(0.6 0.18 160 / 0.18), transparent 60%)" }} />

      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-10 border-r border-border/40 glass-panel">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow-pulse">
            <TrendingUp className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-lg leading-none">TradePilot <span className="text-primary">AI</span></div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.2em]">Paper Trading Terminal</div>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.05] tracking-tight">
            Trade NIFTY, BANKNIFTY & options.<br />
            <span className="text-primary">Zero risk. Pure edge.</span>
          </h1>
          <p className="text-muted-foreground max-w-md">
            AI-curated signals, options OI analytics, prop-style risk management — your virtual capital, your performance, secured to your account.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-bull" /> Persistent portfolio & equity curve</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-bull" /> Per-user trade journal & psychology log</li>
            <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-bull" /> Encrypted virtual capital settings</li>
          </ul>
        </div>
        <div className="text-xs text-muted-foreground">© TradePilot AI — Paper trading only. Not investment advice.</div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md glass-card p-7 rounded-2xl">
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <TrendingUp className="size-5 text-primary-foreground" />
            </div>
            <div className="font-bold">TradePilot <span className="text-primary">AI</span></div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" && "Sign in to access your paper trading desk."}
            {mode === "signup" && "Start trading with ₹1,00,000 virtual capital."}
            {mode === "forgot" && "We'll email you a secure reset link."}
          </p>

          {mode !== "forgot" && (
            <>
              <button
                onClick={google}
                disabled={loading}
                className="mt-6 w-full h-10 rounded-lg border border-border bg-input/30 hover:bg-input/60 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="size-4"><path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.4-1.6 4-5.4 4-3.3 0-5.9-2.7-5.9-6.1S8.7 5.9 12 5.9c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.9 3.4 14.7 2.5 12 2.5 6.8 2.5 2.7 6.7 2.7 12S6.8 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.8-.1-1.2H12z"/></svg>
                Continue with Google
              </button>
              <div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground uppercase tracking-widest">
                <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <Field icon={<TrendingUp className="size-4" />} value={displayName} onChange={setDisplayName} placeholder="Display name" />
            )}
            <Field icon={<Mail className="size-4" />} value={email} onChange={setEmail} type="email" placeholder="you@email.com" required />
            {mode !== "forgot" && (
              <Field icon={<Lock className="size-4" />} value={password} onChange={setPassword} type="password" placeholder="Password" required minLength={6} />
            )}

            {msg && (
              <div className={"text-xs px-3 py-2 rounded-md border " + (msg.kind === "ok" ? "border-bull/30 bg-bull/10 text-bull" : "border-bear/30 bg-bear/10 text-bear")}>
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {mode === "signin" && "Sign in"}
              {mode === "signup" && "Create account"}
              {mode === "forgot" && "Send reset link"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-xs">
            {mode === "signin" ? (
              <>
                <button onClick={() => { setMode("forgot"); setMsg(null); }} className="text-muted-foreground hover:text-foreground">Forgot password?</button>
                <button onClick={() => { setMode("signup"); setMsg(null); }} className="text-primary font-medium">Create account</button>
              </>
            ) : (
              <>
                <span className="text-muted-foreground">Already have an account?</span>
                <button onClick={() => { setMode("signin"); setMsg(null); }} className="text-primary font-medium">Sign in</button>
              </>
            )}
          </div>

          <div className="mt-6 text-center text-[11px] text-muted-foreground">
            By continuing you agree to TradePilot's paper trading <Link to="/auth" className="underline">terms</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon, value, onChange, type = "text", placeholder, required, minLength,
}: {
  icon: React.ReactNode; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; minLength?: number;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <input
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-lg bg-input/40 border border-border pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}
