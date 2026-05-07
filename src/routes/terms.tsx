import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Terms of Service — California DROP-Sync" },
      { name: "description", content: "The terms governing your use of the DROP-Sync compliance platform." },
    ],
  }),
});

function Terms() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Legal</div>
        <h1 className="mt-2 font-display text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: January 1, 2026</p>

        <S title="1. The service">DROP-Sync provides automated propagation of consumer deletion requests under the California Delete Act (SB 362). The service is provided “as-is” and is <i>not</i> legal advice.</S>
        <S title="2. Your account">You are responsible for keeping your credentials confidential and for all activity under your account. You must be authorized to share any API tokens you connect.</S>
        <S title="3. Acceptable use">No reverse engineering, no abuse of the DROP platform, no use to evade legal obligations, no benchmarking without written consent.</S>
        <S title="4. Fees">Plans are billed monthly or annually. Refunds are pro-rated for annual plans cancelled in the first 30 days. Sales tax additional where applicable.</S>
        <S title="5. SLA">99.9% monthly uptime on Professional and above. Service credits per the Order Form.</S>
        <S title="6. Liability">To the maximum extent allowed, total liability is capped at the fees you paid in the prior 12 months.</S>
        <S title="7. Governing law">California law. Exclusive venue in San Francisco County.</S>
        <S title="8. Contact">legal@drop-sync.app</S>
      </article>
      <MarketingFooter />
    </div>
  );
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
