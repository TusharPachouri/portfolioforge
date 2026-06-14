"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowLeft, Palette, Code2 } from "lucide-react";

interface RelatedPattern {
  id: string;
  name: string;
  previewStyle: React.CSSProperties;
}

interface Props {
  id: string;
  name: string;
  category: string;
  tags: string[];
  previewStyle: React.CSSProperties;
  css: string;
  allPatterns: RelatedPattern[];
}

export default function PatternPreviewClient({ name, category, tags, previewStyle, css, allPatterns }: Props) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      setShowCode(true);
    }
  };

  const thumbnailStyle: React.CSSProperties = { ...previewStyle, opacity: 1 };

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
        {/* Left: large preview */}
        <div>
          <div
            className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 shadow-lg"
            role="img"
            aria-label={`${name} pattern preview`}
          >
            <div className="absolute inset-0" style={thumbnailStyle} />
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 text-zinc-700 text-xs font-semibold px-3 py-1 rounded-full capitalize shadow-sm">
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">{name}</h1>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tags.map((tag) => (
              <span key={tag} className="text-xs bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <Link
              href="/dashboard/pattern"
              className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all"
            >
              <Palette className="h-4 w-4" />
              Change Current Theme
            </Link>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCode((s) => !s)}
                aria-expanded={showCode}
                aria-controls="pattern-css"
                className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 text-zinc-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                {showCode ? "Hide Code" : "View Code"}
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 text-zinc-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                {copied ? (
                  <><Check className="h-4 w-4 text-emerald-500" aria-hidden="true" /> Copied!</>
                ) : (
                  <><Copy className="h-4 w-4" aria-hidden="true" /> Copy CSS</>
                )}
              </button>
            </div>
            {copyFailed && (
              <p role="alert" className="text-xs text-red-600">
                Couldn&apos;t access the clipboard — select the code below and copy it manually.
              </p>
            )}
          </div>

          {/* Code block (toggleable) */}
          {showCode && (
            <div id="pattern-css">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">CSS</p>
              <pre className="bg-zinc-950 text-zinc-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                {css}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Related patterns */}
      {allPatterns.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">More in {category}</h2>
            <Link href="/patterns" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allPatterns.map((p) => (
              <Link
                key={p.id}
                href={`/patterns/${p.id}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute inset-0" style={p.previewStyle} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs font-semibold drop-shadow">{p.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
