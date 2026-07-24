import { a as Skeleton, n as apiFetch, o as cn } from "./api-config-BqoIDxBb.js";
import { t as Button } from "./button-BwAtE8PJ.js";
import { t as Input } from "./input-DI6UcbvY.js";
import { t as Route } from "./productions._name.components._componentName-BuPkPifj.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { n as ConfidenceDot, t as ConfidenceBadge } from "./confidence-badge-CVsy6qNd.js";
import { i as SummaryBullets, n as MetricChip, r as MetricChips, t as EvidenceChips } from "./summary-bits-umgxy3aN.js";
import { n as Label, t as Switch } from "./switch-CTLX3DG2.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";
//#region src/components/ui/dialog.tsx
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
//#endregion
//#region src/components/ui/textarea.tsx
var Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region src/components/edit-component-dialog.tsx
function componentToRows(c) {
	const s = c?.settings ?? {};
	return Object.entries(s).map(([k, v]) => ({
		key: k,
		value: typeof v === "object" ? JSON.stringify(v) : String(v ?? "")
	}));
}
function EditComponentDialog({ open, onOpenChange, productionName, componentName, component }) {
	const qc = useQueryClient();
	const [enabled, setEnabled] = useState(component?.enabled !== false);
	const [poolSize, setPoolSize] = useState(component?.poolSize != null ? String(component.poolSize) : "");
	const [category, setCategory] = useState(component?.category ?? "");
	const [comment, setComment] = useState(component?.comment ?? "");
	const [rows, setRows] = useState(componentToRows(component));
	useEffect(() => {
		if (!open) return;
		setEnabled(component?.enabled !== false);
		setPoolSize(component?.poolSize != null ? String(component.poolSize) : "");
		setCategory(component?.category ?? "");
		setComment(component?.comment ?? "");
		setRows(componentToRows(component));
	}, [open, component]);
	const initial = component;
	const mut = useMutation({
		mutationFn: async () => {
			const body = {};
			if (initial?.enabled !== false !== enabled) body.enabled = enabled;
			const psNum = poolSize.trim() === "" ? void 0 : Number(poolSize);
			if (psNum !== void 0 && !Number.isNaN(psNum) && psNum !== initial?.poolSize) body.poolSize = psNum;
			if ((category ?? "") !== (initial?.category ?? "")) body.category = category;
			if ((comment ?? "") !== (initial?.comment ?? "")) body.comment = comment;
			const originalSettings = initial?.settings ?? {};
			const nextSettings = {};
			const seen = /* @__PURE__ */ new Set();
			for (const r of rows) {
				const k = r.key.trim();
				if (!k) continue;
				seen.add(k);
				if ((k in originalSettings ? typeof originalSettings[k] === "object" ? JSON.stringify(originalSettings[k]) : String(originalSettings[k] ?? "") : void 0) !== r.value) nextSettings[k] = r.value;
			}
			for (const k of Object.keys(originalSettings)) if (!seen.has(k)) nextSettings[k] = "";
			if (Object.keys(nextSettings).length > 0) body.settings = nextSettings;
			if (Object.keys(body).length === 0) throw new Error("No changes to save");
			return apiFetch(`/productions/${encodeURIComponent(productionName)}/components/${encodeURIComponent(componentName)}/settings`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
		},
		onSuccess: (res) => {
			const attrs = res.updatedAttributes?.length ?? 0;
			const sets = res.updatedSettings?.length ?? 0;
			toast.success(`Updated ${componentName}` + (attrs || sets ? ` — ${attrs} attribute(s), ${sets} setting(s)` : ""));
			qc.invalidateQueries({ queryKey: [
				"component",
				productionName,
				componentName
			] });
			qc.invalidateQueries({ queryKey: ["production", productionName] });
			qc.invalidateQueries({ queryKey: ["productions"] });
			onOpenChange(false);
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-2xl max-h-[85vh] overflow-hidden p-0 gap-0 flex flex-col",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, {
					className: "px-6 py-5 border-b bg-muted/40 space-y-1",
					children: [/* @__PURE__ */ jsx(DialogTitle, {
						className: "text-lg font-semibold text-iris-navy",
						children: "Edit component"
					}), /* @__PURE__ */ jsx(DialogDescription, {
						asChild: true,
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx("span", { children: productionName }),
								/* @__PURE__ */ jsx("svg", {
									className: "size-3 text-muted-foreground/60",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: "2.5",
										d: "M9 5l7 7-7 7"
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-iris-brand",
									children: componentName
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 space-y-8 overflow-y-auto",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-12 gap-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-5 p-4 rounded-lg bg-muted/40 ring-1 ring-black/5 flex flex-col justify-between gap-3",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "edit-enabled",
										className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Status"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-sm font-semibold text-iris-navy",
											children: enabled ? "ENABLED" : "DISABLED"
										}), /* @__PURE__ */ jsx(Switch, {
											id: "edit-enabled",
											checked: enabled,
											onCheckedChange: setEnabled
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-3 p-4 rounded-lg ring-1 ring-black/5 flex flex-col gap-1",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "edit-pool",
										className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Pool size"
									}), /* @__PURE__ */ jsx(Input, {
										id: "edit-pool",
										type: "number",
										min: 0,
										value: poolSize,
										onChange: (e) => setPoolSize(e.target.value),
										className: "border-0 bg-transparent px-0 h-8 text-lg font-mono text-iris-navy shadow-none focus-visible:ring-0"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-4 p-4 rounded-lg ring-1 ring-black/5 flex flex-col gap-1",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "edit-cat",
										className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ jsx(Input, {
										id: "edit-cat",
										value: category,
										onChange: (e) => setCategory(e.target.value),
										placeholder: "inbound, outbound",
										className: "border-0 bg-transparent px-0 h-8 text-sm font-mono text-iris-navy shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "edit-comment",
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1",
								children: "Internal comment"
							}), /* @__PURE__ */ jsx(Textarea, {
								id: "edit-comment",
								value: comment,
								onChange: (e) => setComment(e.target.value),
								rows: 2,
								className: "text-sm text-iris-navy resize-none focus-visible:ring-1 focus-visible:ring-iris-brand",
								placeholder: "Describe the purpose of this component override…"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between px-1",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
											children: "Overridden settings"
										}), /* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground font-mono",
											children: rows.length
										})]
									}), /* @__PURE__ */ jsxs(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										onClick: () => setRows((r) => [...r, {
											key: "",
											value: ""
										}]),
										className: "h-7 gap-1.5 text-[12px] font-semibold text-iris-brand bg-iris-brand/10 hover:bg-iris-brand/20 ring-1 ring-iris-brand/20",
										children: [/* @__PURE__ */ jsx(Plus, { className: "size-3.5" }), " Add parameter"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "ring-1 ring-black/5 rounded-lg overflow-hidden bg-card",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-[1fr_1.6fr_2.5rem] bg-muted/50 border-b",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Key"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Value"
											}),
											/* @__PURE__ */ jsx("div", {})
										]
									}), rows.length === 0 ? /* @__PURE__ */ jsx("div", {
										className: "p-6 text-xs text-muted-foreground text-center",
										children: "No overrides. Add one to shadow a component default."
									}) : /* @__PURE__ */ jsx("div", {
										className: "divide-y",
										children: rows.map((r, i) => /* @__PURE__ */ jsxs("div", {
											className: "group grid grid-cols-[1fr_1.6fr_2.5rem] items-center",
											children: [
												/* @__PURE__ */ jsx("input", {
													value: r.key,
													onChange: (e) => setRows((rs) => rs.map((x, ix) => ix === i ? {
														...x,
														key: e.target.value
													} : x)),
													placeholder: "name",
													className: "px-4 py-3 text-[13px] font-mono font-medium text-iris-navy bg-transparent outline-none focus:bg-muted/40"
												}),
												/* @__PURE__ */ jsx("input", {
													value: r.value,
													onChange: (e) => setRows((rs) => rs.map((x, ix) => ix === i ? {
														...x,
														value: e.target.value
													} : x)),
													placeholder: "value",
													className: "px-4 py-3 text-[13px] font-mono text-iris-brand bg-transparent outline-none focus:bg-muted/40 truncate border-l"
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setRows((rs) => rs.filter((_, ix) => ix !== i)),
													"aria-label": "Remove setting",
													className: "justify-self-center p-1.5 text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition",
													children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
												})
											]
										}, i))
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-muted-foreground italic px-1",
									children: "Removed rows are sent as empty values to clear the override on the server."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs(DialogFooter, {
					className: "px-6 py-4 bg-muted/40 border-t sm:justify-end gap-2",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						onClick: () => onOpenChange(false),
						disabled: mut.isPending,
						children: "Cancel"
					}), /* @__PURE__ */ jsxs(Button, {
						onClick: () => mut.mutate(),
						disabled: mut.isPending,
						className: "gap-2 bg-iris-brand hover:bg-iris-brand/90 text-white shadow-sm",
						children: [mut.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : null, "Save changes"]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/productions.$name.components.$componentName.tsx?tsr-split=component
function ComponentDetailPage() {
	const { name, componentName } = Route.useParams();
	const { fromTab } = Route.useSearch();
	const url = `/productions/${encodeURIComponent(name)}/components/${encodeURIComponent(componentName)}`;
	const [editOpen, setEditOpen] = useState(false);
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(PageHeader, {
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
			actions: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setEditOpen(true),
					disabled: !c,
					className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-iris-brand/30 bg-iris-brand/10 text-iris-brand hover:bg-iris-brand/20 disabled:opacity-50",
					children: [/* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }), " Edit"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/productions/$name",
					params: { name },
					search: { tab: fromTab && fromTab !== "overview" ? fromTab : void 0 },
					className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-3.5" }), " Production"]
				})]
			})
		}),
		/* @__PURE__ */ jsx(EditComponentDialog, {
			open: editOpen,
			onOpenChange: setEditOpen,
			productionName: name,
			componentName,
			component: c
		}),
		/* @__PURE__ */ jsx("div", {
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
		})
	] });
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
