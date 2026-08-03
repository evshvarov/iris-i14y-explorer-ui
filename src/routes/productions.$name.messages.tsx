import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/productions/$name/messages")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/messages",
      search: { productionName: params.name } as never,
      replace: true,
    });
  },
  component: () => null,
});
