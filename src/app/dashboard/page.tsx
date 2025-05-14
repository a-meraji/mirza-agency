'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardCard from '@/components/Dashboard/DashboardCard';
import { BarChart2, MessageCircle, FileText, Zap } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';

// Define types for our data
interface UsageItem {
  id: string;
  createdAt: string;
  description: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

interface DashboardData {
  conversations: number;
  messages: number;
  usageData: UsageItem[];
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  loading: boolean;
  error: string | null;
}

export default function DashboardPage() {
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  const { data: session, status } = useSession();
  
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    conversations: 0,
    messages: 0,
    usageData: [],
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      window.location.href = '/auth/login';
      return;
    }
    
    async function fetchDashboardData() {
      try {
        // Get session token
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        const token = sessionData?.token;
        
        // Fetch user data in parallel
        const [conversationsRes, messagesRes, usageDataRes] = await Promise.all([
          fetch('/api/dashboard/conversations', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }),
          fetch('/api/dashboard/messages', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }),
          fetch('/api/dashboard/usage', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })
        ]);
        
        if (!conversationsRes.ok || !messagesRes.ok || !usageDataRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const conversationsData = await conversationsRes.json();
        const messagesData = await messagesRes.json();
        const usageDataResponse = await usageDataRes.json();
        
        // Extract data from the responses which now have structured formats
        const conversationsCount = conversationsData.total || conversationsData.conversations?.length || 0;
        const messagesCount = messagesData.total || messagesData.messages?.length || 0;
        const usageData = usageDataResponse.usageData || [];
        
        // Calculate usage totals
        const totalInputTokens = usageData.reduce((sum: number, item: UsageItem) => sum + (item.inputTokens || 0), 0);
        const totalOutputTokens = usageData.reduce((sum: number, item: UsageItem) => sum + (item.outputTokens || 0), 0);
        const totalCost = usageData.reduce((sum: number, item: UsageItem) => sum + (item.cost || 0), 0);
        
        setDashboardData({
          conversations: conversationsCount,
          messages: messagesCount,
          usageData,
          totalInputTokens,
          totalOutputTokens,
          totalCost,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch dashboard data'
        }));
      }
    }
    
    fetchDashboardData();
  }, [status]);
  
  if (status === 'loading' || dashboardData.loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iconic"></div>
    </div>;
  }
  
  // Handle errors with a nice UI
  if (dashboardData.error) {
    return <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="bg-red-50 p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-semibold text-red-700 mb-2">
          {hasFaSubdomain ? 'خطا در بارگذاری داده‌ها' : 'Error Loading Data'}
        </h2>
        <p className="text-red-600">{dashboardData.error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          {hasFaSubdomain ? 'تلاش مجدد' : 'Try Again'}
        </button>
      </div>
    </div>;
  }
  
  return (
    <div className={`space-y-6 ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
      <h1 className="text-2xl font-bold">{t.dashboard.title}</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title={t.dashboard.conversations}
          value={dashboardData.conversations.toString()}
          icon={MessageCircle}
          color="amber"
          href="/dashboard/conversations"
        />
        <DashboardCard 
          title={t.dashboard.messages}
          value={dashboardData.messages.toString()}
          icon={Zap}
          color="orange"
          href="/dashboard/conversations"
        />
        <DashboardCard 
          title={t.dashboard.totalTokens}
          value={(dashboardData.totalInputTokens + dashboardData.totalOutputTokens).toLocaleString()}
          icon={FileText}
          color="emerald"
          href="/dashboard/usage"
        />
        <DashboardCard 
          title={t.dashboard.usageCost}
          value={`$${dashboardData.totalCost.toFixed(2)}`}
          icon={BarChart2}
          color="amber"
          href="/dashboard/usage"
        />
      </div>
      
      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">{t.dashboard.recentActivity}</h2>
        <div className="bg-white rounded-lg shadow">
          {dashboardData.usageData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.dashboard.date}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.dashboard.type}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.dashboard.tokens}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.dashboard.cost}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.usageData.map((item: UsageItem) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description || 'AI Conversation'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item.inputTokens + item.outputTokens).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.cost.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              {t.dashboard.noRecentActivity}
            </div>
          )}
        </div>
        
        {dashboardData.usageData.length > 0 && (
          <div className="mt-2 text-right">
            <a 
              href="/dashboard/usage" 
              className="text-sm font-medium text-iconic hover:text-iconic2 transition-colors"
            >
              {t.dashboard.viewAllActivity} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 