import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
});

const schema = z.object({
  company_name: z.string().trim().min(1, "Required").max(120),
  dpo_name: z.string().trim().min(1, "Required").max(120),
  dpo_email: z.string().trim().email("Invalid email").max(255),
});

function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ company_name: "", dpo_name: "", dpo_email: "" });
  const [plan, setPlan] = useState("starter");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setForm({
          company_name: data.company_name ?? "",
          dpo_name: data.dpo_name ?? "",
          dpo_email: data.dpo_email ?? user.email ?? "",
        });
        setPlan(data.plan ?? "starter");
      }
      setLoading(false);
    })();
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  }

  if (loading) {
    return <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8 md:py-10">
      <header>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Account</div>
        <h1 className="mt-1 font-display text-3xl font-bold">Settings</h1>
      </header>

      <form onSubmit={save} className="surface-card space-y-5 rounded-xl p-6">
        <div>
          <h2 className="font-display text-lg font-semibold">Organization</h2>
          <p className="text-sm text-muted-foreground">Used on compliance reports and DPA documents.</p>
        </div>
        <Field label="Company name">
          <input className={fieldCls} value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Data Protection Officer">
            <input className={fieldCls} value={form.dpo_name} onChange={(e) => setForm({ ...form, dpo_name: e.target.value })} />
          </Field>
          <Field label="DPO email">
            <input type="email" className={fieldCls} value={form.dpo_email} onChange={(e) => setForm({ ...form, dpo_email: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-md bg-navy-deep px-5 text-sm font-semibold text-mint disabled:opacity-50">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </div>
      </form>

      <div className="surface-card rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold">Subscription</h2>
        <p className="mt-1 text-sm text-muted-foreground">Current plan: <span className="font-medium capitalize text-foreground">{plan}</span></p>
        <a href="/pricing" className="mt-3 inline-flex h-9 items-center rounded-md border border-border bg-card px-4 text-sm">Manage plan</a>
      </div>

      <div className="surface-card rounded-xl border-l-2 border-l-mint/60 p-6">
        <h2 className="font-display text-lg font-semibold">Limitation of Liability</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          California DROP-Sync acts as a compliance facilitator between your organization and third-party
          platforms (Mailchimp, Shopify, HubSpot, and the California DROP registry). To the maximum extent
          permitted by law, <span className="font-medium text-foreground">JT Inc. is not liable for third-party
          API failures, outages, or rejected deletion requests beyond the cost of the monthly subscription</span>
          paid in the billing cycle in which the failure occurred. You remain the data controller of record
          under SB 362 and retain ultimate responsibility for verifying deletion completion. Full terms are
          available in the <a href="/terms" className="underline underline-offset-2">Terms of Service</a>.
        </p>
      </div>
    </div>
  );
}

const fieldCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
