import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ragSystemModel } from '@/lib/models/ragSystem';

/**
 * GET handler for fetching RAG systems
 * Can filter by userId
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    // Log session info for debugging
    console.log('Session:', JSON.stringify(session || 'No session'));
    
    if (!session?.user) {
      console.log('Unauthorized: No session user');
      return NextResponse.json({ error: 'Unauthorized - No user session' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      console.log(`Unauthorized: User role is '${session.user.role}', not 'admin'`);
      return NextResponse.json({ error: 'Unauthorized - Admin role required' }, { status: 401 });
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    let ragSystems;
    
    // If userId is provided, fetch RAG systems for that user
    if (userId) {
      ragSystems = await ragSystemModel.findByUserId(userId);
    } else {
      // Otherwise, fetch all RAG systems
      ragSystems = await ragSystemModel.findMany({
        include: { user: true }
      });
    }
    
    return NextResponse.json(ragSystems);
  } catch (error) {
    console.error('Error fetching RAG systems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RAG systems', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new RAG system
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    // Log session info for debugging
    console.log('Session:', JSON.stringify(session || 'No session'));
    
    if (!session?.user) {
      console.log('Unauthorized: No session user');
      return NextResponse.json({ error: 'Unauthorized - No user session' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      console.log(`Unauthorized: User role is '${session.user.role}', not 'admin'`);
      return NextResponse.json({ error: 'Unauthorized - Admin role required' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name' },
        { status: 400 }
      );
    }
    
    // Create the RAG system
    const ragSystem = await ragSystemModel.create({
      data: {
        user: body.userId,
        name: body.name,
        description: body.description || ''
      }
    });
    
    return NextResponse.json(ragSystem, { status: 201 });
  } catch (error) {
    console.error('Error creating RAG system:', error);
    return NextResponse.json(
      { error: 'Failed to create RAG system', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 