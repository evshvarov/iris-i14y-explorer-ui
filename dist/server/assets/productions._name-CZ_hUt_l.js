import { n as cn, t as Skeleton } from "./skeleton-Ctfakequ.js";
import { t as Route } from "./productions._name-BpRDCmAf.js";
import { r as apiFetch, t as PageHeader } from "./page-header-DYAysbwo.js";
import { n as ConfidenceDot, t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { t as LogsPanel } from "./logs-panel-DkVfc1Ei.js";
import { i as SummaryBullets, n as MetricChip, r as MetricChips, t as EvidenceChips } from "./summary-bits-umgxy3aN.js";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MessageSquareText, Play, RefreshCw, Square } from "lucide-react";
import { toast } from "sonner";
import * as TabsPrimitive from "@radix-ui/react-tabs";
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
	const { name } = Route.useParams();
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
				defaultValue: "overview",
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
//#endregion
export { ProductionDetailPage as component };
