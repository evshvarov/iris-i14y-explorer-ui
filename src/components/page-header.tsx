import { ReactNode } from "react";

export function PageHeader({
  crumbs,
  title,
  status,
  actions,
}: {
  crumbs?: { label: string; to?: string }[];
  title: string;
  status?: { label: string; tone?: "confirmed" | "observed" | "inferred" | "unknown" };
  actions?: ReactNode;
}) {
  const toneColor = {
    confirmed: "bg-status-confirmed",
    observed: "bg-status-observed",
    inferred: "bg-status-inferred",
    unknown: "bg-status-unknown",
  }[status?.tone ?? "unknown"];

  return (
    <header className="h-14 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {crumbs?.map((c, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground truncate">
              {c.label}
            </span>
            <span className="text-border">/</span>
          </div>
        ))}
        <h1 className="text-sm font-semibold truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {status ? (
          <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded ring-1 ring-black/5">
            <div className={`size-2 rounded-full ${toneColor}`} />
            <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase">
              {status.label}
            </span>
          </div>
        ) : null}
        {actions}
      </div>
    </header>
  );
}
