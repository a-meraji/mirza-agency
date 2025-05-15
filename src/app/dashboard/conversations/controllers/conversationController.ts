import { Conversation } from '../models/types';

/**
 * Fetches the current user session
 */
export async function fetchUserSession() {
  const sessionRes = await fetch('/api/auth/session', {
    credentials: 'include' // Include cookies for authentication
  });
  return await sessionRes.json();
}

/**
 * Fetches conversations with pagination and search
 */
export async function fetchConversations(page: number, limit: number, search: string) {
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
  const conversationsRes = await fetch(`/api/dashboard/conversations?page=${page}&limit=${limit}${searchQuery}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Include cookies for authentication
  });
  return await conversationsRes.json();
}

/**
 * Formats the time ago from a date
 */
export function formatTimeAgo(date: Date, isFarsi: boolean) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (isFarsi) {
    if (diffDays > 0) {
      return `${diffDays} روز پیش`;
    } else if (diffHours > 0) {
      return `${diffHours} ساعت پیش`;
    } else {
      return `${diffMinutes} دقیقه پیش`;
    }
  } else {
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  }
} 