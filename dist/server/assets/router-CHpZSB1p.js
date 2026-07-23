import { a as Skeleton, n as apiFetch, o as cn, r as getApiConfig } from "./api-config-BqoIDxBb.js";
import { t as Button } from "./button-BwAtE8PJ.js";
import { t as Input } from "./input-DI6UcbvY.js";
import { t as Route$10 } from "./messages.index-BhPJXTh4.js";
import { t as Route$11 } from "./messages._id-DwKvb3IC.js";
import { t as Route$12 } from "./productions._name-DS8xSt4j.js";
import { t as Route$13 } from "./productions._name.components._componentName-B9FEutyG.js";
import * as React from "react";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Activity, Boxes, FileCode2, Gauge, LayoutGrid, MessageSquareText, PanelLeft, ScrollText, Settings2, Sparkles, X } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/i14y-explorer-ui/assets/styles-y2Q9ReEg.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/hooks/use-mobile.tsx
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(void 0);
	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region src/components/ui/separator.tsx
var Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = SeparatorPrimitive.Root.displayName;
//#endregion
//#region src/components/ui/sheet.tsx
var Sheet = SheetPrimitive.Root;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
//#endregion
//#region src/components/ui/tooltip.tsx
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
//#endregion
//#region src/components/ui/sidebar.tsx
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 3600 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React.createContext(null);
function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
var SidebarProvider = React.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React.useState(false);
	const [_open, _setOpen] = React.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = React.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	React.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = React.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ jsx(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ jsx("div", {
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
				ref,
				...props,
				children
			})
		})
	});
});
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = React.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		ref,
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ jsx(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ jsxs(SheetContent, {
			"data-sidebar": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ jsxs(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		children: [/* @__PURE__ */ jsx("div", { className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }), /* @__PURE__ */ jsx("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ jsx("div", {
				"data-sidebar": "sidebar",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
				children
			})
		})]
	});
});
Sidebar.displayName = "Sidebar";
var SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsxs(Button, {
		ref,
		"data-sidebar": "trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ jsx(PanelLeft, {}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsx("button", {
		ref,
		"data-sidebar": "rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	});
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("main", {
		ref,
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
		...props
	});
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Input, {
		ref,
		"data-sidebar": "input",
		className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
		...props
	});
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Separator, {
		ref,
		"data-sidebar": "separator",
		className: cn("mx-2 w-auto bg-sidebar-border", className),
		...props
	});
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "div", {
		ref,
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "group-action",
		className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	"data-sidebar": "group-content",
	className: cn("w-full text-sm", className),
	...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", {
	ref,
	"data-sidebar": "menu",
	className: cn("flex w-full min-w-0 flex-col gap-1", className),
	...props
}));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	"data-sidebar": "menu-item",
	className: cn("group/menu-item relative", className),
	...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var SidebarMenuButton = React.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ jsx(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "menu-action",
		className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
		...props
	});
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	"data-sidebar": "menu-badge",
	className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
	const width = React.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-sidebar": "menu-skeleton",
		className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
		...props,
		children: [showIcon && /* @__PURE__ */ jsx(Skeleton, {
			className: "size-4 rounded-md",
			"data-sidebar": "menu-skeleton-icon"
		}), /* @__PURE__ */ jsx(Skeleton, {
			className: "h-4 max-w-(--skeleton-width) flex-1",
			"data-sidebar": "menu-skeleton-text",
			style: { "--skeleton-width": width }
		})]
	});
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", {
	ref,
	"data-sidebar": "menu-sub",
	className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "a", {
		ref,
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
//#endregion
//#region src/components/app-sidebar.tsx
var sections = [
	{
		title: "Health",
		url: "/health",
		icon: Activity
	},
	{
		title: "Productions",
		url: "/productions",
		icon: Boxes
	},
	{
		title: "Monitor",
		url: "/metrics",
		icon: Gauge
	},
	{
		title: "Messages",
		url: "/messages",
		icon: MessageSquareText
	},
	{
		title: "Event log",
		url: "/logs",
		icon: ScrollText
	},
	{
		title: "API Reference",
		url: "/api-reference",
		icon: FileCode2
	}
];
function AppSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isActive = (url) => url === "/" ? pathname === "/" : pathname.startsWith(url);
	const { data } = useQuery({
		queryKey: ["productions"],
		queryFn: () => apiFetch("/productions"),
		retry: 0
	});
	const productions = (data?.items ?? []).slice(0, 8);
	const activeProd = (() => {
		const m = pathname.match(/^\/productions\/([^/]+)/);
		return m ? decodeURIComponent(m[1]) : null;
	})();
	return /* @__PURE__ */ jsxs(Sidebar, {
		className: "border-r hidden md:flex",
		children: [/* @__PURE__ */ jsxs(SidebarContent, {
			className: "py-3",
			children: [
				/* @__PURE__ */ jsxs(SidebarGroup, { children: [/* @__PURE__ */ jsx(SidebarGroupLabel, {
					className: "text-[10.5px] font-semibold uppercase tracking-[0.7px] px-3 text-[color:var(--muted-foreground)]",
					children: "Productions"
				}), /* @__PURE__ */ jsx(SidebarGroupContent, {
					className: "px-2",
					children: productions.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "px-2 py-3 text-[11px] text-muted-foreground",
						children: "No productions"
					}) : /* @__PURE__ */ jsx("ul", {
						className: "space-y-1.5",
						children: productions.map((p) => {
							const active = activeProd === p.name;
							const short = p.name.split(".").slice(-1)[0] || p.name;
							return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
								to: "/productions/$name",
								params: { name: p.name },
								className: `block rounded-[9px] px-3 py-2.5 border transition-colors ${active ? "border-[color:var(--iris-tint-border)]" : "border-[color:var(--border)] hover:border-[color:#b9c6de]"}`,
								style: active ? { backgroundColor: "var(--iris-tint)" } : { backgroundColor: "#fff" },
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: "size-[7px] rounded-full shrink-0",
											style: { backgroundColor: p.isRunning ? "#1a7f52" : "#a2abb8" }
										}), /* @__PURE__ */ jsx("span", {
											className: `text-[12.5px] font-semibold truncate ${active ? "text-[color:var(--iris-deep)]" : "text-[#33405a]"}`,
											children: short
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-mono text-[#8792a3] truncate mt-0.5",
										children: p.name
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-semibold mt-0.5",
										style: { color: p.isRunning ? "#1a7f52" : "#a2abb8" },
										children: p.isRunning ? "running" : p.runtimeState ?? "stopped"
									})
								]
							}) }, p.name);
						})
					})
				})] }),
				/* @__PURE__ */ jsx("div", { className: "my-3 mx-3 h-px bg-border" }),
				/* @__PURE__ */ jsxs(SidebarGroup, { children: [/* @__PURE__ */ jsx(SidebarGroupLabel, {
					className: "text-[10.5px] font-semibold uppercase tracking-[0.7px] px-3 text-[color:var(--muted-foreground)]",
					children: "Sections"
				}), /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsxs(SidebarMenu, { children: [/* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
					asChild: true,
					isActive: pathname === "/",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(LayoutGrid, { className: "size-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Overview" })]
					})
				}) }), sections.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
					asChild: true,
					isActive: isActive(item.url),
					children: /* @__PURE__ */ jsxs(Link, {
						to: item.url,
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(item.icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: item.title })]
					})
				}) }, item.url))] }) })] })
			]
		}), /* @__PURE__ */ jsx(SidebarFooter, {
			className: "border-t",
			children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
				asChild: true,
				isActive: isActive("/settings"),
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/settings",
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx(Settings2, { className: "size-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Settings" })]
				})
			}) }) })
		})]
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
var assetBase = "/i14y-explorer-ui/";
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Interoperability Aid — IRIS Production Explorer" },
			{
				name: "description",
				content: "A developer UI for InterSystems IRIS Interoperability productions: understand components, monitor health, browse messages/logs, and ask the AI copilot."
			},
			{
				property: "og:title",
				content: "Interoperability Aid — IRIS Production Explorer"
			},
			{
				property: "og:description",
				content: "Understand, monitor and ask AI questions about IRIS Interoperability productions."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Interoperability Aid — IRIS Production Explorer"
			},
			{
				name: "twitter:description",
				content: "Understand, monitor and ask AI questions about IRIS Interoperability productions."
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: `${assetBase}favicon.ico`,
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function TopBar() {
	const { data: health } = useQuery({
		queryKey: ["health-topbar"],
		queryFn: () => apiFetch("/health"),
		retry: 0,
		refetchInterval: 3e4
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
	return /* @__PURE__ */ jsxs("header", {
		className: "h-[54px] shrink-0 flex items-center justify-between px-4 md:px-6 text-[color:var(--iris-navy-fg)]",
		style: { backgroundColor: "var(--iris-navy)" },
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [
				/* @__PURE__ */ jsx(SidebarTrigger, { className: "md:hidden text-white/80 hover:text-white" }),
				/* @__PURE__ */ jsx("div", {
					className: "size-[26px] rounded-md flex items-center justify-center text-[10px] font-mono font-semibold text-white shrink-0",
					style: { backgroundColor: "var(--iris-brand)" },
					children: "i14"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "min-w-0 leading-tight",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[14px] font-semibold truncate",
						children: "Interoperability Aid"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-[10.5px] font-mono truncate",
						style: { color: "var(--iris-navy-muted)" },
						children: "IRIS Production Explainer"
					})]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 md:gap-3 shrink-0",
			children: [
				health?.namespace ? /* @__PURE__ */ jsxs("div", {
					className: "hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 ring-1 ring-white/10",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[9.5px] font-mono uppercase tracking-wider",
						style: { color: "var(--iris-navy-muted)" },
						children: "ns"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-mono font-medium",
						children: health.namespace
					})]
				}) : null,
				/* @__PURE__ */ jsx("div", {
					className: "hidden md:block text-[11px] font-mono px-2 py-1 rounded-md bg-white/5 ring-1 ring-white/10",
					style: { color: "var(--iris-navy-muted)" },
					children: basePath
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 px-2 py-1 rounded-md",
					style: { backgroundColor: "rgba(46,196,120,.14)" },
					children: [/* @__PURE__ */ jsx("span", {
						className: `size-1.5 rounded-full ${healthy ? "i14y-pulse" : ""}`,
						style: { backgroundColor: healthy ? "var(--iris-health)" : "#c0392b" }
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10.5px] font-mono font-medium",
						style: { color: healthy ? "#8affbf" : "#ffb3ac" },
						children: healthy ? "API healthy" : "API down"
					})]
				}),
				/* @__PURE__ */ jsxs(Link, {
					to: "/messages",
					className: "inline-flex items-center gap-1.5 h-8 px-3 rounded-[7px] text-[12px] font-semibold text-white transition-colors",
					style: { backgroundColor: "var(--iris-brand)" },
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "size-3.5" }), "Copilot"]
				})
			]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(SidebarProvider, { children: [/* @__PURE__ */ jsxs("div", {
			className: "min-h-screen flex flex-col w-full bg-background text-foreground",
			children: [/* @__PURE__ */ jsx(TopBar, {}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 min-h-0 w-full",
				children: [/* @__PURE__ */ jsx(AppSidebar, {}), /* @__PURE__ */ jsx("main", {
					className: "flex-1 flex flex-col min-w-0 overflow-auto",
					children: /* @__PURE__ */ jsx(Outlet, {})
				})]
			})]
		}), /* @__PURE__ */ jsx(Toaster$1, {
			richColors: true,
			position: "top-right"
		})] })
	});
}
//#endregion
//#region src/routes/index.tsx
var Route$8 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/productions" });
} });
//#endregion
//#region src/routes/api-reference.tsx
var $$splitComponentImporter$7 = () => import("./api-reference-8RDwCbRi.js");
var Route$7 = createFileRoute("/api-reference")({
	head: () => ({ meta: [{ title: "API Reference — IRIS Explainer" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/health.tsx
var $$splitComponentImporter$6 = () => import("./health-C2KWXPs9.js");
var Route$6 = createFileRoute("/health")({
	head: () => ({ meta: [{ title: "Health — IRIS Explainer" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/logs.tsx
var $$splitComponentImporter$5 = () => import("./logs-CbY3jhU9.js");
var Route$5 = createFileRoute("/logs")({
	head: () => ({ meta: [{ title: "Production Logs — IRIS Explainer" }, {
		name: "description",
		content: "Recent interoperability production log entries across the current namespace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/messages.tsx
var $$splitComponentImporter$4 = () => import("./messages-DiZHpErc.js");
var Route$4 = createFileRoute("/messages")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/metrics.tsx
var $$splitComponentImporter$3 = () => import("./metrics-Kg2lcbOE.js");
var Route$3 = createFileRoute("/metrics")({
	head: () => ({ meta: [{ title: "Metrics — IRIS Explainer" }, {
		name: "description",
		content: "Sanitized interoperability metrics from the i14y-aid wrappers around /api/monitor."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/productions.tsx
var $$splitComponentImporter$2 = () => import("./productions-DDczb8X_.js");
var Route$2 = createFileRoute("/productions")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/settings.tsx
var $$splitComponentImporter$1 = () => import("./settings-fBME4kjN.js");
var Route$1 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — IRIS Explainer" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/productions.index.tsx
var $$splitComponentImporter = () => import("./productions.index-snuWPhGP.js");
var Route = createFileRoute("/productions/")({
	head: () => ({ meta: [{ title: "Productions — IRIS Explainer" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var ApiReferenceRoute = Route$7.update({
	id: "/api-reference",
	path: "/api-reference",
	getParentRoute: () => Route$9
});
var HealthRoute = Route$6.update({
	id: "/health",
	path: "/health",
	getParentRoute: () => Route$9
});
var LogsRoute = Route$5.update({
	id: "/logs",
	path: "/logs",
	getParentRoute: () => Route$9
});
var MessagesRoute = Route$4.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => Route$9
});
var MetricsRoute = Route$3.update({
	id: "/metrics",
	path: "/metrics",
	getParentRoute: () => Route$9
});
var ProductionsRoute = Route$2.update({
	id: "/productions",
	path: "/productions",
	getParentRoute: () => Route$9
});
var SettingsRoute = Route$1.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$9
});
var MessagesIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => MessagesRoute
});
var MessagesIdRoute = Route$11.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => MessagesRoute
});
var ProductionsIndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => ProductionsRoute
});
var ProductionsNameRoute = Route$12.update({
	id: "/$name",
	path: "/$name",
	getParentRoute: () => ProductionsRoute
});
var ProductionsNameComponentsComponentNameRoute = Route$13.update({
	id: "/components/$componentName",
	path: "/components/$componentName",
	getParentRoute: () => ProductionsNameRoute
});
var MessagesRouteChildren = {
	MessagesIdRoute,
	MessagesIndexRoute
};
var MessagesRouteWithChildren = MessagesRoute._addFileChildren(MessagesRouteChildren);
var ProductionsNameRouteChildren = { ProductionsNameComponentsComponentNameRoute };
var ProductionsRouteChildren = {
	ProductionsNameRoute: ProductionsNameRoute._addFileChildren(ProductionsNameRouteChildren),
	ProductionsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	ApiReferenceRoute,
	HealthRoute,
	LogsRoute,
	MessagesRoute: MessagesRouteWithChildren,
	MetricsRoute,
	ProductionsRoute: ProductionsRoute._addFileChildren(ProductionsRouteChildren),
	SettingsRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var basepath = "/i14y-explorer-ui/".replace(/\/$/, "");
var getRouter = () => {
	return createRouter({
		routeTree,
		basepath,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
