import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/summary-bits.tsx
function SummaryBullets({ bullets }) {
	if (!bullets || bullets.length === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "bg-card ring-1 ring-black/5 rounded-lg p-5 max-w-4xl",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2",
			children: "Key points"
		}), /* @__PURE__ */ jsx("ul", {
			className: "space-y-1.5",
			children: bullets.map((b, i) => /* @__PURE__ */ jsxs("li", {
				className: "text-sm text-foreground/90 pl-4 relative",
				children: [/* @__PURE__ */ jsx("span", { className: "absolute left-0 top-2 size-1.5 rounded-full bg-iris-brand" }), b]
			}, i))
		})]
	});
}
function MetricChip({ label, value, tone }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `inline-flex items-center gap-1.5 rounded-md ring-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${tone === "error" ? "text-destructive ring-destructive/30 bg-destructive/10" : tone === "brand" ? "text-iris-brand ring-iris-brand/30 bg-iris-brand/10" : tone === "confirmed" ? "text-status-confirmed ring-status-confirmed/30 bg-status-confirmed/10" : tone === "observed" ? "text-status-observed ring-status-observed/30 bg-status-observed/10" : tone === "inferred" ? "text-status-inferred ring-status-inferred/30 bg-status-inferred/10" : "ring-black/10 bg-muted text-foreground/80"}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "opacity-70",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "font-semibold",
			children: value
		})]
	});
}
function MetricChips({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-wrap gap-2",
		children
	});
}
function EvidenceChips({ m }) {
	if (!m) return null;
	const parts = [
		[
			"Confirmed",
			m.confirmedEvidenceCount,
			"confirmed"
		],
		[
			"Observed",
			m.observedEvidenceCount,
			"observed"
		],
		[
			"Inferred",
			m.inferredEvidenceCount,
			"inferred"
		],
		[
			"Unknown",
			m.unknownEvidenceCount,
			"neutral"
		]
	];
	if (!parts.some(([, v]) => (v ?? 0) > 0)) return null;
	return /* @__PURE__ */ jsx(MetricChips, { children: parts.map(([label, v, tone]) => (v ?? 0) > 0 ? /* @__PURE__ */ jsx(MetricChip, {
		label,
		value: v,
		tone
	}, label) : null) });
}
//#endregion
export { SummaryBullets as i, MetricChip as n, MetricChips as r, EvidenceChips as t };
