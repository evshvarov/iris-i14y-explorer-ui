import { a as Skeleton, n as apiFetch, o as cn } from "./api-config-BqoIDxBb.js";
import { t as Button } from "./button-BwAtE8PJ.js";
import { t as Input } from "./input-DI6UcbvY.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { n as MetricChip, r as MetricChips } from "./summary-bits-umgxy3aN.js";
import * as React from "react";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, CheckCircle2, ChevronDown, ChevronUp, RefreshCw, Search, Zap } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
//#region src/components/ui/select.tsx
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
		/* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ jsx(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
}));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
//#region src/routes/metrics.tsx?tsr-split=component
function MetricsPage() {
	const [period, setPeriod] = useState("current");
	const [namespace, setNamespace] = useState("");
	const [q, setQ] = useState("");
	const [limit, setLimit] = useState(200);
	const range = useQuery({
		queryKey: [
			"monitor",
			"interop",
			"range",
			period
		],
		queryFn: () => apiFetch(`/monitor/interop/range?period=${encodeURIComponent(period)}`),
		retry: 0
	});
	const volume = useQuery({
		queryKey: [
			"monitor",
			"interop",
			"volume",
			period,
			namespace
		],
		queryFn: () => {
			const params = new URLSearchParams({ period });
			if (namespace.trim()) params.set("namespace", namespace.trim());
			return apiFetch(`/monitor/interop/volume?${params}`);
		},
		retry: 0
	});
	const metrics = useQuery({
		queryKey: [
			"monitor",
			"metrics",
			"interop",
			limit
		],
		queryFn: () => apiFetch(`/monitor/metrics/interop?limit=${limit}`),
		retry: 0
	});
	const enableMutation = useMutation({
		mutationFn: async () => {
			const params = new URLSearchParams();
			if (namespace.trim()) params.set("namespace", namespace.trim());
			const qs = params.toString();
			return apiFetch(`/monitor/metrics/interop/enable${qs ? `?${qs}` : ""}`, { method: "POST" });
		},
		onSuccess: () => {
			metrics.refetch();
			range.refetch();
			volume.refetch();
		}
	});
	const anyLoading = range.isFetching || volume.isFetching || metrics.isFetching;
	const refetch = () => {
		range.refetch();
		volume.refetch();
		metrics.refetch();
	};
	const filteredMetrics = useMemo(() => {
		const samples = metrics.data?.samples ?? [];
		const term = q.trim().toLowerCase();
		if (!term) return samples;
		return samples.filter((s) => {
			if (s.name.toLowerCase().includes(term)) return true;
			for (const [k, v] of Object.entries(s.labels ?? {})) if (k.toLowerCase().includes(term) || v.toLowerCase().includes(term)) return true;
			return false;
		});
	}, [metrics.data, q]);
	const allWarnings = [
		...range.data?.warnings ?? [],
		...volume.data?.warnings ?? [],
		...metrics.data?.warnings ?? []
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: "Monitor" }],
		title: "Metrics",
		status: {
			label: anyLoading ? "Fetching" : "Live",
			tone: "observed"
		},
		actions: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ jsxs(Select, {
					value: period,
					onValueChange: (v) => setPeriod(v),
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						className: "h-8 w-[140px] text-xs font-mono",
						children: /* @__PURE__ */ jsx(SelectValue, {})
					}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
						value: "current",
						children: "current"
					}), /* @__PURE__ */ jsx(SelectItem, {
						value: "historical",
						children: "historical"
					})] })]
				}),
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => enableMutation.mutate(),
					disabled: enableMutation.isPending,
					className: "h-8",
					title: namespace.trim() ? `POST /monitor/metrics/interop/enable?namespace=${namespace.trim()}` : "POST /monitor/metrics/interop/enable",
					children: [enableMutation.isSuccess ? /* @__PURE__ */ jsx(CheckCircle2, { className: "size-3.5 mr-1.5 text-brand" }) : /* @__PURE__ */ jsx(Zap, { className: `size-3.5 mr-1.5 ${enableMutation.isPending ? "animate-pulse" : ""}` }), enableMutation.isPending ? "Enabling…" : "Enable metrics"]
				}),
				/* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: refetch,
					disabled: anyLoading,
					className: "h-8",
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: `size-3.5 mr-1.5 ${anyLoading ? "animate-spin" : ""}` }), "Refresh"]
				})
			]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 space-y-8",
		children: [
			allWarnings.length > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-status-inferred/30 bg-status-inferred/5 p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 text-status-inferred" }), /* @__PURE__ */ jsxs("span", {
						className: "text-[10px] font-semibold uppercase tracking-widest text-status-inferred",
						children: [
							allWarnings.length,
							" warning",
							allWarnings.length === 1 ? "" : "s"
						]
					})]
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-1 text-xs font-mono",
					children: allWarnings.map((w, i) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-status-inferred",
						children: w.code
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: [" — ", w.message]
					})] }, i))
				})]
			}) : null,
			enableMutation.isSuccess ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-brand/30 bg-brand/5 p-4 flex items-start gap-3",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "size-4 text-brand mt-0.5" }), /* @__PURE__ */ jsxs("div", {
					className: "flex-1 text-xs font-mono",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[10px] font-semibold uppercase tracking-widest text-brand mb-1",
						children: "Metrics enable requested"
					}), /* @__PURE__ */ jsx("pre", {
						className: "whitespace-pre-wrap break-all text-muted-foreground",
						children: JSON.stringify(enableMutation.data, null, 2)
					})]
				})]
			}) : null,
			enableMutation.isError ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3",
				children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 text-destructive mt-0.5" }), /* @__PURE__ */ jsxs("div", {
					className: "flex-1 text-xs font-mono",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[10px] font-semibold uppercase tracking-widest text-destructive mb-1",
						children: "Enable failed"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-muted-foreground break-all",
						children: enableMutation.error?.message
					})]
				})]
			}) : null,
			/* @__PURE__ */ jsx(Section, {
				title: "Interop range",
				endpoint: "GET /monitor/interop/range",
				loading: range.isLoading,
				error: range.error,
				children: range.data ? /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-3",
					children: [/* @__PURE__ */ jsxs(MetricChips, { children: [
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Namespace",
							value: range.data.namespace ?? "—",
							tone: "brand"
						}),
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Period",
							value: range.data.period ?? period
						}),
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Start",
							value: range.data.startDate ?? "—",
							tone: "observed"
						}),
						/* @__PURE__ */ jsx(MetricChip, {
							label: "End",
							value: range.data.endDate ?? "—",
							tone: "observed"
						}),
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Samples",
							value: range.data.sampleCount ?? range.data.samples?.length ?? 0
						})
					] }), range.data.samples && range.data.samples.length > 0 ? /* @__PURE__ */ jsx(SampleTable, {
						samples: range.data.samples,
						compact: true
					}) : null]
				}) : null
			}),
			/* @__PURE__ */ jsx(Section, {
				title: "Interop volume",
				endpoint: "GET /monitor/interop/volume",
				loading: volume.isLoading,
				error: volume.error,
				extra: /* @__PURE__ */ jsx("div", {
					className: "relative w-56",
					children: /* @__PURE__ */ jsx(Input, {
						value: namespace,
						onChange: (e) => setNamespace(e.target.value),
						placeholder: "namespace (blank = current, * = all)",
						className: "h-8 font-mono text-xs bg-card"
					})
				}),
				children: volume.data ? /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-5 space-y-3",
					children: [/* @__PURE__ */ jsxs(MetricChips, { children: [
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Namespace",
							value: volume.data.namespace ?? "—",
							tone: "brand"
						}),
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Filter",
							value: volume.data.namespaceFilter ?? "—"
						}),
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Period",
							value: volume.data.period ?? period
						}),
						/* @__PURE__ */ jsx(MetricChip, {
							label: "Samples",
							value: volume.data.sampleCount ?? volume.data.samples?.length ?? 0
						})
					] }), volume.data.samples && volume.data.samples.length > 0 ? /* @__PURE__ */ jsx(SampleTable, { samples: volume.data.samples }) : /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground font-mono",
						children: "No volume samples returned."
					})]
				}) : null
			}),
			/* @__PURE__ */ jsx(Section, {
				title: "Interop OpenMetrics samples",
				endpoint: "GET /monitor/metrics/interop",
				loading: metrics.isLoading,
				error: metrics.error,
				extra: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative w-64",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Filter name or label…",
							className: "pl-9 h-8 font-mono text-xs bg-card"
						})]
					}), /* @__PURE__ */ jsxs(Select, {
						value: String(limit),
						onValueChange: (v) => setLimit(Number(v)),
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							className: "h-8 w-[110px] text-xs font-mono",
							children: /* @__PURE__ */ jsx(SelectValue, {})
						}), /* @__PURE__ */ jsx(SelectContent, { children: [
							50,
							100,
							200,
							500,
							1e3
						].map((n) => /* @__PURE__ */ jsxs(SelectItem, {
							value: String(n),
							children: ["limit ", n]
						}, n)) })]
					})]
				}),
				children: metrics.data ? /* @__PURE__ */ jsxs("div", {
					className: "bg-card ring-1 ring-black/5 rounded-lg overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-4 px-5 py-3 border-b bg-muted/20 text-[11px] font-mono text-muted-foreground",
						children: [
							/* @__PURE__ */ jsxs("span", { children: [
								"namespace:",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-foreground",
									children: metrics.data.namespace ?? "—"
								})
							] }),
							/* @__PURE__ */ jsxs("span", { children: [
								"source:",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-foreground",
									children: metrics.data.source ?? "—"
								})
							] }),
							/* @__PURE__ */ jsxs("span", { children: [
								"samples:",
								" ",
								/* @__PURE__ */ jsxs("span", {
									className: "text-foreground",
									children: [
										filteredMetrics.length,
										" /",
										" ",
										metrics.data.sampleCount ?? metrics.data.samples?.length ?? 0
									]
								})
							] })
						]
					}), /* @__PURE__ */ jsx(SampleTable, {
						samples: filteredMetrics,
						scroll: true
					})]
				}) : null
			}),
			(() => {
				const evidence = [
					...range.data?.evidence ?? [],
					...volume.data?.evidence ?? [],
					...metrics.data?.evidence ?? []
				];
				if (evidence.length === 0) return null;
				return /* @__PURE__ */ jsxs("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
						children: ["Evidence · ", evidence.length]
					}), /* @__PURE__ */ jsx("div", {
						className: "bg-card ring-1 ring-black/5 rounded-lg overflow-hidden",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-xs font-mono",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "text-left px-4 py-2",
										children: "Type"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "text-left px-4 py-2",
										children: "Source"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "text-left px-4 py-2",
										children: "Component"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "text-left px-4 py-2",
										children: "Field"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "text-left px-4 py-2",
										children: "Value"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "text-left px-4 py-2",
										children: "Confidence"
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y",
								children: evidence.slice(0, 200).map((e, i) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2",
											children: e.type ?? "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2 text-muted-foreground",
											children: e.source ?? "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2",
											children: e.component ?? "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2",
											children: e.field ?? "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2 break-all",
											children: e.value ?? "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2 uppercase text-[10px]",
											children: e.confidence ?? "—"
										})
									]
								}, i))
							})]
						})
					})]
				});
			})()
		]
	})] });
}
function Section({ title, endpoint, loading, error, extra, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-4 flex-wrap",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
				children: title
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground font-mono mt-0.5",
				children: endpoint
			})] }), extra]
		}), loading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-32 rounded-lg" }) : error ? /* @__PURE__ */ jsx(ErrorBox, { err: error }) : children]
	});
}
function SampleTable({ samples, compact, scroll }) {
	if (!samples || samples.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "text-xs text-muted-foreground font-mono",
		children: "No samples."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: scroll ? "max-h-[600px] overflow-auto" : "",
		children: [/* @__PURE__ */ jsxs("table", {
			className: "w-full text-xs font-mono",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "bg-muted/20 text-[10px] uppercase tracking-widest text-muted-foreground sticky top-0",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "text-left px-4 py-2",
						children: "Metric"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "text-left px-4 py-2",
						children: "Labels"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "text-right px-4 py-2 w-[140px]",
						children: "Value"
					})
				] })
			}), /* @__PURE__ */ jsx("tbody", {
				className: "divide-y",
				children: samples.slice(0, compact ? 20 : 500).map((s, i) => /* @__PURE__ */ jsxs("tr", {
					className: "hover:bg-muted/30",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "px-4 py-1.5 align-top",
							children: /* @__PURE__ */ jsx("div", {
								className: "truncate",
								children: s.name
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-4 py-1.5 align-top",
							children: /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-1",
								children: Object.entries(s.labels ?? {}).map(([k, v]) => /* @__PURE__ */ jsxs("span", {
									className: "text-[10px] px-1.5 py-0.5 rounded ring-1 ring-black/10 bg-muted/60",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground",
										children: [k, "="]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-foreground/90",
										children: v
									})]
								}, k))
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-4 py-1.5 text-right tabular-nums align-top",
							children: s.numeric && typeof s.numericValue === "number" ? formatValue(s.numericValue) : s.value
						})
					]
				}, i))
			})]
		}), samples.length > (compact ? 20 : 500) ? /* @__PURE__ */ jsxs("div", {
			className: "px-4 py-2 text-[10px] font-mono uppercase text-muted-foreground text-center",
			children: [
				"…",
				samples.length - (compact ? 20 : 500),
				" more"
			]
		}) : null]
	});
}
function formatValue(v) {
	if (!Number.isFinite(v)) return String(v);
	if (Math.abs(v) >= 1e6) return v.toExponential(3);
	if (Number.isInteger(v)) return v.toLocaleString();
	return v.toFixed(3);
}
function ErrorBox({ err }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "p-4 rounded-lg border border-destructive/30 bg-destructive/5",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-sm font-semibold text-destructive mb-1",
			children: "Monitor request failed"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs font-mono text-destructive/80 break-all",
			children: err.message
		})]
	});
}
//#endregion
export { MetricsPage as component };
