'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, CreditCard, Calendar, DollarSign } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';
import PricingCalculator from '@/components/Dashboard/PricingCalculator';

// Types
interface PaymentItem {
  id: string;
  createdAt: string;
  amount: number;
  currency: 'rial' | 'dollar';
  description: string;
  status: string;
  paymentMethod?: string;
}

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [preferredCurrency, setPreferredCurrency] = useState<'rial' | 'dollar'>('rial');
  
  // Fetch payment data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPaymentsData();
    }
  }, [status]);
  
  const fetchPaymentsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get session token
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      const token = sessionData?.token;
      
      const paymentsRes = await fetch('/api/dashboard/payments', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!paymentsRes.ok) {
        throw new Error('Failed to fetch payments data');
      }
      
      const paymentsData = await paymentsRes.json();
      const paymentsArray = paymentsData.payments || [];
      
      setPayments(paymentsArray);
      
      // Set preferred currency based on most recent payment
      if (paymentsArray.length > 0) {
        const mostRecentPayment = [...paymentsArray].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        setPreferredCurrency(mostRecentPayment?.currency || 'rial');
      }
      
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('Failed to load payment data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: 'rial' | 'dollar') => {
    if (currency === 'rial') {
      return new Intl.NumberFormat(hasFaSubdomain ? 'fa-IR' : 'en-US', {
        style: 'currency',
        currency: 'IRR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat(hasFaSubdomain ? 'fa-IR' : 'en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(hasFaSubdomain ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-iconic" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }
  
  // Calculate total balance based on payments
  const calculateTotalBalance = () => {
    const rialToDollarRate = Number(process.env.NEXT_PUBLIC_RIAL_TO_DOLLAR_RATE) || 50000;
    
    // First convert all to dollar for calculation
    let totalDollars = 0;
    for (const payment of payments) {
      if (payment.currency === 'rial') {
        totalDollars += payment.amount / rialToDollarRate;
      } else {
        totalDollars += payment.amount;
      }
    }
    
    // Convert back to preferred currency
    if (preferredCurrency === 'rial') {
      return totalDollars * rialToDollarRate;
    }
    
    return totalDollars;
  };
  
  const totalBalance = calculateTotalBalance();
  
  return (
    <div dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`space-y-6 ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{t.payments.title}</h1>
        <p className="text-sm text-gray-500">
          {hasFaSubdomain 
            ? `مدیریت پرداخت‌ها و محاسبه هزینه‌های ماهانه`
            : `Manage your payments and calculate monthly costs`}
        </p>
      </div>
      
      {/* Balance Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{t.dashboard.balanceRemaining}</p>
            <h2 className="text-3xl font-bold mt-1">
              {formatCurrency(totalBalance, preferredCurrency)}
            </h2>
          </div>
          <div className="p-3 bg-amber-50 rounded-full">
            <DollarSign className="h-6 w-6 text-amber-500" />
          </div>
        </div>
      </div>
      
      {/* Payment History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">{t.payments.history}</h2>
        </div>
        
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.payments.paymentDate}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.payments.amount}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.payments.description}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.payments.status}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.payments.paymentMethod}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentMethod || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t.payments.noPayments}
          </div>
        )}
      </div>
      
      {/* Pricing Calculator */}
      <div className="mt-6">
        <PricingCalculator />
      </div>
    </div>
  );
} 