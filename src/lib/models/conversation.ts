import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';
import { UserDocument } from './user';
import { RagSystemDocument } from './ragSystem';

// Define the interface for the document
export interface ConversationDocument extends Document {
  user: mongoose.Types.ObjectId | string | UserDocument;
  ragSystem: mongoose.Types.ObjectId | string | RagSystemDocument;
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Conversation model class
 */
export class ConversationModel extends BaseModel<ConversationDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<ConversationDocument>(
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        ragSystem: { type: Schema.Types.ObjectId, ref: 'RagSystem', required: true, index: true },
        conversationId: { type: String, required: true, unique: true },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        collection: 'Conversation', // Explicitly set the collection name
      }
    );
    
    // Create a compound index
    schema.index({ user: 1, ragSystem: 1, createdAt: -1 });
    
    super('Conversation', schema);
  }
  
  /**
   * Find multiple conversations with optional filtering and sorting
   */
  async findMany(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, orderBy = {}, limit, skip, include = {} } = options;
        
        // Build query
        let query = this.model.find(where);
        
        // Handle includes/population
        if (include.user) {
          query = query.populate('user');
        }
        
        if (include.ragSystem) {
          query = query.populate('ragSystem');
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
          query = query.sort({ createdAt: -1 });
        }
        
        // Apply pagination
        if (skip) query = query.skip(skip);
        if (limit) query = query.limit(limit);
        
        // Execute query
        const conversations = await query.lean();
        
        // Format results
        return conversations.map(conversation => this.formatDocument(conversation));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find conversations for a specific user
   */
  async findByUserId(userId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { user: userId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find conversations for a specific RAG system
   */
  async findByRagSystemId(ragSystemId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { ragSystem: ragSystemId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find conversations by conversationId
   */
  async findByConversationId(conversationId: string) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const conversation = await this.model.findOne({ conversationId }).lean();
        
        if (!conversation) return null;
        
        return this.formatDocument(conversation);
      });
    } catch (error) {
      return this.handleError(error, 'findByConversationId');
    }
  }
  
  /**
   * Find a single conversation by ID
   */
  async findById(options: FindByIdOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id, include = {} } = options;
        
        let query = this.model.findById(id);
        
        // Handle includes/population
        if (include.user) {
          query = query.populate('user');
        }
        
        if (include.ragSystem) {
          query = query.populate('ragSystem');
        }
        
        const conversation = await query.lean();
        
        if (!conversation) return null;
        
        return this.formatDocument(conversation);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Create a new conversation
   */
  async create(options: CreateOptions<ConversationDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const conversation = new this.model(options.data);
        await conversation.save();
        
        return this.formatDocument(conversation);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Update a conversation
   */
  async update(options: UpdateOptions<ConversationDocument>) {
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
          throw new Error('Conversation not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a conversation
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const conversation = await this.model.findByIdAndDelete(id).lean();
        
        if (!conversation) {
          throw new Error('Conversation not found');
        }
        
        return this.formatDocument(conversation);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
}

// Create a singleton instance
export const conversationModel = new ConversationModel();

// Export the model
export default conversationModel;