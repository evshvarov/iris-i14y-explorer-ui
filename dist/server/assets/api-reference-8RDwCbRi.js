import { a as Skeleton, n as apiFetch } from "./api-config-BqoIDxBb.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
//#region src/routes/api-reference.tsx?tsr-split=component
var METHOD_COLORS = {
	get: "text-status-observed border-status-observed/30 bg-status-observed/10",
	post: "text-status-confirmed border-status-confirmed/30 bg-status-confirmed/10",
	put: "text-status-inferred border-status-inferred/30 bg-status-inferred/10",
	delete: "text-destructive border-destructive/30 bg-destructive/10"
};
function ApiReferencePage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["spec"],
		queryFn: () => apiFetch("/_spec"),
		retry: 0
	});
	const endpoints = useMemo(() => {
		if (!data?.paths) return [];
		const rows = [];
		for (const [path, methods] of Object.entries(data.paths)) for (const [method, op] of Object.entries(methods)) rows.push({
			path,
			method,
			op
		});
		return rows;
	}, [data]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: "Module" }],
		title: "API Reference",
		status: data?.info?.version ? {
			label: `v${data.info.version}`,
			tone: "observed"
		} : void 0
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 space-y-6 max-w-5xl",
		children: [data?.info ? /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-semibold",
				children: data.info.title
			}),
			data.info.description ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: data.info.description
			}) : null,
			data.basePath ? /* @__PURE__ */ jsxs("p", {
				className: "text-[11px] font-mono text-muted-foreground mt-2",
				children: ["Base path: ", /* @__PURE__ */ jsx("span", {
					className: "text-foreground/80",
					children: data.basePath
				})]
			}) : null
		] }) : null, isLoading ? /* @__PURE__ */ jsx("div", {
			className: "space-y-2",
			children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14 rounded-lg" }, i))
		}) : error ? /* @__PURE__ */ jsxs("div", {
			className: "p-4 rounded-lg border border-destructive/30 bg-destructive/5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-sm font-semibold text-destructive mb-1",
				children: "Failed to load /_spec"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs font-mono text-destructive/80 break-all",
				children: error.message
			})]
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-2",
			children: endpoints.map((e) => /* @__PURE__ */ jsx(EndpointRow, { ...e }, `${e.method} ${e.path}`))
		})]
	})] });
}
function EndpointRow({ path, method, op }) {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-card ring-1 ring-black/5 rounded-lg overflow-hidden",
		children: [/* @__PURE__ */ jsxs("button", {
			onClick: () => setOpen((v) => !v),
			className: "w-full flex items-center gap-4 p-4 text-left hover:bg-muted/40 transition-colors",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: `text-[10px] font-mono font-bold px-2 py-1 rounded border uppercase ${METHOD_COLORS[method.toLowerCase()] ?? "text-foreground border-border bg-muted"}`,
					children: method
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-sm font-mono truncate flex-1",
					children: path
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-xs text-muted-foreground truncate hidden md:block",
					children: op.summary
				}),
				/* @__PURE__ */ jsx(ChevronDown, { className: `size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })
			]
		}), open ? /* @__PURE__ */ jsxs("div", {
			className: "border-t p-4 space-y-4 bg-muted/20",
			children: [
				op.operationId ? /* @__PURE__ */ jsx(Detail, {
					label: "Operation ID",
					value: op.operationId,
					mono: true
				}) : null,
				op.parameters && op.parameters.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2",
					children: "Parameters"
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-1",
					children: op.parameters.map((p) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 text-[11px] font-mono",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-foreground/90",
								children: p.name
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: ["in ", p.in]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground",
								children: p.type
							}),
							p.required ? /* @__PURE__ */ jsx("span", {
								className: "text-status-inferred text-[9px] uppercase",
								children: "required"
							}) : null
						]
					}, p.name))
				})] }) : null,
				op.responses ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2",
					children: "Responses"
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-1",
					children: Object.entries(op.responses).map(([code, r]) => /* @__PURE__ */ jsxs("div", {
						className: "text-[11px] font-mono flex gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-foreground/90",
							children: code
						}), /* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: r.description
						})]
					}, code))
				})] }) : null
			]
		}) : null]
	});
}
function Detail({ label, value, mono }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1",
		children: label
	}), /* @__PURE__ */ jsx("div", {
		className: `text-[11px] ${mono ? "font-mono" : ""}`,
		children: value
	})] });
}
//#endregion
export { ApiReferencePage as component };
