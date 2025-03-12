import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    // This is a development-only route to clean up the database
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: "This route is not available in production" }, { status: 403 });
    }
    
    // Delete all users using the collection directly for a more efficient operation
    const userCollection = await getCollection('User');
    await userCollection.deleteMany({});
    
    return NextResponse.json({ message: "Database cleaned up successfully" });
  } catch (error) {
    console.error("Error cleaning up database:", error);
    return NextResponse.json({ error: "Failed to clean up database" }, { status: 500 });
  }
} 