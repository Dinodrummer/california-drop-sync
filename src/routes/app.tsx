import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Plug, ScrollText, Settings, Shield, LogOut, Loader2, Menu, X } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/integrations", label: "Integrations", icon: Plug },
  { to: "/app/audit", label: "Audit Logs", icon: ScrollText },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function AppLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [seeding, setSeeding] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [path]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  // Seed mock audit log entries once per account, then redirect to onboarding if needed.
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", user.id)
        .maybeSingle();

      const { count } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if ((count ?? 0) === 0) {
        await supabase.from("audit_logs").insert(seedAuditLogs(user.id, user.email ?? "system"));
        await supabase.from("delete_requests").insert(seedDeleteRequests(user.id));
      }

      if (!profile?.onboarded && path === "/app") {
        navigate({ to: "/app/onboarding" });
      }
      setSeeding(false);
    })();
  }, [user, navigate, path]);

  if (loading || !user || seeding) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading dashboard…</div>
      </div>
    );
  }

  const SidebarBody = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-mint/10 text-mint">
          <Shield className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold text-white">DROP-Sync</div>
          <div className="text-[10px] uppercase tracking-widest text-mint/60">SB 362 Engine</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-md bg-sidebar-accent px-3 py-2 text-xs">
          <div className="truncate font-medium text-white">{user.email}</div>
          <div className="mt-0.5 text-mint/70">DPO · Compliance owner</div>
        </div>
        <button
          onClick={() => { signOut().then(() => navigate({ to: "/" })); }}
          className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        {SidebarBody}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground md:hidden">
        <Link to="/app" className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-mint/10 text-mint"><Shield className="h-3.5 w-3.5" /></div>
          <span className="font-display text-sm font-semibold text-white">DROP-Sync</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-md hover:bg-sidebar-accent/60">
          <Menu className="h-4 w-4" />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar text-sidebar-foreground">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent/60"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            {SidebarBody}
          </aside>
        </div>
      )}

      <main className="min-w-0 bg-background">
        <Outlet />
      </main>
    </div>
  );
}

function seedAuditLogs(userId: string, actor: string) {
  const now = Date.now();
  const entries: Array<{ minutesAgo: number; action: string; target: string; status: string; message: string }> = [
    { minutesAgo: 4, action: "DROP poll completed", target: "ca-drop-platform", status: "success", message: "12 new requests fetched" },
    { minutesAgo: 22, action: "User 829x deleted from Mailchimp", target: "mailchimp", status: "success", message: "Subject removed from 3 audiences" },
    { minutesAgo: 51, action: "User 7t2k deleted from Shopify", target: "shopify", status: "success", message: "Customer + order PII purged" },
    { minutesAgo: 95, action: "User 4qm9 deleted from HubSpot", target: "hubspot", status: "success", message: "Contact + 17 engagements removed" },
    { minutesAgo: 180, action: "Mailchimp token refreshed", target: "mailchimp", status: "success", message: "OAuth refresh succeeded" },
    { minutesAgo: 260, action: "Compliance report exported", target: "audit", status: "success", message: "Q4 2025 PDF exported by DPO" },
    { minutesAgo: 480, action: "User b1n4 deletion failed — retrying", target: "shopify", status: "warning", message: "Rate limit hit, queued for retry" },
    { minutesAgo: 1440, action: "Integration connected", target: "hubspot", status: "success", message: "API key validated" },
  ];
  return entries.map((e) => ({
    user_id: userId,
    actor,
    action: e.action,
    target: e.target,
    status: e.status,
    message: e.message,
    created_at: new Date(now - e.minutesAgo * 60_000).toISOString(),
  }));
}

function seedDeleteRequests(userId: string) {
  const now = Date.now();
  const day = 86_400_000;
  const providers = ["mailchimp", "shopify", "hubspot"] as const;
  return Array.from({ length: 12 }).map((_, i) => {
    const status = (i < 7 ? "completed" : i < 10 ? "queued" : i === 10 ? "processing" : "failed") as "completed" | "queued" | "processing" | "failed";
    return {
      user_id: userId,
      subject_email: `consumer${1000 + i}@example.com`,
      source: providers[i % 3],
      status,
      scheduled_for: new Date(now + (45 - i * 3) * day).toISOString(),
      completed_at: status === "completed" ? new Date(now - i * day).toISOString() : null,
      created_at: new Date(now - (i + 1) * day).toISOString(),
    };
  });
}
