import { t as Skeleton } from "./skeleton-Ctfakequ.js";
import { t as Input } from "./input-fjTUr8nI.js";
import { t as Route } from "./messages.index-DqzNRWgV.js";
import { r as apiFetch, t as PageHeader } from "./page-header-DYAysbwo.js";
import { t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Search, X } from "lucide-react";
//#region src/routes/messages.index.tsx?tsr-split=component
function toQuery(params) {
	const s = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v === void 0 || v === "" || v === null) continue;
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
	const listQuery = useQuery({
		queryKey: [
			"messages",
			search,
			limit,
			offset
		],
		queryFn: () => apiFetch(`/messages${toQuery({
			productionName: search.productionName,
			sourceConfigName: search.sourceConfigName,
			targetConfigName: search.targetConfigName,
			messageBodyClassName: search.messageBodyClassName,
			sessionId: search.sessionId,
			errorsOnly: search.errorsOnly,
			limit,
			offset
		})}`),
		retry: 0
	});
	const facetsQuery = useQuery({
		queryKey: ["messages-facets", search.productionName],
		queryFn: () => apiFetch(`/messages/facets${toQuery({
			productionName: search.productionName,
			limit: 500
		})}`),
		retry: 0
	});
	const items = listQuery.data?.items ?? [];
	const filtered = useMemo(() => {
		if (!text.trim()) return items;
		const t = text.toLowerCase();
		return items.filter((m) => String(m.messageId ?? "").includes(t) || String(m.sessionId ?? "").includes(t) || (m.sourceConfigName ?? "").toLowerCase().includes(t) || (m.targetConfigName ?? "").toLowerCase().includes(t) || (m.messageBodyClassName ?? "").toLowerCase().includes(t));
	}, [items, text]);
	const setSearchParam = (patch) => navigate({ search: ((s) => ({
		...s,
		...patch,
		offset: 0
	})) });
	const clearFilters = () => navigate({ search: () => ({ productionName: search.productionName }) });
	const activeFilters = [
		["Source", search.sourceConfigName],
		["Target", search.targetConfigName],
		["Body", search.messageBodyClassName],
		["Session", search.sessionId],
		search.errorsOnly ? ["Errors", "only"] : void 0
	].filter(Boolean);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: search.productionName ? "Production" : "Namespace" }],
		title: search.productionName ? `Messages · ${search.productionName}` : "Message Explainer",
		status: listQuery.data ? {
			label: `${listQuery.data.count ?? items.length} shown`,
			tone: listQuery.data.errorsOnly ? "inferred" : "observed"
		} : void 0
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(FacetGroup, {
					label: "Errors",
					items: [{
						key: "all",
						value: void 0,
						count: facetsQuery.data?.totalCount
					}, {
						key: "errors only",
						value: true,
						count: facetsQuery.data?.errorCount
					}],
					selected: search.errorsOnly,
					onSelect: (v) => setSearchParam({ errorsOnly: v })
				}),
				/* @__PURE__ */ jsx(FacetList, {
					label: "Source component",
					values: facetsQuery.data?.sourceConfigNames,
					selected: search.sourceConfigName,
					onSelect: (v) => setSearchParam({ sourceConfigName: v })
				}),
				/* @__PURE__ */ jsx(FacetList, {
					label: "Target component",
					values: facetsQuery.data?.targetConfigNames,
					selected: search.targetConfigName,
					onSelect: (v) => setSearchParam({ targetConfigName: v })
				}),
				/* @__PURE__ */ jsx(FacetList, {
					label: "Message body class",
					values: facetsQuery.data?.messageBodyClassNames,
					selected: search.messageBodyClassName,
					onSelect: (v) => setSearchParam({ messageBodyClassName: v })
				}),
				/* @__PURE__ */ jsx(FacetList, {
					label: "Sessions",
					values: facetsQuery.data?.sessionIds,
					selected: search.sessionId,
					onSelect: (v) => setSearchParam({ sessionId: v })
				}),
				facetsQuery.data?.runtimeMessageAnalysisEnabled === false ? /* @__PURE__ */ jsx("div", {
					className: "text-[10px] font-mono text-status-inferred border border-status-inferred/30 bg-status-inferred/5 rounded p-2",
					children: "Runtime message analysis disabled in module settings."
				}) : null
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4 min-w-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 flex-wrap",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative w-full max-w-sm",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							value: text,
							onChange: (e) => setText(e.target.value),
							placeholder: "Filter loaded results…",
							className: "pl-9 h-9 font-mono text-sm bg-card"
						})]
					}), activeFilters.length > 0 ? /* @__PURE__ */ jsxs("button", {
						onClick: clearFilters,
						className: "flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ jsx(X, { className: "size-3" }), " Clear filters"]
					}) : null]
				}),
				activeFilters.length > 0 ? /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-1.5",
					children: activeFilters.map(([k, v]) => /* @__PURE__ */ jsxs("span", {
						className: "text-[10px] font-mono uppercase bg-iris-brand/10 text-iris-brand border border-iris-brand/20 rounded px-1.5 py-0.5",
						children: [
							k,
							": ",
							v
						]
					}, k))
				}) : null,
				listQuery.isLoading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14 rounded-lg" }, i))
				}) : listQuery.error ? /* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-lg border border-destructive/30 bg-destructive/5",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-sm font-semibold text-destructive mb-1",
						children: "Failed to list messages"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs font-mono text-destructive/80 break-all",
						children: listQuery.error.message
					})]
				}) : filtered.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "p-8 text-center text-sm text-muted-foreground bg-card ring-1 ring-black/5 rounded-lg",
					children: "No messages match these filters."
				}) : /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-[80px_1fr_auto_1fr_auto_auto] items-center gap-3 px-4 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
						children: [
							/* @__PURE__ */ jsx("span", { children: "ID" }),
							/* @__PURE__ */ jsx("span", { children: "Source" }),
							/* @__PURE__ */ jsx("span", {}),
							/* @__PURE__ */ jsx("span", { children: "Target" }),
							/* @__PURE__ */ jsx("span", { children: "Status" }),
							/* @__PURE__ */ jsx("span", {})
						]
					}), /* @__PURE__ */ jsx("ul", {
						className: "divide-y",
						children: filtered.map((m) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
							to: "/messages/$id",
							params: { id: String(m.messageId) },
							className: "grid grid-cols-[80px_1fr_auto_1fr_auto_auto] items-center gap-3 px-4 py-2.5 hover:bg-muted/50 group",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "text-[11px] font-mono text-foreground/80",
									children: ["#", m.messageId]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono truncate",
									children: m.sourceConfigName || "—"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "→"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono truncate",
									children: m.targetConfigName || "—"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: `text-[10px] font-mono uppercase px-1.5 py-0.5 rounded flex items-center gap-1 ${m.isError ? "text-destructive bg-destructive/10 ring-1 ring-destructive/30" : "text-muted-foreground bg-muted"}`,
									children: [m.isError ? /* @__PURE__ */ jsx(AlertCircle, { className: "size-3" }) : null, m.status || "?"]
								}),
								/* @__PURE__ */ jsx(ArrowRight, { className: "size-4 text-muted-foreground group-hover:text-foreground" })
							]
						}) }, m.messageId))
					})]
				}),
				listQuery.data?.hasMore ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-[11px] font-mono text-muted-foreground",
						children: [
							"offset ",
							offset,
							" · limit ",
							limit
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							disabled: offset === 0,
							onClick: () => navigate({ search: ((s) => ({
								...s,
								offset: Math.max(0, offset - limit)
							})) }),
							className: "text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted disabled:opacity-40",
							children: "Previous"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => navigate({ search: ((s) => ({
								...s,
								offset: offset + limit
							})) }),
							className: "text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted",
							children: "Next"
						})]
					})]
				}) : null,
				items.length > 0 && items[0]?.confidence ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase",
					children: ["First row provenance: ", /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: items[0].confidence })]
				}) : null
			]
		})]
	})] });
}
function FacetGroup({ label, items, selected, onSelect }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
		className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2",
		children: label
	}), /* @__PURE__ */ jsx("ul", {
		className: "space-y-1",
		children: items.map((it) => {
			return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
				onClick: () => onSelect(it.value),
				className: `w-full flex items-center justify-between text-left text-xs font-mono px-2 py-1 rounded ${selected === it.value || !selected && it.value === void 0 ? "bg-iris-brand/10 text-iris-brand" : "hover:bg-muted"}`,
				children: [/* @__PURE__ */ jsx("span", { children: it.key }), it.count !== void 0 ? /* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-muted-foreground",
					children: it.count
				}) : null]
			}) }, it.key);
		})
	})] });
}
function FacetList({ label, values, selected, onSelect }) {
	if (!values || values.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
		className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2",
		children: label
	}), /* @__PURE__ */ jsxs("ul", {
		className: "space-y-0.5 max-h-56 overflow-auto pr-1",
		children: [selected ? /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
			onClick: () => onSelect(void 0),
			className: "w-full text-left text-[10px] font-mono uppercase text-muted-foreground px-2 py-1 hover:text-foreground",
			children: "× clear"
		}) }) : null, values.map((v) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
			onClick: () => onSelect(v),
			className: `w-full text-left text-[11px] font-mono px-2 py-1 rounded truncate ${selected === v ? "bg-iris-brand/10 text-iris-brand" : "hover:bg-muted"}`,
			title: v,
			children: v
		}) }, v))]
	})] });
}
//#endregion
export { MessagesPage as component };
