import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { AlertTriangle, ArrowRight, Search, ShieldAlert } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import type { ProductionListResponse } from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { MetricChip, MetricChips } from "@/components/summary-bits";


export const Route = createFileRoute("/productions/")({
  head: () => ({
    meta: [{ title: "Productions — IRIS Explainer" }],
  }),
  component: ProductionsPage,
});

function ProductionsPage() {
  const { data, error, isLoading } = useQuery<ProductionListResponse>({
    queryKey: ["productions"],
    queryFn: () => apiFetch<ProductionListResponse>("/productions"),
    retry: 0,
  });

  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const list = data?.items ?? [];
    if (!q.trim()) return list;
    const term = q.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term),
    );
  }, [data, q]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Namespace" }]}
        title="Productions"
        status={
          data?.namespace
            ? { label: data.namespace, tone: "observed" }
            : undefined
        }
      />

      <div className="p-8 space-y-6">
        {data?.metrics ? (
          <MetricChips>
            <MetricChip label="Productions" value={data.metrics.productionCount ?? data.items?.length ?? 0} tone="brand" />
            {(data.metrics.runningProductionCount ?? 0) > 0 ? (
              <MetricChip label="Running" value={data.metrics.runningProductionCount!} tone="confirmed" />
            ) : null}
            <MetricChip label="Components" value={data.metrics.componentCount ?? 0} />
            <MetricChip label="Services" value={data.metrics.serviceCount ?? 0} tone="observed" />
            <MetricChip label="Processes" value={data.metrics.processCount ?? 0} tone="brand" />
            <MetricChip label="Operations" value={data.metrics.operationCount ?? 0} tone="inferred" />
            {(data.metrics.disabledComponentCount ?? 0) > 0 ? (
              <MetricChip label="Disabled" value={data.metrics.disabledComponentCount!} />
            ) : null}
            {(data.metrics.warningCount ?? 0) > 0 ? (
              <MetricChip label="Warnings" value={data.metrics.warningCount!} tone="error" />
            ) : null}
          </MetricChips>
        ) : null}

        {data?.warnings && data.warnings.length > 0 ? (
          <section className="rounded-lg border border-status-inferred/30 bg-status-inferred/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="size-4 text-status-inferred" />
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-status-inferred">
                {data.warnings.length} warning{data.warnings.length === 1 ? "" : "s"}
              </h3>
            </div>
            <ul className="space-y-1">
              {data.warnings.map((w, i) => (
                <li key={i} className="text-[11px] font-mono text-status-inferred/90">
                  [{w.code}] {w.message}
                </li>
              ))}
            </ul>
          </section>
        ) : null}


        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter productions…"
              className="pl-9 h-9 font-mono text-sm bg-card"
            />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            {isLoading ? "Loading…" : `${rows.length} shown`}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="text-sm font-semibold text-destructive mb-1">
              Failed to list productions
            </div>
            <p className="text-xs font-mono text-destructive/80 break-all">
              {(error as Error).message}
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground bg-card ring-1 ring-black/5 rounded-lg">
            No productions found in this namespace.
          </div>
        ) : (
          <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              <span>Production</span>
              <span>Open</span>
            </div>
            <ul className="divide-y">
              {rows.map((p) => (
                <li key={p.name}>
                  <Link
                    to="/productions/$name"
                    params={{ name: p.name }}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {p.name}
                      </div>
                      {p.description ? (
                        <div className="text-[11px] text-muted-foreground truncate">
                          {p.description}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <span>{p.componentCount ?? 0} cmp</span>
                      <span
                        className={`px-1.5 py-0.5 rounded ring-1 ${
                          p.isRunning
                            ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
                            : "ring-black/10 bg-muted"
                        }`}
                      >
                        {p.runtimeState ?? "unknown"}
                      </span>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />

                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
