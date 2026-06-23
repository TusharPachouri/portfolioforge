"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Code2, Zap, Tag, Palette } from "lucide-react";
import { highlight } from "sugar-high";
import { cn } from "@/lib/utils";
import type { VantaPatternEntry } from "@/lib/patterns/vantaTypes";

// ── Syntax highlighting (VS Code Dark+) ──────────────────────────────────────

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

// ── Code Block ────────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const highlightedLines = useMemo(() => highlightLines(code), [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#1e1e1e] shadow-2xl shadow-black/40">
      {/* macOS chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#252526]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-1 text-xs font-mono text-zinc-500 tracking-tight">snippet.tsx</span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer px-2.5 py-1 rounded-md hover:bg-zinc-700/60"
        >
          {copied
            ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied</>
            : <><Copy className="h-3.5 w-3.5" /> Copy</>}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-auto max-h-[560px]">
        <pre
          className="text-[13px] leading-[1.7] py-5 font-mono min-w-max"
          style={{ color: "#d4d4d4" }}
        >
          {highlightedLines.map((html, i) => (
            <div key={i} className="flex min-w-0 hover:bg-white/[0.03] group">
              <span
                className="sticky left-0 text-right shrink-0 select-none w-12 pr-5 text-zinc-600 group-hover:text-zinc-500 tabular-nums bg-[#1e1e1e] group-hover:bg-[#272727] transition-colors"
                aria-hidden="true"
              >
                {i + 1}
              </span>
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

// ── Main ──────────────────────────────────────────────────────────────────────

interface Props {
  pattern: Omit<VantaPatternEntry, "toCode">;
  code: string;
}

export default function VantaPreviewClient({ pattern, code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef    = useRef<{ destroy: () => void } | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!containerRef.current) return;
      const { mountVanta } = await import("@/lib/patterns/vantaLoader");
      const fx = await mountVanta(containerRef.current, pattern.vantaEffect, pattern.vantaConfig);
      if (cancelled) { fx?.destroy(); return; }
      effectRef.current = fx;
    }
    boot();
    return () => { cancelled = true; effectRef.current?.destroy(); };
  }, [pattern.vantaConfig, pattern.vantaEffect]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Back */}
        <Link
          href="/patterns"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Pattern Library
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h1 className="text-2xl font-bold text-zinc-900">{pattern.name}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-zinc-900 text-white px-2.5 py-1 rounded-full">
                <Zap className="h-3 w-3 text-yellow-400" aria-hidden="true" />
                WebGL
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pattern.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-zinc-50 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full capitalize">
                  <Tag className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/pattern"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-700 transition-all whitespace-nowrap"
          >
            <Palette className="h-4 w-4" aria-hidden="true" />
            Apply to Dashboard
          </Link>
        </div>

        {/* Tab bar */}
        <div className="inline-flex items-center gap-1 p-1 bg-zinc-100 rounded-lg mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer",
              activeTab === "preview" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer",
              activeTab === "code" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Code2 className="h-3.5 w-3.5" /> Code
          </button>
        </div>

        {/* Preview tab */}
        <div className={cn("mb-8", activeTab !== "preview" && "hidden")}>
          <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            {/* Browser chrome */}
            <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-2 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-2 text-xs text-zinc-400">Live WebGL preview</span>
            </div>
            {/* Vanta canvas */}
            <div
              ref={containerRef}
              role="img"
              aria-label={`${pattern.name} animated preview`}
              className="w-full aspect-[16/7] bg-[#080814]"
            />
          </div>
        </div>

        {/* Code tab */}
        <div className={cn("mb-8", activeTab !== "code" && "hidden")}>
          <CodeBlock code={code} />
          <p className="mt-3 text-xs text-zinc-400 text-center">
            Copy this snippet into your project. Requires{" "}
            <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-600">npm install three vanta</code>.
          </p>
        </div>

      </div>
    </div>
  );
}
