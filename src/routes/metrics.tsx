import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Activity, RefreshCw, Search } from "lucide-react";

import { getApiConfig } from "@/lib/api-config";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetricChip, MetricChips } from "@/components/summary-bits";

export const Route = createFileRoute("/metrics")({
  head: () => ({
    meta: [
      { title: "Metrics — IRIS Explainer" },
      {
        name: "description",
        content:
          "Live IRIS interoperability and system metrics from /api/monitor/interop and /api/monitor/metrics.",
      },
    ],
  }),
  component: MetricsPage,
});

function monitorOrigin(): string {
  const cfg = getApiConfig();
  try {
    return new URL(cfg.baseUrl).origin;
  } catch {
    return cfg.baseUrl.replace(/\/[^/]*$/, "");
  }
}

function authHeader(): Record<string, string> {
  const cfg = getApiConfig();
  if (!cfg.username && !cfg.password) return {};
  return { Authorization: `Basic ${btoa(`${cfg.username}:${cfg.password}`)}` };
}

async function fetchMonitor(path: string, accept: string): Promise<string> {
  const url = `${monitorOrigin()}${path}`;
  const res = await fetch(url, {
    headers: { Accept: accept, ...authHeader() },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`,
    );
  }
  return await res.text();
}

type PromSample = {
  name: string;
  labels: Record<string, string>;
  value: number;
  help?: string;
  type?: string;
};

function parsePrometheus(text: string): PromSample[] {
  const help: Record<string, string> = {};
  const type: Record<string, string> = {};
  const out: PromSample[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      const m = line.match(/^#\s+(HELP|TYPE)\s+(\S+)\s+(.*)$/);
      if (m) {
        if (m[1] === "HELP") help[m[2]] = m[3];
        else type[m[2]] = m[3];
      }
      continue;
    }
    const m = line.match(/^([a-zA-Z_:][a-zA-Z0-9_:]*)(\{([^}]*)\})?\s+([^\s]+)/);
    if (!m) continue;
    const name = m[1];
    const labelsRaw = m[3] ?? "";
    const value = Number(m[4]);
    if (!Number.isFinite(value)) continue;
    const labels: Record<string, string> = {};
    for (const part of labelsRaw.match(/([a-zA-Z_][a-zA-Z0-9_]*)="((?:[^"\\]|\\.)*)"/g) ?? []) {
      const pm = part.match(/([a-zA-Z_][a-zA-Z0-9_]*)="((?:[^"\\]|\\.)*)"/)!;
      labels[pm[1]] = pm[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    out.push({ name, labels, value, help: help[name], type: type[name] });
  }
  return out;
}

function MetricsPage() {
  const interop = useQuery({
    queryKey: ["monitor", "interop"],
    queryFn: () => fetchMonitor("/api/monitor/interop", "application/json"),
    retry: 0,
  });
  const prom = useQuery({
    queryKey: ["monitor", "metrics"],
    queryFn: () => fetchMonitor("/api/monitor/metrics", "text/plain"),
    retry: 0,
  });

  const [q, setQ] = useState("");
  const [onlyIris, setOnlyIris] = useState(true);

  const samples = useMemo(
    () => (prom.data ? parsePrometheus(prom.data) : []),
    [prom.data],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return samples.filter((s) => {
      if (onlyIris && !s.name.startsWith("iris_")) return false;
      if (!term) return true;
      if (s.name.toLowerCase().includes(term)) return true;
      for (const [k, v] of Object.entries(s.labels)) {
        if (k.toLowerCase().includes(term) || v.toLowerCase().includes(term))
          return true;
      }
      return false;
    });
  }, [samples, q, onlyIris]);

  const interopJson = useMemo(() => {
    if (!interop.data) return null;
    try {
      return JSON.parse(interop.data);
    } catch {
      return null;
    }
  }, [interop.data]);

  const productions = useMemo(() => extractProductions(interopJson), [interopJson]);

  const refetch = () => {
    interop.refetch();
    prom.refetch();
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Monitor" }]}
        title="Metrics"
        status={{
          label: prom.isLoading || interop.isLoading ? "Fetching" : "Live",
          tone: "observed",
        }}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={prom.isFetching || interop.isFetching}
            className="h-8"
          >
            <RefreshCw
              className={`size-3.5 mr-1.5 ${prom.isFetching || interop.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      <div className="p-8 space-y-8">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Interoperability
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                GET /api/monitor/interop
              </p>
            </div>
            {productions ? (
              <MetricChips>
                <MetricChip label="Productions" value={productions.length} tone="brand" />
                <MetricChip
                  label="Running"
                  value={productions.filter((p) => /run|ok/i.test(p.status ?? "")).length}
                  tone="confirmed"
                />
                <MetricChip
                  label="Items"
                  value={productions.reduce((n, p) => n + (p.items?.length ?? 0), 0)}
                />
              </MetricChips>
            ) : null}
          </div>

          {interop.isLoading ? (
            <Skeleton className="h-40 rounded-lg" />
          ) : interop.error ? (
            <ErrorBox err={interop.error as Error} />
          ) : productions && productions.length > 0 ? (
            <div className="space-y-4">
              {productions.map((p) => (
                <ProductionBlock key={p.name} p={p} />
              ))}
            </div>
          ) : interopJson ? (
            <RawJson value={interopJson} />
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground bg-card ring-1 ring-black/5 rounded-lg">
              No interop data.
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                System metrics
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                GET /api/monitor/metrics · Prometheus exposition
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyIris}
                  onChange={(e) => setOnlyIris(e.target.checked)}
                  className="accent-iris-brand"
                />
                iris_ only
              </label>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter name or label…"
                  className="pl-9 h-9 font-mono text-sm bg-card"
                />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground uppercase">
                {prom.isLoading ? "Loading…" : `${filtered.length} / ${samples.length}`}
              </span>
            </div>
          </div>

          {prom.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 rounded" />
              ))}
            </div>
          ) : prom.error ? (
            <ErrorBox err={prom.error as Error} />
          ) : (
            <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[minmax(220px,1fr)_2fr_140px] items-center gap-3 px-5 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                <span>Metric</span>
                <span>Labels</span>
                <span className="text-right">Value</span>
              </div>
              <ul className="divide-y max-h-[600px] overflow-auto">
                {filtered.slice(0, 500).map((s, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[minmax(220px,1fr)_2fr_140px] items-start gap-3 px-5 py-2 text-xs font-mono hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-foreground">{s.name}</div>
                      {s.help ? (
                        <div className="text-[10px] text-muted-foreground truncate">
                          {s.help}
                        </div>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex flex-wrap gap-1">
                      {Object.entries(s.labels).map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[10px] px-1.5 py-0.5 rounded ring-1 ring-black/10 bg-muted/60"
                        >
                          <span className="text-muted-foreground">{k}=</span>
                          <span className="text-foreground/90">{v}</span>
                        </span>
                      ))}
                    </div>
                    <div className="text-right tabular-nums text-foreground">
                      {formatValue(s.value)}
                    </div>
                  </li>
                ))}
                {filtered.length > 500 ? (
                  <li className="px-5 py-2 text-[10px] font-mono uppercase text-muted-foreground text-center">
                    …{filtered.length - 500} more. Refine the filter.
                  </li>
                ) : null}
                {filtered.length === 0 ? (
                  <li className="px-5 py-6 text-center text-sm text-muted-foreground">
                    No metrics match the filter.
                  </li>
                ) : null}
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function formatValue(v: number): string {
  if (!Number.isFinite(v)) return String(v);
  if (Math.abs(v) >= 1e6) return v.toExponential(3);
  if (Number.isInteger(v)) return v.toLocaleString();
  return v.toFixed(3);
}

type InteropProduction = {
  name: string;
  status?: string;
  lastStartTime?: string;
  items?: InteropItem[];
  raw: unknown;
};
type InteropItem = {
  name: string;
  category?: string;
  status?: string;
  metrics: Record<string, number | string>;
};

function extractProductions(json: unknown): InteropProduction[] | null {
  if (!json || typeof json !== "object") return null;
  const obj = json as Record<string, unknown>;
  const list =
    (obj.Productions as unknown[]) ??
    (obj.productions as unknown[]) ??
    (Array.isArray(json) ? (json as unknown[]) : null);
  if (!Array.isArray(list)) return null;
  return list.map((p) => {
    const r = (p ?? {}) as Record<string, unknown>;
    const name = String(r.Name ?? r.name ?? "(unnamed)");
    const items =
      (r.Items as unknown[]) ?? (r.items as unknown[]) ?? (r.HostItems as unknown[]) ?? [];
    return {
      name,
      status: (r.Status ?? r.status) as string | undefined,
      lastStartTime: (r.LastStartTime ?? r.lastStartTime) as string | undefined,
      items: Array.isArray(items) ? items.map(toItem) : [],
      raw: p,
    };
  });
}

function toItem(x: unknown): InteropItem {
  const r = (x ?? {}) as Record<string, unknown>;
  const name = String(r.Name ?? r.name ?? "");
  const category = (r.Category ?? r.category) as string | undefined;
  const status = (r.Status ?? r.status) as string | undefined;
  const metrics: Record<string, number | string> = {};
  for (const [k, v] of Object.entries(r)) {
    if (["Name", "name", "Category", "category", "Status", "status"].includes(k))
      continue;
    if (typeof v === "number" || typeof v === "string") metrics[k] = v;
  }
  return { name, category, status, metrics };
}

function ProductionBlock({ p }: { p: InteropProduction }) {
  const running = /run|ok|active/i.test(p.status ?? "");
  return (
    <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <Activity className="size-4 text-iris-brand shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{p.name}</div>
            {p.lastStartTime ? (
              <div className="text-[10px] font-mono text-muted-foreground">
                started {p.lastStartTime}
              </div>
            ) : null}
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded ring-1 text-[10px] font-mono uppercase tracking-wider ${
            running
              ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
              : "ring-black/10 bg-muted text-muted-foreground"
          }`}
        >
          {p.status ?? "unknown"}
        </span>
      </div>
      {p.items && p.items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead className="bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2 font-semibold">Host</th>
                <th className="text-left px-3 py-2 font-semibold">Category</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {p.items.map((it, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-5 py-2 text-foreground align-top">{it.name}</td>
                  <td className="px-3 py-2 text-muted-foreground align-top">
                    {it.category ?? "—"}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span
                      className={`px-1.5 py-0.5 rounded ring-1 text-[10px] uppercase ${
                        /ok|run/i.test(it.status ?? "")
                          ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
                          : "ring-black/10 bg-muted text-muted-foreground"
                      }`}
                    >
                      {it.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(it.metrics).map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[10px] px-1.5 py-0.5 rounded ring-1 ring-black/10 bg-muted/60"
                        >
                          <span className="text-muted-foreground">{k}=</span>
                          <span className="text-foreground/90">{String(v)}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-4 text-xs text-muted-foreground font-mono">
          No host items reported.
        </div>
      )}
    </div>
  );
}

function RawJson({ value }: { value: unknown }) {
  return (
    <pre className="bg-card ring-1 ring-black/5 rounded-lg p-4 text-[11px] font-mono overflow-auto max-h-[400px]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function ErrorBox({ err }: { err: Error }) {
  return (
    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
      <div className="text-sm font-semibold text-destructive mb-1">
        Monitor request failed
      </div>
      <p className="text-xs font-mono text-destructive/80 break-all">{err.message}</p>
      <p className="text-[11px] text-muted-foreground mt-2">
        The IRIS /api/monitor endpoints live on the server root, not under the i14y-aid
        API path. Ensure the configured user has the <span className="font-mono">%Service_Monitor</span> role
        and CORS allows this origin.
      </p>
    </div>
  );
}
