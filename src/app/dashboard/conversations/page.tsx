"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, RefreshCw, X } from 'lucide-react';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';
import { PaginationState, Conversation } from './models/types';
import useConversations from './hooks/useConversations';
import SearchBar from './components/SearchBar';
import ConversationList from './components/ConversationList';
import Pagination from './components/Pagination';
import MessageList from './components/MessageList';

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
  
  // State for expanded conversation
  const [expandedConversation, setExpandedConversation] = useState<Conversation | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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
  
  // Fetch messages when a conversation is expanded
  const fetchConversationMessages = async (conversation: Conversation) => {
    setIsLoadingMessages(true);
    setExpandedMessages([]); // Clear previous messages
    
    try {
      // Simple POST request with the conversation ID
      const response = await fetch(`/api/dashboard/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: conversation.id
        })
      });
      
      if (!response.ok) {
        console.error(`Error fetching messages: Status ${response.status}`);
        return;
      }
      
      const data = await response.json();
      setExpandedMessages(data.messages || []);
      
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      alert('An error occurred while fetching messages. Please try again.');
    } finally {
      setIsLoadingMessages(false);
    }
  };
  
  // Toggle conversation expansion
  const toggleConversation = (conversation: Conversation) => {
    if (expandedConversation && expandedConversation.id === conversation.id) {
      // Collapse the conversation if it's already expanded
      setExpandedConversation(null);
      setExpandedMessages([]);
    } else {
      // Expand the conversation and fetch its messages
      setExpandedConversation(conversation);
      fetchConversationMessages(conversation);
    }
  };
  
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

  // On mobile, when a conversation is expanded, show just the message view
  if (isMobileView && expandedConversation) {
    return (
      <div dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center p-4">
            <button 
              onClick={() => setExpandedConversation(null)}
              className="mr-3 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-medium truncate">
              {expandedConversation.conversationId.substring(0, 8)}...
            </h2>
          </div>
          
          {isLoadingMessages ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-iconic" />
            </div>
          ) : (
            <MessageList 
              messages={expandedMessages}
              hasFaSubdomain={hasFaSubdomain}
              conversation={expandedConversation}
            />
          )}
        </div>
      </div>
    );
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
      
      {/* Two-column layout for desktop */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Conversations List (left side on desktop) */}
        <div className={`bg-white rounded-lg shadow overflow-hidden ${expandedConversation ? 'md:w-1/3' : 'w-full'}`}>
          <ConversationList 
            conversations={conversations}
            hasFaSubdomain={hasFaSubdomain}
            totalCount={totalCount}
            expandedConversation={expandedConversation}
            toggleConversation={toggleConversation}
          />
        </div>
        
        {/* Expanded Conversation Messages (right side on desktop) */}
        {expandedConversation && (
          <div className="bg-white rounded-lg shadow overflow-hidden md:w-2/3">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-iconic" />
              </div>
            ) : (
              <MessageList 
                messages={expandedMessages}
                hasFaSubdomain={hasFaSubdomain}
                conversation={expandedConversation}
              />
            )}
          </div>
        )}
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