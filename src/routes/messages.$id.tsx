import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle, Lock } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import type {
  MessageDetailResponse,
  MessageTraceResponse,
  MessagePayloadMetadataResponse,
  MessageExplanationResponse,
} from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge } from "@/components/confidence-badge";

export const Route = createFileRoute("/messages/$id")({
  head: ({ params }) => ({ meta: [{ title: `Message #${params.id} — IRIS Explainer` }] }),
  component: MessageDetailPage,
});

function MessageDetailPage() {
  const { id } = Route.useParams();

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
            ? { label: m.status ?? "unknown", tone: m.isError ? "inferred" : "confirmed" }
            : undefined
        }
        actions={
          <Link
            to="/messages"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" /> Messages
          </Link>
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



        {/* Summary + explanation */}
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
                  <ConfidenceBadge confidence={trace.data.confidence} />
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
                  <ConfidenceBadge confidence={explanation.confidence} />
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap text-pretty">
                  {explanation.text}
                </p>
              </section>
            ) : null}

            {/* Step timeline */}
            <section>
              <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Steps ({steps.length})
              </h2>
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
                        <span className="text-[11px] font-mono truncate flex-1">
                          {s.source ?? "?"} → {s.target ?? "?"}
                        </span>
                        {s.isError ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-destructive">
                            <AlertCircle className="size-3" />
                            {s.status}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                            {s.status ?? "ok"}
                          </span>
                        )}
                        <ConfidenceBadge confidence={s.confidence} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] font-mono text-muted-foreground">
                        <div>msg #{s.messageId}</div>
                        <div>{s.invocation ?? "—"}</div>
                        <div className="truncate col-span-2">{s.messageBodyClassName ?? "—"}</div>
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

function PayloadPanel({ data }: { data: MessagePayloadMetadataResponse }) {
  const meta = data.metadata;
  const fields = meta?.fields ?? [];
  const restricted = data.restricted || meta?.restricted;
  const supported = data.payloadInspectionSupported ?? meta?.payloadInspectionSupported;
  const enabled = data.payloadInspectionEnabled ?? meta?.payloadInspectionEnabled;

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
          <span className="text-[10px] font-mono uppercase text-muted-foreground">
            {supported ? (enabled ? "enabled" : "disabled") : "unsupported"}
          </span>
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
