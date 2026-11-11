"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore, RoleType } from "@/lib/store";
import {
  Search,
  ShoppingBag,
  CalendarDays,
  ChefHat,
  SlidersHorizontal,
  Clock,
  ChevronDown,
  User,
  Utensils,
  MapPin,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const {
    cart,
    setIsCartOpen,
    getCartCount,
    getCartSubtotal,
    currentRole,
    setCurrentRole,
    selectedTableNumber,
    orderType,
    setOrderType,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);

  const cartCount = getCartCount();
  const cartSubtotal = getCartSubtotal();

  const navLinks = [
    { href: "/", label: "Menu", icon: Utensils },
    { href: "/reservations", label: "Book a Table", icon: CalendarDays },
    { href: "/tracker", label: "Track Order", icon: Clock },
    { href: "/kds", label: "Kitchen KDS", icon: ChefHat, badge: "Live" },
    { href: "/admin", label: "Admin", icon: SlidersHorizontal },
  ];

  const roles: { id: RoleType; label: string; desc: string }[] = [
    {
      id: "CUSTOMER",
      label: "Customer / Diner",
      desc: "Menu ordering & live tracking",
    },
    {
      id: "KITCHEN_STAFF",
      label: "Kitchen Staff (KDS)",
      desc: "Live order preparation screen",
    },
    {
      id: "ADMIN",
      label: "Restaurant Admin",
      desc: "Menu inventory & floor management",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E8E8] bg-[#FFFFFF] shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 gap-4">
        {/* Left: Brand Logo & Dining Mode */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E23744] text-white shadow-sm transition-transform group-hover:scale-105">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-xl font-extrabold tracking-tight text-[#1C1C1C]">
                Dine<span className="text-[#E23744]">Desk</span>
              </span>
            </div>
          </Link>

          {/* Table / Service Mode Pill Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setTableMenuOpen(!tableMenuOpen)}
              className="flex items-center gap-1.5 rounded-full border border-[#E8E8E8] bg-[#F8F9FA] px-3 py-1.5 text-xs font-semibold text-[#1C1C1C] hover:bg-[#F4F5F7] transition"
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
              <div className="absolute left-0 mt-2 w-52 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#93959F]">
                  Service Mode
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
              placeholder="Search for dishes, cuisines, ingredients..."
              className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] pl-10 pr-4 py-2 text-xs text-[#1C1C1C] placeholder-[#93959F] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right: Nav Tabs, Role Switcher & Cart Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "text-[#E23744] bg-[#E23744]/10"
                      : "text-[#3E4152] hover:text-[#E23744] hover:bg-[#F8F9FA]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 rounded-full bg-[#E23744] px-1.5 py-0.2 text-[9px] font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[#E8E8E8] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-semibold text-[#3E4152] hover:bg-[#F8F9FA] transition"
              title="Switch demo persona"
            >
              <User className="h-3.5 w-3.5 text-[#E23744]" />
              <span className="hidden sm:inline">
                {currentRole === "CUSTOMER"
                  ? "Customer"
                  : currentRole === "KITCHEN_STAFF"
                  ? "Kitchen"
                  : "Admin"}
              </span>
              <ChevronDown className="h-3 w-3 text-[#93959F]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#93959F]">
                  Switch Role Persona
                </div>
                <div className="mt-1 space-y-1">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left rounded-lg p-2 text-xs transition flex flex-col gap-0.5 ${
                        currentRole === r.id
                          ? "bg-[#E23744]/10 text-[#E23744] font-bold border border-[#E23744]/20"
                          : "text-[#3E4152] hover:bg-[#F8F9FA]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{r.label}</span>
                        {currentRole === r.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#E23744]"></span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#686B78] font-normal">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Pill (Zomato/Swiggy standard) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0F8A65] hover:bg-[#0c7354] px-4 py-2 text-xs font-bold text-white shadow-btn transition active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="tabular-nums font-mono">
              {cartCount > 0 ? `${cartCount} | $${cartSubtotal.toFixed(2)}` : "Cart"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex lg:hidden border-t border-[#E8E8E8] bg-[#FFFFFF] px-2 py-2 justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 rounded px-2 py-1 text-[11px] font-semibold ${
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
