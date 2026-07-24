import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { useState } from "react";

import { apiFetch } from "@/lib/api-config";
import type { ComponentDetailResponse } from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge, ConfidenceDot } from "@/components/confidence-badge";
import {
  SummaryBullets,
  MetricChip,
  MetricChips,
  EvidenceChips,
} from "@/components/summary-bits";
import { EditComponentDialog } from "@/components/edit-component-dialog";

export const Route = createFileRoute(
  "/productions/$name/components/$componentName",
)({
  validateSearch: (s: Record<string, unknown>) => ({
    fromTab: typeof s.fromTab === "string" ? s.fromTab : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `${params.componentName} — ${params.name} — IRIS Explainer` },
    ],
  }),
  component: ComponentDetailPage,
});


function ComponentDetailPage() {
  const { name, componentName } = Route.useParams();
  const { fromTab } = Route.useSearch();
  const url = `/productions/${encodeURIComponent(name)}/components/${encodeURIComponent(componentName)}`;
  const [editOpen, setEditOpen] = useState(false);


  const q = useQuery<ComponentDetailResponse>({
    queryKey: ["component", name, componentName],
    queryFn: () => apiFetch<ComponentDetailResponse>(url),
    retry: 0,
  });

  const c = q.data?.component;
  const settings = c?.settings ?? {};
  const metrics = q.data?.metrics;

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              disabled={!c}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-iris-brand/30 bg-iris-brand/10 text-iris-brand hover:bg-iris-brand/20 disabled:opacity-50"
            >
              <Pencil className="size-3.5" /> Edit
            </button>
            <Link
              to="/productions/$name"
              params={{ name }}
              search={{ tab: fromTab && fromTab !== "overview" ? fromTab : undefined }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
            >
              <ArrowLeft className="size-3.5" /> Production
            </Link>

          </div>
        }
      />

      <EditComponentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        productionName={name}
        componentName={componentName}
        component={c}
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

            <SummaryBullets bullets={q.data?.summaryBullets} />

            {metrics ? (
              <div className="space-y-2">
                <MetricChips>
                  <MetricChip label="Connections" value={metrics.connectionCount ?? 0} />
                  <MetricChip label="Ext systems" value={metrics.externalSystemCount ?? 0} />
                  <MetricChip label="Rules" value={metrics.ruleCount ?? 0} />
                  <MetricChip label="Msg types" value={metrics.messageTypeCount ?? 0} />
                  <MetricChip label="Transforms" value={metrics.transformationCount ?? 0} />
                  <MetricChip label="BPL" value={metrics.businessProcessCount ?? 0} />
                  {(metrics.warningCount ?? 0) > 0 ? (
                    <MetricChip label="Warnings" value={metrics.warningCount!} tone="error" />
                  ) : null}
                </MetricChips>
                <EvidenceChips m={metrics} />
              </div>
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

            <EntitySection
              title="Connections"
              items={q.data?.connections ?? []}
              explanations={q.data?.connectionExplanations ?? []}
              matchKey={(cn) => `${cn.from}|${cn.to}|${cn.kind ?? ""}`}
              explKey={(e) => `${e.from}|${e.to}|${e.kind ?? ""}`}
              renderItem={(cn) => (
                <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-3 text-xs">
                  <span className="font-mono truncate">{cn.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono truncate">{cn.to}</span>
                  <span className="text-[10px] uppercase font-mono bg-muted rounded px-1.5 py-0.5">
                    {cn.kind ?? "—"}
                  </span>
                  <ConfidenceBadge confidence={cn.confidence} />
                </div>
              )}
            />

            <EntitySection
              title="Message signatures"
              items={q.data?.messageTypes ?? []}
              explanations={q.data?.messageTypeExplanations ?? []}
              matchKey={(t) => `${t.method ?? ""}|${t.direction ?? ""}|${t.messageClass ?? ""}`}
              explKey={(e) => `${e.method ?? ""}|${e.direction ?? ""}|${e.messageClass ?? ""}`}
              renderItem={(t) => (
                <div className="text-[11px] font-mono flex items-center gap-3">
                  <span className="text-muted-foreground">[{t.direction ?? "—"}]</span>
                  <span>
                    {t.method} · {t.messageClass}
                  </span>
                </div>
              )}
            />

            <EntitySection
              title="External systems"
              items={q.data?.externalSystems ?? []}
              explanations={q.data?.externalSystemExplanations ?? []}
              matchKey={(s) => `${s.kind ?? ""}|${s.value ?? ""}`}
              explKey={(e) => `${e.kind ?? ""}|${e.value ?? ""}`}
              renderItem={(s) => (
                <div className="text-[11px] font-mono break-all">
                  <span className="text-muted-foreground">{s.kind}:</span> {s.value}
                </div>
              )}
            />

            <EntitySection
              title="Routing rules"
              items={q.data?.rules ?? []}
              explanations={q.data?.ruleExplanations ?? []}
              matchKey={(r) => r.name ?? ""}
              explKey={(e) => e.name ?? ""}
              renderItem={(r) => (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold truncate">{r.name}</span>
                  <ConfidenceBadge confidence={r.confidence} />
                </div>
              )}
            />

            <EntitySection
              title="DTL transformations"
              items={q.data?.transformations ?? []}
              explanations={q.data?.transformationExplanations ?? []}
              matchKey={(t) => t.name ?? ""}
              explKey={(e) => e.name ?? ""}
              renderItem={(t) => (
                <div>
                  <div className="text-sm font-semibold truncate">{t.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    {t.sourceClass ?? "?"} → {t.targetClass ?? "?"}
                  </div>
                </div>
              )}
            />

            <EntitySection
              title="BPL processes"
              items={q.data?.businessProcesses ?? []}
              explanations={q.data?.businessProcessExplanations ?? []}
              matchKey={(p) => p.name ?? ""}
              explKey={(e) => e.name ?? ""}
              renderItem={(p) => (
                <div>
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    {p.requestClass ?? "?"} → {p.responseClass ?? "?"}
                  </div>
                </div>
              )}
            />

            {q.data?.warnings && q.data.warnings.length > 0 ? (
              <section>
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Warnings
                </h3>
                <ul className="space-y-1">
                  {q.data.warnings.map((w, i) => (
                    <li key={i} className="text-[11px] font-mono text-status-inferred">
                      [{w.code}] {w.message}
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

function EntitySection<T, E extends { text?: string; confidence?: import("@/lib/api-types").Confidence }>({
  title,
  items,
  explanations,
  matchKey,
  explKey,
  renderItem,
}: {
  title: string;
  items: T[];
  explanations: E[];
  matchKey: (item: T) => string;
  explKey: (expl: E) => string;
  renderItem: (item: T) => React.ReactNode;
}) {
  if (items.length === 0) return null;
  const map = new Map(explanations.map((e) => [explKey(e), e]));
  return (
    <section>
      <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        {title} ({items.length})
      </h2>
      <ul className="space-y-2">
        {items.map((it, i) => {
          const ex = map.get(matchKey(it));
          return (
            <li key={i} className="bg-card ring-1 ring-black/5 rounded-lg px-4 py-3">
              {renderItem(it)}
              {ex?.text ? (
                <div className="mt-2 pt-2 border-t border-border/50 flex items-start gap-2">
                  <ConfidenceDot confidence={ex.confidence ?? "unknown"} />
                  <p className="text-[11px] text-foreground/80 whitespace-pre-wrap text-pretty leading-relaxed">
                    {ex.text}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
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
