"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, BarChart2, Clock, FileText } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';

// Types
interface Usage {
  id: string;
  conversation: {
    id: string;
    conversationId: string;
  };
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costEstimated: number;
  recordedAt: string;
}

interface UsageSummary {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalCost: number;
  executionCount: number;
}

interface Conversation {
  id: string;
  conversationId: string;
  createdAt: string;
  ragSystem?: {
    name: string;
    id: string;
  };
}

export default function UsagePage() {
  const { data: session, status } = useSession();
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [usageSummary, setUsageSummary] = useState<UsageSummary>({
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    totalCost: 0,
    executionCount: 0
  });
  const [recentUsage, setRecentUsage] = useState<Usage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsageData();
    }
  }, [status]);
  
  const fetchUsageData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Step 1: Fetch all conversations for current user
      const conversationsResponse = await fetch('/api/dashboard/conversations');
      
      if (!conversationsResponse.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const conversationsData = await conversationsResponse.json();
      const userConversations = conversationsData.conversations || [];
      setConversations(userConversations);
      
      if (userConversations.length === 0) {
        setIsLoading(false);
        return;
      }
      
      // Step 2: Fetch usage data for all conversations
      const usageResponse = await fetch('/api/dashboard/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationIds: userConversations.map((conv: Conversation) => conv.id)
        }),
      });
      
      if (!usageResponse.ok) {
        throw new Error('Failed to fetch usage data');
      }
      
      const usageData = await usageResponse.json();
      
      // Update state with fetched data
      setUsageSummary(usageData.summary || {
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalTokens: 0,
        totalCost: 0,
        executionCount: 0
      });
      
      setRecentUsage(usageData.recentUsage || []);
      
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setError('Failed to load usage data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(hasFaSubdomain ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(hasFaSubdomain ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  
  return (
    <div dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`space-y-6 ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{t.sidebar.usageAnalytics}</h1>
        <p className="text-sm text-gray-500">
          {hasFaSubdomain 
            ? `آمار و اطلاعات مصرف توکن و هزینه‌های مرتبط با مکالمات شما`
            : `Token usage statistics and cost information for your conversations`}
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversations */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{hasFaSubdomain ? 'تعداد مکالمات' : 'Conversations'}</p>
              <h2 className="text-3xl font-bold mt-1">{conversations.length.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}</h2>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <FileText className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
        
        {/* Total Tokens */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t.dashboard.totalTokens}</p>
              <h2 className="text-3xl font-bold mt-1">{usageSummary.totalTokens.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}</h2>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <BarChart2 className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        {/* Total Executions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{hasFaSubdomain ? 'تعداد اجرا' : 'Executions'}</p>
              <h2 className="text-3xl font-bold mt-1">{usageSummary.executionCount.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}</h2>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <Clock className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>
        
        {/* Total Cost */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t.dashboard.usageCost}</p>
              <h2 className="text-3xl font-bold mt-1">{formatCurrency(usageSummary.totalCost)}</h2>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Token Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">{hasFaSubdomain ? 'جزئیات توکن‌ها' : 'Token Breakdown'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prompt Tokens */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">{hasFaSubdomain ? 'توکن‌های درخواست' : 'Prompt Tokens'}</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">{usageSummary.totalPromptTokens.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}</span>
              <span className="text-sm text-gray-500">
                {Math.round((usageSummary.totalPromptTokens / (usageSummary.totalTokens || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(usageSummary.totalPromptTokens / (usageSummary.totalTokens || 1)) * 100}%` }}></div>
            </div>
          </div>
          
          {/* Completion Tokens */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">{hasFaSubdomain ? 'توکن‌های پاسخ' : 'Completion Tokens'}</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">{usageSummary.totalCompletionTokens.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}</span>
              <span className="text-sm text-gray-500">
                {Math.round((usageSummary.totalCompletionTokens / (usageSummary.totalTokens || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(usageSummary.totalCompletionTokens / (usageSummary.totalTokens || 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Usage */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">{hasFaSubdomain ? 'استفاده اخیر' : 'Recent Usage'}</h2>
        </div>
        
        {recentUsage.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {hasFaSubdomain ? 'تاریخ' : 'Date'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {hasFaSubdomain ? 'مکالمه' : 'Conversation'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {hasFaSubdomain ? 'توکن‌های درخواست' : 'Prompt Tokens'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {hasFaSubdomain ? 'توکن‌های پاسخ' : 'Completion Tokens'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {hasFaSubdomain ? 'کل توکن‌ها' : 'Total Tokens'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {hasFaSubdomain ? 'هزینه' : 'Cost'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsage.map((usage) => (
                  <tr key={usage.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(usage.recordedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usage.conversation.conversationId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usage.promptTokens.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usage.completionTokens.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usage.totalTokens.toLocaleString(hasFaSubdomain ? 'fa-IR' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(usage.costEstimated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {hasFaSubdomain ? 'داده‌ای برای نمایش وجود ندارد' : 'No usage data to display'}
          </div>
        )}
      </div>
    </div>
  );
} 