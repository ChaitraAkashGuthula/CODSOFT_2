"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Clock, Flame, Star, AlertCircle, ShoppingBag } from "lucide-react";

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
  const rating = ((item.name.length % 5) * 0.1 + 4.4).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#FFFFFF] text-[#1C1C1C] shadow-2xl animate-in zoom-in-95 border border-[#E8E8E8]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFFFF]/90 text-[#1C1C1C] hover:bg-[#FFFFFF] shadow-sm transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Dish Image */}
        <div className="relative h-60 w-full overflow-hidden bg-[#F4F5F7]">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Veg Badge + Title + Rating */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {item.isVegetarian || item.isVegan ? (
                <span className="veg-badge" title="Vegetarian"></span>
              ) : (
                <span className="nonveg-badge" title="Non-Vegetarian"></span>
              )}
              {item.isVegetarian && (
                <span className="text-[11px] font-bold text-[#0F8A65]">VEGETARIAN</span>
              )}
              {!item.isVegetarian && (
                <span className="text-[11px] font-bold text-[#E43B4F]">NON-VEG</span>
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">
                {item.name}
              </h2>
              <span className="font-heading text-xl font-extrabold text-[#1C1C1C] tabular-nums shrink-0">
                {formatPrice(item.price)}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold text-white bg-[#24963F]">
                <span>★</span>
                <span>{rating}</span>
              </span>
              <span className="text-xs text-[#686B78]">
                {item.calories ? `${item.calories} kcal` : "Chef Specialty"}
              </span>
              <span className="text-[#93959F] text-xs">•</span>
              <span className="text-xs text-[#686B78] flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{item.preparationTime} mins cooking time</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-[#686B78] leading-relaxed">
            {item.description}
          </p>

          {/* Allergens warning */}
          {item.allergens.length > 0 && (
            <div className="rounded-xl bg-[#F8F9FA] border border-[#E8E8E8] p-3 text-xs text-[#686B78] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#FC8019] shrink-0" />
              <span>Contains: <strong>{item.allergens.join(", ")}</strong></span>
            </div>
          )}

          {/* Cooking Instructions textarea */}
          <div>
            <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
              Add cooking instructions / customization:
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, dressing on side, no onions, extra crispy..."
              rows={2}
              className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-3 text-xs text-[#1C1C1C] placeholder-[#93959F] focus:border-[#0F8A65] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>

          {/* Quantity Controls & Add to Cart Action */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#E8E8E8]">
            <div className="flex items-center rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] px-2 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1C1C1C] hover:bg-[#FFFFFF] transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#1C1C1C] tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1C1C1C] hover:bg-[#FFFFFF] transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0F8A65] hover:bg-[#0c7354] py-3.5 text-xs font-bold text-white shadow-btn transition disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {item.isAvailable ? `Add item • ${formatPrice(item.price * quantity)}` : "Currently Unavailable"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
