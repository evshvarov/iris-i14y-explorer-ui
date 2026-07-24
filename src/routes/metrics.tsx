import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { RefreshCw, Search, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";


import { apiFetch } from "@/lib/api-config";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricChip, MetricChips } from "@/components/summary-bits";

export const Route = createFileRoute("/metrics")({
  head: () => ({
    meta: [
      { title: "Metrics — IRIS Explainer" },
      {
        name: "description",
        content:
          "Sanitized interoperability metrics from the i14y-aid wrappers around /api/monitor.",
      },
    ],
  }),
  component: MetricsPage,
});

type MonitorSample = {
  name: string;
  value: string;
  numeric?: boolean;
  numericValue?: number;
  labels?: Record<string, string>;
  labelCount?: number;
};

type MonitorWarning = { code: string; message: string };

type MonitorEvidence = {
  type?: string;
  source?: string;
  component?: string;
  field?: string;
  value?: string;
  confidence?: string;
};

type MonitorWrapperMetrics = { sampleCount?: number; httpStatus?: number };

type MonitorBaseResponse = {
  namespace?: string;
  source?: string;
  samples?: MonitorSample[];
  sampleCount?: number;
  metrics?: MonitorWrapperMetrics;
  warnings?: MonitorWarning[];
  evidence?: MonitorEvidence[];
};

type RangeResponse = MonitorBaseResponse & {
  period?: string;
  startDate?: string;
  endDate?: string;
};

type VolumeResponse = MonitorBaseResponse & {
  period?: string;
  namespaceFilter?: string;
};

type MetricsResponse = MonitorBaseResponse;

function MetricsPage() {
  const [period, setPeriod] = useState<"current" | "historical">("current");
  const [namespace, setNamespace] = useState("");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(200);

  const range = useQuery<RangeResponse>({
    queryKey: ["monitor", "interop", "range", period],
    queryFn: () =>
      apiFetch<RangeResponse>(
        `/monitor/interop/range?period=${encodeURIComponent(period)}`,
      ),
    retry: 0,
  });

  const volume = useQuery<VolumeResponse>({
    queryKey: ["monitor", "interop", "volume", period, namespace],
    queryFn: () => {
      const params = new URLSearchParams({ period });
      if (namespace.trim()) params.set("namespace", namespace.trim());
      return apiFetch<VolumeResponse>(`/monitor/interop/volume?${params}`);
    },
    retry: 0,
  });

  const metrics = useQuery<MetricsResponse>({
    queryKey: ["monitor", "metrics", "interop", limit],
    queryFn: () =>
      apiFetch<MetricsResponse>(`/monitor/metrics/interop?limit=${limit}`),
    retry: 0,
  });

  const enableMutation = useMutation<
    { enabled?: boolean; namespace?: string; message?: string } & Record<string, unknown>,
    Error,
    void
  >({
    mutationFn: async () => {
      const params = new URLSearchParams();
      if (namespace.trim()) params.set("namespace", namespace.trim());
      const qs = params.toString();
      return apiFetch(
        `/monitor/metrics/interop/enable${qs ? `?${qs}` : ""}`,
        { method: "POST" },
      );
    },
    onSuccess: () => {
      metrics.refetch();
      range.refetch();
      volume.refetch();
    },
  });

  const anyLoading =
    range.isFetching || volume.isFetching || metrics.isFetching;

  const refetch = () => {
    range.refetch();
    volume.refetch();
    metrics.refetch();
  };


  const filteredMetrics = useMemo(() => {
    const samples = metrics.data?.samples ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return samples;
    return samples.filter((s) => {
      if (s.name.toLowerCase().includes(term)) return true;
      for (const [k, v] of Object.entries(s.labels ?? {})) {
        if (k.toLowerCase().includes(term) || v.toLowerCase().includes(term))
          return true;
      }
      return false;
    });
  }, [metrics.data, q]);

  const allWarnings = [
    ...(range.data?.warnings ?? []),
    ...(volume.data?.warnings ?? []),
    ...(metrics.data?.warnings ?? []),
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Monitor" }]}
        title="Metrics"
        status={{
          label: anyLoading ? "Fetching" : "Live",
          tone: "observed",
        }}
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={period}
              onValueChange={(v) => setPeriod(v as "current" | "historical")}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">current</SelectItem>
                <SelectItem value="historical">historical</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={anyLoading}
              className="h-8"
            >
              <RefreshCw
                className={`size-3.5 mr-1.5 ${anyLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-8">
        {allWarnings.length > 0 ? (
          <div className="rounded-lg border border-status-inferred/30 bg-status-inferred/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4 text-status-inferred" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-status-inferred">
                {allWarnings.length} warning{allWarnings.length === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="space-y-1 text-xs font-mono">
              {allWarnings.map((w, i) => (
                <li key={i}>
                  <span className="text-status-inferred">{w.code}</span>
                  <span className="text-muted-foreground"> — {w.message}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Interop range */}
        <Section
          title="Interop range"
          endpoint="GET /monitor/interop/range"
          loading={range.isLoading}
          error={range.error as Error | null}
        >
          {range.data ? (
            <div className="bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-3">
              <MetricChips>
                <MetricChip
                  label="Namespace"
                  value={range.data.namespace ?? "—"}
                  tone="brand"
                />
                <MetricChip label="Period" value={range.data.period ?? period} />
                <MetricChip
                  label="Start"
                  value={range.data.startDate ?? "—"}
                  tone="observed"
                />
                <MetricChip
                  label="End"
                  value={range.data.endDate ?? "—"}
                  tone="observed"
                />
                <MetricChip
                  label="Samples"
                  value={range.data.sampleCount ?? range.data.samples?.length ?? 0}
                />
              </MetricChips>
              {range.data.samples && range.data.samples.length > 0 ? (
                <SampleTable samples={range.data.samples} compact />
              ) : null}
            </div>
          ) : null}
        </Section>

        {/* Volume */}
        <Section
          title="Interop volume"
          endpoint="GET /monitor/interop/volume"
          loading={volume.isLoading}
          error={volume.error as Error | null}
          extra={
            <div className="relative w-56">
              <Input
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                placeholder="namespace (blank = current, * = all)"
                className="h-8 font-mono text-xs bg-card"
              />
            </div>
          }
        >
          {volume.data ? (
            <div className="bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-3">
              <MetricChips>
                <MetricChip
                  label="Namespace"
                  value={volume.data.namespace ?? "—"}
                  tone="brand"
                />
                <MetricChip
                  label="Filter"
                  value={volume.data.namespaceFilter ?? "—"}
                />
                <MetricChip
                  label="Period"
                  value={volume.data.period ?? period}
                />
                <MetricChip
                  label="Samples"
                  value={
                    volume.data.sampleCount ?? volume.data.samples?.length ?? 0
                  }
                />
              </MetricChips>
              {volume.data.samples && volume.data.samples.length > 0 ? (
                <SampleTable samples={volume.data.samples} />
              ) : (
                <p className="text-xs text-muted-foreground font-mono">
                  No volume samples returned.
                </p>
              )}
            </div>
          ) : null}
        </Section>

        {/* Metrics samples */}
        <Section
          title="Interop OpenMetrics samples"
          endpoint="GET /monitor/metrics/interop"
          loading={metrics.isLoading}
          error={metrics.error as Error | null}
          extra={
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter name or label…"
                  className="pl-9 h-8 font-mono text-xs bg-card"
                />
              </div>
              <Select
                value={String(limit)}
                onValueChange={(v) => setLimit(Number(v))}
              >
                <SelectTrigger className="h-8 w-[110px] text-xs font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[50, 100, 200, 500, 1000].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      limit {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        >
          {metrics.data ? (
            <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
              <div className="flex flex-wrap gap-4 px-5 py-3 border-b bg-muted/20 text-[11px] font-mono text-muted-foreground">
                <span>
                  namespace:{" "}
                  <span className="text-foreground">
                    {metrics.data.namespace ?? "—"}
                  </span>
                </span>
                <span>
                  source:{" "}
                  <span className="text-foreground">
                    {metrics.data.source ?? "—"}
                  </span>
                </span>
                <span>
                  samples:{" "}
                  <span className="text-foreground">
                    {filteredMetrics.length} /{" "}
                    {metrics.data.sampleCount ?? metrics.data.samples?.length ?? 0}
                  </span>
                </span>
              </div>
              <SampleTable samples={filteredMetrics} scroll />
            </div>
          ) : null}
        </Section>

        {/* Evidence */}
        {(() => {
          const evidence = [
            ...(range.data?.evidence ?? []),
            ...(volume.data?.evidence ?? []),
            ...(metrics.data?.evidence ?? []),
          ];
          if (evidence.length === 0) return null;
          return (
            <section className="space-y-3">
              <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Evidence · {evidence.length}
              </h2>
              <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-2">Type</th>
                      <th className="text-left px-4 py-2">Source</th>
                      <th className="text-left px-4 py-2">Component</th>
                      <th className="text-left px-4 py-2">Field</th>
                      <th className="text-left px-4 py-2">Value</th>
                      <th className="text-left px-4 py-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {evidence.slice(0, 200).map((e, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-2">{e.type ?? "—"}</td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {e.source ?? "—"}
                        </td>
                        <td className="px-4 py-2">{e.component ?? "—"}</td>
                        <td className="px-4 py-2">{e.field ?? "—"}</td>
                        <td className="px-4 py-2 break-all">{e.value ?? "—"}</td>
                        <td className="px-4 py-2 uppercase text-[10px]">
                          {e.confidence ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}
      </div>
    </>
  );
}

function Section({
  title,
  endpoint,
  loading,
  error,
  extra,
  children,
}: {
  title: string;
  endpoint: string;
  loading: boolean;
  error: Error | null;
  extra?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {endpoint}
          </p>
        </div>
        {extra}
      </div>
      {loading ? (
        <Skeleton className="h-32 rounded-lg" />
      ) : error ? (
        <ErrorBox err={error} />
      ) : (
        children
      )}
    </section>
  );
}

function SampleTable({
  samples,
  compact,
  scroll,
}: {
  samples: MonitorSample[];
  compact?: boolean;
  scroll?: boolean;
}) {
  if (!samples || samples.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-mono">No samples.</p>
    );
  }
  return (
    <div className={scroll ? "max-h-[600px] overflow-auto" : ""}>
      <table className="w-full text-xs font-mono">
        <thead className="bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground sticky top-0">
          <tr>
            <th className="text-left px-4 py-2">Metric</th>
            <th className="text-left px-4 py-2">Labels</th>
            <th className="text-right px-4 py-2 w-[140px]">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {samples.slice(0, compact ? 20 : 500).map((s, i) => (
            <tr key={i} className="hover:bg-muted/30">
              <td className="px-4 py-1.5 align-top">
                <div className="truncate">{s.name}</div>
              </td>
              <td className="px-4 py-1.5 align-top">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(s.labels ?? {}).map(([k, v]) => (
                    <span
                      key={k}
                      className="text-[10px] px-1.5 py-0.5 rounded ring-1 ring-black/10 bg-muted/60"
                    >
                      <span className="text-muted-foreground">{k}=</span>
                      <span className="text-foreground/90">{v}</span>
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-1.5 text-right tabular-nums align-top">
                {s.numeric && typeof s.numericValue === "number"
                  ? formatValue(s.numericValue)
                  : s.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {samples.length > (compact ? 20 : 500) ? (
        <div className="px-4 py-2 text-[10px] font-mono uppercase text-muted-foreground text-center">
          …{samples.length - (compact ? 20 : 500)} more
        </div>
      ) : null}
    </div>
  );
}

function formatValue(v: number): string {
  if (!Number.isFinite(v)) return String(v);
  if (Math.abs(v) >= 1e6) return v.toExponential(3);
  if (Number.isInteger(v)) return v.toLocaleString();
  return v.toFixed(3);
}

function ErrorBox({ err }: { err: Error }) {
  return (
    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
      <div className="text-sm font-semibold text-destructive mb-1">
        Monitor request failed
      </div>
      <p className="text-xs font-mono text-destructive/80 break-all">
        {err.message}
      </p>
    </div>
  );
}
