"use client";

import { useState, useMemo } from "react";
import { registry } from "@/lib/components/registry";
import ComponentCard from "@/components/library/ComponentCard";
import FilterTabs, { FilterTab } from "@/components/library/FilterTabs";
import SearchBar from "@/components/library/SearchBar";
import Sidebar from "@/components/library/Sidebar";
import PortfolioBadge from "@/components/library/PortfolioBadge";

export default function ComponentsClient() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = registry;
    if (filter === "sections") items = items.filter((c) => c.category === "section");
    else if (filter === "primitives") items = items.filter((c) => c.category === "primitive");
    else if (filter === "free") items = items.filter((c) => c.tier === "free");
    else if (filter === "pro") items = items.filter((c) => c.tier === "pro");

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q)) ||
          c.subcategory.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [filter, search]);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block sticky top-14 h-[calc(100vh-3.5rem)]">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 mb-1">Component Library</h1>
            <p className="text-sm text-zinc-500">Tap on mobile or hover on desktop to see options</p>
          </div>

          {/* Search + Filter row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <SearchBar value={search} onChange={setSearch} className="w-full sm:w-64" />
            <FilterTabs active={filter} onChange={setFilter} />
            <span className="text-xs text-zinc-400 ml-auto">{filtered.length} components</span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-400">
              <p className="text-lg font-medium mb-1">No results</p>
              <p className="text-sm">Try a different search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((comp) => (
                <ComponentCard key={comp.id} component={comp} />
              ))}
            </div>
          )}
        </div>
      </main>

      <PortfolioBadge />
    </div>
  );
}
