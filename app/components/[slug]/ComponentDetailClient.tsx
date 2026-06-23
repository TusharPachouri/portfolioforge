"use client";

import { ComponentEntry } from "@/lib/components/registry";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { componentMap } from "@/lib/components/map";
import { Badge } from "@/components/ui/badge";
import { useBuilderState } from "@/hooks/useBuilderState";
import { Plus, Check, ArrowLeft, Tag, Sparkles, Copy, Code2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { highlight } from "sugar-high";

// sugar-high (this version) outputs style="color:var(--sh-keyword)" etc.
// We resolve those CSS vars to real hex values so no stylesheet is needed.
const SH_VAR_COLORS: Record<string, string> = {
  "sh-keyword":     "#569cd6",
  "sh-string":      "#ce9178",
  "sh-comment":     "#6a9955",
  "sh-jsxliterals": "#4ec9b0",
  "sh-property":    "#9cdcfe",
  "sh-entity":      "#dcdcaa",
  "sh-class":       "#4ec9b0",
  "sh-identifier":  "#d4d4d4",
  "sh-sign":        "#d4d4d4",
  "sh-space":       "#d4d4d4",
};

// Replace var(--sh-*) with real hex colors and split into per-line HTML.
// sugar-high wraps each line in <span class="sh__line">…</span> separated by \n.
// We split on \n then slice off the known prefix/suffix — no nested-span regex issues.
function highlightLines(code: string): string[] {
  const raw = highlight(code)
    .replace(/var\(--(sh-[\w]+)\)/g, (_, name) => SH_VAR_COLORS[name] ?? "#d4d4d4")
    .replace(/style="color:#6a9955"/g, 'style="color:#6a9955;font-style:italic"');

  const PREFIX = '<span class="sh__line">';
  const SUFFIX = "</span>";

  return raw.split("\n").map(line =>
    line.startsWith(PREFIX) ? line.slice(PREFIX.length, line.length - SUFFIX.length) : line
  );
}

interface Props {
  component: ComponentEntry;
  related: ComponentEntry[];
  sourceCode: string;
  fileName: string;
}

// ── Code block with sugar-high syntax highlighting + line numbers ─────────────

function CodeBlock({ code, fileName }: { code: string; fileName: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const highlightedLines = useMemo(() => highlightLines(code), [code]);

  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#1e1e1e] shadow-2xl shadow-black/40">
      {/* Top bar — macOS chrome style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#252526]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-1 text-xs font-mono text-zinc-500 tracking-tight">
            {fileName}.tsx
          </span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer px-2.5 py-1 rounded-md hover:bg-zinc-700/60"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> Copy</>
          )}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-auto max-h-[600px] custom-scrollbar">
        <pre
          className="text-[13px] leading-[1.7] py-5 font-mono min-w-max"
          style={{ color: "#d4d4d4" }}
          aria-label={`Source code for ${fileName}`}
        >
          {highlightedLines.map((html, i) => (
            <div key={i} className="flex min-w-0 hover:bg-white/[0.03] group">
              {/* Line number gutter */}
              <span
                className="sticky left-0 text-right shrink-0 select-none w-12 pr-5 text-zinc-600 group-hover:text-zinc-500 tabular-nums bg-[#1e1e1e] group-hover:bg-[#272727] transition-colors"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {/* Highlighted line — safe: content comes from filesystem, not user input */}
              <span
                className="pr-8 whitespace-pre"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: html || " " }}
              />
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function ComponentDetailClient({ component, related, sourceCode, fileName }: Props) {
  const { state, addComponent, removeComponent } = useBuilderState();
  const { portfolioData, isCustom } = usePortfolio();
  const isAdded = state.selectedComponentIds.includes(component.id);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const SectionComponent = componentMap[component.id];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Back + header */}
        <div className="mb-6">
          <Link href="/components" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to library
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-zinc-900">{component.name}</h1>
                <Badge variant={component.tier === "pro" ? "pro" : "free"}>
                  {component.tier === "pro" ? "Pro" : "Free"}
                </Badge>
              </div>
              <p className="text-zinc-500 text-sm">{component.description}</p>
            </div>
            <button
              onClick={() => isAdded ? removeComponent(component.id) : addComponent(component.id)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                isAdded
                  ? "bg-zinc-100 text-zinc-700 hover:bg-red-50 hover:text-red-600"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              )}
            >
              {isAdded ? <><Check className="h-4 w-4" /> Added</> : <><Plus className="h-4 w-4" /> Add to portfolio</>}
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
          <Badge variant="secondary">{component.category}</Badge>
          <Badge variant="secondary">{component.subcategory}</Badge>
          {component.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-xs bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">
              <Tag className="h-3 w-3" />{t}
            </span>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer",
                activeTab === "preview"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer",
                activeTab === "code"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Code2 className="h-3.5 w-3.5" /> Code
            </button>
          </div>

          {isCustom ? (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Showing your data
            </span>
          ) : (
            <Link href="/personalize" className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors">
              <Sparkles className="h-3 w-3" /> Personalize to see your data →
            </Link>
          )}
        </div>

        {/* Preview tab — kept mounted so SectionComponent never re-initialises */}
        <div className={cn("border border-zinc-200 rounded-2xl overflow-hidden mb-8 bg-white shadow-sm", activeTab !== "preview" && "hidden")}>
          <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-2 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2 text-xs text-zinc-400">
              {isCustom ? "Preview with your data" : "Preview with demo data"}
            </span>
          </div>
          {SectionComponent ? (
            <SectionComponent data={portfolioData} />
          ) : (
            <div className="py-20 text-center text-zinc-400">
              <p>Preview not available for this component yet.</p>
            </div>
          )}
        </div>

        {/* Code tab — kept mounted so CodeBlock state is preserved */}
        <div className={cn("mb-8", activeTab !== "code" && "hidden")}>
          <CodeBlock code={sourceCode} fileName={fileName} />
          <p className="mt-3 text-xs text-zinc-400 text-center">
            Copy this file into your project&apos;s{" "}
            <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-600">components/sections/</code>{" "}
            folder.
          </p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Related components</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/components/${r.id}`}
                  className="border border-zinc-200 rounded-xl p-4 hover:shadow-sm hover:border-zinc-300 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-zinc-900">{r.name}</span>
                    <Badge variant={r.tier === "pro" ? "pro" : "free"}>{r.tier === "pro" ? "Pro" : "Free"}</Badge>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
