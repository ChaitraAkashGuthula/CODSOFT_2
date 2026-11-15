import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { UpdateOrderStatusSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = dataStore.getOrderById(id);

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

    const updated = dataStore.updateOrderStatus(id, validated.status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Error in PATCH /api/orders/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
      { status: 400 }
    );
  }
}
