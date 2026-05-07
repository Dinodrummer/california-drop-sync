import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { Lock, ShieldCheck, KeyRound, Server, FileCheck, Eye } from "lucide-react";

export const Route = createFileRoute("/security")({
  component: Security,
  head: () => ({
    meta: [
      { title: "Security & Trust — California DROP-Sync" },
      { name: "description", content: "Encryption, access controls, sub-processors, and compliance certifications powering DROP-Sync." },
      { property: "og:title", content: "DROP-Sync Security & Trust" },
      { property: "og:description", content: "AES-256, SOC 2 Type II in progress, scoped IAM, and least-privilege integration tokens." },
    ],
  }),
});

const pillars = [
  { icon: Lock, title: "Encryption everywhere", body: "AES-256 at rest, TLS 1.2+ in transit. Integration tokens are envelope-encrypted with per-tenant keys." },
  { icon: KeyRound, title: "Least-privilege tokens", body: "We request only the OAuth scopes needed to delete a record — never read marketing data, never write campaigns." },
  { icon: Server, title: "Isolated tenancy", body: "Per-tenant row-level security in Postgres. No cross-customer reads, ever — enforced at the database layer." },
  { icon: ShieldCheck, title: "SOC 2 Type II in progress", body: "Audited by a Big-4 firm. Type I report available under NDA today; Type II ETA Q2 2026." },
  { icon: FileCheck, title: "Audit trail", body: "Every action — login, integration change, deletion — is recorded in an immutable, exportable audit log." },
  { icon: Eye, title: "Responsible disclosure", body: "Report vulnerabilities to security@drop-sync.app. We respond within 24 hours and credit researchers." },
];

function Security() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Trust center</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Security you can hand your CISO.</h1>
          <p className="mt-4 text-muted-foreground">DROP-Sync handles regulated data — so we engineered for the auditor before we engineered for the buyer.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="surface-card rounded-xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-navy-deep text-mint">
                <p.icon className="h-4 w-4" />
              </div>
              <div className="mt-4 font-display text-base font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="surface-card mt-10 rounded-2xl bg-navy-deep p-8 text-mint">
          <h2 className="font-display text-2xl font-semibold text-white">Need our security questionnaire, DPA, or BAA?</h2>
          <p className="mt-2 text-mint/70">Email <a href="mailto:security@drop-sync.app" className="underline">security@drop-sync.app</a> with your domain and we'll reply within one business day.</p>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
