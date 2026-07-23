import { a as Skeleton, n as apiFetch } from "./api-config-BqoIDxBb.js";
import { t as Route } from "./productions._name.components._componentName-B9FEutyG.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { n as ConfidenceDot, t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { i as SummaryBullets, n as MetricChip, r as MetricChips, t as EvidenceChips } from "./summary-bits-umgxy3aN.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
//#region src/routes/productions.$name.components.$componentName.tsx?tsr-split=component
function ComponentDetailPage() {
	const { name, componentName } = Route.useParams();
	const url = `/productions/${encodeURIComponent(name)}/components/${encodeURIComponent(componentName)}`;
	const q = useQuery({
		queryKey: [
			"component",
			name,
			componentName
		],
		queryFn: () => apiFetch(url),
		retry: 0
	});
	const c = q.data?.component;
	const settings = c?.settings ?? {};
	const metrics = q.data?.metrics;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [
			{ label: "Productions" },
			{ label: name },
			{ label: "Components" }
		],
		title: componentName,
		status: c ? {
			label: c.enabled === false ? "disabled" : "enabled",
			tone: c.enabled === false ? "unknown" : "confirmed"
		} : void 0,
		actions: /* @__PURE__ */ jsxs(Link, {
			to: "/productions/$name",
			params: { name },
			className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted",
			children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }), " Production"]
		})
	}), /* @__PURE__ */ jsx("div", {
		className: "p-8 space-y-8",
		children: q.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 rounded-lg" }) : q.error ? /* @__PURE__ */ jsxs("div", {
			className: "p-4 rounded-lg border border-destructive/30 bg-destructive/5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-sm font-semibold text-destructive mb-1",
				children: "Failed to load component"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs font-mono text-destructive/80 break-all",
				children: q.error.message
			})]
		}) : c ? /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsx(Meta, {
						label: "Type",
						value: c.type ?? c.category ?? "—"
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Class",
						value: c.className ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Adapter",
						value: c.adapterClass ?? c.adapter ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Protocol",
						value: c.protocol ?? "—"
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Pool size",
						value: String(c.poolSize ?? "—")
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Enabled",
						value: c.enabled === false ? "No" : "Yes"
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Targets",
						value: (c.targets ?? []).join(", ") || "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Confidence",
						value: c.confidence ?? "—"
					})
				]
			}),
			c.comment ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground max-w-3xl",
				children: c.comment
			}) : null,
			/* @__PURE__ */ jsx(SummaryBullets, { bullets: q.data?.summaryBullets }),
			metrics ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ jsxs(MetricChips, { children: [
					/* @__PURE__ */ jsx(MetricChip, {
						label: "Connections",
						value: metrics.connectionCount ?? 0
					}),
					/* @__PURE__ */ jsx(MetricChip, {
						label: "Ext systems",
						value: metrics.externalSystemCount ?? 0
					}),
					/* @__PURE__ */ jsx(MetricChip, {
						label: "Rules",
						value: metrics.ruleCount ?? 0
					}),
					/* @__PURE__ */ jsx(MetricChip, {
						label: "Msg types",
						value: metrics.messageTypeCount ?? 0
					}),
					/* @__PURE__ */ jsx(MetricChip, {
						label: "Transforms",
						value: metrics.transformationCount ?? 0
					}),
					/* @__PURE__ */ jsx(MetricChip, {
						label: "BPL",
						value: metrics.businessProcessCount ?? 0
					}),
					(metrics.warningCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
						label: "Warnings",
						value: metrics.warningCount,
						tone: "error"
					}) : null
				] }), /* @__PURE__ */ jsx(EvidenceChips, { m: metrics })]
			}) : null,
			q.data?.explanation?.text ? /* @__PURE__ */ jsxs("section", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-5 border-l-2 border-iris-brand max-w-4xl",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
						children: "Deterministic explanation"
					}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: q.data.explanation.confidence })]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-foreground/90 whitespace-pre-wrap text-pretty",
					children: q.data.explanation.text
				})]
			}) : null,
			Object.keys(settings).length > 0 ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("h2", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3",
				children: [
					"Settings (",
					Object.keys(settings).length,
					")"
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "bg-card ring-1 ring-black/5 rounded-lg overflow-hidden",
				children: /* @__PURE__ */ jsx("ul", {
					className: "divide-y",
					children: Object.entries(settings).map(([k, v]) => /* @__PURE__ */ jsxs("li", {
						className: "grid grid-cols-[1fr_2fr] gap-4 px-4 py-2 text-xs",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-muted-foreground truncate",
							children: k
						}), /* @__PURE__ */ jsx("span", {
							className: "font-mono break-all",
							children: typeof v === "object" ? JSON.stringify(v) : String(v)
						})]
					}, k))
				})
			})] }) : null,
			/* @__PURE__ */ jsx(EntitySection, {
				title: "Connections",
				items: q.data?.connections ?? [],
				explanations: q.data?.connectionExplanations ?? [],
				matchKey: (cn) => `${cn.from}|${cn.to}|${cn.kind ?? ""}`,
				explKey: (e) => `${e.from}|${e.to}|${e.kind ?? ""}`,
				renderItem: (cn) => /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-3 text-xs",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-mono truncate",
							children: cn.from
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: "→"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "font-mono truncate",
							children: cn.to
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-[10px] uppercase font-mono bg-muted rounded px-1.5 py-0.5",
							children: cn.kind ?? "—"
						}),
						/* @__PURE__ */ jsx(ConfidenceBadge, { confidence: cn.confidence })
					]
				})
			}),
			/* @__PURE__ */ jsx(EntitySection, {
				title: "Message signatures",
				items: q.data?.messageTypes ?? [],
				explanations: q.data?.messageTypeExplanations ?? [],
				matchKey: (t) => `${t.method ?? ""}|${t.direction ?? ""}|${t.messageClass ?? ""}`,
				explKey: (e) => `${e.method ?? ""}|${e.direction ?? ""}|${e.messageClass ?? ""}`,
				renderItem: (t) => /* @__PURE__ */ jsxs("div", {
					className: "text-[11px] font-mono flex items-center gap-3",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: [
							"[",
							t.direction ?? "—",
							"]"
						]
					}), /* @__PURE__ */ jsxs("span", { children: [
						t.method,
						" · ",
						t.messageClass
					] })]
				})
			}),
			/* @__PURE__ */ jsx(EntitySection, {
				title: "External systems",
				items: q.data?.externalSystems ?? [],
				explanations: q.data?.externalSystemExplanations ?? [],
				matchKey: (s) => `${s.kind ?? ""}|${s.value ?? ""}`,
				explKey: (e) => `${e.kind ?? ""}|${e.value ?? ""}`,
				renderItem: (s) => /* @__PURE__ */ jsxs("div", {
					className: "text-[11px] font-mono break-all",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "text-muted-foreground",
							children: [s.kind, ":"]
						}),
						" ",
						s.value
					]
				})
			}),
			/* @__PURE__ */ jsx(EntitySection, {
				title: "Routing rules",
				items: q.data?.rules ?? [],
				explanations: q.data?.ruleExplanations ?? [],
				matchKey: (r) => r.name ?? "",
				explKey: (e) => e.name ?? "",
				renderItem: (r) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm font-semibold truncate",
						children: r.name
					}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: r.confidence })]
				})
			}),
			/* @__PURE__ */ jsx(EntitySection, {
				title: "DTL transformations",
				items: q.data?.transformations ?? [],
				explanations: q.data?.transformationExplanations ?? [],
				matchKey: (t) => t.name ?? "",
				explKey: (e) => e.name ?? "",
				renderItem: (t) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-sm font-semibold truncate",
					children: t.name
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-[10px] font-mono text-muted-foreground truncate",
					children: [
						t.sourceClass ?? "?",
						" → ",
						t.targetClass ?? "?"
					]
				})] })
			}),
			/* @__PURE__ */ jsx(EntitySection, {
				title: "BPL processes",
				items: q.data?.businessProcesses ?? [],
				explanations: q.data?.businessProcessExplanations ?? [],
				matchKey: (p) => p.name ?? "",
				explKey: (e) => e.name ?? "",
				renderItem: (p) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-sm font-semibold truncate",
					children: p.name
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-[10px] font-mono text-muted-foreground truncate",
					children: [
						p.requestClass ?? "?",
						" → ",
						p.responseClass ?? "?"
					]
				})] })
			}),
			q.data?.warnings && q.data.warnings.length > 0 ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2",
				children: "Warnings"
			}), /* @__PURE__ */ jsx("ul", {
				className: "space-y-1",
				children: q.data.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", {
					className: "text-[11px] font-mono text-status-inferred",
					children: [
						"[",
						w.code,
						"] ",
						w.message
					]
				}, i))
			})] }) : null
		] }) : null
	})] });
}
function EntitySection({ title, items, explanations, matchKey, explKey, renderItem }) {
	if (items.length === 0) return null;
	const map = new Map(explanations.map((e) => [explKey(e), e]));
	return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("h2", {
		className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3",
		children: [
			title,
			" (",
			items.length,
			")"
		]
	}), /* @__PURE__ */ jsx("ul", {
		className: "space-y-2",
		children: items.map((it, i) => {
			const ex = map.get(matchKey(it));
			return /* @__PURE__ */ jsxs("li", {
				className: "bg-card ring-1 ring-black/5 rounded-lg px-4 py-3",
				children: [renderItem(it), ex?.text ? /* @__PURE__ */ jsxs("div", {
					className: "mt-2 pt-2 border-t border-border/50 flex items-start gap-2",
					children: [/* @__PURE__ */ jsx(ConfidenceDot, { confidence: ex.confidence ?? "unknown" }), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-foreground/80 whitespace-pre-wrap text-pretty leading-relaxed",
						children: ex.text
					})]
				}) : null]
			}, i);
		})
	})] });
}
function Meta({ label, value, mono }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "p-3 bg-card ring-1 ring-black/5 rounded-lg",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-1",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: `text-xs truncate ${mono ? "font-mono" : ""}`,
			title: value,
			children: value
		})]
	});
}
//#endregion
export { ComponentDetailPage as component };
