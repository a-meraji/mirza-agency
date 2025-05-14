import { MessageCircle } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { Conversation } from '../models/types';

interface ConversationListProps {
  conversations: Conversation[];
  hasFaSubdomain: boolean;
  totalCount: number;
}

export default function ConversationList({ 
  conversations = [], 
  hasFaSubdomain, 
  totalCount 
}: ConversationListProps) {
  // Ensure conversations is always an array
  const conversationsList = Array.isArray(conversations) ? conversations : [];
  
  if (conversationsList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-iconic" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {hasFaSubdomain ? 'هنوز مکالمه‌ای وجود ندارد' : 'No conversations yet'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {hasFaSubdomain 
            ? 'مکالمات در بخش چت اصلی ایجاد می‌شوند'
            : 'Conversations are created in the main chat interface'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversationsList.map((conversation) => (
        <ConversationItem 
          key={conversation.id}
          conversation={conversation}
          hasFaSubdomain={hasFaSubdomain}
        />
      ))}
    </div>
  );
} 