"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { DishDetailModal } from "./DishDetailModal";
import {
  Plus,
  Minus,
  Clock,
  Flame,
  Leaf,
  Sparkles,
  WheatOff,
  Eye,
} from "lucide-react";

interface MenuItem {
  id: string;
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
  category?: { name: string };
}

interface DishCardProps {
  item: MenuItem;
}

export function DishCard({ item }: DishCardProps) {
  const { cart, addToCart, updateQuantity } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItem = cart.find((i) => i.id === item.id);
  const inCartCount = cartItem ? cartItem.quantity : 0;

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#161a22] p-3.5 transition-all duration-300 hover:border-white/20 hover:bg-[#1a1e28] hover:shadow-2xl">
        {/* Card Header & Media */}
        <div>
          <div
            onClick={() => setIsModalOpen(true)}
            className="relative h-48 w-full cursor-pointer overflow-hidden rounded-2xl bg-zinc-900"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Quick View Overlay on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <Eye className="h-3.5 w-3.5" /> Details
              </span>
            </div>

            {/* Top Badges (Dietary & Prep Time) */}
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
              {item.isVegetarian && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Leaf className="h-2.5 w-2.5" /> Veg
                </span>
              )}
              {item.isVegan && (
                <span className="flex items-center gap-1 rounded-full bg-teal-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" /> Vegan
                </span>
              )}
              {item.isGlutenFree && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <WheatOff className="h-2.5 w-2.5" /> GF
                </span>
              )}
            </div>

            {/* Preparation Time Pill */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-md">
              <Clock className="h-2.5 w-2.5 text-rose-400" />
              <span>{item.preparationTime}m</span>
            </div>
          </div>

          {/* Dish Information */}
          <div className="mt-3.5 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer font-serif text-base font-bold text-white group-hover:text-rose-400 transition truncate"
              >
                {item.name}
              </h3>
              <span className="shrink-0 font-serif text-base font-extrabold text-amber-400">
                ${item.price.toFixed(2)}
              </span>
            </div>

            <p className="line-clamp-2 text-xs text-zinc-400 leading-relaxed min-h-[32px]">
              {item.description}
            </p>
          </div>
        </div>

        {/* Card Footer: Calories & Cart Action Button */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            {item.calories && (
              <>
                <Flame className="h-3 w-3 text-amber-400" />
                <span>{item.calories} cal</span>
              </>
            )}
          </div>

          <div>
            {!item.isAvailable ? (
              <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg">
                Sold Out
              </span>
            ) : inCartCount > 0 ? (
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-xs font-bold text-white w-4 text-center">
                  {inCartCount}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.imageUrl,
                  })
                }
                className="flex items-center gap-1.5 rounded-xl bg-rose-600/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-900/30 hover:bg-rose-500 transition active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <DishDetailModal item={item} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
