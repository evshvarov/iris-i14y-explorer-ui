import { n as cn, t as Skeleton } from "./skeleton-Ctfakequ.js";
import { t as Route } from "./messages._id-Dr5G8sB4.js";
import { r as apiFetch, t as PageHeader } from "./page-header-DYAysbwo.js";
import { n as ConfidenceDot, t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { n as MetricChip, r as MetricChips, t as EvidenceChips } from "./summary-bits-umgxy3aN.js";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, EyeOff, Info, Lock, Send } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
//#region src/components/ui/popover.tsx
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(PopoverPrimitive.Content, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
//#endregion
//#region src/components/evidence-popover.tsx
var toneClass = {
	confirmed: "text-status-confirmed",
	observed: "text-status-observed",
	inferred: "text-status-inferred",
	unknown: "text-status-unknown"
};
function toConfidence(v) {
	return v in toneClass ? v : "unknown";
}
function EvidencePopover({ confidence, evidence, variant = "badge", label, align = "end" }) {
	const rows = evidence ?? [];
	const has = rows.length > 0;
	const trigger = variant === "dot" ? /* @__PURE__ */ jsx("button", {
		type: "button",
		className: "inline-flex items-center focus:outline-none focus:ring-2 focus:ring-iris-brand/40 rounded-full",
		"aria-label": `Evidence: ${confidence ?? "unknown"}`,
		children: /* @__PURE__ */ jsx(ConfidenceDot, { confidence: toConfidence(confidence) })
	}) : /* @__PURE__ */ jsxs("button", {
		type: "button",
		className: "inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-iris-brand/40 rounded",
		"aria-label": `Evidence: ${confidence ?? "unknown"}`,
		children: [/* @__PURE__ */ jsx(ConfidenceBadge, { confidence }), has ? /* @__PURE__ */ jsx(Info, { className: "size-3 text-muted-foreground" }) : null]
	});
	if (!has) return trigger;
	return /* @__PURE__ */ jsxs(Popover, { children: [/* @__PURE__ */ jsx(PopoverTrigger, {
		asChild: true,
		children: trigger
	}), /* @__PURE__ */ jsxs(PopoverContent, {
		align,
		className: "w-[min(28rem,95vw)] p-0 bg-card ring-1 ring-black/10 shadow-lg",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between px-4 py-2.5 border-b bg-muted/40",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
				children: ["Evidence ", label ? `· ${label}` : ""]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] font-mono uppercase text-muted-foreground",
					children: rows.length
				}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence })]
			})]
		}), /* @__PURE__ */ jsx("ul", {
			className: "divide-y max-h-80 overflow-auto",
			children: rows.map((e, i) => /* @__PURE__ */ jsxs("li", {
				className: "px-4 py-2.5 text-[11px] font-mono space-y-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-foreground font-semibold truncate",
						children: e.type ?? "—"
					}), /* @__PURE__ */ jsx("span", {
						className: `uppercase text-[9px] ${toneClass[toConfidence(e.confidence)]}`,
						children: e.confidence ?? "unknown"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-[64px_1fr] gap-x-2 gap-y-0.5 text-muted-foreground",
					children: [
						e.source ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-[9px] uppercase tracking-widest",
							children: "source"
						}), /* @__PURE__ */ jsx("span", {
							className: "truncate text-foreground/80",
							title: e.source,
							children: e.source
						})] }) : null,
						e.component ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-[9px] uppercase tracking-widest",
							children: "component"
						}), /* @__PURE__ */ jsx("span", {
							className: "truncate text-foreground/80",
							title: e.component,
							children: e.component
						})] }) : null,
						e.field ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-[9px] uppercase tracking-widest",
							children: "field"
						}), /* @__PURE__ */ jsx("span", {
							className: "truncate text-foreground/80",
							title: e.field,
							children: e.field
						})] }) : null,
						e.value ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-[9px] uppercase tracking-widest",
							children: "value"
						}), /* @__PURE__ */ jsx("span", {
							className: "truncate text-foreground/80 whitespace-pre-wrap break-all",
							title: e.value,
							children: e.value
						})] }) : null
					]
				})]
			}, i))
		})]
	})] });
}
//#endregion
//#region src/routes/messages.$id.tsx?tsr-split=component
function MessageDetailPage() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const detail = useQuery({
		queryKey: ["message", id],
		queryFn: () => apiFetch(`/messages/${encodeURIComponent(id)}`),
		retry: 0
	});
	const trace = useQuery({
		queryKey: [
			"message",
			id,
			"trace"
		],
		queryFn: () => apiFetch(`/messages/${encodeURIComponent(id)}/trace`),
		retry: 0
	});
	const payload = useQuery({
		queryKey: [
			"message",
			id,
			"payload"
		],
		queryFn: () => apiFetch(`/messages/${encodeURIComponent(id)}/payload`),
		retry: 0
	});
	const preview = useQuery({
		queryKey: [
			"message",
			id,
			"payload",
			"preview"
		],
		queryFn: () => apiFetch(`/messages/${encodeURIComponent(id)}/payload/preview`),
		retry: 0
	});
	const explain = useQuery({
		queryKey: [
			"message",
			id,
			"explanation"
		],
		queryFn: () => apiFetch(`/messages/${encodeURIComponent(id)}/explanation`),
		retry: 0
	});
	const productionName = trace.data?.productionName;
	const session = useQuery({
		queryKey: [
			"message",
			id,
			"session",
			productionName
		],
		queryFn: () => apiFetch(`/productions/${encodeURIComponent(productionName)}/messages/${encodeURIComponent(id)}/session`),
		retry: 0,
		enabled: !!productionName
	});
	const resend = useMutation({
		mutationFn: () => apiFetch(`/productions/${encodeURIComponent(productionName)}/messages/${encodeURIComponent(id)}/resend`, { method: "POST" }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["message", id] });
		}
	});
	const m = detail.data?.message;
	const overview = trace.data?.traceOverview;
	const explanation = trace.data?.traceExplanation;
	const steps = trace.data?.steps ?? [];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: "Messages" }],
		title: `#${id}`,
		status: m ? {
			label: m.status ?? "unknown",
			tone: m.isError ? "inferred" : "confirmed"
		} : void 0,
		actions: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [productionName ? /* @__PURE__ */ jsxs("button", {
				onClick: () => resend.mutate(),
				disabled: resend.isPending,
				className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted disabled:opacity-50",
				title: `Resend via ${productionName}`,
				children: [/* @__PURE__ */ jsx(Send, { className: "size-3.5" }), resend.isPending ? "Resending…" : "Resend"]
			}) : null, /* @__PURE__ */ jsxs(Link, {
				to: "/messages",
				className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted",
				children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }), " Messages"]
			})]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 space-y-8",
		children: [
			detail.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-24 rounded-lg" }) : detail.error ? /* @__PURE__ */ jsx(ErrorPanel, {
				error: detail.error,
				label: "message"
			}) : m ? /* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsx(Meta, {
						label: "Session",
						value: String(m.sessionId ?? "—"),
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Type",
						value: m.type ?? "—"
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Body class",
						value: m.messageBodyClassName ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Created",
						value: m.timeCreated ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Source",
						value: m.sourceConfigName ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Target",
						value: m.targetConfigName ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Invocation",
						value: m.invocation ?? "—"
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Corresponds to",
						value: m.correspondingMessageId ? `#${m.correspondingMessageId}` : "—",
						mono: true
					})
				]
			}) : null,
			payload.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-24 rounded-lg" }) : payload.data ? /* @__PURE__ */ jsx(PayloadPanel, { data: payload.data }) : null,
			preview.data ? /* @__PURE__ */ jsx(PayloadPreviewPanel, { data: preview.data }) : null,
			resend.data ? /* @__PURE__ */ jsx(ResendResultPanel, { data: resend.data }) : null,
			resend.error ? /* @__PURE__ */ jsx(ErrorPanel, {
				error: resend.error,
				label: "resend"
			}) : null,
			session.data ? /* @__PURE__ */ jsx(SessionSummaryPanel, { data: session.data }) : null,
			explain.data?.explanation?.text || explain.data?.summary ? /* @__PURE__ */ jsxs("section", {
				className: "bg-card ring-1 ring-black/5 rounded-lg p-5 border-l-2 border-iris-brand",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
							children: "Message explanation"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [typeof explain.data.stepCount === "number" ? /* @__PURE__ */ jsxs("span", {
								className: "text-[10px] font-mono uppercase text-muted-foreground bg-muted rounded px-1.5 py-0.5",
								children: [explain.data.stepCount, " steps"]
							}) : null, /* @__PURE__ */ jsx(EvidencePopover, {
								confidence: explain.data.confidence ?? explain.data.explanation?.confidence,
								evidence: explain.data.evidence ?? explain.data.explanation?.evidence,
								label: "message explanation"
							})]
						})]
					}),
					explain.data.summary ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-foreground/90 whitespace-pre-wrap text-pretty mb-2",
						children: explain.data.summary
					}) : null,
					explain.data.explanation?.text ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-foreground/80 whitespace-pre-wrap text-pretty",
						children: explain.data.explanation.text
					}) : null
				]
			}) : null,
			trace.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-32 rounded-lg" }) : trace.error ? /* @__PURE__ */ jsx(ErrorPanel, {
				error: trace.error,
				label: "trace"
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
				trace.data?.summary ? /* @__PURE__ */ jsxs("section", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
							children: "Trace summary"
						}), /* @__PURE__ */ jsx(EvidencePopover, {
							confidence: trace.data.confidence,
							evidence: trace.data.evidence,
							label: "trace summary"
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-foreground/90 whitespace-pre-wrap text-pretty",
						children: trace.data.summary
					})]
				}) : null,
				overview ? /* @__PURE__ */ jsxs("section", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsx(Meta, {
							label: "Steps",
							value: String(overview.stepCount ?? steps.length)
						}),
						/* @__PURE__ */ jsx(Meta, {
							label: "Errors",
							value: String(overview.errorCount ?? 0)
						}),
						/* @__PURE__ */ jsx(Meta, {
							label: "Origin",
							value: overview.origin ?? "—",
							mono: true
						}),
						/* @__PURE__ */ jsx(Meta, {
							label: "Final target",
							value: overview.finalTarget ?? "—",
							mono: true
						}),
						/* @__PURE__ */ jsx(Meta, {
							label: "First seen",
							value: overview.firstSeen ?? "—",
							mono: true
						}),
						/* @__PURE__ */ jsx(Meta, {
							label: "Last seen",
							value: overview.lastSeen ?? "—",
							mono: true
						}),
						/* @__PURE__ */ jsx(Meta, {
							label: "Path",
							value: overview.path ?? "—",
							mono: true
						}),
						/* @__PURE__ */ jsx(Meta, {
							label: "Participants",
							value: overview.participants?.join(", ") || "—",
							mono: true
						})
					]
				}) : null,
				explanation?.text ? /* @__PURE__ */ jsxs("section", {
					className: "bg-card ring-1 ring-black/5 rounded-lg p-5 border-l-2 border-iris-brand",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
							children: "Deterministic explanation"
						}), /* @__PURE__ */ jsx(EvidencePopover, {
							confidence: explanation.confidence,
							evidence: explanation.evidence,
							label: "trace explanation"
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-foreground/90 whitespace-pre-wrap text-pretty",
						children: explanation.text
					})]
				}) : null,
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-4 flex-wrap gap-3",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
						children: [
							"Steps (",
							steps.length,
							")"
						]
					}), trace.data?.metrics ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ jsxs(MetricChips, { children: [/* @__PURE__ */ jsx(MetricChip, {
							label: "Steps",
							value: trace.data.metrics.stepCount ?? steps.length,
							tone: "brand"
						}), (trace.data.metrics.warningCount ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
							label: "Warnings",
							value: trace.data.metrics.warningCount,
							tone: "error"
						}) : null] }), /* @__PURE__ */ jsx(EvidenceChips, { m: trace.data.metrics })]
					}) : null]
				}), steps.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "text-[11px] text-muted-foreground font-mono border border-dashed rounded-lg p-4",
					children: "No trace steps reconstructed."
				}) : /* @__PURE__ */ jsx("ol", {
					className: "space-y-3",
					children: steps.map((s, i) => /* @__PURE__ */ jsxs("li", {
						className: `bg-card ring-1 ring-black/5 rounded-lg p-4 relative ${s.isError ? "border-l-2 border-destructive" : "border-l-2 border-status-observed"}`,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 mb-2",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-mono bg-muted rounded px-1.5 py-0.5 text-muted-foreground uppercase",
										children: ["#", s.sequence ?? i + 1]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-mono truncate flex-1 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ jsx(ComponentLink, {
												name: s.source,
												productionName
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "→"
											}),
											/* @__PURE__ */ jsx(ComponentLink, {
												name: s.target,
												productionName
											})
										]
									}),
									s.isError ? /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-[10px] font-mono uppercase text-destructive",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "size-3" }), s.status]
									}) : /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono uppercase text-muted-foreground bg-muted rounded px-1.5 py-0.5",
										children: s.status ?? "ok"
									}),
									/* @__PURE__ */ jsx(EvidencePopover, {
										confidence: s.confidence,
										evidence: s.evidence,
										label: `step #${s.sequence ?? i + 1}`
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] font-mono text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("div", { children: s.messageId ? /* @__PURE__ */ jsxs(Link, {
										to: "/messages/$id",
										params: { id: String(s.messageId) },
										className: "hover:text-foreground underline-offset-2 hover:underline",
										children: ["msg #", s.messageId]
									}) : /* @__PURE__ */ jsx(Fragment, { children: "msg —" }) }),
									/* @__PURE__ */ jsx("div", { children: s.invocation ?? "—" }),
									/* @__PURE__ */ jsx("div", {
										className: "truncate col-span-2",
										children: /* @__PURE__ */ jsx(BodyClassLink, {
											className: s.messageBodyClassName,
											productionName
										})
									})
								]
							}),
							s.explanation ? /* @__PURE__ */ jsx("p", {
								className: "mt-3 text-sm text-foreground/90 whitespace-pre-wrap text-pretty",
								children: s.explanation
							}) : null
						]
					}, i))
				})] }),
				trace.data?.warnings && trace.data.warnings.length > 0 ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2",
					children: "Warnings"
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-1",
					children: trace.data.warnings.map((w, i) => /* @__PURE__ */ jsxs("li", {
						className: "text-[11px] font-mono text-status-inferred",
						children: [
							"[",
							w.code,
							"] ",
							w.message
						]
					}, i))
				})] }) : null
			] })
		]
	})] });
}
function ComponentLink({ name, productionName }) {
	if (!name) return /* @__PURE__ */ jsx("span", {
		className: "text-muted-foreground",
		children: "?"
	});
	if (!productionName) return /* @__PURE__ */ jsx("span", {
		className: "truncate",
		title: name,
		children: name
	});
	return /* @__PURE__ */ jsx(Link, {
		to: "/productions/$name/components/$componentName",
		params: {
			name: productionName,
			componentName: name
		},
		className: "truncate underline-offset-2 hover:underline hover:text-iris-brand",
		title: `Open ${name}`,
		children: name
	});
}
function BodyClassLink({ className, productionName }) {
	if (!className) return /* @__PURE__ */ jsx("span", { children: "—" });
	return /* @__PURE__ */ jsx(Link, {
		to: "/messages",
		search: {
			messageBodyClassName: className,
			...productionName ? { productionName } : {}
		},
		className: "truncate underline-offset-2 hover:underline hover:text-foreground",
		title: `Filter messages by ${className}`,
		children: className
	});
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
function PayloadPanel({ data }) {
	const meta = data.metadata;
	const fields = meta?.fields ?? [];
	const restricted = data.restricted || meta?.restricted;
	const supported = data.payloadInspectionSupported ?? meta?.payloadInspectionSupported;
	const enabled = data.payloadInspectionEnabled ?? meta?.payloadInspectionEnabled;
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: "Payload metadata"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [restricted ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1 text-[10px] font-mono uppercase text-status-inferred",
						children: [/* @__PURE__ */ jsx(Lock, { className: "size-3" }), " restricted"]
					}) : null, /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-mono uppercase text-muted-foreground",
						children: supported ? enabled ? "enabled" : "disabled" : "unsupported"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-3",
				children: [
					/* @__PURE__ */ jsx(Meta, {
						label: "Body class",
						value: data.messageBodyClassName ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Body id",
						value: data.messageBodyId ?? "—",
						mono: true
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Body available",
						value: data.bodyReferenceAvailable ? "Yes" : "No"
					}),
					/* @__PURE__ */ jsx(Meta, {
						label: "Fields",
						value: String(fields.length)
					})
				]
			}),
			data.restrictionReason ? /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-mono text-status-inferred mb-3",
				children: data.restrictionReason
			}) : null,
			fields.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "ring-1 ring-black/5 rounded overflow-hidden",
				children: /* @__PURE__ */ jsx("ul", {
					className: "divide-y bg-background/40",
					children: fields.map((f, i) => {
						const name = String(f.name ?? f.property ?? `field_${i}`);
						const type = f.type;
						return /* @__PURE__ */ jsxs("li", {
							className: "px-3 py-1.5 text-[11px] font-mono flex justify-between gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: name
							}), /* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground truncate",
								children: type ? String(type) : ""
							})]
						}, i);
					})
				})
			}) : /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-mono text-muted-foreground",
				children: "No field metadata returned."
			})
		]
	});
}
function PayloadPreviewPanel({ data }) {
	const fields = data.fields ?? [];
	const restricted = data.restricted;
	const enabled = data.payloadInspectionEnabled;
	const supported = data.payloadInspectionSupported;
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: "Payload preview"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [restricted ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1 text-[10px] font-mono uppercase text-status-inferred",
						children: [/* @__PURE__ */ jsx(Lock, { className: "size-3" }), " restricted"]
					}) : null, /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-mono uppercase text-muted-foreground",
						children: supported ? enabled ? "enabled" : "disabled" : "unsupported"
					})]
				})]
			}),
			data.restrictionReason ? /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-mono text-status-inferred mb-3",
				children: data.restrictionReason
			}) : null,
			fields.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "ring-1 ring-black/5 rounded overflow-hidden",
				children: /* @__PURE__ */ jsx("ul", {
					className: "divide-y bg-background/40",
					children: fields.map((f, i) => /* @__PURE__ */ jsxs("li", {
						className: "grid grid-cols-[1fr_auto_2fr] items-center gap-3 px-3 py-1.5 text-[11px] font-mono",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: f.name ?? `field_${i}`
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground text-[10px] uppercase bg-muted rounded px-1.5 py-0.5",
								children: f.type ?? "—"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "truncate flex items-center gap-2 justify-end text-foreground/80",
								children: [f.redacted ? /* @__PURE__ */ jsx(EyeOff, { className: "size-3 text-status-inferred shrink-0" }) : null, /* @__PURE__ */ jsx("span", {
									className: "truncate",
									title: f.value ?? "",
									children: f.value ?? ""
								})]
							})
						]
					}, i))
				})
			}) : /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-mono text-muted-foreground",
				children: "No scalar fields returned."
			})
		]
	});
}
function SessionSummaryPanel({ data }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: ["Session summary", data.productionName ? /* @__PURE__ */ jsxs("span", {
						className: "ml-2 text-muted-foreground normal-case font-mono tracking-normal",
						children: ["· ", data.productionName]
					}) : null]
				}), /* @__PURE__ */ jsx(ConfidenceBadge, { confidence: data.confidence })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-3",
				children: [
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "Session",
						value: String(data.sessionId ?? "—")
					}),
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "Steps",
						value: String(data.stepCount ?? 0)
					}),
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "In-prod",
						value: String(data.productionStepCount ?? 0)
					}),
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "Outside",
						value: String(data.outsideProductionStepCount ?? 0)
					}),
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "Errors",
						value: String(data.errorCount ?? 0)
					}),
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "Origin",
						value: data.origin ?? "—"
					}),
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "Final target",
						value: data.finalTarget ?? "—"
					}),
					/* @__PURE__ */ jsx(MetaSmall, {
						label: "Path",
						value: data.path ?? "—"
					})
				]
			}),
			data.text ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-foreground/90 whitespace-pre-wrap text-pretty",
				children: data.text
			}) : null
		]
	});
}
function MetaSmall({ label, value }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5",
		children: label
	}), /* @__PURE__ */ jsx("div", {
		className: "text-xs font-mono truncate",
		title: value,
		children: value
	})] });
}
function ResendResultPanel({ data }) {
	const ok = data.executed || data.allowed;
	return /* @__PURE__ */ jsxs("section", {
		className: `rounded-lg p-4 border ${data.executed ? "border-status-confirmed/40 bg-status-confirmed/5 text-status-confirmed" : ok ? "border-status-observed/40 bg-status-observed/5 text-status-observed" : "border-status-inferred/40 bg-status-inferred/5 text-status-inferred"}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ jsx(Send, { className: "size-3.5" }), /* @__PURE__ */ jsxs("h3", {
					className: "text-[11px] font-semibold uppercase tracking-widest",
					children: ["Resend ", data.executed ? "executed" : data.allowed ? "allowed" : "not executed"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono",
				children: [
					/* @__PURE__ */ jsxs("div", { children: ["action: ", data.action ?? "—"] }),
					/* @__PURE__ */ jsxs("div", { children: ["supported: ", String(data.supported ?? false)] }),
					/* @__PURE__ */ jsxs("div", { children: ["enabled: ", String(data.messageResendEnabled ?? false)] }),
					/* @__PURE__ */ jsxs("div", { children: ["dryRun: ", String(data.dryRun ?? false)] })
				]
			}),
			data.reason || data.statusText ? /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-[11px] font-mono text-foreground/80",
				children: data.statusText ?? data.reason
			}) : null
		]
	});
}
//#endregion
export { MessageDetailPage as component };
