import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateOrderStatusSchema } from "@/lib/validations";
import { realtimeDispatcher } from "@/lib/events";
import { OrderStatus, TableStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateOrderStatusSchema.parse(body);

    const existing = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: existing.id },
        data: { status: validated.status },
        include: {
          table: true,
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      // If order is served or cancelled, and was dine-in, check if table should be released to AVAILABLE
      if (
        (validated.status === OrderStatus.SERVED || validated.status === OrderStatus.CANCELLED) &&
        order.tableId
      ) {
        // Check if there are other unserved active orders on this table
        const otherActive = await tx.order.count({
          where: {
            tableId: order.tableId,
            id: { not: order.id },
            status: { in: [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY] },
          },
        });

        if (otherActive === 0) {
          await tx.table.update({
            where: { id: order.tableId },
            data: { status: TableStatus.AVAILABLE },
          });
        }
      }

      return order;
    });

    // Broadcast live event to customer live tracker and KDS
    realtimeDispatcher.broadcast("order:updated", updated);

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 400 }
    );
  }
}
