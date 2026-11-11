"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { DishDetailModal } from "./DishDetailModal";
import { Plus, Minus, Clock } from "lucide-react";

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
  const [imageLoading, setImageLoading] = useState(true);

  const cartItem = cart.find((i) => i.id === item.id);
  const inCartCount = cartItem ? cartItem.quantity : 0;

  // Authentic rating simulation (e.g. 4.6, 4.8)
  const rating = ((item.name.length % 5) * 0.1 + 4.4).toFixed(1);
  const ratingCount = item.name.length * 14 + 68;

  return (
    <>
      <div className="py-5 border-b border-[#E8E8E8] hover:bg-[#FAFAFA] px-2 rounded-xl transition flex items-start justify-between gap-4">
        {/* Left Section (65% width): Info, Veg Badge, Title, Price, Rating, Description */}
        <div className="flex-1 min-w-0 pr-2">
          {/* Veg / Non-Veg Standard Food Symbol */}
          <div className="flex items-center gap-2 mb-1.5">
            {item.isVegetarian || item.isVegan ? (
              <span className="veg-badge" title="Vegetarian"></span>
            ) : (
              <span className="nonveg-badge" title="Non-Vegetarian"></span>
            )}
            {item.isVegan && (
              <span className="text-[10px] font-semibold text-[#0F8A65] bg-[#0F8A65]/10 px-1.5 py-0.2 rounded">
                Vegan
              </span>
            )}
            {item.isGlutenFree && (
              <span className="text-[10px] font-semibold text-[#FC8019] bg-[#FC8019]/10 px-1.5 py-0.2 rounded">
                Gluten-Free
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer font-heading text-base font-bold text-[#1C1C1C] hover:text-[#E23744] transition-colors leading-snug"
          >
            {item.name}
          </h3>

          {/* Price */}
          <div className="mt-1 flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#1C1C1C] text-sm tabular-nums">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Rating Badge (Zomato / Swiggy standard green badge) */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-white bg-[#24963F]">
              <span>★</span>
              <span>{rating}</span>
            </span>
            <span className="text-[11px] text-[#686B78] font-medium">
              ({ratingCount})
            </span>
            <span className="text-[#93959F] text-[10px]">•</span>
            <span className="text-[11px] text-[#686B78] flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#93959F]" />
              <span>{item.preparationTime} mins</span>
            </span>
          </div>

          {/* Description */}
          <p
            onClick={() => setIsModalOpen(true)}
            className="mt-2 text-xs text-[#686B78] line-clamp-2 leading-relaxed cursor-pointer font-sans"
          >
            {item.description}
          </p>
        </div>

        {/* Right Section (35% width): Food Image + Overlapping White ADD Button */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div
            onClick={() => setIsModalOpen(true)}
            className="relative h-[120px] w-[120px] sm:h-[140px] sm:w-[140px] cursor-pointer overflow-hidden rounded-2xl bg-[#F4F5F7] border border-[#E8E8E8]"
          >
            {imageLoading && (
              <div className="absolute inset-0 bg-[#F4F5F7] animate-pulse rounded-2xl" />
            )}
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={140}
              height={140}
              sizes="(max-width: 768px) 120px, 140px"
              className="object-cover rounded-2xl w-full h-full transition-transform duration-300 hover:scale-105"
              onLoad={() => setImageLoading(false)}
            />
          </div>

          {/* Floating Swiggy/Zomato ADD Button overlapping bottom of photo */}
          <div className="absolute -bottom-3 z-10">
            {!item.isAvailable ? (
              <span className="rounded-lg bg-[#F4F5F7] border border-[#E8E8E8] px-3 py-1.5 text-[11px] font-bold text-[#93959F] shadow-sm uppercase">
                Sold Out
              </span>
            ) : inCartCount > 0 ? (
              <div className="flex items-center rounded-lg bg-[#FFFFFF] border border-[#0F8A65] shadow-card px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="flex h-6 w-6 items-center justify-center rounded text-[#0F8A65] font-bold hover:bg-[#F4F5F7] transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-[#0F8A65] tabular-nums">
                  {inCartCount}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="flex h-6 w-6 items-center justify-center rounded text-[#0F8A65] font-bold hover:bg-[#F4F5F7] transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
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
                className="swiggy-add-btn rounded-lg px-6 py-1.5 text-xs font-extrabold uppercase shadow-card active:scale-95"
              >
                ADD
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <DishDetailModal item={item} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
