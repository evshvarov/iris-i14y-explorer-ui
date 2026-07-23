import { a as Skeleton, n as apiFetch } from "./api-config-BqoIDxBb.js";
import { t as Input } from "./input-DI6UcbvY.js";
import { t as Route } from "./messages.index-BhPJXTh4.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, ArrowRight, Search, X } from "lucide-react";
//#region src/routes/messages.index.tsx?tsr-split=component
function statusTone(label) {
	if (label === null || label === void 0 || label === "") return "muted";
	const s = String(label).toLowerCase();
	if (/(error|abort|discard|fail|suspend)/.test(s)) return "error";
	if (/(complete|delivered|ok|processed|done)/.test(s)) return "ok";
	if (/(queued|pending|deferred|created|waiting|inprogress|in progress|running)/.test(s)) return "warn";
	return "muted";
}
function statusPillClass(tone) {
	switch (tone) {
		case "error": return "text-destructive bg-destructive/10 ring-1 ring-destructive/30";
		case "ok": return "text-status-confirmed bg-status-confirmed/10 ring-1 ring-status-confirmed/30";
		case "warn": return "text-status-inferred bg-status-inferred/10 ring-1 ring-status-inferred/30";
		default: return "text-muted-foreground bg-muted ring-1 ring-black/5";
	}
}
function ymd(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function rangeForPreset(preset) {
	const now = /* @__PURE__ */ new Date();
	if (preset === "today") {
		const s = ymd(now);
		return {
			dateFrom: s,
			dateTo: s
		};
	}
	if (preset === "week") {
		const d = new Date(now);
		const dow = (d.getDay() + 6) % 7;
		d.setDate(d.getDate() - dow);
		return {
			dateFrom: ymd(d),
			dateTo: ymd(now)
		};
	}
	if (preset === "month") return {
		dateFrom: ymd(new Date(now.getFullYear(), now.getMonth(), 1)),
		dateTo: ymd(now)
	};
	if (preset === "lastMonth") {
		const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const last = new Date(now.getFullYear(), now.getMonth(), 0);
		return {
			dateFrom: ymd(first),
			dateTo: ymd(last)
		};
	}
	return {};
}
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
	const startDate = search.dateFrom ? `${search.dateFrom}T00:00:00` : void 0;
	const endDate = search.dateTo ? `${search.dateTo}T23:59:59` : void 0;
	const listQuery = useQuery({
		queryKey: [
			"messages",
			search,
			limit,
			offset,
			startDate,
			endDate
		],
		queryFn: () => apiFetch(`/messages${toQuery({
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
			offset
		})}`),
		retry: 0
	});
	const facetsQuery = useQuery({
		queryKey: [
			"messages-facets",
			search.productionName,
			startDate,
			endDate
		],
		queryFn: () => apiFetch(`/messages/facets${toQuery({
			productionName: search.productionName,
			startDate,
			endDate,
			limit: 500
		})}`),
		retry: 0
	});
	const items = listQuery.data?.items ?? [];
	const filtered = useMemo(() => {
		if (!text.trim()) return items;
		const t = text.toLowerCase();
		return items.filter((m) => String(m.messageId ?? "").includes(t) || String(m.sessionId ?? "").includes(t) || String(m.sourceConfigName ?? "").toLowerCase().includes(t) || String(m.targetConfigName ?? "").toLowerCase().includes(t) || String(m.messageBodyClassName ?? "").toLowerCase().includes(t));
	}, [items, text]);
	const statusNameByCode = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const f of facetsQuery.data?.statusFacets ?? []) {
			const name = String(f.statusLabel ?? f.statusName ?? f.label ?? f.name ?? "").trim();
			const code = String(f.status ?? "").trim();
			if (name && code) map.set(code, name);
		}
		for (const m of items) {
			const code = String(m.status ?? "").trim();
			const name = String(m.statusLabel ?? m.statusName ?? "").trim();
			if (name && code && !map.has(code)) map.set(code, name);
		}
		return map;
	}, [facetsQuery.data?.statusFacets, items]);
	const statusLabels = useMemo(() => {
		const counts = /* @__PURE__ */ new Map();
		for (const f of facetsQuery.data?.statusFacets ?? []) {
			const name = String(f.statusLabel ?? f.statusName ?? f.label ?? f.name ?? "").trim();
			if (!name) continue;
			counts.set(name, (counts.get(name) ?? 0) + Number(f.count ?? 0));
		}
		if (counts.size === 0) {
			for (const m of items) {
				const code = String(m.status ?? "").trim();
				const label = String(m.statusLabel ?? m.statusName ?? "").trim() || statusNameByCode.get(code) || code;
				if (!label) continue;
				counts.set(label, (counts.get(label) ?? 0) + 1);
			}
			for (const s of facetsQuery.data?.statusLabels ?? facetsQuery.data?.statusNames ?? []) {
				const key = String(s ?? "").trim();
				if (key && !counts.has(key)) counts.set(key, 0);
			}
		}
		return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
	}, [
		items,
		facetsQuery.data?.statusFacets,
		facetsQuery.data?.statusLabels,
		facetsQuery.data?.statusNames,
		statusNameByCode
	]);
	const filteredByStatus = filtered;
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
		search.status ? ["Status", search.status] : void 0,
		search.errorsOnly ? ["Errors", "only"] : void 0,
		search.dateFrom || search.dateTo ? ["Date", `${search.dateFrom ?? "…"} → ${search.dateTo ?? "…"}`] : void 0
	].filter(Boolean);
	const applyPreset = (preset) => {
		if (preset === "custom") {
			setSearchParam({ datePreset: "custom" });
			return;
		}
		const r = rangeForPreset(preset);
		setSearchParam({
			datePreset: preset,
			dateFrom: r.dateFrom,
			dateTo: r.dateTo
		});
	};
	const clearDates = () => setSearchParam({
		datePreset: void 0,
		dateFrom: void 0,
		dateTo: void 0
	});
	const activePreset = search.datePreset ?? (search.dateFrom || search.dateTo ? "custom" : void 0);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: search.productionName ? "Production" : "Namespace" }],
		title: search.productionName ? `Messages · ${search.productionName}` : "Message Explainer",
		status: listQuery.data ? {
			label: `${listQuery.data.count ?? items.length} shown`,
			tone: listQuery.data.errorsOnly ? "inferred" : "observed"
		} : void 0,
		actions: search.productionName ? /* @__PURE__ */ jsxs(Link, {
			to: "/productions/$name",
			params: { name: search.productionName },
			className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted",
			children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }), " Back to production"]
		}) : void 0
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(FacetGroup, {
					label: "Errors",
					items: [{
						key: "all messages",
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
				statusLabels.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("h4", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2",
						children: "Status"
					}),
					/* @__PURE__ */ jsxs("ul", {
						className: "space-y-0.5 max-h-56 overflow-auto pr-1",
						children: [search.status ? /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
							onClick: () => setSearchParam({ status: void 0 }),
							className: "w-full text-left text-[10px] font-mono uppercase text-muted-foreground px-2 py-1 hover:text-foreground",
							children: "× clear"
						}) }) : null, statusLabels.map(([label, count]) => {
							const active = search.status === label;
							const tone = statusTone(label);
							return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
								onClick: () => setSearchParam({ status: active ? void 0 : label }),
								className: `w-full flex items-center justify-between gap-2 text-left text-[11px] font-mono px-2 py-1 rounded ${active ? "bg-iris-brand/10 text-iris-brand" : "hover:bg-muted"}`,
								title: label,
								children: [/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1.5 truncate",
									children: [/* @__PURE__ */ jsx("span", { className: `inline-block size-1.5 rounded-full ${tone === "error" ? "bg-destructive" : tone === "ok" ? "bg-status-confirmed" : tone === "warn" ? "bg-status-inferred" : "bg-muted-foreground/60"}` }), /* @__PURE__ */ jsx("span", {
										className: "truncate",
										children: label
									})]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-muted-foreground",
									children: count
								})]
							}) }, label);
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-[10px] font-mono text-muted-foreground/70 mt-1",
						children: "From loaded page"
					})
				] }) : null,
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
				/* @__PURE__ */ jsx(DateFilterBar, {
					preset: activePreset,
					dateFrom: search.dateFrom,
					dateTo: search.dateTo,
					onPreset: applyPreset,
					onFrom: (v) => setSearchParam({
						datePreset: "custom",
						dateFrom: v || void 0
					}),
					onTo: (v) => setSearchParam({
						datePreset: "custom",
						dateTo: v || void 0
					}),
					onClear: clearDates
				}),
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
				}) : filteredByStatus.length === 0 ? /* @__PURE__ */ jsx("div", {
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
						children: filteredByStatus.map((m) => {
							const tone = m.isError ? "error" : statusTone(m.status);
							return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
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
										className: `text-[10px] font-mono uppercase px-1.5 py-0.5 rounded flex items-center gap-1 ${statusPillClass(tone)}`,
										children: [m.isError ? /* @__PURE__ */ jsx(AlertCircle, { className: "size-3" }) : null, m.statusLabel || m.statusName || statusNameByCode.get(String(m.status ?? "")) || m.status || "?"]
									}),
									/* @__PURE__ */ jsx(ArrowRight, { className: "size-4 text-muted-foreground group-hover:text-foreground" })
								]
							}) }, m.messageId);
						})
					})]
				}),
				items.length > 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 text-[11px] font-mono text-muted-foreground",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							"offset ",
							offset,
							" · showing ",
							items.length
						] }), /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "uppercase tracking-wider",
								children: "page size"
							}), /* @__PURE__ */ jsx("select", {
								value: limit,
								onChange: (e) => navigate({ search: ((s) => ({
									...s,
									limit: Number(e.target.value),
									offset: 0
								})) }),
								className: "bg-card ring-1 ring-black/5 rounded px-1.5 py-0.5 font-mono",
								children: [
									25,
									50,
									100,
									200,
									500
								].map((n) => /* @__PURE__ */ jsx("option", {
									value: n,
									children: n
								}, n))
							})]
						})]
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
							disabled: !listQuery.data?.hasMore,
							onClick: () => navigate({ search: ((s) => ({
								...s,
								offset: offset + limit
							})) }),
							className: "text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted disabled:opacity-40",
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
function DateFilterBar({ preset, dateFrom, dateTo, onPreset, onFrom, onTo, onClear }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-3 flex flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mr-1",
				children: "Date"
			}),
			[
				{
					key: "today",
					label: "Today"
				},
				{
					key: "week",
					label: "This week"
				},
				{
					key: "month",
					label: "This month"
				},
				{
					key: "lastMonth",
					label: "Last month"
				},
				{
					key: "custom",
					label: "Custom"
				}
			].map((p) => {
				return /* @__PURE__ */ jsx("button", {
					onClick: () => onPreset(p.key),
					className: `text-[11px] font-mono uppercase px-2 py-1 rounded ring-1 transition ${preset === p.key ? "bg-iris-brand/10 text-iris-brand ring-iris-brand/30" : "bg-muted/40 text-foreground/80 ring-black/5 hover:bg-muted"}`,
					children: p.label
				}, p.key);
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5 ml-auto",
				children: [
					/* @__PURE__ */ jsx("label", {
						className: "text-[10px] font-mono uppercase text-muted-foreground",
						children: "From"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "date",
						value: dateFrom ?? "",
						onChange: (e) => onFrom(e.target.value),
						className: "h-8 px-2 rounded ring-1 ring-black/5 bg-background text-xs font-mono"
					}),
					/* @__PURE__ */ jsx("label", {
						className: "text-[10px] font-mono uppercase text-muted-foreground",
						children: "To"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "date",
						value: dateTo ?? "",
						onChange: (e) => onTo(e.target.value),
						className: "h-8 px-2 rounded ring-1 ring-black/5 bg-background text-xs font-mono"
					}),
					dateFrom || dateTo || preset ? /* @__PURE__ */ jsxs("button", {
						onClick: onClear,
						className: "flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground hover:text-foreground px-1.5 py-1",
						children: [/* @__PURE__ */ jsx(X, { className: "size-3" }), " Clear"]
					}) : null
				]
			})
		]
	});
}
//#endregion
export { MessagesPage as component };
