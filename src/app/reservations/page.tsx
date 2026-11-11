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
  MapPin,
  ChevronRight,
  Loader2,
  Utensils,
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

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("19:30");
  const [guestCount, setGuestCount] = useState(4);
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
    { label: "19:00 PM (Dinner)", val: "19:00" },
    { label: "19:30 PM (Dinner)", val: "19:30" },
    { label: "20:30 PM (Dinner)", val: "20:30" },
  ];

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tables");
      const data = await res.json();
      if (data.success) {
        setTables(data.tables || []);
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
      setError("Please select a dining table from the floor layout");
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
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      fetchTables();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#E8E8E8] bg-[#F8F9FA] p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E23744]/10 px-3 py-1 text-xs font-bold text-[#E23744] mb-2">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>DineDesk Table Booking</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1C1C]">
          Book a Restaurant Table
        </h1>
        <p className="mt-1 text-xs text-[#686B78] max-w-xl">
          Reserve your table instantly with zero booking fee. Real-time floor plan showing seat
          capacities, lighting zones, and availability.
        </p>
      </div>

      {confirmedReservation ? (
        /* Confirmed Reservation Card */
        <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-8 text-center max-w-xl mx-auto space-y-4 shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F8A65]/10 text-[#0F8A65]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-[#0F8A65] bg-[#0F8A65]/10 px-3 py-1 rounded-full">
              BOOKING REF: RES-{confirmedReservation.id.slice(-6).toUpperCase()}
            </span>
            <h2 className="mt-3 text-2xl font-heading font-extrabold text-[#1C1C1C]">
              Table Reserved Successfully!
            </h2>
            <p className="mt-1 text-xs text-[#686B78]">
              Your table is locked for {confirmedReservation.customerName}.
            </p>
          </div>

          <div className="rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-4 text-left text-xs space-y-2">
            <div className="flex justify-between text-[#686B78]">
              <span>Date & Time Slot:</span>
              <strong className="text-[#1C1C1C]">
                {confirmedReservation.reservationDate} at {confirmedReservation.timeSlot}
              </strong>
            </div>
            <div className="flex justify-between text-[#686B78]">
              <span>Reserved Table:</span>
              <strong className="text-[#E23744]">
                Table #{confirmedReservation.table?.tableNumber} ({confirmedReservation.table?.location})
              </strong>
            </div>
            <div className="flex justify-between text-[#686B78]">
              <span>Guests:</span>
              <strong className="text-[#1C1C1C]">{confirmedReservation.guestCount} Diners</strong>
            </div>
            {confirmedReservation.specialRequests && (
              <div className="pt-2 border-t border-[#E8E8E8] text-[11px] text-[#686B78]">
                <span>Notes: {confirmedReservation.specialRequests}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setConfirmedReservation(null);
              fetchTables();
            }}
            className="w-full rounded-xl bg-[#1C1C1C] py-3 text-xs font-bold text-white hover:bg-black transition"
          >
            Book Another Slot
          </button>
        </div>
      ) : (
        /* Floor Plan + Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Table Floor Plan (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8E8E8]">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1C1C1C] flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E23744]" />
                  <span>Floor Layout & Table Selection</span>
                </h3>
                <p className="text-xs text-[#686B78]">Click on any available table to select</p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#0F8A65]"></span>
                  <span className="text-[#1C1C1C]">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#FC8019]"></span>
                  <span className="text-[#686B78]">Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#93959F]"></span>
                  <span className="text-[#93959F]">Occupied</span>
                </div>
              </div>
            </div>

            {/* Tables Grid categorized by zone */}
            <div className="space-y-6">
              {/* Window Bay */}
              <div>
                <span className="text-xs font-bold text-[#93959F] uppercase tracking-wider block mb-2">
                  🪟 Window View (Scenic Seating)
                </span>
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
                          className={`rounded-xl border p-4 cursor-pointer transition ${
                            isSelected
                              ? "border-[#E23744] bg-[#E23744]/5 ring-2 ring-[#E23744]/30"
                              : isAvail
                              ? "border-[#E8E8E8] bg-[#FFFFFF] hover:border-[#0F8A65] hover:bg-[#F8F9FA]"
                              : "border-[#E8E8E8] bg-[#F4F5F7] opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="font-heading text-sm text-[#1C1C1C]">
                              Table #{table.tableNumber}
                            </strong>
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                table.status === "AVAILABLE"
                                  ? "bg-[#0F8A65]"
                                  : table.status === "RESERVED"
                                  ? "bg-[#FC8019]"
                                  : "bg-[#93959F]"
                              }`}
                            ></span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-[#686B78]">
                            <span>{table.capacity} Seater</span>
                            <span className="font-semibold text-[11px] uppercase">
                              {table.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Main Dining Hall */}
              <div>
                <span className="text-xs font-bold text-[#93959F] uppercase tracking-wider block mb-2">
                  🍽️ Main Dining Hall
                </span>
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
                          className={`rounded-xl border p-4 cursor-pointer transition ${
                            isSelected
                              ? "border-[#E23744] bg-[#E23744]/5 ring-2 ring-[#E23744]/30"
                              : isAvail
                              ? "border-[#E8E8E8] bg-[#FFFFFF] hover:border-[#0F8A65] hover:bg-[#F8F9FA]"
                              : "border-[#E8E8E8] bg-[#F4F5F7] opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="font-heading text-sm text-[#1C1C1C]">
                              Table #{table.tableNumber}
                            </strong>
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                table.status === "AVAILABLE"
                                  ? "bg-[#0F8A65]"
                                  : table.status === "RESERVED"
                                  ? "bg-[#FC8019]"
                                  : "bg-[#93959F]"
                              }`}
                            ></span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-[#686B78]">
                            <span>{table.capacity} Seater</span>
                            <span className="font-semibold text-[11px] uppercase">
                              {table.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Patio Garden & VIP Booth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-[#93959F] uppercase tracking-wider block mb-2">
                    🌿 Outdoor Patio Garden
                  </span>
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
                            className={`rounded-xl border p-3 cursor-pointer flex items-center justify-between transition ${
                              isSelected
                                ? "border-[#E23744] bg-[#E23744]/5"
                                : isAvail
                                ? "border-[#E8E8E8] bg-[#FFFFFF] hover:border-[#0F8A65]"
                                : "border-[#E8E8E8] bg-[#F4F5F7] opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <span className="font-bold text-xs text-[#1C1C1C]">
                              Table #{table.tableNumber} ({table.capacity} Seater)
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                table.status === "AVAILABLE"
                                  ? "bg-[#0F8A65]/10 text-[#0F8A65]"
                                  : "bg-gray-100 text-[#93959F]"
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
                  <span className="text-xs font-bold text-[#93959F] uppercase tracking-wider block mb-2">
                    👑 VIP Private Booth
                  </span>
                  {tables
                    .filter((t) => t.location === "VIP Booth")
                    .map((table) => {
                      const isSelected = selectedTableId === table.id;
                      const isAvail = table.status === "AVAILABLE";
                      return (
                        <div
                          key={table.id}
                          onClick={() => isAvail && setSelectedTableId(table.id)}
                          className={`rounded-xl border p-3.5 cursor-pointer transition ${
                            isSelected
                              ? "border-[#FC8019] bg-[#FC8019]/10 ring-2 ring-[#FC8019]/30"
                              : isAvail
                              ? "border-[#E8E8E8] bg-[#FFFFFF] hover:border-[#FC8019]"
                              : "border-[#E8E8E8] bg-[#F4F5F7] opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#1C1C1C]">
                              Table #08 — VIP Booth
                            </span>
                            <span className="rounded bg-[#FC8019]/10 text-[#FC8019] text-[10px] font-bold px-2 py-0.5">
                              6 Seater
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#686B78]">
                            Plush banquet with dedicated server station.
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Selected Table Callout */}
            {selectedTable && (
              <div className="mt-5 rounded-xl bg-[#0F8A65]/10 border border-[#0F8A65]/30 p-3 text-xs text-[#0F8A65] flex items-center justify-between">
                <span>
                  Selected: <strong>Table #{selectedTable.tableNumber}</strong> ({selectedTable.location}, capacity up to {selectedTable.capacity} guests)
                </span>
                {guestCount > selectedTable.capacity && (
                  <span className="font-bold text-[#E23744]">
                    Warning: Party of {guestCount} exceeds capacity ({selectedTable.capacity})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Booking Form (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#1C1C1C]">
              Booking Information
            </h3>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-[#E23744] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 font-sans focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">Guests</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 font-sans focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block font-bold text-[#1C1C1C] mb-1.5">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot.val}
                      onClick={() => setSelectedTimeSlot(slot.val)}
                      className={`rounded-lg py-2 text-xs font-bold transition border ${
                        selectedTimeSlot === slot.val
                          ? "bg-[#E23744] text-white border-[#E23744] shadow-sm"
                          : "bg-[#FFFFFF] text-[#3E4152] border-[#E8E8E8] hover:bg-[#F8F9FA]"
                      }`}
                    >
                      {slot.val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C1C1C] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Primary Booker"
                  className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1C1C1C] mb-1">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1C1C1C] mb-1">
                  Special Requests / Occasion
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Birthday celebration, anniversary, high chair needed..."
                  className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 focus:border-[#E23744] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedTableId}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E23744] hover:bg-[#cb202d] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-btn transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Confirming Table...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Reservation</span>
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
