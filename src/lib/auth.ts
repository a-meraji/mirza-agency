import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { db } from './models';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interface for authenticated user
interface AuthUser {
  id: string;
  email: string;
  role: string;
}

// Interface for authentication check result
interface AuthCheckResult {
  authenticated: boolean;
  user?: AuthUser;
}

/**
 * Check if a request is authenticated
 * @param req Next API request
 * @param res Next API response
 * @returns Authentication result with user if authenticated
 */
export async function isAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthCheckResult> {
  try {
    // Get token from cookies or authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.substring(7)
        : null);

    // If no token, not authenticated
    if (!token) {
      return { authenticated: false };
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Get user from database
    const user = await db.user.findById({ id: decoded.id });
    
    // If user not found, not authenticated
    if (!user) {
      return { authenticated: false };
    }
    
    // Return authenticated with user
    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false };
  }
}

/**
 * Create a JWT token for a user
 * @param user User data
 * @returns JWT token
 */
export function createToken(user: { id: string; email: string }): string {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d'
  });
} 