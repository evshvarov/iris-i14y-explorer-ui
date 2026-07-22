import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Sparkles } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { Toaster } from "../components/ui/sonner";
import { apiFetch, getApiConfig } from "../lib/api-config";

const assetBase = import.meta.env.BASE_URL;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Interoperability Aid — IRIS Production Explorer" },
      {
        name: "description",
        content:
          "A developer UI for InterSystems IRIS Interoperability productions: understand components, monitor health, browse messages/logs, and ask the AI copilot.",
      },
      { property: "og:title", content: "Interoperability Aid — IRIS Production Explorer" },
      {
        property: "og:description",
        content:
          "Understand, monitor and ask AI questions about IRIS Interoperability productions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Interoperability Aid — IRIS Production Explorer" },
      { name: "twitter:description", content: "Understand, monitor and ask AI questions about IRIS Interoperability productions." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: `${assetBase}favicon.ico`, type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function TopBar() {
  const { data: health } = useQuery<{ status?: string; namespace?: string }>({
    queryKey: ["health-topbar"],
    queryFn: () => apiFetch("/health"),
    retry: 0,
    refetchInterval: 30000,
  });
  const cfg = typeof window !== "undefined" ? getApiConfig() : { baseUrl: "" };
  const basePath = (() => {
    try {
      return new URL(cfg.baseUrl).pathname || "/i14y-aid/api";
    } catch {
      return "/i14y-aid/api";
    }
  })();
  const healthy = health && (health.status === "ok" || health.status === "healthy" || !!health.namespace);

  return (
    <header
      className="h-[54px] shrink-0 flex items-center justify-between px-4 md:px-6 text-[color:var(--iris-navy-fg)]"
      style={{ backgroundColor: "var(--iris-navy)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="md:hidden text-white/80 hover:text-white" />
        <div
          className="size-[26px] rounded-md flex items-center justify-center text-[10px] font-mono font-semibold text-white shrink-0"
          style={{ backgroundColor: "var(--iris-brand)" }}
        >
          i14
        </div>
        <div className="min-w-0 leading-tight">
          <div className="text-[14px] font-semibold truncate">Interoperability Aid</div>
          <div
            className="text-[10.5px] font-mono truncate"
            style={{ color: "var(--iris-navy-muted)" }}
          >
            IRIS Production Explainer
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {health?.namespace ? (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 ring-1 ring-white/10">
            <span
              className="text-[9.5px] font-mono uppercase tracking-wider"
              style={{ color: "var(--iris-navy-muted)" }}
            >
              ns
            </span>
            <span className="text-[11px] font-mono font-medium">{health.namespace}</span>
          </div>
        ) : null}
        <div
          className="hidden md:block text-[11px] font-mono px-2 py-1 rounded-md bg-white/5 ring-1 ring-white/10"
          style={{ color: "var(--iris-navy-muted)" }}
        >
          {basePath}
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{ backgroundColor: "rgba(46,196,120,.14)" }}
        >
          <span
            className={`size-1.5 rounded-full ${healthy ? "i14y-pulse" : ""}`}
            style={{ backgroundColor: healthy ? "var(--iris-health)" : "#c0392b" }}
          />
          <span className="text-[10.5px] font-mono font-medium" style={{ color: healthy ? "#8affbf" : "#ffb3ac" }}>
            {healthy ? "API healthy" : "API down"}
          </span>
        </div>
        <Link
          to="/messages"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[7px] text-[12px] font-semibold text-white transition-colors"
          style={{ backgroundColor: "var(--iris-brand)" }}
        >
          <Sparkles className="size-3.5" />
          Copilot
        </Link>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
          <TopBar />
          <div className="flex flex-1 min-h-0 w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
