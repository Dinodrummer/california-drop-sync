import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { Shield, Zap, Lock, CheckCircle2, ArrowRight, Database, Workflow, Scale } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "California DROP-Sync — Automated SB 362 Compliance" },
      { name: "description", content: "Connect Mailchimp, Shopify, and HubSpot. DROP-Sync automatically processes California Delete Act requests within the 45-day legal window." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <Hero />
      <Logos />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <Stats />
      <FAQ />
      <CTA />
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Effective January 1, 2026 — California SB 362
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight md:text-6xl">
            <span className="text-gradient">Delete Act compliance</span>
            <br />
            on autopilot.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            DROP-Sync connects to the California DROP platform and propagates consumer
            deletion requests across your stack — within the 45-day legal window,
            every single time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-navy-deep px-6 text-sm font-semibold text-mint hover:opacity-90"
            >
              Start your compliance trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex h-11 items-center rounded-md border border-border bg-card px-6 text-sm font-semibold text-foreground hover:bg-muted"
            >
              View pricing
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> AES-256 at rest</span>
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> SOC 2 Type II</span>
            <span className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> CCPA + CPRA aligned</span>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="surface-card rounded-2xl p-2 shadow-elegant">
        <div className="rounded-xl bg-navy-deep p-6 text-mint/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
              Live compliance status
            </div>
            <div className="font-mono text-xs text-mint/60">drop-sync.gov-ca</div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { label: "Next sync", value: "00:14:22", sub: "every 15 min" },
              { label: "Requests processed", value: "1,284", sub: "this quarter" },
              { label: "Legal risk status", value: "Compliant", sub: "0 overdue" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-mint/15 bg-white/5 p-4">
                <div className="text-[10px] uppercase tracking-widest text-mint/60">{s.label}</div>
                <div className="mt-1 font-display text-2xl font-semibold text-white">{s.value}</div>
                <div className="text-xs text-mint/60">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Logos() {
  const items = ["Mailchimp", "Shopify", "HubSpot", "Klaviyo", "Segment", "Iterable"];
  return (
    <section className="border-y border-border/60 bg-card/50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          Connects to the data platforms you already use
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {items.map((i) => (
            <span key={i} className="font-display text-lg font-semibold text-foreground/40">{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Database, title: "1. Connect your stack", body: "Securely link Mailchimp, Shopify, and HubSpot in under 90 seconds. API keys are encrypted with AES-256." },
    { icon: Workflow, title: "2. We listen to DROP", body: "DROP-Sync polls the California DROP platform every 15 minutes for new consumer deletion requests." },
    { icon: CheckCircle2, title: "3. Auto-propagate in 45 days", body: "Each request is queued, executed across every system, and a full audit log is generated for your DPO." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold">A compliance engine, not a checklist.</h2>
        <p className="mt-4 text-muted-foreground">
          SB 362 imposes a 45-day deletion deadline. Missing it can mean penalties up to $7,500 per intentional violation.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.title} className="surface-card rounded-xl p-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-navy-deep text-mint">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    ["DROP platform polling", "Manual checks", "Automated every 15 min"],
    ["Time to propagate a deletion", "Days–weeks", "Minutes"],
    ["Audit trail", "Spreadsheets", "Immutable, exportable"],
    ["DPO sign-off workflow", "Email threads", "Built-in"],
    ["Risk of $7,500 penalty", "High", "Eliminated"],
  ];
  return (
    <section className="border-y border-border/60 bg-card/40 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">DIY compliance vs. DROP-Sync</h2>
          <p className="mt-3 text-muted-foreground">The same legal requirement. A radically different operational cost.</p>
        </div>
        <div className="surface-card mt-10 overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Capability</th>
                <th className="px-5 py-3 text-left font-medium">In-house</th>
                <th className="px-5 py-3 text-left font-medium">DROP-Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(([cap, diy, ds]) => (
                <tr key={cap}>
                  <td className="px-5 py-3.5 font-medium">{cap}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{diy}</td>
                  <td className="px-5 py-3.5"><span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">{ds}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { q: "We turned a 6-month compliance scramble into a 3-minute setup. Our DPO sleeps now.", a: "Priya R.", r: "DPO, 200-person fintech" },
    { q: "The audit log alone justified the price. We exported a quarter of evidence in two clicks.", a: "Marcus L.", r: "GC, e-commerce brand" },
    { q: "Our Mailchimp + HubSpot deletions used to live in a spreadsheet. Now they just… happen.", a: "Sasha K.", r: "Head of Privacy, SaaS" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Trusted by privacy teams shipping under deadline.</h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {quotes.map((t) => (
          <figure key={t.a} className="surface-card flex flex-col rounded-2xl p-6">
            <blockquote className="font-display text-base leading-relaxed">“{t.q}”</blockquote>
            <figcaption className="mt-5 border-t border-border pt-4 text-sm">
              <div className="font-medium">{t.a}</div>
              <div className="text-xs text-muted-foreground">{t.r}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-navy-deep py-16 text-mint">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">
        {[
          { v: "45 days", l: "Legal SLA met automatically" },
          { v: "$7,500", l: "Max penalty per violation" },
          { v: "500+", l: "Data brokers in scope" },
          { v: "99.97%", l: "Sync uptime" },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-display text-4xl font-bold text-white">{s.v}</div>
            <div className="mt-1 text-sm text-mint/70">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "What is the California Delete Act (SB 362)?", a: "Signed in 2023, SB 362 requires data brokers to honor a single consumer deletion request via the DROP platform managed by the California Privacy Protection Agency. The deletion must propagate within 45 days." },
    { q: "Do I need DROP-Sync to comply?", a: "No, but manual compliance requires monitoring DROP, dispatching deletions to every connected vendor, and producing an audit trail. DROP-Sync automates that loop." },
    { q: "Is my data safe?", a: "All API credentials are encrypted at rest with AES-256. We are SOC 2 Type II in progress and never store consumer PII beyond the audit log retention window." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="text-center font-display text-3xl font-bold">Frequently asked</h2>
      <div className="mt-10 space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="surface-card rounded-xl p-5">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="surface-card rounded-2xl bg-navy-deep p-10 text-center text-mint">
        <Zap className="mx-auto h-8 w-8" />
        <h2 className="mt-4 font-display text-3xl font-bold text-white">Ready by January 1, 2026?</h2>
        <p className="mx-auto mt-2 max-w-xl text-mint/70">
          Setup takes 3 minutes. Cancel any time. White-glove onboarding included on Professional and Enterprise.
        </p>
        <Link
          to="/auth"
          search={{ mode: "signup" }}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-mint px-6 text-sm font-semibold text-navy-deep hover:opacity-90"
        >
          Get compliant — Start free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
