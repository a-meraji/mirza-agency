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
      console.log("User authenticated via session:", userId);
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // User is authenticated via token
      try {
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const secret = process.env.NEXTAUTH_SECRET || 'your-fallback-secret';
        const decoded = verify(token, secret);
        if (decoded && typeof decoded === 'object' && decoded.id) {
          userId = decoded.id;
          console.log("User authenticated via token:", userId);
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
      }
    }
    
    // If no user ID was found, return unauthorized
    if (!userId) {
      console.log("User not authenticated");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // Increase default limit for messages
    const search = searchParams.get('search') || '';
    const conversationId = searchParams.get('conversationId') || '';
    const id = searchParams.get('id') || ''; // Get the MongoDB ID parameter
    
    console.log(`Fetching messages with params: page=${page}, limit=${limit}, search=${search}, conversationId=${conversationId}, id=${id}`);
    
    // Fetch messages from database with pagination and filtering options
    const { messages, total } = await fetchUserMessages(userId, page, limit, search, conversationId, id);
    
    console.log(`Returning ${messages.length} messages out of ${total} total`);
    return NextResponse.json({ messages, total });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add POST method to handle direct conversation ID submission
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    // If no user session found, return unauthorized
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    const conversationId = body.conversationId || '';
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversationId parameter' },
        { status: 400 }
      );
    }
    
    // Fetch messages directly by conversation ID
    try {
      const messages = await messageModel.findByConversationId(conversationId) || [];
      
      return NextResponse.json({ 
        messages: messages, 
        total: messages.length
      });
    } catch (error) {
      console.error('Error finding messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing message request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

async function fetchUserMessages(userId: string, page: number, limit: number, search: string, conversationIdParam: string, idParam: string) {
  // Calculate skip for pagination
  const skip = (page - 1) * limit;
  
  // If conversationId is provided, use it directly
  if (conversationIdParam) {
    console.log(`Using conversationId/MongoDB ID: ${conversationIdParam}`);
    
    // First verify this conversation belongs to the user
    try {
      // Try fetching by MongoDB ID first
      const conversation = await conversationModel.findById({ id: conversationIdParam });
      
      // If found, verify ownership
      if (conversation) {
        console.log(`Found conversation by MongoDB ID`);
        
        // Extract user ID from conversation for comparison
        let conversationUserId = null;
        
        if (conversation.user) {
          if (typeof conversation.user === 'string') {
            conversationUserId = conversation.user;
          } else if (typeof conversation.user === 'object') {
            // Handle case where user is a complex object
            if (conversation.user._id) {
              conversationUserId = conversation.user._id.toString();
            } else if (conversation.user.id) {
              conversationUserId = conversation.user.id;
            } else if (conversation.user.buffer) {
              // Special case for user object with buffer property
              const userObj = conversation.user.toJSON ? conversation.user.toJSON() : conversation.user;
              conversationUserId = userObj._id || userObj.id;
            } else {
              conversationUserId = conversation.user.toString();
            }
          }
        }
        
        console.log(`GET: Comparing user IDs - Session user: ${userId}, Conversation user ID extracted: ${conversationUserId}`);
        
        // Verify ownership with better comparison
        if (!conversationUserId || String(conversationUserId) !== String(userId)) {
          console.log(`Conversation does not belong to user ${userId}, it belongs to user with ID ${conversationUserId}`);
          return { messages: [], total: 0 };
        }
        
        // Direct query for messages using MongoDB ID
        console.log(`Querying messages with conversation ID: ${conversationIdParam}`);
        
        // Find messages for this conversation
        try {
          const messages = await messageModel.findByConversationId(conversationIdParam);
          console.log(`Found ${messages ? messages.length : 0} messages for conversation`);
          
          // Get total count - use length instead of direct model access
          const totalCount = messages ? messages.length : 0;
          
          return {
            messages: messages || [],
            total: totalCount
          };
        } catch (messagesError) {
          console.error('Error finding messages:', messagesError);
          return { messages: [], total: 0 };
        }
      } else {
        // Try finding by conversationId field
        const conversationByField = await conversationModel.findByConversationId(conversationIdParam);
        
        if (!conversationByField) {
          console.log(`Conversation not found with any ID: ${conversationIdParam}`);
          return { messages: [], total: 0 };
        }
        
        // Extract user ID from conversation for comparison
        let conversationUserId = null;
        
        if (conversationByField.user) {
          if (typeof conversationByField.user === 'string') {
            conversationUserId = conversationByField.user;
          } else if (typeof conversationByField.user === 'object') {
            // Handle case where user is a complex object
            if (conversationByField.user._id) {
              conversationUserId = conversationByField.user._id.toString();
            } else if (conversationByField.user.id) {
              conversationUserId = conversationByField.user.id;
            } else if (conversationByField.user.buffer) {
              // Special case for user object with buffer property
              const userObj = conversationByField.user.toJSON ? conversationByField.user.toJSON() : conversationByField.user;
              conversationUserId = userObj._id || userObj.id;
            } else {
              conversationUserId = conversationByField.user.toString();
            }
          }
        }
        
        // Verify ownership with better comparison
        if (!conversationUserId || String(conversationUserId) !== String(userId)) {
          console.log(`Conversation does not belong to user ${userId}, it belongs to user with ID ${conversationUserId}`);
          return { messages: [], total: 0 };
        }
        
        // Use the MongoDB _id for query
        const mongoDbId = conversationByField.id || conversationByField._id;
        console.log(`Using MongoDB ID for query: ${mongoDbId}`);
        
        // Find messages
        try {
          const messages = await messageModel.findByConversationId(mongoDbId);
          console.log(`Found ${messages ? messages.length : 0} messages for conversation`);
          
          // Get total count - use length instead of direct model access
          const totalCount = messages ? messages.length : 0;
          
          return {
            messages: messages || [],
            total: totalCount
          };
        } catch (messagesError) {
          console.error('Error finding messages:', messagesError);
          return { messages: [], total: 0 };
        }
      }
    } catch (error) {
      console.error('Error verifying conversation:', error);
      return { messages: [], total: 0 };
    }
  } else {
    // No specific conversation ID provided, fetch messages across all user conversations
    console.log(`Finding all conversations for user: ${userId}`);
    
    // Get all conversation IDs for this user
    let userConversations = [];
    try {
      userConversations = await conversationModel.findByUserId(userId) || [];
      console.log(`Found ${userConversations.length} conversations`);
    } catch (error) {
      console.error('Error finding user conversations:', error);
    }
    
    if (userConversations.length === 0) {
      return { messages: [], total: 0 };
    }
    
    // Extract MongoDB IDs
    const conversationIds = userConversations.map(conv => conv._id || conv.id);
    
    // Since we can't directly query by array of IDs in our model,
    // fetch messages for each conversation and combine them
    let allMessages: any[] = [];
    
    for (const convId of conversationIds) {
      try {
        const messages = await messageModel.findByConversationId(convId) || [];
        allMessages = [...allMessages, ...messages];
      } catch (error) {
        console.error(`Error finding messages for conversation ${convId}:`, error);
      }
    }
    
    // Manual pagination
    const startIndex = skip;
    const endIndex = skip + limit;
    
    // Sort by createdAt descending (newest first)
    allMessages.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Slice the messages for pagination
    const paginatedMessages = allMessages.slice(startIndex, endIndex);
    
    return {
      messages: paginatedMessages,
      total: allMessages.length
    };
  }
} 