import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();

    const { name, email, password } = await req.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await db.user.findByEmail(email);
    
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }
    
    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || '',
        role: 'user',
        apiKey
      }
    });
    
    // Return success response without sensitive data
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      error: "Registration failed", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 