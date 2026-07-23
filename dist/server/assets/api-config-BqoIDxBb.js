import { jsx } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ui/skeleton.tsx
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
//#endregion
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
export { Skeleton as a, setApiConfig as i, apiFetch as n, cn as o, getApiConfig as r, DEFAULT_BASE_URL as t };
