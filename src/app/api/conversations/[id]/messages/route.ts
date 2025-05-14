import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authenticated user session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get the conversation ID from the URL params
    const conversationId = params.id;
    
    // Verify this conversation belongs to the user
    const ownsConversation = await verifyConversationOwnership(conversationId, userId);
    
    if (!ownsConversation) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Fetch the messages for this conversation
    const messages = await fetchConversationMessages(conversationId);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error(`Error fetching messages for conversation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation messages' },
      { status: 500 }
    );
  }
}

// Mock function to verify conversation ownership
// Replace this with your actual database query
async function verifyConversationOwnership(conversationId: string, userId: string): Promise<boolean> {
  // In a real implementation, you would query your database to check if this conversation
  // belongs to the user with the given userId
  
  // For demo purposes, we'll just return true
  return true;
}

// Mock function to fetch messages for a conversation
// Replace this with your actual database query
async function fetchConversationMessages(conversationId: string) {
  // Calculate dates for the mock messages
  const now = new Date();
  const minutesAgo1 = new Date(now.getTime() - 1 * 60000);
  const minutesAgo2 = new Date(now.getTime() - 2 * 60000);
  const minutesAgo3 = new Date(now.getTime() - 3 * 60000);
  const minutesAgo4 = new Date(now.getTime() - 4 * 60000);
  
  // This is mock data - replace with actual database query
  return [
    {
      id: '1',
      conversationId,
      createdAt: minutesAgo4.toISOString(),
      role: 'user',
      text: 'How can I implement a RAG system using Next.js and MongoDB?',
      tokens: 12
    },
    {
      id: '2',
      conversationId,
      createdAt: minutesAgo3.toISOString(),
      role: 'assistant',
      text: 'To implement a RAG (Retrieval-Augmented Generation) system using Next.js and MongoDB, you\'ll need to follow these steps:\n\n1. Set up your MongoDB database with a collection for your documents\n2. Create vector embeddings for your documents using a model like OpenAI\'s text-embedding-ada-002\n3. Store these embeddings in MongoDB\n4. Create a Next.js API route that handles search queries\n5. When a query comes in, compute its embedding and find similar documents in your database\n6. Pass the retrieved documents along with the user\'s query to an LLM like GPT-4\n7. Return the generated response to the user\n\nWould you like me to explain any specific part of this process in more detail?',
      tokens: 150
    },
    {
      id: '3',
      conversationId,
      createdAt: minutesAgo2.toISOString(),
      role: 'user',
      text: 'Yes, can you explain how to store and query vector embeddings in MongoDB?',
      tokens: 14
    },
    {
      id: '4',
      conversationId,
      createdAt: minutesAgo1.toISOString(),
      role: 'assistant',
      text: 'MongoDB supports vector search through its Atlas Vector Search capability. Here\'s how to store and query vector embeddings in MongoDB:\n\n1. **Store embeddings**:\n   - Create a schema that includes a field for your vector embeddings\n   - When adding documents, include the embedding as an array of floating-point numbers\n   - Example schema:\n   ```typescript\n   interface Document {\n     _id: ObjectId;\n     title: string;\n     content: string;\n     embedding: number[];\n   }\n   ```\n\n2. **Create a vector search index**:\n   - In MongoDB Atlas, create a vector search index on your embedding field\n   - Specify the dimensions of your vectors (e.g., 1536 for OpenAI embeddings)\n   - Choose a similarity metric (cosine similarity is common)\n\n3. **Query for similar documents**:\n   - When a user makes a query, generate an embedding for their query\n   - Use the $vectorSearch operator to find similar documents\n   - Example query:\n   ```typescript\n   const results = await collection.aggregate([\n     {\n       $vectorSearch: {\n         index: "vector_index",\n         path: "embedding",\n         queryVector: queryEmbedding,\n         numCandidates: 100,\n         limit: 10\n       }\n     }\n   ]).toArray();\n   ```\n\n4. **Ranking and filtering**:\n   - You can combine vector search with traditional filters\n   - This allows for hybrid search (semantic + keyword)\n   - Example with filters:\n   ```typescript\n   const results = await collection.aggregate([\n     {\n       $vectorSearch: {\n         index: "vector_index",\n         path: "embedding",\n         queryVector: queryEmbedding,\n         numCandidates: 100\n       }\n     },\n     { $match: { category: "technical" } },\n     { $limit: 10 }\n   ]).toArray();\n   ```\n\nMongoDB Atlas Vector Search is optimized for high-dimensional vectors and provides good performance for RAG applications.',
      tokens: 320
    }
  ];
} 