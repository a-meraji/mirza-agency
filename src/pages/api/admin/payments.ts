import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/models';
import { isAuthenticated } from '@/lib/auth';

/**
 * API handler for payment management
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if user is authenticated and is an admin
    const authCheck = await isAuthenticated(req, res);
    if (!authCheck.authenticated) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Ensure user is admin
    if (authCheck.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return getPayments(req, res);
      case 'POST':
        return createPayment(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Payments API error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get payments with optional filtering
 */
async function getPayments(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('GET /api/admin/payments received');
    const { startDate, endDate, userId, currency } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate as string);
      }
      
      if (endDate) {
        // Set endDate to the end of the day
        const endDateTime = new Date(endDate as string);
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
    
    console.log(`Found ${payments.length} payments`);
    return res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ message: 'Error fetching payments' });
  }
}

/**
 * Create a new payment (admin only)
 */
async function createPayment(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('POST /api/admin/payments received');
    const { user, amount, currency } = req.body;
    
    // Validate required fields
    if (!user || !amount || !currency) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate user exists
    const userExists = await db.user.findById({ id: user });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Creating payment:', { user, amount, currency });
    
    // Create payment
    const payment = await db.payment.create({
      data: {
        user,
        amount: parseFloat(amount),
        currency
      }
    });
    
    console.log('Payment created successfully:', payment);
    return res.status(201).json({ payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ message: 'Error creating payment' });
  }
} 