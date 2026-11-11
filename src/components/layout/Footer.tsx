"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Utensils, Clock, Phone, MapPin, Shield } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide customer footer on staff, kitchen, admin, and login routes
  if (
    pathname.startsWith("/kitchen") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/kds") ||
    pathname.startsWith("/staff")
  ) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-[#E8E8E8] bg-[#F8F9FA] text-[#686B78] text-xs font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E23744] text-white">
                <Utensils className="h-4 w-4" />
              </div>
              <span className="font-heading font-extrabold text-[#1C1C1C] text-lg">
                Dine<span className="text-[#E23744]">Desk</span>
              </span>
            </div>
            <p className="text-xs text-[#686B78] leading-relaxed">
              Premium artisanal restaurant platform combining authentic dum biryanis, sourdough pizzas, smash burgers, and handcrafted desserts.
            </p>
          </div>

          {/* Col 2: Operating Hours */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-[#1C1C1C] text-sm flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#E23744]" />
              Opening Hours
            </h4>
            <ul className="space-y-1 text-xs">
              <li className="flex justify-between">
                <span>Mon – Fri:</span>
                <strong className="text-[#1C1C1C]">11:00 AM – 11:00 PM</strong>
              </li>
              <li className="flex justify-between">
                <span>Sat – Sun:</span>
                <strong className="text-[#1C1C1C]">10:00 AM – 12:00 AM</strong>
              </li>
              <li className="text-[11px] text-[#0F8A65] font-semibold pt-1">
                • Kitchen currently taking live orders
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-[#1C1C1C] text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#E23744]" />
              Restaurant Location
            </h4>
            <p className="text-xs leading-relaxed">
              42 Gourmet Boulevard, Culinary District, Metro City 560001
            </p>
            <p className="text-xs flex items-center gap-1 pt-1 font-semibold text-[#1C1C1C]">
              <Phone className="h-3.5 w-3.5 text-[#E23744]" />
              <span>+91 98765 43210</span>
            </p>
          </div>

          {/* Col 4: Dining Quick Links */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-[#1C1C1C] text-sm">
              Dining Services
            </h4>
            <ul className="space-y-1 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#E23744] transition">
                  Digital Food Menu
                </Link>
              </li>
              <li>
                <Link href="/reserve" className="hover:text-[#E23744] transition">
                  Reserve a Dining Table
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#E23744] transition">
                  Live Order Tracker
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-[#93959F]">
            © {new Date().getFullYear()} DineDesk Restaurant Platform. CodSoft Web Development Task 2.
          </p>

          {/* Subtle Staff Portal Link as instructed */}
          <Link
            href="/staff/login"
            className="group flex items-center gap-1.5 font-bold text-[#93959F] hover:text-[#1C1C1C] transition p-1 rounded"
          >
            <Shield className="h-3.5 w-3.5 text-[#93959F] group-hover:text-[#E23744] transition" />
            <span>Staff & Management Portal →</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
