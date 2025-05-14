import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { userModel } from '@/lib/models/user';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { verify } from 'jsonwebtoken';
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
        console.log("secret",secret)
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
    
    // Fetch conversations from database with pagination and search
    const { conversations, total } = await fetchUserConversations(userId, page, limit, search);
    
    return NextResponse.json({ conversations, total });
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

async function fetchUserConversations(userId: string, page: number, limit: number, search: string) {
  // Calculate skip for pagination
  const skip = (page - 1) * limit;
  
  // Build query options
  const queryOptions = {
    where: { user: userId },
    skip,
    limit,
    sort: { createdAt: -1 }, // Sort by creation date, newest first
    include: { ragSystem: true } // Include related RAG system data
  };
  
  // Add search filter if provided
  if (search) {
    // MongoDB text search or regex pattern search
    // This depends on how your collection is indexed
    queryOptions.where = {
      ...queryOptions.where,
      $or: [
        { conversationId: { $regex: search, $options: 'i' } },
        // Add other searchable fields if needed
      ]
    };
  }
  
  // Get conversations using the model
  const result = await conversationModel.findMany(queryOptions);
  
  // Get total count (for pagination)
  const countOptions = { ...queryOptions };
  delete countOptions.skip;
  delete countOptions.limit;
  delete countOptions.sort;
  const totalCount = await conversationModel.count(countOptions.where);
  
  return {
    conversations: result,
    total: totalCount
  };
} 