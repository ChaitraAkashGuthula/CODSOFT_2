"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { CheckoutModal } from "./CheckoutModal";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Receipt,
  FileText,
  MapPin,
  Utensils,
} from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    orderType,
    setOrderType,
    selectedTableNumber,
    setSelectedTable,
    orderNotes,
    setOrderNotes,
    tipPercentage,
    setTipPercentage,
    getCartSubtotal,
    getCartTax,
    getCartTip,
    getCartTotal,
  } = useAppStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const tip = getCartTip();
  const total = getCartTotal();

  const tipPresets = [0, 10, 15, 20, 25];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="w-screen max-w-md bg-[#FFFFFF] text-[#1C1C1C] shadow-2xl flex flex-col font-sans">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E8E8E8] p-5 bg-[#FFFFFF]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F8A65]/10 text-[#0F8A65]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-extrabold text-[#1C1C1C]">
                    My Order Cart
                  </h2>
                  <p className="text-xs text-[#686B78]">
                    {cart.length} {cart.length === 1 ? "dish" : "dishes"} selected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-[#E23744] hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1.5 text-[#686B78] hover:bg-[#F4F5F7] transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Service Type Selection */}
            <div className="p-4 border-b border-[#E8E8E8] bg-[#F8F9FA] space-y-3">
              <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#FFFFFF] p-1 text-xs border border-[#E8E8E8] shadow-sm">
                <button
                  onClick={() => setOrderType("DINE_IN")}
                  className={`rounded-lg py-2 font-bold transition ${
                    orderType === "DINE_IN"
                      ? "bg-[#E23744] text-white shadow-sm"
                      : "text-[#686B78] hover:text-[#1C1C1C]"
                  }`}
                >
                  🍽️ Table #{selectedTableNumber ?? 2}
                </button>
                <button
                  onClick={() => setOrderType("TAKEOUT")}
                  className={`rounded-lg py-2 font-bold transition ${
                    orderType === "TAKEOUT"
                      ? "bg-[#E23744] text-white shadow-sm"
                      : "text-[#686B78] hover:text-[#1C1C1C]"
                  }`}
                >
                  🛍️ Takeaway
                </button>
                <button
                  onClick={() => setOrderType("DELIVERY")}
                  className={`rounded-lg py-2 font-bold transition ${
                    orderType === "DELIVERY"
                      ? "bg-[#E23744] text-white shadow-sm"
                      : "text-[#686B78] hover:text-[#1C1C1C]"
                  }`}
                >
                  🛵 Delivery
                </button>
              </div>

              {orderType === "DINE_IN" && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#686B78] font-medium">Select Table Number:</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedTable(null, num)}
                        className={`h-7 w-7 rounded-lg font-bold text-xs transition ${
                          selectedTableNumber === num
                            ? "bg-[#1C1C1C] text-white shadow-sm"
                            : "bg-[#FFFFFF] text-[#686B78] border border-[#E8E8E8] hover:bg-[#F4F5F7]"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-16 text-[#686B78]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F5F7] mb-3">
                    <ShoppingBag className="h-8 w-8 text-[#93959F]" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#1C1C1C]">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-xs text-[#686B78] max-w-xs">
                    Explore our menu and add your favorite dishes to build your order.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] p-3 text-xs shadow-sm"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F4F5F7]">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-[#1C1C1C] truncate text-xs">
                        {item.name}
                      </h4>
                      <p className="font-mono text-xs font-bold text-[#1C1C1C] tabular-nums mt-0.5">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.customInstructions && (
                        <p className="mt-0.5 text-[11px] text-[#686B78] italic line-clamp-1">
                          Note: {item.customInstructions}
                        </p>
                      )}
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-[#0F8A65] bg-[#FFFFFF] px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-[#0F8A65] font-bold hover:bg-[#F4F5F7]"
                        >
                          <Minus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-[#0F8A65] tabular-nums font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-[#0F8A65] font-bold hover:bg-[#F4F5F7]"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded p-1 text-[#93959F] hover:text-[#E23744] hover:bg-rose-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Price Breakdown & Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-[#E8E8E8] bg-[#FFFFFF] p-5 space-y-4">
                {/* Kitchen Special Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    Special Cooking / Delivery Instructions:
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Extra napkins, cutlery, less spicy..."
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 text-xs text-[#1C1C1C] placeholder-[#93959F] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>

                {/* Staff Tip Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#686B78] mb-1.5 font-medium">
                    <span>Add Delivery / Restaurant Tip:</span>
                    <span className="font-bold text-[#1C1C1C] tabular-nums">
                      {formatPrice(tip)} ({tipPercentage}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tipPresets.map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setTipPercentage(pct)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition border ${
                          tipPercentage === pct
                            ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                            : "bg-[#FFFFFF] text-[#686B78] border-[#E8E8E8] hover:bg-[#F4F5F7]"
                        }`}
                      >
                        {pct === 0 ? "None" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Details */}
                <div className="rounded-xl bg-[#F8F9FA] border border-[#E8E8E8] p-3.5 space-y-2 text-xs text-[#686B78]">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Restaurant Charges (8%)</span>
                    <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff Tip</span>
                    <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                      {formatPrice(tip)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E8E8E8] text-sm font-extrabold text-[#1C1C1C]">
                    <span>To Pay</span>
                    <span className="font-mono text-[#0F8A65] text-base tabular-nums">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-between rounded-xl bg-[#0F8A65] hover:bg-[#0c7354] px-5 py-3.5 text-sm font-extrabold text-white shadow-btn transition active:scale-95"
                >
                  <span className="tabular-nums font-mono">{formatPrice(total)}</span>
                  <span className="flex items-center gap-1">
                    <span>Proceed to Pay</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
