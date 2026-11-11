"use client";

import React from "react";
import { useAppStore } from "@/lib/store";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryTabsProps {
  categories: Category[];
  itemCounts: Record<string, number>;
}

export function CategoryTabs({ categories, itemCounts }: CategoryTabsProps) {
  const { selectedCategory, setSelectedCategory } = useAppStore();

  const totalAllItems = Object.values(itemCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/[0.06] scrollbar-none">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-tight rounded-md transition-colors shrink-0 ${
          selectedCategory === "all"
            ? "bg-[#181d25] text-zinc-100 border border-white/10 shadow-sm"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
        }`}
      >
        <span>Complete Tasting</span>
        <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
          ({totalAllItems})
        </span>
      </button>

      {categories.map((cat, idx) => {
        const isActive = selectedCategory === cat.slug;
        const count = itemCounts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-tight rounded-md transition-colors shrink-0 ${
              isActive
                ? "bg-[#181d25] text-zinc-100 border border-white/10 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
            }`}
          >
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              0{idx + 1}
            </span>
            <span>{cat.name}</span>
            <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
