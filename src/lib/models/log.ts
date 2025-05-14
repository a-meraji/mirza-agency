import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';
import { UserDocument } from './user';
import { RagSystemDocument } from './ragSystem';
import { ConversationDocument } from './conversation';

// Define the interface for the document
export interface LogDocument extends Document {
  user: mongoose.Types.ObjectId | string | UserDocument;
  ragSystem?: mongoose.Types.ObjectId | string | RagSystemDocument;
  conversation?: mongoose.Types.ObjectId | string | ConversationDocument;
  executionId?: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  meta?: any;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Log model class for system and application logs
 */
export class LogModel extends BaseModel<LogDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<LogDocument>(
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        ragSystem: { type: Schema.Types.ObjectId, ref: 'RagSystem', index: true },
        conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', index: true },
        executionId: { type: String, index: true },
        level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
        message: { type: String, required: true },
        meta: { type: Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now, index: true },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        collection: 'Log', // Explicitly set the collection name
      }
    );
    
    super('Log', schema);
  }
  
  /**
   * Find multiple logs with optional filtering and sorting
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
          // Default sorting by timestamp if no specific order provided
          query = query.sort({ timestamp: -1 });
        }
        
        // Apply pagination
        if (skip) query = query.skip(skip);
        if (limit) query = query.limit(limit);
        
        // Execute query
        const logs = await query.lean();
        
        // Format results
        return logs.map(log => this.formatDocument(log));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find logs for a specific user
   */
  async findByUserId(userId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { user: userId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find logs for a specific RAG system
   */
  async findByRagSystemId(ragSystemId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { ragSystem: ragSystemId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find logs for a specific conversation
   */
  async findByConversationId(conversationId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { conversation: conversationId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find logs for a specific execution
   */
  async findByExecutionId(executionId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { executionId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find logs by error level
   */
  async findByLevel(level: 'info' | 'warn' | 'error', options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { level }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find a single log by ID
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
        
        if (include.conversation) {
          query = query.populate('conversation');
        }
        
        const log = await query.lean();
        
        if (!log) return null;
        
        return this.formatDocument(log);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Create a new log entry
   */
  async create(options: CreateOptions<LogDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const log = new this.model({
          ...options.data,
          timestamp: options.data.timestamp || new Date()
        });
        
        await log.save();
        
        return this.formatDocument(log);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Create multiple log entries in bulk
   */
  async createMany(logsData: Partial<LogDocument>[]) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        // Ensure timestamp is set for all logs
        const logsWithTimestamp = logsData.map(log => ({
          ...log,
          timestamp: log.timestamp || new Date()
        }));
        
        const result = await this.model.insertMany(logsWithTimestamp);
        
        return result.map(log => this.formatDocument(log));
      });
    } catch (error) {
      return this.handleError(error, 'createMany');
    }
  }
  
  /**
   * Log convenience methods
   */
  async logInfo(userId: string, message: string, options: Partial<LogDocument> = {}) {
    return this.create({
      data: {
        user: userId,
        level: 'info',
        message,
        ...options
      }
    });
  }
  
  async logWarning(userId: string, message: string, options: Partial<LogDocument> = {}) {
    return this.create({
      data: {
        user: userId,
        level: 'warn',
        message,
        ...options
      }
    });
  }
  
  async logError(userId: string, message: string, options: Partial<LogDocument> = {}) {
    return this.create({
      data: {
        user: userId,
        level: 'error',
        message,
        ...options
      }
    });
  }
  
  /**
   * Update a log entry
   */
  async update(options: UpdateOptions<LogDocument>) {
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
          throw new Error('Log entry not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a log entry
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const log = await this.model.findByIdAndDelete(id).lean();
        
        if (!log) {
          throw new Error('Log entry not found');
        }
        
        return this.formatDocument(log);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
  
  /**
   * Delete log entries by criteria
   */
  async deleteMany(options: { 
    userId?: string;
    ragSystemId?: string;
    conversationId?: string;
    executionId?: string;
    level?: 'info' | 'warn' | 'error';
    before?: Date;
  }) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const query: any = {};
        
        if (options.userId) {
          query.user = options.userId;
        }
        
        if (options.ragSystemId) {
          query.ragSystem = options.ragSystemId;
        }
        
        if (options.conversationId) {
          query.conversation = options.conversationId;
        }
        
        if (options.executionId) {
          query.executionId = options.executionId;
        }
        
        if (options.level) {
          query.level = options.level;
        }
        
        if (options.before) {
          query.timestamp = { $lt: options.before };
        }
        
        const result = await this.model.deleteMany(query);
        
        return { deleted: result.deletedCount || 0 };
      });
    } catch (error) {
      return this.handleError(error, 'deleteMany');
    }
  }
  
  /**
   * Clean up old logs
   */
  async cleanupOldLogs(options: { 
    olderThan: Date;
    keepErrors?: boolean;
  }) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const query: any = {
          timestamp: { $lt: options.olderThan }
        };
        
        // If keepErrors is true, only delete non-error logs
        if (options.keepErrors) {
          query.level = { $ne: 'error' };
        }
        
        const result = await this.model.deleteMany(query);
        
        return { deleted: result.deletedCount || 0 };
      });
    } catch (error) {
      return this.handleError(error, 'cleanupOldLogs');
    }
  }
}

// Create a singleton instance
export const logModel = new LogModel();

// Export the model
export default logModel;