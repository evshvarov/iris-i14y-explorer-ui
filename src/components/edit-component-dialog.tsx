import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api-config";
import type {
  Component,
  ComponentSettingsUpdateRequest,
  ComponentSettingsUpdateResponse,
} from "@/lib/api-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Row = { key: string; value: string };

function componentToRows(c?: Component): Row[] {
  const s = c?.settings ?? {};
  return Object.entries(s).map(([k, v]) => ({
    key: k,
    value: typeof v === "object" ? JSON.stringify(v) : String(v ?? ""),
  }));
}

export function EditComponentDialog({
  open,
  onOpenChange,
  productionName,
  componentName,
  component,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  productionName: string;
  componentName: string;
  component?: Component;
}) {
  const qc = useQueryClient();
  const [enabled, setEnabled] = useState<boolean>(component?.enabled !== false);
  const [poolSize, setPoolSize] = useState<string>(
    component?.poolSize != null ? String(component.poolSize) : "",
  );
  const [category, setCategory] = useState<string>(component?.category ?? "");
  const [comment, setComment] = useState<string>(component?.comment ?? "");
  const [rows, setRows] = useState<Row[]>(componentToRows(component));

  // reset when re-opened / component changes
  useEffect(() => {
    if (!open) return;
    setEnabled(component?.enabled !== false);
    setPoolSize(component?.poolSize != null ? String(component.poolSize) : "");
    setCategory(component?.category ?? "");
    setComment(component?.comment ?? "");
    setRows(componentToRows(component));
  }, [open, component]);

  const initial = component;

  const mut = useMutation({
    mutationFn: async () => {
      const body: ComponentSettingsUpdateRequest = {};
      if ((initial?.enabled !== false) !== enabled) body.enabled = enabled;
      const psNum = poolSize.trim() === "" ? undefined : Number(poolSize);
      if (psNum !== undefined && !Number.isNaN(psNum) && psNum !== initial?.poolSize)
        body.poolSize = psNum;
      if ((category ?? "") !== (initial?.category ?? "")) body.category = category;
      if ((comment ?? "") !== (initial?.comment ?? "")) body.comment = comment;

      // diff settings
      const originalSettings = initial?.settings ?? {};
      const nextSettings: Record<string, string> = {};
      const seen = new Set<string>();
      for (const r of rows) {
        const k = r.key.trim();
        if (!k) continue;
        seen.add(k);
        const origVal =
          k in originalSettings
            ? typeof originalSettings[k] === "object"
              ? JSON.stringify(originalSettings[k])
              : String(originalSettings[k] ?? "")
            : undefined;
        if (origVal !== r.value) nextSettings[k] = r.value;
      }
      // deletions -> empty string signals removal per common convention
      for (const k of Object.keys(originalSettings)) {
        if (!seen.has(k)) nextSettings[k] = "";
      }
      if (Object.keys(nextSettings).length > 0) body.settings = nextSettings;

      if (Object.keys(body).length === 0) {
        throw new Error("No changes to save");
      }

      const url = `/productions/${encodeURIComponent(productionName)}/components/${encodeURIComponent(componentName)}/settings`;
      return apiFetch<ComponentSettingsUpdateResponse>(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: (res) => {
      const attrs = res.updatedAttributes?.length ?? 0;
      const sets = res.updatedSettings?.length ?? 0;
      toast.success(
        `Updated ${componentName}` +
          (attrs || sets ? ` — ${attrs} attribute(s), ${sets} setting(s)` : ""),
      );
      qc.invalidateQueries({ queryKey: ["component", productionName, componentName] });
      qc.invalidateQueries({ queryKey: ["production", productionName] });
      qc.invalidateQueries({ queryKey: ["productions"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b bg-muted/40 space-y-1">
          <DialogTitle className="text-lg font-semibold text-iris-navy">
            Edit component
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase text-muted-foreground">
              <span>{productionName}</span>
              <svg className="size-3 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-iris-brand">{componentName}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Core controls */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 p-4 rounded-lg bg-muted/40 ring-1 ring-black/5 flex flex-col justify-between gap-3">
              <Label htmlFor="edit-enabled" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Status
              </Label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-iris-navy">
                  {enabled ? "ENABLED" : "DISABLED"}
                </span>
                <Switch id="edit-enabled" checked={enabled} onCheckedChange={setEnabled} />
              </div>
            </div>

            <div className="col-span-3 p-4 rounded-lg ring-1 ring-black/5 flex flex-col gap-1">
              <Label htmlFor="edit-pool" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Pool size
              </Label>
              <Input
                id="edit-pool"
                type="number"
                min={0}
                value={poolSize}
                onChange={(e) => setPoolSize(e.target.value)}
                className="border-0 bg-transparent px-0 h-8 text-lg font-mono text-iris-navy shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="col-span-4 p-4 rounded-lg ring-1 ring-black/5 flex flex-col gap-1">
              <Label htmlFor="edit-cat" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Category
              </Label>
              <Input
                id="edit-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="inbound, outbound"
                className="border-0 bg-transparent px-0 h-8 text-sm font-mono text-iris-navy shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="edit-comment" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Internal comment
            </Label>
            <Textarea
              id="edit-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="text-sm text-iris-navy resize-none focus-visible:ring-1 focus-visible:ring-iris-brand"
              placeholder="Describe the purpose of this component override…"
            />
          </div>

          {/* Settings table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Overridden settings
                </Label>
                <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground font-mono">
                  {rows.length}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setRows((r) => [...r, { key: "", value: "" }])}
                className="h-7 gap-1.5 text-[12px] font-semibold text-iris-brand bg-iris-brand/10 hover:bg-iris-brand/20 ring-1 ring-iris-brand/20"
              >
                <Plus className="size-3.5" /> Add parameter
              </Button>
            </div>

            <div className="ring-1 ring-black/5 rounded-lg overflow-hidden bg-card">
              <div className="grid grid-cols-[1fr_1.6fr_2.5rem] bg-muted/50 border-b">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Key</div>
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Value</div>
                <div />
              </div>
              {rows.length === 0 ? (
                <div className="p-6 text-xs text-muted-foreground text-center">
                  No overrides. Add one to shadow a component default.
                </div>
              ) : (
                <div className="divide-y">
                  {rows.map((r, i) => (
                    <div key={i} className="group grid grid-cols-[1fr_1.6fr_2.5rem] items-center">
                      <input
                        value={r.key}
                        onChange={(e) =>
                          setRows((rs) => rs.map((x, ix) => (ix === i ? { ...x, key: e.target.value } : x)))
                        }
                        placeholder="name"
                        className="px-4 py-3 text-[13px] font-mono font-medium text-iris-navy bg-transparent outline-none focus:bg-muted/40"
                      />
                      <input
                        value={r.value}
                        onChange={(e) =>
                          setRows((rs) => rs.map((x, ix) => (ix === i ? { ...x, value: e.target.value } : x)))
                        }
                        placeholder="value"
                        className="px-4 py-3 text-[13px] font-mono text-iris-brand bg-transparent outline-none focus:bg-muted/40 truncate border-l"
                      />
                      <button
                        type="button"
                        onClick={() => setRows((rs) => rs.filter((_, ix) => ix !== i))}
                        aria-label="Remove setting"
                        className="justify-self-center p-1.5 text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground italic px-1">
              Removed rows are sent as empty values to clear the override on the server.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-muted/40 border-t sm:justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={mut.isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="gap-2 bg-iris-brand hover:bg-iris-brand/90 text-white shadow-sm"
          >
            {mut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
