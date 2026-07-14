import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareText } from "lucide-react";

import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Message Explainer — IRIS Explainer" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Exploration" }]}
        title="Message Explainer"
        status={{ label: "Deferred", tone: "unknown" }}
      />
      <div className="p-8">
        <div className="max-w-2xl bg-card ring-1 ring-black/5 rounded-lg p-8">
          <div className="size-10 rounded-md bg-iris-brand/10 text-iris-brand flex items-center justify-center mb-4">
            <MessageSquareText className="size-5" />
          </div>
          <h2 className="text-lg font-semibold">Runtime message trace narrative</h2>
          <p className="text-sm text-muted-foreground mt-2 text-pretty">
            Explain what happened to a selected runtime message — which service
            received it, which process classified it, which transformations ran,
            and which operation dispatched it — with each fact tagged as
            confirmed, observed, inferred, or unknown.
          </p>
          <div className="mt-6 grid grid-cols-4 gap-2 text-[10px] font-mono uppercase">
            <Tag color="bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20">
              Confirmed
            </Tag>
            <Tag color="bg-status-observed/10 text-status-observed border-status-observed/20">
              Observed
            </Tag>
            <Tag color="bg-status-inferred/10 text-status-inferred border-status-inferred/20">
              Inferred
            </Tag>
            <Tag color="bg-status-unknown/10 text-status-unknown border-status-unknown/20">
              Unknown
            </Tag>
          </div>
          <p className="mt-6 text-[11px] font-mono text-muted-foreground">
            Not available in the current MVP scope. This surface is reserved for
            the next backend increment (runtime trace + DTL/BPL analysis).
          </p>
        </div>
      </div>
    </>
  );
}

function Tag({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`text-center px-2 py-1 border rounded ${color}`}
    >
      {children}
    </span>
  );
}
