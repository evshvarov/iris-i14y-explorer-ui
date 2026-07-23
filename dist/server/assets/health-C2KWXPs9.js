import { a as Skeleton, n as apiFetch, r as getApiConfig } from "./api-config-BqoIDxBb.js";
import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
//#region src/routes/health.tsx?tsr-split=component
function HealthPage() {
	const { data, error, isLoading, refetch, isFetching } = useQuery({
		queryKey: ["health"],
		queryFn: () => apiFetch("/health"),
		retry: 0
	});
	const caps = useQuery({
		queryKey: ["capabilities"],
		queryFn: () => apiFetch("/capabilities"),
		retry: 0
	});
	const cfg = getApiConfig();
	const ok = !!data && !error;
	const capEntries = caps.data ? Object.entries(caps.data).filter(([k]) => k !== "namespace") : [];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(PageHeader, {
		crumbs: [{ label: "Module" }],
		title: "Health & Capabilities",
		status: isLoading ? void 0 : ok ? {
			label: data?.status ?? "OK",
			tone: "confirmed"
		} : {
			label: "Unreachable",
			tone: "unknown"
		},
		actions: /* @__PURE__ */ jsx("button", {
			onClick: () => {
				refetch();
				caps.refetch();
			},
			disabled: isFetching || caps.isFetching,
			className: "text-xs px-3 py-1.5 rounded-md ring-1 ring-black/5 bg-card hover:bg-muted transition-colors disabled:opacity-50",
			children: isFetching || caps.isFetching ? "Refreshing…" : "Refresh"
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: "p-8 space-y-8",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "grid grid-cols-1 md:grid-cols-4 gap-6",
				children: [
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Base URL",
						value: cfg.baseUrl,
						mono: true
					}),
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Status",
						value: ok ? data?.status ?? "ok" : "error"
					}),
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Version",
						value: String(data?.version ?? "—"),
						mono: true
					}),
					/* @__PURE__ */ jsx(MetaCard, {
						label: "Namespace",
						value: String(data?.namespace ?? caps.data?.namespace ?? "—"),
						mono: true,
						accent: true
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest",
					children: "Analysis capabilities"
				}), caps.data?.openapiVersion ? /* @__PURE__ */ jsxs("span", {
					className: "text-[10px] font-mono text-muted-foreground uppercase",
					children: ["OpenAPI · ", caps.data.openapiVersion]
				}) : null]
			}), caps.isLoading ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 md:grid-cols-3 gap-3",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-14 rounded-lg" }, i))
			}) : caps.error ? /* @__PURE__ */ jsx(ErrorPanel, { error: caps.error }) : /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
				children: [capEntries.map(([k, v]) => /* @__PURE__ */ jsx(CapabilityRow, {
					name: k,
					value: v
				}, k)), capEntries.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "col-span-full text-sm text-muted-foreground font-mono",
					children: "No capabilities reported."
				}) : null]
			})] }),
			data?.capabilities && Object.keys(data.capabilities).length > 0 ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4",
				children: "Health capability flags"
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
				children: Object.entries(data.capabilities).map(([k, v]) => /* @__PURE__ */ jsx(CapabilityRow, {
					name: k,
					value: v
				}, k))
			})] }) : null,
			data ? /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4",
				children: "Raw Response"
			}), /* @__PURE__ */ jsx("pre", {
				className: "text-[11px] font-mono bg-card ring-1 ring-black/5 rounded-lg p-4 overflow-auto max-h-96",
				children: JSON.stringify({
					health: data,
					capabilities: caps.data
				}, null, 2)
			})] }) : null
		]
	})] });
}
function MetaCard({ label, value, mono, accent }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `p-4 bg-card ring-1 ring-black/5 rounded-lg ${accent ? "border-l-2 border-iris-accent" : ""}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: `text-sm truncate ${mono ? "font-mono" : ""} text-foreground/90`,
			title: value,
			children: value
		})]
	});
}
function CapabilityRow({ name, value }) {
	const isBool = typeof value === "boolean";
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between p-3 bg-card ring-1 ring-black/5 rounded-lg",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-sm font-mono truncate",
			children: name
		}), isBool ? (isBool ? value : Boolean(value)) ? /* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-1.5 text-status-confirmed text-xs font-medium",
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" }), " Yes"]
		}) : /* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-1.5 text-muted-foreground text-xs font-medium",
			children: [/* @__PURE__ */ jsx(XCircle, { className: "size-4" }), " No"]
		}) : /* @__PURE__ */ jsx("span", {
			className: "text-xs font-mono text-muted-foreground truncate max-w-[50%]",
			children: String(value)
		})]
	});
}
function ErrorPanel({ error }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "p-4 rounded-lg border border-destructive/30 bg-destructive/5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-sm font-semibold text-destructive mb-1",
				children: "Failed to reach the API"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs font-mono text-destructive/80 break-all",
				children: error.message
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-xs text-muted-foreground mt-3",
				children: [
					"Check the base URL and credentials in",
					" ",
					/* @__PURE__ */ jsx("a", {
						href: "/settings",
						className: "underline",
						children: "Settings"
					}),
					"."
				]
			})
		]
	});
}
//#endregion
export { HealthPage as component };
