"use client";

import React, { useEffect, useState } from "react";
import { MenuHero } from "@/components/menu/MenuHero";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { DishCard } from "@/components/menu/DishCard";
import { useAppStore } from "@/lib/store";
import { Utensils, AlertCircle, RefreshCw } from "lucide-react";

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  preparationTime: number;
  calories: number | null;
  allergens: string[];
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    searchQuery,
    selectedCategory,
    vegOnly,
    veganOnly,
    glutenFreeOnly,
  } = useAppStore();

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load menu");
      }
      setCategories(data.categories || []);
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Compute item counts per category
  const itemCounts: Record<string, number> = {};
  items.forEach((item) => {
    itemCounts[item.categoryId] = (itemCounts[item.categoryId] || 0) + 1;
  });

  // Filter items based on active search, category, and dietary preferences
  const filteredItems = items.filter((item) => {
    // 1. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category?.name.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Category
    if (selectedCategory !== "all") {
      if (item.category?.slug !== selectedCategory) return false;
    }

    // 3. Dietary
    if (vegOnly && !item.isVegetarian) return false;
    if (veganOnly && !item.isVegan) return false;
    if (glutenFreeOnly && !item.isGlutenFree) return false;

    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-8">
      {/* Hero section with search & dietary tags */}
      <MenuHero />

      {/* Category Navigation Pills */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-2 bg-[#0f1115]/80 backdrop-blur-md sm:mx-0 sm:px-0">
        <CategoryTabs categories={categories} itemCounts={itemCounts} />
      </div>

      {/* Main Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-3xl border border-white/5 bg-[#171b24] p-4"
            >
              <div className="h-44 rounded-2xl bg-white/5"></div>
              <div className="mt-4 h-4 w-3/4 rounded bg-white/5"></div>
              <div className="mt-2 h-3 w-1/2 rounded bg-white/5"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/5 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-rose-400 mb-2" />
          <h3 className="text-lg font-bold text-white">Unable to Load Menu</h3>
          <p className="mt-1 text-sm text-zinc-400">{error}</p>
          <button
            onClick={fetchMenu}
            className="mt-4 flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] p-16 text-center text-zinc-400">
          <Utensils className="h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-base font-bold text-white">No dishes match your criteria</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm">
            Try resetting your dietary filters or searching with a different culinary keyword.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Showing <strong className="text-white">{filteredItems.length}</strong> culinary dishes
            </span>
            {selectedCategory !== "all" && (
              <span className="capitalize text-rose-400 font-medium">
                Category: {selectedCategory}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
