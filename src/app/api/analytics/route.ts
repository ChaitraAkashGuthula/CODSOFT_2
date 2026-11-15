import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = dataStore.getAnalytics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    console.error("Error in GET /api/analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate analytics" },
      { status: 500 }
    );
  }
}
