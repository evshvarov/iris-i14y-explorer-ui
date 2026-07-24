import { a as Skeleton, n as apiFetch, o as cn } from "./api-config-BqoIDxBb.js";
import { t as Route } from "./productions._name-DQfiimOj.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { n as ConfidenceDot, t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { t as LogsPanel } from "./logs-panel-CSPAWrQx.js";
import { i as SummaryBullets, n as MetricChip, r as MetricChips, t as EvidenceChips } from "./summary-bits-umgxy3aN.js";
import * as React from "react";
import { useMemo, useState } from "react";
import { Link, Outlet, useChildMatches, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, BarChart3, Database, Eye, Hammer, Layers, MessageSquareText, Play, RefreshCw, Search, Send, Sparkles, Square } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as TabsPrimitive from "@radix-ui/react-tabs";
//#region src/components/markdown-content.tsx
function MarkdownContent({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("text-sm text-foreground/90 text-pretty leading-relaxed", "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0", "[&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2", "[&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-muted-foreground [&_h2]:text-[11px]", "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1", "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1", "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1", "[&_li]:text-sm", "[&_code]:font-mono [&_code]:text-[12px] [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded", "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0", "[&_a]:text-iris-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80", "[&_blockquote]:border-l-2 [&_blockquote]:border-iris-brand [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-foreground/80 [&_blockquote]:my-2", "[&_table]:w-full [&_table]:text-xs [&_table]:my-2 [&_table]:border-collapse", "[&_th]:text-left [&_th]:font-semibold [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted", "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1", "[&_hr]:my-3 [&_hr]:border-border", "[&_strong]:font-semibold", className),
		children: /* @__PURE__ */ jsx(ReactMarkdown, {
			remarkPlugins: [remarkGfm],
			children
		})
	});
}
//#endregion
//#region src/components/ui/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
//#endregion
//#region src/components/production-kpis.tsx
function ProductionKPIs({ productionName }) {
	const now = useMemo(() => /* @__PURE__ */ new Date(), []);
	const startOfDay = useMemo(() => {
		return (/* @__PURE__ */ new Date(now.getTime() - 24 * 36e5)).toISOString();
	}, [now]);
	const startOfHour = useMemo(() => (/* @__PURE__ */ new Date(now.getTime() - 60 * 6e4)).toISOString(), [now]);
	const base = `/productions/${encodeURIComponent(productionName)}`;
	const facets24h = useQuery({
		queryKey: [
			"prod-kpi",
			productionName,
			"facets24h"
		],
		queryFn: () => apiFetch(`${base}/messages/facets?startDate=${encodeURIComponent(startOfDay)}&limit=500`),
		retry: 0
	});
	const facets1h = useQuery({
		queryKey: [
			"prod-kpi",
			productionName,
			"facets1h"
		],
		queryFn: () => apiFetch(`${base}/messages/facets?startDate=${encodeURIComponent(startOfHour)}&limit=500`),
		retry: 0
	});
	const messages24h = useQuery({
		queryKey: [
			"prod-kpi",
			productionName,
			"messages24h"
		],
		queryFn: () => apiFetch(`${base}/messages?startDate=${encodeURIComponent(startOfDay)}&limit=500`),
		retry: 0
	});
	const anyLoading = facets24h.isLoading || facets1h.isLoading || messages24h.isLoading;
	const total24 = facets24h.data?.totalCount ?? facets24h.data?.metrics?.totalCount ?? messages24h.data?.totalCount ?? messages24h.data?.items?.length ?? 0;
	const errors24 = facets24h.data?.errorCount ?? facets24h.data?.metrics?.errorCount ?? messages24h.data?.errorCount ?? 0;
	const throughputPerMin = (facets1h.data?.totalCount ?? facets1h.data?.metrics?.totalCount ?? 0) / 60;
	const activeSessions = facets24h.data?.sessionIds?.length ?? 0;
	const componentCount = facets24h.data?.componentNames?.length ?? (facets24h.data?.sourceConfigNames?.length ?? 0) + (facets24h.data?.targetConfigNames?.length ?? 0);
	const items = messages24h.data?.items ?? [];
	const avgProcessingMs = useMemo(() => {
		const diffs = [];
		for (const m of items) {
			if (!m.timeCreated || !m.timeProcessed) continue;
			const a = Date.parse(m.timeCreated);
			const b = Date.parse(m.timeProcessed);
			if (Number.isFinite(a) && Number.isFinite(b) && b >= a) diffs.push(b - a);
		}
		if (diffs.length === 0) return void 0;
		return diffs.reduce((x, y) => x + y, 0) / diffs.length;
	}, [items]);
	const queued = useMemo(() => {
		return items.filter((m) => !m.timeProcessed || /queue|pending|deferred|hold/i.test(m.status ?? "")).length;
	}, [items]);
	const buckets = useMemo(() => buildHourlyBuckets(items, now), [items, now]);
	const topSources = facets24h.data?.sourceConfigNames?.slice(0, 6) ?? [];
	const topTargets = facets24h.data?.targetConfigNames?.slice(0, 6) ?? [];
	return /* @__PURE__ */ jsxs("section", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ jsx(Kpi, {
					label: "Messages",
					value: anyLoading ? void 0 : total24,
					unit: "24h",
					footer: `production: ${productionName}`,
					tone: "neutral"
				}),
				/* @__PURE__ */ jsx(Kpi, {
					label: "Throughput",
					value: anyLoading ? void 0 : throughputPerMin,
					unit: "/min",
					footer: "last hour",
					tone: "brand",
					fractional: true
				}),
				/* @__PURE__ */ jsx(Kpi, {
					label: "Avg processing",
					value: anyLoading ? void 0 : avgProcessingMs,
					unit: "ms",
					footer: avgProcessingMs === void 0 ? "no processed samples" : "mean · processed - created",
					tone: "brand",
					fractional: true
				}),
				/* @__PURE__ */ jsx(Kpi, {
					label: "Queued",
					value: anyLoading ? void 0 : queued,
					footer: "unprocessed in window",
					tone: "brand"
				}),
				/* @__PURE__ */ jsx(Kpi, {
					label: "Errors",
					value: anyLoading ? void 0 : errors24,
					unit: "24h",
					footer: errors24 > 0 ? "needs review" : "clean",
					tone: errors24 > 0 ? "error" : "neutral",
					footerTone: errors24 > 0 ? "error" : "brand"
				}),
				/* @__PURE__ */ jsx(Kpi, {
					label: "Active sessions",
					value: anyLoading ? void 0 : activeSessions,
					footer: "distinct in 24h",
					tone: "brand"
				}),
				/* @__PURE__ */ jsx(Kpi, {
					label: "Components touched",
					value: anyLoading ? void 0 : componentCount,
					footer: "sources + targets",
					tone: "neutral"
				}),
				/* @__PURE__ */ jsx(KpiLink, {
					label: "Explore",
					value: "Messages",
					footer: productionName,
					to: "/productions/$name/messages",
					params: { name: productionName }
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between mb-1",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-sm font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(BarChart3, { className: "size-4 text-iris-brand" }), " Message volume"]
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[11px] font-mono text-muted-foreground mt-0.5",
						children: [productionName, " · last 24h · per hour"]
					})] }), /* @__PURE__ */ jsxs("span", {
						className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
						children: [total24.toLocaleString(), " msgs"]
					})]
				}), messages24h.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 mt-4 rounded" }) : messages24h.error ? /* @__PURE__ */ jsx(ErrorNote, { error: messages24h.error }) : /* @__PURE__ */ jsx(VolumeChart, { buckets })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-5 flex flex-col min-h-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between mb-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-sm font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Layers, { className: "size-4 text-iris-brand" }), " Top components"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] font-mono text-muted-foreground mt-0.5",
						children: "messages/facets · last 24h"
					})] }), /* @__PURE__ */ jsx(Link, {
						to: "/metrics",
						className: "text-[11px] font-mono text-iris-brand hover:underline",
						children: "namespace metrics →"
					})]
				}), facets24h.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded" }) : facets24h.error ? /* @__PURE__ */ jsx(ErrorNote, { error: facets24h.error }) : /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-4 text-xs font-mono",
					children: [/* @__PURE__ */ jsx(FacetList, {
						title: "Sources",
						items: topSources
					}), /* @__PURE__ */ jsx(FacetList, {
						title: "Targets",
						items: topTargets
					})]
				})]
			})]
		})]
	});
}
function FacetList({ title, items }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2",
		children: title
	}), items.length === 0 ? /* @__PURE__ */ jsx("p", {
		className: "text-muted-foreground",
		children: "—"
	}) : /* @__PURE__ */ jsx("ul", {
		className: "space-y-1",
		children: items.map((s, i) => /* @__PURE__ */ jsx("li", {
			className: "truncate text-foreground/85",
			title: s,
			children: s
		}, i))
	})] });
}
function Kpi({ label, value, unit, footer, tone = "neutral", footerTone, fractional }) {
	const valueColor = tone === "error" ? "text-destructive" : "text-foreground";
	const footerColor = (footerTone ?? tone) === "error" ? "text-destructive" : (footerTone ?? tone) === "brand" ? "text-iris-brand" : "text-muted-foreground";
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-4 flex flex-col justify-between min-h-[112px]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-[11px] font-medium text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-baseline gap-1.5 mt-1",
				children: [/* @__PURE__ */ jsx("span", {
					className: `text-4xl font-bold tabular-nums ${valueColor}`,
					children: value === void 0 || Number.isNaN(value) ? "—" : fractional ? formatValue(value) : Math.round(value).toLocaleString()
				}), unit ? /* @__PURE__ */ jsx("span", {
					className: "text-xs text-muted-foreground",
					children: unit
				}) : null]
			}),
			footer ? /* @__PURE__ */ jsx("div", {
				className: `text-[11px] mt-1 truncate ${footerColor}`,
				children: footer
			}) : null
		]
	});
}
function KpiLink({ label, value, footer, to, params }) {
	return /* @__PURE__ */ jsxs(Link, {
		to,
		params,
		className: "bg-card ring-1 ring-black/5 rounded-lg p-4 flex flex-col justify-between min-h-[112px] hover:ring-iris-brand/40 hover:bg-iris-brand/5 transition-colors",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-[11px] font-medium text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "text-2xl font-bold text-iris-brand mt-1",
				children: [value, " →"]
			}),
			footer ? /* @__PURE__ */ jsx("div", {
				className: "text-[11px] mt-1 font-mono text-muted-foreground truncate",
				children: footer
			}) : null
		]
	});
}
function VolumeChart({ buckets }) {
	if (buckets.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "text-xs text-muted-foreground font-mono mt-4",
		children: "No messages in the last 24 hours."
	});
	const max = Math.max(1, ...buckets.map((b) => b.value));
	const lastIdx = buckets.length - 1;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex items-end gap-1.5 h-40",
			children: buckets.map((b, i) => {
				const h = Math.max(2, b.value / max * 100);
				return /* @__PURE__ */ jsx("div", {
					className: "flex-1 flex flex-col items-center gap-1",
					children: /* @__PURE__ */ jsx("div", {
						className: `w-full rounded-sm transition-all ${i === lastIdx ? "bg-iris-brand" : "bg-iris-brand/25"}`,
						style: { height: `${h}%` },
						title: `${b.label}: ${formatValue(b.value)}`
					})
				}, i);
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "flex justify-between mt-2 text-[10px] font-mono text-muted-foreground",
			children: pickAxis(buckets).map((l, i) => /* @__PURE__ */ jsx("span", { children: l }, i))
		})]
	});
}
function ErrorNote({ error }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-3 flex items-start gap-2 text-[11px] font-mono text-destructive/90",
		children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "size-3.5 mt-0.5 shrink-0" }), /* @__PURE__ */ jsx("span", {
			className: "break-all",
			children: error.message
		})]
	});
}
function buildHourlyBuckets(items, now) {
	const buckets = [];
	const endMs = now.getTime();
	for (let i = 23; i >= 0; i--) {
		const ts = endMs - i * 36e5;
		const d = new Date(ts);
		buckets.push({
			label: `${String(d.getHours()).padStart(2, "0")}:00`,
			value: 0,
			ts
		});
	}
	const startMs = endMs - 24 * 36e5;
	for (const m of items) {
		if (!m.timeCreated) continue;
		const t = Date.parse(m.timeCreated);
		if (!Number.isFinite(t) || t < startMs || t > endMs) continue;
		const idx = 23 - Math.floor((endMs - t) / 36e5);
		if (idx >= 0 && idx < buckets.length) buckets[idx].value += 1;
	}
	return buckets.map(({ label, value }) => ({
		label,
		value
	}));
}
function pickAxis(buckets) {
	if (buckets.length <= 4) return buckets.map((b) => b.label);
	return [
		buckets[0].label,
		buckets[Math.floor(buckets.length / 4)].label,
		buckets[Math.floor(buckets.length / 2)].label,
		buckets[Math.floor(buckets.length * 3 / 4)].label,
		"now"
	];
}
function formatValue(v) {
	if (!Number.isFinite(v)) return "—";
	if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + "M";
	if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + "k";
	if (Number.isInteger(v)) return v.toLocaleString();
	return v.toFixed(2);
}
//#endregion
//#region src/routes/productions.$name.tsx?tsr-split=component
function categorize(c) {
	const raw = (c.category ?? c.type ?? "").toLowerCase();
	if (raw.includes("service")) return "service";
	if (raw.includes("process")) return "process";
	if (raw.includes("operation")) return "operation";
	const cls = (c.className ?? "").toLowerCase();
	if (cls.includes("service")) return "service";
	if (cls.includes("process")) return "process";
	if (cls.includes("operation")) return "operation";
	return "unknown";
}
function ProductionDetailPage() {
	if (useChildMatches().length > 0) return /* @__PURE__ */ jsx(Outlet, {});
	return /* @__PURE__ */ jsx(ProductionDetailContent, {});
}
function ProductionDetailContent() {
	const { name } = Route.useParams();
	const search = Route.useSearch();
	const navigate = useNavigate();
	const activeTab = search.tab ?? "overview";
	const encoded = encodeURIComponent(name);
	const qc = useQueryClient();
	const meta = useQuery({
		queryKey: ["production", name],
		queryFn: () => apiFetch(`/productions/${encoded}`),
		retry: 0
	});
	const comps = useQuery({
		queryKey: [
			"production",
			name,
			"components"
		],
		queryFn: () => apiFetch(`/productions/${encoded}/components`),
		retry: 0
	});
	const summary = useQuery({
		queryKey: [
			"production",
			name,
			"summary"
		],
		queryFn: () => apiFetch(`/productions/${encoded}/summary`),
		retry: 0
	});
	const status = useQuery({
		queryKey: [
			"production",
			name,
			"status"
		],
		queryFn: () => apiFetch(`/productions/${encoded}/status`),
		retry: 0
	});
	const analysis = useQuery({
		queryKey: [
			"production",
			name,
			"analysis"
		],
		queryFn: () => apiFetch(`/productions/${encoded}/analysis`),
		retry: 0
	});
	const graph = useQuery({
		queryKey: [
			"production",
			name,
			"graph"
		],
		queryFn: () => apiFetch(`/productions/${encoded}/graph`),
		retry: 0
	});
	const components = comps.data?.items ?? comps.data?.components ?? [];
	const services = components.filter((c) => categorize(c) === "service");
	const processes = components.filter((c) => categorize(c) === "process");
	const operations = components.filter((c) => categorize(c) === "operation");
	const unknowns = components.filter((c) => categorize(c) === "unknown");
	const enabled = components.filter((c) => c.enabled !== false).length;
	const disabled = components.length - enabled;
	const runtime = status.data?.runtime ?? meta.data?.runtime;
	const isRunning = Boolean(status.data?.isRunning ?? meta.data?.isRunning);
	const runtimeState = status.data?.runtimeState ?? runtime?.stateLabel ?? meta.data?.runtimeState ?? "unknown";
	const invalidateRuntime = () => {
		qc.invalidateQueries({ queryKey: [
			"production",
			name,
			"status"
		] });
		qc.invalidateQueries({ queryKey: ["production", name] });
		qc.invalidateQueries({ queryKey: ["productions"] });
	};
	const startMut = useMutation({
		mutationFn: () => apiFetch(`/productions/${encoded}/start`, { method: "POST" }),
		onSuccess: (r) => {
			toast.success(`Start ${r.changed ? "issued" : "no-op"} — ${r.runtime?.stateLabel ?? ""}`);
			invalidateRuntime();
		},
		onError: (e) => toast.error(`Start failed: ${e.message}`)
	});
	const stopMut = useMutation({
		mutationFn: () => apiFetch(`/productions/${encoded}/stop`, { method: "POST" }),
		onSuccess: (r) => {
			toast.success(`Stop ${r.changed ? "issued" : "no-op"} — ${r.runtime?.stateLabel ?? ""}`);
			invalidateRuntime();
		},
		onError: (e) => toast.error(`Stop failed: ${e.message}`)
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: "Productions" }],
		title: name,
		status: {
			label: runtimeState,
			tone: isRunning ? "confirmed" : "unknown"
		},
		actions: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: () => startMut.mutate(),
					disabled: startMut.isPending || isRunning,
					className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed hover:bg-status-confirmed/20 transition-colors disabled:opacity-40",
					children: [/* @__PURE__ */ jsx(Play, { className: "size-3.5" }), " Start"]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => stopMut.mutate(),
					disabled: stopMut.isPending || !isRunning,
					className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40",
					children: [/* @__PURE__ */ jsx(Square, { className: "size-3.5" }), " Stop"]
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => invalidateRuntime(),
					className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted transition-colors",
					children: /* @__PURE__ */ jsx(RefreshCw, { className: "size-3.5" })
				}),
				/* @__PURE__ */ jsxs(Link, {
					to: "/productions",
					className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted transition-colors",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }), " All"]
				})
			]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 space-y-8",
		children: [
			/* @__PURE__ */ jsx(ProductionKPIs, { productionName: name }),
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-4",
				children: [
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Namespace",
						value: meta.data?.namespace ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Components",
						value: comps.isLoading ? "…" : `${components.length}`
					}),
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Enabled / Disabled",
						value: comps.isLoading ? "…" : `${enabled} / ${disabled}`
					}),
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Current?",
						value: runtime?.isCurrent ? "Yes" : "No"
					}),
					/* @__PURE__ */ jsx(MetaCard, {
						accent: true,
						label: "Provenance",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex gap-1.5 mt-1",
							children: [
								/* @__PURE__ */ jsx(ConfidenceDot, {
									confidence: "confirmed",
									title: "Confirmed"
								}),
								/* @__PURE__ */ jsx(ConfidenceDot, {
									confidence: "observed",
									title: "Observed"
								}),
								/* @__PURE__ */ jsx(ConfidenceDot, {
									confidence: "inferred",
									title: "Inferred"
								}),
								/* @__PURE__ */ jsx(ConfidenceDot, {
									confidence: "unknown",
									title: "Unknown"
								})
							]
						})
					})
				]
			}),
			meta.data?.description ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground max-w-3xl",
				children: meta.data.description
			}) : null,
			summary.data?.summary ? /* @__PURE__ */ jsxs("section", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-5 max-w-4xl",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
						children: "Deterministic summary"
					}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: summary.data.confidence })]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-foreground/90 whitespace-pre-wrap text-pretty",
					children: summary.data.summary
				})]
			}) : null,
			/* @__PURE__ */ jsx(AISummaryPanel, {
				productionName: name,
				encoded
			}),
			/* @__PURE__ */ jsx(SummaryBullets, { bullets: analysis.data?.summaryBullets }),
			analysis.data?.metrics ? /* @__PURE__ */ jsxs(MetricChips, { children: [
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Services",
					value: analysis.data.metrics.serviceCount ?? 0,
					tone: "observed"
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Processes",
					value: analysis.data.metrics.processCount ?? 0,
					tone: "brand"
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Operations",
					value: analysis.data.metrics.operationCount ?? 0,
					tone: "inferred"
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Connections",
					value: analysis.data.metrics.connectionCount ?? 0
				}),
				(analysis.data.metrics.routingRuleConnectionCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
					label: "Rule conns",
					value: analysis.data.metrics.routingRuleConnectionCount
				}) : null,
				(analysis.data.metrics.bplCallConnectionCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
					label: "BPL conns",
					value: analysis.data.metrics.bplCallConnectionCount
				}) : null,
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Ext systems",
					value: analysis.data.metrics.externalSystemCount ?? 0
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Rules",
					value: analysis.data.metrics.ruleCount ?? 0
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "Transforms",
					value: analysis.data.metrics.transformationCount ?? 0
				}),
				/* @__PURE__ */ jsx(MetricChip, {
					label: "BPL",
					value: analysis.data.metrics.businessProcessCount ?? 0
				}),
				(analysis.data.metrics.warningCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
					label: "Warnings",
					value: analysis.data.metrics.warningCount,
					tone: "error"
				}) : null
			] }) : null,
			/* @__PURE__ */ jsxs(Tabs, {
				value: activeTab,
				onValueChange: (v) => navigate({
					to: "/productions/$name",
					params: { name },
					search: { tab: v === "overview" ? void 0 : v },
					replace: true
				}),
				children: [
					/* @__PURE__ */ jsxs(TabsList, { children: [
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "overview",
							children: "Schematic"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "graph",
							children: "Graph"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "analysis",
							children: "Analysis"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "rules",
							children: "Rules & Transforms"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "bpl",
							children: "Processes"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "explanations",
							children: "Explanations"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "messages",
							children: "Messages"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "logs",
							children: "Logs"
						}),
						/* @__PURE__ */ jsx(TabsTrigger, {
							value: "ask",
							children: "Ask AI"
						})
					] }),
					/* @__PURE__ */ jsxs(TabsContent, {
						value: "overview",
						className: "pt-6",
						children: [comps.error ? /* @__PURE__ */ jsx(ErrorPanel, {
							error: comps.error,
							label: "components"
						}) : null, /* @__PURE__ */ jsxs("section", {
							className: "relative",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 relative",
								children: [
									/* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute top-32 left-[30%] right-[65%] h-px bg-border -z-10" }),
									/* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute top-32 left-[63%] right-[32%] h-px bg-border -z-10" }),
									/* @__PURE__ */ jsx(Column, {
										label: "Business Services",
										loading: comps.isLoading,
										items: services,
										accentBorder: "border-status-observed"
									}),
									/* @__PURE__ */ jsx(Column, {
										label: "Business Processes",
										loading: comps.isLoading,
										items: processes,
										accentBorder: "border-iris-brand",
										featured: true
									}),
									/* @__PURE__ */ jsx(Column, {
										label: "Business Operations",
										loading: comps.isLoading,
										items: operations,
										accentBorder: "border-status-inferred"
									})
								]
							}), unknowns.length > 0 ? /* @__PURE__ */ jsxs("div", {
								className: "mt-8",
								children: [/* @__PURE__ */ jsx("h4", {
									className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4",
									children: "Unclassified"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
									children: unknowns.map((c) => /* @__PURE__ */ jsx(ComponentCard, { component: c }, c.name))
								})]
							}) : null]
						})]
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "graph",
						className: "pt-6 space-y-6",
						children: graph.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-lg" }) : graph.error ? /* @__PURE__ */ jsx(ErrorPanel, {
							error: graph.error,
							label: "graph"
						}) : /* @__PURE__ */ jsx(GraphView, {
							data: graph.data,
							productionName: name
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "analysis",
						className: "pt-6 space-y-8",
						children: analysis.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-lg" }) : analysis.error ? /* @__PURE__ */ jsx(ErrorPanel, {
							error: analysis.error,
							label: "analysis"
						}) : /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(CoveragePanel, { coverage: analysis.data?.analysisCoverage }),
							/* @__PURE__ */ jsx(ConnectionsSection, {
								connections: analysis.data?.connections ?? [],
								explanations: analysis.data?.connectionExplanations ?? []
							}),
							/* @__PURE__ */ jsx(ExternalSystemsSection, {
								systems: analysis.data?.externalSystems ?? [],
								explanations: analysis.data?.externalSystemExplanations ?? []
							}),
							/* @__PURE__ */ jsx(ArtifactsSection, {
								artifacts: analysis.data?.artifacts ?? [],
								explanations: analysis.data?.artifactExplanations ?? []
							}),
							/* @__PURE__ */ jsx(MessageTypesSection, {
								types: analysis.data?.messageTypes ?? [],
								explanations: analysis.data?.messageTypeExplanations ?? []
							})
						] })
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "rules",
						className: "pt-6 space-y-8",
						children: analysis.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-lg" }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RulesSection, {
							rules: analysis.data?.rules ?? [],
							explanations: analysis.data?.ruleExplanations ?? []
						}), /* @__PURE__ */ jsx(TransformsSection, {
							transforms: analysis.data?.transformations ?? [],
							explanations: analysis.data?.transformationExplanations ?? []
						})] })
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "bpl",
						className: "pt-6",
						children: analysis.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-lg" }) : /* @__PURE__ */ jsx(ProcessesSection, {
							processes: analysis.data?.businessProcesses ?? [],
							explanations: analysis.data?.businessProcessExplanations ?? []
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "explanations",
						className: "pt-6",
						children: analysis.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-lg" }) : /* @__PURE__ */ jsx(ExplanationsSection, { explanations: analysis.data?.componentExplanations ?? [] })
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "messages",
						className: "pt-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "bg-card ring-1 ring-black/5 rounded-lg p-6 max-w-2xl",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "size-10 rounded-md bg-iris-brand/10 text-iris-brand flex items-center justify-center mb-3",
									children: /* @__PURE__ */ jsx(MessageSquareText, { className: "size-5" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-semibold mb-1",
									children: "Runtime messages for this production"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-sm text-muted-foreground mb-4",
									children: [
										"Open the message explorer prefiltered to ",
										/* @__PURE__ */ jsx("span", {
											className: "font-mono text-foreground/80",
											children: name
										}),
										"."
									]
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/messages",
									search: { productionName: name },
									className: "inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md ring-1 ring-iris-brand/30 bg-iris-brand/10 text-iris-brand hover:bg-iris-brand/20 transition-colors",
									children: "Open in Message Explainer →"
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "logs",
						className: "pt-6",
						children: /* @__PURE__ */ jsx(LogsPanel, { productionName: name })
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "ask",
						className: "pt-6",
						children: /* @__PURE__ */ jsx(AIAskPanel, {
							productionName: name,
							encoded,
							componentNames: components.map((c) => c.name ?? c.className ?? "").filter(Boolean)
						})
					})
				]
			}),
			analysis.data?.warnings && analysis.data.warnings.length > 0 ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3",
				children: "Warnings"
			}), /* @__PURE__ */ jsx("ul", {
				className: "space-y-1",
				children: analysis.data.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", {
					className: "text-[11px] font-mono text-status-inferred",
					children: [
						"[",
						w.code,
						"] ",
						w.message
					]
				}, i))
			})] }) : null
		]
	})] });
}
function ExplanationLine({ text, confidence }) {
	if (!text) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-2 pt-2 border-t border-border/50 flex items-start gap-2",
		children: [/* @__PURE__ */ jsx(ConfidenceDot, { confidence: confidence ?? "unknown" }), /* @__PURE__ */ jsx("p", {
			className: "text-[11px] text-foreground/80 whitespace-pre-wrap text-pretty leading-relaxed",
			children: text
		})]
	});
}
function CoveragePanel({ coverage }) {
	if (!coverage) return null;
	const flags = [
		["Components", coverage.componentAnalysisAvailable],
		["Targets", coverage.targetAnalysisAvailable],
		["Msg signatures", coverage.messageSignatureAnalysisAvailable],
		["Rules", coverage.ruleAnalysisAvailable],
		["Transforms", coverage.transformationAnalysisAvailable],
		["BPL", coverage.businessProcessAnalysisAvailable]
	];
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
		className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3",
		children: "Analysis coverage"
	}), /* @__PURE__ */ jsxs("div", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-4 space-y-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap gap-2",
			children: flags.map(([label, ok]) => /* @__PURE__ */ jsxs("span", {
				className: `inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ring-1 ${ok ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" : "text-muted-foreground ring-black/10 bg-muted"}`,
				children: [/* @__PURE__ */ jsx("span", { className: `size-1.5 rounded-full ${ok ? "bg-status-confirmed" : "bg-muted-foreground/40"}` }), label]
			}, label))
		}), /* @__PURE__ */ jsx(EvidenceChips, { m: coverage })]
	})] });
}
function ConnectionsSection({ connections, explanations = [] }) {
	const findExpl = (c) => explanations.find((e) => e.from === c.from && e.to === c.to && (!e.kind || e.kind === c.kind));
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "Connections",
		count: connections.length,
		children: connections.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No connections extracted." }) : /* @__PURE__ */ jsx("ul", {
			className: "space-y-2",
			children: connections.map((c, i) => {
				const ex = findExpl(c);
				return /* @__PURE__ */ jsxs("li", {
					className: "bg-card ring-1 ring-black/5 rounded-lg px-4 py-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-3 text-xs",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono truncate",
								children: c.from
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "→"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono truncate",
								children: c.to
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-[10px] px-1.5 py-0.5 bg-muted rounded font-mono uppercase text-muted-foreground",
								children: [c.kind ?? "—", c.ruleName ? ` · ${c.ruleName}` : ""]
							}),
							/* @__PURE__ */ jsx(ConfidenceBadge, { confidence: c.confidence })
						]
					}), /* @__PURE__ */ jsx(ExplanationLine, {
						text: ex?.text,
						confidence: ex?.confidence
					})]
				}, i);
			})
		})
	});
}
function ExternalSystemsSection({ systems, explanations = [] }) {
	const findExpl = (s) => explanations.find((e) => e.component === s.component && e.value === s.value);
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "External systems",
		count: systems.length,
		children: systems.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No external endpoints inferred." }) : /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-3",
			children: systems.map((s, i) => {
				const ex = findExpl(s);
				return /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-3 mb-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold truncate",
									children: s.component
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] font-mono text-muted-foreground uppercase",
									children: [
										s.componentType,
										" · ",
										s.kind
									]
								})]
							}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: s.confidence })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-[11px] font-mono text-foreground/80 break-all",
							children: s.value
						}),
						/* @__PURE__ */ jsx(ExplanationLine, {
							text: ex?.text,
							confidence: ex?.confidence
						})
					]
				}, i);
			})
		})
	});
}
function ArtifactsSection({ artifacts, explanations = [] }) {
	const findExpl = (a) => explanations.find((e) => e.kind === a.kind && e.name === a.name && e.component === a.component);
	const withExpl = artifacts.filter((a) => findExpl(a)?.text);
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "Artifacts",
		count: artifacts.length,
		children: artifacts.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No artifacts." }) : /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2",
				children: artifacts.map((a, i) => /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-md px-3 py-2 text-xs flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-[9px] font-mono uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded",
							children: a.kind
						}),
						/* @__PURE__ */ jsx("span", {
							className: "font-mono",
							children: a.name
						}),
						a.component ? /* @__PURE__ */ jsxs("span", {
							className: "text-muted-foreground",
							children: ["· ", a.component]
						}) : null,
						/* @__PURE__ */ jsx(ConfidenceBadge, { confidence: a.confidence })
					]
				}, i))
			}), withExpl.length > 0 ? /* @__PURE__ */ jsx("ul", {
				className: "space-y-2",
				children: withExpl.map((a, i) => {
					const ex = findExpl(a);
					return /* @__PURE__ */ jsxs("li", {
						className: "bg-card ring-1 ring-black/5 rounded-lg px-4 py-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[11px] font-mono text-muted-foreground mb-1",
							children: ex.label ?? `${a.kind} · ${a.name}`
						}), /* @__PURE__ */ jsx(ExplanationLine, {
							text: ex.text,
							confidence: ex.confidence
						})]
					}, i);
				})
			}) : null]
		})
	});
}
function MessageTypesSection({ types, explanations = [] }) {
	const findExpl = (t) => explanations.find((e) => e.component === t.component && e.method === t.method && e.direction === t.direction);
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "Message signatures",
		count: types.length,
		children: types.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No handler signatures found." }) : /* @__PURE__ */ jsx("ul", {
			className: "space-y-1.5",
			children: types.map((t, i) => {
				const ex = findExpl(t);
				return /* @__PURE__ */ jsxs("li", {
					className: "bg-card ring-1 ring-black/5 rounded-lg px-4 py-2.5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-[1fr_1fr_auto_1fr_auto] gap-3 text-xs items-center",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono truncate",
								children: t.component
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono truncate text-muted-foreground",
								children: t.method ?? "—"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] uppercase font-mono bg-muted rounded px-1.5 py-0.5",
								children: t.direction ?? "—"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono truncate",
								children: t.messageClass ?? "—"
							}),
							/* @__PURE__ */ jsx(ConfidenceBadge, { confidence: t.confidence })
						]
					}), /* @__PURE__ */ jsx(ExplanationLine, {
						text: ex?.text,
						confidence: ex?.confidence
					})]
				}, i);
			})
		})
	});
}
function RulesSection({ rules, explanations = [] }) {
	const findExpl = (r) => explanations.find((e) => e.name === r.name && e.component === r.component);
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "Routing rules",
		count: rules.length,
		children: rules.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No accessible rule definitions." }) : /* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: rules.map((r, i) => {
				const ex = findExpl(r);
				return /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: r.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[10px] font-mono text-muted-foreground",
								children: r.component
							})] }), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: r.confidence })]
						}),
						(r.conditions ?? []).length > 0 ? /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: r.conditions.map((c, j) => /* @__PURE__ */ jsxs("div", {
								className: "border-l-2 border-iris-brand/40 pl-3 py-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "text-[11px] font-mono text-foreground/90",
										children: [
											"WHEN",
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "text-status-observed",
												children: c.condition || "(default)"
											})
										]
									}),
									c.comment ? /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground",
										children: c.comment
									}) : null,
									(c.sends ?? []).map((s, k) => /* @__PURE__ */ jsxs("div", {
										className: "text-[11px] font-mono text-muted-foreground ml-4 mt-0.5",
										children: [
											"→ ",
											s.target,
											s.transform ? ` via ${s.transform}` : ""
										]
									}, k))
								]
							}, j))
						}) : null,
						(r.sends ?? []).length > 0 ? /* @__PURE__ */ jsxs("div", {
							className: "mt-2 text-[11px] font-mono text-muted-foreground",
							children: ["Default sends: ", r.sends.map((s) => s.target).join(", ")]
						}) : null,
						/* @__PURE__ */ jsx(ExplanationLine, {
							text: ex?.text,
							confidence: ex?.confidence
						})
					]
				}, i);
			})
		})
	});
}
function TransformsSection({ transforms, explanations = [] }) {
	const findExpl = (t) => explanations.find((e) => e.name === t.name);
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "DTL transformations",
		count: transforms.length,
		children: transforms.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No DTL transformations found." }) : /* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: transforms.map((t, i) => {
				const ex = findExpl(t);
				return /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold truncate",
									children: t.name
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] font-mono text-muted-foreground truncate",
									children: [
										t.sourceClass ?? "?",
										" → ",
										t.targetClass ?? "?",
										t.language ? ` · ${t.language}` : ""
									]
								})]
							}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: t.confidence })]
						}),
						(t.assignments ?? []).length > 0 ? /* @__PURE__ */ jsxs("details", {
							className: "mt-2",
							children: [/* @__PURE__ */ jsxs("summary", {
								className: "text-[11px] font-mono text-muted-foreground cursor-pointer hover:text-foreground",
								children: [t.assignments.length, " assignments"]
							}), /* @__PURE__ */ jsx("ul", {
								className: "mt-2 space-y-1 border-l border-border pl-3",
								children: t.assignments.slice(0, 50).map((a, j) => /* @__PURE__ */ jsxs("li", {
									className: "text-[10px] font-mono text-foreground/80",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-status-observed",
											children: a.action ?? "set"
										}),
										" ",
										a.property,
										" = ",
										/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: a.value
										})
									]
								}, j))
							})]
						}) : null,
						/* @__PURE__ */ jsx(ExplanationLine, {
							text: ex?.text,
							confidence: ex?.confidence
						})
					]
				}, i);
			})
		})
	});
}
function ProcessesSection({ processes, explanations = [] }) {
	const findExpl = (p) => explanations.find((e) => e.name === p.name);
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "BPL processes",
		count: processes.length,
		children: processes.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No BPL definitions accessible." }) : /* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: processes.map((p, i) => {
				const ex = findExpl(p);
				return /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold truncate",
									children: p.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[10px] font-mono text-muted-foreground truncate",
									children: p.component
								})]
							}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: p.confidence })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono",
							children: [
								/* @__PURE__ */ jsx(Kv, {
									k: "Request",
									v: p.requestClass
								}),
								/* @__PURE__ */ jsx(Kv, {
									k: "Response",
									v: p.responseClass
								}),
								/* @__PURE__ */ jsx(Kv, {
									k: "Context",
									v: p.contextClass
								})
							]
						}),
						(p.calls ?? []).length > 0 ? /* @__PURE__ */ jsxs("div", {
							className: "mt-3 border-t pt-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1",
								children: "Calls"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-0.5",
								children: p.calls.map((c, j) => /* @__PURE__ */ jsxs("li", {
									className: "text-[11px] font-mono text-foreground/80",
									children: [
										"→ ",
										c.target ?? "?",
										" ",
										/* @__PURE__ */ jsxs("span", {
											className: "text-muted-foreground",
											children: [c.async ? "async" : "sync", c.timeout ? ` · timeout=${c.timeout}` : ""]
										})
									]
								}, j))
							})]
						}) : null,
						/* @__PURE__ */ jsx(ExplanationLine, {
							text: ex?.text,
							confidence: ex?.confidence
						})
					]
				}, i);
			})
		})
	});
}
function ExplanationsSection({ explanations }) {
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "Component explanations",
		count: explanations.length,
		children: explanations.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No explanations available." }) : /* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: explanations.map((e, i) => /* @__PURE__ */ jsxs("div", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-sm font-semibold truncate",
							children: e.component
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] font-mono uppercase text-muted-foreground",
							children: e.componentType
						})]
					}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: e.confidence })]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-foreground/90 whitespace-pre-wrap text-pretty",
					children: e.text
				})]
			}, i))
		})
	});
}
function SectionShell({ title, count, children }) {
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3 mb-3",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
			children: title
		}), count !== void 0 ? /* @__PURE__ */ jsx("span", {
			className: "text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded",
			children: count
		}) : null]
	}), children] });
}
function Empty({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "text-[11px] text-muted-foreground font-mono border border-dashed rounded-lg p-4",
		children
	});
}
function Kv({ k, v }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "text-[9px] uppercase tracking-widest text-muted-foreground",
		children: k
	}), /* @__PURE__ */ jsx("div", {
		className: "truncate",
		children: v || "—"
	})] });
}
function Column({ label, loading, items, accentBorder, featured }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsx("h4", {
			className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b pb-2",
			children: label
		}), loading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-32 rounded-[10px]" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-24 rounded-[10px]" })] }) : items.length === 0 ? /* @__PURE__ */ jsx("div", {
			className: "text-[11px] text-muted-foreground font-mono border border-dashed rounded-[10px] p-4",
			children: "None"
		}) : items.map((c) => /* @__PURE__ */ jsx(ComponentCard, {
			component: c,
			highlightBorder: featured ? accentBorder : void 0
		}, c.name))]
	});
}
function ComponentCard({ component, highlightBorder }) {
	const { name, className, adapterClass, adapter, protocol, targets, enabled = true, confidence } = component;
	const adapterLabel = adapterClass ?? adapter;
	return /* @__PURE__ */ jsxs("div", {
		className: `bg-card ring-1 ring-black/5 rounded-[10px] p-5 ${highlightBorder ? `border-l-4 ${highlightBorder}` : ""} ${enabled === false ? "opacity-60 grayscale" : ""}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between mb-3 gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h5", {
						className: "text-[13px] font-semibold leading-tight text-balance break-words",
						children: name
					}), className ? /* @__PURE__ */ jsx("div", {
						className: "text-[10px] font-mono text-muted-foreground truncate mt-0.5",
						children: className
					}) : null]
				}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [
					adapterLabel ? /* @__PURE__ */ jsx(Row, {
						label: "Adapter",
						mono: true,
						children: adapterLabel
					}) : null,
					protocol ? /* @__PURE__ */ jsx(Row, {
						label: "Protocol",
						children: /* @__PURE__ */ jsx("span", {
							className: "px-1 bg-muted rounded text-muted-foreground",
							children: protocol
						})
					}) : null,
					targets && targets.length > 0 ? /* @__PURE__ */ jsx(Row, {
						label: "Targets",
						children: /* @__PURE__ */ jsx("span", {
							className: "font-mono text-foreground/80",
							children: targets.join(", ")
						})
					}) : null
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 pt-4 border-t flex justify-between items-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx("div", { className: `size-1.5 rounded-full ${enabled === false ? "bg-muted-foreground/40" : "bg-status-confirmed"}` }), /* @__PURE__ */ jsx("span", {
						className: "text-[9px] text-muted-foreground uppercase",
						children: enabled === false ? "Disabled" : "Enabled"
					})]
				}), targets && targets.length > 0 ? /* @__PURE__ */ jsx("div", {
					className: "text-muted-foreground/60 text-lg leading-none",
					children: "→"
				}) : null]
			})
		]
	});
}
function Row({ label, children, mono }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between text-[11px] gap-3",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground shrink-0",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: `truncate min-w-0 text-right ${mono ? "font-mono text-foreground/80" : ""}`,
			children
		})]
	});
}
function MetaCard({ label, value, children, mono, accent }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `p-4 bg-card ring-1 ring-black/5 rounded-lg ${accent ? "border-l-2 border-iris-accent" : ""}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1",
			children: label
		}), value !== void 0 ? /* @__PURE__ */ jsx("p", {
			className: `text-sm truncate ${mono ? "font-mono" : ""}`,
			title: value,
			children: value
		}) : children]
	});
}
function ErrorPanel({ error, label }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "p-4 rounded-lg border border-destructive/30 bg-destructive/5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "text-sm font-semibold text-destructive mb-1",
			children: ["Failed to load ", label]
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs font-mono text-destructive/80 break-all",
			children: error.message
		})]
	});
}
function GraphView({ data, productionName }) {
	const nodes = data?.nodes ?? [];
	const edges = data?.edges ?? [];
	const nodeById = new Map(nodes.map((n) => [n.id ?? n.label ?? "", n]));
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SummaryBullets, { bullets: data?.summaryBullets }),
		data?.metrics ? /* @__PURE__ */ jsxs(MetricChips, { children: [
			/* @__PURE__ */ jsx(MetricChip, {
				label: "Nodes",
				value: data.metrics.nodeCount ?? nodes.length,
				tone: "brand"
			}),
			/* @__PURE__ */ jsx(MetricChip, {
				label: "Edges",
				value: data.metrics.edgeCount ?? edges.length
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
			(data.metrics.disabledNodeCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
				label: "Disabled",
				value: data.metrics.disabledNodeCount
			}) : null,
			(data.metrics.routingRuleEdgeCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
				label: "Rule edges",
				value: data.metrics.routingRuleEdgeCount
			}) : null,
			(data.metrics.bplCallEdgeCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
				label: "BPL edges",
				value: data.metrics.bplCallEdgeCount
			}) : null
		] }) : null,
		/* @__PURE__ */ jsx(GraphDiagram, {
			nodes,
			edges,
			productionName
		}),
		/* @__PURE__ */ jsx(SectionShell, {
			title: "Nodes",
			count: nodes.length,
			children: nodes.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No graph nodes." }) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
				children: nodes.map((n) => /* @__PURE__ */ jsxs(Link, {
					to: "/productions/$name/components/$componentName",
					params: {
						name: productionName,
						componentName: n.label ?? n.id ?? ""
					},
					search: { fromTab: "overview" },
					className: "bg-card ring-1 ring-black/5 rounded-lg p-3 hover:ring-iris-brand/40 transition-all block",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-2 mb-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[9px] font-mono uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded",
								children: n.type ?? "node"
							}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: n.confidence })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-sm font-semibold truncate",
							children: n.label ?? n.id
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-[10px] font-mono text-muted-foreground truncate",
							children: n.className ?? "—"
						}),
						n.protocol || n.adapterClass ? /* @__PURE__ */ jsxs("div", {
							className: "mt-1 text-[10px] font-mono text-muted-foreground truncate",
							children: [
								n.protocol ? `proto: ${n.protocol}` : "",
								n.protocol && n.adapterClass ? " · " : "",
								n.adapterClass ? `adapter: ${n.adapterClass}` : ""
							]
						}) : null
					]
				}, n.id ?? n.label))
			})
		}),
		/* @__PURE__ */ jsx(SectionShell, {
			title: "Edges",
			count: edges.length,
			children: edges.length === 0 ? /* @__PURE__ */ jsx(Empty, { children: "No edges." }) : /* @__PURE__ */ jsxs("div", {
				className: "bg-card ring-1 ring-black/5 rounded-lg overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-[1fr_auto_1fr_auto_auto_auto] items-center gap-3 px-4 py-2 border-b bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: [
						/* @__PURE__ */ jsx("span", { children: "Source" }),
						/* @__PURE__ */ jsx("span", {}),
						/* @__PURE__ */ jsx("span", { children: "Target" }),
						/* @__PURE__ */ jsx("span", { children: "Rel" }),
						/* @__PURE__ */ jsx("span", { children: "Kind" }),
						/* @__PURE__ */ jsx("span", { children: "Conf" })
					]
				}), /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: edges.map((e, i) => /* @__PURE__ */ jsxs("li", {
						className: "grid grid-cols-[1fr_auto_1fr_auto_auto_auto] items-center gap-3 px-4 py-2 text-xs",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono truncate",
								title: e.source,
								children: nodeById.get(e.source ?? "")?.label ?? e.source
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: "→"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono truncate",
								title: e.target,
								children: nodeById.get(e.target ?? "")?.label ?? e.target
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-mono uppercase text-muted-foreground bg-muted rounded px-1.5 py-0.5",
								children: e.relationship ?? "—"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-[10px] font-mono uppercase text-muted-foreground",
								children: [e.kind ?? "—", e.ruleName ? ` · ${e.ruleName}` : ""]
							}),
							/* @__PURE__ */ jsx(ConfidenceBadge, { confidence: e.confidence })
						]
					}, e.id ?? i))
				})]
			})
		})
	] });
}
function GraphDiagram({ nodes, edges, productionName }) {
	const navigate = useNavigate();
	const [hoverEdge, setHoverEdge] = useState(null);
	const [hoverNode, setHoverNode] = useState(null);
	if (nodes.length === 0) return null;
	const tierOf = (t) => {
		const s = (t ?? "").toLowerCase();
		if (s.includes("service")) return 0;
		if (s.includes("operation")) return 2;
		return 1;
	};
	const cols = [
		[],
		[],
		[]
	];
	nodes.forEach((n) => cols[tierOf(n.type)].push(n));
	const colW = 260;
	const rowH = 72;
	const padX = 16;
	const padY = 40;
	const nodeW = 220;
	const nodeH = 56;
	const maxRows = Math.max(1, ...cols.map((c) => c.length));
	const width = 972;
	const height = padY * 2 + maxRows * rowH;
	const posById = /* @__PURE__ */ new Map();
	cols.forEach((col, ci) => {
		const colX = padX + ci * 340;
		const offset = (maxRows - col.length) / 2;
		col.forEach((n, ri) => {
			const key = n.id ?? n.label ?? "";
			posById.set(key, {
				x: colX + (colW - nodeW) / 2,
				y: padY + (offset + ri) * rowH,
				col: ci,
				row: ri
			});
		});
	});
	const colorForType = (t) => {
		const tier = tierOf(t);
		if (tier === 0) return {
			fill: "#dbeafe",
			stroke: "#60a5fa",
			text: "#1e3a8a"
		};
		if (tier === 2) return {
			fill: "#fed7aa",
			stroke: "#fb923c",
			text: "#7c2d12"
		};
		return {
			fill: "#d1fae5",
			stroke: "#34d399",
			text: "#065f46"
		};
	};
	const edgeColor = (rel) => {
		const r = (rel ?? "").toLowerCase();
		if (r.includes("rout") || r.includes("rule")) return "#0d9488";
		if (r.includes("bpl") || r.includes("call")) return "#7c3aed";
		if (r.includes("target") || r.includes("config")) return "#2563eb";
		return "#64748b";
	};
	const edgePaths = edges.map((e, i) => {
		const s = posById.get(e.source ?? "");
		const t = posById.get(e.target ?? "");
		if (!s || !t) return null;
		const x1 = s.x + nodeW;
		const y1 = s.y + nodeH / 2;
		const x2 = t.x;
		const y2 = t.y + nodeH / 2;
		let d;
		if (t.col > s.col) {
			const mx = (x1 + x2) / 2;
			d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
		} else {
			const bend = 40 + Math.abs(s.row - t.row) * 8;
			const sx = s.x + nodeW / 2;
			const tx = t.x + nodeW / 2;
			const sy = s.y + nodeH;
			const ty = t.y;
			d = `M ${sx} ${sy} C ${sx} ${sy + bend}, ${tx} ${ty + bend}, ${tx} ${ty}`;
		}
		return {
			i,
			d,
			edge: e,
			color: edgeColor(e.relationship)
		};
	});
	return /* @__PURE__ */ jsx(SectionShell, {
		title: "Component graph",
		count: edges.length,
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-card ring-1 ring-black/5 rounded-lg p-2 overflow-x-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "size-2.5 rounded-sm bg-[#dbeafe] ring-1 ring-[#60a5fa]" }), " Services"]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "size-2.5 rounded-sm bg-[#d1fae5] ring-1 ring-[#34d399]" }), " Processes"]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "size-2.5 rounded-sm bg-[#fed7aa] ring-1 ring-[#fb923c]" }), " Operations"]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "ml-auto",
							children: "Click a node to open its details"
						})
					]
				}),
				/* @__PURE__ */ jsxs("svg", {
					viewBox: `0 0 ${width} ${height}`,
					width: "100%",
					style: {
						maxWidth: width,
						minWidth: 600
					},
					className: "block",
					children: [
						/* @__PURE__ */ jsx("defs", { children: [
							"#0d9488",
							"#7c3aed",
							"#2563eb",
							"#64748b"
						].map((c) => /* @__PURE__ */ jsx("marker", {
							id: `arrow-${c.replace("#", "")}`,
							viewBox: "0 0 10 10",
							refX: "9",
							refY: "5",
							markerWidth: "7",
							markerHeight: "7",
							orient: "auto-start-reverse",
							children: /* @__PURE__ */ jsx("path", {
								d: "M 0 0 L 10 5 L 0 10 z",
								fill: c
							})
						}, c)) }),
						[
							"Services",
							"Processes",
							"Operations"
						].map((lbl, ci) => /* @__PURE__ */ jsxs("text", {
							x: padX + ci * 340 + colW / 2,
							y: 20,
							textAnchor: "middle",
							className: "fill-muted-foreground",
							style: {
								fontSize: 10,
								fontFamily: "var(--font-mono, monospace)",
								letterSpacing: 2,
								textTransform: "uppercase"
							},
							children: [
								lbl.toUpperCase(),
								" · ",
								cols[ci].length
							]
						}, lbl)),
						edgePaths.map((ep) => ep ? /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx("path", {
							d: ep.d,
							fill: "none",
							stroke: ep.color,
							strokeWidth: hoverEdge === ep.i ? 2.5 : 1.5,
							strokeOpacity: hoverNode ? ep.edge.source === hoverNode || ep.edge.target === hoverNode ? 1 : .15 : hoverEdge === null || hoverEdge === ep.i ? .85 : .2,
							markerEnd: `url(#arrow-${ep.color.replace("#", "")})`,
							onMouseEnter: () => setHoverEdge(ep.i),
							onMouseLeave: () => setHoverEdge(null),
							style: { cursor: "pointer" },
							children: /* @__PURE__ */ jsxs("title", { children: [
								ep.edge.relationship ?? "edge",
								ep.edge.kind ? ` · ${ep.edge.kind}` : "",
								ep.edge.ruleName ? ` · ${ep.edge.ruleName}` : "",
								"\n",
								ep.edge.source,
								" → ",
								ep.edge.target,
								ep.edge.messageTypes?.length ? `\n${ep.edge.messageTypes.join(", ")}` : ""
							] })
						}) }, ep.i) : null),
						nodes.map((n) => {
							const key = n.id ?? n.label ?? "";
							const p = posById.get(key);
							if (!p) return null;
							const c = colorForType(n.type);
							const isDim = hoverNode && hoverNode !== key ? !edges.some((e) => e.source === hoverNode && e.target === key || e.target === hoverNode && e.source === key) : false;
							return /* @__PURE__ */ jsxs("g", {
								transform: `translate(${p.x}, ${p.y})`,
								style: {
									cursor: "pointer",
									opacity: isDim ? .35 : 1
								},
								onMouseEnter: () => setHoverNode(key),
								onMouseLeave: () => setHoverNode(null),
								onClick: () => navigate({
									to: "/productions/$name/components/$componentName",
									params: {
										name: productionName,
										componentName: n.label ?? n.id ?? ""
									},
									search: { fromTab: "graph" }
								}),
								children: [
									/* @__PURE__ */ jsx("rect", {
										width: nodeW,
										height: nodeH,
										rx: 8,
										fill: c.fill,
										stroke: c.stroke,
										strokeWidth: hoverNode === key ? 2 : 1
									}),
									/* @__PURE__ */ jsx("text", {
										x: 12,
										y: 22,
										style: {
											fontSize: 13,
											fontWeight: 600,
											fill: c.text
										},
										children: truncate(n.label ?? n.id ?? "", 26)
									}),
									/* @__PURE__ */ jsx("text", {
										x: 12,
										y: 40,
										style: {
											fontSize: 10,
											fontFamily: "var(--font-mono, monospace)",
											fill: c.text,
											opacity: .75
										},
										children: truncate(n.className ?? n.type ?? "", 30)
									}),
									n.enabled === false ? /* @__PURE__ */ jsx("text", {
										x: nodeW - 10,
										y: 16,
										textAnchor: "end",
										style: {
											fontSize: 9,
											fill: "#991b1b",
											fontFamily: "var(--font-mono, monospace)"
										},
										children: "DISABLED"
									}) : null,
									/* @__PURE__ */ jsxs("title", { children: [
										n.label ?? n.id,
										"\n",
										n.type ?? "",
										" · ",
										n.className ?? ""
									] })
								]
							}, key);
						})
					]
				}),
				edges.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "px-3 pb-2 text-[11px] text-muted-foreground",
					children: "No source→target relationships reported by the backend for this production."
				}) : null
			]
		})
	});
}
function truncate(s, n) {
	return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function AISummaryPanel({ productionName, encoded }) {
	const [result, setResult] = useState(null);
	const mutation = useMutation({
		mutationFn: () => apiFetch(`/productions/${encoded}/ai/summary`, { method: "POST" }),
		onSuccess: (r) => {
			setResult(r);
			if (r.generated) toast.success("AI summary generated");
			else if (r.warnings?.length) toast.message(r.warnings[0]?.message ?? "AI summary unavailable");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-5 max-w-4xl",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-3 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: "AI-assisted summary"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-[11px] text-muted-foreground mt-1",
					children: [
						"Calls ",
						/* @__PURE__ */ jsxs("span", {
							className: "font-mono",
							children: [
								"POST /productions/",
								productionName,
								"/ai/summary"
							]
						}),
						". Requires ",
						/* @__PURE__ */ jsx("span", {
							className: "font-mono",
							children: "aiProviderEnabled"
						}),
						" +",
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "font-mono",
							children: "aiSummaryEnabled"
						}),
						" and an OpenAI key on the server."
					]
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [result?.confidence ? /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: result.confidence }) : null, /* @__PURE__ */ jsxs("button", {
						onClick: () => mutation.mutate(),
						disabled: mutation.isPending,
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md bg-iris-brand text-white px-3 py-1.5 hover:bg-iris-brand/90 disabled:opacity-50",
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${mutation.isPending ? "animate-spin" : ""}` }), mutation.isPending ? "Generating…" : result ? "Regenerate" : "Generate AI summary"]
					})]
				})]
			}),
			mutation.error ? /* @__PURE__ */ jsx("div", {
				className: "text-xs font-mono text-destructive break-all mb-2",
				children: mutation.error.message
			}) : null,
			result ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 text-[10px] font-mono",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: `rounded px-2 py-0.5 ring-1 ${result.generated ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" : "text-muted-foreground ring-black/10"}`,
								children: result.generated ? "AI GENERATED" : "FALLBACK"
							}),
							result.provider ? /* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: ["provider: ", result.provider]
							}) : null,
							result.model ? /* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: ["model: ", result.model]
							}) : null,
							result.aiApiKeySource ? /* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: ["key: ", result.aiApiKeySource]
							}) : null
						]
					}),
					result.summary ? /* @__PURE__ */ jsx(MarkdownContent, { children: result.summary }) : /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground italic",
						children: "No AI summary text returned."
					}),
					!result.generated && result.deterministicSummary ? /* @__PURE__ */ jsxs("details", {
						className: "text-xs",
						children: [
							/* @__PURE__ */ jsx("summary", {
								className: "cursor-pointer text-muted-foreground hover:text-foreground",
								children: "Deterministic fallback"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 whitespace-pre-wrap text-foreground/80",
								children: result.deterministicSummary
							}),
							/* @__PURE__ */ jsx(SummaryBullets, { bullets: result.deterministicSummaryBullets })
						]
					}) : null,
					result.warnings?.length ? /* @__PURE__ */ jsx("ul", {
						className: "text-[11px] font-mono text-amber-700 space-y-0.5",
						children: result.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", { children: [
							"⚠ ",
							w.code ? `${w.code}: ` : "",
							w.message
						] }, i))
					}) : null
				]
			}) : /* @__PURE__ */ jsxs("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Click ",
					/* @__PURE__ */ jsx("em", { children: "Generate AI summary" }),
					" to have the module compose a narrative summary from the deterministic analysis and evidence."
				]
			})
		]
	});
}
function AIAskPanel({ productionName, encoded, componentNames }) {
	const [question, setQuestion] = useState("");
	const [componentName, setComponentName] = useState("");
	const [maxChunks, setMaxChunks] = useState(8);
	const [history, setHistory] = useState([]);
	const [preview, setPreview] = useState(null);
	const mutation = useMutation({
		mutationFn: (body) => apiFetch(`/productions/${encoded}/ai/ask`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		}),
		onSuccess: (r) => {
			setHistory((h) => [r, ...h]);
			if (r.generated) toast.success("AI answer generated");
			else if (r.warnings?.length) toast.message(r.warnings[0]?.message ?? "AI answer unavailable");
		},
		onError: (e) => toast.error(e.message)
	});
	const previewMutation = useMutation({
		mutationFn: (body) => {
			const params = new URLSearchParams();
			if (body.question) params.set("question", body.question);
			if (body.componentName) params.set("componentName", body.componentName);
			if (body.maxChunks) params.set("maxChunks", String(body.maxChunks));
			const qs = params.toString();
			return apiFetch(`/productions/${encoded}/rag/context${qs ? `?${qs}` : ""}`);
		},
		onSuccess: (r) => {
			setPreview(r);
			toast.success(`Retrieved ${r.retrievedChunkCount ?? r.retrievedChunks?.length ?? 0} chunks`);
		},
		onError: (e) => toast.error(e.message)
	});
	const submit = (e) => {
		e.preventDefault();
		if (!question.trim() || mutation.isPending) return;
		mutation.mutate({
			question: question.trim(),
			componentName: componentName || void 0,
			maxChunks: maxChunks || void 0
		});
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "space-y-6 max-w-4xl",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3 mb-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "size-9 rounded-md bg-iris-brand/10 text-iris-brand flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ jsx(Sparkles, { className: "size-4" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-sm font-semibold",
								children: "Ask about this production"
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: [
									"Retrieval-augmented answer grounded in analysis chunks.",
									" ",
									/* @__PURE__ */ jsxs("span", {
										className: "font-mono",
										children: [
											"POST /productions/",
											productionName,
											"/ai/ask"
										]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx("textarea", {
								value: question,
								onChange: (e) => setQuestion(e.target.value),
								placeholder: "e.g. Why does this production route messages the way it does?",
								rows: 3,
								className: "w-full text-sm rounded-md ring-1 ring-black/10 bg-background px-3 py-2 font-mono focus:outline-none focus:ring-iris-brand"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-2",
								children: [
									"What does this production do?",
									"Why might messages fail here?",
									"Which components have the most warnings?",
									"How are services connected to operations?"
								].map((s) => /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setQuestion(s),
									className: "text-[11px] font-mono text-muted-foreground hover:text-foreground rounded-full ring-1 ring-black/10 px-2.5 py-1 bg-muted/40 hover:bg-muted",
									children: s
								}, s))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11px] font-mono text-muted-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "uppercase tracking-wider",
											children: "Scope"
										}), /* @__PURE__ */ jsxs("select", {
											value: componentName,
											onChange: (e) => setComponentName(e.target.value),
											className: "bg-card ring-1 ring-black/10 rounded px-2 py-1 font-mono text-foreground",
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: "Whole production"
											}), componentNames.map((n) => /* @__PURE__ */ jsx("option", {
												value: n,
												children: n
											}, n))]
										})]
									}),
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11px] font-mono text-muted-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "uppercase tracking-wider",
											children: "Max chunks"
										}), /* @__PURE__ */ jsx("input", {
											type: "number",
											min: 1,
											max: 32,
											value: maxChunks,
											onChange: (e) => setMaxChunks(Number(e.target.value) || 8),
											className: "w-16 bg-card ring-1 ring-black/10 rounded px-2 py-1 font-mono text-foreground"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "ml-auto flex items-center gap-2",
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											disabled: previewMutation.isPending,
											onClick: () => previewMutation.mutate({
												question: question.trim() || void 0,
												componentName: componentName || void 0,
												maxChunks: maxChunks || void 0
											}),
											className: "inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md ring-1 ring-iris-brand/40 text-iris-brand px-3 py-1.5 hover:bg-iris-brand/10 disabled:opacity-50",
											title: "GET /productions/{name}/rag/context — inspect retrieved chunks without invoking AI",
											children: [previewMutation.isPending ? /* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), previewMutation.isPending ? "Retrieving…" : "Preview retrieval"]
										}), /* @__PURE__ */ jsxs("button", {
											type: "submit",
											disabled: !question.trim() || mutation.isPending,
											className: "inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md bg-iris-brand text-white px-3 py-1.5 hover:bg-iris-brand/90 disabled:opacity-50",
											children: [mutation.isPending ? /* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" }), mutation.isPending ? "Asking…" : "Ask"]
										})]
									})
								]
							})
						]
					}),
					mutation.error ? /* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono text-destructive break-all mt-3",
						children: mutation.error.message
					}) : null
				]
			}),
			preview ? /* @__PURE__ */ jsx(RAGContextPanel, {
				data: preview,
				onClose: () => setPreview(null)
			}) : null,
			/* @__PURE__ */ jsx(RAGIndexSection, {
				encoded,
				productionName,
				componentNames
			}),
			history.length === 0 && !mutation.isPending ? /* @__PURE__ */ jsxs("p", {
				className: "text-xs text-muted-foreground italic",
				children: [
					"Ask a question to have the module retrieve grounded analysis chunks and generate an answer. Requires ",
					/* @__PURE__ */ jsx("span", {
						className: "font-mono",
						children: "aiProviderEnabled"
					}),
					" and an OpenAI key on the server; otherwise a deterministic fallback is returned."
				]
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: history.map((r, idx) => /* @__PURE__ */ jsx(AIAskResult, { result: r }, idx))
			})
		]
	});
}
function RAGIndexSection({ encoded, productionName, componentNames }) {
	const qc = useQueryClient();
	const status = useQuery({
		queryKey: ["rag-index", productionName],
		queryFn: () => apiFetch(`/productions/${encoded}/rag/index`),
		retry: 0
	});
	const [includeRuntime, setIncludeRuntime] = useState(false);
	const [includePayload, setIncludePayload] = useState(false);
	const [lookbackHours, setLookbackHours] = useState("");
	const [maxMessages, setMaxMessages] = useState("");
	const [maxLogs, setMaxLogs] = useState("");
	const rebuild = useMutation({
		mutationFn: () => {
			const body = {};
			if (includeRuntime) {
				body.includeRuntime = true;
				if (lookbackHours !== "") body.lookbackHours = Number(lookbackHours);
				if (maxMessages !== "") body.maxMessages = Number(maxMessages);
				if (maxLogs !== "") body.maxLogs = Number(maxLogs);
			}
			if (includePayload) body.includePayload = true;
			return apiFetch(`/productions/${encoded}/rag/index`, {
				method: "POST",
				headers: Object.keys(body).length ? { "Content-Type": "application/json" } : void 0,
				body: Object.keys(body).length ? JSON.stringify(body) : void 0
			});
		},
		onSuccess: (r) => {
			toast.success(`Index rebuilt · ${r.chunkCount ?? 0} chunks · run #${r.runId ?? "?"}`);
			qc.invalidateQueries({ queryKey: ["rag-index", productionName] });
			qc.invalidateQueries({ queryKey: ["rag-chunks", productionName] });
		},
		onError: (e) => toast.error(e.message)
	});
	const s = status.data;
	const indexed = s?.indexed;
	const stale = s?.stale;
	const statusChip = indexed ? stale ? {
		label: "STALE",
		tone: "text-amber-700 ring-amber-500/30 bg-amber-500/10"
	} : {
		label: "READY",
		tone: "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10"
	} : {
		label: "NOT INDEXED",
		tone: "text-muted-foreground ring-black/10 bg-muted/40"
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-4",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-3 min-w-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "size-9 rounded-md bg-iris-brand/10 text-iris-brand flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ jsx(Database, { className: "size-4" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-sm font-semibold",
							children: "Persisted RAG index"
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: [
								"Deterministic analysis chunks stored server-side. Ask AI uses this index when present.",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-mono",
									children: "GET /rag/index"
								})
							]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ jsx("span", {
						className: `text-[10px] font-mono uppercase tracking-wider ring-1 rounded px-2 py-0.5 ${statusChip.tone}`,
						children: statusChip.label
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => rebuild.mutate(),
						disabled: rebuild.isPending,
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md ring-1 ring-iris-brand/40 text-iris-brand px-3 py-1.5 hover:bg-iris-brand/10 disabled:opacity-50",
						title: "POST /rag/index — rebuild deterministic index",
						children: [rebuild.isPending ? /* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Hammer, { className: "w-3.5 h-3.5" }), rebuild.isPending ? "Rebuilding…" : "Rebuild index"]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-md ring-1 ring-black/5 bg-muted/30 p-3 space-y-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Rebuild options"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: includeRuntime,
								onChange: (e) => setIncludeRuntime(e.target.checked)
							}), "Include runtime (messages + logs)"]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: includePayload,
								onChange: (e) => setIncludePayload(e.target.checked)
							}), "Include payload metadata"]
						}),
						includeRuntime ? /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-1.5 text-muted-foreground",
								children: [/* @__PURE__ */ jsx("span", {
									className: "uppercase tracking-wider",
									children: "Lookback h"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									min: 1,
									value: lookbackHours,
									onChange: (e) => setLookbackHours(e.target.value === "" ? "" : Number(e.target.value)),
									className: "w-20 bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground",
									placeholder: "24"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-1.5 text-muted-foreground",
								children: [/* @__PURE__ */ jsx("span", {
									className: "uppercase tracking-wider",
									children: "Max msg"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									min: 1,
									value: maxMessages,
									onChange: (e) => setMaxMessages(e.target.value === "" ? "" : Number(e.target.value)),
									className: "w-20 bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-1.5 text-muted-foreground",
								children: [/* @__PURE__ */ jsx("span", {
									className: "uppercase tracking-wider",
									children: "Max log"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									min: 1,
									value: maxLogs,
									onChange: (e) => setMaxLogs(e.target.value === "" ? "" : Number(e.target.value)),
									className: "w-20 bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground"
								})]
							})
						] }) : null
					]
				})]
			}),
			status.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-64" }) : status.error ? /* @__PURE__ */ jsx("p", {
				className: "text-xs font-mono text-destructive break-all",
				children: status.error.message
			}) : s ? /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-1.5",
					children: [
						["chunks", s.chunkCount],
						["source classes", s.sourceClassCount],
						["run", s.runId],
						["components", s.metrics?.componentChunkCount],
						["connections", s.metrics?.connectionChunkCount],
						["rules", s.metrics?.ruleChunkCount],
						["msg types", s.metrics?.messageTypeChunkCount],
						["transforms", s.metrics?.transformationChunkCount],
						["BPL", s.metrics?.businessProcessChunkCount],
						["externals", s.metrics?.externalSystemChunkCount],
						["warnings", s.metrics?.warningChunkCount],
						["messages", s.metrics?.messageChunkCount],
						["logs", s.metrics?.logChunkCount],
						["payloads", s.metrics?.payloadChunkCount],
						["runtime", s.metrics?.runtimeChunkCount]
					].filter(([, v]) => typeof v === "number").map(([k, v]) => /* @__PURE__ */ jsxs("span", {
						className: "text-[10px] font-mono rounded-full bg-muted/60 ring-1 ring-black/5 px-2 py-0.5 text-foreground/80",
						children: [
							String(k),
							": ",
							String(v)
						]
					}, String(k)))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-[11px] font-mono text-muted-foreground space-y-0.5",
					children: [
						s.statusText ? /* @__PURE__ */ jsx("p", { children: s.statusText }) : s.status ? /* @__PURE__ */ jsxs("p", { children: ["status: ", s.status] }) : null,
						s.runTimestamp ? /* @__PURE__ */ jsxs("p", { children: ["indexed at: ", s.runTimestamp] }) : null,
						s.latestSourceChangedAt ? /* @__PURE__ */ jsxs("p", { children: [
							"latest source change: ",
							s.latestSourceChangedAt,
							s.latestSourceClassName ? ` · ${s.latestSourceClassName}` : ""
						] }) : null
					]
				}),
				s.warnings?.length ? /* @__PURE__ */ jsx("ul", {
					className: "text-[11px] font-mono text-amber-700 space-y-0.5",
					children: s.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", { children: [
						"⚠ ",
						w.code ? `${w.code}: ` : "",
						w.message
					] }, i))
				}) : null
			] }) : null,
			indexed ? /* @__PURE__ */ jsx(RAGChunkBrowser, {
				encoded,
				productionName,
				componentNames
			}) : /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground italic",
				children: "Rebuild the index to browse persisted chunks and enable fast retrieval search."
			})
		]
	});
}
function RAGChunkBrowser({ encoded, productionName, componentNames }) {
	const [open, setOpen] = useState(false);
	const [kind, setKind] = useState("");
	const [componentName, setComponentName] = useState("");
	const [offset, setOffset] = useState(0);
	const limit = 20;
	const chunks = useQuery({
		queryKey: [
			"rag-chunks",
			productionName,
			kind,
			componentName,
			offset
		],
		queryFn: () => {
			const p = new URLSearchParams();
			p.set("limit", String(limit));
			p.set("offset", String(offset));
			if (kind) p.set("kind", kind);
			if (componentName) p.set("componentName", componentName);
			return apiFetch(`/productions/${encoded}/rag/chunks?${p.toString()}`);
		},
		enabled: open,
		retry: 0
	});
	const items = chunks.data?.items ?? [];
	const total = chunks.data?.totalCount ?? 0;
	const hasMore = chunks.data?.hasMore ?? false;
	return /* @__PURE__ */ jsxs("div", {
		className: "border-t border-black/5 pt-4 mt-1",
		children: [/* @__PURE__ */ jsxs("button", {
			onClick: () => setOpen((v) => !v),
			className: "inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground",
			children: [
				/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5" }),
				open ? "Hide" : "Browse",
				" persisted chunks"
			]
		}), open ? /* @__PURE__ */ jsxs("div", {
			className: "mt-3 space-y-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 text-[11px] font-mono",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-1.5 text-muted-foreground",
						children: [/* @__PURE__ */ jsx("span", {
							className: "uppercase tracking-wider",
							children: "Kind"
						}), /* @__PURE__ */ jsx("select", {
							value: kind,
							onChange: (e) => {
								setKind(e.target.value);
								setOffset(0);
							},
							className: "bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground",
							children: [
								"",
								"component",
								"connection",
								"rule",
								"messageType",
								"externalSystem",
								"transformation",
								"businessProcess",
								"warning",
								"summary"
							].map((k) => /* @__PURE__ */ jsx("option", {
								value: k,
								children: k || "any"
							}, k))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-1.5 text-muted-foreground",
						children: [/* @__PURE__ */ jsx("span", {
							className: "uppercase tracking-wider",
							children: "Component"
						}), /* @__PURE__ */ jsxs("select", {
							value: componentName,
							onChange: (e) => {
								setComponentName(e.target.value);
								setOffset(0);
							},
							className: "bg-card ring-1 ring-black/10 rounded px-2 py-1 text-foreground",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "any"
							}), componentNames.map((n) => /* @__PURE__ */ jsx("option", {
								value: n,
								children: n
							}, n))]
						})]
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground ml-auto",
						children: chunks.isLoading ? "loading…" : `${offset + 1}-${offset + items.length} of ${total}`
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setOffset(Math.max(0, offset - limit)),
						disabled: offset === 0,
						className: "ring-1 ring-black/10 rounded px-2 py-1 disabled:opacity-40",
						children: "← Prev"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setOffset(offset + limit),
						disabled: !hasMore,
						className: "ring-1 ring-black/10 rounded px-2 py-1 disabled:opacity-40",
						children: "Next →"
					})
				]
			}), chunks.error ? /* @__PURE__ */ jsx("p", {
				className: "text-xs font-mono text-destructive break-all",
				children: chunks.error.message
			}) : items.length === 0 && !chunks.isLoading ? /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground italic",
				children: "No chunks match the current filters."
			}) : /* @__PURE__ */ jsx("ul", {
				className: "space-y-2",
				children: items.map((c, i) => /* @__PURE__ */ jsxs("li", {
					className: "ring-1 ring-black/5 rounded-md p-3 bg-muted/30",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center flex-wrap gap-2 mb-1",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase tracking-wider text-iris-brand",
									children: c.kind ?? "chunk"
								}),
								c.title ? /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold",
									children: c.title
								}) : null,
								c.component ? /* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: ["· ", c.component]
								}) : null,
								(() => {
									const t = citationLinkProps(c, productionName);
									return t ? /* @__PURE__ */ jsx(Link, {
										to: t.to,
										params: t.params,
										search: t.search,
										title: t.hint,
										className: "text-[10px] font-mono uppercase tracking-wider text-iris-brand hover:underline",
										children: "open →"
									}) : null;
								})(),
								c.id ? /* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono text-muted-foreground ml-auto",
									children: c.id
								}) : null,
								c.confidence ? /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: c.confidence }) : null
							]
						}),
						c.text ? /* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-mono text-foreground/80 whitespace-pre-wrap",
							children: c.text
						}) : null,
						c.source ? /* @__PURE__ */ jsxs("p", {
							className: "text-[10px] font-mono text-muted-foreground mt-1",
							children: ["source: ", c.source]
						}) : null
					]
				}, c.id ?? i))
			})]
		}) : null]
	});
}
/**
* Resolve a RAG citation/chunk to an in-app navigation target, if any.
* Handles component / message / log / session / payload kinds and falls back
* to component pages whenever a `component` field is present.
*/
function citationLinkProps(c, productionName) {
	const kind = (c.kind ?? "").toLowerCase();
	const idish = c.chunkId ?? c.id ?? "";
	const digits = (s) => {
		const m = /(\d{2,})/.exec(s);
		return m ? m[1] : "";
	};
	if (/message|payload|trace|session/.test(kind)) {
		const src = `${idish} ${c.source ?? ""} ${c.title ?? ""}`;
		const msgMatch = /(?:^|[^a-z])(?:message|msg|m)[:_\-#/]?(\d+)/i.exec(src);
		if (msgMatch) return {
			to: "/messages/$id",
			params: { id: msgMatch[1] },
			hint: "Open message"
		};
		const sesMatch = /(?:^|[^a-z])(?:session|ses|s)[:_\-#/]?(\d+)/i.exec(src);
		if (sesMatch) return {
			to: "/messages",
			search: { sessionId: sesMatch[1] },
			hint: "Open session"
		};
		if (/message/.test(kind)) {
			const d = digits(idish);
			if (d) return {
				to: "/messages/$id",
				params: { id: d },
				hint: "Open message"
			};
		}
		if (/session/.test(kind)) {
			const d = digits(idish);
			if (d) return {
				to: "/messages",
				search: { sessionId: d },
				hint: "Open session"
			};
		}
	}
	if (/log/.test(kind)) return {
		to: "/logs",
		hint: "Open logs"
	};
	if (c.component && productionName) return {
		to: "/productions/$name/components/$componentName",
		params: {
			name: productionName,
			componentName: c.component
		},
		search: { fromTab: "ask" },
		hint: `Open ${c.component}`
	};
	if (/^component/.test(kind) && c.title && productionName) return {
		to: "/productions/$name/components/$componentName",
		params: {
			name: productionName,
			componentName: c.title
		},
		search: { fromTab: "ask" },
		hint: `Open ${c.title}`
	};
	return null;
}
function AIAskResult({ result }) {
	const [expanded, setExpanded] = useState(false);
	const citedIds = new Set((result.citations ?? []).map((c) => c.chunkId).filter(Boolean));
	const uncitedIds = new Set(result.uncitedChunkIds ?? []);
	const invalidIds = result.invalidCitationIds ?? [];
	const hasCitations = (result.citations?.length ?? 0) > 0;
	const groundedKnown = typeof result.answerGrounded === "boolean";
	return /* @__PURE__ */ jsxs("article", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-3",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1",
						children: ["Question", result.componentName ? ` · ${result.componentName}` : ""]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium text-foreground/90",
						children: result.question
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [
						groundedKnown ? /* @__PURE__ */ jsx("span", {
							className: `text-[10px] font-mono rounded px-2 py-0.5 ring-1 ${result.answerGrounded ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" : "text-amber-700 ring-amber-500/30 bg-amber-500/10"}`,
							title: result.answerGrounded ? "Every citation in the answer resolves to a retrieved chunk" : "Answer contains invalid or missing citations",
							children: result.answerGrounded ? "GROUNDED" : "UNGROUNDED"
						}) : null,
						result.confidence ? /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: result.confidence }) : null,
						/* @__PURE__ */ jsx("span", {
							className: `text-[10px] font-mono rounded px-2 py-0.5 ring-1 ${result.generated ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" : "text-muted-foreground ring-black/10"}`,
							children: result.generated ? "AI GENERATED" : "FALLBACK"
						})
					]
				})]
			}),
			result.answer ? /* @__PURE__ */ jsx(MarkdownContent, { children: result.answer }) : /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground italic",
				children: "No answer text returned."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted-foreground",
				children: [
					result.provider ? /* @__PURE__ */ jsxs("span", { children: ["provider: ", result.provider] }) : null,
					result.model ? /* @__PURE__ */ jsxs("span", { children: ["model: ", result.model] }) : null,
					result.aiApiKeySource ? /* @__PURE__ */ jsxs("span", { children: ["key: ", result.aiApiKeySource] }) : null,
					typeof result.chunkCount === "number" ? /* @__PURE__ */ jsxs("span", { children: [
						"chunks: ",
						result.chunkCount,
						typeof result.totalChunkCount === "number" ? ` / ${result.totalChunkCount}` : ""
					] }) : null,
					typeof result.citationCount === "number" ? /* @__PURE__ */ jsxs("span", { children: ["citations: ", result.citationCount] }) : null,
					typeof result.invalidCitationCount === "number" && result.invalidCitationCount > 0 ? /* @__PURE__ */ jsxs("span", {
						className: "text-amber-700",
						children: ["invalid: ", result.invalidCitationCount]
					}) : null,
					uncitedIds.size > 0 ? /* @__PURE__ */ jsxs("span", { children: ["uncited: ", uncitedIds.size] }) : null,
					result.chunkSource ? /* @__PURE__ */ jsxs("span", { children: ["source: ", result.chunkSource] }) : null,
					typeof result.runId === "number" ? /* @__PURE__ */ jsxs("span", { children: ["run #", result.runId] }) : null
				]
			}),
			hasCitations ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
					children: "Citations"
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-1",
					children: result.citations.map((c, i) => {
						const target = citationLinkProps(c, result.productionName);
						const rowClass = "flex items-center gap-2 text-[11px] font-mono ring-1 ring-iris-brand/20 bg-iris-brand/5 rounded px-2 py-1";
						const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsxs("span", {
								className: "text-iris-brand shrink-0",
								children: [
									"[",
									i + 1,
									"]"
								]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-iris-brand shrink-0 uppercase tracking-wider",
								children: c.kind ?? "chunk"
							}),
							c.title ? /* @__PURE__ */ jsx("span", {
								className: "text-foreground/90 truncate",
								children: c.title
							}) : null,
							c.component ? /* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground truncate",
								children: ["· ", c.component]
							}) : null,
							c.confidence ? /* @__PURE__ */ jsx("span", {
								className: "ml-auto shrink-0",
								children: /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: c.confidence })
							}) : null,
							c.chunkId ? /* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground/70 shrink-0 ml-1",
								children: c.chunkId
							}) : null
						] });
						return /* @__PURE__ */ jsx("li", { children: target ? /* @__PURE__ */ jsx(Link, {
							to: target.to,
							params: target.params,
							search: target.search,
							title: target.hint,
							className: `${rowClass} hover:bg-iris-brand/10 hover:ring-iris-brand/40 transition-colors cursor-pointer no-underline`,
							children: inner
						}) : /* @__PURE__ */ jsx("div", {
							className: rowClass,
							children: inner
						}) }, c.chunkId ?? i);
					})
				})]
			}) : null,
			invalidIds.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "text-[11px] font-mono text-amber-700 ring-1 ring-amber-500/30 bg-amber-500/5 rounded p-2",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "uppercase tracking-wider mb-1",
						children: "Invalid citations"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "break-all",
						children: invalidIds.join(", ")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-[10px] mt-1 text-amber-700/80",
						children: "The model referenced these chunk ids, but they were not in the retrieval set."
					})
				]
			}) : null,
			result.warnings?.length ? /* @__PURE__ */ jsx("ul", {
				className: "text-[11px] font-mono text-amber-700 space-y-0.5",
				children: result.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", { children: [
					"⚠ ",
					w.code ? `${w.code}: ` : "",
					w.message
				] }, i))
			}) : null,
			result.chunks && result.chunks.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("button", {
				onClick: () => setExpanded((v) => !v),
				className: "text-[11px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider",
				children: [
					expanded ? "Hide" : "Show",
					" retrieved chunks (",
					result.chunks.length,
					citedIds.size > 0 ? `, ${citedIds.size} cited` : "",
					")"
				]
			}), expanded ? /* @__PURE__ */ jsx("ul", {
				className: "mt-2 space-y-2",
				children: result.chunks.map((c, i) => {
					const cited = c.id ? citedIds.has(c.id) : false;
					const uncited = c.id ? uncitedIds.has(c.id) : false;
					return /* @__PURE__ */ jsxs("li", {
						className: `ring-1 rounded-md p-3 ${cited ? "ring-iris-brand/40 bg-iris-brand/5" : uncited ? "ring-black/5 bg-muted/20 opacity-70" : "ring-black/5 bg-muted/30"}`,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center flex-wrap gap-2 mb-1",
								children: [
									cited ? /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono uppercase tracking-wider rounded px-1.5 py-0.5 bg-iris-brand text-white",
										children: "cited"
									}) : uncited ? /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground",
										children: "uncited"
									}) : null,
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono uppercase tracking-wider text-iris-brand",
										children: c.kind ?? "chunk"
									}),
									c.title ? /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold",
										children: c.title
									}) : null,
									c.component ? /* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-mono text-muted-foreground",
										children: ["· ", c.component]
									}) : null,
									c.id ? /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono text-muted-foreground/70",
										children: c.id
									}) : null,
									(() => {
										const t = citationLinkProps(c, result.productionName);
										return t ? /* @__PURE__ */ jsx(Link, {
											to: t.to,
											params: t.params,
											search: t.search,
											title: t.hint,
											className: "text-[10px] font-mono uppercase tracking-wider text-iris-brand hover:underline",
											children: "open →"
										}) : null;
									})(),
									typeof c.score === "number" ? /* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-mono text-muted-foreground ml-auto",
										children: ["score ", c.score]
									}) : null,
									c.confidence ? /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: c.confidence }) : null
								]
							}),
							c.text ? /* @__PURE__ */ jsx("p", {
								className: "text-[11px] font-mono text-foreground/80 whitespace-pre-wrap",
								children: c.text
							}) : null,
							c.source ? /* @__PURE__ */ jsxs("p", {
								className: "text-[10px] font-mono text-muted-foreground mt-1",
								children: ["source: ", c.source]
							}) : null
						]
					}, c.id ?? i);
				})
			}) : null] }) : null
		]
	});
}
function RAGContextPanel({ data, onClose }) {
	const chunks = data.retrievedChunks && data.retrievedChunks.length > 0 ? data.retrievedChunks : data.chunks ?? [];
	const m = data.metrics ?? {};
	const chips = [
		["retrieved", data.retrievedChunkCount ?? m.retrievedChunkCount],
		["total", data.chunkCount ?? m.chunkCount],
		["components", m.componentChunkCount],
		["connections", m.connectionChunkCount],
		["rules", m.ruleChunkCount],
		["msg types", m.messageTypeChunkCount],
		["externals", m.externalSystemChunkCount],
		["transforms", m.transformationChunkCount],
		["BPL", m.businessProcessChunkCount],
		["warnings", m.warningChunkCount]
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-iris-brand/20 rounded-lg p-5 space-y-3",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-mono uppercase tracking-widest text-iris-brand mb-1",
							children: "Retrieval preview · GET /rag/context"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium",
							children: data.question ? /* @__PURE__ */ jsxs(Fragment, { children: ["Question: ", /* @__PURE__ */ jsx("span", {
								className: "font-mono text-foreground/80",
								children: data.question
							})] }) : /* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground italic",
								children: "No question — showing default retrieval set"
							})
						}),
						data.componentName ? /* @__PURE__ */ jsxs("p", {
							className: "text-[11px] font-mono text-muted-foreground mt-0.5",
							children: ["scope: ", data.componentName]
						}) : null
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [data.confidence ? /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: data.confidence }) : null, /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground ring-1 ring-black/10 rounded px-2 py-0.5",
						children: "Close"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1.5",
				children: chips.filter(([, v]) => typeof v === "number").map(([k, v]) => /* @__PURE__ */ jsxs("span", {
					className: "text-[10px] font-mono rounded-full bg-muted/60 ring-1 ring-black/5 px-2 py-0.5 text-foreground/80",
					children: [
						k,
						": ",
						v
					]
				}, k))
			}),
			data.warnings?.length ? /* @__PURE__ */ jsx("ul", {
				className: "text-[11px] font-mono text-amber-700 space-y-0.5",
				children: data.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", { children: [
					"⚠ ",
					w.code ? `${w.code}: ` : "",
					w.message
				] }, i))
			}) : null,
			chunks.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground italic",
				children: "No chunks returned."
			}) : /* @__PURE__ */ jsx("ul", {
				className: "space-y-2",
				children: chunks.map((c, i) => /* @__PURE__ */ jsxs("li", {
					className: "ring-1 ring-black/5 rounded-md p-3 bg-muted/30",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center flex-wrap gap-2 mb-1",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase tracking-wider text-iris-brand",
									children: c.kind ?? "chunk"
								}),
								c.title ? /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold",
									children: c.title
								}) : null,
								c.component ? /* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-mono text-muted-foreground",
									children: ["· ", c.component]
								}) : null,
								(() => {
									const t = citationLinkProps(c, data.productionName);
									return t ? /* @__PURE__ */ jsx(Link, {
										to: t.to,
										params: t.params,
										search: t.search,
										title: t.hint,
										className: "text-[10px] font-mono uppercase tracking-wider text-iris-brand hover:underline",
										children: "open →"
									}) : null;
								})(),
								typeof c.score === "number" ? /* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-mono text-muted-foreground ml-auto",
									children: ["score ", c.score]
								}) : null,
								c.confidence ? /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: c.confidence }) : null
							]
						}),
						c.text ? /* @__PURE__ */ jsx("p", {
							className: "text-[11px] font-mono text-foreground/80 whitespace-pre-wrap",
							children: c.text
						}) : null,
						c.source ? /* @__PURE__ */ jsxs("p", {
							className: "text-[10px] font-mono text-muted-foreground mt-1",
							children: ["source: ", c.source]
						}) : null
					]
				}, c.id ?? i))
			})
		]
	});
}
//#endregion
export { ProductionDetailPage as component };
