"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileText, Shield, Cookie, Utensils } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const legalNavItems = [
    { href: "/terms", label: "Terms of Service", icon: FileText },
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
    { href: "/cookies", label: "Cookie Policy", icon: Cookie },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-[#E23744]/20 selection:text-[#E23744]">
      {/* Top Header */}
      <header className="border-b border-[#E8E8E8] bg-[#FFFFFF] sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#686B78] hover:text-[#E23744] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Application</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E23744] text-white">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="font-heading font-extrabold text-[#1C1C1C] text-base">
              Dine<span className="text-[#E23744]">Desk</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6">
        {/* Navigation Tabs between Legal Docs */}
        <div className="mb-8 flex items-center gap-2 border-b border-[#E8E8E8] pb-4 overflow-x-auto">
          {legalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-[#E23744] text-white shadow-sm"
                    : "bg-[#FFFFFF] text-[#686B78] hover:text-[#1C1C1C] hover:bg-[#F4F5F7] border border-[#E8E8E8]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Legal Document Content */}
        <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 sm:p-10 shadow-card">
          {children}
        </div>
      </main>
    </div>
  );
}
