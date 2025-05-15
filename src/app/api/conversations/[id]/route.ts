import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get the conversation ID from the URL params
    const conversationId = context.params.id;
    
    // Fetch the specific conversation from database
    // This is a simplified example - replace with your actual database query
    const conversation = await fetchConversation(conversationId, userId);
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    // Check if the conversation belongs to the user
    if (conversation.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error(`Error fetching conversation ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

// Mock function to fetch a specific conversation
// Replace this with your actual database query
async function fetchConversation(conversationId: string, userId: string) {
  // This is mock data - replace with actual database query
  const mockConversation = {
    id: conversationId,
    conversationId: `conv-${Math.random().toString(36).substring(2, 10)}`,
    createdAt: new Date().toISOString(),
    userId: userId,
    ragSystem: {
      name: 'Technical Knowledge Base',
      id: '1'
    }
  };
  
  return mockConversation;
} 