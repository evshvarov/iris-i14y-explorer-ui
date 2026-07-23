import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/page-header.tsx
function PageHeader({ crumbs, title, subtitle, status, actions }) {
	const t = {
		confirmed: {
			bg: "#e5f4ec",
			fg: "#1a7f52"
		},
		observed: {
			bg: "#e8eefb",
			fg: "#2b5cd6"
		},
		inferred: {
			bg: "#fdf3e2",
			fg: "#b7791f"
		},
		unknown: {
			bg: "#eef1f5",
			fg: "#6b7686"
		},
		error: {
			bg: "#fbeae7",
			fg: "#c0392b"
		}
	}[status?.tone ?? "unknown"];
	return /* @__PURE__ */ jsxs("header", {
		className: "border-b bg-white/70 backdrop-blur-md px-6 md:px-8 py-4 sticky top-0 z-10",
		children: [crumbs && crumbs.length > 0 ? /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2 mb-1.5",
			children: crumbs.map((c, i) => /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[11px] font-mono uppercase tracking-wider text-muted-foreground",
					children: c.label
				}), /* @__PURE__ */ jsx("span", {
					className: "text-border text-xs",
					children: "/"
				})]
			}, i))
		}) : null, /* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between gap-4 flex-wrap",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-[22px] font-bold tracking-[-0.3px] truncate",
						children: title
					}), status ? /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wide",
						style: {
							backgroundColor: t.bg,
							color: t.fg
						},
						children: [/* @__PURE__ */ jsx("span", {
							className: "size-1.5 rounded-full",
							style: { backgroundColor: t.fg }
						}), status.label]
					}) : null]
				}), subtitle ? /* @__PURE__ */ jsx("div", {
					className: "text-[12px] font-mono text-[#8792a3] mt-1 truncate",
					children: subtitle
				}) : null]
			}), actions ? /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 shrink-0",
				children: actions
			}) : null]
		})]
	});
}
//#endregion
export { PageHeader as t };
