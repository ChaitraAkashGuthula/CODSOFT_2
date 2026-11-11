"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { playSuccessChime } from "@/lib/audio";
import confetti from "canvas-confetti";
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  Receipt,
  ArrowRight,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const {
    cart,
    clearCart,
    setIsCartOpen,
    orderType,
    selectedTableNumber,
    selectedTableId,
    orderNotes,
    tipPercentage,
    getCartSubtotal,
    getCartTax,
    getCartTip,
    getCartTotal,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  if (!isOpen) return null;

  const total = getCartTotal();

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        type: orderType,
        tableId: orderType === "DINE_IN" ? selectedTableId : null,
        customerName: customerName || "Guest Diner",
        customerPhone: customerPhone || "+1 (555) 000-0000",
        customerEmail: "guest@example.com",
        notes: orderNotes || undefined,
        tip: getCartTip(),
        paymentMethod: "CARD",
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          customInstructions: item.customInstructions || null,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order creation failed");
      }

      // Success
      setCreatedOrder(data.order);
      playSuccessChime();

      // Trigger Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Clear the local cart
      clearCart();
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = () => {
    if (createdOrder) {
      onClose();
      setIsCartOpen(false);
      router.push(`/tracker?orderId=${createdOrder.orderNumber}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#141821] shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-bold font-serif text-white">
              {createdOrder ? "Payment Confirmed" : "Mock Payment Checkout"}
            </h2>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="rounded-full p-1 text-zinc-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {createdOrder ? (
            /* Success confirmation screen */
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
                  {createdOrder.orderNumber}
                </span>
                <h3 className="mt-2 text-2xl font-bold font-serif text-white">
                  Order Successfully Dispatched!
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Your ticket has been sent to the Kitchen Display System (KDS). The brigade is
                  preparing your dishes.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Service Mode:</span>
                  <span className="text-white font-medium">{createdOrder.type}</span>
                </div>
                {createdOrder.table && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Table Assignment:</span>
                    <span className="text-white font-medium">Table #{createdOrder.table.tableNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Guest Name:</span>
                  <span className="text-white font-medium">{createdOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-zinc-400 pt-2 border-t border-white/5 font-semibold">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">${createdOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleTrackOrder}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-900/40 hover:from-rose-500 hover:to-rose-600 transition"
              >
                <span>Watch Live Order Progress</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Payment Form */
            <form onSubmit={handlePay} className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest Name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Card Details (Mocked Sandbox)
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-9 pr-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Expires</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">CVC / CVV</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Summary Pill */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Order Type:</span>
                  <span className="text-zinc-200 font-medium">
                    {orderType === "DINE_IN" ? `Dine-in (Table #${selectedTableNumber ?? 2})` : orderType}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal + 8% Tax + Tip:</span>
                  <span className="text-zinc-200 font-medium">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>256-bit SSL encrypted mock payment test environment</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-900/40 hover:from-rose-500 hover:to-rose-600 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Authorize & Pay ${total.toFixed(2)}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
