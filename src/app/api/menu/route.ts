import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { MenuItemSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const availableOnly = searchParams.get("available") === "true";

    const categories = dataStore.getCategories(true, availableOnly, search);
    const items = dataStore.getMenuItems(availableOnly, search);

    return NextResponse.json({
      success: true,
      categories,
      items,
    });
  } catch (error: any) {
    console.error("Error in GET /api/menu:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = MenuItemSchema.parse(body);

    const item = dataStore.createMenuItem(validated);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/menu:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create menu item" },
      { status: 400 }
    );
  }
}
