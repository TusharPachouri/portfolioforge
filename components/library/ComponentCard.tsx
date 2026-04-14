"use client";

import { ComponentEntry } from "@/lib/components/registry";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, Eye } from "lucide-react";
import Link from "next/link";
import { useBuilderState } from "@/hooks/useBuilderState";
import { cn } from "@/lib/utils";

interface Props {
  component: ComponentEntry;
}

// Gradient palette for thumbnails
const GRADIENTS: Record<string, string> = {
  Hero: "from-violet-100 to-indigo-100",
  About: "from-blue-50 to-cyan-100",
  Skills: "from-emerald-50 to-teal-100",
  Projects: "from-orange-50 to-amber-100",
  Experience: "from-pink-50 to-rose-100",
  Education: "from-sky-50 to-blue-100",
  Contact: "from-purple-50 to-fuchsia-100",
  Footer: "from-zinc-50 to-zinc-100",
  Stats: "from-green-50 to-emerald-100",
  Testimonials: "from-yellow-50 to-amber-100",
  Gallery: "from-red-50 to-pink-100",
  Badge: "from-indigo-50 to-violet-100",
  Card: "from-slate-50 to-zinc-100",
  Button: "from-zinc-100 to-zinc-200",
  Timeline: "from-teal-50 to-cyan-100",
  Avatar: "from-pink-50 to-rose-100",
  Tag: "from-purple-50 to-violet-100",
  Heading: "from-gray-50 to-zinc-100",
};

export default function ComponentCard({ component }: Props) {
  const { state, addComponent, removeComponent } = useBuilderState();
  const isAdded = state.selectedComponentIds.includes(component.id);
  const gradient = GRADIENTS[component.subcategory] ?? "from-zinc-50 to-zinc-100";

  return (
    <div className={cn(
      "group relative bg-white border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      isAdded ? "border-zinc-900 shadow-sm" : "border-zinc-200"
    )}>
      {/* Thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-end p-3`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="text-5xl font-black text-zinc-400">{component.subcategory[0]}</div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors" />
        {/* Tier badge top-right */}
        <div className="absolute top-2.5 right-2.5">
          <Badge variant={component.tier === "pro" ? "pro" : "free"}>
            {component.tier === "pro" ? "Pro" : "Free"}
          </Badge>
        </div>
        {/* Quick actions on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/components/${component.id}`}
            className="inline-flex items-center gap-1.5 bg-white text-zinc-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors">
            <Eye className="h-3.5 w-3.5" /> Preview
          </Link>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-zinc-900 leading-tight">{component.name}</h3>
          <button
            onClick={() => isAdded ? removeComponent(component.id) : addComponent(component.id)}
            className={cn(
              "flex-shrink-0 h-7 w-7 rounded-md flex items-center justify-center transition-all",
              isAdded
                ? "bg-zinc-900 text-white hover:bg-red-500"
                : "border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 hover:bg-zinc-50"
            )}
            title={isAdded ? "Remove from portfolio" : "Add to portfolio"}
          >
            {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="text-xs text-zinc-400 line-clamp-2">{component.description}</p>
      </div>
    </div>
  );
}
