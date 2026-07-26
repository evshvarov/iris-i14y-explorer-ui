import { useState } from "react";
import { ChevronRight } from "lucide-react";

type JsonValue = unknown;

function Primitive({ value }: { value: JsonValue }) {
  if (value === null) return <span className="text-muted-foreground">null</span>;
  if (typeof value === "string")
    return <span className="text-emerald-700 dark:text-emerald-400">"{value}"</span>;
  if (typeof value === "number")
    return <span className="text-blue-700 dark:text-blue-400">{String(value)}</span>;
  if (typeof value === "boolean")
    return <span className="text-purple-700 dark:text-purple-400">{String(value)}</span>;
  return <span>{String(value)}</span>;
}

function Node({
  keyName,
  value,
  depth,
  defaultOpen,
  isLast,
}: {
  keyName?: string | number;
  value: JsonValue;
  depth: number;
  defaultOpen: boolean;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isObj = value && typeof value === "object";
  const isArr = Array.isArray(value);
  const entries = isObj
    ? isArr
      ? (value as JsonValue[]).map((v, i) => [i, v] as [number, JsonValue])
      : Object.entries(value as Record<string, JsonValue>)
    : [];
  const empty = isObj && entries.length === 0;
  const label =
    keyName !== undefined ? (
      <span className="text-slate-700 dark:text-slate-300">
        {typeof keyName === "string" ? `"${keyName}"` : keyName}
        <span className="text-muted-foreground">: </span>
      </span>
    ) : null;

  if (!isObj) {
    return (
      <div style={{ paddingLeft: depth * 12 }} className="leading-5">
        {label}
        <Primitive value={value} />
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  const open_br = isArr ? "[" : "{";
  const close_br = isArr ? "]" : "}";

  if (empty) {
    return (
      <div style={{ paddingLeft: depth * 12 }} className="leading-5">
        {label}
        <span className="text-muted-foreground">
          {open_br}
          {close_br}
        </span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{ paddingLeft: depth * 12 }}
        className="leading-5 cursor-pointer select-none hover:bg-muted/40 rounded-sm"
        onClick={() => setOpen((o) => !o)}
      >
        <ChevronRight
          className={`inline size-3 mr-0.5 transition-transform text-muted-foreground ${
            open ? "rotate-90" : ""
          }`}
        />
        {label}
        <span className="text-muted-foreground">{open_br}</span>
        {!open && (
          <>
            <span className="text-muted-foreground/70 text-[10px] mx-1">
              {isArr
                ? `${entries.length} item${entries.length === 1 ? "" : "s"}`
                : `${entries.length} key${entries.length === 1 ? "" : "s"}`}
            </span>
            <span className="text-muted-foreground">{close_br}</span>
            {!isLast && <span className="text-muted-foreground">,</span>}
          </>
        )}
      </div>
      {open && (
        <>
          {entries.map(([k, v], i) => (
            <Node
              key={String(k)}
              keyName={k}
              value={v}
              depth={depth + 1}
              defaultOpen={depth < 1}
              isLast={i === entries.length - 1}
            />
          ))}
          <div style={{ paddingLeft: depth * 12 }} className="leading-5">
            <span className="text-muted-foreground">{close_br}</span>
            {!isLast && <span className="text-muted-foreground">,</span>}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Attempt to parse a value as JSON. Also un-wraps common cases where a JSON
 * document is stored inside a string field.
 */
function tryParse(input: string): JsonValue | undefined {
  try {
    const parsed = JSON.parse(input);
    return parsed;
  } catch {
    return undefined;
  }
}

function unwrapStrings(value: JsonValue): JsonValue {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      const inner = tryParse(trimmed);
      if (inner !== undefined) return unwrapStrings(inner);
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(unwrapStrings);
  if (value && typeof value === "object") {
    const out: Record<string, JsonValue> = {};
    for (const [k, v] of Object.entries(value as Record<string, JsonValue>)) {
      out[k] = unwrapStrings(v);
    }
    return out;
  }
  return value;
}

export function JsonView({
  text,
  value,
  className = "",
}: {
  text?: string;
  value?: JsonValue;
  className?: string;
}) {
  const parsed = value !== undefined ? value : text !== undefined ? tryParse(text) : undefined;
  if (parsed === undefined) {
    return (
      <pre
        className={`text-[11px] font-mono whitespace-pre-wrap break-words ${className}`}
      >
        {text}
      </pre>
    );
  }
  const unwrapped = unwrapStrings(parsed);
  return (
    <div className={`text-[11px] font-mono ${className}`}>
      <Node value={unwrapped} depth={0} defaultOpen isLast />
    </div>
  );
}
