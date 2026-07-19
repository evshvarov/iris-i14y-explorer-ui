import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Play, Square, RefreshCw, MessageSquareText } from "lucide-react";
import { useState } from "react";

import { apiFetch } from "@/lib/api-config";
import type {
  ComponentListResponse,
  Component,
  ProductionDetailResponse,
  ProductionAnalysisResponse,
  ProductionSummaryResponse,
  ProductionAISummaryResponse,
  ProductionRuntimeResponse,
  ProductionActionResponse,
  ProductionGraphResponse,
  Connection,
  ExternalSystem,
  AnalysisArtifact,
  RuleDetail,
  TransformationDetail,
  BusinessProcessDetail,
  ComponentExplanation,
  MessageType,
} from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge, ConfidenceDot } from "@/components/confidence-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SummaryBullets, MetricChip, MetricChips, EvidenceChips } from "@/components/summary-bits";
import { LogsPanel } from "@/components/logs-panel";
import { toast } from "sonner";

export const Route = createFileRoute("/productions/$name")({
  head: ({ params }) => ({
    meta: [{ title: `${params.name} — IRIS Explainer` }],
  }),
  component: ProductionDetailPage,
});

function categorize(c: Component): "service" | "process" | "operation" | "unknown" {
  const raw = ((c.category ?? c.type) ?? "").toLowerCase();
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
  const encoded = encodeURIComponent(name);
  const qc = useQueryClient();

  const meta = useQuery<ProductionDetailResponse>({
    queryKey: ["production", name],
    queryFn: () => apiFetch<ProductionDetailResponse>(`/productions/${encoded}`),
    retry: 0,
  });

  const comps = useQuery<ComponentListResponse>({
    queryKey: ["production", name, "components"],
    queryFn: () => apiFetch<ComponentListResponse>(`/productions/${encoded}/components`),
    retry: 0,
  });

  const summary = useQuery<ProductionSummaryResponse>({
    queryKey: ["production", name, "summary"],
    queryFn: () => apiFetch<ProductionSummaryResponse>(`/productions/${encoded}/summary`),
    retry: 0,
  });

  const status = useQuery<ProductionRuntimeResponse>({
    queryKey: ["production", name, "status"],
    queryFn: () => apiFetch<ProductionRuntimeResponse>(`/productions/${encoded}/status`),
    retry: 0,
  });

  const analysis = useQuery<ProductionAnalysisResponse>({
    queryKey: ["production", name, "analysis"],
    queryFn: () => apiFetch<ProductionAnalysisResponse>(`/productions/${encoded}/analysis`),
    retry: 0,
  });

  const graph = useQuery<ProductionGraphResponse>({
    queryKey: ["production", name, "graph"],
    queryFn: () => apiFetch<ProductionGraphResponse>(`/productions/${encoded}/graph`),
    retry: 0,
  });

  const components = comps.data?.items ?? comps.data?.components ?? [];
  const services = components.filter((c) => categorize(c) === "service");
  const processes = components.filter((c) => categorize(c) === "process");
  const operations = components.filter((c) => categorize(c) === "operation");
  const unknowns = components.filter((c) => categorize(c) === "unknown");

  const enabled = components.filter((c) => c.enabled !== false).length;
  const disabled = components.length - enabled;

  const runtime = status.data?.runtime ?? meta.data?.runtime;
  const isRunning = Boolean(status.data?.isRunning ?? meta.data?.isRunning);
  const runtimeState =
    status.data?.runtimeState ?? runtime?.stateLabel ?? meta.data?.runtimeState ?? "unknown";

  const invalidateRuntime = () => {
    qc.invalidateQueries({ queryKey: ["production", name, "status"] });
    qc.invalidateQueries({ queryKey: ["production", name] });
    qc.invalidateQueries({ queryKey: ["productions"] });
  };

  const startMut = useMutation({
    mutationFn: () =>
      apiFetch<ProductionActionResponse>(`/productions/${encoded}/start`, { method: "POST" }),
    onSuccess: (r) => {
      toast.success(`Start ${r.changed ? "issued" : "no-op"} — ${r.runtime?.stateLabel ?? ""}`);
      invalidateRuntime();
    },
    onError: (e: Error) => toast.error(`Start failed: ${e.message}`),
  });

  const stopMut = useMutation({
    mutationFn: () =>
      apiFetch<ProductionActionResponse>(`/productions/${encoded}/stop`, { method: "POST" }),
    onSuccess: (r) => {
      toast.success(`Stop ${r.changed ? "issued" : "no-op"} — ${r.runtime?.stateLabel ?? ""}`);
      invalidateRuntime();
    },
    onError: (e: Error) => toast.error(`Stop failed: ${e.message}`),
  });

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Productions" }]}
        title={name}
        status={{ label: runtimeState, tone: isRunning ? "confirmed" : "unknown" }}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => startMut.mutate()}
              disabled={startMut.isPending || isRunning}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed hover:bg-status-confirmed/20 transition-colors disabled:opacity-40"
            >
              <Play className="size-3.5" /> Start
            </button>
            <button
              onClick={() => stopMut.mutate()}
              disabled={stopMut.isPending || !isRunning}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40"
            >
              <Square className="size-3.5" /> Stop
            </button>
            <button
              onClick={() => invalidateRuntime()}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted transition-colors"
            >
              <RefreshCw className="size-3.5" />
            </button>
            <Link
              to="/productions"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-3.5" /> All
            </Link>
          </div>
        }
      />

      <div className="p-8 space-y-8">
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetaCard label="Namespace" value={meta.data?.namespace ?? "—"} mono />
          <MetaCard label="Components" value={comps.isLoading ? "…" : `${components.length}`} />
          <MetaCard label="Enabled / Disabled" value={comps.isLoading ? "…" : `${enabled} / ${disabled}`} />
          <MetaCard label="Current?" value={runtime?.isCurrent ? "Yes" : "No"} />
          <MetaCard accent label="Provenance">
            <div className="flex gap-1.5 mt-1">
              <ConfidenceDot confidence="confirmed" title="Confirmed" />
              <ConfidenceDot confidence="observed" title="Observed" />
              <ConfidenceDot confidence="inferred" title="Inferred" />
              <ConfidenceDot confidence="unknown" title="Unknown" />
            </div>
          </MetaCard>
        </section>

        {meta.data?.description ? (
          <p className="text-sm text-muted-foreground max-w-3xl">{meta.data.description}</p>
        ) : null}

        {summary.data?.summary ? (
          <section className="bg-card ring-1 ring-black/5 rounded-lg p-5 max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Deterministic summary
              </h2>
              <ConfidenceBadge confidence={summary.data.confidence} />
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty">
              {summary.data.summary}
            </p>
          </section>
        ) : null}

        <SummaryBullets bullets={analysis.data?.summaryBullets} />

        {analysis.data?.metrics ? (
          <MetricChips>
            <MetricChip label="Services" value={analysis.data.metrics.serviceCount ?? 0} tone="observed" />
            <MetricChip label="Processes" value={analysis.data.metrics.processCount ?? 0} tone="brand" />
            <MetricChip label="Operations" value={analysis.data.metrics.operationCount ?? 0} tone="inferred" />
            <MetricChip label="Connections" value={analysis.data.metrics.connectionCount ?? 0} />
            {(analysis.data.metrics.routingRuleConnectionCount ?? 0) > 0 ? (
              <MetricChip label="Rule conns" value={analysis.data.metrics.routingRuleConnectionCount!} />
            ) : null}
            {(analysis.data.metrics.bplCallConnectionCount ?? 0) > 0 ? (
              <MetricChip label="BPL conns" value={analysis.data.metrics.bplCallConnectionCount!} />
            ) : null}
            <MetricChip label="Ext systems" value={analysis.data.metrics.externalSystemCount ?? 0} />
            <MetricChip label="Rules" value={analysis.data.metrics.ruleCount ?? 0} />
            <MetricChip label="Transforms" value={analysis.data.metrics.transformationCount ?? 0} />
            <MetricChip label="BPL" value={analysis.data.metrics.businessProcessCount ?? 0} />
            {(analysis.data.metrics.warningCount ?? 0) > 0 ? (
              <MetricChip label="Warnings" value={analysis.data.metrics.warningCount!} tone="error" />
            ) : null}
          </MetricChips>
        ) : null}

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Schematic</TabsTrigger>
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="rules">Rules & Transforms</TabsTrigger>
            <TabsTrigger value="bpl">Processes</TabsTrigger>
            <TabsTrigger value="explanations">Explanations</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-6">
            {comps.error ? <ErrorPanel error={comps.error as Error} label="components" /> : null}
            <section className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 relative">
                <div className="hidden lg:block absolute top-32 left-[30%] right-[65%] h-px bg-border -z-10" />
                <div className="hidden lg:block absolute top-32 left-[63%] right-[32%] h-px bg-border -z-10" />
                <Column label="Business Services" loading={comps.isLoading} items={services} accentBorder="border-status-observed" />
                <Column label="Business Processes" loading={comps.isLoading} items={processes} accentBorder="border-iris-brand" featured />
                <Column label="Business Operations" loading={comps.isLoading} items={operations} accentBorder="border-status-inferred" />
              </div>
              {unknowns.length > 0 ? (
                <div className="mt-8">
                  <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Unclassified
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unknowns.map((c) => <ComponentCard key={c.name} component={c} />)}
                  </div>
                </div>
              ) : null}
            </section>
          </TabsContent>

          <TabsContent value="graph" className="pt-6 space-y-6">
            {graph.isLoading ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : graph.error ? (
              <ErrorPanel error={graph.error as Error} label="graph" />
            ) : (
              <GraphView data={graph.data} productionName={name} />
            )}
          </TabsContent>



          <TabsContent value="analysis" className="pt-6 space-y-8">
            {analysis.isLoading ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : analysis.error ? (
              <ErrorPanel error={analysis.error as Error} label="analysis" />
            ) : (
              <>
                <CoveragePanel coverage={analysis.data?.analysisCoverage} />
                <ConnectionsSection
                  connections={analysis.data?.connections ?? []}
                  explanations={analysis.data?.connectionExplanations ?? []}
                />
                <ExternalSystemsSection
                  systems={analysis.data?.externalSystems ?? []}
                  explanations={analysis.data?.externalSystemExplanations ?? []}
                />
                <ArtifactsSection
                  artifacts={analysis.data?.artifacts ?? []}
                  explanations={analysis.data?.artifactExplanations ?? []}
                />
                <MessageTypesSection
                  types={analysis.data?.messageTypes ?? []}
                  explanations={analysis.data?.messageTypeExplanations ?? []}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="rules" className="pt-6 space-y-8">
            {analysis.isLoading ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : (
              <>
                <RulesSection
                  rules={analysis.data?.rules ?? []}
                  explanations={analysis.data?.ruleExplanations ?? []}
                />
                <TransformsSection
                  transforms={analysis.data?.transformations ?? []}
                  explanations={analysis.data?.transformationExplanations ?? []}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="bpl" className="pt-6">
            {analysis.isLoading ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : (
              <ProcessesSection
                processes={analysis.data?.businessProcesses ?? []}
                explanations={analysis.data?.businessProcessExplanations ?? []}
              />
            )}
          </TabsContent>

          <TabsContent value="explanations" className="pt-6">
            {analysis.isLoading ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : (
              <ExplanationsSection explanations={analysis.data?.componentExplanations ?? []} />
            )}
          </TabsContent>

          <TabsContent value="messages" className="pt-6">
            <div className="bg-card ring-1 ring-black/5 rounded-lg p-6 max-w-2xl">
              <div className="size-10 rounded-md bg-iris-brand/10 text-iris-brand flex items-center justify-center mb-3">
                <MessageSquareText className="size-5" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Runtime messages for this production</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Open the message explorer prefiltered to <span className="font-mono text-foreground/80">{name}</span>.
              </p>
              <Link
                to="/messages"
                search={{ productionName: name } as never}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md ring-1 ring-iris-brand/30 bg-iris-brand/10 text-iris-brand hover:bg-iris-brand/20 transition-colors"
              >
                Open in Message Explainer →
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="pt-6">
            <LogsPanel productionName={name} />
          </TabsContent>
        </Tabs>

        {analysis.data?.warnings && analysis.data.warnings.length > 0 ? (
          <section>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Warnings
            </h3>
            <ul className="space-y-1">
              {analysis.data.warnings.map((w, i) => (
                <li key={i} className="text-[11px] font-mono text-status-inferred">
                  [{w.code}] {w.message}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}

function ExplanationLine({
  text,
  confidence,
}: {
  text?: string;
  confidence?: import("@/lib/api-types").Confidence;
}) {
  if (!text) return null;
  return (
    <div className="mt-2 pt-2 border-t border-border/50 flex items-start gap-2">
      <ConfidenceDot confidence={confidence ?? "unknown"} />
      <p className="text-[11px] text-foreground/80 whitespace-pre-wrap text-pretty leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function CoveragePanel({
  coverage,
}: {
  coverage?: import("@/lib/api-types").AnalysisCoverage;
}) {
  if (!coverage) return null;
  const flags: [string, boolean | undefined][] = [
    ["Components", coverage.componentAnalysisAvailable],
    ["Targets", coverage.targetAnalysisAvailable],
    ["Msg signatures", coverage.messageSignatureAnalysisAvailable],
    ["Rules", coverage.ruleAnalysisAvailable],
    ["Transforms", coverage.transformationAnalysisAvailable],
    ["BPL", coverage.businessProcessAnalysisAvailable],
  ];
  return (
    <section>
      <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        Analysis coverage
      </h3>
      <div className="bg-card ring-1 ring-black/5 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {flags.map(([label, ok]) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ring-1 ${
                ok
                  ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
                  : "text-muted-foreground ring-black/10 bg-muted"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  ok ? "bg-status-confirmed" : "bg-muted-foreground/40"
                }`}
              />
              {label}
            </span>
          ))}
        </div>
        <EvidenceChips m={coverage} />
      </div>
    </section>
  );
}

function ConnectionsSection({
  connections,
  explanations = [],
}: {
  connections: Connection[];
  explanations?: import("@/lib/api-types").ConnectionExplanation[];
}) {
  const findExpl = (c: Connection) =>
    explanations.find((e) => e.from === c.from && e.to === c.to && (!e.kind || e.kind === c.kind));
  return (
    <SectionShell title="Connections" count={connections.length}>
      {connections.length === 0 ? (
        <Empty>No connections extracted.</Empty>
      ) : (
        <ul className="space-y-2">
          {connections.map((c, i) => {
            const ex = findExpl(c);
            return (
              <li key={i} className="bg-card ring-1 ring-black/5 rounded-lg px-4 py-3">
                <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-3 text-xs">
                  <span className="font-mono truncate">{c.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono truncate">{c.to}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-mono uppercase text-muted-foreground">
                    {c.kind ?? "—"}
                    {c.ruleName ? ` · ${c.ruleName}` : ""}
                  </span>
                  <ConfidenceBadge confidence={c.confidence} />
                </div>
                <ExplanationLine text={ex?.text} confidence={ex?.confidence} />
              </li>
            );
          })}
        </ul>
      )}
    </SectionShell>
  );
}

function ExternalSystemsSection({
  systems,
  explanations = [],
}: {
  systems: ExternalSystem[];
  explanations?: import("@/lib/api-types").ExternalSystemExplanation[];
}) {
  const findExpl = (s: ExternalSystem) =>
    explanations.find((e) => e.component === s.component && e.value === s.value);
  return (
    <SectionShell title="External systems" count={systems.length}>
      {systems.length === 0 ? (
        <Empty>No external endpoints inferred.</Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systems.map((s, i) => {
            const ex = findExpl(s);
            return (
              <div key={i} className="bg-card ring-1 ring-black/5 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{s.component}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">
                      {s.componentType} · {s.kind}
                    </div>
                  </div>
                  <ConfidenceBadge confidence={s.confidence} />
                </div>
                <div className="text-[11px] font-mono text-foreground/80 break-all">{s.value}</div>
                <ExplanationLine text={ex?.text} confidence={ex?.confidence} />
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}

function ArtifactsSection({
  artifacts,
  explanations = [],
}: {
  artifacts: AnalysisArtifact[];
  explanations?: import("@/lib/api-types").ArtifactExplanation[];
}) {
  const findExpl = (a: AnalysisArtifact) =>
    explanations.find(
      (e) => e.kind === a.kind && e.name === a.name && e.component === a.component,
    );
  const withExpl = artifacts.filter((a) => findExpl(a)?.text);
  return (
    <SectionShell title="Artifacts" count={artifacts.length}>
      {artifacts.length === 0 ? (
        <Empty>No artifacts.</Empty>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {artifacts.map((a, i) => (
              <div
                key={i}
                className="bg-card ring-1 ring-black/5 rounded-md px-3 py-2 text-xs flex items-center gap-2"
              >
                <span className="text-[9px] font-mono uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {a.kind}
                </span>
                <span className="font-mono">{a.name}</span>
                {a.component ? (
                  <span className="text-muted-foreground">· {a.component}</span>
                ) : null}
                <ConfidenceBadge confidence={a.confidence} />
              </div>
            ))}
          </div>
          {withExpl.length > 0 ? (
            <ul className="space-y-2">
              {withExpl.map((a, i) => {
                const ex = findExpl(a)!;
                return (
                  <li key={i} className="bg-card ring-1 ring-black/5 rounded-lg px-4 py-3">
                    <div className="text-[11px] font-mono text-muted-foreground mb-1">
                      {ex.label ?? `${a.kind} · ${a.name}`}
                    </div>
                    <ExplanationLine text={ex.text} confidence={ex.confidence} />
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      )}
    </SectionShell>
  );
}

function MessageTypesSection({
  types,
  explanations = [],
}: {
  types: MessageType[];
  explanations?: import("@/lib/api-types").MessageTypeExplanation[];
}) {
  const findExpl = (t: MessageType) =>
    explanations.find(
      (e) => e.component === t.component && e.method === t.method && e.direction === t.direction,
    );
  return (
    <SectionShell title="Message signatures" count={types.length}>
      {types.length === 0 ? (
        <Empty>No handler signatures found.</Empty>
      ) : (
        <ul className="space-y-1.5">
          {types.map((t, i) => {
            const ex = findExpl(t);
            return (
              <li key={i} className="bg-card ring-1 ring-black/5 rounded-lg px-4 py-2.5">
                <div className="grid grid-cols-[1fr_1fr_auto_1fr_auto] gap-3 text-xs items-center">
                  <span className="font-mono truncate">{t.component}</span>
                  <span className="font-mono truncate text-muted-foreground">
                    {t.method ?? "—"}
                  </span>
                  <span className="text-[10px] uppercase font-mono bg-muted rounded px-1.5 py-0.5">
                    {t.direction ?? "—"}
                  </span>
                  <span className="font-mono truncate">{t.messageClass ?? "—"}</span>
                  <ConfidenceBadge confidence={t.confidence} />
                </div>
                <ExplanationLine text={ex?.text} confidence={ex?.confidence} />
              </li>
            );
          })}
        </ul>
      )}
    </SectionShell>
  );
}

function RulesSection({
  rules,
  explanations = [],
}: {
  rules: RuleDetail[];
  explanations?: import("@/lib/api-types").RuleExplanation[];
}) {
  const findExpl = (r: RuleDetail) =>
    explanations.find((e) => e.name === r.name && e.component === r.component);
  return (
    <SectionShell title="Routing rules" count={rules.length}>
      {rules.length === 0 ? (
        <Empty>No accessible rule definitions.</Empty>
      ) : (
        <div className="space-y-3">
          {rules.map((r, i) => {
            const ex = findExpl(r);
            return (
              <div key={i} className="bg-card ring-1 ring-black/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{r.component}</div>
                  </div>
                  <ConfidenceBadge confidence={r.confidence} />
                </div>
                {(r.conditions ?? []).length > 0 ? (
                  <div className="space-y-2">
                    {r.conditions!.map((c, j) => (
                      <div key={j} className="border-l-2 border-iris-brand/40 pl-3 py-1">
                        <div className="text-[11px] font-mono text-foreground/90">
                          WHEN{" "}
                          <span className="text-status-observed">
                            {c.condition || "(default)"}
                          </span>
                        </div>
                        {c.comment ? (
                          <div className="text-[10px] text-muted-foreground">{c.comment}</div>
                        ) : null}
                        {(c.sends ?? []).map((s, k) => (
                          <div
                            key={k}
                            className="text-[11px] font-mono text-muted-foreground ml-4 mt-0.5"
                          >
                            → {s.target}
                            {s.transform ? ` via ${s.transform}` : ""}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
                {(r.sends ?? []).length > 0 ? (
                  <div className="mt-2 text-[11px] font-mono text-muted-foreground">
                    Default sends: {r.sends!.map((s) => s.target).join(", ")}
                  </div>
                ) : null}
                <ExplanationLine text={ex?.text} confidence={ex?.confidence} />
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}

function TransformsSection({
  transforms,
  explanations = [],
}: {
  transforms: TransformationDetail[];
  explanations?: import("@/lib/api-types").TransformationExplanation[];
}) {
  const findExpl = (t: TransformationDetail) => explanations.find((e) => e.name === t.name);
  return (
    <SectionShell title="DTL transformations" count={transforms.length}>
      {transforms.length === 0 ? (
        <Empty>No DTL transformations found.</Empty>
      ) : (
        <div className="space-y-3">
          {transforms.map((t, i) => {
            const ex = findExpl(t);
            return (
              <div key={i} className="bg-card ring-1 ring-black/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{t.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate">
                      {t.sourceClass ?? "?"} → {t.targetClass ?? "?"}
                      {t.language ? ` · ${t.language}` : ""}
                    </div>
                  </div>
                  <ConfidenceBadge confidence={t.confidence} />
                </div>
                {(t.assignments ?? []).length > 0 ? (
                  <details className="mt-2">
                    <summary className="text-[11px] font-mono text-muted-foreground cursor-pointer hover:text-foreground">
                      {t.assignments!.length} assignments
                    </summary>
                    <ul className="mt-2 space-y-1 border-l border-border pl-3">
                      {t.assignments!.slice(0, 50).map((a, j) => (
                        <li key={j} className="text-[10px] font-mono text-foreground/80">
                          <span className="text-status-observed">{a.action ?? "set"}</span>{" "}
                          {a.property} = <span className="text-muted-foreground">{a.value}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
                <ExplanationLine text={ex?.text} confidence={ex?.confidence} />
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}

function ProcessesSection({
  processes,
  explanations = [],
}: {
  processes: BusinessProcessDetail[];
  explanations?: import("@/lib/api-types").BusinessProcessExplanation[];
}) {
  const findExpl = (p: BusinessProcessDetail) => explanations.find((e) => e.name === p.name);
  return (
    <SectionShell title="BPL processes" count={processes.length}>
      {processes.length === 0 ? (
        <Empty>No BPL definitions accessible.</Empty>
      ) : (
        <div className="space-y-3">
          {processes.map((p, i) => {
            const ex = findExpl(p);
            return (
              <div key={i} className="bg-card ring-1 ring-black/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate">
                      {p.component}
                    </div>
                  </div>
                  <ConfidenceBadge confidence={p.confidence} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono">
                  <Kv k="Request" v={p.requestClass} />
                  <Kv k="Response" v={p.responseClass} />
                  <Kv k="Context" v={p.contextClass} />
                </div>
                {(p.calls ?? []).length > 0 ? (
                  <div className="mt-3 border-t pt-3">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                      Calls
                    </div>
                    <ul className="space-y-0.5">
                      {p.calls!.map((c, j) => (
                        <li key={j} className="text-[11px] font-mono text-foreground/80">
                          → {c.target ?? "?"}{" "}
                          <span className="text-muted-foreground">
                            {c.async ? "async" : "sync"}
                            {c.timeout ? ` · timeout=${c.timeout}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <ExplanationLine text={ex?.text} confidence={ex?.confidence} />
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}

function ExplanationsSection({ explanations }: { explanations: ComponentExplanation[] }) {
  return (
    <SectionShell title="Component explanations" count={explanations.length}>
      {explanations.length === 0 ? (
        <Empty>No explanations available.</Empty>
      ) : (
        <div className="space-y-3">
          {explanations.map((e, i) => (
            <div key={i} className="bg-card ring-1 ring-black/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{e.component}</div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">{e.componentType}</div>
                </div>
                <ConfidenceBadge confidence={e.confidence} />
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty">{e.text}</p>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

function SectionShell({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          {title}
        </h3>
        {count !== undefined ? (
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {count}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] text-muted-foreground font-mono border border-dashed rounded-lg p-4">
      {children}
    </div>
  );
}

function Kv({ k, v }: { k: string; v?: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="truncate">{v || "—"}</div>
    </div>
  );
}

function Column({
  label, loading, items, accentBorder, featured,
}: {
  label: string; loading: boolean; items: Component[]; accentBorder: string; featured?: boolean;
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
          <ComponentCard key={c.name} component={c} highlightBorder={featured ? accentBorder : undefined} />
        ))
      )}
    </div>
  );
}

function ComponentCard({ component, highlightBorder }: { component: Component; highlightBorder?: string }) {
  const { name, className, adapterClass, adapter, protocol, targets, enabled = true, confidence } = component;
  const adapterLabel = adapterClass ?? adapter;
  return (
    <div
      className={`bg-card ring-1 ring-black/5 rounded-[10px] p-5 ${
        highlightBorder ? `border-l-4 ${highlightBorder}` : ""
      } ${enabled === false ? "opacity-60 grayscale" : ""}`}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="min-w-0">
          <h5 className="text-[13px] font-semibold leading-tight text-balance break-words">{name}</h5>
          {className ? (
            <div className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">{className}</div>
          ) : null}
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>
      <div className="space-y-2">
        {adapterLabel ? <Row label="Adapter" mono>{adapterLabel}</Row> : null}
        {protocol ? (
          <Row label="Protocol">
            <span className="px-1 bg-muted rounded text-muted-foreground">{protocol}</span>
          </Row>
        ) : null}
        {targets && targets.length > 0 ? (
          <Row label="Targets"><span className="font-mono text-foreground/80">{targets.join(", ")}</span></Row>
        ) : null}
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className={`size-1.5 rounded-full ${enabled === false ? "bg-muted-foreground/40" : "bg-status-confirmed"}`} />
          <span className="text-[9px] text-muted-foreground uppercase">
            {enabled === false ? "Disabled" : "Enabled"}
          </span>
        </div>
        {targets && targets.length > 0 ? <div className="text-muted-foreground/60 text-lg leading-none">→</div> : null}
      </div>
    </div>
  );
}

function Row({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px] gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`truncate min-w-0 text-right ${mono ? "font-mono text-foreground/80" : ""}`}>{children}</span>
    </div>
  );
}

function MetaCard({
  label, value, children, mono, accent,
}: {
  label: string; value?: string; children?: React.ReactNode; mono?: boolean; accent?: boolean;
}) {
  return (
    <div className={`p-4 bg-card ring-1 ring-black/5 rounded-lg ${accent ? "border-l-2 border-iris-accent" : ""}`}>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
        {label}
      </span>
      {value !== undefined ? (
        <p className={`text-sm truncate ${mono ? "font-mono" : ""}`} title={value}>{value}</p>
      ) : (children)}
    </div>
  );
}

function ErrorPanel({ error, label }: { error: Error; label: string }) {
  return (
    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
      <div className="text-sm font-semibold text-destructive mb-1">Failed to load {label}</div>
      <p className="text-xs font-mono text-destructive/80 break-all">{error.message}</p>
    </div>
  );
}

function GraphView({
  data,
  productionName,
}: {
  data?: ProductionGraphResponse;
  productionName: string;
}) {
  const nodes = data?.nodes ?? [];
  const edges = data?.edges ?? [];
  const nodeById = new Map(nodes.map((n) => [n.id ?? n.label ?? "", n]));

  return (
    <>
      <SummaryBullets bullets={data?.summaryBullets} />
      {data?.metrics ? (
        <MetricChips>
          <MetricChip label="Nodes" value={data.metrics.nodeCount ?? nodes.length} tone="brand" />
          <MetricChip label="Edges" value={data.metrics.edgeCount ?? edges.length} />
          <MetricChip label="Services" value={data.metrics.serviceCount ?? 0} tone="observed" />
          <MetricChip label="Processes" value={data.metrics.processCount ?? 0} tone="brand" />
          <MetricChip label="Operations" value={data.metrics.operationCount ?? 0} tone="inferred" />
          {(data.metrics.disabledNodeCount ?? 0) > 0 ? (
            <MetricChip label="Disabled" value={data.metrics.disabledNodeCount!} />
          ) : null}
          {(data.metrics.routingRuleEdgeCount ?? 0) > 0 ? (
            <MetricChip label="Rule edges" value={data.metrics.routingRuleEdgeCount!} />
          ) : null}
          {(data.metrics.bplCallEdgeCount ?? 0) > 0 ? (
            <MetricChip label="BPL edges" value={data.metrics.bplCallEdgeCount!} />
          ) : null}
        </MetricChips>
      ) : null}
      <SectionShell title="Nodes" count={nodes.length}>
        {nodes.length === 0 ? (
          <Empty>No graph nodes.</Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodes.map((n) => (
              <Link
                key={n.id ?? n.label}
                to="/productions/$name/components/$componentName"
                params={{
                  name: productionName,
                  componentName: n.label ?? n.id ?? "",
                }}
                className="bg-card ring-1 ring-black/5 rounded-lg p-3 hover:ring-iris-brand/40 transition-all block"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9px] font-mono uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {n.type ?? "node"}
                  </span>
                  <ConfidenceBadge confidence={n.confidence} />
                </div>
                <div className="text-sm font-semibold truncate">{n.label ?? n.id}</div>
                <div className="text-[10px] font-mono text-muted-foreground truncate">
                  {n.className ?? "—"}
                </div>
                {n.protocol || n.adapterClass ? (
                  <div className="mt-1 text-[10px] font-mono text-muted-foreground truncate">
                    {n.protocol ? `proto: ${n.protocol}` : ""}
                    {n.protocol && n.adapterClass ? " · " : ""}
                    {n.adapterClass ? `adapter: ${n.adapterClass}` : ""}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell title="Edges" count={edges.length}>
        {edges.length === 0 ? (
          <Empty>No edges.</Empty>
        ) : (
          <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_1fr_auto_auto_auto] items-center gap-3 px-4 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              <span>Source</span><span></span><span>Target</span>
              <span>Rel</span><span>Kind</span><span>Conf</span>
            </div>
            <ul className="divide-y">
              {edges.map((e, i) => (
                <li
                  key={e.id ?? i}
                  className="grid grid-cols-[1fr_auto_1fr_auto_auto_auto] items-center gap-3 px-4 py-2 text-xs"
                >
                  <span className="font-mono truncate" title={e.source}>
                    {nodeById.get(e.source ?? "")?.label ?? e.source}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono truncate" title={e.target}>
                    {nodeById.get(e.target ?? "")?.label ?? e.target}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                    {e.relationship ?? "—"}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">
                    {e.kind ?? "—"}
                    {e.ruleName ? ` · ${e.ruleName}` : ""}
                  </span>
                  <ConfidenceBadge confidence={e.confidence} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionShell>
    </>
  );
}
