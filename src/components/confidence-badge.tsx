import type { Confidence } from "@/lib/api-types";

const styles: Record<Confidence, string> = {
  confirmed:
    "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
  observed:
    "bg-status-observed/10 text-status-observed border-status-observed/20",
  inferred:
    "bg-status-inferred/10 text-status-inferred border-status-inferred/20",
  unknown:
    "bg-status-unknown/10 text-status-unknown border-status-unknown/20",
};

export function ConfidenceBadge({
  confidence,
}: {
  confidence?: Confidence | string;
}) {
  const key = ((confidence as Confidence) || "unknown") in styles
    ? (confidence as Confidence)
    : "unknown";
  return (
    <span
      className={`text-[10px] font-mono px-1.5 py-0.5 border rounded uppercase shrink-0 ${styles[key]}`}
    >
      {key}
    </span>
  );
}

export function ConfidenceDot({
  confidence,
  title,
}: {
  confidence: Confidence;
  title?: string;
}) {
  const bg = {
    confirmed: "bg-status-confirmed",
    observed: "bg-status-observed",
    inferred: "bg-status-inferred",
    unknown: "bg-status-unknown",
  }[confidence];
  return (
    <div
      className={`size-2 rounded-full ${bg}`}
      title={title ?? confidence}
    />
  );
}
