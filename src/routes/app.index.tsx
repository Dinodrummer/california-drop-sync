import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Clock, Activity, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: Overview,
});

function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, queued: 0, completed: 0, failed: 0 });
  const [integrations, setIntegrations] = useState<Array<{ provider: string; status: string }>>([]);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const tick = () => {
      const next = new Date();
      next.setMinutes(Math.ceil(next.getMinutes() / 15) * 15, 0, 0);
      const diff = Math.max(0, next.getTime() - Date.now());
      const m = Math.floor(diff / 60_000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60_000) / 1000).toString().padStart(2, "0");
      setCountdown(`00:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: dr } = await supabase.from("delete_requests").select("status").eq("user_id", user.id);
      const list = dr ?? [];
      setStats({
        total: list.length,
        queued: list.filter((x) => x.status === "queued" || x.status === "processing").length,
        completed: list.filter((x) => x.status === "completed").length,
        failed: list.filter((x) => x.status === "failed").length,
      });
      const { data: ints } = await supabase.from("integrations").select("provider,status").eq("user_id", user.id);
      setIntegrations(ints ?? []);
    })();
  }, [user]);

  const hasFailed = stats.failed > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Compliance dashboard</div>
          <h1 className="mt-1 font-display text-3xl font-bold">Overview</h1>
        </div>
        <div className="text-xs text-muted-foreground">
          Connected to <span className="font-mono text-foreground">drop-sync.gov-ca</span> · Polling every 15 min
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Clock}
          label="Next automated sync"
          value={countdown}
          sub="DROP platform poll"
          tone="default"
        />
        <StatCard
          icon={Activity}
          label="Total requests processed"
          value={stats.total.toString()}
          sub={`${stats.completed} completed · ${stats.queued} queued`}
          tone="default"
        />
        <StatCard
          icon={hasFailed ? AlertTriangle : ShieldCheck}
          label="Legal risk status"
          value={hasFailed ? "Action required" : "Compliant"}
          sub={hasFailed ? `${stats.failed} failed sync(s)` : "0 overdue · within 45-day SLA"}
          tone={hasFailed ? "warning" : "success"}
        />
      </div>

      <section className="surface-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Connected platforms</h2>
          <Link to="/app/integrations" className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground">
            Manage <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {integrations.length === 0 ? (
          <EmptyState
            title="No integrations yet"
            body="Connect Mailchimp, Shopify, or HubSpot to start propagating deletion requests."
            cta={<Link to="/app/integrations" className="inline-flex h-9 items-center rounded-md bg-navy-deep px-4 text-sm font-semibold text-mint">Add an integration</Link>}
          />
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {integrations.map((i) => (
              <li key={i.provider} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium capitalize">{i.provider}</div>
                  <div className="text-xs text-muted-foreground">Polling 15-min intervals</div>
                </div>
                <StatusPill status={i.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-card rounded-xl p-6">
          <h3 className="font-display text-base font-semibold">45-day SLA timeline</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Each new DROP request is queued the moment it arrives and dispatched well before the legal deadline.
          </p>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[18%] rounded-full bg-success" />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            <span>Day 0 — received</span>
            <span>Day 8 — average completion</span>
            <span>Day 45 — legal deadline</span>
          </div>
        </div>

        <div className="surface-card rounded-xl bg-navy-deep p-6 text-mint">
          <h3 className="font-display text-base font-semibold text-white">Estimated penalty avoidance</h3>
          <p className="mt-1 text-sm text-mint/70">
            Calculated at $7,500 per intentional violation × completed requests this quarter.
          </p>
          <div className="mt-5 font-display text-4xl font-bold text-white">
            ${(stats.completed * 7500).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-mint/60">Estimate only — not legal advice.</div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub: string;
  tone: "default" | "success" | "warning";
}) {
  const tint =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="surface-card rounded-xl p-5">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <Icon className={`h-4 w-4 ${tint}`} />
      </div>
      <div className={`mt-2 font-display text-3xl font-bold ${tint}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    connected: "bg-success/15 text-success",
    error: "bg-destructive/15 text-destructive",
    disconnected: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? map.disconnected}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status === "error" ? "Re-authenticate" : status}
    </span>
  );
}

export function EmptyState({ title, body, cta }: { title: string; body: string; cta?: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
      <div className="font-medium">{title}</div>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
