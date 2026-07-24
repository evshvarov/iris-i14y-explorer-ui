import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, AlertCircle, Lock, Send, EyeOff, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import type { MessageHeaderListResponse, ComponentListResponse } from "@/lib/api-types";

import { apiFetch } from "@/lib/api-config";
import type {
  MessageDetailResponse,
  MessageTraceResponse,
  MessagePayloadMetadataResponse,
  MessagePayloadPreviewResponse,
  MessageExplanationResponse,
  MessageSessionSummaryResponse,
  MessageResendResponse,
} from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { EvidencePopover } from "@/components/evidence-popover";
import { EvidenceChips, MetricChip, MetricChips } from "@/components/summary-bits";
import { MarkdownContent } from "@/components/markdown-content";

export const Route = createFileRoute("/messages/$id")({
  head: ({ params }) => ({ meta: [{ title: `Message #${params.id} — IRIS Explainer` }] }),
  component: MessageDetailPage,
});

function MessageDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();

  // Neighbor list for prev/next navigation
  const neighborList = useQuery<MessageHeaderListResponse>({
    queryKey: ["messages", "neighbor-list"],
    queryFn: () => apiFetch<MessageHeaderListResponse>(`/messages?limit=500`),
    retry: 0,
    staleTime: 30_000,
  });

  const { prevId, nextId } = useMemo(() => {
    const items = neighborList.data?.items ?? [];
    const ids = items.map((it) => String(it.messageId));
    const idx = ids.indexOf(String(id));
    if (idx === -1) return { prevId: undefined, nextId: undefined };
    // list is typically newest-first: "previous in time" = idx+1, "next in time" = idx-1
    return {
      prevId: idx < ids.length - 1 ? ids[idx + 1] : undefined,
      nextId: idx > 0 ? ids[idx - 1] : undefined,
    };
  }, [neighborList.data, id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (e.key === "ArrowLeft" && prevId) navigate({ to: "/messages/$id", params: { id: prevId } });
      if (e.key === "ArrowRight" && nextId) navigate({ to: "/messages/$id", params: { id: nextId } });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId, navigate]);

  const detail = useQuery<MessageDetailResponse>({
    queryKey: ["message", id],
    queryFn: () => apiFetch<MessageDetailResponse>(`/messages/${encodeURIComponent(id)}`),
    retry: 0,
  });

  const trace = useQuery<MessageTraceResponse>({
    queryKey: ["message", id, "trace"],
    queryFn: () => apiFetch<MessageTraceResponse>(`/messages/${encodeURIComponent(id)}/trace`),
    retry: 0,
  });

  const payload = useQuery<MessagePayloadMetadataResponse>({
    queryKey: ["message", id, "payload"],
    queryFn: () =>
      apiFetch<MessagePayloadMetadataResponse>(`/messages/${encodeURIComponent(id)}/payload`),
    retry: 0,
  });

  const preview = useQuery<MessagePayloadPreviewResponse>({
    queryKey: ["message", id, "payload", "preview"],
    queryFn: () =>
      apiFetch<MessagePayloadPreviewResponse>(
        `/messages/${encodeURIComponent(id)}/payload/preview`,
      ),
    retry: 0,
  });

  const explain = useQuery<MessageExplanationResponse>({
    queryKey: ["message", id, "explanation"],
    queryFn: () =>
      apiFetch<MessageExplanationResponse>(`/messages/${encodeURIComponent(id)}/explanation`),
    retry: 0,
  });

  const productionName = trace.data?.productionName;

  const session = useQuery<MessageSessionSummaryResponse>({
    queryKey: ["message", id, "session", productionName],
    queryFn: () =>
      apiFetch<MessageSessionSummaryResponse>(
        `/productions/${encodeURIComponent(productionName!)}/messages/${encodeURIComponent(id)}/session`,
      ),
    retry: 0,
    enabled: !!productionName,
  });

  const resend = useMutation<MessageResendResponse, Error, void>({
    mutationFn: () =>
      apiFetch<MessageResendResponse>(
        `/productions/${encodeURIComponent(productionName!)}/messages/${encodeURIComponent(id)}/resend`,
        { method: "POST" },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["message", id] });
    },
  });


  const m = detail.data?.message;
  const overview = trace.data?.traceOverview;
  const explanation = trace.data?.traceExplanation;
  const steps = trace.data?.steps ?? [];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Messages" }]}
        title={`#${id}`}
        status={
          m
            ? { label: m.statusLabel ?? m.statusName ?? m.status ?? "unknown", tone: m.isError ? "inferred" : "confirmed" }
            : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md ring-1 ring-black/5 bg-card overflow-hidden">
              {prevId ? (
                <Link
                  to="/messages/$id"
                  params={{ id: prevId }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 hover:bg-muted"
                  title={`Previous message #${prevId} (←)`}
                >
                  <ChevronLeft className="size-3.5" />
                  <span className="font-mono">#{prevId}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-muted-foreground/50 cursor-not-allowed">
                  <ChevronLeft className="size-3.5" />
                </span>
              )}
              <span className="w-px h-5 bg-black/5" />
              {nextId ? (
                <Link
                  to="/messages/$id"
                  params={{ id: nextId }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 hover:bg-muted"
                  title={`Next message #${nextId} (→)`}
                >
                  <span className="font-mono">#{nextId}</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-muted-foreground/50 cursor-not-allowed">
                  <ChevronRight className="size-3.5" />
                </span>
              )}
            </div>
            {productionName ? (
              <button
                onClick={() => resend.mutate()}
                disabled={resend.isPending}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted disabled:opacity-50"
                title={`Resend via ${productionName}`}
              >
                <Send className="size-3.5" />
                {resend.isPending ? "Resending…" : "Resend"}
              </button>
            ) : null}
            {productionName ? (
              <Link
                to="/productions/$name"
                params={{ name: productionName }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
                title={`Back to ${productionName}`}
              >
                <ArrowLeft className="size-3.5" /> Production
              </Link>
            ) : null}
            <Link
              to="/messages"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
            >
              <ArrowLeft className="size-3.5" /> Messages
            </Link>
          </div>
        }
      />

      <div className="p-8 space-y-8">
        {/* Header meta */}
        {detail.isLoading ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : detail.error ? (
          <ErrorPanel error={detail.error as Error} label="message" />
        ) : m ? (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Meta label="Session" value={String(m.sessionId ?? "—")} mono />
            <Meta label="Type" value={m.type ?? "—"} />
            <Meta label="Body class" value={m.messageBodyClassName ?? "—"} mono />
            <Meta label="Created" value={m.timeCreated ?? "—"} mono />
            <Meta label="Source" value={m.sourceConfigName ?? "—"} mono />
            <Meta label="Target" value={m.targetConfigName ?? "—"} mono />
            <Meta label="Invocation" value={m.invocation ?? "—"} />
            <Meta label="Corresponds to" value={m.correspondingMessageId ? `#${m.correspondingMessageId}` : "—"} mono />
          </section>
        ) : null}

        {/* Payload metadata */}
        {payload.isLoading ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : payload.data ? (
          <PayloadPanel data={payload.data} />
        ) : null}

        {/* Payload scalar preview */}
        {preview.data ? <PayloadPreviewPanel data={preview.data} /> : null}

        {/* Resend result */}
        {resend.data ? <ResendResultPanel data={resend.data} /> : null}
        {resend.error ? (
          <ErrorPanel error={resend.error as Error} label="resend" />
        ) : null}

        {/* Session summary (production-scoped) */}
        {session.data ? <SessionSummaryPanel data={session.data} /> : null}




        {/* Standalone deterministic explanation */}
        {explain.data?.explanation?.text || explain.data?.summary ? (
          <section className="bg-card ring-1 ring-black/5 rounded-lg p-5 border-l-2 border-iris-brand">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Message explanation
              </h2>
              <div className="flex items-center gap-2">
                {typeof explain.data.stepCount === "number" ? (
                  <span className="text-[10px] font-mono uppercase text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                    {explain.data.stepCount} steps
                  </span>
                ) : null}
                <EvidencePopover
                  confidence={explain.data.confidence ?? explain.data.explanation?.confidence}
                  evidence={explain.data.evidence ?? explain.data.explanation?.evidence}
                  label="message explanation"
                />

              </div>
            </div>
            {explain.data.summary ? (
              <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty mb-2">
                {explain.data.summary}
              </p>
            ) : null}
            {explain.data.explanation?.text ? (
              <p className="text-sm text-foreground/80 whitespace-pre-wrap text-pretty">
                {explain.data.explanation.text}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* Summary + trace explanation */}
        {trace.isLoading ? (
          <Skeleton className="h-32 rounded-lg" />
        ) : trace.error ? (
          <ErrorPanel error={trace.error as Error} label="trace" />
        ) : (
          <>
            {trace.data?.summary ? (
              <section className="bg-card ring-1 ring-black/5 rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Trace summary
                  </h2>
                  <EvidencePopover
                    confidence={trace.data.confidence}
                    evidence={trace.data.evidence}
                    label="trace summary"
                  />

                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty">
                  {trace.data.summary}
                </p>
              </section>
            ) : null}

            {overview ? (
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Meta label="Steps" value={String(overview.stepCount ?? steps.length)} />
                <Meta label="Errors" value={String(overview.errorCount ?? 0)} />
                <Meta label="Origin" value={overview.origin ?? "—"} mono />
                <Meta label="Final target" value={overview.finalTarget ?? "—"} mono />
                <Meta label="First seen" value={overview.firstSeen ?? "—"} mono />
                <Meta label="Last seen" value={overview.lastSeen ?? "—"} mono />
                <Meta label="Path" value={overview.path ?? "—"} mono />
                <Meta
                  label="Participants"
                  value={overview.participants?.join(", ") || "—"}
                  mono
                />
              </section>
            ) : null}

            {explanation?.text ? (
              <section className="bg-card ring-1 ring-black/5 rounded-lg p-5 border-l-2 border-iris-brand">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Deterministic explanation
                  </h2>
                  <EvidencePopover
                    confidence={explanation.confidence}
                    evidence={explanation.evidence}
                    label="trace explanation"
                  />

                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty">
                  {explanation.text}
                </p>
              </section>
            ) : null}

            {/* Step timeline */}
            <section>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Steps ({steps.length})
                </h2>
                {trace.data?.metrics ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <MetricChips>
                      <MetricChip
                        label="Steps"
                        value={trace.data.metrics.stepCount ?? steps.length}
                        tone="brand"
                      />
                      {(trace.data.metrics.warningCount ?? 0) > 0 ? (
                        <MetricChip
                          label="Warnings"
                          value={trace.data.metrics.warningCount!}
                          tone="error"
                        />
                      ) : null}
                    </MetricChips>
                    <EvidenceChips m={trace.data.metrics} />
                  </div>
                ) : null}
              </div>
              {steps.length === 0 ? (
                <div className="text-[11px] text-muted-foreground font-mono border border-dashed rounded-lg p-4">
                  No trace steps reconstructed.
                </div>
              ) : (
                <ol className="space-y-3">
                  {steps.map((s, i) => (
                    <li
                      key={i}
                      className={`bg-card ring-1 ring-black/5 rounded-lg p-4 relative ${
                        s.isError ? "border-l-2 border-destructive" : "border-l-2 border-status-observed"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-mono bg-muted rounded px-1.5 py-0.5 text-muted-foreground uppercase">
                          #{s.sequence ?? i + 1}
                        </span>
                        <span className="text-[11px] font-mono truncate flex-1 flex items-center gap-1.5">
                          <ComponentLink name={s.source} productionName={productionName} />
                          <span className="text-muted-foreground">→</span>
                          <ComponentLink name={s.target} productionName={productionName} />
                        </span>
                        {s.isError ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-destructive">
                            <AlertCircle className="size-3" />
                            {s.statusLabel ?? s.statusName ?? s.status}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                            {s.statusLabel ?? s.statusName ?? s.status ?? "ok"}
                          </span>
                        )}
                        <EvidencePopover
                          confidence={s.confidence}
                          evidence={s.evidence}
                          label={`step #${s.sequence ?? i + 1}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] font-mono text-muted-foreground">
                        <div>
                          {s.messageId ? (
                            <Link
                              to="/messages/$id"
                              params={{ id: String(s.messageId) }}
                              className="hover:text-foreground underline-offset-2 hover:underline"
                            >
                              msg #{s.messageId}
                            </Link>
                          ) : (
                            <>msg —</>
                          )}
                        </div>
                        <div>{s.invocation ?? "—"}</div>
                        <div className="truncate col-span-2">
                          <BodyClassLink
                            className={s.messageBodyClassName}
                            productionName={productionName}
                          />
                        </div>
                      </div>
                      {s.explanation ? (
                        <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap text-pretty">
                          {s.explanation}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              )}
            </section>



            {trace.data?.warnings && trace.data.warnings.length > 0 ? (
              <section>
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Warnings
                </h3>
                <ul className="space-y-1">
                  {trace.data.warnings.map((w, i) => (
                    <li key={i} className="text-[11px] font-mono text-status-inferred">
                      [{w.code}] {w.message}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}

function ComponentLink({
  name,
  productionName,
}: {
  name?: string;
  productionName?: string;
}) {
  if (!name) return <span className="text-muted-foreground">?</span>;
  if (!productionName)
    return <span className="truncate" title={name}>{name}</span>;
  return (
    <Link
      to="/productions/$name/components/$componentName"
      params={{ name: productionName, componentName: name }}
      className="truncate underline-offset-2 hover:underline hover:text-iris-brand"
      title={`Open ${name}`}
    >
      {name}
    </Link>
  );
}

function BodyClassLink({
  className,
  productionName,
}: {
  className?: string;
  productionName?: string;
}) {
  if (!className) return <span>—</span>;
  return (
    <Link
      to="/messages"
      search={{
        messageBodyClassName: className,
        ...(productionName ? { productionName } : {}),
      }}
      className="truncate underline-offset-2 hover:underline hover:text-foreground"
      title={`Filter messages by ${className}`}
    >
      {className}
    </Link>
  );
}


function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-3 bg-card ring-1 ring-black/5 rounded-lg">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <div className={`text-xs truncate ${mono ? "font-mono" : ""}`} title={value}>
        {value}
      </div>
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

function CopyButton({ getText, label = "Copy" }: { getText: () => string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(getText());
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          /* ignore */
        }
      }}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={label}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "copied" : label}
    </button>
  );
}

function PayloadPanel({ data }: { data: MessagePayloadMetadataResponse }) {
  const meta = data.metadata;
  const fields = meta?.fields ?? [];
  const restricted = data.restricted || meta?.restricted;
  const supported = data.payloadInspectionSupported ?? meta?.payloadInspectionSupported;
  const inspectionEnabled = data.payloadInspectionEnabled ?? meta?.payloadInspectionEnabled;
  const metadataEnabled = data.payloadMetadataEnabled ?? meta?.payloadMetadataEnabled;

  return (
    <section className="bg-card ring-1 ring-black/5 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Payload metadata
        </h2>
        <div className="flex items-center gap-2">
          {restricted ? (
            <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-status-inferred">
              <Lock className="size-3" /> restricted
            </span>
          ) : null}
          <span className="text-[10px] font-mono uppercase text-muted-foreground" title="Payload metadata flag">
            metadata: {supported ? (metadataEnabled ? "enabled" : "disabled") : "unsupported"}
          </span>
          <span className="text-[10px] font-mono uppercase text-muted-foreground" title="Payload inspection flag">
            inspection: {supported ? (inspectionEnabled ? "enabled" : "disabled") : "unsupported"}
          </span>
          <CopyButton
            label="Copy JSON"
            getText={() => JSON.stringify(data, null, 2)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <Meta label="Body class" value={data.messageBodyClassName ?? "—"} mono />
        <Meta label="Body id" value={data.messageBodyId ?? "—"} mono />
        <Meta
          label="Body available"
          value={data.bodyReferenceAvailable ? "Yes" : "No"}
        />
        <Meta label="Fields" value={String(fields.length)} />
      </div>

      {data.restrictionReason ? (
        <p className="text-[11px] font-mono text-status-inferred mb-3">
          {data.restrictionReason}
        </p>
      ) : null}

      {fields.length > 0 ? (
        <div className="ring-1 ring-black/5 rounded overflow-hidden">
          <ul className="divide-y bg-background/40">
            {fields.map((f, i) => {
              const name = String(
                (f as Record<string, unknown>).name ??
                  (f as Record<string, unknown>).property ??
                  `field_${i}`,
              );
              const type = (f as Record<string, unknown>).type;
              return (
                <li key={i} className="px-3 py-1.5 text-[11px] font-mono flex justify-between gap-3">
                  <span className="truncate">{name}</span>
                  <span className="text-muted-foreground truncate">
                    {type ? String(type) : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-[11px] font-mono text-muted-foreground">
          No field metadata returned.
        </p>
      )}
    </section>
  );
}

function PayloadPreviewPanel({ data }: { data: MessagePayloadPreviewResponse }) {
  const fields = data.fields ?? [];
  const restricted = data.restricted;
  const enabled = data.payloadInspectionEnabled;
  const supported = data.payloadInspectionSupported;

  return (
    <section className="bg-card ring-1 ring-black/5 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Payload preview
        </h2>
        <div className="flex items-center gap-2">
          {restricted ? (
            <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-status-inferred">
              <Lock className="size-3" /> restricted
            </span>
          ) : null}
          <span className="text-[10px] font-mono uppercase text-muted-foreground">
            {supported ? (enabled ? "enabled" : "disabled") : "unsupported"}
          </span>
          {fields.length > 0 ? (
            <>
              <CopyButton
                label="Copy TSV"
                getText={() =>
                  fields
                    .map((f) => `${f.name ?? ""}\t${f.type ?? ""}\t${f.value ?? ""}`)
                    .join("\n")
                }
              />
              <CopyButton
                label="Copy JSON"
                getText={() => JSON.stringify(data, null, 2)}
              />
            </>
          ) : null}
        </div>
      </div>

      {data.restrictionReason ? (
        <p className="text-[11px] font-mono text-status-inferred mb-3">
          {data.restrictionReason}
        </p>
      ) : null}

      {fields.length > 0 ? (
        <div className="ring-1 ring-black/5 rounded overflow-hidden">
          <ul className="divide-y bg-background/40">
            {fields.map((f, i) => (
              <li
                key={i}
                className="group grid grid-cols-[1fr_auto_2fr_auto] items-center gap-3 px-3 py-1.5 text-[11px] font-mono"
              >
                <span className="truncate">{f.name ?? `field_${i}`}</span>
                <span className="text-muted-foreground text-[10px] uppercase bg-muted rounded px-1.5 py-0.5">
                  {f.type ?? "—"}
                </span>
                <span className="truncate flex items-center gap-2 justify-end text-foreground/80">
                  {f.redacted ? (
                    <EyeOff className="size-3 text-status-inferred shrink-0" />
                  ) : null}
                  <span className="truncate" title={f.value ?? ""}>
                    {f.value ?? ""}
                  </span>
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton
                    label=""
                    getText={() => f.value ?? ""}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[11px] font-mono text-muted-foreground">
          No scalar fields returned.
        </p>
      )}
    </section>
  );
}

function SessionSummaryPanel({ data }: { data: MessageSessionSummaryResponse }) {
  return (
    <section className="bg-card ring-1 ring-black/5 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Session summary
          {data.productionName ? (
            <span className="ml-2 text-muted-foreground normal-case font-mono tracking-normal">
              · {data.productionName}
            </span>
          ) : null}
        </h2>
        <ConfidenceBadge confidence={data.confidence} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <MetaSmall label="Session" value={String(data.sessionId ?? "—")} />
        <MetaSmall label="Steps" value={String(data.stepCount ?? 0)} />
        <MetaSmall label="In-prod" value={String(data.productionStepCount ?? 0)} />
        <MetaSmall label="Outside" value={String(data.outsideProductionStepCount ?? 0)} />
        <MetaSmall label="Errors" value={String(data.errorCount ?? 0)} />
        <MetaSmall label="Origin" value={data.origin ?? "—"} />
        <MetaSmall label="Final target" value={data.finalTarget ?? "—"} />
        <MetaSmall label="Path" value={data.path ?? "—"} />
      </div>
      {data.text ? (
        <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty">
          {data.text}
        </p>
      ) : null}
    </section>
  );
}

function MetaSmall({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
        {label}
      </div>
      <div className="text-xs font-mono truncate" title={value}>
        {value}
      </div>
    </div>
  );
}

function ResendResultPanel({ data }: { data: MessageResendResponse }) {
  const ok = data.executed || data.allowed;
  const tone = data.executed
    ? "border-status-confirmed/40 bg-status-confirmed/5 text-status-confirmed"
    : ok
      ? "border-status-observed/40 bg-status-observed/5 text-status-observed"
      : "border-status-inferred/40 bg-status-inferred/5 text-status-inferred";
  return (
    <section className={`rounded-lg p-4 border ${tone}`}>
      <div className="flex items-center gap-2 mb-2">
        <Send className="size-3.5" />
        <h3 className="text-[11px] font-semibold uppercase tracking-widest">
          Resend {data.executed ? "executed" : data.allowed ? "allowed" : "not executed"}
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
        <div>action: {data.action ?? "—"}</div>
        <div>supported: {String(data.supported ?? false)}</div>
        <div>enabled: {String(data.messageResendEnabled ?? false)}</div>
        <div>dryRun: {String(data.dryRun ?? false)}</div>
      </div>
      {data.reason || data.statusText ? (
        <p className="mt-2 text-[11px] font-mono text-foreground/80">
          {data.statusText ?? data.reason}
        </p>
      ) : null}
    </section>
  );
}

