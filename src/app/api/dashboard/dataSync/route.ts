import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '../middleware/auth';
import { DataController } from '../controller/dataController';

/**
 * POST handler for creating conversation data with messages and usage
 * Protected by API key authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const authResult = await validateApiKey(request);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    // Extract user ID from authenticated user
    const userId = authResult.user.id;
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.ragSystemId || !body.conversationId || !body.messages || !body.usage) {
      return NextResponse.json(
        { error: 'Missing required fields: ragSystemId, conversationId, messages, or usage' },
        { status: 400 }
      );
    }
    
    // Validate messages format
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages must be a non-empty array' },
        { status: 400 }
      );
    }
    
    // Validate message content - only need text, role, and executionId
    const invalidMessages = body.messages.filter(
      msg => !msg.text || !msg.role || !msg.executionId
    );
    
    if (invalidMessages.length > 0) {
      return NextResponse.json(
        { error: 'Each message must contain text, role, and executionId' },
        { status: 400 }
      );
    }
    
    // Validate usage data - only executionId is required now
    if (!body.usage.executionId) {
      return NextResponse.json(
        { error: 'Usage data must include executionId' },
        { status: 400 }
      );
    }
    
    // Create conversation with messages and usage
    const result = await DataController.createConversationWithData(
      userId,
      body.ragSystemId,
      body.conversationId,
      body.messages,
      body.usage
    );
    
    return NextResponse.json({
      success: true,
      data: {
        conversationId: result.conversation.id,
        messageCount: result.messages.length,
        usage: {
          executionId: result.usage.executionId,
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
          costEstimated: result.usage.costEstimated
        }
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error processing data sync request:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for adding messages and usage to an existing conversation
 */
export async function PUT(request: NextRequest) {
  try {
    // Validate API key
    const authResult = await validateApiKey(request);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.conversationId || !body.messages || !body.usage) {
      return NextResponse.json(
        { error: 'Missing required fields: conversationId, messages, or usage' },
        { status: 400 }
      );
    }
    
    // Validate messages format
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages must be a non-empty array' },
        { status: 400 }
      );
    }
    
    // Validate message content - only need text, role, and executionId
    const invalidMessages = body.messages.filter(
      msg => !msg.text || !msg.role || !msg.executionId
    );
    
    if (invalidMessages.length > 0) {
      return NextResponse.json(
        { error: 'Each message must contain text, role, and executionId' },
        { status: 400 }
      );
    }
    
    // Validate usage data - only executionId is required now
    if (!body.usage.executionId) {
      return NextResponse.json(
        { error: 'Usage data must include executionId' },
        { status: 400 }
      );
    }
    
    // Add data to existing conversation
    const result = await DataController.addDataToConversation(
      body.conversationId,
      body.messages,
      body.usage
    );
    
    return NextResponse.json({
      success: true,
      data: {
        conversationId: result.conversation.id,
        messageCount: result.messages.length,
        usage: {
          executionId: result.usage.executionId,
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
          costEstimated: result.usage.costEstimated
        }
      }
    });
    
  } catch (error) {
    console.error('Error processing data update request:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 