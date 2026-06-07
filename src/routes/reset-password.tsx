import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMsg({ kind: "err", text: "Passwords do not match" });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg({ kind: "ok", text: "Password updated. Redirecting…" });
      setTimeout(() => navigate({ to: "/" }), 1200);
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Reset failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full grid place-items-center p-6 bg-background">
      <div className="w-full max-w-md glass-card p-7 rounded-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">Set a new password</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose a strong password to secure your account.</p>
        <form onSubmit={submit} className="space-y-3 mt-6">
          <Field value={password} onChange={setPassword} placeholder="New password" />
          <Field value={confirm} onChange={setConfirm} placeholder="Confirm password" />
          {msg && (
            <div className={"text-xs px-3 py-2 rounded-md border " + (msg.kind === "ok" ? "border-bull/30 bg-bull/10 text-bull" : "border-bear/30 bg-bear/10 text-bear")}>
              {msg.text}
            </div>
          )}
          <button disabled={loading} className="w-full h-10 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="password"
        value={value}
        required
        minLength={6}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-lg bg-input/40 border border-border pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}
