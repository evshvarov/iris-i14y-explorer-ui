import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle, SkipBack, SkipForward, Sparkles, RefreshCw } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import type {
  MessageTraceResponse,
  MessagePayloadMetadataResponse,
  MessagePayloadPreviewResponse,
  MessagePayloadRawResponse,
  MessageDetailResponse,
  MessageFacetResponse,
  MessageHeaderListResponse,
  ProductionAIAskResponse,
  TraceStep,
} from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { JsonView } from "@/components/json-view";
import { XmlView } from "@/components/xml-view";
import { MarkdownContent } from "@/components/markdown-content";
import { EvidencePopover } from "@/components/evidence-popover";


export const Route = createFileRoute("/trace/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Visual trace — Session for #${params.id}` }],
  }),
  component: TracePage,
});

type Tab = "header" | "body" | "contents";

function TracePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>(id);
  const [tab, setTab] = useState<Tab>("contents");

  useEffect(() => {
    setSelectedId(id);
  }, [id]);

  const trace = useQuery<MessageTraceResponse>({
    queryKey: ["message", id, "trace"],
    queryFn: () => apiFetch<MessageTraceResponse>(`/messages/${encodeURIComponent(id)}/trace`),
    retry: 0,
  });

  const steps = trace.data?.steps ?? [];
  const sessionId = trace.data?.sessionId;
  const productionName = trace.data?.productionName;

  // Fetch session list for this production to enable prev/next session navigation
  const facets = useQuery<MessageFacetResponse>({
    queryKey: ["messages-facets", productionName, "trace-nav"],
    queryFn: () =>
      apiFetch<MessageFacetResponse>(
        `/messages/facets?productionName=${encodeURIComponent(productionName!)}&limit=500`,
      ),
    enabled: !!productionName,
    retry: 0,
  });

  const { prevSessionId, nextSessionId } = useMemo(() => {
    const ids = (facets.data?.sessionIds ?? [])
      .map((s) => String(s))
      .filter(Boolean);
    // sort numerically descending (newest first) so "Next" = older session
    const sorted = [...new Set(ids)].sort((a, b) => Number(b) - Number(a));
    const cur = String(sessionId ?? "");
    const i = sorted.indexOf(cur);
    if (i === -1) return { prevSessionId: undefined, nextSessionId: undefined };
    return {
      prevSessionId: i > 0 ? sorted[i - 1] : undefined,
      nextSessionId: i < sorted.length - 1 ? sorted[i + 1] : undefined,
    };
  }, [facets.data?.sessionIds, sessionId]);

  const prevSessionFirstMsg = useQuery<MessageHeaderListResponse>({
    queryKey: ["session-first-msg", productionName, prevSessionId],
    queryFn: () =>
      apiFetch<MessageHeaderListResponse>(
        `/messages?productionName=${encodeURIComponent(productionName!)}&sessionId=${encodeURIComponent(prevSessionId!)}&limit=1`,
      ),
    enabled: !!productionName && !!prevSessionId,
    retry: 0,
  });
  const nextSessionFirstMsg = useQuery<MessageHeaderListResponse>({
    queryKey: ["session-first-msg", productionName, nextSessionId],
    queryFn: () =>
      apiFetch<MessageHeaderListResponse>(
        `/messages?productionName=${encodeURIComponent(productionName!)}&sessionId=${encodeURIComponent(nextSessionId!)}&limit=1`,
      ),
    enabled: !!productionName && !!nextSessionId,
    retry: 0,
  });

  const goSession = (list?: MessageHeaderListResponse) => {
    const mid = list?.items?.[0]?.messageId;
    if (mid != null) navigate({ to: "/trace/$id", params: { id: String(mid) } });
  };


  // Build swim lanes based on step.source & step.target participants
  const lanes = useMemo(() => {
    const order: string[] = [];
    const push = (n?: string) => {
      if (n && !order.includes(n)) order.push(n);
    };
    steps.forEach((s) => {
      push(s.source);
      push(s.target);
    });
    // Heuristic ordering: services first, operations last
    const kindOf = (n: string) => {
      const low = n.toLowerCase();
      if (low.includes("service")) return 0;
      if (low.includes("process")) return 1;
      if (low.includes("operation")) return 2;
      return 1;
    };
    return order.sort((a, b) => kindOf(a) - kindOf(b));
  }, [steps]);

  const selectedStep = steps.find((s) => String(s.messageId) === String(selectedId));

  // Prev/next within session
  const stepIds = steps.map((s) => String(s.messageId));
  const idx = stepIds.indexOf(String(selectedId));
  const prevSelId = idx > 0 ? stepIds[idx - 1] : undefined;
  const nextSelId = idx >= 0 && idx < stepIds.length - 1 ? stepIds[idx + 1] : undefined;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Messages" }, { label: "Visual trace" }]}
        title={sessionId ? `Session #${sessionId}` : `Session for #${id}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md ring-1 ring-black/5 bg-card overflow-hidden">
              <button
                onClick={() => goSession(prevSessionFirstMsg.data)}
                disabled={!prevSessionId || !prevSessionFirstMsg.data?.items?.length}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                title={prevSessionId ? `Session #${prevSessionId}` : "No newer session"}
              >
                <SkipBack className="size-3.5" />
                Prev session
              </button>
              <span className="w-px h-5 bg-black/5" />
              <button
                onClick={() => goSession(nextSessionFirstMsg.data)}
                disabled={!nextSessionId || !nextSessionFirstMsg.data?.items?.length}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                title={nextSessionId ? `Session #${nextSessionId}` : "No older session"}
              >
                Next session
                <SkipForward className="size-3.5" />
              </button>
            </div>
            <div className="flex items-center rounded-md ring-1 ring-black/5 bg-card overflow-hidden">
              <button
                onClick={() => prevSelId && setSelectedId(prevSelId)}
                disabled={!prevSelId}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous item"
              >
                <ChevronLeft className="size-3.5" />
                Prev
              </button>
              <span className="w-px h-5 bg-black/5" />
              <button
                onClick={() => nextSelId && setSelectedId(nextSelId)}
                disabled={!nextSelId}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                title="Next item"
              >
                Next
                <ChevronRight className="size-3.5" />
              </button>
            </div>

            <Link
              to="/messages/$id"
              params={{ id }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
            >
              <ArrowLeft className="size-3.5" /> Message
            </Link>
            {productionName ? (
              <Link
                to="/productions/$name"
                params={{ name: productionName }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
              >
                <ArrowLeft className="size-3.5" /> Production
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="p-4 md:p-6">
        {trace.isLoading ? (
          <Skeleton className="h-96 rounded-lg" />
        ) : trace.error ? (
          <div className="text-sm text-destructive">
            <AlertCircle className="inline size-4 mr-1" />
            {(trace.error as Error).message}
          </div>
        ) : steps.length === 0 ? (
          <div className="text-[11px] text-muted-foreground font-mono border border-dashed rounded-lg p-4">
            No steps in this session.
          </div>
        ) : (
          <div className="space-y-4">
            <TraceSummarySection trace={trace.data} />
            {productionName ? (
              <TraceAISummary
                productionName={productionName}
                sessionId={sessionId}
                messageId={id}
                trace={trace.data}
              />
            ) : null}
            <ResizablePanelGroup
              orientation="horizontal"
              className="min-h-[500px] rounded-lg"
            >

              <ResizablePanel defaultSize={48} minSize={25}>
                <section className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden h-full flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 bg-muted/40">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      Session {sessionId ?? "—"} · {steps.length} items
                    </div>
                    {productionName ? (
                      <div className="text-[10px] font-mono text-muted-foreground truncate">
                        {productionName}
                      </div>
                    ) : null}
                  </div>
                  <SwimLanes
                    lanes={lanes}
                    steps={steps}
                    selectedId={String(selectedId)}
                    onSelect={(mid) => setSelectedId(String(mid))}
                  />
                </section>
              </ResizablePanel>
              <ResizableHandle withHandle className="mx-1 bg-transparent" />
              <ResizablePanel defaultSize={52} minSize={25}>
                <section className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden flex flex-col h-full">
                  <div className="flex items-center gap-1 px-2 py-1 border-b border-black/5 bg-muted/40">
                    {(["header", "body", "contents"] as Tab[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`text-[11px] font-medium px-3 py-1.5 rounded ${
                          tab === t
                            ? "bg-card ring-1 ring-black/5 text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center gap-2">
                      {selectedStep ? (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          #{selectedStep.messageId} · seq {selectedStep.sequence ?? "—"}
                        </span>
                      ) : null}
                      <Link
                        to="/messages/$id"
                        params={{ id: String(selectedId) }}
                        className="text-[10px] font-mono text-iris-brand hover:underline"
                      >
                        open detail →
                      </Link>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <MessageContentPanel messageId={String(selectedId)} productionName={productionName} tab={tab} step={selectedStep} />
                  </div>
                </section>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}
      </div>
    </>
  );
}

function SwimLanes({
  lanes,
  steps,
  selectedId,
  onSelect,
}: {
  lanes: string[];
  steps: TraceStep[];
  selectedId: string;
  onSelect: (mid: number | string | undefined) => void;
}) {
  if (lanes.length === 0) {
    return <div className="p-4 text-[11px] text-muted-foreground">No participants.</div>;
  }
  const colW = 180;
  const rowH = 56;
  const width = lanes.length * colW;
  const height = Math.max(160, steps.length * rowH + 48);
  const laneIndex = (name?: string) =>
    name ? Math.max(0, lanes.indexOf(name)) : 0;

  return (
    <div className="overflow-auto max-h-[calc(100vh-260px)]">
      <div style={{ minWidth: width }} className="relative">
        {/* Lane headers */}
        <div
          className="grid sticky top-0 z-10 bg-muted/60 backdrop-blur border-b border-black/5"
          style={{ gridTemplateColumns: `repeat(${lanes.length}, ${colW}px)` }}
        >
          {lanes.map((l) => (
            <div
              key={l}
              className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate border-r border-black/5 last:border-r-0"
              title={l}
            >
              {l}
            </div>
          ))}
        </div>

        {/* SVG connections */}
        <svg
          className="absolute left-0 pointer-events-none"
          style={{ top: 36, width, height }}
          width={width}
          height={height}
        >
          <defs>
            <marker id="trace-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-iris-brand" />
            </marker>
          </defs>
          {steps.map((s, i) => {
            const y = i * rowH + rowH / 2;
            const sx = laneIndex(s.source) * colW + colW / 2;
            const tx = laneIndex(s.target) * colW + colW / 2;
            if (sx === tx) return null;
            const isErr = s.isError || String(s.statusLabel || s.statusName || "").toUpperCase() === "ERROR";
            return (
              <line
                key={i}
                x1={sx}
                y1={y}
                x2={tx}
                y2={y}
                stroke={isErr ? "#dc2626" : "currentColor"}
                className={isErr ? "" : "text-iris-brand/70"}
                strokeWidth={1.5}
                markerEnd="url(#trace-arrow)"
              />
            );
          })}
          {/* Lane dividers */}
          {lanes.map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * colW + colW / 2}
              y1={0}
              x2={i * colW + colW / 2}
              y2={height}
              stroke="currentColor"
              className="text-muted-foreground/15"
              strokeDasharray="2 3"
            />
          ))}
        </svg>

        {/* Step rows: node bubbles */}
        <div className="relative" style={{ height }}>
          {steps.map((s, i) => {
            const y = i * rowH + 8;
            const srcI = laneIndex(s.source);
            const tgtI = laneIndex(s.target);
            const isSel = String(s.messageId) === selectedId;
            const isErr = s.isError || String(s.statusLabel || s.statusName || "").toUpperCase() === "ERROR";
            const time = (s.timeCreated || s.timeProcessed || "").replace("T", " ").slice(0, 19);
            return (
              <div key={i}>
                {/* source bubble */}
                <button
                  onClick={() => onSelect(s.messageId)}
                  className={`absolute -translate-x-1/2 flex flex-col items-center max-w-[${colW - 12}px] focus:outline-none`}
                  style={{ left: srcI * colW + colW / 2, top: y }}
                  title={`#${s.messageId} ${s.source} → ${s.target}`}
                >
                  <span
                    className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded-sm ${
                      isSel
                        ? "bg-iris-brand text-white ring-1 ring-iris-brand"
                        : isErr
                          ? "bg-destructive/10 text-destructive ring-1 ring-destructive/30"
                          : "bg-card ring-1 ring-black/10 text-foreground hover:bg-muted"
                    }`}
                  >
                    [{s.sequence ?? i + 1}] {time || `#${s.messageId}`}
                  </span>
                  <span className="text-[9px] text-muted-foreground truncate mt-0.5 max-w-[160px]">
                    {shortName(s.messageBodyClassName)}
                  </span>
                </button>
                {/* target dot only if different lane */}
                {srcI !== tgtI ? (
                  <span
                    className={`absolute -translate-x-1/2 size-2 rounded-full mt-2 ${
                      isErr ? "bg-destructive" : "bg-iris-brand"
                    }`}
                    style={{ left: tgtI * colW + colW / 2, top: y + 4 }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function shortName(cls?: string) {
  if (!cls) return "";
  const parts = cls.split(".");
  return parts[parts.length - 1] || cls;
}

function MessageContentPanel({
  messageId,
  productionName,
  tab,
  step,
}: {
  messageId: string;
  productionName?: string;
  tab: Tab;
  step?: TraceStep;
}) {
  const [rawFormat, setRawFormat] = useState<"xml" | "json">("json");
  const detail = useQuery<MessageDetailResponse>({
    queryKey: ["message", messageId],
    queryFn: () => apiFetch<MessageDetailResponse>(`/messages/${encodeURIComponent(messageId)}`),
    retry: 0,
  });
  const payload = useQuery<MessagePayloadMetadataResponse>({
    queryKey: ["message", messageId, "payload"],
    queryFn: () =>
      apiFetch<MessagePayloadMetadataResponse>(`/messages/${encodeURIComponent(messageId)}/payload`),
    retry: 0,
  });
  const preview = useQuery<MessagePayloadPreviewResponse>({
    queryKey: ["message", messageId, "payload", "preview"],
    queryFn: () =>
      apiFetch<MessagePayloadPreviewResponse>(
        `/messages/${encodeURIComponent(messageId)}/payload/preview`,
      ),
    retry: 0,
    enabled: tab === "contents",
  });
  const raw = useQuery<MessagePayloadRawResponse>({
    queryKey: ["message", messageId, "payload", "raw", rawFormat, productionName ?? ""],
    queryFn: () => {
      const base = productionName
        ? `/productions/${encodeURIComponent(productionName)}/messages/${encodeURIComponent(messageId)}/payload/raw`
        : `/messages/${encodeURIComponent(messageId)}/payload/raw`;
      return apiFetch<MessagePayloadRawResponse>(`${base}?format=${rawFormat}`);
    },
    retry: 0,
    enabled: tab === "contents",
  });


  if (tab === "header") {
    const m = detail.data?.message ?? step;
    if (detail.isLoading) return <Skeleton className="m-3 h-40" />;
    if (!m) return <Empty label="No header available." />;
    const rows: Array<[string, string | undefined]> = [
      ["Message ID", String((m as any).messageId ?? messageId)],
      ["Session ID", String((m as any).sessionId ?? "—")],
      ["Type", (m as any).type],
      ["Source", (m as any).sourceConfigName ?? (m as any).source],
      ["Target", (m as any).targetConfigName ?? (m as any).target],
      ["Body class", (m as any).messageBodyClassName],
      ["Body ID", (m as any).messageBodyId],
      ["Created", (m as any).timeCreated],
      ["Processed", (m as any).timeProcessed],
      ["Invocation", (m as any).invocation],
      ["Status", (m as any).statusLabel ?? (m as any).statusName ?? (m as any).status],
      ["Corresponds to", (m as any).correspondingMessageId ? `#${(m as any).correspondingMessageId}` : undefined],
    ];
    return (
      <table className="w-full text-[11px] font-mono">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-black/5 last:border-0">
              <td className="px-3 py-1.5 text-muted-foreground w-[140px]">{k}</td>
              <td className="px-3 py-1.5 break-all">{v || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (tab === "body") {
    if (payload.isLoading) return <Skeleton className="m-3 h-40" />;
    const meta = payload.data?.metadata;
    if (!meta) return <Empty label="No body metadata." />;
    return (
      <div className="p-3 space-y-3 text-[11px] font-mono">
        <div className="grid grid-cols-2 gap-2">
          <Kv k="Body class" v={meta.messageBodyClassName || payload.data?.messageBodyClassName} />
          <Kv k="Body ID" v={meta.messageBodyId || payload.data?.messageBodyId} />
          <Kv k="Class exists" v={String(meta.bodyClassExists ?? "—")} />
          <Kv k="Reference" v={String(meta.bodyReferenceAvailable ?? "—")} />
          <Kv k="Inspection" v={String(meta.payloadInspectionEnabled ?? "—")} />
          <Kv k="Metadata" v={String(meta.payloadMetadataEnabled ?? "—")} />
        </div>
        {meta.restricted ? (
          <div className="text-destructive text-[11px]">
            Restricted: {meta.restrictionReason || "PAYLOAD_INSPECTION_DISABLED"}
          </div>
        ) : null}
        {meta.fields && meta.fields.length ? (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Fields ({meta.fields.length})
            </div>
            <pre className="bg-muted/40 rounded p-2 overflow-auto max-h-[380px] text-[10.5px]">
{JSON.stringify(meta.fields, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    );
  }

  // contents — prefer raw body from /payload/raw; fall back to preview fields
  const rawData = raw.data;
  const rawBody =
    rawData?.bodyText ??
    (rawData?.bodyJson !== undefined ? JSON.stringify(rawData.bodyJson, null, 2) : undefined);
  const rawReady = !raw.isLoading && rawData && (rawBody || rawData.bodyContentReturned);

  const FormatToggle = (
    <div className="flex items-center gap-1">
      {(["xml", "json"] as const).map((f) => (
        <button
          key={f}
          onClick={() => setRawFormat(f)}
          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            rawFormat === f
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {f.toUpperCase()}
        </button>
      ))}
      {rawBody ? (
        <button
          onClick={() => navigator.clipboard.writeText(rawBody)}
          className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground hover:text-foreground"
        >
          Copy
        </button>
      ) : null}
    </div>
  );

  if (raw.isLoading && preview.isLoading) return <Skeleton className="m-3 h-60" />;

  if (rawReady && rawBody) {
    const actualFormat = rawData?.format || rawFormat;
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-black/5 bg-muted/30">
          <div className="text-[10px] font-mono text-muted-foreground truncate">
            {rawData?.resolvedMessageBodyClassName || rawData?.messageBodyClassName || "—"}
            {rawData?.redacted ? <span className="ml-2 text-amber-600">· redacted</span> : null}
            <span className="ml-2">· {actualFormat}</span>
          </div>
          {FormatToggle}
        </div>
        <div className="flex-1 overflow-auto bg-muted/20 p-3">
          {actualFormat === "json" ? (
            <JsonView text={rawBody} value={rawData?.bodyJson} />
          ) : (
            <XmlView text={rawBody ?? ""} />
          )}
        </div>
      </div>
    );
  }

  // Raw not available — fall back to preview / restriction messaging
  const data = preview.data;
  const rawRestriction = rawData?.restricted ? rawData?.restrictionReason : undefined;
  if (!data && !rawData) return <Empty label="No content available." />;
  if ((rawData && !rawBody) || (data?.restricted && (!data.fields || data.fields.length === 0))) {
    return (
      <div className="p-4 text-[11px] text-muted-foreground space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-destructive font-mono">
            <AlertCircle className="size-3.5" />
            {rawRestriction || data?.restrictionReason || "PAYLOAD_CONTENT_UNAVAILABLE"}
          </div>
          {FormatToggle}
        </div>
        <p>
          Raw payload body is not returned for this message. This can happen when the body class is
          not persisted, or when payload inspection is disabled in Settings.
        </p>
      </div>
    );
  }
  return (
    <div className="p-3 space-y-3">
      <div className="flex justify-end">{FormatToggle}</div>
      {data?.fields && data.fields.length ? (
        <div className="rounded overflow-hidden ring-1 ring-black/5">
          <table className="w-full text-[11px] font-mono">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Field</th>
                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.fields.map((f, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-3 py-1.5">{f.name}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{f.type}</td>
                  <td className="px-3 py-1.5 break-all">
                    {f.redacted ? (
                      <span className="text-amber-600">[redacted]</span>
                    ) : (
                      <span>{f.value ?? "—"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty label="No fields returned." />
      )}
    </div>
  );
}


function Kv({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9.5px] uppercase tracking-widest text-muted-foreground">{k}</span>
      <span className="break-all">{v || "—"}</span>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="p-4 text-[11px] text-muted-foreground font-mono border border-dashed m-3 rounded">
      {label}
    </div>
  );
}
