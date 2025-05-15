import { NextRequest, NextResponse } from 'next/server';
import { userModel } from '@/lib/models/user';

/**
 * Middleware to authenticate requests using API key
 * @param request Next.js request object
 */
export async function validateApiKey(request: NextRequest) {
  // Get API key from header
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) {
    return { 
      success: false, 
      response: NextResponse.json({ error: 'API key is required' }, { status: 401 }) 
    };
  }
  
  try {
    // Find user by API key
    const users = await userModel.findMany({ where: { apiKey } });
    
    if (!users || users.length === 0) {
      return { 
        success: false, 
        response: NextResponse.json({ error: 'Invalid API key' }, { status: 401 }) 
      };
    }
    
    // Return the first user with matching API key
    const authenticatedUser = users[0];
    
    // Return the authenticated user
    return { success: true, user: authenticatedUser };
  } catch (error) {
    console.error('Error validating API key:', error);
    return { 
      success: false, 
      response: NextResponse.json({ error: 'Authentication error' }, { status: 500 }) 
    };
  }
} 