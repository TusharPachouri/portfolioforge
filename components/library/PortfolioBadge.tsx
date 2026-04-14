"use client";

import { useBuilderState } from "@/hooks/useBuilderState";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function PortfolioBadge() {
  const { state } = useBuilderState();
  const count = state.selectedComponentIds.length;
  if (count === 0) return null;
  return (
    <Link href="/preview"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium hover:bg-zinc-700 transition-all">
      <Layers className="h-4 w-4" />
      Preview portfolio
      <span className="bg-white text-zinc-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
        {count}
      </span>
    </Link>
  );
}
