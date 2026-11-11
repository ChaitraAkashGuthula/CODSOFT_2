import React from "react";
import Link from "next/link";
import { ChefHat, LogOut, ArrowLeft, Radio } from "lucide-react";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans">
      {/* High-Contrast Kitchen Wall-Tablet Top Bar */}
      <header className="sticky top-0 z-50 border-b border-[#E8E8E8] bg-[#1C1C1C] text-white px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E23744] text-white">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tracking-wide text-white">
                  DineDesk KDS
                </span>
                <span className="rounded bg-rose-500/20 text-[#E23744] text-[10px] font-bold px-1.5 py-0.2 border border-rose-500/30">
                  LINE COOK STATION
                </span>
              </div>
              <p className="text-[11px] text-[#93959F]">
                Real-Time Ticket Dispatch & Expo Queue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Live Kitchen Sync</span>
            </div>

            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition"
            >
              <span>Admin Console</span>
            </Link>

            <Link
              href="/api/auth/logout"
              className="flex items-center gap-1.5 rounded-lg bg-[#E23744] hover:bg-[#cb202d] px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-95 shadow-sm"
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
