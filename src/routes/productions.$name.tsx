import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import type {
  ComponentListResponse,
  Component,
  ProductionDetailResponse,
} from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge, ConfidenceDot } from "@/components/confidence-badge";

export const Route = createFileRoute("/productions/$name")({
  head: ({ params }) => ({
    meta: [{ title: `${params.name} — IRIS Explainer` }],
  }),
  component: ProductionDetailPage,
});

function categorize(c: Component): "service" | "process" | "operation" | "unknown" {
  const raw = (c.category ?? "").toLowerCase();
  if (raw.includes("service")) return "service";
  if (raw.includes("process")) return "process";
  if (raw.includes("operation")) return "operation";
  const cls = (c.className ?? "").toLowerCase();
  if (cls.includes("service")) return "service";
  if (cls.includes("process")) return "process";
  if (cls.includes("operation")) return "operation";
  return "unknown";
}

function ProductionDetailPage() {
  const { name } = Route.useParams();

  const meta = useQuery<ProductionDetailResponse>({
    queryKey: ["production", name],
    queryFn: () =>
      apiFetch<ProductionDetailResponse>(
        `/productions/${encodeURIComponent(name)}`,
      ),
    retry: 0,
  });

  const comps = useQuery<ComponentListResponse>({
    queryKey: ["production", name, "components"],
    queryFn: () =>
      apiFetch<ComponentListResponse>(
        `/productions/${encodeURIComponent(name)}/components`,
      ),
    retry: 0,
  });

  const components = comps.data?.components ?? [];
  const services = components.filter((c) => categorize(c) === "service");
  const processes = components.filter((c) => categorize(c) === "process");
  const operations = components.filter((c) => categorize(c) === "operation");
  const unknowns = components.filter((c) => categorize(c) === "unknown");

  const enabled = components.filter((c) => c.enabled !== false).length;
  const disabled = components.length - enabled;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Productions" }]}
        title={name}
        actions={
          <Link
            to="/productions"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-3.5" /> All productions
          </Link>
        }
      />

      <div className="p-8 space-y-10">
        {/* Metadata strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MetaCard label="Namespace" value={meta.data?.namespace ?? "—"} mono />
          <MetaCard
            label="Components"
            value={
              comps.isLoading
                ? "…"
                : `${components.length} total`
            }
          />
          <MetaCard
            label="Enabled / Disabled"
            value={
              comps.isLoading ? "…" : `${enabled} / ${disabled}`
            }
          />
          <MetaCard accent label="Fact Provenance">
            <div className="flex gap-1.5 mt-1">
              <ConfidenceDot confidence="confirmed" title="Confirmed" />
              <ConfidenceDot confidence="observed" title="Observed" />
              <ConfidenceDot confidence="inferred" title="Inferred" />
              <ConfidenceDot confidence="unknown" title="Unknown" />
            </div>
          </MetaCard>
        </section>

        {meta.data?.description ? (
          <p className="text-sm text-muted-foreground max-w-3xl">
            {meta.data.description}
          </p>
        ) : null}

        {/* Error state */}
        {comps.error ? (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="text-sm font-semibold text-destructive mb-1">
              Failed to load components
            </div>
            <p className="text-xs font-mono text-destructive/80 break-all">
              {(comps.error as Error).message}
            </p>
          </div>
        ) : null}

        {/* Schematic */}
        <section className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 relative">
            {/* Connection rails, decorative */}
            <div className="hidden lg:block absolute top-32 left-[30%] right-[65%] h-px bg-border -z-10" />
            <div className="hidden lg:block absolute top-32 left-[63%] right-[32%] h-px bg-border -z-10" />

            <Column
              label="Business Services"
              loading={comps.isLoading}
              items={services}
              accentBorder="border-status-observed"
            />
            <Column
              label="Business Processes"
              loading={comps.isLoading}
              items={processes}
              accentBorder="border-iris-brand"
              featured
            />
            <Column
              label="Business Operations"
              loading={comps.isLoading}
              items={operations}
              accentBorder="border-status-inferred"
            />
          </div>
        </section>

        {unknowns.length > 0 ? (
          <section>
            <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Unclassified components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unknowns.map((c) => (
                <ComponentCard key={c.name} component={c} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

function Column({
  label,
  loading,
  items,
  accentBorder,
  featured,
}: {
  label: string;
  loading: boolean;
  items: Component[];
  accentBorder: string;
  featured?: boolean;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b pb-2">
        {label}
      </h4>
      {loading ? (
        <>
          <Skeleton className="h-32 rounded-[10px]" />
          <Skeleton className="h-24 rounded-[10px]" />
        </>
      ) : items.length === 0 ? (
        <div className="text-[11px] text-muted-foreground font-mono border border-dashed rounded-[10px] p-4">
          None
        </div>
      ) : (
        items.map((c) => (
          <ComponentCard
            key={c.name}
            component={c}
            highlightBorder={featured ? accentBorder : undefined}
          />
        ))
      )}
    </div>
  );
}

function ComponentCard({
  component,
  highlightBorder,
}: {
  component: Component;
  highlightBorder?: string;
}) {
  const {
    name,
    className,
    adapter,
    protocol,
    targets,
    enabled = true,
    confidence,
  } = component;
  return (
    <div
      className={`bg-card ring-1 ring-black/5 rounded-[10px] p-5 ${
        highlightBorder ? `border-l-4 ${highlightBorder}` : ""
      } ${enabled === false ? "opacity-60 grayscale" : ""}`}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="min-w-0">
          <h5 className="text-[13px] font-semibold leading-tight text-balance break-words">
            {name}
          </h5>
          {className ? (
            <div className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
              {className}
            </div>
          ) : null}
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <div className="space-y-2">
        {adapter ? (
          <Row label="Adapter" mono>
            {adapter}
          </Row>
        ) : null}
        {protocol ? (
          <Row label="Protocol">
            <span className="px-1 bg-muted rounded text-muted-foreground">
              {protocol}
            </span>
          </Row>
        ) : null}
        {targets && targets.length > 0 ? (
          <Row label="Targets">
            <span className="font-mono text-foreground/80">
              {targets.join(", ")}
            </span>
          </Row>
        ) : null}
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div
            className={`size-1.5 rounded-full ${
              enabled === false ? "bg-muted-foreground/40" : "bg-status-confirmed"
            }`}
          />
          <span className="text-[9px] text-muted-foreground uppercase">
            {enabled === false ? "Disabled" : "Enabled"}
          </span>
        </div>
        {targets && targets.length > 0 ? (
          <div className="text-muted-foreground/60 text-lg leading-none">→</div>
        ) : null}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[11px] gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span
        className={`truncate min-w-0 text-right ${mono ? "font-mono text-foreground/80" : ""}`}
      >
        {children}
      </span>
    </div>
  );
}

function MetaCard({
  label,
  value,
  children,
  mono,
  accent,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
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
      {value !== undefined ? (
        <p className={`text-sm truncate ${mono ? "font-mono" : ""}`} title={value}>
          {value}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
