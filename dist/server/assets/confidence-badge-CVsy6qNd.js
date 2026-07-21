import { jsx } from "react/jsx-runtime";
//#region src/components/confidence-badge.tsx
var styles = {
	confirmed: "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
	observed: "bg-status-observed/10 text-status-observed border-status-observed/20",
	inferred: "bg-status-inferred/10 text-status-inferred border-status-inferred/20",
	unknown: "bg-status-unknown/10 text-status-unknown border-status-unknown/20"
};
function ConfidenceBadge({ confidence }) {
	const key = (confidence || "unknown") in styles ? confidence : "unknown";
	return /* @__PURE__ */ jsx("span", {
		className: `text-[10px] font-mono px-1.5 py-0.5 border rounded uppercase shrink-0 ${styles[key]}`,
		children: key
	});
}
function ConfidenceDot({ confidence, title }) {
	const bg = {
		confirmed: "bg-status-confirmed",
		observed: "bg-status-observed",
		inferred: "bg-status-inferred",
		unknown: "bg-status-unknown"
	}[confidence];
	return /* @__PURE__ */ jsx("div", {
		className: `size-2 rounded-full ${bg}`,
		title: title ?? confidence
	});
}
//#endregion
export { ConfidenceDot as n, ConfidenceBadge as t };
