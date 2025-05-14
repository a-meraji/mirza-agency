import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { verify } from 'jsonwebtoken';
import { messageModel } from '@/lib/models/message';
import { conversationModel } from '@/lib/models/conversation';

export async function GET(request: NextRequest) {
  try {
    // Check for authorization in multiple ways
    
    // 1. Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    // 2. Check Authorization header
    const authHeader = request.headers.get('Authorization');
    let userId = null;
    
    if (session?.user?.id) {
      // User is authenticated via session
      userId = session.user.id;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // User is authenticated via token
      try {
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const secret = process.env.NEXTAUTH_SECRET || 'your-fallback-secret';
        const decoded = verify(token, secret);
        if (decoded && typeof decoded === 'object' && decoded.id) {
          userId = decoded.id;
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
      }
    }
    
    // If no user ID was found, return unauthorized
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const conversationId = searchParams.get('conversationId') || '';
    
    // Fetch messages from database with pagination and filtering options
    const { messages, total } = await fetchUserMessages(userId, page, limit, search, conversationId);
    
    return NextResponse.json({ messages, total });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

async function fetchUserMessages(userId: string, page: number, limit: number, search: string, conversationIdParam: string) {
  // Calculate skip for pagination
  const skip = (page - 1) * limit;
  
  // If conversationId is provided, verify it belongs to the user
  let conversationIds = [];
  
  if (conversationIdParam) {
    // Verify the conversation belongs to the user
    const conversation = await conversationModel.findOne({
      where: {
        conversationId: conversationIdParam,
        user: userId
      }
    });
    
    if (conversation) {
      conversationIds = [conversation._id];
    } else {
      // Return empty result if conversation doesn't exist or doesn't belong to user
      return { messages: [], total: 0 };
    }
  } else {
    // Get all conversation IDs for this user
    const userConversations = await conversationModel.findMany({
      where: { user: userId },
      select: { _id: 1 }
    });
    
    conversationIds = userConversations.map(conv => conv._id);
    
    // If user has no conversations, return empty results
    if (conversationIds.length === 0) {
      return { messages: [], total: 0 };
    }
  }
  
  // Build query options
  const queryOptions = {
    where: {
      conversation: { $in: conversationIds }
    },
    skip,
    limit,
    sort: { createdAt: -1 }, // Sort by creation date, newest first
    include: { conversation: true } // Include related conversation data
  };
  
  // Add search filter if provided
  if (search) {
    queryOptions.where = {
      ...queryOptions.where,
      text: { $regex: search, $options: 'i' }
    };
  }
  
  // Get messages using the model
  const messages = await messageModel.findMany(queryOptions);
  
  // Get total count (for pagination)
  const countOptions = { ...queryOptions };
  delete countOptions.skip;
  delete countOptions.limit;
  delete countOptions.sort;
  const totalCount = await messageModel.count(countOptions.where);
  
  return {
    messages,
    total: totalCount
  };
} 