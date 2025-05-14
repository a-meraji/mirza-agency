import { NextRequest, NextResponse } from 'next/server';
import { userModel } from '@/lib/models/user';
import { ragSystemModel } from '@/lib/models/ragSystem';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const ragType = searchParams.get('ragType') || '';
    const ragStatus = searchParams.get('ragStatus') || '';
    
    // Fetch all users since we need to filter by RAG system properties
    let users = await userModel.findMany();
    
    // If role or status filters are applied
    if (role || status) {
      const where: any = {};
      if (role) where.role = role;
      if (status) where.status = status;
      
      // Refine the query with role/status filters
      users = await userModel.findMany({ where });
    }
    
    // For each user, get their associated RAG systems
    const usersWithRagSystems = await Promise.all(
      users.map(async (user) => {
        const ragSystems = await ragSystemModel.findByUserId(user.id);
        
        return {
          id: user.id,
          name: user.name || '',
          email: user.email,
          apiKey: user.apiKey,
          phone: '', // Add if available in your schema
          role: user.role,
          status: 'active', // Default status, modify if you have a status field
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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
      })
    );
    
    // Client-side filtering for search, RAG type, and RAG status
    let filteredUsers = usersWithRagSystems;
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name?.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply RAG type filter
    if (ragType) {
      filteredUsers = filteredUsers.filter(user => 
        user.ragSystems.some(rag => rag.type === ragType)
      );
    }
    
    // Apply RAG status filter
    if (ragStatus) {
      filteredUsers = filteredUsers.filter(user => 
        user.ragSystems.some(rag => rag.status === ragStatus)
      );
    }
    
    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error('Error filtering users:', error);
    return NextResponse.json(
      { error: 'Failed to filter users' },
      { status: 500 }
    );
  }
} 