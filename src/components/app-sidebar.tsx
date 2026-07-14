import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  FileCode2,
  MessageSquareText,
  Settings2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const core = [
  { title: "Health", url: "/health", icon: Activity },
  { title: "Productions", url: "/productions", icon: Boxes },
  { title: "API Reference", url: "/api-reference", icon: FileCode2 },
];

const exploration = [
  {
    title: "Message Explainer",
    url: "/messages",
    icon: MessageSquareText,
  },
];

export function AppSidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14 flex-row items-center px-5">
        <div className="size-6 bg-iris-brand rounded flex items-center justify-center shrink-0">
          <div className="size-2.5 bg-background rotate-45" />
        </div>
        <span className="ml-3 text-sm font-semibold tracking-tight uppercase">
          IRIS Explainer
        </span>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Core
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {core.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Exploration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {exploration.map((item) => (
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
