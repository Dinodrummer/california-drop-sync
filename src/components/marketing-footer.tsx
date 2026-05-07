export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <div className="font-display text-base font-semibold text-foreground">California DROP-Sync</div>
            <p className="mt-1 max-w-md">
              Automated compliance for the California Delete Act (SB 362). Not a substitute for legal counsel.
            </p>
          </div>
          <div className="text-xs">
            © {new Date().getFullYear()} DROP-Sync, Inc. · SOC 2 in progress · Made in California
          </div>
        </div>
      </div>
    </footer>
  );
}
