import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy — California DROP-Sync" },
      { name: "description", content: "How DROP-Sync collects, processes, and protects personal data — CCPA, CPRA, and SB 362 aligned." },
    ],
  }),
});

function Privacy() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <article className="prose-container mx-auto max-w-3xl px-6 py-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Legal</div>
        <h1 className="mt-2 font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: January 1, 2026</p>

        <Section title="1. Who we are">
          <p>DROP-Sync, Inc. (“DROP-Sync”, “we”, “us”) operates a compliance platform that helps businesses honor consumer deletion requests under the California Delete Act (SB 362) and related privacy laws.</p>
        </Section>

        <Section title="2. Data we process">
          <ul>
            <li><b>Account data:</b> work email, name, company, role.</li>
            <li><b>Integration credentials:</b> API tokens for Mailchimp, Shopify, HubSpot — stored encrypted at rest with AES-256.</li>
            <li><b>Compliance metadata:</b> deletion request IDs, timestamps, completion status. We do <i>not</i> store consumer PII beyond a 30-day audit retention window (1 year on Professional+).</li>
          </ul>
        </Section>

        <Section title="3. Lawful basis (GDPR/UK)">
          <p>We process personal data to perform our contract with you, to comply with legal obligations (privacy laws), and for our legitimate interests in operating a secure service.</p>
        </Section>

        <Section title="4. Sharing">
          <p>We do not sell or rent personal data. We use a small number of sub-processors (cloud hosting, email delivery, error monitoring) under DPAs. A current list is available at <a href="mailto:privacy@drop-sync.app">privacy@drop-sync.app</a>.</p>
        </Section>

        <Section title="5. Your rights">
          <p>You may request access, correction, deletion, restriction, portability, or object to processing. EU/UK residents may complain to a supervisory authority. California residents have CCPA/CPRA rights including the right to opt out of sharing.</p>
        </Section>

        <Section title="6. Security">
          <p>TLS 1.2+ in transit, AES-256 at rest, scoped IAM roles, quarterly penetration tests, and SOC 2 Type II controls (report available under NDA).</p>
        </Section>

        <Section title="7. Contact">
          <p>Data Protection Officer — <a href="mailto:privacy@drop-sync.app">privacy@drop-sync.app</a> · DROP-Sync, Inc., 548 Market St #92841, San Francisco, CA 94104.</p>
        </Section>
      </article>
      <MarketingFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_b]:text-foreground [&_li]:ml-5 [&_li]:list-disc">{children}</div>
    </section>
  );
}
