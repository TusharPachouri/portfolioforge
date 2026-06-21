"use client";

import Link from "next/link";
import { Eye, Palette, CheckCheck } from "lucide-react";

export interface PatternCardData {
  id: string;
  name: string;
  css: string;
  previewStyle: React.CSSProperties;
  category?: string;
}

interface Props {
  pattern: PatternCardData;
  isActive?: boolean;
  onApply?: () => void;
  onShowCode: () => void;
}

const CATEGORY_PILL: Record<string, string> = {
  animated:   "bg-blue-100 text-blue-700",
  gradient:   "bg-violet-100 text-violet-700",
  geometric:  "bg-emerald-100 text-emerald-700",
  decorative: "bg-amber-100 text-amber-700",
  effects:    "bg-rose-100 text-rose-700",
};

export default function PatternCard({ pattern, isActive = false, onApply, onShowCode }: Props) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isActive
          ? "ring-2 ring-violet-500 ring-offset-2 shadow-lg shadow-violet-100"
          : "ring-1 ring-zinc-200 hover:ring-zinc-300 shadow-sm"
      }`}
    >
      {/* Preview — top portion */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={pattern.previewStyle}
          aria-hidden="true"
        />
        {/* Bottom fade into card body */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/70 to-transparent pointer-events-none" />

        {/* Active badge */}
        {isActive && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            <CheckCheck className="h-3 w-3" /> Applied
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
        {/* Name + category */}
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-zinc-900 truncate leading-snug">{pattern.name}</p>
          {pattern.category && (
            <span
              className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                CATEGORY_PILL[pattern.category] ?? "bg-zinc-100 text-zinc-500"
              }`}
            >
              {pattern.category}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {onApply ? (
            <button
              type="button"
              onClick={onApply}
              aria-pressed={isActive}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.97] px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              {isActive ? "Applied" : "Apply"}
            </button>
          ) : (
            <Link
              href="/dashboard/pattern"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold bg-violet-600 text-white hover:bg-violet-700 px-3 py-2 rounded-xl transition-colors shadow-sm shadow-violet-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              Use
            </Link>
          )}
          <Link
            href={`/patterns/${pattern.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 px-3 py-2 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Eye className="h-3.5 w-3.5 shrink-0" />
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
