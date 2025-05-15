import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { usageModel } from '@/lib/models/usage';
import { conversationModel } from '@/lib/models/conversation';

// GET method to fetch usage based on query parameters
export async function GET(request: NextRequest) {
  try {
    // Check for user authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters for time range, if needed
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId') || '';
    
    let data;
    
    // If conversation ID is provided, get usage for that specific conversation
    if (conversationId) {
      const usageData = await usageModel.findByConversationId(conversationId);
      const usageTotals = await usageModel.getConversationTotals(conversationId);
      
      data = {
        usage: usageData || [],
        summary: usageTotals
      };
    } else {
      // Get all conversations for this user
      const userConversations = await conversationModel.findByUserId(session.user.id);
      
      // If no conversations, return empty data
      if (!userConversations || userConversations.length === 0) {
        return NextResponse.json({ 
          usage: [],
          recentUsage: [],
          summary: {
            totalPromptTokens: 0,
            totalCompletionTokens: 0,
            totalTokens: 0,
            totalCost: 0,
            executionCount: 0
          }
        });
      }
      
      // Get conversation IDs
      const conversationIds = userConversations.map(conv => conv.id);
      
      // Aggregate data here
      let totalPromptTokens = 0;
      let totalCompletionTokens = 0;
      let totalTokens = 0;
      let totalCost = 0;
      let executionCount = 0;
      let allUsage: any[] = [];
      
      // Get usage data for each conversation
      for (const convId of conversationIds) {
        const usageTotals = await usageModel.getConversationTotals(convId);
        const usageData = await usageModel.findByConversationId(convId, { 
          limit: 5, 
          orderBy: { recordedAt: 'desc' } 
        });
        
        if (usageTotals) {
          totalPromptTokens += usageTotals.totalPromptTokens || 0;
          totalCompletionTokens += usageTotals.totalCompletionTokens || 0;
          totalTokens += usageTotals.totalTokens || 0;
          totalCost += usageTotals.totalCost || 0;
          executionCount += usageTotals.executionCount || 0;
        }
        
        if (usageData && usageData.length > 0) {
          allUsage = [...allUsage, ...usageData];
        }
      }
      
      // Sort all usage by date descending and limit to 20 recent records
      allUsage.sort((a, b) => {
        const dateA = new Date(a.recordedAt || a.createdAt);
        const dateB = new Date(b.recordedAt || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      const recentUsage = allUsage.slice(0, 20);
      
      data = {
        recentUsage,
        summary: {
          totalPromptTokens,
          totalCompletionTokens,
          totalTokens,
          totalCost,
          executionCount
        }
      };
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

// POST method to handle multiple conversation IDs at once
export async function POST(request: NextRequest) {
  try {
    // Check for user authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    const { conversationIds } = body;
    
    if (!conversationIds || !Array.isArray(conversationIds) || conversationIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid conversationIds parameter' },
        { status: 400 }
      );
    }
    
    // Verify ownership of conversations
    const userConversations = await conversationModel.findByUserId(session.user.id);
    const userConversationIds = userConversations.map(conv => conv.id);
    
    // Only process conversations that belong to this user
    const validConversationIds = conversationIds.filter(id => 
      userConversationIds.includes(id)
    );
    
    if (validConversationIds.length === 0) {
      return NextResponse.json({ 
        recentUsage: [],
        summary: {
          totalPromptTokens: 0,
          totalCompletionTokens: 0,
          totalTokens: 0,
          totalCost: 0,
          executionCount: 0
        }
      });
    }
    
    // Aggregate data
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalTokens = 0;
    let totalCost = 0;
    let executionCount = 0;
    let allUsage: any[] = [];
    
    // Get usage data for each conversation
    for (const convId of validConversationIds) {
      const usageTotals = await usageModel.getConversationTotals(convId);
      const usageData = await usageModel.findByConversationId(convId, { 
        limit: 5, 
        orderBy: { recordedAt: 'desc' },
        include: { conversation: true }
      });
      
      if (usageTotals) {
        totalPromptTokens += usageTotals.totalPromptTokens || 0;
        totalCompletionTokens += usageTotals.totalCompletionTokens || 0;
        totalTokens += usageTotals.totalTokens || 0;
        totalCost += usageTotals.totalCost || 0;
        executionCount += usageTotals.executionCount || 0;
      }
      
      if (usageData && usageData.length > 0) {
        allUsage = [...allUsage, ...usageData];
      }
    }
    
    // Sort all usage by date descending and limit to 20 recent records
    allUsage.sort((a, b) => {
      const dateA = new Date(a.recordedAt || a.createdAt);
      const dateB = new Date(b.recordedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    const recentUsage = allUsage.slice(0, 20);
    
    return NextResponse.json({
      recentUsage,
      summary: {
        totalPromptTokens,
        totalCompletionTokens,
        totalTokens,
        totalCost,
        executionCount
      }
    });
    
  } catch (error) {
    console.error('Error processing usage data request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
} 