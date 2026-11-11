import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, email, password } = body;

    let targetRole: "ADMIN" | "KITCHEN" = "KITCHEN";
    let userName = "Kitchen Operator";
    let userEmail = "kitchen@dinedesk.com";

    if (role === "ADMIN" || email === "admin@dinedesk.com" || email?.includes("admin")) {
      targetRole = "ADMIN";
      userName = "Executive Manager";
      userEmail = "admin@dinedesk.com";
    } else {
      targetRole = "KITCHEN";
      userName = "Head Line Cook";
      userEmail = "kitchen@dinedesk.com";
    }

    const redirectUrl = targetRole === "ADMIN" ? "/admin" : "/kitchen";
    const res = NextResponse.json({
      success: true,
      role: targetRole,
      user: { name: userName, email: userEmail, role: targetRole },
      redirectUrl,
    });

    // Set cookie valid for 7 days
    res.cookies.set("dinedesk_role", targetRole, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      httpOnly: false, // Accessible by both middleware & client
    });

    res.cookies.set(
      "dinedesk_user",
      JSON.stringify({ name: userName, email: userEmail, role: targetRole }),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        httpOnly: false,
      }
    );

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log in" },
      { status: 500 }
    );
  }
}
