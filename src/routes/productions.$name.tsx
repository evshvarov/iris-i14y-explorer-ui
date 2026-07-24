import { createFileRoute, Link, useNavigate, Outlet, useChildMatches } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Play, Square, RefreshCw, MessageSquareText, Sparkles, Send, Eye, Database, Search, Hammer } from "lucide-react";
import { useState } from "react";

import { apiFetch } from "@/lib/api-config";
import { MarkdownContent } from "@/components/markdown-content";
import type {
  ComponentListResponse,
  Component,
  ProductionDetailResponse,
  ProductionAnalysisResponse,
  ProductionSummaryResponse,
  ProductionAISummaryResponse,
  ProductionAIAskResponse,
  ProductionRAGContextResponse,
  RAGChunk,
  RAGIndexStatusResponse,
  RAGIndexRebuildResponse,
  RAGChunkListResponse,
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
import { ProductionKPIs } from "@/components/production-kpis";
import { toast } from "sonner";


const PROD_TABS = [
  "overview",
  "graph",
  "analysis",
  "rules",
  "bpl",
  "explanations",
  "messages",
  "logs",
  "ask",
] as const;
type ProdTab = (typeof PROD_TABS)[number];

export const Route = createFileRoute("/productions/$name")({
  validateSearch: (s: Record<string, unknown>) => {
    const t = typeof s.tab === "string" ? (s.tab as ProdTab) : undefined;
    return { tab: t && PROD_TABS.includes(t) ? t : undefined };
  },
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
  const childMatches = useChildMatches();
  if (childMatches.length > 0) return <Outlet />;
  return <ProductionDetailContent />;
}

function ProductionDetailContent() {
  const { name } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const activeTab: ProdTab = search.tab ?? "overview";
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
        <ProductionKPIs productionName={name} />


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

        <AISummaryPanel
          productionName={name}
          encoded={encoded}
          componentNames={components.map((c) => c.name ?? c.className ?? "").filter(Boolean) as string[]}
        />


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

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            navigate({
              to: "/productions/$name",
              params: { name },
              search: { tab: v === "overview" ? undefined : (v as ProdTab) },
              replace: true,
            })
          }
        >

          <TabsList>
            <TabsTrigger value="overview">Schematic</TabsTrigger>
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="rules">Rules & Transforms</TabsTrigger>
            <TabsTrigger value="bpl">Processes</TabsTrigger>
            <TabsTrigger value="explanations">Explanations</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="ask">Ask AI</TabsTrigger>
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

          <TabsContent value="ask" className="pt-6">
            <AIAskPanel
              productionName={name}
              encoded={encoded}
              componentNames={components.map((c) => c.name ?? c.className ?? "").filter(Boolean) as string[]}
            />
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

      <GraphDiagram nodes={nodes} edges={edges} productionName={productionName} />

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
                search={{ fromTab: "overview" }}
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

function GraphDiagram({
  nodes,
  edges,
  productionName,
}: {
  nodes: import("@/lib/api-types").GraphNode[];
  edges: import("@/lib/api-types").GraphEdge[];
  productionName: string;
}) {
  const navigate = useNavigate();
  const [hoverEdge, setHoverEdge] = useState<number | null>(null);
  const [hoverNode, setHoverNode] = useState<string | null>(null);

  if (nodes.length === 0) return null;

  // Bucket nodes by tier
  const tierOf = (t?: string): 0 | 1 | 2 => {
    const s = (t ?? "").toLowerCase();
    if (s.includes("service")) return 0;
    if (s.includes("operation")) return 2;
    return 1; // process / default
  };
  const cols: import("@/lib/api-types").GraphNode[][] = [[], [], []];
  nodes.forEach((n) => cols[tierOf(n.type)].push(n));

  // Layout
  const colW = 260;
  const colGap = 80;
  const rowH = 72;
  const padX = 16;
  const padY = 40;
  const nodeW = 220;
  const nodeH = 56;
  const maxRows = Math.max(1, ...cols.map((c) => c.length));
  const width = padX * 2 + colW * 3 + colGap * 2;
  const height = padY * 2 + maxRows * rowH;

  type Pos = { x: number; y: number; col: number; row: number };
  const posById = new Map<string, Pos>();
  cols.forEach((col, ci) => {
    const colX = padX + ci * (colW + colGap);
    const offset = (maxRows - col.length) / 2;
    col.forEach((n, ri) => {
      const key = n.id ?? n.label ?? "";
      posById.set(key, {
        x: colX + (colW - nodeW) / 2,
        y: padY + (offset + ri) * rowH,
        col: ci,
        row: ri,
      });
    });
  });

  const colorForType = (t?: string) => {
    const tier = tierOf(t);
    if (tier === 0) return { fill: "#dbeafe", stroke: "#60a5fa", text: "#1e3a8a" }; // service - blue
    if (tier === 2) return { fill: "#fed7aa", stroke: "#fb923c", text: "#7c2d12" }; // op - orange
    return { fill: "#d1fae5", stroke: "#34d399", text: "#065f46" }; // process - green
  };
  const edgeColor = (rel?: string) => {
    const r = (rel ?? "").toLowerCase();
    if (r.includes("rout") || r.includes("rule")) return "#0d9488";
    if (r.includes("bpl") || r.includes("call")) return "#7c3aed";
    if (r.includes("target") || r.includes("config")) return "#2563eb";
    return "#64748b";
  };

  // Build edge paths
  const edgePaths = edges.map((e, i) => {
    const s = posById.get(e.source ?? "");
    const t = posById.get(e.target ?? "");
    if (!s || !t) return null;
    const x1 = s.x + nodeW;
    const y1 = s.y + nodeH / 2;
    const x2 = t.x;
    const y2 = t.y + nodeH / 2;
    // If target is left of / same col as source, route around
    let d: string;
    if (t.col > s.col) {
      const mx = (x1 + x2) / 2;
      d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
    } else {
      // same or backwards column: loop
      const bend = 40 + Math.abs(s.row - t.row) * 8;
      const sx = s.x + nodeW / 2;
      const tx = t.x + nodeW / 2;
      const sy = s.y + nodeH;
      const ty = t.y;
      d = `M ${sx} ${sy} C ${sx} ${sy + bend}, ${tx} ${ty + bend}, ${tx} ${ty}`;
    }
    return { i, d, edge: e, color: edgeColor(e.relationship) };
  });

  return (
    <SectionShell title="Component graph" count={edges.length}>
      <div className="bg-card ring-1 ring-black/5 rounded-lg p-2 overflow-x-auto">
        <div className="flex items-center gap-4 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#dbeafe] ring-1 ring-[#60a5fa]" /> Services</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#d1fae5] ring-1 ring-[#34d399]" /> Processes</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#fed7aa] ring-1 ring-[#fb923c]" /> Operations</span>
          <span className="ml-auto">Click a node to open its details</span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          style={{ maxWidth: width, minWidth: 600 }}
          className="block"
        >
          <defs>
            {["#0d9488", "#7c3aed", "#2563eb", "#64748b"].map((c) => (
              <marker
                key={c}
                id={`arrow-${c.replace("#", "")}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
              </marker>
            ))}
          </defs>

          {/* Column headers */}
          {["Services", "Processes", "Operations"].map((lbl, ci) => (
            <text
              key={lbl}
              x={padX + ci * (colW + colGap) + colW / 2}
              y={20}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", letterSpacing: 2, textTransform: "uppercase" }}
            >
              {lbl.toUpperCase()} · {cols[ci].length}
            </text>
          ))}

          {/* Edges */}
          {edgePaths.map((ep) =>
            ep ? (
              <g key={ep.i}>
                <path
                  d={ep.d}
                  fill="none"
                  stroke={ep.color}
                  strokeWidth={hoverEdge === ep.i ? 2.5 : 1.5}
                  strokeOpacity={
                    hoverNode
                      ? ep.edge.source === hoverNode || ep.edge.target === hoverNode
                        ? 1
                        : 0.15
                      : hoverEdge === null || hoverEdge === ep.i
                        ? 0.85
                        : 0.2
                  }
                  markerEnd={`url(#arrow-${ep.color.replace("#", "")})`}
                  onMouseEnter={() => setHoverEdge(ep.i)}
                  onMouseLeave={() => setHoverEdge(null)}
                  style={{ cursor: "pointer" }}
                >
                  <title>
                    {(ep.edge.relationship ?? "edge")}
                    {ep.edge.kind ? ` · ${ep.edge.kind}` : ""}
                    {ep.edge.ruleName ? ` · ${ep.edge.ruleName}` : ""}
                    {"\n"}
                    {ep.edge.source} → {ep.edge.target}
                    {ep.edge.messageTypes?.length ? `\n${ep.edge.messageTypes.join(", ")}` : ""}
                  </title>
                </path>
              </g>
            ) : null,
          )}

          {/* Nodes */}
          {nodes.map((n) => {
            const key = n.id ?? n.label ?? "";
            const p = posById.get(key);
            if (!p) return null;
            const c = colorForType(n.type);
            const isDim =
              hoverNode && hoverNode !== key
                ? !edges.some(
                    (e) =>
                      (e.source === hoverNode && e.target === key) ||
                      (e.target === hoverNode && e.source === key),
                  )
                : false;
            return (
              <g
                key={key}
                transform={`translate(${p.x}, ${p.y})`}
                style={{ cursor: "pointer", opacity: isDim ? 0.35 : 1 }}
                onMouseEnter={() => setHoverNode(key)}
                onMouseLeave={() => setHoverNode(null)}
                onClick={() =>
                  navigate({
                    to: "/productions/$name/components/$componentName",
                    params: { name: productionName, componentName: n.label ?? n.id ?? "" },
                    search: { fromTab: "graph" },
                  })
                }

              >
                <rect
                  width={nodeW}
                  height={nodeH}
                  rx={8}
                  fill={c.fill}
                  stroke={c.stroke}
                  strokeWidth={hoverNode === key ? 2 : 1}
                />
                <text
                  x={12}
                  y={22}
                  style={{ fontSize: 13, fontWeight: 600, fill: c.text }}
                >
                  {truncate(n.label ?? n.id ?? "", 26)}
                </text>
                <text
                  x={12}
                  y={40}
                  style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", fill: c.text, opacity: 0.75 }}
                >
                  {truncate(n.className ?? n.type ?? "", 30)}
                </text>
                {n.enabled === false ? (
                  <text x={nodeW - 10} y={16} textAnchor="end" style={{ fontSize: 9, fill: "#991b1b", fontFamily: "var(--font-mono, monospace)" }}>
                    DISABLED
                  </text>
                ) : null}
                <title>
                  {n.label ?? n.id}
                  {"\n"}
                  {n.type ?? ""} · {n.className ?? ""}
                </title>
              </g>
            );
          })}
        </svg>

        {edges.length === 0 ? (
          <div className="px-3 pb-2 text-[11px] text-muted-foreground">
            No source→target relationships reported by the backend for this production.
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}



function AISummaryPanel({ productionName, encoded, componentNames }: { productionName: string; encoded: string; componentNames: string[] }) {
  const [result, setResult] = useState<ProductionAISummaryResponse | null>(null);
  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<ProductionAISummaryResponse>(`/productions/${encoded}/ai/summary`, {
        method: "POST",
      }),
    onSuccess: (r) => {
      setResult(r);
      if (r.generated) toast.success("AI summary generated");
      else if (r.warnings?.length) toast.message(r.warnings[0]?.message ?? "AI summary unavailable");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <section className="bg-card ring-1 ring-black/5 rounded-lg p-5 max-w-4xl">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div>
          <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            AI-assisted summary
          </h2>
          <p className="text-[11px] text-muted-foreground mt-1">
            Calls <span className="font-mono">POST /productions/{productionName}/ai/summary</span>.
            Requires <span className="font-mono">aiProviderEnabled</span> +{" "}
            <span className="font-mono">aiSummaryEnabled</span> and an OpenAI key on the server.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {result?.confidence ? <ConfidenceBadge confidence={result.confidence} /> : null}
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md bg-iris-brand text-white px-3 py-1.5 hover:bg-iris-brand/90 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${mutation.isPending ? "animate-spin" : ""}`} />
            {mutation.isPending ? "Generating…" : result ? "Regenerate" : "Generate AI summary"}
          </button>
        </div>
      </div>

      {mutation.error ? (
        <div className="text-xs font-mono text-destructive break-all mb-2">
          {(mutation.error as Error).message}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
            <span
              className={`rounded px-2 py-0.5 ring-1 ${
                result.generated
                  ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
                  : "text-muted-foreground ring-black/10"
              }`}
            >
              {result.generated ? "AI GENERATED" : "FALLBACK"}
            </span>
            {result.provider ? <span className="text-muted-foreground">provider: {result.provider}</span> : null}
            {result.model ? <span className="text-muted-foreground">model: {result.model}</span> : null}
            {result.aiApiKeySource ? (
              <span className="text-muted-foreground">key: {result.aiApiKeySource}</span>
            ) : null}
          </div>

          {result.summary ? (
            <MarkdownContent linkComponents={componentNames} productionName={productionName}>{result.summary}</MarkdownContent>
          ) : (
            <p className="text-xs text-muted-foreground italic">No AI summary text returned.</p>
          )}


          {!result.generated && result.deterministicSummary ? (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Deterministic fallback
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-foreground/80">
                {result.deterministicSummary}
              </p>
              <SummaryBullets bullets={result.deterministicSummaryBullets} />
            </details>
          ) : null}

          {result.warnings?.length ? (
            <ul className="text-[11px] font-mono text-amber-700 space-y-0.5">
              {result.warnings.map((w, i) => (
                <li key={i}>⚠ {w.code ? `${w.code}: ` : ""}{w.message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Click <em>Generate AI summary</em> to have the module compose a narrative summary from
          the deterministic analysis and evidence.
        </p>
      )}
    </section>
  );
}

function AIAskPanel({
  productionName,
  encoded,
  componentNames,
}: {
  productionName: string;
  encoded: string;
  componentNames: string[];
}) {
  const [question, setQuestion] = useState("");
  const [componentName, setComponentName] = useState<string>("");
  const [maxChunks, setMaxChunks] = useState<number>(8);
  const [history, setHistory] = useState<ProductionAIAskResponse[]>([]);
  const [preview, setPreview] = useState<ProductionRAGContextResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (body: { question: string; componentName?: string; maxChunks?: number }) =>
      apiFetch<ProductionAIAskResponse>(`/productions/${encoded}/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: (r) => {
      setHistory((h) => [r, ...h]);
      if (r.generated) toast.success("AI answer generated");
      else if (r.warnings?.length) toast.message(r.warnings[0]?.message ?? "AI answer unavailable");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const previewMutation = useMutation({
    mutationFn: (body: { question?: string; componentName?: string; maxChunks?: number }) => {
      const params = new URLSearchParams();
      if (body.question) params.set("question", body.question);
      if (body.componentName) params.set("componentName", body.componentName);
      if (body.maxChunks) params.set("maxChunks", String(body.maxChunks));
      const qs = params.toString();
      return apiFetch<ProductionRAGContextResponse>(
        `/productions/${encoded}/rag/context${qs ? `?${qs}` : ""}`,
      );
    },
    onSuccess: (r) => {
      setPreview(r);
      toast.success(`Retrieved ${r.retrievedChunkCount ?? r.retrievedChunks?.length ?? 0} chunks`);
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || mutation.isPending) return;
    mutation.mutate({
      question: question.trim(),
      componentName: componentName || undefined,
      maxChunks: maxChunks || undefined,
    });
  };

  const suggestions = [
    "What does this production do?",
    "Why might messages fail here?",
    "Which components have the most warnings?",
    "How are services connected to operations?",
  ];

  return (
    <section className="space-y-6 max-w-4xl">
      <div className="bg-card ring-1 ring-black/5 rounded-lg p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="size-9 rounded-md bg-iris-brand/10 text-iris-brand flex items-center justify-center shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold">Ask about this production</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Retrieval-augmented answer grounded in analysis chunks.{" "}
              <span className="font-mono">POST /productions/{productionName}/ai/ask</span>
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Why does this production route messages the way it does?"
            rows={3}
            className="w-full text-sm rounded-md ring-1 ring-black/10 bg-background px-3 py-2 font-mono focus:outline-none focus:ring-iris-brand"
          />

          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuestion(s)}
                className="text-[11px] font-mono text-muted-foreground hover:text-foreground rounded-full ring-1 ring-black/10 px-2.5 py-1 bg-muted/40 hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
              <span className="uppercase tracking-wider">Scope</span>
              <select
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="bg-card ring-1 ring-black/10 rounded px-2 py-1 font-mono text-foreground"
              >
                <option value="">Whole production</option>
                {componentNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
              <span className="uppercase tracking-wider">Max chunks</span>
              <input
                type="number"
                min={1}
                max={32}
                value={maxChunks}
                onChange={(e) => setMaxChunks(Number(e.target.value) || 8)}
                className="w-16 bg-card ring-1 ring-black/10 rounded px-2 py-1 font-mono text-foreground"
              />
            </label>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                disabled={previewMutation.isPending}
                onClick={() =>
                  previewMutation.mutate({
                    question: question.trim() || undefined,
                    componentName: componentName || undefined,
                    maxChunks: maxChunks || undefined,
                  })
                }
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md ring-1 ring-iris-brand/40 text-iris-brand px-3 py-1.5 hover:bg-iris-brand/10 disabled:opacity-50"
                title="GET /productions/{name}/rag/context — inspect retrieved chunks without invoking AI"
              >
                {previewMutation.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                {previewMutation.isPending ? "Retrieving…" : "Preview retrieval"}
              </button>
              <button
                type="submit"
                disabled={!question.trim() || mutation.isPending}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md bg-iris-brand text-white px-3 py-1.5 hover:bg-iris-brand/90 disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {mutation.isPending ? "Asking…" : "Ask"}
              </button>
            </div>
          </div>
        </form>

        {mutation.error ? (
          <div className="text-xs font-mono text-destructive break-all mt-3">
            {(mutation.error as Error).message}
          </div>
        ) : null}
      </div>

      {preview ? <RAGContextPanel data={preview} onClose={() => setPreview(null)} /> : null}

      <RAGIndexSection encoded={encoded} productionName={productionName} componentNames={componentNames} />

      {history.length === 0 && !mutation.isPending ? (
        <p className="text-xs text-muted-foreground italic">
          Ask a question to have the module retrieve grounded analysis chunks and generate an answer.
          Requires <span className="font-mono">aiProviderEnabled</span> and an OpenAI key on the server;
          otherwise a deterministic fallback is returned.
        </p>
      ) : null}

      <div className="space-y-4">
        {history.map((r, idx) => (
          <AIAskResult key={idx} result={r} />
        ))}
      </div>
    </section>
  );
}

function RAGIndexSection({
  encoded,
  productionName,
  componentNames,
}: {
  encoded: string;
  productionName: string;
  componentNames: string[];
}) {
  const qc = useQueryClient();
  const status = useQuery<RAGIndexStatusResponse>({
    queryKey: ["rag-index", productionName],
    queryFn: () => apiFetch<RAGIndexStatusResponse>(`/productions/${encoded}/rag/index`),
    retry: 0,
  });

  const [includeRuntime, setIncludeRuntime] = useState(false);
  const [includePayload, setIncludePayload] = useState(false);
  const [lookbackHours, setLookbackHours] = useState<number | "">("");
  const [maxMessages, setMaxMessages] = useState<number | "">("");
  const [maxLogs, setMaxLogs] = useState<number | "">("");

  const rebuild = useMutation({
    mutationFn: () => {
      const body: Record<string, unknown> = {};
      if (includeRuntime) {
        body.includeRuntime = true;
        if (lookbackHours !== "") body.lookbackHours = Number(lookbackHours);
        if (maxMessages !== "") body.maxMessages = Number(maxMessages);
        if (maxLogs !== "") body.maxLogs = Number(maxLogs);
      }
      if (includePayload) body.includePayload = true;
      return apiFetch<RAGIndexRebuildResponse>(`/productions/${encoded}/rag/index`, {
        method: "POST",
        headers: Object.keys(body).length ? { "Content-Type": "application/json" } : undefined,
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      });
    },
    onSuccess: (r) => {
      toast.success(`Index rebuilt · ${r.chunkCount ?? 0} chunks · run #${r.runId ?? "?"}`);
      qc.invalidateQueries({ queryKey: ["rag-index", productionName] });
      qc.invalidateQueries({ queryKey: ["rag-chunks", productionName] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const s = status.data;
  const indexed = s?.indexed;
  const stale = s?.stale;
  const statusChip = indexed
    ? stale
      ? { label: "STALE", tone: "text-amber-700 ring-amber-500/30 bg-amber-500/10" }
      : { label: "READY", tone: "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" }
    : { label: "NOT INDEXED", tone: "text-muted-foreground ring-black/10 bg-muted/40" };

  return (
    <section className="bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="size-9 rounded-md bg-iris-brand/10 text-iris-brand flex items-center justify-center shrink-0">
            <Database className="size-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Persisted RAG index</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Deterministic analysis chunks stored server-side. Ask AI uses this index when present.{" "}
              <span className="font-mono">GET /rag/index</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-mono uppercase tracking-wider ring-1 rounded px-2 py-0.5 ${statusChip.tone}`}>
            {statusChip.label}
          </span>
          <button
            onClick={() => rebuild.mutate()}
            disabled={rebuild.isPending}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md ring-1 ring-iris-brand/40 text-iris-brand px-3 py-1.5 hover:bg-iris-brand/10 disabled:opacity-50"
            title="POST /rag/index — rebuild deterministic index"
          >
            {rebuild.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Hammer className="w-3.5 h-3.5" />}
            {rebuild.isPending ? "Rebuilding…" : "Rebuild index"}
          </button>
        </div>
      </header>

      <div className="rounded-md ring-1 ring-black/5 bg-muted/30 p-3 space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Rebuild options
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={includeRuntime}
              onChange={(e) => setIncludeRuntime(e.target.checked)}
            />
            Include runtime (messages + logs)
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={includePayload}
              onChange={(e) => setIncludePayload(e.target.checked)}
            />
            Include payload metadata
          </label>
          {includeRuntime ? (
            <>
              <label className="flex items-center gap-1.5 text-muted-foreground">
                <span className="uppercase tracking-wider">Lookback h</span>
                <input
                  type="number"
                  min={1}
                  value={lookbackHours}
                  onChange={(e) => setLookbackHours(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-20 bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground"
                  placeholder="24"
                />
              </label>
              <label className="flex items-center gap-1.5 text-muted-foreground">
                <span className="uppercase tracking-wider">Max msg</span>
                <input
                  type="number"
                  min={1}
                  value={maxMessages}
                  onChange={(e) => setMaxMessages(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-20 bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground"
                />
              </label>
              <label className="flex items-center gap-1.5 text-muted-foreground">
                <span className="uppercase tracking-wider">Max log</span>
                <input
                  type="number"
                  min={1}
                  value={maxLogs}
                  onChange={(e) => setMaxLogs(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-20 bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground"
                />
              </label>
            </>
          ) : null}
        </div>
      </div>


      {status.isLoading ? (
        <Skeleton className="h-4 w-64" />
      ) : status.error ? (
        <p className="text-xs font-mono text-destructive break-all">
          {(status.error as Error).message}
        </p>
      ) : s ? (
        <>
          <div className="flex flex-wrap gap-1.5">
            {[
              ["chunks", s.chunkCount],
              ["source classes", s.sourceClassCount],
              ["run", s.runId],
              ["components", s.metrics?.componentChunkCount],
              ["connections", s.metrics?.connectionChunkCount],
              ["rules", s.metrics?.ruleChunkCount],
              ["msg types", s.metrics?.messageTypeChunkCount],
              ["transforms", s.metrics?.transformationChunkCount],
              ["BPL", s.metrics?.businessProcessChunkCount],
              ["externals", s.metrics?.externalSystemChunkCount],
              ["warnings", s.metrics?.warningChunkCount],
              ["messages", s.metrics?.messageChunkCount],
              ["logs", s.metrics?.logChunkCount],
              ["payloads", s.metrics?.payloadChunkCount],
              ["runtime", s.metrics?.runtimeChunkCount],
            ]
              .filter(([, v]) => typeof v === "number")
              .map(([k, v]) => (
                <span
                  key={String(k)}
                  className="text-[10px] font-mono rounded-full bg-muted/60 ring-1 ring-black/5 px-2 py-0.5 text-foreground/80"
                >
                  {String(k)}: {String(v)}
                </span>
              ))}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground space-y-0.5">
            {s.statusText ? <p>{s.statusText}</p> : s.status ? <p>status: {s.status}</p> : null}
            {s.runTimestamp ? <p>indexed at: {s.runTimestamp}</p> : null}
            {s.latestSourceChangedAt ? (
              <p>
                latest source change: {s.latestSourceChangedAt}
                {s.latestSourceClassName ? ` · ${s.latestSourceClassName}` : ""}
              </p>
            ) : null}
          </div>
          {s.warnings?.length ? (
            <ul className="text-[11px] font-mono text-amber-700 space-y-0.5">
              {s.warnings.map((w, i) => (
                <li key={i}>⚠ {w.code ? `${w.code}: ` : ""}{w.message}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      {indexed ? (
        <RAGChunkBrowser encoded={encoded} productionName={productionName} componentNames={componentNames} />
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Rebuild the index to browse persisted chunks and enable fast retrieval search.
        </p>
      )}
    </section>
  );
}

function RAGChunkBrowser({
  encoded,
  productionName,
  componentNames,
}: {
  encoded: string;
  productionName: string;
  componentNames: string[];
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("");
  const [componentName, setComponentName] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const chunks = useQuery<RAGChunkListResponse>({
    queryKey: ["rag-chunks", productionName, kind, componentName, offset],
    queryFn: () => {
      const p = new URLSearchParams();
      p.set("limit", String(limit));
      p.set("offset", String(offset));
      if (kind) p.set("kind", kind);
      if (componentName) p.set("componentName", componentName);
      return apiFetch<RAGChunkListResponse>(`/productions/${encoded}/rag/chunks?${p.toString()}`);
    },
    enabled: open,
    retry: 0,
  });

  const items = chunks.data?.items ?? [];
  const total = chunks.data?.totalCount ?? 0;
  const hasMore = chunks.data?.hasMore ?? false;

  const kinds = [
    "", "component", "connection", "rule", "messageType", "externalSystem",
    "transformation", "businessProcess", "warning", "summary",
  ];

  return (
    <div className="border-t border-black/5 pt-4 mt-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <Search className="w-3.5 h-3.5" />
        {open ? "Hide" : "Browse"} persisted chunks
      </button>

      {open ? (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <label className="flex items-center gap-1.5 text-muted-foreground">
              <span className="uppercase tracking-wider">Kind</span>
              <select
                value={kind}
                onChange={(e) => { setKind(e.target.value); setOffset(0); }}
                className="bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground"
              >
                {kinds.map((k) => (
                  <option key={k} value={k}>{k || "any"}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-muted-foreground">
              <span className="uppercase tracking-wider">Component</span>
              <select
                value={componentName}
                onChange={(e) => { setComponentName(e.target.value); setOffset(0); }}
                className="bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground"
              >
                <option value="">any</option>
                {componentNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <span className="text-muted-foreground ml-auto">
              {chunks.isLoading ? "loading…" : `${offset + 1}-${offset + items.length} of ${total}`}
            </span>
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="ring-1 ring-black/10 rounded px-2 py-1 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={!hasMore}
              className="ring-1 ring-black/10 rounded px-2 py-1 disabled:opacity-40"
            >
              Next →
            </button>
          </div>

          {chunks.error ? (
            <p className="text-xs font-mono text-destructive break-all">
              {(chunks.error as Error).message}
            </p>
          ) : items.length === 0 && !chunks.isLoading ? (
            <p className="text-xs text-muted-foreground italic">No chunks match the current filters.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((c, i) => (
                <li key={c.id ?? i} className="ring-1 ring-black/5 rounded-md p-3 bg-muted/30">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-iris-brand">
                      {c.kind ?? "chunk"}
                    </span>
                    {c.title ? <span className="text-xs font-semibold">{c.title}</span> : null}
                    {c.component ? (
                      <span className="text-[10px] font-mono text-muted-foreground">· {c.component}</span>
                    ) : null}
                    {(() => {
                      const t = citationLinkProps(c, productionName);
                      return t ? (
                        <Link
                          to={t.to}
                          params={t.params as never}
                          search={t.search as never}
                          title={t.hint}
                          className="text-[10px] font-mono uppercase tracking-wider text-iris-brand hover:underline"
                        >
                          open →
                        </Link>
                      ) : null;
                    })()}
                    {c.id ? (
                      <span className="text-[10px] font-mono text-muted-foreground ml-auto">{c.id}</span>
                    ) : null}
                    {c.confidence ? <ConfidenceBadge confidence={c.confidence} /> : null}
                  </div>
                  {c.text ? (
                    <p className="text-[11px] font-mono text-foreground/80 whitespace-pre-wrap">{c.text}</p>
                  ) : null}
                  {c.source ? (
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">source: {c.source}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Resolve a RAG citation/chunk to an in-app navigation target, if any.
 * Handles component / message / log / session / payload kinds and falls back
 * to component pages whenever a `component` field is present.
 */
function citationLinkProps(
  c: { kind?: string; component?: string; chunkId?: string; id?: string; source?: string; title?: string },
  productionName?: string,
):
  | { to: string; params?: Record<string, string>; search?: Record<string, string | number>; hint: string }
  | null {
  const kind = (c.kind ?? "").toLowerCase();
  const idish = c.chunkId ?? c.id ?? "";
  const digits = (s: string) => {
    const m = /(\d{2,})/.exec(s);
    return m ? m[1] : "";
  };

  // Message chunk
  if (/message|payload|trace|session/.test(kind)) {
    const src = `${idish} ${c.source ?? ""} ${c.title ?? ""}`;
    const msgMatch = /(?:^|[^a-z])(?:message|msg|m)[:_\-#/]?(\d+)/i.exec(src);
    if (msgMatch) return { to: "/messages/$id", params: { id: msgMatch[1] }, hint: "Open message" };
    const sesMatch = /(?:^|[^a-z])(?:session|ses|s)[:_\-#/]?(\d+)/i.exec(src);
    if (sesMatch) return { to: "/messages", search: { sessionId: sesMatch[1] }, hint: "Open session" };
    if (/message/.test(kind)) {
      const d = digits(idish);
      if (d) return { to: "/messages/$id", params: { id: d }, hint: "Open message" };
    }
    if (/session/.test(kind)) {
      const d = digits(idish);
      if (d) return { to: "/messages", search: { sessionId: d }, hint: "Open session" };
    }
  }

  // Log chunk
  if (/log/.test(kind)) {
    return { to: "/logs", hint: "Open logs" };
  }

  // Component / connection / rule / transformation / businessProcess / etc.
  if (c.component && productionName) {
    return {
      to: "/productions/$name/components/$componentName",
      params: { name: productionName, componentName: c.component },
      search: { fromTab: "ask" },
      hint: `Open ${c.component}`,
    };
  }

  // Bare component chunk without explicit component name
  if (/^component/.test(kind) && c.title && productionName) {
    return {
      to: "/productions/$name/components/$componentName",
      params: { name: productionName, componentName: c.title },
      search: { fromTab: "ask" },
      hint: `Open ${c.title}`,
    };
  }


  return null;
}

function AIAskResult({ result }: { result: ProductionAIAskResponse }) {
  const [expanded, setExpanded] = useState(false);
  const citedIds = new Set(
    (result.citations ?? []).map((c) => c.chunkId).filter(Boolean) as string[],
  );
  const uncitedIds = new Set(result.uncitedChunkIds ?? []);
  const invalidIds = result.invalidCitationIds ?? [];
  const hasCitations = (result.citations?.length ?? 0) > 0;
  const groundedKnown = typeof result.answerGrounded === "boolean";
  return (
    <article className="bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Question{result.componentName ? ` · ${result.componentName}` : ""}
          </p>
          <p className="text-sm font-medium text-foreground/90">{result.question}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {groundedKnown ? (
            <span
              className={`text-[10px] font-mono rounded px-2 py-0.5 ring-1 ${
                result.answerGrounded
                  ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
                  : "text-amber-700 ring-amber-500/30 bg-amber-500/10"
              }`}
              title={
                result.answerGrounded
                  ? "Every citation in the answer resolves to a retrieved chunk"
                  : "Answer contains invalid or missing citations"
              }
            >
              {result.answerGrounded ? "GROUNDED" : "UNGROUNDED"}
            </span>
          ) : null}
          {result.confidence ? <ConfidenceBadge confidence={result.confidence} /> : null}
          <span
            className={`text-[10px] font-mono rounded px-2 py-0.5 ring-1 ${
              result.generated
                ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
                : "text-muted-foreground ring-black/10"
            }`}
          >
            {result.generated ? "AI GENERATED" : "FALLBACK"}
          </span>
        </div>
      </header>

      {result.answer ? (
        <MarkdownContent>{result.answer}</MarkdownContent>
      ) : (
        <p className="text-xs text-muted-foreground italic">No answer text returned.</p>
      )}


      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted-foreground">
        {result.provider ? <span>provider: {result.provider}</span> : null}
        {result.model ? <span>model: {result.model}</span> : null}
        {result.aiApiKeySource ? <span>key: {result.aiApiKeySource}</span> : null}
        {typeof result.chunkCount === "number" ? (
          <span>
            chunks: {result.chunkCount}
            {typeof result.totalChunkCount === "number" ? ` / ${result.totalChunkCount}` : ""}
          </span>
        ) : null}
        {typeof result.citationCount === "number" ? (
          <span>citations: {result.citationCount}</span>
        ) : null}
        {typeof result.invalidCitationCount === "number" && result.invalidCitationCount > 0 ? (
          <span className="text-amber-700">invalid: {result.invalidCitationCount}</span>
        ) : null}
        {uncitedIds.size > 0 ? <span>uncited: {uncitedIds.size}</span> : null}
        {result.chunkSource ? <span>source: {result.chunkSource}</span> : null}
        {typeof result.runId === "number" ? <span>run #{result.runId}</span> : null}
      </div>

      {hasCitations ? (
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Citations
          </p>
          <ul className="space-y-1">
            {result.citations!.map((c, i) => {
              const target = citationLinkProps(c, result.productionName);
              const rowClass =
                "flex items-center gap-2 text-[11px] font-mono ring-1 ring-iris-brand/20 bg-iris-brand/5 rounded px-2 py-1";
              const inner = (
                <>
                  <span className="text-iris-brand shrink-0">[{i + 1}]</span>
                  <span className="text-iris-brand shrink-0 uppercase tracking-wider">
                    {c.kind ?? "chunk"}
                  </span>
                  {c.title ? (
                    <span className="text-foreground/90 truncate">{c.title}</span>
                  ) : null}
                  {c.component ? (
                    <span className="text-muted-foreground truncate">· {c.component}</span>
                  ) : null}
                  {c.confidence ? (
                    <span className="ml-auto shrink-0">
                      <ConfidenceBadge confidence={c.confidence} />
                    </span>
                  ) : null}
                  {c.chunkId ? (
                    <span className="text-muted-foreground/70 shrink-0 ml-1">{c.chunkId}</span>
                  ) : null}
                </>
              );
              return (
                <li key={c.chunkId ?? i}>
                  {target ? (
                    <Link
                      to={target.to}
                      params={target.params as never}
                      search={target.search as never}
                      title={target.hint}
                      className={`${rowClass} hover:bg-iris-brand/10 hover:ring-iris-brand/40 transition-colors cursor-pointer no-underline`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className={rowClass}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {invalidIds.length > 0 ? (
        <div className="text-[11px] font-mono text-amber-700 ring-1 ring-amber-500/30 bg-amber-500/5 rounded p-2">
          <p className="uppercase tracking-wider mb-1">Invalid citations</p>
          <p className="break-all">{invalidIds.join(", ")}</p>
          <p className="text-[10px] mt-1 text-amber-700/80">
            The model referenced these chunk ids, but they were not in the retrieval set.
          </p>
        </div>
      ) : null}

      {result.warnings?.length ? (
        <ul className="text-[11px] font-mono text-amber-700 space-y-0.5">
          {result.warnings.map((w, i) => (
            <li key={i}>⚠ {w.code ? `${w.code}: ` : ""}{w.message}</li>
          ))}
        </ul>
      ) : null}

      {result.chunks && result.chunks.length > 0 ? (
        <div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            {expanded ? "Hide" : "Show"} retrieved chunks ({result.chunks.length}
            {citedIds.size > 0 ? `, ${citedIds.size} cited` : ""})
          </button>
          {expanded ? (
            <ul className="mt-2 space-y-2">
              {result.chunks.map((c: RAGChunk, i) => {
                const cited = c.id ? citedIds.has(c.id) : false;
                const uncited = c.id ? uncitedIds.has(c.id) : false;
                return (
                  <li
                    key={c.id ?? i}
                    className={`ring-1 rounded-md p-3 ${
                      cited
                        ? "ring-iris-brand/40 bg-iris-brand/5"
                        : uncited
                          ? "ring-black/5 bg-muted/20 opacity-70"
                          : "ring-black/5 bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      {cited ? (
                        <span className="text-[10px] font-mono uppercase tracking-wider rounded px-1.5 py-0.5 bg-iris-brand text-white">
                          cited
                        </span>
                      ) : uncited ? (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          uncited
                        </span>
                      ) : null}
                      <span className="text-[10px] font-mono uppercase tracking-wider text-iris-brand">
                        {c.kind ?? "chunk"}
                      </span>
                      {c.title ? (
                        <span className="text-xs font-semibold">{c.title}</span>
                      ) : null}
                      {c.component ? (
                        <span className="text-[10px] font-mono text-muted-foreground">· {c.component}</span>
                      ) : null}
                      {c.id ? (
                        <span className="text-[10px] font-mono text-muted-foreground/70">
                          {c.id}
                        </span>
                      ) : null}
                      {(() => {
                        const t = citationLinkProps(c, result.productionName);
                        return t ? (
                          <Link
                            to={t.to}
                            params={t.params as never}
                            search={t.search as never}
                            title={t.hint}
                            className="text-[10px] font-mono uppercase tracking-wider text-iris-brand hover:underline"
                          >
                            open →
                          </Link>
                        ) : null;
                      })()}
                      {typeof c.score === "number" ? (
                        <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                          score {c.score}
                        </span>
                      ) : null}
                      {c.confidence ? <ConfidenceBadge confidence={c.confidence} /> : null}
                    </div>
                    {c.text ? (
                      <p className="text-[11px] font-mono text-foreground/80 whitespace-pre-wrap">
                        {c.text}
                      </p>
                    ) : null}
                    {c.source ? (
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">
                        source: {c.source}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}


function RAGContextPanel({
  data,
  onClose,
}: {
  data: ProductionRAGContextResponse;
  onClose: () => void;
}) {
  const chunks = data.retrievedChunks && data.retrievedChunks.length > 0
    ? data.retrievedChunks
    : data.chunks ?? [];
  const m = data.metrics ?? {};
  const chips: Array<[string, number | undefined]> = [
    ["retrieved", data.retrievedChunkCount ?? m.retrievedChunkCount],
    ["total", data.chunkCount ?? m.chunkCount],
    ["components", m.componentChunkCount],
    ["connections", m.connectionChunkCount],
    ["rules", m.ruleChunkCount],
    ["msg types", m.messageTypeChunkCount],
    ["externals", m.externalSystemChunkCount],
    ["transforms", m.transformationChunkCount],
    ["BPL", m.businessProcessChunkCount],
    ["warnings", m.warningChunkCount],
  ];
  return (
    <section className="bg-card ring-1 ring-iris-brand/20 rounded-lg p-5 space-y-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-iris-brand mb-1">
            Retrieval preview · GET /rag/context
          </p>
          <p className="text-sm font-medium">
            {data.question ? (
              <>Question: <span className="font-mono text-foreground/80">{data.question}</span></>
            ) : (
              <span className="text-muted-foreground italic">No question — showing default retrieval set</span>
            )}
          </p>
          {data.componentName ? (
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
              scope: {data.componentName}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {data.confidence ? <ConfidenceBadge confidence={data.confidence} /> : null}
          <button
            onClick={onClose}
            className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground ring-1 ring-black/10 rounded px-2 py-0.5"
          >
            Close
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {chips
          .filter(([, v]) => typeof v === "number")
          .map(([k, v]) => (
            <span
              key={k}
              className="text-[10px] font-mono rounded-full bg-muted/60 ring-1 ring-black/5 px-2 py-0.5 text-foreground/80"
            >
              {k}: {v}
            </span>
          ))}
      </div>

      {data.warnings?.length ? (
        <ul className="text-[11px] font-mono text-amber-700 space-y-0.5">
          {data.warnings.map((w, i) => (
            <li key={i}>⚠ {w.code ? `${w.code}: ` : ""}{w.message}</li>
          ))}
        </ul>
      ) : null}

      {chunks.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No chunks returned.</p>
      ) : (
        <ul className="space-y-2">
          {chunks.map((c: RAGChunk, i) => (
            <li key={c.id ?? i} className="ring-1 ring-black/5 rounded-md p-3 bg-muted/30">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-iris-brand">
                  {c.kind ?? "chunk"}
                </span>
                {c.title ? <span className="text-xs font-semibold">{c.title}</span> : null}
                {c.component ? (
                  <span className="text-[10px] font-mono text-muted-foreground">· {c.component}</span>
                ) : null}
                {(() => {
                  const t = citationLinkProps(c, data.productionName);
                  return t ? (
                    <Link
                      to={t.to}
                      params={t.params as never}
                      search={t.search as never}
                      title={t.hint}
                      className="text-[10px] font-mono uppercase tracking-wider text-iris-brand hover:underline"
                    >
                      open →
                    </Link>
                  ) : null;
                })()}
                {typeof c.score === "number" ? (
                  <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                    score {c.score}
                  </span>
                ) : null}
                {c.confidence ? <ConfidenceBadge confidence={c.confidence} /> : null}
              </div>
              {c.text ? (
                <p className="text-[11px] font-mono text-foreground/80 whitespace-pre-wrap">
                  {c.text}
                </p>
              ) : null}
              {c.source ? (
                <p className="text-[10px] font-mono text-muted-foreground mt-1">
                  source: {c.source}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
