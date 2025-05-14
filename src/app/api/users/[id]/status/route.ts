import { NextRequest, NextResponse } from 'next/server';
import { userModel } from '@/lib/models/user';
import { ragSystemModel } from '@/lib/models/ragSystem';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Update user in the database
    // Note: You may need to add a status field to your user model
    // This is a simplified example
    const updatedUser = await userModel.update({
      id,
      data: { status }
    });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get RAG systems for this user
    const ragSystems = await ragSystemModel.findByUserId(id);
    
    // Format response to match the expected structure
    const formattedUser = {
      id: updatedUser.id,
      name: updatedUser.name || '',
      email: updatedUser.email,
      apiKey: updatedUser.apiKey,
      phone: '', // Add if available in your schema
      role: updatedUser.role,
      status: status, // The updated status
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastLogin: null, // Add if available in your schema
      ragSystems: ragSystems.map(system => ({
        id: system.id,
        name: system.name,
        type: 'technical', // Add if available in your schema
        status: 'active', // Default status, modify if you have a status field
        createdAt: system.createdAt,
        updatedAt: system.updatedAt,
        modelType: '',
        embeddingModel: '',
        storageSize: 0,
        documentCount: 0
      }))
    };
    
    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error(`Error updating user status:`, error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
} 