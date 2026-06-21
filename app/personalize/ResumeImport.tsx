"use client";

import { useRef, useState } from "react";
import { RawUserDetails } from "@/types/portfolio";
import { Loader2, Upload, FileText, Sparkles, AlertCircle, ClipboardPaste } from "lucide-react";

interface Props {
  onParsed: (data: RawUserDetails) => void;
}

export default function ResumeImport({ onParsed }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const send = async (init: RequestInit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/resume", init);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Couldn't read that résumé. Please try again.");
        return;
      }
      onParsed(data.data as RawUserDetails);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF résumé (or paste the text).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("PDF must be under 8MB.");
      return;
    }
    const body = new FormData();
    body.append("file", file);
    send({ method: "POST", body });
  };

  const onPaste = () => {
    if (pasteText.trim().length < 30) {
      setError("Paste a bit more of your résumé text.");
      return;
    }
    send({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: pasteText }) });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50/60 p-5 mb-6">
      <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-violet-200/40 blur-2xl pointer-events-none" aria-hidden="true" />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm mt-0.5">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-900">Import from your résumé</h3>
            <p className="text-sm text-zinc-500 mt-1 leading-relaxed">Upload a PDF and AI fills every field for you — review, then generate.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="press-scale flex-1 inline-flex justify-center items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
            {loading ? "Reading…" : "Upload PDF"}
          </button>
          <button
            type="button"
            onClick={() => { setShowPaste((s) => !s); setError(null); }}
            disabled={loading}
            className="flex-1 inline-flex justify-center items-center gap-1.5 text-sm font-semibold text-zinc-700 bg-white border border-zinc-200 px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            <ClipboardPaste className="h-4 w-4" aria-hidden="true" /> Paste text
          </button>
        </div>
        <input ref={fileRef} type="file" accept="application/pdf" onChange={onFile} className="sr-only" />
      </div>

      {showPaste && (
        <div className="relative mt-4 space-y-2">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={5}
            placeholder="Paste your résumé text here…"
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
          />
          <button
            type="button"
            onClick={onPaste}
            disabled={loading}
            className="press-scale inline-flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
            Extract details
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="relative mt-3 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
