"use client"

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Shield, MessageCircle, Download, Loader2, RefreshCw } from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import useSubdomain from '@/hooks/useSubdomain';
import { dashboardTextEn, dashboardTextFa } from '@/lib/dashboard-lang';

export default function ConversationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch user session
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      
      if (!sessionData?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      setUser(sessionData.user);
      
      // Fetch conversation
      const conversationRes = await fetch(`/api/conversations/${params.id}`);
      
      if (conversationRes.status === 404) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }
      
      if (conversationRes.status === 403) {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      }
      
      const conversationData = await conversationRes.json();
      setConversation(conversationData);
      
      // Fetch messages
      const messagesRes = await fetch(`/api/conversations/${params.id}/messages`);
      const messagesData = await messagesRes.json();
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshConversation = () => {
    setIsRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-iconic" />
      </div>
    );
  }
  
  if (isNotFound) {
    return notFound();
  }
  
  if (isUnauthorized) {
    return (
      <div dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`text-center py-12 ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-red-600">
          {hasFaSubdomain ? 'غیرمجاز' : 'Unauthorized'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {hasFaSubdomain ? 'شما مجوز مشاهده این مکالمه را ندارید' : "You don't have permission to view this conversation"}
        </p>
        <div className="mt-6">
          <Link 
            href="/dashboard/conversations" 
            className="inline-flex items-center px-4 py-2 bg-iconic text-white rounded-md hover:bg-iconic2 transition-colors"
          >
            {hasFaSubdomain ? (
              <>
                بازگشت به مکالمات
                <ArrowLeft className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Conversations
              </>
            )}
          </Link>
        </div>
      </div>
    );
  }
  
  if (!conversation) {
    return <div>Loading...</div>;
  }
  
  // Format date
  const date = new Date(conversation.createdAt);
  const formattedDate = date.toLocaleDateString(hasFaSubdomain ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString(hasFaSubdomain ? 'fa-IR' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  // Calculate tokens and other stats
  const totalTokens = messages.reduce((sum, message) => sum + (message.tokens || 0), 0);
  const userMessages = messages.filter(msg => msg.role === 'user').length;
  const assistantMessages = messages.filter(msg => msg.role === 'assistant').length;

  // Format relative time
  const getRelativeTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return '';
    }
  };
  
  return (
    <div dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`space-y-6 ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
      {/* Header with back button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <Link 
            href="/dashboard/conversations" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={hasFaSubdomain ? "بازگشت به مکالمات" : "Back to conversations"}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">{hasFaSubdomain ? 'مکالمه' : 'Conversation'}</h1>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={refreshConversation}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iconic disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${hasFaSubdomain ? 'ml-2' : 'mr-2'} ${isRefreshing ? 'animate-spin' : ''}`} />
            {hasFaSubdomain ? 'بروزرسانی' : 'Refresh'}
          </button>
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iconic"
            onClick={() => {
              const text = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n---\n\n');
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `conversation-${conversation.conversationId.substring(0, 8)}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            <Download className={`h-4 w-4 ${hasFaSubdomain ? 'ml-2' : 'mr-2'}`} />
            {hasFaSubdomain ? 'خروجی' : 'Export'}
          </button>
        </div>
      </div>
      
      {/* Conversation Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {conversation.conversationId}
            </h2>
            
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className={`h-4 w-4 ${hasFaSubdomain ? 'ml-1.5' : 'mr-1.5'} text-gray-400`} />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <Clock className={`h-4 w-4 ${hasFaSubdomain ? 'ml-1.5' : 'mr-1.5'} text-gray-400`} />
                {formattedTime}
              </div>
              <div className="flex items-center">
                <MessageCircle className={`h-4 w-4 ${hasFaSubdomain ? 'ml-1.5' : 'mr-1.5'} text-gray-400`} />
                {hasFaSubdomain ? `${messages.length} پیام` : `${messages.length} messages`}
              </div>
              {totalTokens > 0 && (
                <div className="text-sm text-gray-500">
                  {hasFaSubdomain 
                    ? `${totalTokens.toLocaleString('fa-IR')} توکن کل` 
                    : `${totalTokens.toLocaleString()} tokens total`}
                </div>
              )}
            </div>
          </div>
          
          {conversation.ragSystem && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-iconic">
                {conversation.ragSystem.name || (hasFaSubdomain ? 'سیستم هوش مصنوعی' : 'AI System')}
              </span>
            </div>
          )}
        </div>
        
        {/* Stats overview */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-200 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-500">{hasFaSubdomain ? 'ایجاد شده' : 'Created'}</p>
            <p className="mt-1 text-base text-gray-900">
              {getRelativeTime(date)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{hasFaSubdomain ? 'پیام‌ها' : 'Messages'}</p>
            <p className="mt-1 text-base text-gray-900">{hasFaSubdomain ? messages.length.toLocaleString('fa-IR') : messages.length}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{hasFaSubdomain ? 'نسبت کاربر / هوش مصنوعی' : 'User / AI ratio'}</p>
            <p className="mt-1 text-base text-gray-900">
              {hasFaSubdomain 
                ? `${userMessages.toLocaleString('fa-IR')} / ${assistantMessages.toLocaleString('fa-IR')}`
                : `${userMessages} / ${assistantMessages}`}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{hasFaSubdomain ? 'توکن کل' : 'Total tokens'}</p>
            <p className="mt-1 text-base text-gray-900">{hasFaSubdomain ? totalTokens.toLocaleString('fa-IR') : totalTokens.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{hasFaSubdomain ? 'تاریخچه مکالمه' : 'Conversation History'}</h3>
          <div className="text-sm text-gray-500">
            {hasFaSubdomain ? `${messages.length} پیام` : `${messages.length} messages`}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {messages.length > 0 ? (
            <div className="space-y-6 p-6">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                const messageDate = new Date(message.createdAt);
                const timeString = messageDate.toLocaleTimeString(hasFaSubdomain ? 'fa-IR' : undefined, { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`relative max-w-2xl rounded-lg p-4 ${
                        isUser 
                          ? 'bg-amber-50 text-amber-900' 
                          : 'bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`h-8 w-8 rounded-full mr-2 flex items-center justify-center ${
                          isUser ? 'bg-amber-100 text-iconic' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isUser ? (hasFaSubdomain ? 'ش' : 'U') : (hasFaSubdomain ? 'هـ' : 'AI')}
                        </div>
                        <div>
                          <div className="font-medium">
                            {isUser 
                              ? (hasFaSubdomain ? 'شما' : 'You') 
                              : (hasFaSubdomain ? 'دستیار هوش مصنوعی' : 'AI Assistant')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {timeString}
                            {message.tokens > 0 && ` · ${hasFaSubdomain 
                              ? `${message.tokens.toLocaleString('fa-IR')} توکن` 
                              : `${message.tokens} tokens`}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      
                      {/* Message number badge */}
                      <div className="absolute -top-2 -left-2 h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-800">
                        {hasFaSubdomain ? (index + 1).toLocaleString('fa-IR') : index + 1}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-iconic" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {hasFaSubdomain ? 'هنوز پیامی وجود ندارد' : 'No messages yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {hasFaSubdomain ? 'این مکالمه هیچ پیامی ندارد' : "This conversation doesn't have any messages"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 