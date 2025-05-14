import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";

// GET user conversations
export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();

    // Get session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please log in to access this resource",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Pagination parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Get user conversations with pagination
    const conversations = await db.conversation.findByUserId(userId, {
      include: { ragSystem: true },
      limit,
      skip,
      orderBy: { createdAt: 'desc' }
    });

    // Get total count for pagination
    const count = await db.conversation.model.countDocuments({ user: userId });

    return NextResponse.json({
      conversations,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch conversations",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 