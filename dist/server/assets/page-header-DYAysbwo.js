import { jsx, jsxs } from "react/jsx-runtime";
//#region src/lib/api-config.ts
var BASE_URL_KEY = "i14y.baseUrl";
var AUTH_USER_KEY = "i14y.authUser";
var AUTH_PASS_KEY = "i14y.authPass";
var DEFAULT_BASE_URL = "https://i14y-aid.sandbox.developer.intersystems.com/i14y-aid/api";
function getApiConfig() {
	if (typeof window === "undefined") return {
		baseUrl: DEFAULT_BASE_URL,
		username: "",
		password: ""
	};
	return {
		baseUrl: window.localStorage.getItem(BASE_URL_KEY) || "https://i14y-aid.sandbox.developer.intersystems.com/i14y-aid/api",
		username: window.localStorage.getItem(AUTH_USER_KEY) || "",
		password: window.localStorage.getItem(AUTH_PASS_KEY) || ""
	};
}
function setApiConfig(cfg) {
	window.localStorage.setItem(BASE_URL_KEY, cfg.baseUrl.trim());
	window.localStorage.setItem(AUTH_USER_KEY, cfg.username);
	window.localStorage.setItem(AUTH_PASS_KEY, cfg.password);
	window.dispatchEvent(new CustomEvent("i14y:config-changed"));
}
function authHeader(cfg) {
	if (!cfg.username && !cfg.password) return {};
	return { Authorization: `Basic ${btoa(`${cfg.username}:${cfg.password}`)}` };
}
async function apiFetch(path, init) {
	const cfg = getApiConfig();
	const url = `${cfg.baseUrl.replace(/\/$/, "")}${path}`;
	const res = await fetch(url, {
		...init,
		headers: {
			Accept: "application/json",
			...authHeader(cfg),
			...init?.headers || {}
		}
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`);
	}
	if ((res.headers.get("content-type") || "").includes("application/json")) return await res.json();
	return await res.text();
}
//#endregion
//#region src/components/page-header.tsx
function PageHeader({ crumbs, title, status, actions }) {
	const toneColor = {
		confirmed: "bg-status-confirmed",
		observed: "bg-status-observed",
		inferred: "bg-status-inferred",
		unknown: "bg-status-unknown"
	}[status?.tone ?? "unknown"];
	return /* @__PURE__ */ jsxs("header", {
		className: "h-14 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [crumbs?.map((c, i) => /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm font-medium text-muted-foreground truncate",
					children: c.label
				}), /* @__PURE__ */ jsx("span", {
					className: "text-border",
					children: "/"
				})]
			}, i)), /* @__PURE__ */ jsx("h1", {
				className: "text-sm font-semibold truncate",
				children: title
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 shrink-0",
			children: [status ? /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 px-2 py-1 bg-muted rounded ring-1 ring-black/5",
				children: [/* @__PURE__ */ jsx("div", { className: `size-2 rounded-full ${toneColor}` }), /* @__PURE__ */ jsx("span", {
					className: "text-[11px] font-mono font-medium text-muted-foreground uppercase",
					children: status.label
				})]
			}) : null, actions]
		})]
	});
}
//#endregion
export { setApiConfig as a, getApiConfig as i, DEFAULT_BASE_URL as n, apiFetch as r, PageHeader as t };
