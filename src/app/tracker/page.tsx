"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  BellRing,
  UtensilsCrossed,
  Search,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  customInstructions?: string | null;
  menuItem: {
    name: string;
    imageUrl: string;
    preparationTime: number;
  };
}

interface OrderData {
  id: string;
  orderNumber: string;
  type: string;
  status: "PENDING" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
  table?: { tableNumber: number; location: string } | null;
  customerName: string;
  notes?: string | null;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

function TrackerContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "ORD-1001";

  const [searchCode, setSearchCode] = useState(initialOrderId);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentLiveEvent, setRecentLiveEvent] = useState<string | null>(null);

  const fetchOrder = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/orders/${code}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order not found");
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchCode) {
      fetchOrder(searchCode);
    }
  }, [searchCode]);

  // Connect to SSE for Live Real-Time Status Updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/realtime/events");

      eventSource.addEventListener("order:updated", (e: MessageEvent) => {
        try {
          const updated = JSON.parse(e.data);
          if (
            order &&
            (updated.id === order.id || updated.orderNumber === order.orderNumber)
          ) {
            setOrder(updated);
            setRecentLiveEvent(`Status updated to ${updated.status} just now!`);
            setTimeout(() => setRecentLiveEvent(null), 5000);
          }
        } catch (err) {
          console.error("Error parsing live update:", err);
        }
      });
    } catch (err) {
      console.warn("SSE not available:", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [order]);

  const stages = [
    {
      key: "PENDING",
      title: "Order Placed",
      desc: "Ticket received in kitchen queue",
      icon: CheckCircle2,
    },
    {
      key: "PREPARING",
      title: "Cooking in Kitchen",
      desc: "Line cooks are searing & plating",
      icon: ChefHat,
    },
    {
      key: "READY",
      title: "Ready for Service",
      desc: "Plated under heat lamps for runner",
      icon: BellRing,
    },
    {
      key: "SERVED",
      title: "Served & Enjoyed",
      desc: "Delivered to table or guest",
      icon: UtensilsCrossed,
    },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PREPARING":
        return 1;
      case "READY":
        return 2;
      case "SERVED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIdx = order ? getStageIndex(order.status) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white sm:text-3xl">
            Live Culinary Order Tracker
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time step-by-step status directly synced with the Kitchen Display System (KDS).
          </p>
        </div>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrder(searchCode);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. ORD-1001"
              className="rounded-xl border border-white/10 bg-white/[0.05] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition"
          >
            Track
          </button>
        </form>
      </div>

      {recentLiveEvent && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 animate-in slide-in-from-top">
          <Sparkles className="h-4 w-4 animate-spin text-emerald-400" />
          <span className="font-semibold">{recentLiveEvent}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 rounded-3xl border border-white/5 bg-[#161a22] p-8 animate-pulse flex items-center justify-center text-zinc-500">
          Loading live ticket telemetry...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
          <h3 className="text-base font-bold text-white">Order Not Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            We couldn't locate order &quot;{searchCode}&quot;. Try searching for sample ticket{" "}
            <button
              onClick={() => {
                setSearchCode("ORD-1001");
                fetchOrder("ORD-1001");
              }}
              className="text-rose-400 underline font-semibold"
            >
              ORD-1001
            </button>{" "}
            or{" "}
            <button
              onClick={() => {
                setSearchCode("ORD-1002");
                fetchOrder("ORD-1002");
              }}
              className="text-rose-400 underline font-semibold"
            >
              ORD-1002
            </button>
            .
          </p>
        </div>
      ) : order ? (
        <div className="space-y-6">
          {/* Main Progress Card */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#161a22] p-6 sm:p-8 shadow-xl">
            {/* Ticket Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-white">
                    {order.orderNumber}
                  </span>
                  <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-bold text-rose-400 border border-rose-500/20">
                    {order.type}
                  </span>
                  {order.table && (
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/20">
                      Table #{order.table.tableNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Guest: <strong className="text-zinc-200">{order.customerName}</strong> • Placed{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="rounded-xl bg-white/5 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Step-by-step Visual Tracker */}
            <div className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isDone = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div
                      key={stage.key}
                      className={`relative flex md:flex-col items-center md:items-start gap-4 p-4 rounded-2xl transition-all ${
                        isCurrent
                          ? "bg-rose-500/15 border border-rose-500/40 shadow-lg shadow-rose-950/40"
                          : isDone
                          ? "bg-white/[0.02] border border-emerald-500/20"
                          : "bg-white/[0.01] border border-white/5 opacity-40"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                          isCurrent
                            ? "bg-rose-600 text-white shadow-md shadow-rose-900/50"
                            : isDone
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-zinc-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-zinc-400">Step {idx + 1}</span>
                        <h4 className="font-serif text-sm font-bold text-white mt-0.5">
                          {stage.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Elapsed / Estimated Time Indicator */}
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-4 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>
                  {order.status === "SERVED"
                    ? "Order has been successfully served. Enjoy your meal!"
                    : order.status === "READY"
                    ? "Your order is ready at the pass! Waitstaff is on the way."
                    : "Estimated kitchen prep time remaining: ~10-15 minutes."}
                </span>
              </div>
              <button
                onClick={() => fetchOrder(order.orderNumber)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Ordered Dishes Detail Breakdown */}
          <div className="rounded-3xl border border-white/10 bg-[#161a22] p-6 shadow-xl">
            <h3 className="text-base font-bold font-serif text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-rose-500" />
              <span>Dish Breakdown ({order.items.length} items)</span>
            </h3>

            <div className="divide-y divide-white/5">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 font-bold text-white text-[11px]">
                      {item.quantity}x
                    </span>
                    <div>
                      <h5 className="font-semibold text-white">{item.menuItem.name}</h5>
                      {item.customInstructions && (
                        <p className="text-[11px] text-rose-300 italic mt-0.5">
                          &quot;{item.customInstructions}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-zinc-300">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span className="text-zinc-200">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip</span>
                <span className="text-zinc-200">${order.tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-white/5">
                <span>Total Amount Paid</span>
                <span className="text-amber-400 font-serif text-base font-extrabold">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-400">Loading tracker view...</div>
      }
    >
      <TrackerContent />
    </Suspense>
  );
}
