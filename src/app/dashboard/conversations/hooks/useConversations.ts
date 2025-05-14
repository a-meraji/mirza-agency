import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { ConversationState, PaginationState } from '../models/types';
import { fetchUserSession, fetchConversations } from '../controllers/conversationController';

export default function useConversations(page: number, limit: number, search: string) {
  const [state, setState] = useState<ConversationState>({
    isLoading: true,
    isRefreshing: false,
    user: null,
    conversations: [],
    totalCount: 0,
    searchQuery: search || '',
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Fetch user session
      const sessionData = await fetchUserSession();
      
      if (!sessionData?.user?.id) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Fetch conversations
      const data = await fetchConversations(page, limit, search);
      
      setState(prev => ({
        ...prev,
        user: sessionData.user,
        conversations: data.conversations,
        totalCount: data.total,
        isLoading: false,
        isRefreshing: false
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setState(prev => ({ ...prev, isLoading: false, isRefreshing: false }));
    }
  };

  const refreshConversations = () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search]);

  return {
    ...state,
    refreshConversations,
    setSearchQuery: (query: string) => setState(prev => ({ ...prev, searchQuery: query }))
  };
} 