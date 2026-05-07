import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";

export const Route = createFileRoute("/app/audit")({
  component: Audit,
});

type Log = {
  id: string;
  actor: string;
  action: string;
  target: string | null;
  status: string;
  message: string | null;
  created_at: string;
};

function Audit() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200);
      setLogs((data ?? []) as Log[]);
      setLoading(false);
    })();
  }, [user]);

  const filtered = logs.filter((l) =>
    !q ? true : `${l.action} ${l.target} ${l.message ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Compliance evidence</div>
          <h1 className="mt-1 font-display text-3xl font-bold">Audit Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Immutable record of every deletion request, integration change, and DROP poll.
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events…"
            className="h-10 w-72 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </header>

      <div className="surface-card overflow-hidden rounded-xl">
        {loading ? (
          <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading audit trail…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No audit entries match your search.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Time</th>
                <th className="px-5 py-3 text-left font-medium">Action</th>
                <th className="px-5 py-3 text-left font-medium">Target</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-medium">{l.action}</td>
                  <td className="px-5 py-3 capitalize text-muted-foreground">{l.target ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      l.status === "success" ? "bg-success/15 text-success"
                      : l.status === "warning" ? "bg-warning/20 text-warning-foreground"
                      : "bg-destructive/15 text-destructive"
                    }`}>{l.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{l.message ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
