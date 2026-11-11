import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateReservationStatusSchema } from "@/lib/validations";
import { realtimeDispatcher } from "@/lib/events";
import { ReservationStatus, TableStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateReservationStatusSchema.parse(body);

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.reservation.update({
        where: { id },
        data: { status: validated.status },
        include: { table: true },
      });

      if (validated.status === ReservationStatus.SEATED) {
        await tx.table.update({
          where: { id: res.tableId },
          data: { status: TableStatus.OCCUPIED },
        });
      } else if (
        validated.status === ReservationStatus.COMPLETED ||
        validated.status === ReservationStatus.CANCELLED
      ) {
        // Return table to available if no other reservations or active orders
        await tx.table.update({
          where: { id: res.tableId },
          data: { status: TableStatus.AVAILABLE },
        });
      }

      return res;
    });

    realtimeDispatcher.broadcast("table:updated", updated);

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update reservation" },
      { status: 400 }
    );
  }
}
