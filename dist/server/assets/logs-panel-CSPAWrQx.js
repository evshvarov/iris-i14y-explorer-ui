import { a as Skeleton, n as apiFetch } from "./api-config-BqoIDxBb.js";
import { t as Input } from "./input-DI6UcbvY.js";
import { t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw, Search, X } from "lucide-react";
//#region src/components/logs-panel.tsx
function toQuery(params) {
	const s = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v === void 0 || v === "" || v === null) continue;
		s.set(k, String(v));
	}
	const q = s.toString();
	return q ? `?${q}` : "";
}
function typeTone(type) {
	const t = String(type ?? "").toLowerCase();
	if (t.includes("error") || t.includes("fatal") || t.includes("alert")) return "text-destructive ring-destructive/30 bg-destructive/10";
	if (t.includes("warn")) return "text-status-inferred ring-status-inferred/30 bg-status-inferred/10";
	if (t.includes("info")) return "text-status-observed ring-status-observed/30 bg-status-observed/10";
	return "text-muted-foreground ring-border bg-muted/40";
}
function LogsPanel({ productionName, title }) {
	const [type, setType] = useState("");
	const [source, setSource] = useState("");
	const [contains, setContains] = useState("");
	const [limit, setLimit] = useState(100);
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const startDate = dateFrom ? `${dateFrom}T00:00:00` : void 0;
	const endDate = dateTo ? `${dateTo}T23:59:59` : void 0;
	const path = productionName ? `/productions/${encodeURIComponent(productionName)}/logs` : `/logs`;
	const query = useQuery({
		queryKey: [
			"logs",
			productionName ?? "*",
			type,
			source,
			contains,
			limit,
			startDate,
			endDate
		],
		queryFn: () => apiFetch(`${path}${toQuery({
			type: type || void 0,
			source: source || void 0,
			contains: contains || void 0,
			startDate,
			endDate,
			limit
		})}`),
		retry: 0
	});
	const items = query.data?.items ?? [];
	const sourceOptions = query.data?.sourceNames ?? [];
	const typeFacets = query.data?.typeFacets ?? [];
	const typeOptions = typeFacets.length > 0 ? typeFacets.map((f) => {
		const label = String(f.typeLabel ?? f.typeName ?? f.label ?? f.name ?? f.type ?? "").trim();
		return {
			value: label,
			label,
			count: f.count
		};
	}) : (query.data?.typeLabels ?? query.data?.typeNames ?? []).map((t) => ({
		value: t,
		label: t
	}));
	const typeNameByCode = /* @__PURE__ */ new Map();
	for (const f of typeFacets) {
		const code = String(f.type ?? "").trim();
		const name = String(f.typeLabel ?? f.typeName ?? f.label ?? f.name ?? "").trim();
		if (code && name) typeNameByCode.set(code, name);
	}
	const metrics = query.data?.metrics;
	const filters = useMemo(() => [
		type,
		source,
		contains
	].filter((v) => v && v.length > 0), [
		type,
		source,
		contains
	]);
	return /* @__PURE__ */ jsxs("section", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-end justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: title ?? (productionName ? "Production logs" : "Namespace logs")
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground mt-1 font-mono",
					children: [query.data?.logClassName ?? "Ens.Util.Log", typeof metrics?.totalCount === "number" ? ` · ${metrics.totalCount} total${query.data?.hasMore ? " (more available)" : ""}` : ""]
				})] }), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => query.refetch(),
					className: "inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded ring-1 ring-border hover:bg-muted transition-colors",
					disabled: query.isFetching,
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: `size-3 ${query.isFetching ? "animate-spin" : ""}` }), "Refresh"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ jsx(Search, { className: "size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ jsx(Input, {
								value: contains,
								onChange: (e) => setContains(e.target.value),
								placeholder: "Search text...",
								className: "h-9 pl-8 text-xs font-mono"
							}),
							contains ? /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setContains(""),
								className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
							}) : null
						]
					}),
					/* @__PURE__ */ jsxs("select", {
						value: type,
						onChange: (e) => setType(e.target.value),
						className: "h-9 rounded-md border bg-background px-2 text-xs font-mono",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "All types"
						}), typeOptions.map((t) => /* @__PURE__ */ jsxs("option", {
							value: t.value,
							children: [t.label, typeof t.count === "number" ? ` (${t.count})` : ""]
						}, t.value))]
					}),
					/* @__PURE__ */ jsxs("select", {
						value: source,
						onChange: (e) => setSource(e.target.value),
						className: "h-9 rounded-md border bg-background px-2 text-xs font-mono",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "All sources"
						}), sourceOptions.map((s) => /* @__PURE__ */ jsx("option", {
							value: s,
							children: s
						}, s))]
					}),
					/* @__PURE__ */ jsx("select", {
						value: limit,
						onChange: (e) => setLimit(Number(e.target.value)),
						className: "h-9 rounded-md border bg-background px-2 text-xs font-mono",
						children: [
							50,
							100,
							200,
							500
						].map((n) => /* @__PURE__ */ jsxs("option", {
							value: n,
							children: ["Limit ", n]
						}, n))
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
						children: "Date"
					}),
					[
						["today", "Today"],
						["week", "This week"],
						["month", "This month"],
						["lastMonth", "Last month"]
					].map(([key, label]) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							const now = /* @__PURE__ */ new Date();
							const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
							if (key === "today") {
								const s = ymd(now);
								setDateFrom(s);
								setDateTo(s);
							} else if (key === "week") {
								const d = new Date(now);
								d.setDate(d.getDate() - (d.getDay() + 6) % 7);
								setDateFrom(ymd(d));
								setDateTo(ymd(now));
							} else if (key === "month") {
								setDateFrom(ymd(new Date(now.getFullYear(), now.getMonth(), 1)));
								setDateTo(ymd(now));
							} else {
								setDateFrom(ymd(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
								setDateTo(ymd(new Date(now.getFullYear(), now.getMonth(), 0)));
							}
						},
						className: "text-[11px] font-mono uppercase px-2 py-1 rounded ring-1 ring-black/5 bg-muted/40 hover:bg-muted",
						children: label
					}, key)),
					/* @__PURE__ */ jsx("input", {
						type: "date",
						value: dateFrom,
						onChange: (e) => setDateFrom(e.target.value),
						className: "h-8 px-2 rounded ring-1 ring-black/5 bg-background text-xs font-mono"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-muted-foreground",
						children: "→"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "date",
						value: dateTo,
						onChange: (e) => setDateTo(e.target.value),
						className: "h-8 px-2 rounded ring-1 ring-black/5 bg-background text-xs font-mono"
					}),
					dateFrom || dateTo ? /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							setDateFrom("");
							setDateTo("");
						},
						className: "flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ jsx(X, { className: "size-3" }), " Clear"]
					}) : null
				]
			}),
			filters.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "text-[11px] text-muted-foreground",
				children: [
					filters.length,
					" filter",
					filters.length === 1 ? "" : "s",
					" active"
				]
			}) : null,
			query.error ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg ring-1 ring-destructive/30 bg-destructive/5 p-4 text-xs text-destructive flex items-start gap-2",
				children: [/* @__PURE__ */ jsx(AlertCircle, { className: "size-4 shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("div", {
					className: "font-mono break-all",
					children: query.error.message
				})]
			}) : query.isLoading ? /* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14 rounded-md" }, i))
			}) : items.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "rounded-lg ring-1 ring-black/5 bg-muted/30 p-8 text-center text-xs text-muted-foreground",
				children: "No log entries."
			}) : /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg ring-1 ring-black/5 bg-card overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-[auto_1fr] gap-3 px-4 py-2 bg-muted/50 border-b border-border/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: [/* @__PURE__ */ jsx("span", {
						className: "w-14",
						children: "Type"
					}), /* @__PURE__ */ jsxs("span", { children: [
						"Time · Source · Session · Job",
						!productionName ? " · Production" : "",
						" — Message"
					] })]
				}), /* @__PURE__ */ jsx("ul", {
					className: "divide-y divide-border/60",
					children: items.map((e, i) => /* @__PURE__ */ jsx("li", {
						className: "px-4 py-3 hover:bg-muted/40 transition-colors",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: `text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ring-1 shrink-0 ${typeTone(e.typeLabel ?? e.typeName ?? typeNameByCode.get(String(e.type ?? "")) ?? e.type)}`,
								title: e.type != null ? `code ${e.type}` : void 0,
								children: e.typeLabel ?? e.typeName ?? typeNameByCode.get(String(e.type ?? "")) ?? e.type ?? "log"
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-[11px] font-mono text-muted-foreground",
									children: [
										/* @__PURE__ */ jsx("span", { children: e.timeLogged ?? "—" }),
										e.source ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsx("span", {
											className: "text-foreground/80",
											children: e.source
										})] }) : null,
										e.sessionId ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsxs("span", { children: ["session ", e.sessionId] })] }) : null,
										e.job ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsxs("span", { children: ["job ", e.job] })] }) : null,
										!productionName && e.productionName ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsx("span", {
											className: "text-foreground/80",
											children: e.productionName
										})] }) : null,
										e.confidence ? /* @__PURE__ */ jsx("span", {
											className: "ml-auto",
											children: /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: e.confidence })
										}) : null
									]
								}), e.text ? /* @__PURE__ */ jsx("pre", {
									className: "mt-1 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed text-foreground/90",
									children: e.text
								}) : null]
							})]
						})
					}, `${e.logId ?? i}-${e.timeLogged ?? i}`))
				})]
			}),
			query.data?.warnings && query.data.warnings.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "text-[11px] text-muted-foreground space-y-1",
				children: query.data.warnings.map((w, i) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(AlertCircle, { className: "size-3 text-status-inferred" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-mono",
							children: w.code
						}),
						w.message ? /* @__PURE__ */ jsxs("span", { children: ["· ", w.message] }) : null
					]
				}, i))
			}) : null
		]
	});
}
//#endregion
export { LogsPanel as t };
