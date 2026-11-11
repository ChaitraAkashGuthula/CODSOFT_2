"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { Search, X, Sparkles } from "lucide-react";

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
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141a] p-6 sm:p-10 shadow-sm">
      {/* Subtle architectural grid accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,109,67,0.06),transparent_60%)]"></div>

      <div className="relative z-10 max-w-3xl">
        {/* Service Allocation Segmented Control */}
        <div className="mb-6 inline-flex items-center rounded-lg border border-white/[0.08] bg-[#0c0e12] p-1 text-xs">
          <button
            onClick={() => setOrderType("DINE_IN")}
            className={`rounded-md px-3.5 py-1.5 font-medium transition ${
              orderType === "DINE_IN"
                ? "bg-[#1d222b] text-zinc-100 shadow-sm border border-white/10"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Table #{selectedTableNumber ?? 2} (Reserve Seating)
          </button>
          <button
            onClick={() => setOrderType("TAKEOUT")}
            className={`rounded-md px-3.5 py-1.5 font-medium transition ${
              orderType === "TAKEOUT"
                ? "bg-[#1d222b] text-zinc-100 shadow-sm border border-white/10"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Cellar Takeaway
          </button>
          <button
            onClick={() => setOrderType("DELIVERY")}
            className={`rounded-md px-3.5 py-1.5 font-medium transition ${
              orderType === "DELIVERY"
                ? "bg-[#1d222b] text-zinc-100 shadow-sm border border-white/10"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Curated Delivery
          </button>
        </div>

        {/* Editorial Subtitle & Headline */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4a373]">
            Curated Culinary Catalog
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            Autumn Service 2026
          </span>
        </div>

        <h1 className="font-serif text-3xl font-medium tracking-tight text-zinc-100 sm:text-5xl leading-tight">
          Seasonal Tasting Menu & Cellar Reserve.
        </h1>

        <p className="mt-3 text-sm text-zinc-400 max-w-xl leading-relaxed font-sans">
          Each course is prepared to order using estate-grown botanicals, sustainably caught wild
          proteins, and single-origin reductions.
        </p>

        {/* Search & Dietary Controls */}
        <div className="mt-8 space-y-3">
          {/* Hairline Search Field */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by course, cut, varietal, or ingredient..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#0c0e12] pl-10 pr-9 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-[#c26d43]/60 focus:bg-[#0e1116] focus:outline-none transition font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Understated Outline Dietary Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Dietary:
            </span>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition border ${
                vegOnly
                  ? "border-[#4a5d4e] bg-[#4a5d4e]/20 text-[#a3c9a8]"
                  : "border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/15"
              }`}
            >
              Plant-Forward (Veg)
            </button>

            <button
              onClick={() => setVeganOnly(!veganOnly)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition border ${
                veganOnly
                  ? "border-[#4a5d4e] bg-[#4a5d4e]/20 text-[#a3c9a8]"
                  : "border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/15"
              }`}
            >
              100% Vegan
            </button>

            <button
              onClick={() => setGlutenFreeOnly(!glutenFreeOnly)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition border ${
                glutenFreeOnly
                  ? "border-[#d4a373] bg-[#d4a373]/15 text-[#e0b992]"
                  : "border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/15"
              }`}
            >
              Gluten-Conscious
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
