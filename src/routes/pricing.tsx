import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing — California DROP-Sync" },
      { name: "description", content: "Simple compliance pricing. Starter $49/mo, Professional $149/mo, Enterprise custom." },
    ],
  }),
});

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    suffix: "/mo",
    blurb: "For small teams just starting compliance.",
    features: ["1 connected platform", "Up to 250 deletion requests/mo", "30-day audit retention", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$149",
    suffix: "/mo",
    featured: true,
    blurb: "Most popular for compliant SMBs.",
    features: ["Unlimited integrations", "Up to 10,000 deletion requests/mo", "1-year audit retention", "DPO dashboard & exports", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    suffix: "",
    blurb: "For data brokers, marketplaces, and regulated industries.",
    features: ["Unlimited everything", "Custom SLAs & DPA", "SOC 2 + HIPAA reports", "Dedicated CSM", "SSO + SAML"],
    cta: "Contact sales",
  },
];

function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(tierId: string) {
    if (tierId === "enterprise") {
      window.location.href = "mailto:sales@drop-sync.app?subject=Enterprise%20inquiry";
      return;
    }
    if (!user) {
      window.location.href = "/auth?mode=signup";
      return;
    }
    setLoading(tierId);
    // Mock Stripe flow — simulate redirect to checkout
    await new Promise((r) => setTimeout(r, 900));
    await supabase.from("profiles").update({ plan: tierId }).eq("id", user.id);
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      actor: user.email ?? "user",
      action: `Subscribed to ${tierId}`,
      target: "billing",
      status: "success",
      message: "Mock Stripe checkout completed",
    });
    setLoading(null);
    toast.success(`Subscribed to ${tierId} (mock)`, { description: "This is a demo checkout — no card was charged." });
    setTimeout(() => { window.location.href = "/app"; }, 600);
  }

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Pricing</div>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">Compliance at every scale.</h1>
          <p className="mt-4 text-muted-foreground">Annual plans save 20%. All plans include the 45-day SLA guarantee.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={`surface-card relative flex flex-col rounded-2xl p-7 ${
                t.featured ? "ring-2 ring-accent shadow-glow" : ""
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Most popular
                </div>
              )}
              <div className="font-display text-xl font-semibold">{t.name}</div>
              <div className="mt-2 text-sm text-muted-foreground">{t.blurb}</div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{t.price}</span>
                <span className="text-muted-foreground">{t.suffix}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => checkout(t.id)}
                disabled={loading === t.id}
                className={`mt-7 inline-flex h-11 items-center justify-center rounded-md text-sm font-semibold ${
                  t.featured
                    ? "bg-navy-deep text-mint hover:opacity-90"
                    : "border border-border bg-card hover:bg-muted"
                } disabled:opacity-50`}
              >
                {loading === t.id ? "Redirecting…" : t.cta ?? `Choose ${t.name}`}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Need a custom DPA, BAA, or InfoSec questionnaire? <Link to="/pricing" className="underline">Contact us</Link>.
        </p>
      </section>
      <MarketingFooter />
    </div>
  );
}
