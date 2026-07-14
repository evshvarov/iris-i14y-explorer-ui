import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";

import { apiFetch, getApiConfig } from "@/lib/api-config";
import type { HealthResponse, CapabilitiesResponse } from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [{ title: "Health — IRIS Explainer" }],
  }),
  component: HealthPage,
});

function HealthPage() {
  const { data, error, isLoading, refetch, isFetching } = useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: () => apiFetch<HealthResponse>("/health"),
    retry: 0,
  });

  const caps = useQuery<CapabilitiesResponse>({
    queryKey: ["capabilities"],
    queryFn: () => apiFetch<CapabilitiesResponse>("/capabilities"),
    retry: 0,
  });

  const cfg = getApiConfig();
  const ok = !!data && !error;

  const capEntries: [string, unknown][] = caps.data
    ? Object.entries(caps.data).filter(([k]) => k !== "namespace")
    : [];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Module" }]}
        title="Health & Capabilities"
        status={
          isLoading
            ? undefined
            : ok
              ? { label: data?.status ?? "OK", tone: "confirmed" }
              : { label: "Unreachable", tone: "unknown" }
        }
        actions={
          <button
            onClick={() => {
              refetch();
              caps.refetch();
            }}
            disabled={isFetching || caps.isFetching}
            className="text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted transition-colors disabled:opacity-50"
          >
            {isFetching || caps.isFetching ? "Refreshing…" : "Refresh"}
          </button>
        }
      />

      <div className="p-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetaCard label="Base URL" value={cfg.baseUrl} mono />
          <MetaCard label="Status" value={ok ? (data?.status ?? "ok") : "error"} />
          <MetaCard label="Version" value={String(data?.version ?? "—")} mono />
          <MetaCard
            label="Namespace"
            value={String(data?.namespace ?? caps.data?.namespace ?? "—")}
            mono
            accent
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Analysis capabilities
            </h2>
            {caps.data?.openapiVersion ? (
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                OpenAPI · {caps.data.openapiVersion}
              </span>
            ) : null}
          </div>

          {caps.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : caps.error ? (
            <ErrorPanel error={caps.error as Error} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {capEntries.map(([k, v]) => (
                <CapabilityRow key={k} name={k} value={v} />
              ))}
              {capEntries.length === 0 ? (
                <div className="col-span-full text-sm text-muted-foreground font-mono">
                  No capabilities reported.
                </div>
              ) : null}
            </div>
          )}
        </section>

        {data?.capabilities && Object.keys(data.capabilities).length > 0 ? (
          <section>
            <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Health capability flags
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(data.capabilities).map(([k, v]) => (
                <CapabilityRow key={k} name={k} value={v} />
              ))}
            </div>
          </section>
        ) : null}

        {data ? (
          <section>
            <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Raw Response
            </h2>
            <pre className="text-[11px] font-mono bg-card ring-1 ring-black/5 rounded-lg p-4 overflow-auto max-h-96">
              {JSON.stringify({ health: data, capabilities: caps.data }, null, 2)}
            </pre>
          </section>
        ) : null}
      </div>
    </>
  );
}

function MetaCard({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-4 bg-card ring-1 ring-black/5 rounded-lg ${accent ? "border-l-2 border-iris-accent" : ""}`}
    >
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
        {label}
      </span>
      <p
        className={`text-sm truncate ${mono ? "font-mono" : ""} text-foreground/90`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function CapabilityRow({ name, value }: { name: string; value: unknown }) {
  const isBool = typeof value === "boolean";
  const truthy = isBool ? (value as boolean) : Boolean(value);
  return (
    <div className="flex items-center justify-between p-3 bg-card ring-1 ring-black/5 rounded-lg">
      <span className="text-sm font-mono truncate">{name}</span>
      {isBool ? (
        truthy ? (
          <span className="flex items-center gap-1.5 text-status-confirmed text-xs font-medium">
            <CheckCircle2 className="size-4" /> Yes
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <XCircle className="size-4" /> No
          </span>
        )
      ) : (
        <span className="text-xs font-mono text-muted-foreground truncate max-w-[50%]">
          {String(value)}
        </span>
      )}
    </div>
  );
}

function ErrorPanel({ error }: { error: Error }) {
  return (
    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
      <div className="text-sm font-semibold text-destructive mb-1">
        Failed to reach the API
      </div>
      <p className="text-xs font-mono text-destructive/80 break-all">
        {error.message}
      </p>
      <p className="text-xs text-muted-foreground mt-3">
        Check the base URL and credentials in{" "}
        <a href="/settings" className="underline">
          Settings
        </a>
        .
      </p>
    </div>
  );
}
