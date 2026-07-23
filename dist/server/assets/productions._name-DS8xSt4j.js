import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/productions.$name.tsx
var $$splitComponentImporter = () => import("./productions._name-oWbsKyCg.js");
var Route = createFileRoute("/productions/$name")({
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
