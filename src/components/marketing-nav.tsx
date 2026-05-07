import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-navy-deep text-mint">
            <Shield className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold">California DROP-Sync</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">SB 362 Compliance</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <a href="/#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
          <a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="text-sm font-medium text-foreground/80 hover:text-foreground">Sign in</Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex h-9 items-center rounded-md bg-navy-deep px-4 text-sm font-medium text-mint hover:opacity-90"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
