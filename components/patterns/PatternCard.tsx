"use client";

import Link from "next/link";
import { Eye, Code2, Palette } from "lucide-react";

export interface PatternCardData {
  id: string;
  name: string;
  css: string;
  previewStyle: React.CSSProperties;
}

interface Props {
  pattern: PatternCardData;
  /** Marks this pattern as the currently applied theme preview */
  isActive?: boolean;
  /** When provided, the primary action applies the pattern in place; otherwise it links to the dashboard picker */
  onApply?: () => void;
  onShowCode: () => void;
}

const ACTION_BTN =
  "flex-1 flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold py-2 rounded-xl transition-colors cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function PatternCard({ pattern, isActive = false, onApply, onShowCode }: Props) {
  return (
    <div
      className={`group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-lg transition-shadow duration-200 ${
        isActive ? "ring-2 ring-violet-500 ring-offset-2" : ""
      }`}
    >
      {/* Pattern fill */}
      <div className="absolute inset-0" style={pattern.previewStyle} aria-hidden="true" />

      {/* Always-visible name scrim (hidden while the action overlay shows the name) */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 pb-2 pt-6 group-hover:opacity-0 group-focus-within:opacity-0 transition-opacity">
        <p className="text-white text-xs font-semibold drop-shadow truncate">{pattern.name}</p>
      </div>

      {isActive && (
        <div className="absolute top-2 right-2 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          Active
        </div>
      )}

      {/* Action overlay — revealed on hover, keyboard focus, or first tap on touch */}
      <div className="absolute inset-0 flex flex-col justify-between p-3 bg-black/45 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-200">
        <p className="text-white text-xs font-semibold drop-shadow text-center pt-1">{pattern.name}</p>
        <div className="flex gap-1.5">
          {onApply ? (
            <button
              type="button"
              onClick={onApply}
              aria-pressed={isActive}
              aria-label={`Apply ${pattern.name} as page theme`}
              className={`${ACTION_BTN} bg-white/90 hover:bg-white text-zinc-800`}
            >
              <Palette className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Apply</span>
            </button>
          ) : (
            <Link
              href="/dashboard/pattern"
              aria-label={`Use ${pattern.name} in your portfolio`}
              className={`${ACTION_BTN} bg-white/90 hover:bg-white text-zinc-800`}
            >
              <Palette className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Use</span>
            </Link>
          )}
          <Link
            href={`/patterns/${pattern.id}`}
            aria-label={`Preview ${pattern.name}`}
            className={`${ACTION_BTN} bg-white/90 hover:bg-white text-zinc-800`}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Preview</span>
          </Link>
          <button
            type="button"
            onClick={onShowCode}
            aria-label={`View CSS code for ${pattern.name}`}
            className={`${ACTION_BTN} bg-zinc-900/90 hover:bg-zinc-900 text-white`}
          >
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}
