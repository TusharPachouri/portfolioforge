"use client";

import { cn } from "@/lib/utils";

export type FilterTab = "all" | "sections" | "primitives" | "free" | "pro";

interface Props {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sections", label: "Sections" },
  { id: "primitives", label: "Primitives" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
];

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer",
            active === tab.id
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
