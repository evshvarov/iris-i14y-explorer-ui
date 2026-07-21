import { t as Skeleton } from "./skeleton-Ctfakequ.js";
import { t as Input } from "./input-fjTUr8nI.js";
import { r as apiFetch, t as PageHeader } from "./page-header-DYAysbwo.js";
import { n as MetricChip, r as MetricChips } from "./summary-bits-umgxy3aN.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Search, ShieldAlert } from "lucide-react";
//#region src/routes/productions.index.tsx?tsr-split=component
function ProductionsPage() {
	const { data, error, isLoading } = useQuery({
		queryKey: ["productions"],
		queryFn: () => apiFetch("/productions"),
		retry: 0
	});
	const [q, setQ] = useState("");
	const rows = useMemo(() => {
		const list = data?.items ?? [];
		if (!q.trim()) return list;
		const term = q.toLowerCase();
		return list.filter((p) => p.name.toLowerCase().includes(term) || (p.description ?? "").toLowerCase().includes(term));
	}, [data, q]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: "Namespace" }],
		title: "Productions",
		status: data?.namespace ? {
			label: data.namespace,
			tone: "observed"
		} : void 0
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 space-y-6",
		children: [
			data?.metrics ? /* @__PURE__ */ jsxs(MetricChips, { children: [
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Productions",
					value: data.metrics.productionCount ?? data.items?.length ?? 0,
					tone: "brand"
				}),
				(data.metrics.runningProductionCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
					label: "Running",
					value: data.metrics.runningProductionCount,
					tone: "confirmed"
				}) : null,
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Components",
					value: data.metrics.componentCount ?? 0
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Services",
					value: data.metrics.serviceCount ?? 0,
					tone: "observed"
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Processes",
					value: data.metrics.processCount ?? 0,
					tone: "brand"
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Operations",
					value: data.metrics.operationCount ?? 0,
					tone: "inferred"
				}),
				(data.metrics.disabledComponentCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
					label: "Disabled",
					value: data.metrics.disabledComponentCount
				}) : null,
				(data.metrics.warningCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
					label: "Warnings",
					value: data.metrics.warningCount,
					tone: "error"
				}) : null
			] }) : null,
			data?.warnings && data.warnings.length > 0 ? /* @__PURE__ */ jsxs("section", {
				className: "rounded-lg border border-status-inferred/30 bg-status-inferred/5 p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "size-4 text-status-inferred" }), /* @__PURE__ */ jsxs("h3", {
						className: "text-[10px] font-semibold uppercase tracking-widest text-status-inferred",
						children: [
							data.warnings.length,
							" warning",
							data.warnings.length === 1 ? "" : "s"
						]
					})]
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-1",
					children: data.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", {
						className: "text-[11px] font-mono text-status-inferred/90",
						children: [
							"[",
							w.code,
							"] ",
							w.message
						]
					}, i))
				})]
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative w-full max-w-md",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Filter productions…",
						className: "pl-9 h-9 font-mono text-sm bg-card"
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[11px] font-mono text-muted-foreground uppercase",
					children: isLoading ? "Loading…" : `${rows.length} shown`
				})]
			}),
			isLoading ? /* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-16 rounded-lg" }, i))
			}) : error ? /* @__PURE__ */ jsxs("div", {
				className: "p-4 rounded-lg border border-destructive/30 bg-destructive/5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-sm font-semibold text-destructive mb-1",
					children: "Failed to list productions"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs font-mono text-destructive/80 break-all",
					children: error.message
				})]
			}) : rows.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "p-8 text-center text-sm text-muted-foreground bg-card ring-1 ring-black/5 rounded-lg",
				children: "No productions found in this namespace."
			}) : /* @__PURE__ */ jsxs("div", {
				className: "bg-card ring-1 ring-black/5 rounded-lg overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: [/* @__PURE__ */ jsx("span", { children: "Production" }), /* @__PURE__ */ jsx("span", { children: "Open" })]
				}), /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: rows.map((p) => /* @__PURE__ */ jsxs("li", {
						className: "grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors group",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								to: "/productions/$name",
								params: { name: p.name },
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold truncate",
									children: p.name
								}), p.description ? /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted-foreground truncate",
									children: p.description
								}) : null]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground",
								children: [/* @__PURE__ */ jsxs("span", { children: [p.componentCount ?? 0, " cmp"] }), /* @__PURE__ */ jsx("span", {
									className: `px-1.5 py-0.5 rounded ring-1 ${p.isRunning ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" : "ring-black/10 bg-muted"}`,
									children: p.runtimeState ?? "unknown"
								})]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/messages",
								search: {
									productionName: p.name,
									errorsOnly: true
								},
								className: "flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ring-1 ring-destructive/20 text-destructive/80 hover:bg-destructive/10 hover:text-destructive",
								title: `View errors for ${p.name}`,
								children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "size-3" }), "Errors"]
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/productions/$name",
								params: { name: p.name },
								className: "text-muted-foreground group-hover:text-foreground transition-colors",
								"aria-label": `Open ${p.name}`,
								children: /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
							})
						]
					}, p.name))
				})]
			})
		]
	})] });
}
//#endregion
export { ProductionsPage as component };
