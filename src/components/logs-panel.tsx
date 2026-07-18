import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search, X } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import type { ProductionLogListResponse } from "@/lib/api-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ConfidenceBadge } from "@/components/confidence-badge";

function toQuery(params: Record<string, string | number | undefined>) {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "" || v === null) continue;
    s.set(k, String(v));
  }
  const q = s.toString();
  return q ? `?${q}` : "";
}

function typeTone(type?: string) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("error") || t.includes("fatal") || t.includes("alert"))
    return "text-destructive ring-destructive/30 bg-destructive/10";
  if (t.includes("warn"))
    return "text-status-inferred ring-status-inferred/30 bg-status-inferred/10";
  if (t.includes("info"))
    return "text-status-observed ring-status-observed/30 bg-status-observed/10";
  return "text-muted-foreground ring-border bg-muted/40";
}

export type LogsPanelProps = {
  /** When provided, uses /productions/{name}/logs; otherwise /logs */
  productionName?: string;
  /** Optional heading */
  title?: string;
};

export function LogsPanel({ productionName, title }: LogsPanelProps) {
  const [type, setType] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [contains, setContains] = useState<string>("");
  const [limit, setLimit] = useState<number>(100);

  const path = productionName
    ? `/productions/${encodeURIComponent(productionName)}/logs`
    : `/logs`;

  const query = useQuery<ProductionLogListResponse>({
    queryKey: ["logs", productionName ?? "*", type, source, contains, limit],
    queryFn: () =>
      apiFetch<ProductionLogListResponse>(
        `${path}${toQuery({ type: type || undefined, source: source || undefined, contains: contains || undefined, limit })}`,
      ),
    retry: 0,
  });

  const items = query.data?.items ?? [];
  const sourceOptions = query.data?.sourceNames ?? [];
  const typeOptions = query.data?.typeNames ?? [];
  const metrics = query.data?.metrics;

  const filters = useMemo(
    () => [type, source, contains].filter((v) => v && v.length > 0),
    [type, source, contains],
  );

  return (
    <section className="space-y-4">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            {title ?? (productionName ? "Production logs" : "Namespace logs")}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            {query.data?.logClassName ?? "Ens.Util.Log"}
            {typeof metrics?.totalCount === "number"
              ? ` · ${metrics.totalCount} total${query.data?.hasMore ? " (more available)" : ""}`
              : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded ring-1 ring-border hover:bg-muted transition-colors"
          disabled={query.isFetching}
        >
          <RefreshCw className={`size-3 ${query.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={contains}
            onChange={(e) => setContains(e.target.value)}
            placeholder="Search text..."
            className="h-9 pl-8 text-xs font-mono"
          />
          {contains ? (
            <button
              type="button"
              onClick={() => setContains("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-9 rounded-md border bg-background px-2 text-xs font-mono"
        >
          <option value="">All types</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="h-9 rounded-md border bg-background px-2 text-xs font-mono"
        >
          <option value="">All sources</option>
          {sourceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="h-9 rounded-md border bg-background px-2 text-xs font-mono"
        >
          {[50, 100, 200, 500].map((n) => (
            <option key={n} value={n}>
              Limit {n}
            </option>
          ))}
        </select>
      </div>

      {filters.length > 0 ? (
        <div className="text-[11px] text-muted-foreground">
          {filters.length} filter{filters.length === 1 ? "" : "s"} active
        </div>
      ) : null}

      {query.error ? (
        <div className="rounded-lg ring-1 ring-destructive/30 bg-destructive/5 p-4 text-xs text-destructive flex items-start gap-2">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="font-mono break-all">{(query.error as Error).message}</div>
        </div>
      ) : query.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg ring-1 ring-black/5 bg-muted/30 p-8 text-center text-xs text-muted-foreground">
          No log entries.
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg ring-1 ring-black/5 bg-card overflow-hidden">
          {items.map((e, i) => (
            <li
              key={`${e.logId ?? i}-${e.timeLogged ?? i}`}
              className="px-4 py-3 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ring-1 shrink-0 ${typeTone(e.type)}`}
                >
                  {e.type ?? "log"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                    <span>{e.timeLogged ?? "—"}</span>
                    {e.source ? (
                      <>
                        <span>·</span>
                        <span className="text-foreground/80">{e.source}</span>
                      </>
                    ) : null}
                    {e.sessionId ? (
                      <>
                        <span>·</span>
                        <span>session {e.sessionId}</span>
                      </>
                    ) : null}
                    {e.job ? (
                      <>
                        <span>·</span>
                        <span>job {e.job}</span>
                      </>
                    ) : null}
                    {!productionName && e.productionName ? (
                      <>
                        <span>·</span>
                        <span className="text-foreground/80">{e.productionName}</span>
                      </>
                    ) : null}
                    {e.confidence ? (
                      <span className="ml-auto">
                        <ConfidenceBadge confidence={e.confidence} />
                      </span>
                    ) : null}
                  </div>
                  {e.text ? (
                    <pre className="mt-1 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed text-foreground/90">
                      {e.text}
                    </pre>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {query.data?.warnings && query.data.warnings.length > 0 ? (
        <div className="text-[11px] text-muted-foreground space-y-1">
          {query.data.warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <AlertCircle className="size-3 text-status-inferred" />
              <span className="font-mono">{w.code}</span>
              {w.message ? <span>· {w.message}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
