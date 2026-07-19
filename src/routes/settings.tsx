import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  DEFAULT_BASE_URL,
  apiFetch,
  getApiConfig,
  setApiConfig,
} from "@/lib/api-config";
import type {
  AnalysisSettings,
  SettingsResponse,
  SettingsUpdateResponse,
} from "@/lib/api-types";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

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

        <ModuleSettingsSection />

        <section className="text-[11px] text-muted-foreground font-mono">
          <p>Endpoints exercised by this UI:</p>
          <ul className="mt-2 space-y-1">
            <li>GET /_spec</li>
            <li>GET /health</li>
            <li>GET /capabilities</li>
            <li>GET /settings · PUT /settings</li>
            <li>GET /productions</li>
            <li>GET /productions/{"{productionName}"}/graph</li>
            <li>GET /messages/{"{id}"}/payload</li>
          </ul>
        </section>
      </div>
    </>
  );
}

function ModuleSettingsSection() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<SettingsResponse>({
    queryKey: ["settings"],
    queryFn: () => apiFetch<SettingsResponse>("/settings"),
    retry: 0,
  });

  const [draft, setDraft] = useState<AnalysisSettings>({});

  useEffect(() => {
    if (data?.settings) setDraft(data.settings);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (body: AnalysisSettings) =>
      apiFetch<SettingsUpdateResponse>("/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: (r) => {
      toast.success(r.changed ? "Module settings updated" : "No changes to save");
      if (r.settings) setDraft(r.settings);
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["capabilities"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const set = <K extends keyof AnalysisSettings>(k: K, v: AnalysisSettings[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <section className="bg-card ring-1 ring-black/5 rounded-lg p-6 space-y-5">
      <div>
        <h2 className="text-sm font-semibold">Module analysis settings</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Runtime toggles read from <span className="font-mono">GET /settings</span>{" "}
          and saved via <span className="font-mono">PUT /settings</span>.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 rounded-md" />
      ) : error ? (
        <div className="text-xs font-mono text-destructive break-all">
          {(error as Error).message}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleRow
              label="Runtime message analysis"
              checked={!!draft.runtimeMessageAnalysisEnabled}
              onChange={(v) => set("runtimeMessageAnalysisEnabled", v)}
            />
            <ToggleRow
              label="Payload inspection"
              checked={!!draft.payloadInspectionEnabled}
              onChange={(v) => set("payloadInspectionEnabled", v)}
            />
            <ToggleRow
              label="Source-code inference"
              checked={!!draft.sourceCodeInferenceEnabled}
              onChange={(v) => set("sourceCodeInferenceEnabled", v)}
            />
            <ToggleRow
              label="Message resend"
              checked={!!draft.messageResendEnabled}
              onChange={(v) => set("messageResendEnabled", v)}
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField
              label="Max messages"
              value={draft.maxMessagesReturned}
              onChange={(v) => set("maxMessagesReturned", v)}
            />
            <NumberField
              label="Max trace depth"
              value={draft.maxTraceDepth}
              onChange={(v) => set("maxTraceDepth", v)}
            />
            <NumberField
              label="Lookback days"
              value={draft.defaultMessageLookbackDays}
              onChange={(v) => set("defaultMessageLookbackDays", v)}
            />
          </div>

          <Field label="Explanation verbosity">
            <Input
              value={draft.explanationVerbosity ?? ""}
              onChange={(e) => set("explanationVerbosity", e.target.value)}
              placeholder="brief | standard | verbose"
              className="font-mono text-sm"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Field redaction patterns">
              <Input
                value={draft.fieldRedactionPatterns ?? ""}
                onChange={(e) => set("fieldRedactionPatterns", e.target.value)}
                className="font-mono text-xs"
              />
            </Field>
            <Field label="Class exclusions">
              <Input
                value={draft.classExclusions ?? ""}
                onChange={(e) => set("classExclusions", e.target.value)}
                className="font-mono text-xs"
              />
            </Field>
            <Field label="Production exclusions">
              <Input
                value={draft.productionExclusions ?? ""}
                onChange={(e) => set("productionExclusions", e.target.value)}
                className="font-mono text-xs"
              />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => mutation.mutate(draft)}
              disabled={mutation.isPending}
              className="bg-iris-brand hover:bg-iris-brand/90"
            >
              {mutation.isPending ? "Saving…" : "Save module settings"}
            </Button>
            {data?.settings ? (
              <Button
                variant="outline"
                onClick={() => setDraft(data.settings!)}
                disabled={mutation.isPending}
              >
                Revert
              </Button>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md ring-1 ring-black/5 px-3 py-2">
      <span className="text-xs">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <Field label={label}>
      <Input
        type="number"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? undefined : Number(e.target.value))
        }
        className="font-mono text-sm"
      />
    </Field>
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
