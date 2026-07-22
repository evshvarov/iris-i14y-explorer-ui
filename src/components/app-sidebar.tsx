import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  FileCode2,
  Gauge,
  LayoutGrid,
  MessageSquareText,
  ScrollText,
  Settings2,
  Boxes,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { apiFetch } from "@/lib/api-config";
import type { ProductionListResponse } from "@/lib/api-types";

const sections = [
  { title: "Health", url: "/health", icon: Activity },
  { title: "Productions", url: "/productions", icon: Boxes },
  { title: "Monitor", url: "/metrics", icon: Gauge },
  { title: "Messages", url: "/messages", icon: MessageSquareText },
  { title: "Event log", url: "/logs", icon: ScrollText },
  { title: "API Reference", url: "/api-reference", icon: FileCode2 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const { data } = useQuery<ProductionListResponse>({
    queryKey: ["productions"],
    queryFn: () => apiFetch<ProductionListResponse>("/productions"),
    retry: 0,
  });

  const productions = (data?.items ?? []).slice(0, 8);

  // Which production is currently opened (from URL like /productions/:name/...)?
  const activeProd = (() => {
    const m = pathname.match(/^\/productions\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  })();

  return (
    <Sidebar className="border-r hidden md:flex">
      <SidebarContent className="py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10.5px] font-semibold uppercase tracking-[0.7px] px-3 text-[color:var(--muted-foreground)]">
            Productions
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            {productions.length === 0 ? (
              <div className="px-2 py-3 text-[11px] text-muted-foreground">
                No productions
              </div>
            ) : (
              <ul className="space-y-1.5">
                {productions.map((p) => {
                  const active = activeProd === p.name;
                  const short = p.name.split(".").slice(-1)[0] || p.name;
                  return (
                    <li key={p.name}>
                      <Link
                        to="/productions/$name"
                        params={{ name: p.name }}
                        className={`block rounded-[9px] px-3 py-2.5 border transition-colors ${
                          active
                            ? "border-[color:var(--iris-tint-border)]"
                            : "border-[color:var(--border)] hover:border-[color:#b9c6de]"
                        }`}
                        style={active ? { backgroundColor: "var(--iris-tint)" } : { backgroundColor: "#fff" }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="size-[7px] rounded-full shrink-0"
                            style={{ backgroundColor: p.isRunning ? "#1a7f52" : "#a2abb8" }}
                          />
                          <span
                            className={`text-[12.5px] font-semibold truncate ${
                              active ? "text-[color:var(--iris-deep)]" : "text-[#33405a]"
                            }`}
                          >
                            {short}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-[#8792a3] truncate mt-0.5">
                          {p.name}
                        </div>
                        <div
                          className="text-[10px] font-semibold mt-0.5"
                          style={{ color: p.isRunning ? "#1a7f52" : "#a2abb8" }}
                        >
                          {p.isRunning ? "running" : (p.runtimeState ?? "stopped")}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-3 mx-3 h-px bg-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10.5px] font-semibold uppercase tracking-[0.7px] px-3 text-[color:var(--muted-foreground)]">
            Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link to="/" className="flex items-center gap-3">
                    <LayoutGrid className="size-4 shrink-0" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {sections.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <Link to="/settings" className="flex items-center gap-3">
                <Settings2 className="size-4 shrink-0" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
