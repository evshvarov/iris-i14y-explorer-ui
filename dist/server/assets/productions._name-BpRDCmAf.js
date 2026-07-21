import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/productions.$name.tsx
var $$splitComponentImporter = () => import("./productions._name-CZ_hUt_l.js");
var Route = createFileRoute("/productions/$name")({
	head: ({ params }) => ({ meta: [{ title: `${params.name} — IRIS Explainer` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
