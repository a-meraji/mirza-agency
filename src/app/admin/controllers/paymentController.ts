import { Payment, PaymentFilter } from '../models/types';

/**
 * Fetch all payments from the API
 * @returns Array of payments
 */
export async function fetchPayments(): Promise<Payment[]> {
  try {
    const response = await fetch('/api/admin/payments');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch payments');
    }
    
    const data = await response.json();
    return data.payments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
}

/**
 * Filter payments based on criteria
 * @param filters Filter criteria for payments
 * @returns Filtered array of payments
 */
export async function filterPayments(filters: PaymentFilter): Promise<Payment[]> {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) {
      queryParams.append('startDate', filters.startDate);
    }
    
    if (filters.endDate) {
      queryParams.append('endDate', filters.endDate);
    }
    
    if (filters.userId) {
      queryParams.append('userId', filters.userId);
    }
    
    if (filters.currency) {
      queryParams.append('currency', filters.currency);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/admin/payments${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to filter payments');
    }
    
    const data = await response.json();
    return data.payments;
  } catch (error) {
    console.error('Error filtering payments:', error);
    throw error;
  }
}

/**
 * Create a new payment (admin only)
 * @param paymentData Payment data to create
 * @returns Created payment
 */
export async function createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
  try {
    const response = await fetch('/api/admin/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment');
    }
    
    const data = await response.json();
    return data.payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
} 