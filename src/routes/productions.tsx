import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ArrowRight, Search } from "lucide-react";

import { apiFetch } from "@/lib/api-config";
import type { ProductionListResponse } from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/productions")({
  head: () => ({
    meta: [{ title: "Productions — IRIS Explainer" }],
  }),
  component: ProductionsPage,
});

function ProductionsPage() {
  const { data, error, isLoading } = useQuery<ProductionListResponse>({
    queryKey: ["productions"],
    queryFn: () => apiFetch<ProductionListResponse>("/productions"),
    retry: 0,
  });

  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const list = data?.items ?? [];
    if (!q.trim()) return list;
    const term = q.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term),
    );
  }, [data, q]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Namespace" }]}
        title="Productions"
        status={
          data?.namespace
            ? { label: data.namespace, tone: "observed" }
            : undefined
        }
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter productions…"
              className="pl-9 h-9 font-mono text-sm bg-card"
            />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            {isLoading ? "Loading…" : `${rows.length} shown`}
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="text-sm font-semibold text-destructive mb-1">
              Failed to list productions
            </div>
            <p className="text-xs font-mono text-destructive/80 break-all">
              {(error as Error).message}
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground bg-card ring-1 ring-black/5 rounded-lg">
            No productions found in this namespace.
          </div>
        ) : (
          <div className="bg-card ring-1 ring-black/5 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              <span>Production</span>
              <span>Open</span>
            </div>
            <ul className="divide-y">
              {rows.map((p) => (
                <li key={p.name}>
                  <Link
                    to="/productions/$name"
                    params={{ name: p.name }}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {p.name}
                      </div>
                      {p.description ? (
                        <div className="text-[11px] text-muted-foreground truncate">
                          {p.description}
                        </div>
                      ) : p.className ? (
                        <div className="text-[11px] font-mono text-muted-foreground truncate">
                          {p.className}
                        </div>
                      ) : null}
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
