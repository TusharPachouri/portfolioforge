"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowLeft, Palette, Code2, Zap } from "lucide-react";
import type { VantaPatternEntry } from "@/lib/patterns/vantaTypes";

interface Props {
  pattern: Omit<VantaPatternEntry, "toCode">;
  code: string;
}

export default function VantaPreviewClient({ pattern, code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<{ destroy: () => void } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!containerRef.current) return;
      const THREE = await import("three");
      const VANTA = (await import("vanta/dist/vanta.birds.min" as string)) as {
        default: (opts: object) => { destroy: () => void };
      };
      if (cancelled || !containerRef.current) return;
      effectRef.current = VANTA.default({
        el: containerRef.current,
        THREE,
        ...pattern.vantaConfig,
      });
    }

    boot();
    return () => { cancelled = true; effectRef.current?.destroy(); };
  }, [pattern.vantaConfig]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      setShowCode(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/patterns"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Pattern Library
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: live Vanta animation card */}
        <div
          ref={containerRef}
          role="img"
          aria-label={`${pattern.name} animated preview`}
          className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#080814] shadow-lg"
        >
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
              <Zap className="h-3 w-3 text-yellow-400" aria-hidden="true" />
              WebGL · Vanta.js
            </span>
          </div>
        </div>

        {/* Right: name, tags, actions */}
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">{pattern.name}</h1>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {pattern.tags.map((tag) => (
              <span key={tag} className="text-xs bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full capitalize">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <Link
              href="/dashboard/pattern"
              className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all"
            >
              <Palette className="h-4 w-4" aria-hidden="true" />
              Change Current Theme
            </Link>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCode((s) => !s)}
                aria-expanded={showCode}
                className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 text-zinc-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                {showCode ? "Hide Code" : "View Code"}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 text-zinc-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                {copied ? (
                  <><Check className="h-4 w-4 text-emerald-500" aria-hidden="true" /> Copied!</>
                ) : (
                  <><Copy className="h-4 w-4" aria-hidden="true" /> Copy Code</>
                )}
              </button>
            </div>
            {copyFailed && (
              <p role="alert" className="text-xs text-red-600">
                Couldn&apos;t access the clipboard — select the code below and copy it manually.
              </p>
            )}
          </div>

          {showCode && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                HTML · React / Next.js
              </p>
              <pre className="bg-zinc-950 text-zinc-100 rounded-xl p-4 text-xs font-mono overflow-x-auto overflow-y-auto max-h-64 leading-relaxed">
                {code}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
