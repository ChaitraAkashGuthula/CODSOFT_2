import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateReservationSchema } from "@/lib/validations";
import { realtimeDispatcher } from "@/lib/events";
import { TableStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const reservations = await prisma.reservation.findMany({
      where: {
        ...(date ? { reservationDate: date } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        table: true,
      },
      orderBy: [{ reservationDate: "asc" }, { timeSlot: "asc" }],
    });

    return NextResponse.json({ success: true, reservations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateReservationSchema.parse(body);

    // Atomically prevent double-booking for the same table, date and timeSlot
    const reservation = await prisma.$transaction(async (tx) => {
      // Check existing active reservations for this table & slot
      const existing = await tx.reservation.findFirst({
        where: {
          tableId: validated.tableId,
          reservationDate: validated.reservationDate,
          timeSlot: validated.timeSlot,
          status: { in: ["CONFIRMED", "SEATED"] },
        },
      });

      if (existing) {
        throw new Error(
          `Table is already booked for ${validated.reservationDate} at ${validated.timeSlot}. Please choose an alternative table or time slot.`
        );
      }

      // Check table capacity
      const table = await tx.table.findUnique({
        where: { id: validated.tableId },
      });

      if (!table) {
        throw new Error("Specified table not found");
      }

      if (table.capacity < validated.guestCount) {
        throw new Error(
          `Table ${table.tableNumber} seats up to ${table.capacity} guests. Please select a larger table for ${validated.guestCount} guests.`
        );
      }

      // Create reservation
      const res = await tx.reservation.create({
        data: {
          tableId: validated.tableId,
          customerName: validated.customerName,
          customerEmail: validated.customerEmail,
          customerPhone: validated.customerPhone,
          guestCount: validated.guestCount,
          reservationDate: validated.reservationDate,
          timeSlot: validated.timeSlot,
          specialRequests: validated.specialRequests || null,
        },
        include: { table: true },
      });

      // Update table status to RESERVED if booking is for today
      const today = new Date().toISOString().split("T")[0];
      if (validated.reservationDate === today) {
        await tx.table.update({
          where: { id: validated.tableId },
          data: { status: TableStatus.RESERVED },
        });
      }

      return res;
    });

    realtimeDispatcher.broadcast("reservation:created", reservation);

    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to complete reservation" },
      { status: 400 }
    );
  }
}
