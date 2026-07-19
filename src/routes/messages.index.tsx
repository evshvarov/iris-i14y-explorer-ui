import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, AlertCircle, ArrowRight, ArrowLeft, X } from "lucide-react";
import { z } from "zod";

import { apiFetch } from "@/lib/api-config";
import type {
  MessageHeaderListResponse,
  MessageFacetResponse,
} from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ConfidenceBadge } from "@/components/confidence-badge";

const toStr = z.union([z.string(), z.number()]).transform((v) => String(v)).optional();
const searchSchema = z.object({
  productionName: toStr,
  sourceConfigName: toStr,
  targetConfigName: toStr,
  messageBodyClassName: toStr,
  sessionId: toStr,
  status: toStr,
  errorsOnly: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === "true").optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
  dateFrom: toStr,
  dateTo: toStr,
  datePreset: toStr,
});

function statusTone(label?: unknown): "ok" | "warn" | "error" | "muted" {
  if (label === null || label === undefined || label === "") return "muted";
  const s = String(label).toLowerCase();
  if (/(error|abort|discard|fail|suspend)/.test(s)) return "error";
  if (/(complete|delivered|ok|processed|done)/.test(s)) return "ok";
  if (/(queued|pending|deferred|created|waiting|inprogress|in progress|running)/.test(s)) return "warn";
  return "muted";
}

function statusPillClass(tone: ReturnType<typeof statusTone>) {
  switch (tone) {
    case "error":
      return "text-destructive bg-destructive/10 ring-1 ring-destructive/30";
    case "ok":
      return "text-status-confirmed bg-status-confirmed/10 ring-1 ring-status-confirmed/30";
    case "warn":
      return "text-status-inferred bg-status-inferred/10 ring-1 ring-status-inferred/30";
    default:
      return "text-muted-foreground bg-muted ring-1 ring-black/5";
  }
}

type DatePreset = "today" | "week" | "month" | "lastMonth" | "custom";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function rangeForPreset(preset: DatePreset): { dateFrom?: string; dateTo?: string } {
  const now = new Date();
  if (preset === "today") {
    const s = ymd(now);
    return { dateFrom: s, dateTo: s };
  }
  if (preset === "week") {
    const d = new Date(now);
    const dow = (d.getDay() + 6) % 7; // Monday-based
    d.setDate(d.getDate() - dow);
    return { dateFrom: ymd(d), dateTo: ymd(now) };
  }
  if (preset === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return { dateFrom: ymd(first), dateTo: ymd(now) };
  }
  if (preset === "lastMonth") {
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0);
    return { dateFrom: ymd(first), dateTo: ymd(last) };
  }
  return {};
}

export const Route = createFileRoute("/messages/")({
  head: () => ({ meta: [{ title: "Message Explainer — IRIS Explainer" }] }),
  validateSearch: searchSchema,
  component: MessagesPage,
});

function toQuery(params: Record<string, string | boolean | number | undefined>) {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "" || v === null) continue;
    s.set(k, String(v));
  }
  const q = s.toString();
  return q ? `?${q}` : "";
}

function MessagesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [text, setText] = useState("");
  const limit = search.limit ?? 50;
  const offset = search.offset ?? 0;

  const startDate = search.dateFrom ? `${search.dateFrom}T00:00:00` : undefined;
  const endDate = search.dateTo ? `${search.dateTo}T23:59:59` : undefined;

  const listQuery = useQuery<MessageHeaderListResponse>({
    queryKey: ["messages", search, limit, offset, startDate, endDate],
    queryFn: () =>
      apiFetch<MessageHeaderListResponse>(
        `/messages${toQuery({
          productionName: search.productionName,
          sourceConfigName: search.sourceConfigName,
          targetConfigName: search.targetConfigName,
          messageBodyClassName: search.messageBodyClassName,
          sessionId: search.sessionId,
          status: search.status,
          errorsOnly: search.errorsOnly,
          startDate,
          endDate,
          limit,
          offset,
        })}`,
      ),
    retry: 0,
  });

  const facetsQuery = useQuery<MessageFacetResponse>({
    queryKey: ["messages-facets", search.productionName, startDate, endDate],
    queryFn: () =>
      apiFetch<MessageFacetResponse>(
        `/messages/facets${toQuery({ productionName: search.productionName, startDate, endDate, limit: 500 })}`,
      ),
    retry: 0,
  });


  const items = listQuery.data?.items ?? [];

  const filtered = useMemo(() => {
    if (!text.trim()) return items;
    const t = text.toLowerCase();
    return items.filter(
      (m) =>
        String(m.messageId ?? "").includes(t) ||
        String(m.sessionId ?? "").includes(t) ||
        String(m.sourceConfigName ?? "").toLowerCase().includes(t) ||
        String(m.targetConfigName ?? "").toLowerCase().includes(t) ||
        String(m.messageBodyClassName ?? "").toLowerCase().includes(t),
    );
  }, [items, text]);


  // Build a map from numeric status code -> human status name (from facets / items)
  const statusNameByCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of facetsQuery.data?.statusFacets ?? []) {
      const name = String(f.statusName ?? f.name ?? "").trim();
      const code = String(f.status ?? "").trim();
      if (name && code) map.set(code, name);
    }
    for (const m of items) {
      const code = String(m.status ?? "").trim();
      const name = String(m.statusName ?? "").trim();
      if (name && code && !map.has(code)) map.set(code, name);
    }
    return map;
  }, [facetsQuery.data?.statusFacets, items]);

  const statusLabels = useMemo(() => {
    const counts = new Map<string, number>();
    // Prefer server statusFacets (name + count)
    for (const f of facetsQuery.data?.statusFacets ?? []) {
      const name = String(f.statusName ?? f.name ?? "").trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + Number(f.count ?? 0));
    }
    if (counts.size === 0) {
      // Fall back to items — use statusName, else lookup by numeric status, else the raw code
      for (const m of items) {
        const code = String(m.status ?? "").trim();
        const label =
          String(m.statusName ?? "").trim() ||
          statusNameByCode.get(code) ||
          code;
        if (!label) continue;
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
      for (const s of facetsQuery.data?.statusNames ?? []) {
        const key = String(s ?? "").trim();
        if (key && !counts.has(key)) counts.set(key, 0);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [items, facetsQuery.data?.statusFacets, facetsQuery.data?.statusNames, statusNameByCode]);

  // Server now filters by `status` when provided; keep list as-is.
  const filteredByStatus = filtered;

  const setSearchParam = (patch: Partial<typeof search>) =>
    navigate({ search: ((s: typeof search) => ({ ...s, ...patch, offset: 0 })) as never });

  const clearFilters = () =>
    navigate({
      search: () =>
        ({
          productionName: search.productionName, // keep production scope
        }) as never,
    });

  const activeFilters = [
    ["Source", search.sourceConfigName],
    ["Target", search.targetConfigName],
    ["Body", search.messageBodyClassName],
    ["Session", search.sessionId],
    search.status ? ["Status", search.status] : undefined,
    search.errorsOnly ? ["Errors", "only"] : undefined,
    search.dateFrom || search.dateTo
      ? ["Date", `${search.dateFrom ?? "…"} → ${search.dateTo ?? "…"}`]
      : undefined,
  ].filter(Boolean) as [string, string][];

  const applyPreset = (preset: DatePreset) => {
    if (preset === "custom") {
      setSearchParam({ datePreset: "custom" });
      return;
    }
    const r = rangeForPreset(preset);
    setSearchParam({ datePreset: preset, dateFrom: r.dateFrom, dateTo: r.dateTo });
  };

  const clearDates = () =>
    setSearchParam({ datePreset: undefined, dateFrom: undefined, dateTo: undefined });

  const activePreset = (search.datePreset as DatePreset | undefined) ??
    (search.dateFrom || search.dateTo ? "custom" : undefined);

  return (
    <>
      <PageHeader
        crumbs={[{ label: search.productionName ? "Production" : "Namespace" }]}
        title={search.productionName ? `Messages · ${search.productionName}` : "Message Explainer"}
        status={
          listQuery.data
            ? {
                label: `${listQuery.data.count ?? items.length} shown`,
                tone: listQuery.data.errorsOnly ? "inferred" : "observed",
              }
            : undefined
        }
        actions={
          search.productionName ? (
            <Link
              to="/productions/$name"
              params={{ name: search.productionName }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted"
            >
              <ArrowLeft className="size-3.5" /> Back to production
            </Link>
          ) : undefined
        }
      />

      <div className="p-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Facet sidebar */}
        <aside className="space-y-6">
          <FacetGroup
            label="Errors"
            items={[
              { key: "all messages", value: undefined, count: facetsQuery.data?.totalCount },
              { key: "errors only", value: true, count: facetsQuery.data?.errorCount },
            ]}
            selected={search.errorsOnly}
            onSelect={(v) => setSearchParam({ errorsOnly: v as boolean | undefined })}
          />
          {statusLabels.length > 0 ? (
            <div>
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Status
              </h4>
              <ul className="space-y-0.5 max-h-56 overflow-auto pr-1">
                {search.status ? (
                  <li>
                    <button
                      onClick={() => setSearchParam({ status: undefined })}
                      className="w-full text-left text-[10px] font-mono uppercase text-muted-foreground px-2 py-1 hover:text-foreground"
                    >
                      × clear
                    </button>
                  </li>
                ) : null}
                {statusLabels.map(([label, count]) => {
                  const active = search.status === label;
                  const tone = statusTone(label);
                  const dot =
                    tone === "error"
                      ? "bg-destructive"
                      : tone === "ok"
                        ? "bg-status-confirmed"
                        : tone === "warn"
                          ? "bg-status-inferred"
                          : "bg-muted-foreground/60";
                  return (
                    <li key={label}>
                      <button
                        onClick={() => setSearchParam({ status: active ? undefined : label })}
                        className={`w-full flex items-center justify-between gap-2 text-left text-[11px] font-mono px-2 py-1 rounded ${
                          active ? "bg-iris-brand/10 text-iris-brand" : "hover:bg-muted"
                        }`}
                        title={label}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span className={`inline-block size-1.5 rounded-full ${dot}`} />
                          <span className="truncate">{label}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="text-[10px] font-mono text-muted-foreground/70 mt-1">
                From loaded page
              </p>
            </div>
          ) : null}
          <FacetList
            label="Source component"
            values={facetsQuery.data?.sourceConfigNames}
            selected={search.sourceConfigName}
            onSelect={(v) => setSearchParam({ sourceConfigName: v })}
          />
          <FacetList
            label="Target component"
            values={facetsQuery.data?.targetConfigNames}
            selected={search.targetConfigName}
            onSelect={(v) => setSearchParam({ targetConfigName: v })}
          />
          <FacetList
            label="Message body class"
            values={facetsQuery.data?.messageBodyClassNames}
            selected={search.messageBodyClassName}
            onSelect={(v) => setSearchParam({ messageBodyClassName: v })}
          />
          <FacetList
            label="Sessions"
            values={facetsQuery.data?.sessionIds}
            selected={search.sessionId}
            onSelect={(v) => setSearchParam({ sessionId: v })}
          />
          {facetsQuery.data?.runtimeMessageAnalysisEnabled === false ? (
            <div className="text-[10px] font-mono text-status-inferred border border-status-inferred/30 bg-status-inferred/5 rounded p-2">
              Runtime message analysis disabled in module settings.
            </div>
          ) : null}
        </aside>

        {/* List */}
        <div className="space-y-4 min-w-0">
          <DateFilterBar
            preset={activePreset}
            dateFrom={search.dateFrom}
            dateTo={search.dateTo}
            onPreset={applyPreset}
            onFrom={(v) => setSearchParam({ datePreset: "custom", dateFrom: v || undefined })}
            onTo={(v) => setSearchParam({ datePreset: "custom", dateTo: v || undefined })}
            onClear={clearDates}
          />

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Filter loaded results…"
                className="pl-9 h-9 font-mono text-sm bg-card"
              />
            </div>
            {activeFilters.length > 0 ? (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" /> Clear filters
              </button>
            ) : null}
          </div>

          {activeFilters.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {activeFilters.map(([k, v]) => (
                <span
                  key={k}
                  className="text-[10px] font-mono uppercase bg-iris-brand/10 text-iris-brand border border-iris-brand/20 rounded px-1.5 py-0.5"
                >
                  {k}: {v}
                </span>
              ))}
            </div>
          ) : null}

          {listQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : listQuery.error ? (
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <div className="text-sm font-semibold text-destructive mb-1">
                Failed to list messages
              </div>
              <p className="text-xs font-mono text-destructive/80 break-all">
                {(listQuery.error as Error).message}
              </p>
            </div>
          ) : filteredByStatus.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground bg-card ring-1 ring-black/5 rounded-lg">
              No messages match these filters.
            </div>
          ) : (
            <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_auto_1fr_auto_auto] items-center gap-3 px-4 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                <span>ID</span>
                <span>Source</span>
                <span></span>
                <span>Target</span>
                <span>Status</span>
                <span></span>
              </div>
              <ul className="divide-y">
                {filteredByStatus.map((m) => {
                  const tone = m.isError ? "error" : statusTone(m.status);
                  return (
                    <li key={m.messageId}>
                      <Link
                        to="/messages/$id"
                        params={{ id: String(m.messageId) }}
                        className="grid grid-cols-[80px_1fr_auto_1fr_auto_auto] items-center gap-3 px-4 py-2.5 hover:bg-muted/50 group"
                      >
                        <span className="text-[11px] font-mono text-foreground/80">#{m.messageId}</span>
                        <span className="text-xs font-mono truncate">{m.sourceConfigName || "—"}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-xs font-mono truncate">{m.targetConfigName || "—"}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded flex items-center gap-1 ${statusPillClass(tone)}`}
                        >
                          {m.isError ? <AlertCircle className="size-3" /> : null}
                          {m.statusName || m.status || "?"}
                        </span>
                        <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {items.length > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                <span>offset {offset} · showing {items.length}</span>
                <label className="flex items-center gap-1.5">
                  <span className="uppercase tracking-wider">page size</span>
                  <select
                    value={limit}
                    onChange={(e) =>
                      navigate({
                        search: ((s: typeof search) => ({
                          ...s,
                          limit: Number(e.target.value),
                          offset: 0,
                        })) as never,
                      })
                    }
                    className="bg-card ring-1 ring-black/5 rounded px-1.5 py-0.5 font-mono"
                  >
                    {[25, 50, 100, 200, 500].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={offset === 0}
                  onClick={() => navigate({ search: ((s: typeof search) => ({ ...s, offset: Math.max(0, offset - limit) })) as never })}
                  className="text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={!listQuery.data?.hasMore}
                  onClick={() => navigate({ search: ((s: typeof search) => ({ ...s, offset: offset + limit })) as never })}
                  className="text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}


          {items.length > 0 && items[0]?.confidence ? (
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
              First row provenance: <ConfidenceBadge confidence={items[0].confidence} />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function FacetGroup({
  label, items, selected, onSelect,
}: {
  label: string;
  items: { key: string; value: unknown; count?: number }[];
  selected: unknown;
  onSelect: (v: unknown) => void;
}) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        {label}
      </h4>
      <ul className="space-y-1">
        {items.map((it) => {
          const active = selected === it.value || (!selected && it.value === undefined);
          return (
            <li key={it.key}>
              <button
                onClick={() => onSelect(it.value)}
                className={`w-full flex items-center justify-between text-left text-xs font-mono px-2 py-1 rounded ${
                  active ? "bg-iris-brand/10 text-iris-brand" : "hover:bg-muted"
                }`}
              >
                <span>{it.key}</span>
                {it.count !== undefined ? (
                  <span className="text-[10px] text-muted-foreground">{it.count}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FacetList({
  label, values, selected, onSelect,
}: {
  label: string; values?: string[]; selected?: string; onSelect: (v: string | undefined) => void;
}) {
  if (!values || values.length === 0) return null;
  return (
    <div>
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        {label}
      </h4>
      <ul className="space-y-0.5 max-h-56 overflow-auto pr-1">
        {selected ? (
          <li>
            <button
              onClick={() => onSelect(undefined)}
              className="w-full text-left text-[10px] font-mono uppercase text-muted-foreground px-2 py-1 hover:text-foreground"
            >
              × clear
            </button>
          </li>
        ) : null}
        {values.map((v) => (
          <li key={v}>
            <button
              onClick={() => onSelect(v)}
              className={`w-full text-left text-[11px] font-mono px-2 py-1 rounded truncate ${
                selected === v ? "bg-iris-brand/10 text-iris-brand" : "hover:bg-muted"
              }`}
              title={v}
            >
              {v}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DateFilterBar({
  preset,
  dateFrom,
  dateTo,
  onPreset,
  onFrom,
  onTo,
  onClear,
}: {
  preset?: DatePreset;
  dateFrom?: string;
  dateTo?: string;
  onPreset: (p: DatePreset) => void;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  onClear: () => void;
}) {
  const presets: { key: DatePreset; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This week" },
    { key: "month", label: "This month" },
    { key: "lastMonth", label: "Last month" },
    { key: "custom", label: "Custom" },
  ];
  return (
    <div className="bg-card ring-1 ring-black/5 rounded-lg p-3 flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mr-1">
        Date
      </span>
      {presets.map((p) => {
        const active = preset === p.key;
        return (
          <button
            key={p.key}
            onClick={() => onPreset(p.key)}
            className={`text-[11px] font-mono uppercase px-2 py-1 rounded ring-1 transition ${
              active
                ? "bg-iris-brand/10 text-iris-brand ring-iris-brand/30"
                : "bg-muted/40 text-foreground/80 ring-black/5 hover:bg-muted"
            }`}
          >
            {p.label}
          </button>
        );
      })}
      <div className="flex items-center gap-1.5 ml-auto">
        <label className="text-[10px] font-mono uppercase text-muted-foreground">From</label>
        <input
          type="date"
          value={dateFrom ?? ""}
          onChange={(e) => onFrom(e.target.value)}
          className="h-8 px-2 rounded ring-1 ring-black/5 bg-background text-xs font-mono"
        />
        <label className="text-[10px] font-mono uppercase text-muted-foreground">To</label>
        <input
          type="date"
          value={dateTo ?? ""}
          onChange={(e) => onTo(e.target.value)}
          className="h-8 px-2 rounded ring-1 ring-black/5 bg-background text-xs font-mono"
        />
        {(dateFrom || dateTo || preset) ? (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground hover:text-foreground px-1.5 py-1"
          >
            <X className="size-3" /> Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
