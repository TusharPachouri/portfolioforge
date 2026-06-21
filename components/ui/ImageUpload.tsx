"use client";

import { useId, useRef, useState } from "react";
import { Upload, Loader2, X, RefreshCw, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;

interface Props {
  value: string;
  onChange: (url: string) => void;
  kind: "avatar" | "project" | "gallery";
  aspect?: "square" | "video" | "free";
  label?: string;
}

const ASPECT: Record<NonNullable<Props["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  free: "min-h-32",
};

export default function ImageUpload({ value, onChange, kind, aspect = "free", label }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError("Use a JPG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be under 5MB.");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Upload failed. Please try again.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700">{label}</label>}

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        onChange={onPick}
        className="sr-only"
        disabled={uploading}
      />

      {value ? (
        // Preview with replace / remove
        <div className={cn("group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50", ASPECT[aspect])}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label ?? "Uploaded image"} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 focus-within:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="press-scale inline-flex items-center gap-1.5 bg-white/95 text-zinc-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => { setError(null); onChange(""); }}
              disabled={uploading}
              className="press-scale inline-flex items-center gap-1.5 bg-white/95 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Remove
            </button>
          </div>
        </div>
      ) : (
        // Empty drop zone
        <button
          type="button"
          onClick={openPicker}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={uploading}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
            ASPECT[aspect],
            dragOver
              ? "border-violet-400 bg-violet-50/60"
              : "border-zinc-200 bg-white hover:border-violet-300 hover:bg-violet-50/40",
            uploading && "opacity-70 cursor-wait",
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Upload className="h-5 w-5" aria-hidden="true" />}
          </span>
          <span className="text-sm font-medium text-zinc-600">
            {uploading ? "Uploading…" : (kind === "avatar" ? "Upload avatar" : "Click to upload or drag an image")}
          </span>
          {kind !== "avatar" && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <ImageIcon className="h-3 w-3" aria-hidden="true" /> JPG, PNG, WebP or AVIF · up to 5MB
            </span>
          )}
        </button>
      )}

      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
