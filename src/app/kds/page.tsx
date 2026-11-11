"use client";

import React, { useEffect, useState } from "react";
import { playKitchenChime } from "@/lib/audio";
import {
  ChefHat,
  Clock,
  Bell,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Flame,
  Volume2,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  customInstructions?: string | null;
  menuItem: {
    name: string;
    imageUrl: string;
  };
}

interface KDSOrder {
  id: string;
  orderNumber: string;
  type: string;
  status: "PENDING" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
  table?: { tableNumber: number; location: string } | null;
  customerName: string;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function KDSPage() {
  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [flashNewTicket, setFlashNewTicket] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?limit=60");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching KDS orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Timer tick every 10 seconds to update elapsed time badges
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Listen to Server-Sent Events (SSE) for Real-Time Kitchen Updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/realtime/events");

      eventSource.addEventListener("order:created", (e: MessageEvent) => {
        try {
          const newOrder = JSON.parse(e.data);
          setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);

          if (audioEnabled) {
            playKitchenChime();
          }

          setFlashNewTicket(true);
          setTimeout(() => setFlashNewTicket(false), 4000);
        } catch (err) {
          console.error("Error parsing new order SSE:", err);
        }
      });

      eventSource.addEventListener("order:updated", (e: MessageEvent) => {
        try {
          const updated = JSON.parse(e.data);
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        } catch (err) {
          console.error("Error updating order SSE:", err);
        }
      });
    } catch (err) {
      console.warn("SSE connection error:", err);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [audioEnabled]);

  const updateOrderStatus = async (
    orderId: string,
    nextStatus: "PREPARING" | "READY" | "SERVED"
  ) => {
    try {
      // Optimistic state update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        fetchOrders(); // Rollback if failed
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchOrders();
    }
  };

  // Helper to calculate elapsed minutes and urgency color
  const getUrgency = (createdAtStr: string) => {
    const elapsedMinutes = Math.floor(
      (now - new Date(createdAtStr).getTime()) / (60 * 1000)
    );

    if (elapsedMinutes < 10) {
      return {
        minutes: elapsedMinutes,
        badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        urgency: "Normal",
      };
    } else if (elapsedMinutes < 20) {
      return {
        minutes: elapsedMinutes,
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        urgency: "Warning",
      };
    } else {
      return {
        minutes: elapsedMinutes,
        badgeClass: "bg-rose-500/25 text-rose-300 border-rose-500/40 animate-pulse",
        urgency: "Urgent",
      };
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterType === "ALL") return true;
    return o.type === filterType;
  });

  const columns = [
    {
      id: "PENDING",
      title: "Pending Acceptance",
      subtitle: "New tickets waiting for cook assignment",
      badgeColor: "bg-amber-500/20 text-amber-400",
      orders: filteredOrders.filter((o) => o.status === "PENDING"),
      nextStatus: "PREPARING" as const,
      actionLabel: "Start Cooking",
      actionColor: "bg-amber-600 hover:bg-amber-500",
    },
    {
      id: "PREPARING",
      title: "In Preparation",
      subtitle: "Actively grilling, sautéing & assembling",
      badgeColor: "bg-blue-500/20 text-blue-400",
      orders: filteredOrders.filter((o) => o.status === "PREPARING"),
      nextStatus: "READY" as const,
      actionLabel: "Mark Ready",
      actionColor: "bg-emerald-600 hover:bg-emerald-500",
    },
    {
      id: "READY",
      title: "Ready at Pass",
      subtitle: "Plated dishes awaiting waitstaff runner",
      badgeColor: "bg-emerald-500/20 text-emerald-400",
      orders: filteredOrders.filter((o) => o.status === "READY"),
      nextStatus: "SERVED" as const,
      actionLabel: "Mark Served",
      actionColor: "bg-purple-600 hover:bg-purple-500",
    },
    {
      id: "SERVED",
      title: "Completed / Served",
      subtitle: "Delivered to guest or takeout pickup",
      badgeColor: "bg-zinc-500/20 text-zinc-400",
      orders: filteredOrders.filter((o) => o.status === "SERVED").slice(0, 10),
      nextStatus: null,
      actionLabel: null,
      actionColor: "",
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 space-y-6">
      {/* KDS Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#141822] p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-950/40">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-white">
                Kitchen Display System (KDS)
              </h1>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE SSE
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live multi-station ticket synchronization with audible order chime.
            </p>
          </div>
        </div>

        {/* Controls: Sound chime test, Type filters, Manual Refresh */}
        <div className="flex items-center gap-3">
          {/* Service Filter */}
          <div className="flex items-center rounded-xl bg-black/40 p-1 text-xs border border-white/5">
            {["ALL", "DINE_IN", "TAKEOUT", "DELIVERY"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-lg px-2.5 py-1 font-medium transition ${
                  filterType === t
                    ? "bg-rose-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {t === "ALL" ? "All" : t === "DINE_IN" ? "Dine-in" : t}
              </button>
            ))}
          </div>

          {/* Audible Chime Test */}
          <button
            onClick={() => {
              playKitchenChime();
              setAudioEnabled(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition"
            title="Test synthetic kitchen bell chime"
          >
            <Volume2 className="h-4 w-4 text-amber-400" />
            <span>Test Chime</span>
          </button>

          <button
            onClick={fetchOrders}
            className="rounded-xl border border-white/10 bg-white/[0.05] p-2 text-zinc-400 hover:text-white transition"
            title="Refresh ticket queue"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {flashNewTicket && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-600/20 p-3 text-xs font-bold text-rose-300 animate-bounce">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>🔔 New Order Just Received! Added to Pending Queue.</span>
        </div>
      )}

      {/* Kanban Board Grid */}
      {loading ? (
        <div className="h-96 rounded-3xl border border-white/5 bg-[#141822] flex items-center justify-center text-zinc-500">
          Loading ticket queues...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex flex-col rounded-3xl border border-white/10 bg-[#141821] overflow-hidden shadow-xl"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-white/10 bg-[#181d28] flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-white">{col.title}</h3>
                  <p className="text-[10px] text-zinc-400">{col.subtitle}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${col.badgeColor}`}>
                  {col.orders.length}
                </span>
              </div>

              {/* Tickets List */}
              <div className="p-3 space-y-3 min-h-[500px] max-h-[75vh] overflow-y-auto">
                {col.orders.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-center text-xs text-zinc-600">
                    No active tickets in this state
                  </div>
                ) : (
                  col.orders.map((order) => {
                    const urgency = getUrgency(order.createdAt);
                    return (
                      <div
                        key={order.id}
                        className="kds-card rounded-2xl border border-white/10 bg-[#1a1f2c] p-4 text-xs shadow-md space-y-3"
                      >
                        {/* Ticket Card Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-white">
                              {order.orderNumber}
                            </span>
                            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                              {order.type}
                            </span>
                          </div>

                          {/* Urgency Timer */}
                          <div
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${urgency.badgeClass}`}
                          >
                            <Clock className="h-3 w-3" />
                            <span>{urgency.minutes}m ago</span>
                          </div>
                        </div>

                        {/* Guest / Table Info */}
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                          <span className="font-medium text-white">{order.customerName}</span>
                          {order.table && (
                            <span className="font-bold text-amber-300">
                              Table #{order.table.tableNumber}
                            </span>
                          )}
                        </div>

                        {/* Kitchen Notes */}
                        {order.notes && (
                          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-300">
                            <strong>Kitchen Note:</strong> {order.notes}
                          </div>
                        )}

                        {/* Ordered Items List */}
                        <div className="space-y-1.5 py-1">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between gap-2"
                            >
                              <div className="flex items-start gap-1.5">
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-rose-600 text-[10px] font-bold text-white">
                                  {item.quantity}
                                </span>
                                <div>
                                  <span className="font-semibold text-zinc-100">
                                    {item.menuItem.name}
                                  </span>
                                  {item.customInstructions && (
                                    <p className="text-[10px] text-rose-300 italic">
                                      ↳ &quot;{item.customInstructions}&quot;
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status Transition Action Button */}
                        {col.nextStatus && (
                          <button
                            onClick={() => updateOrderStatus(order.id, col.nextStatus!)}
                            className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-white transition shadow-md ${col.actionColor}`}
                          >
                            <span>{col.actionLabel}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
