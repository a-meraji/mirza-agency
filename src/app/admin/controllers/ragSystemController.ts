import { ragSystemModel } from '@/lib/models/ragSystem';

/**
 * Fetch all RAG systems for a specific user
 */
export async function fetchUserRagSystems(userId: string) {
  try {
    const response = await fetch(`/api/admin/rag-systems?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || errorData.details || `HTTP error ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user RAG systems:', error);
    throw error;
  }
}

/**
 * Create a new RAG system for a user
 */
export async function createRagSystem(userId: string, data: { name: string; description?: string }) {
  try {
    const response = await fetch('/api/admin/rag-systems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({
        userId,
        ...data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || errorData.details || `HTTP error ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating RAG system:', error);
    throw error;
  }
} 