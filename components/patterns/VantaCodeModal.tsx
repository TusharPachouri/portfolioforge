"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Copy, Check, Eye, X, Zap } from "lucide-react";

interface Props {
  name: string;
  code: string;
  previewHref: string;
  onClose: () => void;
}

export default function VantaCodeModal({ name, code, previewHref, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; opener?.focus(); };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "Tab" && panelRef.current) {
      const els = panelRef.current.querySelectorAll<HTMLElement>("button, a[href]");
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true); setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopyFailed(true); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose} onKeyDown={handleKeyDown}>
      <div
        ref={panelRef}
        role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 id={titleId} className="font-semibold text-zinc-900">{name}</h3>
              <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Zap className="h-2.5 w-2.5 text-yellow-500" aria-hidden="true" />
                WebGL · Vanta.js
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">HTML snippet + React component</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="h-9 w-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Code block */}
        <pre className="bg-zinc-950 text-zinc-100 rounded-xl p-4 text-[11px] overflow-x-auto overflow-y-auto max-h-72 font-mono mb-4 leading-relaxed">
          {code}
        </pre>

        {copyFailed && (
          <p role="alert" className="text-xs text-red-600 mb-3">
            Couldn&apos;t access clipboard — select the code above and copy manually.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button type="button" onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer">
            {copied
              ? <><Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Copied!</>
              : <><Copy className="h-4 w-4" aria-hidden="true" /> Copy Code</>}
          </button>
          <Link href={previewHref} onClick={onClose}
            className="flex items-center justify-center gap-2 border border-zinc-200 text-zinc-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors">
            <Eye className="h-4 w-4" aria-hidden="true" /> Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
