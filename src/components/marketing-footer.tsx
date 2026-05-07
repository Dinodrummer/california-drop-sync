import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-navy-deep text-mint">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-semibold">California DROP-Sync</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Automated compliance for the California Delete Act (SB 362). DROP-Sync polls the state DROP platform every 15 minutes and propagates deletion requests across your stack.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            DROP-Sync is a software tool, not a substitute for legal counsel.
          </p>
        </div>

        <FCol title="Product">
          <FLink to="/pricing">Pricing</FLink>
          <FLink to="/security">Security & trust</FLink>
          <FLink to="/auth" search={{ mode: "signup" }}>Start free</FLink>
        </FCol>

        <FCol title="Company">
          <FLink to="/privacy">Privacy</FLink>
          <FLink to="/terms">Terms</FLink>
          <a href="mailto:hello@drop-sync.app" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
        </FCol>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} DROP-Sync, Inc. · Made in California</span>
          <span>SOC 2 Type II in progress · CCPA + CPRA aligned</span>
        </div>
      </div>
    </footer>
  );
}

function FCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-foreground">{title}</div>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FLink(props: React.ComponentProps<typeof Link>) {
  return <Link {...props} className="text-sm text-muted-foreground hover:text-foreground" />;
}
