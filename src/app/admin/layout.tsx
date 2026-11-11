import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ChefHat,
  LogOut,
  UserCheck,
  Shield,
  Utensils,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {/* Dedicated Executive Management Header */}
      <header className="sticky top-0 z-50 border-b border-[#E8E8E8] bg-[#FFFFFF] shadow-sm px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C1C1C] text-white shadow-sm">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-[#1C1C1C] tracking-tight">
                  DineDesk <span className="text-[#E23744]">Operations</span>
                </span>
                <span className="rounded-full bg-[#1C1C1C] text-white text-[10px] font-bold px-2 py-0.5">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-[#686B78]">
                Hospitality Telemetry, Menu Stock Controls & Floor Layout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Switch to Line Cook KDS */}
            <Link
              href="/kitchen"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] hover:bg-[#F4F5F7] px-3.5 py-2 text-xs font-bold text-[#1C1C1C] transition shadow-sm"
            >
              <ChefHat className="h-4 w-4 text-[#0F8A65]" />
              <span>Live Kitchen KDS</span>
            </Link>

            {/* Admin Badge */}
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-[#F4F5F7] px-3 py-1.5 text-xs text-[#1C1C1C] font-semibold border border-[#E8E8E8]">
              <div className="h-6 w-6 rounded-lg bg-[#E23744] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <span className="block text-[11px] font-bold leading-none">Chef Marco Rossi</span>
                <span className="text-[10px] text-[#0F8A65] font-bold">General Manager</span>
              </div>
            </div>

            {/* Logout button */}
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-1.5 rounded-xl bg-[#E23744] hover:bg-[#cb202d] px-3.5 py-2 text-xs font-bold text-white transition active:scale-95 shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
