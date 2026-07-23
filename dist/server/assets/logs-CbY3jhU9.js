import { t as PageHeader } from "./page-header-BF0qj5eV.js";
import { t as LogsPanel } from "./logs-panel-CSPAWrQx.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/logs.tsx?tsr-split=component
function LogsPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				crumbs: [{ label: "Runtime" }, { label: "Logs" }],
				title: "Production Logs"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground -mt-4 max-w-2xl",
				children: "Recent Ens.Util.Log entries across all productions in the current namespace. Filter by type, source, or free text."
			}),
			/* @__PURE__ */ jsx(LogsPanel, {})
		]
	});
}
//#endregion
export { LogsPage as component };
