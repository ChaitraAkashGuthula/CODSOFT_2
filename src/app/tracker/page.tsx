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
            setRecentLiveEvent(`Kitchen status updated to: ${updated.status}`);
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
      desc: "Received by restaurant kitchen",
      icon: CheckCircle2,
    },
    {
      key: "PREPARING",
      title: "Preparing in Kitchen",
      desc: "Chef is actively cooking dishes",
      icon: ChefHat,
    },
    {
      key: "READY",
      title: "Ready to Serve",
      desc: "Plated & ready at delivery counter",
      icon: BellRing,
    },
    {
      key: "SERVED",
      title: "Completed",
      desc: "Served at table or delivered",
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
        <div>
          <span className="text-xs font-bold text-[#E23744] uppercase tracking-wider">
            Live Order Tracking
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-[#1C1C1C] sm:text-3xl mt-0.5">
            Track Order Status
          </h1>
          <p className="text-xs text-[#686B78] mt-1">
            Real-time step-by-step updates synced with restaurant kitchen display.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrder(searchCode);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#93959F]" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. ORD-1001"
              className="rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] pl-10 pr-3 py-2 font-mono text-xs text-[#1C1C1C] placeholder-[#93959F] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#E23744] px-4 py-2 text-xs font-bold text-white hover:bg-[#cb202d] transition"
          >
            Track
          </button>
        </form>
      </div>

      {recentLiveEvent && (
        <div className="flex items-center gap-2 rounded-xl bg-[#0F8A65]/10 border border-[#0F8A65]/30 p-3 text-xs text-[#0F8A65] font-bold animate-in slide-in-from-top">
          <Sparkles className="h-4 w-4 text-[#0F8A65] shrink-0" />
          <span>{recentLiveEvent}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 rounded-2xl bg-[#F8F9FA] border border-[#E8E8E8] flex items-center justify-center text-xs text-[#686B78]">
          Loading order details...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-[#E23744]" />
          <h3 className="font-heading font-bold text-base text-[#1C1C1C]">
            Order Not Found
          </h3>
          <p className="text-xs text-[#686B78] max-w-sm mx-auto">
            Try checking order{" "}
            <button
              onClick={() => {
                setSearchCode("ORD-1001");
                fetchOrder("ORD-1001");
              }}
              className="text-[#E23744] underline font-bold"
            >
              ORD-1001
            </button>{" "}
            or{" "}
            <button
              onClick={() => {
                setSearchCode("ORD-1002");
                fetchOrder("ORD-1002");
              }}
              className="text-[#E23744] underline font-bold"
            >
              ORD-1002
            </button>
            .
          </p>
        </div>
      ) : order ? (
        <div className="space-y-6">
          {/* Main Status Stepper Card */}
          <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E8E8]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-[#1C1C1C]">
                    {order.orderNumber}
                  </span>
                  <span className="rounded-md bg-[#F4F5F7] px-2.5 py-0.5 text-xs font-bold text-[#3E4152]">
                    {order.type}
                  </span>
                  {order.table && (
                    <span className="rounded-md bg-[#FC8019]/10 text-[#FC8019] text-xs font-bold px-2 py-0.5">
                      Table #{order.table.tableNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#686B78] mt-1">
                  Customer: <strong className="text-[#1C1C1C]">{order.customerName}</strong> • Ordered at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0F8A65] animate-pulse"></span>
                <span className="rounded-xl bg-[#0F8A65]/10 text-[#0F8A65] px-3.5 py-1 text-xs font-extrabold uppercase">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Stepper Grid (Swiggy / Zomato order tracking standard) */}
            <div className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isDone = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div
                      key={stage.key}
                      className={`flex md:flex-col items-center md:items-start gap-3 p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? "border-[#E23744] bg-[#E23744]/5 shadow-sm"
                          : isDone
                          ? "border-[#0F8A65]/30 bg-[#0F8A65]/5"
                          : "border-[#E8E8E8] bg-[#F8F9FA] opacity-50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                          isCurrent
                            ? "bg-[#E23744] text-white shadow-sm"
                            : isDone
                            ? "bg-[#0F8A65] text-white"
                            : "bg-[#E8E8E8] text-[#93959F]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-[#93959F] uppercase">
                          Step 0{idx + 1}
                        </span>
                        <h4 className="font-heading text-sm font-bold text-[#1C1C1C] mt-0.5">
                          {stage.title}
                        </h4>
                        <p className="text-[11px] text-[#686B78] mt-0.5 leading-snug">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prep Note */}
            <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] p-3.5 text-xs text-[#686B78]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FC8019]" />
                <span>
                  {order.status === "SERVED"
                    ? "Order served and completed. We hope you enjoyed your meal!"
                    : order.status === "READY"
                    ? "Your order is ready at the delivery pass! Server on the way."
                    : "Estimated preparation time remaining: ~10 to 15 mins."}
                </span>
              </div>
              <button
                onClick={() => fetchOrder(order.orderNumber)}
                className="flex items-center gap-1 text-xs font-bold text-[#E23744] hover:underline"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Itemized Order Summary */}
          <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm">
            <h3 className="font-heading text-base font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#0F8A65]" />
              <span>Order Summary ({order.items.length} items)</span>
            </h3>

            <div className="divide-y divide-[#E8E8E8]">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#F4F5F7] font-bold text-[#1C1C1C] text-xs">
                      {item.quantity}x
                    </span>
                    <div>
                      <strong className="text-[#1C1C1C]">{item.menuItem.name}</strong>
                      {item.customInstructions && (
                        <p className="text-[11px] text-[#E23744] italic mt-0.5">
                          &quot;{item.customInstructions}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="mt-4 pt-4 border-t border-[#E8E8E8] space-y-2 text-xs text-[#686B78]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges (8%)</span>
                <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                  ${order.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Staff Tip</span>
                <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                  ${order.tip.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-[#1C1C1C] pt-2 border-t border-[#E8E8E8]">
                <span>Total Bill Settled</span>
                <span className="font-mono text-[#0F8A65] text-base tabular-nums">
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
        <div className="p-8 text-center text-xs text-[#686B78]">
          Loading tracker view...
        </div>
      }
    >
      <TrackerContent />
    </Suspense>
  );
}
