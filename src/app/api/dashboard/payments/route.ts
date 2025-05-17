import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';
import { verify } from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * GET handler for user payments in dashboard
 */
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/dashboard/payments received');
    
    // Get authenticated user from NextAuth session
    let userId = null;
    
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        userId = session.user.id;
        console.log('User authenticated via NextAuth session:', userId);
      }
    } catch (sessionError) {
      console.log('NextAuth session check failed, trying token method:', sessionError);
    }
    
    // If NextAuth failed, try JWT token
    if (!userId) {
      const token = req.cookies.get('token')?.value;
      if (token) {
        try {
          const decoded = verify(token, process.env.JWT_SECRET || 'your-fallback-secret') as { id: string };
          userId = decoded.id;
          console.log('User authenticated via token:', userId);
        } catch (tokenError) {
          console.log('Token verification failed:', tokenError);
        }
      }
    }
    
    // If no authentication method worked, return unauthorized
    if (!userId) {
      console.log('Authentication failed - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const currency = url.searchParams.get('currency');
    
    // Build filter object
    const filter: any = {
      user: userId // Only get payments for this user
    };
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      
      if (endDate) {
        // Set endDate to the end of the day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDateTime;
      }
    }
    
    // Currency filter
    if (currency) {
      filter.currency = currency;
    }
    
    console.log('Fetching user payments with filter:', filter);
    
    // Fetch payments with filters
    const payments = await db.payment.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    
    if (payments && Array.isArray(payments)) {
      console.log(`Found ${payments.length} payments for user ${userId}`);
    } else {
      console.log('No payments found or error in response');
    }
    
    return NextResponse.json({ payments: payments || [] });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return NextResponse.json(
      { message: 'Error fetching user payments', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 