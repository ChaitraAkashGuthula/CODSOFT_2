import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { UpdateTableStatusSchema } from "@/lib/validations";
import { realtimeDispatcher } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tables = dataStore.getTables();
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

    const updated = dataStore.updateTableStatus(tableId, validated.status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Table not found" },
        { status: 404 }
      );
    }

    try {
      realtimeDispatcher.broadcast("table:updated", updated);
    } catch {}

    return NextResponse.json({ success: true, table: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update table" },
      { status: 400 }
    );
  }
}
