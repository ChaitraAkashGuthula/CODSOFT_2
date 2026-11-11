import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get("dinedesk_role")?.value;

  // 1. Guard Admin Routes: strictly ADMIN only
  if (pathname.startsWith("/admin")) {
    if (roleCookie !== "ADMIN") {
      const loginUrl = new URL("/staff/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard Kitchen / KDS Routes: KITCHEN or ADMIN staff
  if (pathname.startsWith("/kitchen") || pathname.startsWith("/kds")) {
    if (roleCookie !== "KITCHEN" && roleCookie !== "ADMIN") {
      const loginUrl = new URL("/staff/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If already authenticated staff visits /staff/login, redirect to their portal
  if (pathname === "/staff/login") {
    // Only redirect if no explicit error or logout parameter is present
    const hasError = request.nextUrl.searchParams.has("error");
    const isLogout = request.nextUrl.searchParams.has("logout");
    if (!hasError && !isLogout) {
      if (roleCookie === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (roleCookie === "KITCHEN") {
        return NextResponse.redirect(new URL("/kitchen", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/kitchen/:path*",
    "/kds/:path*",
    "/staff/login",
  ],
};
