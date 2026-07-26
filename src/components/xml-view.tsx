import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

function decodeEntities(s: string): string {
  if (!s) return s;
  // Repeat to unescape double-encoded entities (&amp;quot; -> &quot; -> ")
  let prev = "";
  let out = s;
  for (let i = 0; i < 3 && prev !== out; i++) {
    prev = out;
    out = out
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/&amp;/g, "&");
  }
  return out;
}

type XmlNode =
  | { type: "element"; name: string; attrs: [string, string][]; children: XmlNode[] }
  | { type: "text"; value: string }
  | { type: "cdata"; value: string }
  | { type: "comment"; value: string }
  | { type: "pi"; value: string };

function parseXml(input: string): XmlNode[] {
  const src = input;
  let i = 0;
  const root: XmlNode[] = [];
  const stack: XmlNode[][] = [root];

  const readUntil = (end: string) => {
    const idx = src.indexOf(end, i);
    if (idx === -1) {
      const rest = src.slice(i);
      i = src.length;
      return rest;
    }
    const chunk = src.slice(i, idx);
    i = idx + end.length;
    return chunk;
  };

  while (i < src.length) {
    if (src[i] === "<") {
      // text pushed already; handle tag
      if (src.startsWith("<!--", i)) {
        i += 4;
        const val = readUntil("-->");
        stack[stack.length - 1].push({ type: "comment", value: val });
        continue;
      }
      if (src.startsWith("<![CDATA[", i)) {
        i += 9;
        const val = readUntil("]]>");
        stack[stack.length - 1].push({ type: "cdata", value: val });
        continue;
      }
      if (src.startsWith("<?", i)) {
        i += 2;
        const val = readUntil("?>");
        stack[stack.length - 1].push({ type: "pi", value: val });
        continue;
      }
      if (src.startsWith("<!", i)) {
        i += 2;
        readUntil(">");
        continue;
      }
      // Element open or close
      const gt = src.indexOf(">", i);
      if (gt === -1) {
        // malformed — dump rest as text
        stack[stack.length - 1].push({ type: "text", value: src.slice(i) });
        i = src.length;
        break;
      }
      const raw = src.slice(i + 1, gt);
      i = gt + 1;
      if (raw.startsWith("/")) {
        // close tag
        stack.pop();
        if (stack.length === 0) stack.push(root);
        continue;
      }
      const selfClose = raw.endsWith("/");
      const body = selfClose ? raw.slice(0, -1).trim() : raw.trim();
      // parse name & attrs
      const m = body.match(/^([^\s]+)([\s\S]*)$/);
      const name = m ? m[1] : body;
      const attrStr = m ? m[2].trim() : "";
      const attrs: [string, string][] = [];
      const attrRe = /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s]+))/g;
      let am: RegExpExecArray | null;
      while ((am = attrRe.exec(attrStr)) !== null) {
        attrs.push([am[1], am[3] ?? am[4] ?? am[5] ?? ""]);
      }
      const el: XmlNode = { type: "element", name, attrs, children: [] };
      stack[stack.length - 1].push(el);
      if (!selfClose) stack.push(el.children);
    } else {
      // text
      const nextLt = src.indexOf("<", i);
      const end = nextLt === -1 ? src.length : nextLt;
      const text = src.slice(i, end);
      i = end;
      if (text.trim().length > 0) {
        stack[stack.length - 1].push({ type: "text", value: text });
      }
    }
  }
  return root;
}

function XmlAttr({ name, value }: { name: string; value: string }) {
  return (
    <>
      {" "}
      <span className="text-amber-700 dark:text-amber-400">{name}</span>
      <span className="text-muted-foreground">=</span>
      <span className="text-emerald-700 dark:text-emerald-400">"{decodeEntities(value)}"</span>
    </>
  );
}

function NodeView({ node, depth, defaultOpen }: { node: XmlNode; depth: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const indent = { paddingLeft: depth * 12 };

  if (node.type === "text") {
    return (
      <div style={indent} className="whitespace-pre-wrap break-words text-foreground">
        {decodeEntities(node.value).trim()}
      </div>
    );
  }
  if (node.type === "cdata") {
    return (
      <div style={indent} className="text-muted-foreground">
        <span className="text-purple-700 dark:text-purple-400">&lt;![CDATA[</span>
        <span className="whitespace-pre-wrap break-words">{node.value}</span>
        <span className="text-purple-700 dark:text-purple-400">]]&gt;</span>
      </div>
    );
  }
  if (node.type === "comment") {
    return (
      <div style={indent} className="text-muted-foreground italic">
        &lt;!--{node.value}--&gt;
      </div>
    );
  }
  if (node.type === "pi") {
    return (
      <div style={indent} className="text-muted-foreground">
        &lt;?{node.value}?&gt;
      </div>
    );
  }

  const { name, attrs, children } = node;
  const hasChildren = children.length > 0;
  const onlyText = hasChildren && children.length === 1 && children[0].type === "text";

  const openTag = (
    <>
      <span className="text-muted-foreground">&lt;</span>
      <span className="text-sky-700 dark:text-sky-400">{name}</span>
      {attrs.map(([k, v]) => (
        <XmlAttr key={k} name={k} value={v} />
      ))}
      <span className="text-muted-foreground">{hasChildren ? ">" : " />"}</span>
    </>
  );
  const closeTag = (
    <>
      <span className="text-muted-foreground">&lt;/</span>
      <span className="text-sky-700 dark:text-sky-400">{name}</span>
      <span className="text-muted-foreground">&gt;</span>
    </>
  );

  if (!hasChildren) {
    return (
      <div style={indent} className="flex">
        <span className="inline-block w-4" />
        <span>{openTag}</span>
      </div>
    );
  }

  if (onlyText) {
    const t = decodeEntities((children[0] as { type: "text"; value: string }).value).trim();
    return (
      <div style={indent} className="flex">
        <span className="inline-block w-4" />
        <span>
          {openTag}
          <span className="text-foreground">{t}</span>
          {closeTag}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div style={indent} className="flex items-start">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={open ? "Collapse" : "Expand"}
        >
          <ChevronRight
            className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
          />
        </button>
        <span>
          {openTag}
          {!open && (
            <>
              <span className="text-muted-foreground/60"> … </span>
              {closeTag}
            </>
          )}
        </span>
      </div>
      {open && (
        <>
          {children.map((c, idx) => (
            <NodeView key={idx} node={c} depth={depth + 1} defaultOpen={depth < 2} />
          ))}
          <div style={indent} className="flex">
            <span className="inline-block w-4" />
            <span>{closeTag}</span>
          </div>
        </>
      )}
    </div>
  );
}

export function XmlView({ text }: { text: string }) {
  const nodes = useMemo(() => {
    try {
      return parseXml(text ?? "");
    } catch {
      return null;
    }
  }, [text]);

  if (!nodes || nodes.length === 0) {
    return (
      <pre className="text-[11px] font-mono whitespace-pre-wrap break-words">{decodeEntities(text ?? "")}</pre>
    );
  }

  return (
    <div className="text-[11px] font-mono leading-relaxed">
      {nodes.map((n, i) => (
        <NodeView key={i} node={n} depth={0} defaultOpen />
      ))}
    </div>
  );
}
