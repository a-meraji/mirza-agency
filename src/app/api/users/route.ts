import { NextRequest, NextResponse } from 'next/server';
import { userModel } from '@/lib/models/user';
import { ragSystemModel } from '@/lib/models/ragSystem';

export async function GET(request: NextRequest) {
  try {
    // Fetch users from the database
    const users = await userModel.findMany();
    
    // For each user, get their associated RAG systems
    const usersWithRagSystems = await Promise.all(
      users.map(async (user) => {
        const ragSystems = await ragSystemModel.findByUserId(user.id);
        
        return {
          id: user.id,
          name: user.name || '',
          email: user.email,
          apiKey: user.apiKey,
          phone: '', // Add this field if available in your schema
          role: user.role,
          status: 'active', // Default status, modify if you have a status field
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: null, // Add this field if available in your schema
          ragSystems: ragSystems.map(system => ({
            id: system.id,
            name: system.name,
            type: 'technical', // Add this field if available in your schema
            status: 'active', // Default status, modify if you have a status field
            createdAt: system.createdAt,
            updatedAt: system.updatedAt,
            modelType: '',
            embeddingModel: '',
            storageSize: 0,
            documentCount: 0
          }))
        };
      })
    );
    
    return NextResponse.json({ users: usersWithRagSystems });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 