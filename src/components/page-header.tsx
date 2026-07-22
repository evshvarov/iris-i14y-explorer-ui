import { ReactNode } from "react";

type Tone = "confirmed" | "observed" | "inferred" | "unknown" | "error";

export function PageHeader({
  crumbs,
  title,
  subtitle,
  status,
  actions,
}: {
  crumbs?: { label: string; to?: string }[];
  title: string;
  subtitle?: string;
  status?: { label: string; tone?: Tone };
  actions?: ReactNode;
}) {
  const toneStyle: Record<Tone, { bg: string; fg: string }> = {
    confirmed: { bg: "#e5f4ec", fg: "#1a7f52" },
    observed: { bg: "#e8eefb", fg: "#2b5cd6" },
    inferred: { bg: "#fdf3e2", fg: "#b7791f" },
    unknown: { bg: "#eef1f5", fg: "#6b7686" },
    error: { bg: "#fbeae7", fg: "#c0392b" },
  };
  const t = toneStyle[status?.tone ?? "unknown"];

  return (
    <header className="border-b bg-white/70 backdrop-blur-md px-6 md:px-8 py-4 sticky top-0 z-10">
      {crumbs && crumbs.length > 0 ? (
        <div className="flex items-center gap-2 mb-1.5">
          {crumbs.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {c.label}
              </span>
              <span className="text-border text-xs">/</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold tracking-[-0.3px] truncate">{title}</h1>
            {status ? (
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wide"
                style={{ backgroundColor: t.bg, color: t.fg }}
              >
                <span className="size-1.5 rounded-full" style={{ backgroundColor: t.fg }} />
                {status.label}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <div className="text-[12px] font-mono text-[#8792a3] mt-1 truncate">{subtitle}</div>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
