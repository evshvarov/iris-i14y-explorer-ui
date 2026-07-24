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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit component</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {productionName} → {componentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-md ring-1 ring-black/5 bg-card">
              <Label htmlFor="edit-enabled" className="text-xs uppercase tracking-wider">
                Enabled
              </Label>
              <Switch id="edit-enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-pool" className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Pool size
              </Label>
              <Input
                id="edit-pool"
                type="number"
                min={0}
                value={poolSize}
                onChange={(e) => setPoolSize(e.target.value)}
                className="h-9 font-mono"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="edit-cat" className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Category
              </Label>
              <Input
                id="edit-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 font-mono"
                placeholder="e.g. inbound, outbound"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="edit-comment" className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Comment
              </Label>
              <Textarea
                id="edit-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Settings ({rows.length})
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setRows((r) => [...r, { key: "", value: "" }])}
                className="h-7 text-xs gap-1"
              >
                <Plus className="size-3" /> Add
              </Button>
            </div>
            <div className="rounded-md ring-1 ring-black/5 bg-card divide-y">
              {rows.length === 0 ? (
                <div className="p-3 text-xs text-muted-foreground text-center">
                  No settings. Add one to override a component default.
                </div>
              ) : (
                rows.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1.5fr_auto] gap-2 p-2 items-center"
                  >
                    <Input
                      value={r.key}
                      onChange={(e) =>
                        setRows((rs) => rs.map((x, ix) => (ix === i ? { ...x, key: e.target.value } : x)))
                      }
                      placeholder="name"
                      className="h-8 font-mono text-xs"
                    />
                    <Input
                      value={r.value}
                      onChange={(e) =>
                        setRows((rs) => rs.map((x, ix) => (ix === i ? { ...x, value: e.target.value } : x)))
                      }
                      placeholder="value"
                      className="h-8 font-mono text-xs"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setRows((rs) => rs.filter((_, ix) => ix !== i))}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      aria-label="Remove setting"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Removed rows are sent as empty values to clear the override on the server.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mut.isPending}>
            Cancel
          </Button>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="gap-2">
            {mut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
