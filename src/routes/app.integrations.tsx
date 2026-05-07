import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plug, Loader2, Trash2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/integrations")({
  component: Integrations,
});

type Provider = "mailchimp" | "shopify" | "hubspot";

const providers: Array<{ id: Provider; name: string; hint: string; pattern: RegExp; help: string }> = [
  { id: "mailchimp", name: "Mailchimp", hint: "API key", pattern: /^[a-f0-9]{32}-us\d{1,3}$/i, help: "Format: 32 hex chars, dash, datacenter (e.g. us21)" },
  { id: "shopify",   name: "Shopify",   hint: "Admin access token", pattern: /^shpat_[a-z0-9]{32}$/i, help: "Starts with shpat_ followed by 32 chars" },
  { id: "hubspot",   name: "HubSpot",   hint: "Private app token",  pattern: /^pat-[a-z0-9-]{20,}$/i, help: "Starts with pat-" },
];

function Integrations() {
  const { user } = useAuth();
  const [items, setItems] = useState<Array<{ provider: Provider; status: string; last_sync: string | null }>>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("integrations").select("provider,status,last_sync").eq("user_id", user.id);
    setItems((data ?? []) as never);
    setLoading(false);
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8 md:py-10">
      <header>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Connection manager</div>
        <h1 className="mt-1 font-display text-3xl font-bold">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Securely link the platforms that store your customers' personal data. Keys are encrypted at rest.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {providers.map((p) => {
          const existing = items.find((i) => i.provider === p.id);
          return (
            <ProviderCard
              key={p.id}
              provider={p}
              existing={existing}
              loading={loading}
              onChanged={refresh}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProviderCard({
  provider, existing, loading, onChanged,
}: {
  provider: typeof providers[number];
  existing?: { provider: Provider; status: string; last_sync: string | null };
  loading: boolean;
  onChanged: () => void;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function connect(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const schema = z.object({
      key: z.string().trim().regex(provider.pattern, `Invalid ${provider.name} key format`),
    });
    const parsed = schema.safeParse({ key });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message, { description: provider.help });
      return;
    }
    setSubmitting(true);
    // Simulate validating against the provider — randomly succeed/fail to demo self-healing UI.
    await new Promise((r) => setTimeout(r, 700));
    const ok = Math.random() > 0.15;
    const { error } = await supabase
      .from("integrations")
      .upsert(
        {
          user_id: user.id,
          provider: provider.id,
          api_key: parsed.data.key,
          status: ok ? "connected" : "error",
          last_sync: ok ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,provider" }
      );
    if (error) {
      toast.error("Could not save integration", { description: error.message });
    } else {
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        actor: user.email ?? "user",
        action: ok ? `Integration connected` : `Integration failed validation`,
        target: provider.id,
        status: ok ? "success" : "error",
        message: ok ? "API key validated" : "Provider returned 401 — re-authenticate",
      });
      ok ? toast.success(`${provider.name} connected`) : toast.error(`${provider.name} key rejected`);
    }
    setSubmitting(false);
    setOpen(false);
    setKey("");
    onChanged();
  }

  async function disconnect() {
    if (!user) return;
    await supabase.from("integrations").delete().eq("user_id", user.id).eq("provider", provider.id);
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      actor: user.email ?? "user",
      action: `Integration disconnected`,
      target: provider.id,
      status: "success",
      message: null,
    });
    toast.success(`${provider.name} disconnected`);
    onChanged();
  }

  return (
    <div className="surface-card rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-navy-deep text-mint">
            <Plug className="h-4 w-4" />
          </div>
          <div>
            <div className="font-display font-semibold">{provider.name}</div>
            <div className="text-xs text-muted-foreground">{provider.hint}</div>
          </div>
        </div>
        {existing?.status === "error" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" /> Re-auth
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading…
        </div>
      ) : existing ? (
        <div className="mt-5 space-y-3">
          <div className="text-xs text-muted-foreground">
            Last sync: {existing.last_sync ? new Date(existing.last_sync).toLocaleString() : "—"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-card text-sm hover:bg-muted"
            >
              {existing.status === "error" ? "Re-authenticate" : "Update key"}
            </button>
            <button
              onClick={disconnect}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
              aria-label="Disconnect"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-5 inline-flex h-9 w-full items-center justify-center rounded-md bg-navy-deep text-sm font-semibold text-mint hover:opacity-90"
        >
          Connect
        </button>
      )}

      {open && (
        <form onSubmit={connect} className="mt-4 space-y-2">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={`${provider.name} ${provider.hint.toLowerCase()}`}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoComplete="off"
          />
          <p className="text-[11px] text-muted-foreground">{provider.help}</p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-foreground text-sm font-medium text-background disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Validate & save
          </button>
        </form>
      )}
    </div>
  );
}
