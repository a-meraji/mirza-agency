import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/models";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
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
    const conversationId = context.params.id;
    
    // Get the conversation
    const conversation = await db.conversation.findById({
      id: conversationId
    });
    
    // Check if conversation exists and belongs to the user
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
    
    if (conversation.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to conversation" },
        { status: 403 }
      );
    }
    
    // Pagination parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Get messages for the conversation
    const messages = await db.message.findByConversationId(conversationId, {
      limit,
      skip,
      orderBy: { createdAt: 'asc' } // Chronological order
    });

    // Get total count for pagination
    const count = await db.message.model.countDocuments({ conversation: conversationId });

    return NextResponse.json({
      messages,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 