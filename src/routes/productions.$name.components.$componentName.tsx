import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import type { ComponentDetailResponse } from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge } from "@/components/confidence-badge";

export const Route = createFileRoute(
  "/productions/$name/components/$componentName",
)({
  head: ({ params }) => ({
    meta: [
      { title: `${params.componentName} — ${params.name} — IRIS Explainer` },
    ],
  }),
  component: ComponentDetailPage,
});

function ComponentDetailPage() {
  const { name, componentName } = Route.useParams();
  const url = `/productions/${encodeURIComponent(name)}/components/${encodeURIComponent(componentName)}`;

  const q = useQuery<ComponentDetailResponse>({
    queryKey: ["component", name, componentName],
    queryFn: () => apiFetch<ComponentDetailResponse>(url),
    retry: 0,
  });

  const c = q.data?.component;
  const settings = c?.settings ?? {};

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Productions" },
          { label: name },
          { label: "Components" },
        ]}
        title={componentName}
        status={
          c
            ? {
                label: c.enabled === false ? "disabled" : "enabled",
                tone: c.enabled === false ? "unknown" : "confirmed",
              }
            : undefined
        }
        actions={
          <Link
            to="/productions/$name"
            params={{ name }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" /> Production
          </Link>
        }
      />

      <div className="p-8 space-y-8">
        {q.isLoading ? (
          <Skeleton className="h-40 rounded-lg" />
        ) : q.error ? (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="text-sm font-semibold text-destructive mb-1">
              Failed to load component
            </div>
            <p className="text-xs font-mono text-destructive/80 break-all">
              {(q.error as Error).message}
            </p>
          </div>
        ) : c ? (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Meta label="Type" value={c.type ?? c.category ?? "—"} />
              <Meta label="Class" value={c.className ?? "—"} mono />
              <Meta label="Adapter" value={c.adapterClass ?? c.adapter ?? "—"} mono />
              <Meta label="Protocol" value={c.protocol ?? "—"} />
              <Meta label="Pool size" value={String(c.poolSize ?? "—")} />
              <Meta label="Enabled" value={c.enabled === false ? "No" : "Yes"} />
              <Meta
                label="Targets"
                value={(c.targets ?? []).join(", ") || "—"}
                mono
              />
              <Meta label="Confidence" value={c.confidence ?? "—"} />
            </section>

            {c.comment ? (
              <p className="text-sm text-muted-foreground max-w-3xl">{c.comment}</p>
            ) : null}

            {q.data?.explanation?.text ? (
              <section className="bg-card ring-1 ring-black/5 rounded-lg p-5 border-l-2 border-iris-brand max-w-4xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Deterministic explanation
                  </h2>
                  <ConfidenceBadge confidence={q.data.explanation.confidence} />
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty">
                  {q.data.explanation.text}
                </p>
              </section>
            ) : null}

            {Object.keys(settings).length > 0 ? (
              <section>
                <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Settings ({Object.keys(settings).length})
                </h2>
                <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
                  <ul className="divide-y">
                    {Object.entries(settings).map(([k, v]) => (
                      <li key={k} className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-2 text-xs">
                        <span className="font-mono text-muted-foreground truncate">{k}</span>
                        <span className="font-mono break-all">
                          {typeof v === "object" ? JSON.stringify(v) : String(v)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {(q.data?.connections?.length ?? 0) > 0 ? (
              <section>
                <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Connections
                </h2>
                <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
                  <ul className="divide-y">
                    {q.data!.connections!.map((cn, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-3 px-4 py-2 text-xs"
                      >
                        <span className="font-mono truncate">{cn.from}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono truncate">{cn.to}</span>
                        <span className="text-[10px] uppercase font-mono bg-muted rounded px-1.5 py-0.5">
                          {cn.kind ?? "—"}
                        </span>
                        <ConfidenceBadge confidence={cn.confidence} />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {(q.data?.messageTypes?.length ?? 0) > 0 ? (
              <section>
                <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Message signatures
                </h2>
                <ul className="space-y-1">
                  {q.data!.messageTypes!.map((t, i) => (
                    <li key={i} className="text-[11px] font-mono">
                      <span className="text-muted-foreground">
                        [{t.direction ?? "—"}]
                      </span>{" "}
                      {t.method} · {t.messageClass}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {(q.data?.externalSystems?.length ?? 0) > 0 ? (
              <section>
                <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  External systems
                </h2>
                <ul className="space-y-1 text-[11px] font-mono break-all">
                  {q.data!.externalSystems!.map((s, i) => (
                    <li key={i}>
                      <span className="text-muted-foreground">{s.kind}:</span> {s.value}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-3 bg-card ring-1 ring-black/5 rounded-lg">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <div className={`text-xs truncate ${mono ? "font-mono" : ""}`} title={value}>
        {value}
      </div>
    </div>
  );
}
