import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/productions.$name.components.$componentName.tsx
var $$splitComponentImporter = () => import("./productions._name.components._componentName-BM72UMUX.js");
var Route = createFileRoute("/productions/$name/components/$componentName")({
	head: ({ params }) => ({ meta: [{ title: `${params.componentName} — ${params.name} — IRIS Explainer` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
