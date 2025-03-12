import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get("admin-token")?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }
    
    try {
      // Verify the token
      const decoded = verify(token, process.env.NEXTAUTH_SECRET || "your-fallback-secret");
      
      // Check if user has admin role
      if (decoded && typeof decoded === 'object' && decoded.role === 'admin') {
        return NextResponse.json({ authenticated: true, user: { email: decoded.email, role: decoded.role } });
      } else {
        return NextResponse.json({ authenticated: false });
      }
    } catch {
      // Invalid token
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
} 