import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { LogsPanel } from "@/components/logs-panel";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Production Logs — IRIS Explainer" },
      {
        name: "description",
        content: "Recent interoperability production log entries across the current namespace.",
      },
    ],
  }),
  component: LogsPage,
});

function LogsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        crumbs={[{ label: "Runtime" }, { label: "Logs" }]}
        title="Production Logs"
      />
      <p className="text-sm text-muted-foreground -mt-4 max-w-2xl">
        Recent Ens.Util.Log entries across all productions in the current namespace. Filter by
        type, source, or free text.
      </p>
      <LogsPanel />
    </div>
  );
}
