import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/messages.index.tsx
var $$splitComponentImporter = () => import("./messages.index-DHpz6az4.js");
var toStr = z.union([z.string(), z.number()]).transform((v) => String(v)).optional();
var searchSchema = z.object({
	productionName: toStr,
	sourceConfigName: toStr,
	targetConfigName: toStr,
	messageBodyClassName: toStr,
	sessionId: toStr,
	status: toStr,
	errorsOnly: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === "true").optional(),
	limit: z.coerce.number().optional(),
	offset: z.coerce.number().optional(),
	dateFrom: toStr,
	dateTo: toStr,
	datePreset: toStr
});
var Route = createFileRoute("/messages/")({
	head: () => ({ meta: [{ title: "Message Explainer — IRIS Explainer" }] }),
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
