const BASE_URL_KEY = "i14y.baseUrl";
const AUTH_USER_KEY = "i14y.authUser";
const AUTH_PASS_KEY = "i14y.authPass";

export const DEFAULT_BASE_URL = "http://localhost:57337/i14y-aid/api";

export type ApiConfig = {
  baseUrl: string;
  username: string;
  password: string;
};

export function getApiConfig(): ApiConfig {
  if (typeof window === "undefined") {
    return { baseUrl: DEFAULT_BASE_URL, username: "", password: "" };
  }
  return {
    baseUrl: window.localStorage.getItem(BASE_URL_KEY) || DEFAULT_BASE_URL,
    username: window.localStorage.getItem(AUTH_USER_KEY) || "",
    password: window.localStorage.getItem(AUTH_PASS_KEY) || "",
  };
}

export function setApiConfig(cfg: ApiConfig) {
  window.localStorage.setItem(BASE_URL_KEY, cfg.baseUrl.trim());
  window.localStorage.setItem(AUTH_USER_KEY, cfg.username);
  window.localStorage.setItem(AUTH_PASS_KEY, cfg.password);
  window.dispatchEvent(new CustomEvent("i14y:config-changed"));
}

function authHeader(cfg: ApiConfig): Record<string, string> {
  if (!cfg.username && !cfg.password) return {};
  const token = btoa(`${cfg.username}:${cfg.password}`);
  return { Authorization: `Basic ${token}` };
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const cfg = getApiConfig();
  const url = `${cfg.baseUrl.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...authHeader(cfg),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`,
    );
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}
