import type { ReactNode } from "react";

export function SummaryBullets({ bullets }: { bullets?: string[] }) {
  if (!bullets || bullets.length === 0) return null;
  return (
    <section className="bg-card ring-1 ring-black/5 rounded-lg p-5 max-w-4xl">
      <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        Key points
      </h2>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-sm text-foreground/90 pl-4 relative">
            <span className="absolute left-0 top-2 size-1.5 rounded-full bg-iris-brand" />
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MetricChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: ReactNode;
  tone?: "neutral" | "brand" | "error" | "confirmed" | "observed" | "inferred";
}) {
  const toneClass =
    tone === "error"
      ? "text-destructive ring-destructive/30 bg-destructive/10"
      : tone === "brand"
        ? "text-iris-brand ring-iris-brand/30 bg-iris-brand/10"
        : tone === "confirmed"
          ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
          : tone === "observed"
            ? "text-status-observed ring-status-observed/30 bg-status-observed/10"
            : tone === "inferred"
              ? "text-status-inferred ring-status-inferred/30 bg-status-inferred/10"
              : "ring-black/10 bg-muted text-foreground/80";
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md ring-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${toneClass}`}
    >
      <span className="opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function MetricChips({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

export function EvidenceChips({
  m,
}: {
  m?: {
    confirmedEvidenceCount?: number;
    observedEvidenceCount?: number;
    inferredEvidenceCount?: number;
    unknownEvidenceCount?: number;
  };
}) {
  if (!m) return null;
  const parts: [string, number | undefined, "confirmed" | "observed" | "inferred" | "neutral"][] = [
    ["Confirmed", m.confirmedEvidenceCount, "confirmed"],
    ["Observed", m.observedEvidenceCount, "observed"],
    ["Inferred", m.inferredEvidenceCount, "inferred"],
    ["Unknown", m.unknownEvidenceCount, "neutral"],
  ];
  const has = parts.some(([, v]) => (v ?? 0) > 0);
  if (!has) return null;
  return (
    <MetricChips>
      {parts.map(([label, v, tone]) =>
        (v ?? 0) > 0 ? <MetricChip key={label} label={label} value={v!} tone={tone} /> : null,
      )}
    </MetricChips>
  );
}
