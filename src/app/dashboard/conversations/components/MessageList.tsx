import React, { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: any[];
  conversation: any;
  hasFaSubdomain: boolean;
}

export default function MessageList({ messages, conversation, hasFaSubdomain }: MessageListProps) {
  // Debug messages received
  useEffect(() => {
    console.log('MessageList component received messages:', messages);
    console.log('MessageList component received conversation:', conversation);
  }, [messages, conversation]);

  // Format relative time
  const getRelativeTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  // Calculate total tokens
  const totalTokens = messages.reduce((sum, message) => sum + (message.tokens || 0), 0);

  return (
    <div className="p-4">
      {/* Conversation info header */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          {conversation.conversationId}
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
          <div>
            {hasFaSubdomain 
              ? `${messages.length} پیام` 
              : `${messages.length} messages`}
          </div>
          {totalTokens > 0 && (
            <div>
              {hasFaSubdomain 
                ? `${totalTokens.toLocaleString('fa-IR')} توکن کل` 
                : `${totalTokens.toLocaleString()} tokens total`}
            </div>
          )}
          {conversation.createdAt && (
            <div>
              {hasFaSubdomain 
                ? `ایجاد شده ${getRelativeTime(new Date(conversation.createdAt))}` 
                : `Created ${getRelativeTime(new Date(conversation.createdAt))}`}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {messages.length > 0 ? (
        <div className="space-y-8">
          {messages.map((message, index) => {
            const isUser = message.role === 'user';
            const messageDate = new Date(message.createdAt);
            const timeString = messageDate.toLocaleTimeString(
              hasFaSubdomain ? 'fa-IR' : undefined, 
              { hour: '2-digit', minute: '2-digit' }
            );
            
            return (
              <div 
                key={message.id || index} 
                className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Circle indicator for AI */}
                {!isUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border border-amber-400 text-amber-600">
                    {hasFaSubdomain ? 'هـ' : 'AI'}
                  </div>
                )}
                
                {/* Message bubble */}
                <div 
                  className={`relative max-w-[85%] rounded-2xl px-5 py-4 ${
                    isUser 
                      ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                      : 'bg-white text-gray-800 border border-amber-400'
                  }`}
                >
                  {/* Message text */}
                  <div className="whitespace-pre-wrap text-base font-light">
                    {message.text}
                  </div>
                  
                  {/* Time and token count */}
                  <div className="text-xs text-right mt-2 text-gray-400">
                    {timeString}
                    {message.tokens > 0 && ` · ${hasFaSubdomain 
                      ? `${message.tokens.toLocaleString('fa-IR')} توکن` 
                      : `${message.tokens} tokens`}`}
                  </div>
                </div>
                
                {/* Circle indicator for User */}
                {isUser && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border border-amber-200 text-amber-600 bg-amber-50">
                    {hasFaSubdomain ? 'ک' : 'U'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {hasFaSubdomain ? 'هیچ پیامی یافت نشد' : 'No messages found'}
          </p>
        </div>
      )}
    </div>
  );
} 