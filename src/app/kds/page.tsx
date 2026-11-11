"use client";

import React, { useEffect, useState } from "react";
import { playKitchenChime } from "@/lib/audio";
import {
  ChefHat,
  Clock,
  ArrowRight,
  Volume2,
  RefreshCw,
  Utensils,
  Layers,
  CheckCircle2,
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

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

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
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchOrders();
    }
  };

  const getUrgency = (createdAtStr: string) => {
    const elapsedMinutes = Math.floor(
      (now - new Date(createdAtStr).getTime()) / (60 * 1000)
    );

    if (elapsedMinutes < 10) {
      return {
        minutes: elapsedMinutes,
        badgeClass: "bg-[#0F8A65]/10 text-[#0F8A65] border-[#0F8A65]/20",
        label: "Normal",
      };
    } else if (elapsedMinutes < 15) {
      return {
        minutes: elapsedMinutes,
        badgeClass: "bg-[#FC8019]/10 text-[#FC8019] border-[#FC8019]/20",
        label: "Attention",
      };
    } else {
      return {
        minutes: elapsedMinutes,
        badgeClass: "bg-rose-100 text-[#E23744] border-rose-300 animate-pulse font-extrabold",
        label: "Urgent",
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
      title: "Incoming Tickets",
      headerColor: "bg-[#FFF4E5] text-[#FC8019] border-[#FFE2C2]",
      badgeColor: "bg-[#FC8019] text-white",
      orders: filteredOrders.filter((o) => o.status === "PENDING"),
      nextStatus: "PREPARING" as const,
      actionLabel: "Start Preparing",
      actionBtnClass: "bg-[#FC8019] hover:bg-[#e06d0b] text-white",
    },
    {
      id: "PREPARING",
      title: "Preparing on Line",
      headerColor: "bg-[#EBF5FF] text-[#1E40AF] border-[#BFDBFE]",
      badgeColor: "bg-[#1E40AF] text-white",
      orders: filteredOrders.filter((o) => o.status === "PREPARING"),
      nextStatus: "READY" as const,
      actionLabel: "Mark as Ready",
      actionBtnClass: "bg-[#0F8A65] hover:bg-[#0c7354] text-white",
    },
    {
      id: "READY",
      title: "Ready to Serve",
      headerColor: "bg-[#E6F4EA] text-[#0F8A65] border-[#CEEAD6]",
      badgeColor: "bg-[#0F8A65] text-white",
      orders: filteredOrders.filter((o) => o.status === "READY"),
      nextStatus: "SERVED" as const,
      actionLabel: "Mark as Completed",
      actionBtnClass: "bg-[#1C1C1C] hover:bg-black text-white",
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 space-y-6 font-sans">
      {/* Toast POS Style Top Dashboard Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E23744] text-white shadow-sm">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg font-extrabold text-[#1C1C1C]">
                Kitchen Display System (KDS)
              </h1>
              <span className="flex items-center gap-1 rounded-full bg-[#0F8A65]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0F8A65]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0F8A65] animate-pulse"></span>
                LIVE SSE
              </span>
            </div>
            <p className="text-xs text-[#686B78]">
              Toast POS / Square standard order dispatch terminal for line cooks and expeditors.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-1 text-xs font-semibold">
            {["ALL", "DINE_IN", "TAKEOUT", "DELIVERY"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-lg px-3 py-1.5 transition ${
                  filterType === t
                    ? "bg-[#FFFFFF] text-[#1C1C1C] shadow-sm font-bold"
                    : "text-[#686B78] hover:text-[#1C1C1C]"
                }`}
              >
                {t === "ALL" ? "All" : t === "DINE_IN" ? "Dine-in" : t}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playKitchenChime();
              setAudioEnabled(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] px-3.5 py-2 text-xs font-bold text-[#1C1C1C] hover:bg-[#F8F9FA] transition"
          >
            <Volume2 className="h-4 w-4 text-[#FC8019]" />
            <span>Test Bell Chime</span>
          </button>

          <button
            onClick={fetchOrders}
            className="rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] p-2 text-[#686B78] hover:text-[#1C1C1C] transition"
            title="Refresh tickets"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {flashNewTicket && (
        <div className="flex items-center gap-2 rounded-xl bg-[#FC8019] text-white p-3.5 text-xs font-bold shadow-md animate-bounce">
          <ChefHat className="h-4 w-4" />
          <span>🔔 NEW TICKET ARRIVED! ADDED TO INCOMING QUEUE.</span>
        </div>
      )}

      {/* Kanban Board Grid */}
      {loading ? (
        <div className="h-96 rounded-2xl bg-[#F8F9FA] border border-[#E8E8E8] flex items-center justify-center text-xs text-[#686B78]">
          Syncing kitchen tickets...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] shadow-sm overflow-hidden"
            >
              {/* Column Header */}
              <div className={`p-4 border-b flex items-center justify-between ${col.headerColor}`}>
                <h3 className="font-heading font-extrabold text-sm tracking-wide">
                  {col.title}
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${col.badgeColor}`}>
                  {col.orders.length}
                </span>
              </div>

              {/* Tickets List */}
              <div className="p-4 space-y-3 min-h-[500px] max-h-[75vh] overflow-y-auto bg-[#F8F9FA]">
                {col.orders.length === 0 ? (
                  <div className="flex h-44 items-center justify-center text-center text-xs text-[#93959F] font-medium">
                    No tickets in this state
                  </div>
                ) : (
                  col.orders.map((order) => {
                    const urgency = getUrgency(order.createdAt);
                    return (
                      <div
                        key={order.id}
                        className="rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] p-4 text-xs shadow-sm space-y-3"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E8]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-extrabold text-[#1C1C1C]">
                              {order.orderNumber}
                            </span>
                            <span className="rounded bg-[#F4F5F7] px-2 py-0.5 text-[10px] font-bold text-[#3E4152] uppercase">
                              {order.type}
                            </span>
                          </div>

                          {/* Urgency Timer */}
                          <div
                            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border tabular-nums ${urgency.badgeClass}`}
                          >
                            <Clock className="h-3 w-3" />
                            <span>+{urgency.minutes}m ago</span>
                          </div>
                        </div>

                        {/* Customer & Table */}
                        <div className="flex items-center justify-between text-xs">
                          <strong className="text-[#1C1C1C] truncate max-w-[140px]">
                            {order.customerName}
                          </strong>
                          {order.table && (
                            <span className="rounded bg-[#E23744]/10 text-[#E23744] font-extrabold px-2 py-0.5 text-xs">
                              Table #{order.table.tableNumber}
                            </span>
                          )}
                        </div>

                        {/* Kitchen Notes */}
                        {order.notes && (
                          <div className="rounded-lg bg-[#FFF4E5] border border-[#FFE2C2] p-2 text-[11px] text-[#FC8019] font-medium leading-snug">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}

                        {/* Item Quantities Checklist */}
                        <div className="space-y-1.5 py-1">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between gap-2"
                            >
                              <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#1C1C1C] text-[11px] font-bold text-white tabular-nums">
                                  {item.quantity}
                                </span>
                                <div>
                                  <span className="font-bold text-[#1C1C1C]">
                                    {item.menuItem.name}
                                  </span>
                                  {item.customInstructions && (
                                    <p className="text-[11px] text-[#E23744] italic">
                                      ↳ &quot;{item.customInstructions}&quot;
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action Button */}
                        {col.nextStatus && (
                          <button
                            onClick={() => updateOrderStatus(order.id, col.nextStatus!)}
                            className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition shadow-sm ${col.actionBtnClass}`}
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
