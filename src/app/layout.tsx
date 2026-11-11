import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DineDesk | Restaurant Ordering, Table Reservations & KDS Platform",
  description:
    "A commercial-grade restaurant ordering and table management platform. Digital menu, live cart, table reservation, and real-time Kitchen Display System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-[#FFFFFF] text-[#1C1C1C] font-sans selection:bg-[#E23744]/20 selection:text-[#E23744] flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 bg-[#FFFFFF]">{children}</main>
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
