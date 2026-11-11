import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, redirectUrl: "/staff/login" });
  res.cookies.delete("dinedesk_role");
  res.cookies.delete("dinedesk_user");
  return res;
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/staff/login?logout=success", req.url));
  res.cookies.delete("dinedesk_role");
  res.cookies.delete("dinedesk_user");
  return res;
}
