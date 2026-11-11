"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChefHat,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Utensils,
  LayoutDashboard,
} from "lucide-react";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnauthorized = searchParams.get("error") === "unauthorized";
  const redirectPath = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (roleOverride?: "KITCHEN" | "ADMIN") => {
    try {
      setErrorMessage(null);
      setLoadingRole(roleOverride || (email.includes("admin") ? "ADMIN" : "KITCHEN"));

      const payload = roleOverride
        ? { role: roleOverride }
        : { email, password, role: email.includes("admin") ? "ADMIN" : "KITCHEN" };

      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      const target =
        redirectPath && (data.role === "ADMIN" || !redirectPath.startsWith("/admin"))
          ? redirectPath
          : data.redirectUrl;

      window.location.href = target;
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#E23744]/20 selection:text-[#E23744]">
      {/* Back to Dining Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#686B78] hover:text-[#1C1C1C] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Customer Dining Menu</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E23744] text-white shadow-elevated mb-3">
            <Utensils className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-[#1C1C1C] tracking-tight">
            DineDesk Staff Gateway
          </h1>
          <p className="mt-1 text-xs text-[#686B78]">
            Restricted access portal for line cooks, expeditors, and restaurant executives.
          </p>
        </div>

        {/* Unauthorized Route Warning Banner */}
        {isUnauthorized && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm flex items-start gap-3 animate-in fade-in">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-sm text-amber-950 mb-0.5">
                Staff Authentication Required
              </strong>
              <p className="text-amber-800 leading-relaxed">
                Direct access to staff consoles ({redirectPath || "Kitchen/Admin"}) is restricted. Please authenticate using your staff badge credentials or select a one-click evaluator session below.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 sm:p-8 shadow-card">
          {/* Quick Evaluator / Demo Login Switcher */}
          <div className="mb-6 pb-6 border-b border-[#E8E8E8]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#93959F] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FC8019]" />
                Recruiter & Demo Quick Switcher
              </span>
              <span className="rounded-full bg-emerald-50 text-[#0F8A65] text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                1-Click Bypass
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kitchen Staff Button */}
              <button
                type="button"
                onClick={() => handleLogin("KITCHEN")}
                disabled={loadingRole !== null}
                className="group relative flex flex-col items-start p-3.5 rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] hover:bg-emerald-50 hover:border-emerald-300 transition text-left active:scale-[0.98]"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1C1C1C] group-hover:text-[#0F8A65]">
                    <ChefHat className="h-4 w-4 text-[#0F8A65]" />
                    <span>Kitchen Staff</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#93959F] group-hover:text-[#0F8A65] group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-[#686B78]">
                  Wall-mounted POS ticket terminal & live audio chime
                </p>
                <span className="mt-2 text-[10px] font-mono font-bold text-[#0F8A65]">
                  → Opens /kitchen
                </span>
              </button>

              {/* Restaurant Admin Button */}
              <button
                type="button"
                onClick={() => handleLogin("ADMIN")}
                disabled={loadingRole !== null}
                className="group relative flex flex-col items-start p-3.5 rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] hover:bg-rose-50 hover:border-rose-300 transition text-left active:scale-[0.98]"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1C1C1C] group-hover:text-[#E23744]">
                    <LayoutDashboard className="h-4 w-4 text-[#E23744]" />
                    <span>Restaurant Admin</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-[#93959F] group-hover:text-[#E23744] group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-[#686B78]">
                  Daily revenue, menu inventory CRUD & table layout
                </p>
                <span className="mt-2 text-[10px] font-mono font-bold text-[#E23744]">
                  → Opens /admin
                </span>
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#93959F]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dinedesk.com or kitchen@dinedesk.com"
                  className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] pl-10 pr-3 py-2.5 text-xs text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                Security Password / Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#93959F]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] pl-10 pr-3 py-2.5 text-xs text-[#1C1C1C] focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingRole !== null}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1C1C1C] hover:bg-black py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-btn transition active:scale-95 disabled:opacity-50"
            >
              <span>{loadingRole ? "Verifying Credentials..." : "Sign In to Staff Console"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E8E8E8] text-center text-[11px] text-[#93959F] flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#0F8A65]" />
            <span>Role-Based Access Control enforced via Next.js Edge Middleware</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-[#686B78]">
          Loading staff security gateway...
        </div>
      }
    >
      <StaffLoginForm />
    </Suspense>
  );
}
