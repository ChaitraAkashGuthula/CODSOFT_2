import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MenuItemSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const availableOnly = searchParams.get("available") === "true";

    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: {
            ...(availableOnly ? { isAvailable: true } : {}),
            ...(search
              ? {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
          orderBy: { name: "asc" },
        },
      },
    });

    const allItems = await prisma.menuItem.findMany({
      where: {
        ...(availableOnly ? { isAvailable: true } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      categories,
      items: allItems,
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

    const item = await prisma.menuItem.create({
      data: validated,
      include: { category: true },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/menu:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create menu item" },
      { status: 400 }
    );
  }
}
