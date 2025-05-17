import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/models';
import { isAuthenticated } from '@/lib/auth';

/**
 * API handler for user payments in dashboard
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if user is authenticated
    const authCheck = await isAuthenticated(req, res);
    if (!authCheck.authenticated) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get authenticated user
    const userId = authCheck.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found' });
    }
    
    // Only allow GET method for regular users
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    return getUserPayments(userId, req, res);
  } catch (error) {
    console.error('Dashboard payments API error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get payments for a specific user
 */
async function getUserPayments(userId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { startDate, endDate, currency } = req.query;
    
    // Build filter object
    const filter: any = {
      user: userId // Only get payments for this user
    };
    
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
    
    // Currency filter
    if (currency) {
      filter.currency = currency;
    }
    
    // Fetch payments with filters
    const payments = await db.payment.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    
    return res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return res.status(500).json({ message: 'Error fetching user payments' });
  }
} 