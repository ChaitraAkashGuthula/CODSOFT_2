import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/validations";
import { realtimeDispatcher } from "@/lib/events";
import { TableStatus, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tableId = searchParams.get("tableId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(tableId ? { tableId } : {}),
      },
      include: {
        table: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateOrderSchema.parse(body);

    // Calculate subtotal from validated item prices & quantities
    const subtotal = validated.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
    const tax = Number((subtotal * 0.08).toFixed(2));
    const tip = Number((validated.tip || 0).toFixed(2));
    const total = Number((subtotal + tax + tip).toFixed(2));

    // Generate unique order number (e.g. ORD-1005)
    const count = await prisma.order.count();
    const orderNumber = `ORD-${1000 + count + 1}`;

    // Execute atomic transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          type: validated.type,
          tableId: validated.tableId || null,
          customerName: validated.customerName,
          customerPhone: validated.customerPhone || null,
          customerEmail: validated.customerEmail || null,
          notes: validated.notes || null,
          subtotal: Number(subtotal.toFixed(2)),
          tax,
          tip,
          total,
          paymentStatus: PaymentStatus.PAID,
          paymentMethod: validated.paymentMethod || "CARD",
          items: {
            create: validated.items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              customInstructions: item.customInstructions || null,
            })),
          },
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

      // If dine-in and tableId provided, mark table as occupied
      if (validated.tableId) {
        await tx.table.update({
          where: { id: validated.tableId },
          data: { status: TableStatus.OCCUPIED },
        });
      }

      return order;
    });

    // Broadcast live event to KDS and any open screens
    realtimeDispatcher.broadcast("order:created", newOrder);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}
