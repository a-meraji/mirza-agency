import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/models";

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@mirza.agency" }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin user already exists" }, { status: 200 });
    }

    // Create admin user
    const hashedPassword = await hash("h^sD1w$b9C&8SD34", 10);
    
    const admin = await db.user.create({
      data: {
        email: "admin@mirza.agency",
        name: "Admin",
        password: hashedPassword,
        role: "admin"
      }
    });

    return NextResponse.json({ message: "Admin user created successfully", email: admin.email }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
} 