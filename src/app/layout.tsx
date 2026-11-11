import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DineDesk | CodSoft Task 2 — Restaurant Platform",
  description:
    "Production-grade restaurant ordering and table management platform with real-time Kitchen Display System (KDS), interactive menu, table booking, and admin analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen bg-[#0f1115] text-[#f8fafc] flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <CartDrawer />

        {/* Footer */}
        <footer className="mt-auto border-t border-white/5 bg-[#0b0d11] py-8 text-center text-xs text-zinc-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-sm">DineDesk</span>
              <span>— CodSoft Web Development Task 2</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>PostgreSQL & Prisma</span>
              <span>•</span>
              <span>Real-time SSE Kitchen Sync</span>
              <span>•</span>
              <span>Next.js 15 & React 19</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
