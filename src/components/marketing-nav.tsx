import { Link } from "@tanstack/react-router";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function MarketingNav() {
  const [open, setOpen] = useState(false);
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
          <Link to="/security" className="text-sm text-muted-foreground hover:text-foreground">Security</Link>
          <a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/auth" className="text-sm font-medium text-foreground/80 hover:text-foreground">Sign in</Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex h-9 items-center rounded-md bg-navy-deep px-4 text-sm font-medium text-mint hover:opacity-90"
          >
            Start free
          </Link>
        </div>
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-3 text-sm">
            <Link to="/pricing" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-muted">Pricing</Link>
            <Link to="/security" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-muted">Security</Link>
            <a href="/#faq" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-muted">FAQ</a>
            <Link to="/auth" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-muted">Sign in</Link>
            <Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)} className="mt-1 inline-flex h-10 items-center justify-center rounded-md bg-navy-deep px-4 font-medium text-mint">Start free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
