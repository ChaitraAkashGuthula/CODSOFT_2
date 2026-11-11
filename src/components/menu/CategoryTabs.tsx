"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { Utensils, Wine, CakeSlice, Salad } from "lucide-react";

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

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "appetizers":
        return Salad;
      case "mains":
        return Utensils;
      case "desserts":
        return CakeSlice;
      case "beverages":
        return Wine;
      default:
        return Utensils;
    }
  };

  const totalAllItems = Object.values(itemCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => setSelectedCategory("all")}
        className={`flex items-center gap-2 shrink-0 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
          selectedCategory === "all"
            ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40"
            : "bg-[#181b22] text-zinc-300 border border-white/5 hover:border-white/10 hover:text-white"
        }`}
      >
        <span>All Selections</span>
        <span
          className={`rounded-full px-1.5 py-0.2 text-[10px] ${
            selectedCategory === "all" ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"
          }`}
        >
          {totalAllItems}
        </span>
      </button>

      {categories.map((cat) => {
        const Icon = getCategoryIcon(cat.slug);
        const isActive = selectedCategory === cat.slug;
        const count = itemCounts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`flex items-center gap-2 shrink-0 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
              isActive
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40"
                : "bg-[#181b22] text-zinc-300 border border-white/5 hover:border-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{cat.name}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                isActive ? "bg-white/20 text-white" : "bg-white/5 text-zinc-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
