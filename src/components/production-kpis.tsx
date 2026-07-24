import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, Gauge } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import { Skeleton } from "@/components/ui/skeleton";

type Sample = {
  name: string;
  value: string;
  numeric?: boolean;
  numericValue?: number;
  labels?: Record<string, string>;
};

type MonitorResponse = {
  namespace?: string;
  source?: string;
  period?: string;
  samples?: Sample[];
  sampleCount?: number;
  warnings?: { code: string; message: string }[];
};

export function ProductionKPIs({
  productionName,
  namespace,
}: {
  productionName: string;
  namespace?: string;
}) {
  const nsParam = namespace ? `&namespace=${encodeURIComponent(namespace)}` : "";

  const volume = useQuery<MonitorResponse>({
    queryKey: ["kpis", "volume", "historical", namespace ?? ""],
    queryFn: () =>
      apiFetch<MonitorResponse>(
        `/monitor/interop/volume?period=historical${nsParam}`,
      ),
    retry: 0,
  });

  const volumeCurrent = useQuery<MonitorResponse>({
    queryKey: ["kpis", "volume", "current", namespace ?? ""],
    queryFn: () =>
      apiFetch<MonitorResponse>(
        `/monitor/interop/volume?period=current${nsParam}`,
      ),
    retry: 0,
  });

  const metrics = useQuery<MonitorResponse>({
    queryKey: ["kpis", "metrics", "interop"],
    queryFn: () =>
      apiFetch<MonitorResponse>(`/monitor/metrics/interop?limit=500`),
    retry: 0,
  });

  const anyLoading = volume.isLoading || volumeCurrent.isLoading || metrics.isLoading;

  const volumeSamples = volume.data?.samples ?? [];
  const metricsSamples = metrics.data?.samples ?? [];

  const messages24h = useMemo(
    () => sumNumeric(volumeSamples),
    [volumeSamples],
  );

  const buckets = useMemo(
    () => buildVolumeBuckets(volumeSamples),
    [volumeSamples],
  );

  const throughputPerMin = useMemo(() => {
    const curSum = sumNumeric(volumeCurrent.data?.samples ?? []);
    if (curSum > 0) return curSum;
    const m = firstMatch(metricsSamples, /throughput|per_min|rate/i);
    return m?.numericValue;
  }, [volumeCurrent.data, metricsSamples]);

  const avgProcessingMs = useMemo(() => {
    const m = firstMatch(metricsSamples, /processing|proc_time|duration|latency|elapsed/i);
    return m?.numericValue;
  }, [metricsSamples]);

  const queued = useMemo(() => {
    const m = firstMatch(metricsSamples, /queue|pending|waiting|backlog/i);
    return m?.numericValue ?? 0;
  }, [metricsSamples]);

  const activeSessions = useMemo(() => {
    const m = firstMatch(metricsSamples, /session|active_host|alive|running/i);
    return m?.numericValue;
  }, [metricsSamples]);

  const alertDelay = useMemo(() => {
    const m = firstMatch(metricsSamples, /alert_delay|alert/i);
    return m?.numericValue;
  }, [metricsSamples]);

  const errors24h = useMemo(() => {
    // Approximate: sum any metric sample matching error/failed
    const m = metricsSamples.filter((s) => /error|failed/i.test(s.name));
    if (m.length === 0) return 0;
    return m.reduce((acc, s) => acc + (s.numericValue ?? 0), 0);
  }, [metricsSamples]);

  const featured = useMemo(() => {
    // Keep the most operationally-useful metrics first
    const preferred = /host|throughput|queue|error|session|alert|processing|latency|count|rate/i;
    const seen = new Set<string>();
    const preferredMatches: Sample[] = [];
    const others: Sample[] = [];
    for (const s of metricsSamples) {
      if (!s.numeric) continue;
      const key = `${s.name}::${JSON.stringify(s.labels ?? {})}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (preferred.test(s.name)) preferredMatches.push(s);
      else others.push(s);
    }
    return [...preferredMatches, ...others].slice(0, 12);
  }, [metricsSamples]);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi
          label="Messages"
          value={anyLoading ? undefined : messages24h}
          unit="24h"
          footer="live window"
          tone="neutral"
        />
        <Kpi
          label="Throughput"
          value={anyLoading ? undefined : throughputPerMin}
          unit="/min"
          footer="monitor metrics"
          tone="brand"
          fractional
        />
        <Kpi
          label="Avg processing"
          value={anyLoading ? undefined : avgProcessingMs}
          unit="ms"
          footer="from iris_interop"
          tone="brand"
          fractional
        />
        <Kpi
          label="Queued"
          value={anyLoading ? undefined : queued}
          footer="current filter"
          tone="brand"
        />
        <Kpi
          label="Errors"
          value={anyLoading ? undefined : errors24h}
          unit="24h"
          footer="needs review"
          tone={(errors24h ?? 0) > 0 ? "error" : "neutral"}
          footerTone={(errors24h ?? 0) > 0 ? "error" : "brand"}
        />
        <Kpi
          label="Active sessions"
          value={anyLoading ? undefined : activeSessions}
          footer="recent messages"
          tone="brand"
        />
        <Kpi
          label="Alert delay"
          value={anyLoading ? undefined : alertDelay}
          unit="s"
          footer="iris_interop_alert_delay"
          tone="neutral"
        />
        <KpiLink
          label="Explore"
          value="Messages"
          footer={`filter: ${productionName}`}
          to="/messages"
          search={{ productionName } as unknown as never}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card ring-1 ring-black/5 rounded-lg p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="size-4 text-iris-brand" /> Message volume
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                monitor/interop/volume · last 24h
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              per hour
            </span>
          </div>
          {volume.isLoading ? (
            <Skeleton className="h-40 mt-4 rounded" />
          ) : volume.error ? (
            <ErrorNote error={volume.error as Error} />
          ) : (
            <VolumeChart buckets={buckets} />
          )}
        </div>

        <div className="bg-card ring-1 ring-black/5 rounded-lg p-5 flex flex-col min-h-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Gauge className="size-4 text-iris-brand" /> Interop metrics
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                monitor/metrics/interop
              </p>
            </div>
            <Link
              to="/metrics"
              className="text-[11px] font-mono text-iris-brand hover:underline"
            >
              open →
            </Link>
          </div>
          {metrics.isLoading ? (
            <Skeleton className="h-40 rounded" />
          ) : metrics.error ? (
            <ErrorNote error={metrics.error as Error} />
          ) : featured.length === 0 ? (
            <p className="text-xs text-muted-foreground font-mono">
              No numeric samples.
            </p>
          ) : (
            <ul className="divide-y text-xs font-mono">
              {featured.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between py-2 gap-3"
                >
                  <span className="truncate text-foreground/85">{s.name}</span>
                  <span className="tabular-nums font-semibold text-foreground">
                    {formatValue(s.numericValue ?? Number(s.value))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  unit,
  footer,
  tone = "neutral",
  footerTone,
  fractional,
}: {
  label: string;
  value?: number;
  unit?: string;
  footer?: string;
  tone?: "neutral" | "brand" | "error";
  footerTone?: "neutral" | "brand" | "error";
  fractional?: boolean;
}) {
  const valueColor =
    tone === "error"
      ? "text-destructive"
      : tone === "brand"
        ? "text-foreground"
        : "text-foreground";
  const footerColor =
    (footerTone ?? tone) === "error"
      ? "text-destructive"
      : (footerTone ?? tone) === "brand"
        ? "text-iris-brand"
        : "text-muted-foreground";
  return (
    <div className="bg-card ring-1 ring-black/5 rounded-lg p-4 flex flex-col justify-between min-h-[112px]">
      <div className="text-[11px] font-medium text-muted-foreground">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={`text-4xl font-bold tabular-nums ${valueColor}`}>
          {value === undefined || Number.isNaN(value)
            ? "—"
            : fractional
              ? formatValue(value)
              : Math.round(value).toLocaleString()}
        </span>
        {unit ? (
          <span className="text-xs text-muted-foreground">{unit}</span>
        ) : null}
      </div>
      {footer ? (
        <div className={`text-[11px] mt-1 ${footerColor}`}>{footer}</div>
      ) : null}
    </div>
  );
}

function KpiLink({
  label,
  value,
  footer,
  to,
  search,
}: {
  label: string;
  value: string;
  footer?: string;
  to: string;
  search?: never;
}) {
  return (
    <Link
      to={to as never}
      search={search}
      className="bg-card ring-1 ring-black/5 rounded-lg p-4 flex flex-col justify-between min-h-[112px] hover:ring-iris-brand/40 hover:bg-iris-brand/5 transition-colors"
    >
      <div className="text-[11px] font-medium text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-bold text-iris-brand mt-1">{value} →</div>
      {footer ? (
        <div className="text-[11px] mt-1 font-mono text-muted-foreground truncate">
          {footer}
        </div>
      ) : null}
    </Link>
  );
}

function VolumeChart({ buckets }: { buckets: { label: string; value: number }[] }) {
  if (buckets.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-mono mt-4">
        No volume samples returned.
      </p>
    );
  }
  const max = Math.max(1, ...buckets.map((b) => b.value));
  const lastIdx = buckets.length - 1;
  return (
    <div className="mt-4">
      <div className="flex items-end gap-1.5 h-40">
        {buckets.map((b, i) => {
          const h = Math.max(2, (b.value / max) * 100);
          const active = i === lastIdx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-sm transition-all ${
                  active ? "bg-iris-brand" : "bg-iris-brand/25"
                }`}
                style={{ height: `${h}%` }}
                title={`${b.label}: ${formatValue(b.value)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
        {pickAxis(buckets).map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function ErrorNote({ error }: { error: Error }) {
  return (
    <div className="mt-3 flex items-start gap-2 text-[11px] font-mono text-destructive/90">
      <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
      <span className="break-all">{error.message}</span>
    </div>
  );
}

/* -------- helpers -------- */

function sumNumeric(samples: Sample[]): number {
  return samples.reduce((acc, s) => {
    if (typeof s.numericValue === "number") return acc + s.numericValue;
    const n = Number(s.value);
    return Number.isFinite(n) ? acc + n : acc;
  }, 0);
}

function firstMatch(samples: Sample[], re: RegExp): Sample | undefined {
  return samples.find((s) => s.numeric && re.test(s.name));
}

function buildVolumeBuckets(samples: Sample[]): { label: string; value: number }[] {
  // Try to key by a time-like label
  const timeKeys = ["hour", "bucket", "time", "interval", "timestamp", "date", "period"];
  const keyed = samples
    .map((s) => {
      const labels = s.labels ?? {};
      const key = timeKeys
        .map((k) => labels[k])
        .find((v) => typeof v === "string" && v.length > 0);
      const value =
        typeof s.numericValue === "number"
          ? s.numericValue
          : Number(s.value);
      if (!Number.isFinite(value)) return null;
      return { key: key ?? s.name, value };
    })
    .filter(Boolean) as { key: string; value: number }[];

  if (keyed.length === 0) return [];

  // Merge same keys
  const grouped = new Map<string, number>();
  for (const { key, value } of keyed) {
    grouped.set(key, (grouped.get(key) ?? 0) + value);
  }
  const entries = Array.from(grouped.entries());
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  return entries.slice(-24).map(([k, v]) => ({ label: shortLabel(k), value: v }));
}

function shortLabel(k: string): string {
  // Try to shorten ISO-ish timestamps to HH:MM
  const m = k.match(/T?(\d{2}):(\d{2})/);
  if (m) return `${m[1]}:${m[2]}`;
  return k.length > 8 ? k.slice(-8) : k;
}

function pickAxis(buckets: { label: string }[]): string[] {
  if (buckets.length <= 4) return buckets.map((b) => b.label);
  const first = buckets[0].label;
  const q = buckets[Math.floor(buckets.length / 4)].label;
  const mid = buckets[Math.floor(buckets.length / 2)].label;
  const tq = buckets[Math.floor((buckets.length * 3) / 4)].label;
  return [first, q, mid, tq, "now"];
}

function formatValue(v: number): string {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (Math.abs(v) >= 1_000) return (v / 1_000).toFixed(1) + "k";
  if (Number.isInteger(v)) return v.toLocaleString();
  return v.toFixed(2);
}
