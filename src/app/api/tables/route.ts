import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateTableStatusSchema } from "@/lib/validations";
import { realtimeDispatcher } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableNumber: "asc" },
      include: {
        orders: {
          where: {
            status: { in: ["PENDING", "PREPARING", "READY"] },
          },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            customerName: true,
            total: true,
            createdAt: true,
          },
        },
        reservations: {
          where: {
            status: { in: ["CONFIRMED", "SEATED"] },
          },
          orderBy: { timeSlot: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, tables });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableId, status } = body;
    const validated = UpdateTableStatusSchema.parse({ status });

    const updated = await prisma.table.update({
      where: { id: tableId },
      data: { status: validated.status },
    });

    realtimeDispatcher.broadcast("table:updated", updated);

    return NextResponse.json({ success: true, table: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update table" },
      { status: 400 }
    );
  }
}
