"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime error to console or error service
    console.error("Global runtime error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F9FA] text-[#1C1C1C] font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 sm:p-8 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E23744]/10 text-[#E23744]">
            <AlertCircle className="h-7 w-7" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E23744]">
            System Recovery
          </span>
          <h1 className="mt-1 font-heading text-xl sm:text-2xl font-extrabold text-[#1C1C1C]">
            Something went unexpectedly wrong
          </h1>
          <p className="mt-2 text-xs text-[#686B78] leading-relaxed">
            Our dining system encountered an unexpected condition. Your active cart and orders remain safely preserved in local session storage.
          </p>

          {error.digest && (
            <p className="mt-3 font-mono text-[10px] text-[#93959F] bg-[#F4F5F7] p-2 rounded-lg">
              Error Digest: {error.digest}
            </p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#E23744] hover:bg-[#cb202d] py-3 text-xs font-bold text-white shadow-btn transition active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] hover:bg-[#F4F5F7] py-3 text-xs font-bold text-[#1C1C1C] transition shadow-sm"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Back to Menu</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
