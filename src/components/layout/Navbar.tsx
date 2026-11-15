"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  ShoppingBag,
  CalendarDays,
  Clock,
  ChevronDown,
  Utensils,
  MapPin,
  ClipboardList,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const {
    setIsCartOpen,
    getCartCount,
    getCartSubtotal,
    selectedTableNumber,
    orderType,
    setOrderType,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const [tableMenuOpen, setTableMenuOpen] = useState(false);

  // Strictly hide customer navbar on Staff, Kitchen, Admin, Login, and Legal portals
  if (
    pathname.startsWith("/kitchen") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/kds") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/cookies")
  ) {
    return null;
  }

  const cartCount = getCartCount();
  const cartSubtotal = getCartSubtotal();

  // ONLY customer-facing actions as specified in Task 2 RBAC directive
  const customerLinks = [
    { href: "/", label: "Menu", icon: Utensils },
    { href: "/reserve", label: "Book a Table", icon: CalendarDays },
    { href: "/track", label: "My Orders", icon: ClipboardList },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E8E8] bg-[#FFFFFF] shadow-sm font-sans">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 gap-4">
        {/* Left: Brand Logo + Table/Takeaway Service Pill */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E23744] text-white shadow-sm group-hover:scale-105 transition-transform">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-xl font-extrabold text-[#1C1C1C] tracking-tight">
                Dine<span className="text-[#E23744]">Desk</span>
              </span>
            </div>
          </Link>

          {/* Table / Service Mode Pill Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setTableMenuOpen(!tableMenuOpen)}
              className="flex items-center gap-1.5 rounded-full border border-[#E8E8E8] bg-[#F8F9FA] px-3.5 py-1.5 text-xs font-semibold text-[#1C1C1C] hover:bg-[#F4F5F7] transition"
            >
              <MapPin className="h-3.5 w-3.5 text-[#E23744]" />
              <span>
                {orderType === "DINE_IN"
                  ? `Dine-in: Table #${selectedTableNumber ?? 2}`
                  : orderType === "TAKEOUT"
                  ? "Takeaway Pickup"
                  : "Direct Delivery"}
              </span>
              <ChevronDown className="h-3 w-3 text-[#686B78]" />
            </button>

            {tableMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#93959F]">
                  Dining / Service Mode
                </div>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => {
                      setOrderType("DINE_IN");
                      setTableMenuOpen(false);
                    }}
                    className={`w-full text-left rounded-lg p-2 text-xs font-medium transition ${
                      orderType === "DINE_IN"
                        ? "bg-[#E23744]/10 text-[#E23744] font-bold"
                        : "text-[#1C1C1C] hover:bg-[#F4F5F7]"
                    }`}
                  >
                    🍽️ Dine-in (Table #{selectedTableNumber ?? 2})
                  </button>
                  <button
                    onClick={() => {
                      setOrderType("TAKEOUT");
                      setTableMenuOpen(false);
                    }}
                    className={`w-full text-left rounded-lg p-2 text-xs font-medium transition ${
                      orderType === "TAKEOUT"
                        ? "bg-[#E23744]/10 text-[#E23744] font-bold"
                        : "text-[#1C1C1C] hover:bg-[#F4F5F7]"
                    }`}
                  >
                    🛍️ Takeaway (Counter Pickup)
                  </button>
                  <button
                    onClick={() => {
                      setOrderType("DELIVERY");
                      setTableMenuOpen(false);
                    }}
                    className={`w-full text-left rounded-lg p-2 text-xs font-medium transition ${
                      orderType === "DELIVERY"
                        ? "bg-[#E23744]/10 text-[#E23744] font-bold"
                        : "text-[#1C1C1C] hover:bg-[#F4F5F7]"
                    }`}
                  >
                    🛵 Home Delivery
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar (Swiggy / Zomato standard) */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#93959F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, biryanis, pizzas, burgers..."
              className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] pl-10 pr-4 py-2 text-xs text-[#1C1C1C] placeholder-[#93959F] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right: Customer Nav Links & Cart Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <nav className="hidden lg:flex items-center gap-1.5">
            {customerLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    isActive
                      ? "text-[#E23744] bg-[#E23744]/10 shadow-sm"
                      : "text-[#3E4152] hover:text-[#E23744] hover:bg-[#F8F9FA]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Cart Pill (Zomato/Swiggy standard) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0F8A65] hover:bg-[#0c7354] px-4 py-2 text-xs font-bold text-white shadow-btn transition active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="tabular-nums font-mono">
              {cartCount > 0 ? `${cartCount} | ${formatPrice(cartSubtotal)}` : "Cart"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Customer Navigation bar */}
      <div className="flex lg:hidden border-t border-[#E8E8E8] bg-[#FFFFFF] px-3 py-2 justify-around">
        {customerLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 rounded px-3 py-1 text-[11px] font-bold ${
                isActive ? "text-[#E23744]" : "text-[#686B78]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
