import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { CreateReservationSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;
    const status = searchParams.get("status") || undefined;

    const reservations = dataStore.getReservations(date, status);

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

    const reservation = dataStore.createReservation(validated);

    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create reservation" },
      { status: 400 }
    );
  }
}
