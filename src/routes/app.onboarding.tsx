import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, ShieldCheck, Plug, Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/app/onboarding")({
  component: Onboarding,
});

const dpoSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(120),
  dpo_name: z.string().trim().min(1, "DPO name is required").max(120),
  dpo_email: z.string().trim().email("Invalid email").max(255),
});

const integrationSchema = z.object({
  provider: z.enum(["mailchimp", "shopify", "hubspot"]),
  api_key: z.string().trim().min(8, "API key looks too short").max(200),
});

const steps = [
  { id: 1, title: "Your organization", icon: Building2 },
  { id: 2, title: "Connect a platform", icon: Plug },
  { id: 3, title: "Confirm & launch", icon: ShieldCheck },
];

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [dpo, setDpo] = useState({ company_name: "", dpo_name: "", dpo_email: user?.email ?? "" });
  const [integration, setIntegration] = useState<{ provider: "mailchimp" | "shopify" | "hubspot"; api_key: string }>({
    provider: "mailchimp",
    api_key: "",
  });

  async function next() {
    if (!user) return;
    if (step === 1) {
      const parsed = dpoSchema.safeParse(dpo);
      if (!parsed.success) return toast.error(parsed.error.issues[0].message);
      setSubmitting(true);
      const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
      setSubmitting(false);
      if (error) return toast.error(error.message);
      setStep(2);
    } else if (step === 2) {
      const parsed = integrationSchema.safeParse(integration);
      if (!parsed.success) return toast.error(parsed.error.issues[0].message);
      setSubmitting(true);
      const { error } = await supabase.from("integrations").upsert(
        {
          user_id: user.id,
          provider: parsed.data.provider,
          api_key: parsed.data.api_key,
          status: "connected",
          last_sync: new Date().toISOString(),
        },
        { onConflict: "user_id,provider" }
      );
      if (!error) {
        await supabase.from("audit_logs").insert({
          user_id: user.id,
          actor: user.email ?? "user",
          action: "Integration connected",
          target: parsed.data.provider,
          status: "success",
          message: "Onboarding wizard",
        });
      }
      setSubmitting(false);
      if (error) return toast.error(error.message);
      setStep(3);
    } else {
      setSubmitting(true);
      await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
      setSubmitting(false);
      toast.success("You're compliant ✨");
      navigate({ to: "/app" });
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Setup wizard</div>
      <h1 className="mt-1 font-display text-3xl font-bold">Let's get you compliant.</h1>

      <ol className="mt-8 grid grid-cols-3 gap-2">
        {steps.map((s) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <li key={s.id} className={`rounded-md border p-3 text-xs transition-colors ${
              active ? "border-foreground bg-card" : done ? "border-success/40 bg-success/5" : "border-border bg-card/50 text-muted-foreground"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
                  done ? "bg-success text-success-foreground" : active ? "bg-foreground text-background" : "bg-muted"
                }`}>
                  {done ? <Check className="h-3 w-3" /> : s.id}
                </span>
                <span className="font-medium">{s.title}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="surface-card mt-6 rounded-xl p-6">
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Company name">
              <input className={fieldCls} value={dpo.company_name} onChange={(e) => setDpo({ ...dpo, company_name: e.target.value })} placeholder="Acme, Inc." />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Data Protection Officer">
                <input className={fieldCls} value={dpo.dpo_name} onChange={(e) => setDpo({ ...dpo, dpo_name: e.target.value })} placeholder="Jane Doe" />
              </Field>
              <Field label="DPO email">
                <input type="email" className={fieldCls} value={dpo.dpo_email} onChange={(e) => setDpo({ ...dpo, dpo_email: e.target.value })} />
              </Field>
            </div>
            <p className="text-xs text-muted-foreground">SB 362 requires every business processing consumer data to designate a privacy contact.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Choose a platform to connect first">
              <select
                className={fieldCls}
                value={integration.provider}
                onChange={(e) => setIntegration({ ...integration, provider: e.target.value as never })}
              >
                <option value="mailchimp">Mailchimp</option>
                <option value="shopify">Shopify</option>
                <option value="hubspot">HubSpot</option>
              </select>
            </Field>
            <Field label="API key / token">
              <input
                type="password"
                className={fieldCls}
                value={integration.api_key}
                onChange={(e) => setIntegration({ ...integration, api_key: e.target.value })}
                placeholder="Paste your API key"
              />
            </Field>
            <p className="text-xs text-muted-foreground">
              You can add more integrations later. Keys are encrypted at rest with AES-256.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <p>You're all set, <span className="font-medium">{dpo.dpo_name || "DPO"}</span>.</p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-success" /> Profile and DPO contact saved</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-success" /> {integration.provider} connected</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-success" /> DROP polling will start within 15 minutes</li>
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1 || submitting}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={submitting}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-navy-deep px-5 text-sm font-semibold text-mint disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {step === 3 ? "Enter dashboard" : "Continue"}
          </button>
        </div>
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
