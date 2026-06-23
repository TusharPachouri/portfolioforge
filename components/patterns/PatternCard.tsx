"use client";

import Link from "next/link";
import { Eye, Palette, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white transition-shadow duration-200 ${
        isActive
          ? "ring-2 ring-violet-500 ring-offset-2 shadow-lg shadow-violet-100"
          : "ring-1 ring-zinc-200 hover:ring-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-100/60"
      }`}
    >
      {/* Preview */}
      <div className="relative h-44 overflow-hidden shrink-0">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={pattern.previewStyle}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/70 to-transparent pointer-events-none" />
        {isActive && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            <CheckCheck className="h-3 w-3" /> Applied
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 px-4 pt-2 pb-4">
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-zinc-900 truncate leading-snug">{pattern.name}</p>
          {pattern.category && (
            <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${CATEGORY_PILL[pattern.category] ?? "bg-zinc-100 text-zinc-500"}`}>
              {pattern.category}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {onApply ? (
            <motion.button
              type="button"
              onClick={onApply}
              aria-pressed={isActive}
              whileTap={{ scale: 0.96 }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 transition-all"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                color: "#fff",
                boxShadow: isActive
                  ? "0 0 0 2px rgba(124,58,237,0.3), 0 4px 14px rgba(109,40,217,0.45)"
                  : "0 2px 8px rgba(109,40,217,0.3)",
              }}
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              {isActive ? "Applied" : "Apply"}
            </motion.button>
          ) : (
            <Link
              href="/dashboard/pattern"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(109,40,217,0.3)",
              }}
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />
              Use
            </Link>
          )}
          <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
            <Link
              href={`/patterns/${pattern.id}`}
              className="w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <Eye className="h-3.5 w-3.5 shrink-0" />
              Preview
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
