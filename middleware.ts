import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is for the admin area (except login)
  if (path.startsWith("/admin") && !path.includes("/admin/login")) {
    const token = request.cookies.get("admin-token")?.value;
    
    // If no token is found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || "your-fallback-secret");
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  // For API routes that need admin protection
  if (path.startsWith("/api/appointments") || path.startsWith("/api/bookings")) {
    // For GET requests to /api/appointments, we allow public access
    if (path === "/api/appointments" && request.method === "GET") {
      return NextResponse.next();
    }
    
    // For POST requests to /api/bookings, we allow public access
    if (path === "/api/bookings" && request.method === "POST") {
      return NextResponse.next();
    }
    
    // For all other admin API routes, check for token
    const token = request.cookies.get("admin-token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      verify(token, process.env.JWT_SECRET || "your-fallback-secret");
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/appointments/:path*", "/api/bookings/:path*"],
}; 