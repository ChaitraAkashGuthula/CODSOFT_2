"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
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

function TrackerContent({ defaultCode }: { defaultCode?: string }) {
  const searchParams = useSearchParams();
  const initialOrderId = defaultCode || searchParams.get("orderId") || "ORD-1001";

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
    if (defaultCode) {
      setSearchCode(defaultCode);
    }
  }, [defaultCode]);

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
      console.error("SSE connection error:", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [order]);

  const stages = [
    {
      id: "PENDING",
      title: "Order Placed",
      desc: "Received by restaurant kitchen",
      icon: CheckCircle2,
    },
    {
      id: "PREPARING",
      title: "Preparing in Kitchen",
      desc: "Chef is actively cooking dishes",
      icon: ChefHat,
    },
    {
      id: "READY",
      title: "Ready to Serve",
      desc: "Plated & ready at delivery counter",
      icon: BellRing,
    },
    {
      id: "SERVED",
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

  const currentStageIndex = order ? getStageIndex(order.status) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 font-sans">
      {/* Title & Search lookup */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#E23744]">
            Live Order Tracking
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] mt-1">
            Track Order Status
          </h1>
          <p className="text-xs text-[#686B78] mt-1">
            Real-time step-by-step updates synced with restaurant kitchen display.
          </p>
        </div>

        {/* Lookup bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrder(searchCode);
          }}
          className="flex items-center gap-2 max-w-xs"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#93959F]" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="e.g. ORD-1001"
              className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] pl-8 pr-3 py-2 text-xs font-mono font-bold text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#E23744] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#cb202d] transition"
          >
            Track
          </button>
        </form>
      </div>

      {recentLiveEvent && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-[#0F8A65] flex items-center gap-2 shadow-sm animate-in fade-in">
          <Sparkles className="h-4 w-4 animate-spin" />
          <span>{recentLiveEvent}</span>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-12 text-center shadow-sm">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#93959F] mb-3" />
          <h3 className="font-heading font-bold text-base text-[#1C1C1C]">
            Syncing order status...
          </h3>
          <p className="text-xs text-[#686B78] mt-1">Connecting to kitchen telemetry</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-[#E23744] mb-2" />
          <h3 className="font-heading font-bold text-base text-[#1C1C1C]">
            Order Not Found
          </h3>
          <p className="mt-1 text-xs text-[#686B78]">{error}</p>
        </div>
      ) : order ? (
        <div className="space-y-6">
          {/* Order Header Card */}
          <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E8E8] gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-extrabold text-[#1C1C1C]">
                  {order.orderNumber}
                </span>
                <span className="rounded-md bg-[#F4F5F7] px-2 py-0.5 text-[11px] font-bold text-[#686B78] uppercase">
                  {order.type}
                </span>
                {order.table && (
                  <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                    Table #{order.table.tableNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    order.status === "SERVED"
                      ? "bg-slate-500"
                      : order.status === "READY"
                      ? "bg-[#0F8A65]"
                      : "bg-[#0F8A65] animate-ping"
                  }`}
                />
                <span className="text-[#0F8A65] bg-[#0F8A65]/10 px-2.5 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs text-[#686B78]">
              Customer: <strong className="text-[#1C1C1C]">{order.customerName}</strong> • Ordered at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>

            {/* Stepper Progress Visualizer */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
              {stages.map((st, idx) => {
                const Icon = st.icon;
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={st.id}
                    className={`rounded-2xl p-4 transition border ${
                      isCurrent
                        ? "border-[#E23744] bg-[#FFFFFF] shadow-card ring-2 ring-[#E23744]/20"
                        : isPassed
                        ? "border-[#E8E8E8] bg-[#F8F9FA]"
                        : "border-[#E8E8E8] bg-[#FAFAFA] opacity-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                        isCurrent
                          ? "bg-[#E23744] text-white"
                          : isPassed
                          ? "bg-[#0F8A65]/10 text-[#0F8A65]"
                          : "bg-[#F4F5F7] text-[#93959F]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-[#93959F]">
                      STEP 0{idx + 1}
                    </span>
                    <h4 className="font-heading font-bold text-xs text-[#1C1C1C] mt-0.5">
                      {st.title}
                    </h4>
                    <p className="text-[11px] text-[#686B78] mt-1 leading-snug">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Estimated Prep Notice */}
            <div className="mt-6 rounded-xl bg-[#F8F9FA] p-3 text-xs text-[#686B78] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FC8019]" />
                <span>Estimated preparation time remaining: ~10 to 15 mins.</span>
              </div>
              <button
                onClick={() => fetchOrder(order.orderNumber)}
                className="font-bold text-[#E23744] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Itemized Order Breakdown */}
          <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm">
            <h3 className="font-heading font-bold text-sm text-[#1C1C1C] mb-4 flex items-center gap-2">
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
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="mt-4 pt-4 border-t border-[#E8E8E8] space-y-2 text-xs text-[#686B78]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges (8%)</span>
                <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                  {formatPrice(order.tax)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Staff Tip</span>
                <span className="font-mono font-bold text-[#1C1C1C] tabular-nums">
                  {formatPrice(order.tip)}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-[#1C1C1C] pt-2 border-t border-[#E8E8E8]">
                <span>Total Bill Settled</span>
                <span className="font-mono text-[#0F8A65] text-base tabular-nums">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TrackerView({ initialOrderId }: { initialOrderId?: string } = {}) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#686B78]">
          Loading tracker view...
        </div>
      }
    >
      <TrackerContent defaultCode={initialOrderId} />
    </Suspense>
  );
}
