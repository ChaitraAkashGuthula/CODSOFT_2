"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { CheckoutModal } from "./CheckoutModal";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  MessageSquare,
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

  const tipPresets = [0, 10, 15, 18, 20, 25];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="w-screen max-w-md border-l border-white/10 bg-[#12151c] text-white shadow-2xl flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 bg-[#161a23]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600/20 text-rose-500">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-serif text-white">Your Tasting Order</h2>
                  <p className="text-xs text-zinc-400">
                    {cart.length} {cart.length === 1 ? "dish" : "dishes"} selected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-zinc-400 hover:text-rose-400 transition"
                    title="Clear order"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Service Type Selection */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-black/40 p-1 text-xs">
                <button
                  onClick={() => setOrderType("DINE_IN")}
                  className={`rounded-lg py-1.5 font-medium transition ${
                    orderType === "DINE_IN"
                      ? "bg-rose-600 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  🍽️ Table #{selectedTableNumber ?? 2}
                </button>
                <button
                  onClick={() => setOrderType("TAKEOUT")}
                  className={`rounded-lg py-1.5 font-medium transition ${
                    orderType === "TAKEOUT"
                      ? "bg-rose-600 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  🛍️ Takeout
                </button>
                <button
                  onClick={() => setOrderType("DELIVERY")}
                  className={`rounded-lg py-1.5 font-medium transition ${
                    orderType === "DELIVERY"
                      ? "bg-rose-600 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  🛵 Delivery
                </button>
              </div>

              {orderType === "DINE_IN" && (
                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Dine-in Table:</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedTable(null, num)}
                        className={`h-6 w-6 rounded-md text-[11px] font-bold transition ${
                          selectedTableNumber === num
                            ? "bg-rose-600 text-white"
                            : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
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
                <div className="flex h-full flex-col items-center justify-center text-center py-12 text-zinc-400">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-zinc-500 mb-3">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium text-white">Your cart is currently empty</p>
                  <p className="mt-1 text-xs text-zinc-400 max-w-xs">
                    Browse our digital menu to add handcrafted appetizers, signature mains, or craft elixirs.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#171b24] p-3 text-xs"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{item.name}</h4>
                      <p className="text-amber-400 font-semibold mt-0.5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      {item.customInstructions && (
                        <p className="mt-1 text-[10px] text-zinc-400 italic line-clamp-1">
                          Note: {item.customInstructions}
                        </p>
                      )}
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-lg bg-black/40 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-zinc-300 hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-zinc-300 hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Price Calculations */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 bg-[#151922] p-5 space-y-4">
                {/* Special Prep Instructions */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-rose-400" />
                    <span>Special Kitchen Instructions:</span>
                  </div>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Allergies, table preferences, plating notes..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                {/* Tip Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                    <span>Staff Gratuity / Tip:</span>
                    <span className="text-white font-semibold">
                      {tipPercentage}% (${tip.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tipPresets.map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setTipPercentage(pct)}
                        className={`flex-1 rounded-lg py-1 text-xs font-semibold transition ${
                          tipPercentage === pct
                            ? "bg-amber-500 text-zinc-950 font-bold"
                            : "bg-white/5 text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        {pct === 0 ? "None" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtotal, Tax, Tip, Total */}
                <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="text-white font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span className="text-white font-medium">${tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-amber-400 text-base font-serif">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-900/40 hover:from-rose-500 hover:to-rose-600 transition"
                >
                  <span>Proceed to Payment (${total.toFixed(2)})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
