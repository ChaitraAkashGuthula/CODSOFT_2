import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { UpdateReservationStatusSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateReservationStatusSchema.parse(body);

    const updated = dataStore.updateReservationStatus(id, validated.status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update reservation" },
      { status: 400 }
    );
  }
}
