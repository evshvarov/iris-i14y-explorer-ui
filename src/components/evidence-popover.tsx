import type { ReactNode } from "react";
import { Info } from "lucide-react";

import type { Confidence, Evidence } from "@/lib/api-types";
import { ConfidenceBadge, ConfidenceDot } from "@/components/confidence-badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const toneClass: Record<Confidence, string> = {
  confirmed: "text-status-confirmed",
  observed: "text-status-observed",
  inferred: "text-status-inferred",
  unknown: "text-status-unknown",
};

function toConfidence(v?: string): Confidence {
  return (v as Confidence) in toneClass ? (v as Confidence) : "unknown";
}

export function EvidencePopover({
  confidence,
  evidence,
  variant = "badge",
  label,
  align = "end",
}: {
  confidence?: Confidence | string;
  evidence?: Evidence[];
  variant?: "badge" | "dot" | "custom";
  label?: string;
  align?: "start" | "center" | "end";
  children?: ReactNode;
}) {
  const rows = evidence ?? [];
  const has = rows.length > 0;

  const trigger =
    variant === "dot" ? (
      <button
        type="button"
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-iris-brand/40 rounded-full"
        aria-label={`Evidence: ${confidence ?? "unknown"}`}
      >
        <ConfidenceDot confidence={toConfidence(confidence as string)} />
      </button>
    ) : (
      <button
        type="button"
        className="inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-iris-brand/40 rounded"
        aria-label={`Evidence: ${confidence ?? "unknown"}`}
      >
        <ConfidenceBadge confidence={confidence} />
        {has ? <Info className="size-3 text-muted-foreground" /> : null}
      </button>
    );

  if (!has) return trigger;

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-[min(28rem,95vw)] p-0 bg-card ring-1 ring-black/10 shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Evidence {label ? `· ${label}` : ""}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">
              {rows.length}
            </span>
            <ConfidenceBadge confidence={confidence} />
          </div>
        </div>
        <ul className="divide-y max-h-80 overflow-auto">
          {rows.map((e, i) => (
            <li key={i} className="px-4 py-2.5 text-[11px] font-mono space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground font-semibold truncate">
                  {e.type ?? "—"}
                </span>
                <span
                  className={`uppercase text-[9px] ${
                    toneClass[toConfidence(e.confidence)]
                  }`}
                >
                  {e.confidence ?? "unknown"}
                </span>
              </div>
              <div className="grid grid-cols-[64px_1fr] gap-x-2 gap-y-0.5 text-muted-foreground">
                {e.source ? (
                  <>
                    <span className="text-[9px] uppercase tracking-widest">source</span>
                    <span className="truncate text-foreground/80" title={e.source}>
                      {e.source}
                    </span>
                  </>
                ) : null}
                {e.component ? (
                  <>
                    <span className="text-[9px] uppercase tracking-widest">component</span>
                    <span className="truncate text-foreground/80" title={e.component}>
                      {e.component}
                    </span>
                  </>
                ) : null}
                {e.field ? (
                  <>
                    <span className="text-[9px] uppercase tracking-widest">field</span>
                    <span className="truncate text-foreground/80" title={e.field}>
                      {e.field}
                    </span>
                  </>
                ) : null}
                {e.value ? (
                  <>
                    <span className="text-[9px] uppercase tracking-widest">value</span>
                    <span
                      className="truncate text-foreground/80 whitespace-pre-wrap break-all"
                      title={e.value}
                    >
                      {e.value}
                    </span>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
