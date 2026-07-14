import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/api-reference")({
  head: () => ({ meta: [{ title: "API Reference — IRIS Explainer" }] }),
  component: ApiReferencePage,
});

type SwaggerSpec = {
  info?: { title?: string; version?: string; description?: string };
  basePath?: string;
  paths?: Record<string, Record<string, {
    summary?: string;
    operationId?: string;
    parameters?: Array<{ name: string; in: string; required?: boolean; type?: string }>;
    responses?: Record<string, { description?: string }>;
  }>>;
};

const METHOD_COLORS: Record<string, string> = {
  get: "text-status-observed border-status-observed/30 bg-status-observed/10",
  post: "text-status-confirmed border-status-confirmed/30 bg-status-confirmed/10",
  put: "text-status-inferred border-status-inferred/30 bg-status-inferred/10",
  delete: "text-destructive border-destructive/30 bg-destructive/10",
};

function ApiReferencePage() {
  const { data, isLoading, error } = useQuery<SwaggerSpec>({
    queryKey: ["spec"],
    queryFn: () => apiFetch<SwaggerSpec>("/_spec"),
    retry: 0,
  });

  const endpoints = useMemo(() => {
    if (!data?.paths) return [];
    const rows: Array<{
      path: string;
      method: string;
      op: SwaggerSpec["paths"] extends Record<string, infer V> ? V[keyof V] : never;
    }> = [];
    for (const [path, methods] of Object.entries(data.paths)) {
      for (const [method, op] of Object.entries(methods)) {
        rows.push({ path, method, op: op as never });
      }
    }
    return rows;
  }, [data]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Module" }]}
        title="API Reference"
        status={data?.info?.version ? { label: `v${data.info.version}`, tone: "observed" } : undefined}
      />

      <div className="p-8 space-y-6 max-w-5xl">
        {data?.info ? (
          <div>
            <h2 className="text-lg font-semibold">{data.info.title}</h2>
            {data.info.description ? (
              <p className="text-sm text-muted-foreground mt-1">
                {data.info.description}
              </p>
            ) : null}
            {data.basePath ? (
              <p className="text-[11px] font-mono text-muted-foreground mt-2">
                Base path: <span className="text-foreground/80">{data.basePath}</span>
              </p>
            ) : null}
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="text-sm font-semibold text-destructive mb-1">
              Failed to load /_spec
            </div>
            <p className="text-xs font-mono text-destructive/80 break-all">
              {(error as Error).message}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {endpoints.map((e) => (
              <EndpointRow key={`${e.method} ${e.path}`} {...e} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function EndpointRow({
  path,
  method,
  op,
}: {
  path: string;
  method: string;
  op: {
    summary?: string;
    operationId?: string;
    parameters?: Array<{ name: string; in: string; required?: boolean; type?: string }>;
    responses?: Record<string, { description?: string }>;
  };
}) {
  const [open, setOpen] = useState(false);
  const color = METHOD_COLORS[method.toLowerCase()] ?? "text-foreground border-border bg-muted";
  return (
    <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/40 transition-colors"
      >
        <span
          className={`text-[10px] font-mono font-bold px-2 py-1 rounded border uppercase ${color}`}
        >
          {method}
        </span>
        <span className="text-sm font-mono truncate flex-1">{path}</span>
        <span className="text-xs text-muted-foreground truncate hidden md:block">
          {op.summary}
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="border-t p-4 space-y-4 bg-muted/20">
          {op.operationId ? (
            <Detail label="Operation ID" value={op.operationId} mono />
          ) : null}
          {op.parameters && op.parameters.length > 0 ? (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Parameters
              </div>
              <div className="space-y-1">
                {op.parameters.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 text-[11px] font-mono"
                  >
                    <span className="text-foreground/90">{p.name}</span>
                    <span className="text-muted-foreground">in {p.in}</span>
                    <span className="text-muted-foreground">{p.type}</span>
                    {p.required ? (
                      <span className="text-status-inferred text-[9px] uppercase">
                        required
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {op.responses ? (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Responses
              </div>
              <div className="space-y-1">
                {Object.entries(op.responses).map(([code, r]) => (
                  <div key={code} className="text-[11px] font-mono flex gap-3">
                    <span className="text-foreground/90">{code}</span>
                    <span className="text-muted-foreground">{r.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <div className={`text-[11px] ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
