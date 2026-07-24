import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, Layers } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import { Skeleton } from "@/components/ui/skeleton";

type MessageHeader = {
  messageId?: number;
  sessionId?: number;
  timeCreated?: string;
  timeProcessed?: string;
  status?: string;
  isError?: boolean;
};

type MessageListResponse = {
  items?: MessageHeader[];
  totalCount?: number;
  errorCount?: number;
  hasMore?: boolean;
};

type FacetResponse = {
  totalCount?: number;
  errorCount?: number;
  sessionIds?: string[];
  sourceConfigNames?: string[];
  targetConfigNames?: string[];
  componentNames?: string[];
  metrics?: { totalCount?: number; errorCount?: number };
};

export function ProductionKPIs({ productionName }: { productionName: string }) {
  const now = useMemo(() => new Date(), []);
  const startOfDay = useMemo(() => {
    const d = new Date(now.getTime() - 24 * 3600_000);
    return d.toISOString();
  }, [now]);
  const startOfHour = useMemo(
    () => new Date(now.getTime() - 60 * 60_000).toISOString(),
    [now],
  );

  const base = `/productions/${encodeURIComponent(productionName)}`;

  const facets24h = useQuery<FacetResponse>({
    queryKey: ["prod-kpi", productionName, "facets24h"],
    queryFn: () =>
      apiFetch<FacetResponse>(
        `${base}/messages/facets?startDate=${encodeURIComponent(startOfDay)}&limit=500`,
      ),
    retry: 0,
  });

  const facets1h = useQuery<FacetResponse>({
    queryKey: ["prod-kpi", productionName, "facets1h"],
    queryFn: () =>
      apiFetch<FacetResponse>(
        `${base}/messages/facets?startDate=${encodeURIComponent(startOfHour)}&limit=500`,
      ),
    retry: 0,
  });

  const messages24h = useQuery<MessageListResponse>({
    queryKey: ["prod-kpi", productionName, "messages24h"],
    queryFn: () =>
      apiFetch<MessageListResponse>(
        `${base}/messages?startDate=${encodeURIComponent(startOfDay)}&limit=500`,
      ),
    retry: 0,
  });

  const anyLoading =
    facets24h.isLoading || facets1h.isLoading || messages24h.isLoading;

  const total24 =
    facets24h.data?.totalCount ??
    facets24h.data?.metrics?.totalCount ??
    messages24h.data?.totalCount ??
    messages24h.data?.items?.length ??
    0;
  const errors24 =
    facets24h.data?.errorCount ??
    facets24h.data?.metrics?.errorCount ??
    messages24h.data?.errorCount ??
    0;
  const total1h =
    facets1h.data?.totalCount ?? facets1h.data?.metrics?.totalCount ?? 0;
  const throughputPerMin = total1h / 60;

  const activeSessions = facets24h.data?.sessionIds?.length ?? 0;
  const componentCount =
    facets24h.data?.componentNames?.length ??
    (facets24h.data?.sourceConfigNames?.length ?? 0) +
      (facets24h.data?.targetConfigNames?.length ?? 0);

  const items = messages24h.data?.items ?? [];

  const avgProcessingMs = useMemo(() => {
    const diffs: number[] = [];
    for (const m of items) {
      if (!m.timeCreated || !m.timeProcessed) continue;
      const a = Date.parse(m.timeCreated);
      const b = Date.parse(m.timeProcessed);
      if (Number.isFinite(a) && Number.isFinite(b) && b >= a) diffs.push(b - a);
    }
    if (diffs.length === 0) return undefined;
    return diffs.reduce((x, y) => x + y, 0) / diffs.length;
  }, [items]);

  const queued = useMemo(() => {
    return items.filter(
      (m) =>
        !m.timeProcessed ||
        /queue|pending|deferred|hold/i.test(m.status ?? ""),
    ).length;
  }, [items]);

  const buckets = useMemo(() => buildHourlyBuckets(items, now), [items, now]);

  const topSources = facets24h.data?.sourceConfigNames?.slice(0, 6) ?? [];
  const topTargets = facets24h.data?.targetConfigNames?.slice(0, 6) ?? [];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi
          label="Messages"
          value={anyLoading ? undefined : total24}
          unit="24h"
          footer={`production: ${productionName}`}
          tone="neutral"
        />
        <Kpi
          label="Throughput"
          value={anyLoading ? undefined : throughputPerMin}
          unit="/min"
          footer="last hour"
          tone="brand"
          fractional
        />
        <Kpi
          label="Avg processing"
          value={anyLoading ? undefined : avgProcessingMs}
          unit="ms"
          footer={
            avgProcessingMs === undefined
              ? "no processed samples"
              : "mean · processed - created"
          }
          tone="brand"
          fractional
        />
        <Kpi
          label="Queued"
          value={anyLoading ? undefined : queued}
          footer="unprocessed in window"
          tone="brand"
        />
        <Kpi
          label="Errors"
          value={anyLoading ? undefined : errors24}
          unit="24h"
          footer={errors24 > 0 ? "needs review" : "clean"}
          tone={errors24 > 0 ? "error" : "neutral"}
          footerTone={errors24 > 0 ? "error" : "brand"}
        />
        <Kpi
          label="Active sessions"
          value={anyLoading ? undefined : activeSessions}
          footer="distinct in 24h"
          tone="brand"
        />
        <Kpi
          label="Components touched"
          value={anyLoading ? undefined : componentCount}
          footer="sources + targets"
          tone="neutral"
        />
        <KpiLink
          label="Explore"
          value="Messages"
          footer={productionName}
          to="/productions/$name/messages"
          params={{ name: productionName }}
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
                {productionName} · last 24h · per hour
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {total24.toLocaleString()} msgs
            </span>
          </div>
          {messages24h.isLoading ? (
            <Skeleton className="h-40 mt-4 rounded" />
          ) : messages24h.error ? (
            <ErrorNote error={messages24h.error as Error} />
          ) : (
            <VolumeChart buckets={buckets} />
          )}
        </div>

        <div className="bg-card ring-1 ring-black/5 rounded-lg p-5 flex flex-col min-h-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Layers className="size-4 text-iris-brand" /> Top components
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                messages/facets · last 24h
              </p>
            </div>
            <Link
              to="/metrics"
              className="text-[11px] font-mono text-iris-brand hover:underline"
            >
              namespace metrics →
            </Link>
          </div>
          {facets24h.isLoading ? (
            <Skeleton className="h-40 rounded" />
          ) : facets24h.error ? (
            <ErrorNote error={facets24h.error as Error} />
          ) : (
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <FacetList title="Sources" items={topSources} />
              <FacetList title="Targets" items={topTargets} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FacetList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {title}
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground">—</p>
      ) : (
        <ul className="space-y-1">
          {items.map((s, i) => (
            <li key={i} className="truncate text-foreground/85" title={s}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
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
  const valueColor = tone === "error" ? "text-destructive" : "text-foreground";
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
        <div className={`text-[11px] mt-1 truncate ${footerColor}`}>
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function KpiLink({
  label,
  value,
  footer,
  to,
  params,
}: {
  label: string;
  value: string;
  footer?: string;
  to: string;
  params?: Record<string, string>;
}) {
  return (
    <Link
      to={to as never}
      params={params as never}
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

function VolumeChart({
  buckets,
}: {
  buckets: { label: string; value: number }[];
}) {
  if (buckets.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-mono mt-4">
        No messages in the last 24 hours.
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

function buildHourlyBuckets(
  items: MessageHeader[],
  now: Date,
): { label: string; value: number }[] {
  const buckets: { label: string; value: number; ts: number }[] = [];
  const endMs = now.getTime();
  for (let i = 23; i >= 0; i--) {
    const ts = endMs - i * 3600_000;
    const d = new Date(ts);
    buckets.push({
      label: `${String(d.getHours()).padStart(2, "0")}:00`,
      value: 0,
      ts,
    });
  }
  const startMs = endMs - 24 * 3600_000;
  for (const m of items) {
    if (!m.timeCreated) continue;
    const t = Date.parse(m.timeCreated);
    if (!Number.isFinite(t) || t < startMs || t > endMs) continue;
    const idx = 23 - Math.floor((endMs - t) / 3600_000);
    if (idx >= 0 && idx < buckets.length) buckets[idx].value += 1;
  }
  return buckets.map(({ label, value }) => ({ label, value }));
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
