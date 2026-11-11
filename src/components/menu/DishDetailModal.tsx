"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import {
  X,
  Plus,
  Minus,
  Clock,
  Flame,
  AlertTriangle,
  Leaf,
  Sparkles,
  WheatOff,
  ShoppingBag,
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

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  const { addToCart } = useAppStore();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  if (!item) return null;

  const handleAdd = () => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
      },
      quantity,
      instructions
    );
    onClose();
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#151922] shadow-2xl text-white animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-zinc-300 hover:text-white backdrop-blur-md transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 w-full overflow-hidden sm:h-72 bg-zinc-900">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/30 to-transparent"></div>

          {/* Dietary Badges */}
          <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
            {item.isVegetarian && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                <Leaf className="h-3 w-3" /> Veg
              </span>
            )}
            {item.isVegan && (
              <span className="flex items-center gap-1 rounded-full bg-teal-500/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                <Sparkles className="h-3 w-3" /> Vegan
              </span>
            )}
            {item.isGlutenFree && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                <WheatOff className="h-3 w-3" /> Gluten-Free
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white">{item.name}</h2>
              <p className="mt-1 text-sm text-zinc-300 leading-relaxed">{item.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-amber-400 font-serif">
                ${item.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Quick Metrics (Prep Time, Calories, Allergens) */}
          <div className="grid grid-cols-3 gap-2.5 rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
            <div className="flex flex-col items-center justify-center">
              <Clock className="h-4 w-4 text-rose-400 mb-1" />
              <span className="text-[11px] text-zinc-400">Prep Time</span>
              <span className="text-xs font-semibold text-white">{item.preparationTime} mins</span>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-white/5">
              <Flame className="h-4 w-4 text-amber-400 mb-1" />
              <span className="text-[11px] text-zinc-400">Calories</span>
              <span className="text-xs font-semibold text-white">
                {item.calories ? `${item.calories} kcal` : "Custom"}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-orange-400 mb-1" />
              <span className="text-[11px] text-zinc-400">Allergens</span>
              <span className="text-xs font-semibold text-white truncate max-w-[90px]">
                {item.allergens.length > 0 ? item.allergens.join(", ") : "None"}
              </span>
            </div>
          </div>

          {/* Custom Kitchen Instructions */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Special Preparation Notes for the Kitchen:
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Dressing on the side, extra crispy, sauce packed separately..."
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Quantity Controls & Add to Cart Action */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/40 hover:from-rose-500 hover:to-rose-600 transition disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {item.isAvailable ? `Add to Order • $${totalPrice}` : "Currently Sold Out"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
