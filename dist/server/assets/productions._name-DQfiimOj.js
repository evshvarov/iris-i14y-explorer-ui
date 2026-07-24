import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/productions.$name.tsx
var $$splitComponentImporter = () => import("./productions._name-YfIWkxaL.js");
var PROD_TABS = [
	"overview",
	"graph",
	"analysis",
	"rules",
	"bpl",
	"explanations",
	"messages",
	"logs",
	"ask"
];
var Route = createFileRoute("/productions/$name")({
	validateSearch: (s) => {
		const t = typeof s.tab === "string" ? s.tab : void 0;
		return { tab: t && PROD_TABS.includes(t) ? t : void 0 };
	},
	head: ({ params }) => ({ meta: [{ title: `${params.name} — IRIS Explainer` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/**
* Resolve a RAG citation/chunk to an in-app navigation target, if any.
* Handles component / message / log / session / payload kinds and falls back
* to component pages whenever a `component` field is present.
*/
//#endregion
export { Route as t };
