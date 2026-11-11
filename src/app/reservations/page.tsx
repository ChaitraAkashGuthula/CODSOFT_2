"use client";

import React, { useEffect, useState } from "react";
import { playSuccessChime } from "@/lib/audio";
import confetti from "canvas-confetti";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  ChevronRight,
  Loader2,
  Info,
} from "lucide-react";

interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  location: string;
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
}

export default function ReservationsPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("19:30");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("Sarah Jenkins");
  const [customerEmail, setCustomerEmail] = useState("sarah.j@example.com");
  const [customerPhone, setCustomerPhone] = useState("+1 (555) 987-6543");
  const [specialRequests, setSpecialRequests] = useState("");

  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);

  const timeSlots = [
    { label: "12:00 PM (Lunch)", val: "12:00" },
    { label: "13:30 PM (Lunch)", val: "13:30" },
    { label: "18:00 PM (Dinner)", val: "18:00" },
    { label: "19:00 PM (Prime)", val: "19:00" },
    { label: "19:30 PM (Prime)", val: "19:30" },
    { label: "20:30 PM (Evening)", val: "20:30" },
    { label: "21:15 PM (Late)", val: "21:15" },
  ];

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (data.success) {
        setTables(data.tables || []);
        // Auto select first available table that fits guest count
        const firstFit = data.tables.find(
          (t: Table) => t.status === "AVAILABLE" && t.capacity >= guestCount
        );
        if (firstFit) setSelectedTableId(firstFit.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId) {
      setError("Please select a table on the interactive floor plan");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        tableId: selectedTableId,
        customerName,
        customerEmail,
        customerPhone,
        guestCount,
        reservationDate: selectedDate,
        timeSlot: selectedTimeSlot,
        specialRequests: specialRequests || null,
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Reservation failed");
      }

      setConfirmedReservation(data.reservation);
      playSuccessChime();
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
      fetchTables();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Floor & Reservation Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-serif">
          Reserve an Intimate Table
        </h1>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
          Select your desired date, party size, and pinpoint your exact dining table on our
          interactive floor plan with real-time seating availability.
        </p>
      </div>

      {confirmedReservation ? (
        /* Confirmed Reservation Banner */
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono text-emerald-300">
              Booking Ref: RES-{confirmedReservation.id.slice(-6).toUpperCase()}
            </span>
            <h2 className="mt-2 text-2xl font-bold font-serif text-white">
              Reservation Confirmed!
            </h2>
            <p className="mt-1 text-sm text-zinc-300">
              We look forward to welcoming you, {confirmedReservation.customerName}.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left text-xs space-y-2 text-zinc-300">
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <strong className="text-white">
                {confirmedReservation.reservationDate} at {confirmedReservation.timeSlot}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Table Reserved:</span>
              <strong className="text-white">
                Table #{confirmedReservation.table?.tableNumber} ({confirmedReservation.table?.location})
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Party Size:</span>
              <strong className="text-white">{confirmedReservation.guestCount} Guests</strong>
            </div>
            {confirmedReservation.specialRequests && (
              <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                <span>Special Requests: {confirmedReservation.specialRequests}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setConfirmedReservation(null);
              fetchTables();
            }}
            className="w-full rounded-2xl bg-white/10 py-3 text-xs font-bold text-white hover:bg-white/15 transition"
          >
            Book Another Table
          </button>
        </div>
      ) : (
        /* Split view: Floor Map & Booking Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Interactive Floor Plan */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#161a22] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  <span>Restaurant Floor Layout</span>
                </h3>
                <p className="text-xs text-zinc-400">Click any available table to select</p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-zinc-300">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                  <span className="text-zinc-300">Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-zinc-300">Occupied</span>
                </div>
              </div>
            </div>

            {/* Floor Sections Grid */}
            <div className="rounded-2xl border border-white/5 bg-[#0f1218] p-5 space-y-6">
              {/* Window Bay Section */}
              <div>
                <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>🪟 Window Bay (Scenic Street View)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {tables
                    .filter((t) => t.location === "Window Bay")
                    .map((table) => {
                      const isSelected = selectedTableId === table.id;
                      const isAvail = table.status === "AVAILABLE";
                      return (
                        <div
                          key={table.id}
                          onClick={() => isAvail && setSelectedTableId(table.id)}
                          className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                            isSelected
                              ? "border-rose-500 bg-rose-500/15 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/30"
                              : isAvail
                              ? "border-white/10 bg-[#191d26] hover:border-white/20 hover:bg-[#1e232e]"
                              : "border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-white text-sm">
                              Table #{table.tableNumber}
                            </span>
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                table.status === "AVAILABLE"
                                  ? "bg-emerald-400"
                                  : table.status === "RESERVED"
                                  ? "bg-amber-400"
                                  : "bg-rose-500"
                              }`}
                            ></span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> Seats up to {table.capacity}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-zinc-400">
                              {table.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Main Dining Room Section */}
              <div>
                <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>🕯️ Main Dining Room (Chandelier Hall)</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {tables
                    .filter((t) => t.location === "Main Dining")
                    .map((table) => {
                      const isSelected = selectedTableId === table.id;
                      const isAvail = table.status === "AVAILABLE";
                      return (
                        <div
                          key={table.id}
                          onClick={() => isAvail && setSelectedTableId(table.id)}
                          className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                            isSelected
                              ? "border-rose-500 bg-rose-500/15 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/30"
                              : isAvail
                              ? "border-white/10 bg-[#191d26] hover:border-white/20 hover:bg-[#1e232e]"
                              : "border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-white text-sm">
                              Table #{table.tableNumber}
                            </span>
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                table.status === "AVAILABLE"
                                  ? "bg-emerald-400"
                                  : table.status === "RESERVED"
                                  ? "bg-amber-400"
                                  : "bg-rose-500"
                              }`}
                            ></span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> Seats {table.capacity}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-zinc-400">
                              {table.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Patio & VIP Booth Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    🌿 Patio Garden (Open-Air)
                  </div>
                  <div className="space-y-2">
                    {tables
                      .filter((t) => t.location === "Patio Garden")
                      .map((table) => {
                        const isSelected = selectedTableId === table.id;
                        const isAvail = table.status === "AVAILABLE";
                        return (
                          <div
                            key={table.id}
                            onClick={() => isAvail && setSelectedTableId(table.id)}
                            className={`cursor-pointer rounded-xl border p-3 transition flex items-center justify-between ${
                              isSelected
                                ? "border-rose-500 bg-rose-500/15"
                                : isAvail
                                ? "border-white/10 bg-[#191d26] hover:border-white/20"
                                : "border-white/5 bg-white/[0.02] opacity-50"
                            }`}
                          >
                            <span className="font-bold text-xs text-white">
                              Table #{table.tableNumber} ({table.capacity} Guests)
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                table.status === "AVAILABLE"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              {table.status}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    👑 VIP Booth (Private Lounge)
                  </div>
                  {tables
                    .filter((t) => t.location === "VIP Booth")
                    .map((table) => {
                      const isSelected = selectedTableId === table.id;
                      const isAvail = table.status === "AVAILABLE";
                      return (
                        <div
                          key={table.id}
                          onClick={() => isAvail && setSelectedTableId(table.id)}
                          className={`cursor-pointer rounded-2xl border p-4 transition ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30"
                              : isAvail
                              ? "border-amber-500/30 bg-[#191d26] hover:border-amber-500/50"
                              : "border-white/5 opacity-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-amber-300 text-sm">
                              Table #{table.tableNumber} — VIP Booth
                            </span>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                              Seats 6
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-zinc-400">
                            Plush velvet banquet with personalized sommelier service.
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Selection Status Callout */}
            {selectedTable && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-400" />
                  <span>
                    Selected: <strong>Table #{selectedTable.tableNumber}</strong> (
                    {selectedTable.location}, capacity {selectedTable.capacity} guests)
                  </span>
                </div>
                {guestCount > selectedTable.capacity && (
                  <span className="text-amber-400 font-bold">
                    Warning: Party of {guestCount} exceeds capacity ({selectedTable.capacity})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Reservation Booking Form */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#161a22] p-6 shadow-xl">
            <h3 className="text-base font-bold text-white font-serif mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-rose-500" />
              <span>Reservation Details</span>
            </h3>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              {/* Date & Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Party Size (Guests)
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-[#1c212c] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slot Selector */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Desired Time Slot
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot.val}
                      onClick={() => setSelectedTimeSlot(slot.val)}
                      className={`rounded-xl py-2 text-xs font-medium transition ${
                        selectedTimeSlot === slot.val
                          ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40"
                          : "bg-white/5 text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      {slot.val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Contact Information */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Primary Booker"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Special Notes / Dietary / Celebrations
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Birthday champagne toast, quiet table, child high-chair..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-xs text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !selectedTableId}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-900/40 hover:from-rose-500 hover:to-rose-600 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Confirming Table Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Table Reservation</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
