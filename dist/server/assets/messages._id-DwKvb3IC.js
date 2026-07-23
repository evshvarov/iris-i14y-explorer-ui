import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/messages.$id.tsx
var $$splitComponentImporter = () => import("./messages._id-mrCv6HWg.js");
var Route = createFileRoute("/messages/$id")({
	head: ({ params }) => ({ meta: [{ title: `Message #${params.id} — IRIS Explainer` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
