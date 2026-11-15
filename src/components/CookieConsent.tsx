"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X, ShieldCheck } from "lucide-react";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem("app_cookie_consent_v1");
      if (!consent) {
        // Small delay so it appears smoothly without interfering with initial page render
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access may be restricted in private browsing mode
    }
  }, []);

  const handleChoice = (type: "essential" | "all") => {
    try {
      localStorage.setItem("app_cookie_consent_v1", type);
    } catch {
      // Ignore storage errors
    }
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 right-4 z-50 max-w-xs sm:max-w-sm w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-3 duration-300 font-sans"
    >
      <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-4 sm:p-5 shadow-2xl text-[#1C1C1C]">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E23744]/10 text-[#E23744]">
              <Cookie className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-extrabold text-xs text-[#1C1C1C]">
              Cookie & Dining Preferences
            </h3>
          </div>
          <button
            onClick={() => handleChoice("essential")}
            className="rounded-full p-1 text-[#93959F] hover:bg-[#F4F5F7] hover:text-[#1C1C1C] transition"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-[#686B78] leading-relaxed mb-3">
          We use essential cookies to maintain your dining cart, table bookings, and secure kitchen dispatch. Review our{" "}
          <Link href="/cookies" className="text-[#E23744] font-semibold hover:underline">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-[#E23744] font-semibold hover:underline">
            Terms
          </Link>
          .
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleChoice("essential")}
            className="flex-1 rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] hover:bg-[#F4F5F7] px-3 py-2 text-[11px] font-bold text-[#686B78] transition active:scale-95 text-center"
          >
            Essential Only
          </button>
          <button
            onClick={() => handleChoice("all")}
            className="flex-1 rounded-xl bg-[#0F8A65] hover:bg-[#0c7354] px-3 py-2 text-[11px] font-extrabold text-white shadow-sm transition active:scale-95 text-center"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
