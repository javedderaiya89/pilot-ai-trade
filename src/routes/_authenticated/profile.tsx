import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import {
  User, Mail, Save, LogOut, Shield, Wallet, Calendar, Sparkles,
  TrendingUp, Target, Activity, BarChart3, Eye, Edit3, X, CheckCircle2,
  CreditCard, Zap,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at?: string;
}

function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [virtualCapital, setVirtualCapital] = useState(100000);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({ total: 0, wins: 0, losses: 0, pnl: 0 });
  const [signalsViewed, setSignalsViewed] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: p }, { data: s }, { data: trades }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("paper_trades").select("pnl,status").eq("user_id", user.id),
      ]);
      if (p) {
        setProfile({ ...p, created_at: p.created_at ?? user.created_at });
        setDisplayName(p.display_name ?? "");
      }
      if (s) {
        setVirtualCapital(Number(s.virtual_capital));
        setRiskPerTrade(Number(s.risk_per_trade));
        setSignalsViewed((s as any)?.signals_viewed ?? 0);
      }
      if (trades) {
        const closed = trades.filter((t: { status: string }) => t.status === "closed");
        const wins = closed.filter((t: { pnl: number | null }) => Number(t.pnl ?? 0) > 0).length;
        const losses = closed.filter((t: { pnl: number | null }) => Number(t.pnl ?? 0) < 0).length;
        const pnl = closed.reduce((a: number, t: { pnl: number | null }) => a + Number(t.pnl ?? 0), 0);
        setStats({ total: closed.length, wins, losses, pnl });
      }
    })();
  }, []);

  async function save() {
    if (!profile) return;
    setSaving(true);
    setMsg(null);
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("profiles").update({ display_name: displayName }).eq("id", profile.id),
      supabase.from("user_settings").upsert({
        user_id: profile.id,
        virtual_capital: virtualCapital,
        risk_per_trade: riskPerTrade,
      } as any, { onConflict: "user_id" }),
    ]);
    setSaving(false);
    if (e1 || e2) {
      setMsg(e1?.message || e2?.message || "Save failed");
    } else {
      setMsg("Saved successfully");
      setEditMode(false);
    }
  }

  function cancelEdit() {
    setEditMode(false);
    setMsg(null);
    if (profile) setDisplayName(profile.display_name ?? "");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth" });
  }

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";
  const winRate = stats.total ? Math.round((stats.wins / stats.total) * 100) : 0;

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Account</div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">User Profile Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Your identity, subscription and trading statistics.</p>
        </div>

        {/* Identity Card */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="size-20 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-bold text-primary-foreground shrink-0">
              {(displayName || profile?.email || "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-xl truncate">{displayName || profile?.email}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <Mail className="size-3" /> {profile?.email}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar className="size-3" /> Joined {joinDate}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/15 text-primary text-[11px] font-semibold uppercase tracking-widest border border-primary/30">
                  <Sparkles className="size-3" /> Niftex Pilot Pro
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-bull/15 text-bull text-[11px] font-semibold uppercase tracking-widest border border-bull/30">
                  <CheckCircle2 className="size-3" /> Active
                </span>
              </div>
            </div>
            <div className="shrink-0">
              {!editMode ? (
                <button onClick={() => setEditMode(true)}
                  className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold flex items-center gap-2">
                  <Edit3 className="size-4" /> Edit Profile
                </button>
              ) : (
                <button onClick={cancelEdit}
                  className="h-10 px-4 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-2">
                  <X className="size-4" /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Trading Statistics</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<Eye className="size-4" />} label="Signals Viewed" value={String(signalsViewed)} />
            <StatCard icon={<BarChart3 className="size-4" />} label="Closed Trades" value={String(stats.total)} />
            <StatCard icon={<Target className="size-4" />} label="Win Rate" value={`${winRate}%`} tone="bull" />
            <StatCard icon={<TrendingUp className="size-4" />} label="Net P&L" value={`₹${stats.pnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} tone={stats.pnl >= 0 ? "bull" : "bear"} />
          </div>
        </div>

        {/* Subscription */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
                <CreditCard className="size-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Subscription</div>
                <div className="text-lg font-semibold mt-0.5">Niftex Pilot Pro</div>
                <div className="text-xs text-muted-foreground mt-0.5">All modules unlocked • Monthly billing</div>
              </div>
            </div>
            <Link to="/subscription"
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold flex items-center gap-2">
              Manage subscription
            </Link>
          </div>
        </div>

        {/* Edit form */}
        {editMode && (
          <div className="glass-card p-6 rounded-xl">
            <div className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Zap className="size-4 text-accent" /> Edit Profile
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Labeled label="Display name" icon={<User className="size-3.5" />}>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-10 rounded-lg bg-input/40 border border-border px-3 text-sm outline-none focus:border-accent" />
              </Labeled>
              <Labeled label="Email" icon={<Mail className="size-3.5" />}>
                <input value={profile?.email ?? ""} disabled
                  className="w-full h-10 rounded-lg bg-input/20 border border-border px-3 text-sm text-muted-foreground" />
              </Labeled>
              <Labeled label="Virtual capital (₹)" icon={<Wallet className="size-3.5" />}>
                <input type="number" value={virtualCapital} onChange={(e) => setVirtualCapital(Number(e.target.value))}
                  className="w-full h-10 rounded-lg bg-input/40 border border-border px-3 text-sm font-mono outline-none focus:border-accent" />
              </Labeled>
              <Labeled label="Risk per trade (%)" icon={<Shield className="size-3.5" />}>
                <input type="number" step="0.25" value={riskPerTrade} onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                  className="w-full h-10 rounded-lg bg-input/40 border border-border px-3 text-sm font-mono outline-none focus:border-accent" />
              </Labeled>
            </div>

            {msg && (
              <div className={`mt-4 text-xs flex items-center gap-1.5 ${msg.includes("success") ? "text-bull" : "text-bear"}`}>
                {msg.includes("success") ? <CheckCircle2 className="size-3.5" /> : <X className="size-3.5" />}
                {msg}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <button onClick={save} disabled={saving}
                className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                <Save className="size-4" /> {saving ? "Saving…" : "Save changes"}
              </button>
              <button onClick={cancelEdit}
                className="h-10 px-4 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-2">
                <X className="size-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Account actions */}
        <div className="flex items-center gap-3">
          <button onClick={logout}
            className="h-10 px-4 rounded-lg border border-bear/40 text-bear hover:bg-bear/10 text-sm font-medium flex items-center gap-2">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone?: "bull" | "bear" }) {
  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <div className={"font-mono text-xl font-semibold mt-2 " + (tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "")}>{value}</div>
    </div>
  );
}

function Labeled({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </div>
      {children}
    </label>
  );
}
