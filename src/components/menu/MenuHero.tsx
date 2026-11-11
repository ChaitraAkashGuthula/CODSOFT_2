"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { Search, Sparkles, Leaf, WheatOff, Flame, X } from "lucide-react";

export function MenuHero() {
  const {
    searchQuery,
    setSearchQuery,
    vegOnly,
    setVegOnly,
    veganOnly,
    setVeganOnly,
    glutenFreeOnly,
    setGlutenFreeOnly,
    orderType,
    setOrderType,
    selectedTableNumber,
  } = useAppStore();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#181d26] via-[#141720] to-[#0f1115] p-6 sm:p-10 shadow-2xl">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-600/15 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"></div>

      <div className="relative z-10 max-w-3xl">
        {/* Service Type Switcher Pill */}
        <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs">
          <button
            onClick={() => setOrderType("DINE_IN")}
            className={`rounded-full px-3.5 py-1 font-medium transition ${
              orderType === "DINE_IN"
                ? "bg-rose-600 text-white shadow-sm shadow-rose-900/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🍽️ Dine-in (Table #{selectedTableNumber ?? 2})
          </button>
          <button
            onClick={() => setOrderType("TAKEOUT")}
            className={`rounded-full px-3.5 py-1 font-medium transition ${
              orderType === "TAKEOUT"
                ? "bg-rose-600 text-white shadow-sm shadow-rose-900/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🛍️ Takeout Pickup
          </button>
          <button
            onClick={() => setOrderType("DELIVERY")}
            className={`rounded-full px-3.5 py-1 font-medium transition ${
              orderType === "DELIVERY"
                ? "bg-rose-600 text-white shadow-sm shadow-rose-900/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🛵 Direct Delivery
          </button>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-serif">
          Artisanal Dining, <br />
          <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
            Prepared to Perfection.
          </span>
        </h1>

        <p className="mt-3 text-sm text-zinc-300 sm:text-base leading-relaxed">
          Explore our seasonal tasting catalog crafted from locally sourced farm ingredients,
          dry-aged cuts, and handcrafted botanical elixirs.
        </p>

        {/* Search & Dietary Filters Container */}
        <div className="mt-6 space-y-3">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish name, truffle, wagyu, sea bass..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-400 focus:border-rose-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-zinc-400">Dietary Preferences:</span>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                vegOnly
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10"
              }`}
            >
              <Leaf className="h-3 w-3 text-emerald-400" />
              <span>Vegetarian</span>
            </button>

            <button
              onClick={() => setVeganOnly(!veganOnly)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                veganOnly
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                  : "bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10"
              }`}
            >
              <Sparkles className="h-3 w-3 text-teal-400" />
              <span>100% Vegan</span>
            </button>

            <button
              onClick={() => setGlutenFreeOnly(!glutenFreeOnly)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                glutenFreeOnly
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10"
              }`}
            >
              <WheatOff className="h-3 w-3 text-amber-400" />
              <span>Gluten-Free</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
