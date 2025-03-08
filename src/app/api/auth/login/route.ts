import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { db } from "@/app/lib/models";
import mongoose from "mongoose";
import { DatabaseService } from "@/app/lib/services/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    console.log("Login attempt for email:", email);
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    // Find user with our new model structure
    console.log("Attempting to find user with email:", email);
    let user = await DatabaseService.executeWithRetry(async () => {
      return await db.user.findByEmail(email);
    });
    
    // If user not found with our model, try direct MongoDB query as fallback
    if (!user && mongoose.connection.readyState === 1 && mongoose.connection.db) {
      console.log("User not found with model, trying direct query...");
      
      try {
        // Try User collection (uppercase)
        const userFromUpperCase = await mongoose.connection.db.collection('User').findOne({ email });
        
        if (userFromUpperCase && typeof userFromUpperCase === 'object' && '_id' in userFromUpperCase) {
          console.log("User found in User collection (uppercase)");
          user = {
            ...userFromUpperCase,
            id: userFromUpperCase._id.toString()
          };
        } else {
          // Try users collection (lowercase)
          const userFromLowerCase = await mongoose.connection.db.collection('users').findOne({ email });
          
          if (userFromLowerCase && typeof userFromLowerCase === 'object' && '_id' in userFromLowerCase) {
            console.log("User found in users collection (lowercase)");
            user = {
              ...userFromLowerCase,
              id: userFromLowerCase._id.toString()
            };
          }
        }
      } catch (dbError) {
        console.error("Error in direct MongoDB query:", dbError);
      }
    }
    
    if (!user) {
      console.log("User not found in any collection");
      return NextResponse.json({ error: "Invalid credentials, user not found" }, { status: 401 });
    }
    
    console.log("User found, checking password...");
    
    // Check if password is correct
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("Password is incorrect");
      return NextResponse.json({ error: "Invalid credentials, password is incorrect" }, { status: 401 });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      console.log("User is not an admin");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    console.log("Login successful for admin user");
    
    // Create JWT token for custom auth
    const token = sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.NEXTAUTH_SECRET || "your-fallback-secret",
      { expiresIn: '1d' }
    );
    
    // Set up the response
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      // Include the URL to redirect to after login
      redirectUrl: "/admin"
    });
    
    // Set cookie with token for custom auth
    response.cookies.set({
      name: 'admin-token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict'
    });
    
    // Also set the NextAuth session cookie to ensure compatibility with NextAuth protected routes
    response.cookies.set({
      name: 'next-auth.session-token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ 
      error: "Login failed", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 