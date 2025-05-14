import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get pagination parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Calculate pagination offsets
    const skip = (page - 1) * limit;
    
    // Fetch conversations from database with pagination and search
    // This is a simplified example - replace with your actual database query
    const { conversations, total } = await fetchPaginatedConversations(userId, skip, limit, search);
    
    return NextResponse.json({
      conversations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching paginated conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// Mock function to fetch paginated conversations
// Replace this with your actual database query
async function fetchPaginatedConversations(userId: string, skip: number, limit: number, search: string) {
  // Generate some mock conversations
  const allConversations = Array.from({ length: 25 }, (_, i) => {
    const id = `${i + 1}`;
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    return {
      id,
      conversationId: `conv-${Math.random().toString(36).substring(2, 10)}`,
      createdAt: date.toISOString(),
      userId,
      ragSystem: {
        name: i % 3 === 0 ? 'Technical Knowledge Base' : 
              i % 3 === 1 ? 'Customer Support' : 'Business Intelligence'
      }
    };
  });
  
  // Apply search filter if provided
  const filteredConversations = search 
    ? allConversations.filter(conv => 
        conv.conversationId.includes(search) || 
        conv.ragSystem.name.toLowerCase().includes(search.toLowerCase()))
    : allConversations;
  
  // Get total count
  const total = filteredConversations.length;
  
  // Apply pagination
  const paginatedConversations = filteredConversations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by date descending
    .slice(skip, skip + limit);
  
  return {
    conversations: paginatedConversations,
    total
  };
} 