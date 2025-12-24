import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const token = req.cookies.get("token")?.value;

  // Helper: redirect to login and clear token
  const redirectToLogin = () => {
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    response.cookies.delete("token");
    return response;
  };

  // Public routes (accessible without token)
  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  // Allow static assets or API routes to pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If no token → allow only public routes
  if (!token) {
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }
    return redirectToLogin();
  }

  try {
    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const type = payload?.type;

    // Restrict logged-in users from visiting auth pages
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      if (type === "Admin") {
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      } else if (type === "Employee") {
        url.pathname = "/employee/dashboard";
        return NextResponse.redirect(url);
      }
    }

    // Admin routes
    if (type === "Admin") {
      if (!pathname.startsWith("/admin")) {
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Employee routes
    if (type === "Employee") {
      if (!pathname.startsWith("/employee")) {
        url.pathname = "/employee/dashboard";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Unknown role
    return redirectToLogin();

  } catch (err) {
    // Invalid or expired token
    return redirectToLogin();
  }
}

// ✅ Only protect admin & employee routes
export const config = {
  matcher: ["/admin/:path*", "/employee/:path*"],
};
