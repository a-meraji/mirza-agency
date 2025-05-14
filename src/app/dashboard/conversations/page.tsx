"use client"

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';
import { ConversationsPageProps, PaginationState } from './models/types';
import useConversations from './hooks/useConversations';
import SearchBar from './components/SearchBar';
import ConversationList from './components/ConversationList';
import Pagination from './components/Pagination';

export default function ConversationsPage() {
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  
  // Use the useSearchParams hook to access URL search parameters
  const searchParams = useSearchParams();
  
  // Get values from searchParams
  const pageParam = searchParams.get('page') || '1';
  const limitParam = searchParams.get('limit') || '10';
  const searchParam = searchParams.get('search') || '';
  
  // Pagination parameters
  const page = parseInt(pageParam);
  const limit = parseInt(limitParam);
  const skip = (page - 1) * limit;
  const search = searchParam;
  
  // Get conversation data using custom hook
  const { 
    isLoading, 
    isRefreshing, 
    user, 
    conversations, 
    totalCount, 
    searchQuery, 
    refreshConversations,
    setSearchQuery
  } = useConversations(page, limit, search);
  
  useEffect(() => {
    // Initialize searchQuery from URL on first render
    if (search) {
      setSearchQuery(search);
    }
  }, [search, setSearchQuery]);
  
  const totalPages = Math.ceil(totalCount / limit);
  
  const paginationProps: PaginationState = {
    page,
    limit,
    skip,
    search,
    totalPages
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUrl = new URL(window.location.href);
    if (searchQuery) {
      currentUrl.searchParams.set('search', searchQuery);
    } else {
      currentUrl.searchParams.delete('search');
    }
    currentUrl.searchParams.set('page', '1');
    window.location.href = currentUrl.toString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-iconic" />
      </div>
    );
  }
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`space-y-6 ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
      {/* Header with actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t.dashboard.conversations}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {hasFaSubdomain 
                ? `مجموع ${totalCount?.toLocaleString('fa-IR') || '0'} مکالمه` 
                : `Total of ${totalCount?.toLocaleString() || '0'} conversations`}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Search bar */}
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              hasFaSubdomain={hasFaSubdomain}
            />

            <div className="flex gap-2">
              <button
                onClick={refreshConversations}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${hasFaSubdomain ? 'ml-2' : 'mr-2'} ${isRefreshing ? 'animate-spin' : ''}`} />
                {hasFaSubdomain ? 'بروزرسانی' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ConversationList 
          conversations={conversations}
          hasFaSubdomain={hasFaSubdomain}
          totalCount={totalCount}
        />
      </div>
      
      {/* Pagination */}
      <Pagination 
        {...paginationProps}
        hasFaSubdomain={hasFaSubdomain}
        totalCount={totalCount}
      />
    </div>
  );
} 