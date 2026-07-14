import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  DEFAULT_BASE_URL,
  apiFetch,
  getApiConfig,
  setApiConfig,
} from "@/lib/api-config";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — IRIS Explainer" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message: string }>(
    null,
  );

  useEffect(() => {
    const cfg = getApiConfig();
    setBaseUrl(cfg.baseUrl);
    setUsername(cfg.username);
    setPassword(cfg.password);
  }, []);

  const save = () => {
    setApiConfig({ baseUrl, username, password });
    toast.success("Connection settings saved");
  };

  const test = async () => {
    setApiConfig({ baseUrl, username, password });
    setTesting(true);
    setResult(null);
    try {
      await apiFetch("/health");
      setResult({ ok: true, message: "Reached /health successfully." });
    } catch (e) {
      setResult({ ok: false, message: (e as Error).message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <PageHeader crumbs={[{ label: "Preferences" }]} title="Settings" />
      <div className="p-8 max-w-2xl space-y-8">
        <section className="bg-card ring-1 ring-black/5 rounded-lg p-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold">IRIS Explainer API</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Point the UI at your{" "}
              <span className="font-mono">i14y-aid</span> CSP application. The
              base URL should end at{" "}
              <span className="font-mono">/i14y-aid/api</span>.
            </p>
          </div>

          <Field label="Base URL">
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={DEFAULT_BASE_URL}
              className="font-mono text-sm"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Username (optional)">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="_SYSTEM"
                className="font-mono text-sm"
                autoComplete="off"
              />
            </Field>
            <Field label="Password (optional)">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono text-sm"
                autoComplete="new-password"
              />
            </Field>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Credentials are stored in your browser's local storage and sent as
            HTTP Basic auth on every request.
          </p>

          <div className="flex items-center gap-3">
            <Button onClick={save} className="bg-iris-brand hover:bg-iris-brand/90">
              Save
            </Button>
            <Button
              variant="outline"
              onClick={test}
              disabled={testing}
            >
              {testing ? "Testing…" : "Test connection"}
            </Button>
          </div>

          {result ? (
            <div
              className={`text-xs font-mono rounded-md p-3 border ${
                result.ok
                  ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
                  : "border-destructive/30 bg-destructive/5 text-destructive"
              }`}
            >
              {result.message}
            </div>
          ) : null}
        </section>

        <section className="text-[11px] text-muted-foreground font-mono">
          <p>Endpoints exercised by this UI:</p>
          <ul className="mt-2 space-y-1">
            <li>GET /_spec</li>
            <li>GET /health</li>
            <li>GET /productions</li>
            <li>GET /productions/{"{productionName}"}</li>
            <li>GET /productions/{"{productionName}"}/components</li>
          </ul>
        </section>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
