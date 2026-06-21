"use client";

import { registry } from "@/lib/components/registry";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const SECTION_SUBCATS = ["Hero", "About", "Skills", "Projects", "Experience", "Education", "Contact", "Footer", "Stats", "Testimonials", "Gallery"] as const;
const PRIMITIVE_SUBCATS = ["Badge", "Card", "Button", "Timeline", "Avatar", "Tag", "Heading"] as const;

interface Props {
  activeSubcat?: string;
  onSubcatChange?: (subcat: string | null) => void;
}

export default function Sidebar({ activeSubcat, onSubcatChange }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ sections: true, primitives: true });
  const toggle = (key: string) => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  const countBySubcat = (sub: string) => registry.filter((c) => c.subcategory === sub).length;

  const handleClick = (sub: string) => {
    if (!onSubcatChange) return;
    onSubcatChange(activeSubcat === sub ? null : sub);
  };

  const itemCls = (sub: string) =>
    cn(
      "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
      activeSubcat === sub
        ? "bg-zinc-900 text-white"
        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
    );

  return (
    <aside className="w-56 flex-shrink-0 border-r border-zinc-100 h-full overflow-y-auto py-4 pr-2">
      {/* Sections */}
      <div className="mb-4">
        <button
          onClick={() => toggle("sections")}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-700 transition-colors cursor-pointer"
        >
          Sections
          {openGroups.sections ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {openGroups.sections && (
          <div className="mt-1 space-y-0.5">
            {SECTION_SUBCATS.map((sub) => {
              const count = countBySubcat(sub);
              if (!count) return null;
              return (
                <button key={sub} onClick={() => handleClick(sub)} className={itemCls(sub)}>
                  <span>{sub}</span>
                  <span className={cn("text-xs", activeSubcat === sub ? "text-white/70" : "text-zinc-400")}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Primitives */}
      <div>
        <button
          onClick={() => toggle("primitives")}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-700 transition-colors cursor-pointer"
        >
          Primitives
          {openGroups.primitives ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {openGroups.primitives && (
          <div className="mt-1 space-y-0.5">
            {PRIMITIVE_SUBCATS.map((sub) => {
              const count = countBySubcat(sub);
              if (!count) return null;
              return (
                <button key={sub} onClick={() => handleClick(sub)} className={itemCls(sub)}>
                  <span>{sub}</span>
                  <span className={cn("text-xs", activeSubcat === sub ? "text-white/70" : "text-zinc-400")}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
