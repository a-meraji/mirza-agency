import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';
import { verify } from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * GET handler for payments
 */
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/admin/payments received');
    
    // Method 1: Try NextAuth session (like rag-systems API)
    let isAdmin = false;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user && session.user.role === 'admin') {
        isAdmin = true;
        console.log('Admin authenticated via NextAuth session');
      }
    } catch (sessionError) {
      console.log('NextAuth session check failed, trying token method:', sessionError);
    }
    
    // Method 2: If NextAuth failed, try admin-token (like middleware.ts)
    if (!isAdmin) {
      const adminToken = req.cookies.get('admin-token')?.value;
      if (adminToken) {
        try {
          verify(adminToken, process.env.JWT_SECRET || 'your-fallback-secret');
          isAdmin = true;
          console.log('Admin authenticated via admin-token');
        } catch (tokenError) {
          console.log('Token verification failed:', tokenError);
        }
      }
    }
    
    // If neither method worked, return unauthorized
    if (!isAdmin) {
      console.log('Authentication failed - returning 401');
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const userId = url.searchParams.get('userId');
    const currency = url.searchParams.get('currency');
    
    // Build filter object
    const filter: any = {};
    
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
    
    // User filter
    if (userId) {
      filter.user = userId;
    }
    
    // Currency filter
    if (currency) {
      filter.currency = currency;
    }
    
    console.log('Fetching payments with filter:', filter);
    
    // Fetch payments with filters
    const payments = await db.payment.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    
    if (payments && Array.isArray(payments)) {
      console.log(`Found ${payments.length} payments`);
    } else {
      console.log('No payments found or error in response');
    }
    
    return NextResponse.json({ payments: payments || [] });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { message: 'Error fetching payments', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating payments
 */
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/admin/payments received');
    
    // Method 1: Try NextAuth session (like rag-systems API)
    let isAdmin = false;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user && session.user.role === 'admin') {
        isAdmin = true;
        console.log('Admin authenticated via NextAuth session');
      }
    } catch (sessionError) {
      console.log('NextAuth session check failed, trying token method:', sessionError);
    }
    
    // Method 2: If NextAuth failed, try admin-token (like middleware.ts)
    if (!isAdmin) {
      const adminToken = req.cookies.get('admin-token')?.value;
      if (adminToken) {
        try {
          verify(adminToken, process.env.JWT_SECRET || 'your-fallback-secret');
          isAdmin = true;
          console.log('Admin authenticated via admin-token');
        } catch (tokenError) {
          console.log('Token verification failed:', tokenError);
        }
      }
    }
    
    // If neither method worked, return unauthorized
    if (!isAdmin) {
      console.log('Authentication failed - returning 401');
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { user, amount, currency } = body;
    
    // Validate required fields
    if (!user || !amount || !currency) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate user exists
    const userExists = await db.user.findById({ id: user });
    if (!userExists) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('Creating payment:', { user, amount, currency });
    
    // Create payment
    const payment = await db.payment.create({
      data: {
        user,
        amount: parseFloat(amount.toString()),
        currency
      }
    });
    
    console.log('Payment created successfully:', payment);
    return NextResponse.json(
      { payment }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { message: 'Error creating payment', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 