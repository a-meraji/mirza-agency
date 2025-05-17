import { conversationModel } from '@/lib/models/conversation';
import { messageModel } from '@/lib/models/message';
import { usageModel } from '@/lib/models/usage';
import { calculateTokensAndCost, estimateTokenCount } from '@/lib/utils/tokenUtils';

type CreateMessageInput = {
  role: 'user' | 'assistant';
  text: string;
  executionId: string;
  // tokens is now optional as we'll calculate it on the server
  tokens?: number;
};

type CreateUsageInput = {
  executionId: string;
  // These are now optional as we'll calculate them on the server
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  costEstimated?: number;
};

/**
 * Controller for handling conversation-related data operations
 */
export class DataController {
  /**
   * Create a new conversation with associated messages and usage data
   * If a conversation with the same conversationId already exists, it will be reused
   */
  static async createConversationWithData(
    userId: string,
    ragSystemId: string,
    conversationId: string,
    messages: CreateMessageInput[],
    usageData: CreateUsageInput
  ) {
    try {
      // 1. Check if the conversation already exists
      let conversation = await conversationModel.findOne({
        where: { conversationId }
      });
      
      // 2. If conversation doesn't exist, create a new one
      if (!conversation) {
        conversation = await conversationModel.create({
          data: {
            user: userId,
            ragSystem: ragSystemId,
            conversationId
          }
        });
        
        if (!conversation) {
          throw new Error('Failed to create conversation');
        }
      } else {
        console.log(`Conversation with ID ${conversationId} already exists, reusing it`);
      }

      console.log("conversation",conversation.id, conversation);
      // 3. Calculate token counts for each message and total usage
      const messagesWithTokens = messages.map(message => {
        // Calculate token count for this message
        const calculatedTokens = estimateTokenCount(message.text);
        return {
          conversation: conversation.id,
          executionId: message.executionId,
          role: message.role,
          text: message.text,
          // Use calculated tokens, not the ones from request
          tokens: calculatedTokens
        };
      });

      // 4. Create messages
      const createdMessages = await messageModel.createMany(messagesWithTokens);

      // 5. Calculate tokens and cost for this batch of messages
      const tokenStats = calculateTokensAndCost(
        messages.map(m => ({ text: m.text, role: m.role }))
      );

      // 6. Create usage record or update if it exists
      const existingUsage = await usageModel.findOne({
        where: { 
          conversation: conversation.id,
          executionId: usageData.executionId
        }
      });
      
      let usage;
      if (!existingUsage) {
        usage = await usageModel.create({
          data: {
            conversation: conversation.id,
            executionId: usageData.executionId,
            // Use calculated values, not the ones from request
            promptTokens: tokenStats.promptTokens,
            completionTokens: tokenStats.completionTokens,
            totalTokens: tokenStats.totalTokens,
            costEstimated: tokenStats.costEstimated,
            recordedAt: new Date()
          }
        });
      } else {
        console.log(`Usage with executionId ${usageData.executionId} already exists, skipping creation`);
        usage = existingUsage;
      }

      return {
        conversation,
        messages: createdMessages,
        usage
      };
    } catch (error) {
      console.error('Error creating conversation data:', error);
      throw error;
    }
  }

  /**
   * Add messages and usage to an existing conversation
   */
  static async addDataToConversation(
    conversationId: string,
    messages: CreateMessageInput[],
    usageData: CreateUsageInput
  ) {
    try {
      // 1. Find the conversation
      const conversation = await conversationModel.findById({ id: conversationId });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // 2. Calculate token counts for each message
      const messagesWithTokens = messages.map(message => {
        // Calculate token count for this message
        const calculatedTokens = estimateTokenCount(message.text);
        
        return {
          conversation: conversation.id,
          executionId: message.executionId,
          role: message.role,
          text: message.text,
          // Use calculated tokens, not the ones from request
          tokens: calculatedTokens
        };
      });

      // 3. Create messages
      const createdMessages = await messageModel.createMany(messagesWithTokens);

      // 4. Calculate tokens and cost for this batch of messages
      const tokenStats = calculateTokensAndCost(
        messages.map(m => ({ text: m.text, role: m.role }))
      );

      // 5. Create usage record - check if it exists first
      const existingUsage = await usageModel.findOne({
        where: { 
          conversation: conversation.id,
          executionId: usageData.executionId
        }
      });
      
      let usage;
      if (!existingUsage) {
        usage = await usageModel.create({
          data: {
            conversation: conversation.id,
            executionId: usageData.executionId,
            // Use calculated values, not the ones from request
            promptTokens: tokenStats.promptTokens,
            completionTokens: tokenStats.completionTokens,
            totalTokens: tokenStats.totalTokens,
            costEstimated: tokenStats.costEstimated,
            recordedAt: new Date()
          }
        });
      } else {
        console.log(`Usage with executionId ${usageData.executionId} already exists, skipping creation`);
        usage = existingUsage;
      }

      return {
        conversation,
        messages: createdMessages,
        usage
      };
    } catch (error) {
      console.error('Error adding data to conversation:', error);
      throw error;
    }
  }
} 