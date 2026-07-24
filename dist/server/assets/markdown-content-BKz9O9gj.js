import { o as cn } from "./api-config-BqoIDxBb.js";
import { Link } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
//#region src/components/markdown-content.tsx
/**
* Escape a string for use in a RegExp.
*/
function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
* Auto-link known component names inside a markdown string.
* Skips fenced code blocks, inline code, and existing markdown links.
*/
function linkifyComponentNames(md, names, productionName) {
	if (!md || !productionName || !names?.length) return md;
	const unique = Array.from(new Set(names.filter(Boolean))).sort((a, b) => b.length - a.length);
	if (!unique.length) return md;
	const pattern = new RegExp(`(?<![\\w./-])(${unique.map(escapeRegex).join("|")})(?![\\w./-])`, "g");
	const encodedProd = encodeURIComponent(productionName);
	return md.split(/(```[\s\S]*?```)/g).map((part) => {
		if (part.startsWith("```")) return part;
		return part.split(/(`[^`]*`|\[[^\]]*\]\([^)]*\))/g).map((seg) => {
			if (!seg) return seg;
			if (seg.startsWith("`") || seg.startsWith("[")) return seg;
			return seg.replace(pattern, (name) => {
				return `[${name}](${`/productions/${encodedProd}/components/${encodeURIComponent(name)}?fromTab=ask`})`;
			});
		}).join("");
	}).join("");
}
function MarkdownContent({ children, className, linkComponents, productionName }) {
	const content = linkComponents && productionName ? linkifyComponentNames(children, linkComponents, productionName) : children;
	return /* @__PURE__ */ jsx("div", {
		className: cn("text-sm text-foreground/90 text-pretty leading-relaxed", "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0", "[&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2", "[&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-muted-foreground [&_h2]:text-[11px]", "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1", "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1", "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1", "[&_li]:text-sm", "[&_code]:font-mono [&_code]:text-[12px] [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded", "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0", "[&_a]:text-iris-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80", "[&_blockquote]:border-l-2 [&_blockquote]:border-iris-brand [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-foreground/80 [&_blockquote]:my-2", "[&_table]:w-full [&_table]:text-xs [&_table]:my-2 [&_table]:border-collapse", "[&_th]:text-left [&_th]:font-semibold [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted", "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1", "[&_hr]:my-3 [&_hr]:border-border", "[&_strong]:font-semibold", className),
		children: /* @__PURE__ */ jsx(ReactMarkdown, {
			remarkPlugins: [remarkGfm],
			components: { a({ href, children, ...props }) {
				if (typeof href === "string" && href.startsWith("/")) return /* @__PURE__ */ jsx(Link, {
					to: href,
					...props,
					children
				});
				return /* @__PURE__ */ jsx("a", {
					href,
					target: "_blank",
					rel: "noopener noreferrer",
					...props,
					children
				});
			} },
			children: content
		})
	});
}
//#endregion
export { MarkdownContent as t };
