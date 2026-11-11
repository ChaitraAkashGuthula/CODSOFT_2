"use client";

import React, { useEffect, useState } from "react";
import { DishCard } from "@/components/menu/DishCard";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Utensils,
  Search,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

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
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    vegOnly,
    setVegOnly,
    veganOnly,
    setVeganOnly,
    glutenFreeOnly,
    setGlutenFreeOnly,
    cart,
    setIsCartOpen,
    getCartCount,
    getCartTotal,
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

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Compute item counts per category
  const itemCounts: Record<string, number> = {};
  items.forEach((item) => {
    itemCounts[item.categoryId] = (itemCounts[item.categoryId] || 0) + 1;
  });

  // Filter items
  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category?.name.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (vegOnly && !item.isVegetarian) return false;
    if (veganOnly && !item.isVegan) return false;
    if (glutenFreeOnly && !item.isGlutenFree) return false;

    return true;
  });

  // Filter by selected category for main view if single category selected
  const displayCategories =
    selectedCategory === "all"
      ? categories
      : categories.filter((c) => c.slug === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 font-sans">
      {/* Restaurant Overview Header (Swiggy / Zomato outlet banner) */}
      <div className="mb-8 rounded-2xl border border-[#E8E8E8] bg-[#F8F9FA] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1C1C]">
              DineDesk Restaurant & Kitchen
            </h1>
            <span className="rounded-full bg-[#E23744]/10 text-[#E23744] text-[11px] font-bold px-2 py-0.5">
              Live Kitchen
            </span>
          </div>
          <p className="text-xs text-[#686B78] font-medium">
            Royal dum biryanis, sourdough pizzas, smash burgers, tandoori kebabs, thickshakes & desserts.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1C1C1C]">
            <span className="flex items-center gap-1 text-[#24963F]">
              <span>★</span> 4.8 (500+ reviews)
            </span>
            <span className="text-[#93959F]">•</span>
            <span>20–25 mins delivery/prep time</span>
            <span className="text-[#93959F]">•</span>
            <span className="text-[#0F8A65]">Table Dine-in & Takeaway Available</span>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition border ${
              vegOnly
                ? "bg-[#0F8A65] text-white border-[#0F8A65]"
                : "bg-[#FFFFFF] text-[#3E4152] border-[#E8E8E8] hover:bg-[#F4F5F7]"
            }`}
          >
            <span className="veg-badge scale-75"></span>
            <span>Veg Only</span>
          </button>

          <button
            onClick={() => setVeganOnly(!veganOnly)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition border ${
              veganOnly
                ? "bg-[#0F8A65] text-white border-[#0F8A65]"
                : "bg-[#FFFFFF] text-[#3E4152] border-[#E8E8E8] hover:bg-[#F4F5F7]"
            }`}
          >
            Vegan
          </button>

          <button
            onClick={() => setGlutenFreeOnly(!glutenFreeOnly)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition border ${
              glutenFreeOnly
                ? "bg-[#FC8019] text-white border-[#FC8019]"
                : "bg-[#FFFFFF] text-[#3E4152] border-[#E8E8E8] hover:bg-[#F4F5F7]"
            }`}
          >
            Gluten-Free
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Sticky Category Nav (25%) + Right Dish Feed (75%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Fast Category Navigator */}
        <div className="lg:col-span-3 sticky top-20 hidden lg:block rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-3 shadow-sm">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#93959F] border-b border-[#E8E8E8] mb-2">
            Categories ({items.length} items)
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition text-left ${
                selectedCategory === "all"
                  ? "bg-[#E23744] text-white shadow-sm"
                  : "text-[#3E4152] hover:bg-[#F8F9FA] hover:text-[#E23744]"
              }`}
            >
              <span>Full Menu</span>
              <span className="tabular-nums font-mono text-[11px] opacity-80">
                {items.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              const count = itemCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition text-left ${
                    isActive
                      ? "bg-[#E23744] text-white shadow-sm"
                      : "text-[#3E4152] hover:bg-[#F8F9FA] hover:text-[#E23744]"
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="tabular-nums font-mono text-[11px] opacity-80 shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Grouped Dish Feed */}
        <div className="lg:col-span-9 space-y-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-2xl bg-[#F4F5F7] p-4 flex gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-[#E8E8E8] rounded"></div>
                    <div className="h-3 w-1/4 bg-[#E8E8E8] rounded"></div>
                    <div className="h-3 w-3/4 bg-[#E8E8E8] rounded"></div>
                  </div>
                  <div className="h-24 w-32 bg-[#E8E8E8] rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-[#E23744] mb-2" />
              <h3 className="font-heading font-bold text-base text-[#1C1C1C]">
                Unable to load menu feed
              </h3>
              <p className="mt-1 text-xs text-[#686B78]">{error}</p>
              <button
                onClick={fetchMenu}
                className="mt-4 rounded-xl bg-[#E23744] px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            displayCategories.map((category) => {
              const categoryItems = filteredItems.filter(
                (item) => item.categoryId === category.id
              );
              if (categoryItems.length === 0) return null;

              return (
                <div
                  key={category.id}
                  id={category.slug}
                  className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm"
                >
                  {/* Category Title Header */}
                  <div className="pb-3 border-b border-[#E8E8E8] mb-2 flex items-baseline justify-between">
                    <div>
                      <h2 className="font-heading text-lg font-extrabold text-[#1C1C1C]">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-xs text-[#686B78] mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#686B78]">
                      {categoryItems.length} items
                    </span>
                  </div>

                  {/* Horizontal Dish Cards Feed */}
                  <div className="divide-y divide-[#E8E8E8]">
                    {categoryItems.map((item) => (
                      <DishCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar (Swiggy / Zomato standard) */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between rounded-2xl bg-[#0F8A65] text-white p-3.5 sm:p-4 shadow-elevated">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wide">
                  {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"} ADDED
                </span>
                <p className="font-mono text-xs font-semibold tabular-nums text-white/90">
                  Total: {formatPrice(cartTotal)} plus taxes
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFFFFF] text-[#0F8A65] font-extrabold text-xs px-5 py-2.5 shadow-sm hover:bg-white/90 transition active:scale-95"
            >
              <span>View Cart</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
