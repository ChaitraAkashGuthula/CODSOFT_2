"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { playSuccessChime } from "@/lib/audio";
import confetti from "canvas-confetti";
import {
  X,
  CreditCard,
  Lock,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
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
        customerName: customerName || "Customer",
        customerPhone: customerPhone || "+1 (555) 000-0000",
        customerEmail: "customer@example.com",
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

      setCreatedOrder(data.order);
      playSuccessChime();

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 },
      });

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
      router.push(`/track/${createdOrder.orderNumber}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#FFFFFF] text-[#1C1C1C] shadow-2xl font-sans border border-[#E8E8E8]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E8E8] p-5 bg-[#F8F9FA]">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#1C1C1C]">
              {createdOrder ? "Order Confirmed!" : "Payment & Checkout"}
            </h2>
            <p className="text-xs text-[#686B78]">
              {createdOrder
                ? "Your order is placed with the restaurant"
                : "Safe & Secure 256-bit encrypted transaction"}
            </p>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="rounded-full p-1 text-[#686B78] hover:bg-[#E8E8E8] transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {createdOrder ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F8A65]/10 text-[#0F8A65]">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#0F8A65] bg-[#0F8A65]/10 px-3 py-1 rounded-full">
                  ORDER ID: {createdOrder.orderNumber}
                </span>
                <h3 className="mt-3 text-xl font-heading font-extrabold text-[#1C1C1C]">
                  Order Placed Successfully!
                </h3>
                <p className="mt-1 text-xs text-[#686B78] max-w-xs mx-auto">
                  The restaurant kitchen has received your ticket and begun food preparation.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-4 text-left text-xs space-y-2">
                <div className="flex justify-between text-[#686B78]">
                  <span>Delivery/Service Mode:</span>
                  <strong className="text-[#1C1C1C]">{createdOrder.type}</strong>
                </div>
                {createdOrder.table && (
                  <div className="flex justify-between text-[#686B78]">
                    <span>Table Assignment:</span>
                    <strong className="text-[#1C1C1C]">Table #{createdOrder.table.tableNumber}</strong>
                  </div>
                )}
                <div className="flex justify-between text-[#686B78]">
                  <span>Customer Name:</span>
                  <strong className="text-[#1C1C1C]">{createdOrder.customerName}</strong>
                </div>
                <div className="flex justify-between text-[#686B78] pt-2 border-t border-[#E8E8E8] font-bold">
                  <span className="text-[#1C1C1C]">Total Paid:</span>
                  <span className="text-[#0F8A65] text-sm tabular-nums font-mono font-extrabold">
                    {formatPrice(createdOrder.total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleTrackOrder}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E23744] hover:bg-[#cb202d] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-btn transition"
              >
                <span>Track Live Order Status</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 text-xs text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 text-xs text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                  Card Number (Test Sandbox)
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#93959F]" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] pl-10 pr-3 py-2.5 font-mono text-xs text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 font-mono text-xs text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 font-mono text-xs text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#686B78] pt-1">
                <ShieldCheck className="h-4 w-4 text-[#0F8A65]" />
                <span>Card data is processed via secure mock gateway token</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F8A65] hover:bg-[#0c7354] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-btn transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Pay {formatPrice(total)}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
