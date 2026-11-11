"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore, RoleType } from "@/lib/store";
import {
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  ChefHat,
  LayoutDashboard,
  Clock,
  ChevronDown,
  UserCheck,
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
  } = useAppStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const cartCount = getCartCount();
  const cartSubtotal = getCartSubtotal();

  const navLinks = [
    { href: "/", label: "Digital Menu", icon: UtensilsCrossed },
    { href: "/reservations", label: "Book Table", icon: CalendarDays },
    { href: "/tracker", label: "Live Tracker", icon: Clock },
    { href: "/kds", label: "Kitchen KDS", icon: ChefHat, badge: "Live" },
    { href: "/admin", label: "Management", icon: LayoutDashboard },
  ];

  const roles: { id: RoleType; label: string; desc: string; iconColor: string }[] = [
    {
      id: "CUSTOMER",
      label: "Guest / Customer",
      desc: "Browsing, ordering, table tracking",
      iconColor: "text-amber-400",
    },
    {
      id: "KITCHEN_STAFF",
      label: "Kitchen Brigade (KDS)",
      desc: "Line cooks & sous chefs",
      iconColor: "text-rose-400",
    },
    {
      id: "ADMIN",
      label: "Restaurant Admin",
      desc: "Menu inventory & table operations",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0f1115]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 text-white shadow-lg shadow-rose-900/30 transition-transform group-hover:scale-105">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Dine<span className="text-rose-500">Desk</span>
              </span>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-rose-400 border border-rose-500/20">
                TASK 2
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Culinary Ordering Platform</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-rose-600 text-white shadow-sm shadow-rose-900/40"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1 rounded-full bg-amber-400/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Table Pill, Role Switcher, Cart Drawer Button */}
        <div className="flex items-center gap-2.5">
          {/* Table Indicator (for Dine-in) */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Table #{selectedTableNumber ?? 2}</span>
          </div>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition"
              title="Switch demo persona"
            >
              <UserCheck className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {currentRole === "CUSTOMER"
                  ? "Guest"
                  : currentRole === "KITCHEN_STAFF"
                  ? "Kitchen"
                  : "Admin"}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#161a22] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Switch Active Role
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
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          : "text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>{r.label}</span>
                        {currentRole === r.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-rose-900/30 hover:from-rose-500 hover:to-rose-600 transition active:scale-95"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">
              {cartCount > 0 ? `$${cartSubtotal.toFixed(2)}` : "Cart"}
            </span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-zinc-950">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden border-t border-white/5 bg-[#12151b] px-2 py-1.5 justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] ${
                isActive ? "text-rose-400 font-bold" : "text-zinc-400"
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
