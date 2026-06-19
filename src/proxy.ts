import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isLogin = request.nextUrl.pathname === "/admin/login";
    
    // Check for auth cookie
    const authCookie = request.cookies.get("admin_auth");
    
    if (!authCookie && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    if (authCookie && authCookie.value === "true" && isLogin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
