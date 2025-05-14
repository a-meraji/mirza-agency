import { Session } from 'next-auth';

export interface Conversation {
  id: string;
  conversationId: string;
  createdAt: string;
  ragSystem?: {
    name: string;
    id: string;
  };
}

export interface ConversationsPageProps {
  searchParams: { 
    page?: string; 
    limit?: string; 
    search?: string;
  };
}

export interface PaginationState {
  page: number;
  limit: number;
  skip: number;
  search: string;
  totalPages: number;
}

export interface ConversationState {
  isLoading: boolean;
  isRefreshing: boolean;
  user: Session['user'] | null;
  conversations: Conversation[];
  totalCount: number;
  searchQuery: string;
} 