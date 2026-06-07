import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { User, Mail, Save, LogOut, Shield, Wallet } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [virtualCapital, setVirtualCapital] = useState(100000);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (p) {
        setProfile(p);
        setDisplayName(p.display_name ?? "");
      }
      if (s) {
        setVirtualCapital(Number(s.virtual_capital));
        setRiskPerTrade(Number(s.risk_per_trade));
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
      }, { onConflict: "user_id" }),
    ]);
    setSaving(false);
    setMsg(e1 || e2 ? (e1?.message || e2?.message || "Save failed") : "Saved successfully");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth" });
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Account</div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">User Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your identity and paper trading defaults.</p>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-xl font-bold text-primary-foreground">
              {(displayName || profile?.email || "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{displayName || profile?.email}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Mail className="size-3" /> {profile?.email}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
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

          {msg && <div className="mt-4 text-xs text-muted-foreground">{msg}</div>}

          <div className="flex items-center gap-3 mt-6">
            <button onClick={save} disabled={saving}
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
              <Save className="size-4" /> {saving ? "Saving…" : "Save changes"}
            </button>
            <button onClick={logout}
              className="h-10 px-4 rounded-lg border border-bear/40 text-bear hover:bg-bear/10 text-sm font-medium flex items-center gap-2">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </AppShell>
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
