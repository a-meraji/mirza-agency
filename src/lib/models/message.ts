import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';
import { ConversationDocument } from './conversation';

// Define the interface for the document
export interface MessageDocument extends Document {
  conversation: mongoose.Types.ObjectId | string | ConversationDocument;
  executionId: string;
  role: 'user' | 'assistant';
  text: string;
  tokens: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Message model class
 */
export class MessageModel extends BaseModel<MessageDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<MessageDocument>(
      {
        conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
        executionId: { type: String, required: true },
        role: { type: String, enum: ['user', 'assistant'], required: true },
        text: { type: String, required: true },
        tokens: { type: Number, required: true },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        collection: 'Message', // Explicitly set the collection name
      }
    );
    
    // Create an index for conversation and createdAt
    schema.index({ conversation: 1, createdAt: 1 });
    
    super('Message', schema);
  }
  
  /**
   * Find multiple messages with optional filtering and sorting
   */
  async findMany(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, orderBy = {}, limit, skip, include = {} } = options;
        
        // Build query
        let query = this.model.find(where);
        
        // Handle includes/population
        if (include.conversation) {
          query = query.populate('conversation');
        }
        
        // Apply sorting
        const sort: Record<string, 1 | -1> = {};
        if (orderBy) {
          if (Array.isArray(orderBy)) {
            orderBy.forEach(order => {
              for (const [key, value] of Object.entries(order)) {
                sort[key] = value === 'asc' ? 1 : -1;
              }
            });
          } else {
            for (const [key, value] of Object.entries(orderBy)) {
              sort[key] = value === 'asc' ? 1 : -1;
            }
          }
          query = query.sort(sort);
        } else {
          // Default sorting by creation date if no specific order provided
          query = query.sort({ createdAt: 1 }); // Ascending for messages (oldest first)
        }
        
        // Apply pagination
        if (skip) query = query.skip(skip);
        if (limit) query = query.limit(limit);
        
        // Execute query
        const messages = await query.lean();
        
        // Format results
        return messages.map(message => this.formatDocument(message));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find messages for a specific conversation
   */
  async findByConversationId(conversationId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { conversation: conversationId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find messages for a specific execution
   */
  async findByExecutionId(executionId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { executionId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find a single message by ID
   */
  async findById(options: FindByIdOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id, include = {} } = options;
        
        let query = this.model.findById(id);
        
        // Handle includes/population
        if (include.conversation) {
          query = query.populate('conversation');
        }
        
        const message = await query.lean();
        
        if (!message) return null;
        
        return this.formatDocument(message);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Create a new message
   */
  async create(options: CreateOptions<MessageDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const message = new this.model(options.data);
        await message.save();
        
        return this.formatDocument(message);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Create multiple messages in bulk
   */
  async createMany(messagesData: Partial<MessageDocument>[]) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const result = await this.model.insertMany(messagesData);
        
        return result.map(message => this.formatDocument(message));
      });
    } catch (error) {
      return this.handleError(error, 'createMany');
    }
  }
  
  /**
   * Update a message
   */
  async update(options: UpdateOptions<MessageDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id, data } = options;
        
        const updated = await this.model.findByIdAndUpdate(
          id,
          { $set: { ...data, updatedAt: new Date() } },
          { new: true } // Return the updated document
        ).lean();
        
        if (!updated) {
          throw new Error('Message not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a message
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const message = await this.model.findByIdAndDelete(id).lean();
        
        if (!message) {
          throw new Error('Message not found');
        }
        
        return this.formatDocument(message);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
  
  /**
   * Delete all messages for a conversation
   */
  async deleteByConversationId(conversationId: string) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const result = await this.model.deleteMany({ conversation: conversationId });
        
        return { deleted: result.deletedCount || 0 };
      });
    } catch (error) {
      return this.handleError(error, 'deleteByConversationId');
    }
  }
}

// Create a singleton instance
export const messageModel = new MessageModel();

// Export the model
export default messageModel;