"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Copy, Check, Eye, X } from "lucide-react";

interface Props {
  name: string;
  css: string;
  previewHref: string;
  onClose: () => void;
}

export default function PatternCodeModal({ name, css, previewHref, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    // Keep Tab focus inside the dialog
    if (e.key === "Tab" && panelRef.current) {
      const focusables = panelRef.current.querySelectorAll<HTMLElement>('button, a[href]');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 id={titleId} className="font-semibold text-zinc-900">{name}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">CSS snippet</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <pre className="bg-zinc-950 text-zinc-100 rounded-xl p-4 text-xs overflow-x-auto font-mono mb-4 leading-relaxed">
          {css}
        </pre>
        {copyFailed && (
          <p role="alert" className="text-xs text-red-600 mb-3">
            Couldn&apos;t access the clipboard — select the code above and copy it manually.
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            {copied ? (
              <><Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> Copied!</>
            ) : (
              <><Copy className="h-4 w-4" aria-hidden="true" /> Copy CSS</>
            )}
          </button>
          <Link
            href={previewHref}
            className="flex items-center justify-center gap-2 border border-zinc-200 text-zinc-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            onClick={onClose}
          >
            <Eye className="h-4 w-4" aria-hidden="true" /> Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
