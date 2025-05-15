import { ChevronDown, ChevronRight, Clock, MessageCircle } from 'lucide-react';
import { Conversation } from '../models/types';
import { formatTimeAgo } from '../controllers/conversationController';

interface ConversationItemProps {
  conversation: Conversation;
  hasFaSubdomain: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export default function ConversationItem({ 
  conversation, 
  hasFaSubdomain, 
  isExpanded, 
  onClick 
}: ConversationItemProps) {
  // Format date
  const date = new Date(conversation.createdAt);
  const formattedDate = date.toLocaleDateString(hasFaSubdomain ? 'fa-IR' : undefined);
  const formattedTime = date.toLocaleTimeString(hasFaSubdomain ? 'fa-IR' : undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Calculate time ago
  const timeAgo = formatTimeAgo(date, hasFaSubdomain);
  
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-iconic">
                <MessageCircle className="h-5 w-5" />
              </div>
              
              <div className="ml-3">
                <h2 className="text-lg font-medium text-gray-900 truncate flex items-center">
                  {conversation.conversationId.substring(0, 8)}...
                  <span className="ml-2">
                    {isExpanded ? 
                      <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    }
                  </span>
                </h2>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Clock className={`flex-shrink-0 ${hasFaSubdomain ? 'ml-1.5' : 'mr-1.5'} h-4 w-4 text-gray-400`} />
                  <span className="truncate">
                    {timeAgo} · {formattedDate} {hasFaSubdomain ? 'در' : 'at'} {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {conversation.ragSystem && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-iconic">
                {conversation.ragSystem.name || (hasFaSubdomain ? 'سیستم' : 'System')}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-iconic">
              {isExpanded 
                ? (hasFaSubdomain ? 'بستن' : 'Collapse') 
                : (hasFaSubdomain ? 'مشاهده' : 'View')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 