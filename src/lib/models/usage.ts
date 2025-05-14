import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';
import { ConversationDocument } from './conversation';

// Define the interface for the document
export interface UsageDocument extends Document {
  conversation: mongoose.Types.ObjectId | string | ConversationDocument;
  executionId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costEstimated: number;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Usage model class for tracking token usage and costs
 */
export class UsageModel extends BaseModel<UsageDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<UsageDocument>(
      {
        conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
        executionId: { type: String, required: true, index: true },
        promptTokens: { type: Number, required: true },
        completionTokens: { type: Number, required: true },
        totalTokens: { type: Number, required: true },
        costEstimated: { type: Number, required: true },
        recordedAt: { type: Date, default: Date.now, index: true },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        collection: 'Usage', // Explicitly set the collection name
      }
    );
    
    // Create a unique compound index
    schema.index({ conversation: 1, executionId: 1 }, { unique: true });
    
    super('Usage', schema);
  }
  
  /**
   * Find multiple usage records with optional filtering and sorting
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
          // Default sorting by recordedAt date if no specific order provided
          query = query.sort({ recordedAt: -1 });
        }
        
        // Apply pagination
        if (skip) query = query.skip(skip);
        if (limit) query = query.limit(limit);
        
        // Execute query
        const usages = await query.lean();
        
        // Format results
        return usages.map(usage => this.formatDocument(usage));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find usage for a specific conversation
   */
  async findByConversationId(conversationId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { conversation: conversationId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find usage for a specific execution
   */
  async findByExecutionId(executionId: string) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const usage = await this.model.findOne({ executionId }).lean();
        
        if (!usage) return null;
        
        return this.formatDocument(usage);
      });
    } catch (error) {
      return this.handleError(error, 'findByExecutionId');
    }
  }
  
  /**
   * Calculate total usage statistics for a conversation
   */
  async getConversationTotals(conversationId: string) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const result = await this.model.aggregate([
          { $match: { conversation: new mongoose.Types.ObjectId(conversationId) } },
          { 
            $group: { 
              _id: null,
              totalPromptTokens: { $sum: '$promptTokens' },
              totalCompletionTokens: { $sum: '$completionTokens' },
              totalTokens: { $sum: '$totalTokens' },
              totalCost: { $sum: '$costEstimated' },
              executionCount: { $sum: 1 }
            } 
          }
        ]);
        
        if (result.length === 0) {
          return {
            totalPromptTokens: 0,
            totalCompletionTokens: 0,
            totalTokens: 0,
            totalCost: 0,
            executionCount: 0
          };
        }
        
        return result[0];
      });
    } catch (error) {
      return this.handleError(error, 'getConversationTotals');
    }
  }
  
  /**
   * Find a single usage record by ID
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
        
        const usage = await query.lean();
        
        if (!usage) return null;
        
        return this.formatDocument(usage);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Create a new usage record
   */
  async create(options: CreateOptions<UsageDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const usage = new this.model({
          ...options.data,
          recordedAt: options.data.recordedAt || new Date()
        });
        
        await usage.save();
        
        return this.formatDocument(usage);
      });
    } catch (error) {
      // Handle duplicate key error (same conversation and executionId)
      if (error instanceof mongoose.mongo.MongoError && error.code === 11000) {
        return this.handleError(new Error('Usage record already exists for this execution'), 'create');
      }
      
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Update a usage record
   */
  async update(options: UpdateOptions<UsageDocument>) {
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
          throw new Error('Usage record not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a usage record
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const usage = await this.model.findByIdAndDelete(id).lean();
        
        if (!usage) {
          throw new Error('Usage record not found');
        }
        
        return this.formatDocument(usage);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
  
  /**
   * Delete all usage records for a conversation
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
  
  /**
   * Generate usage reports for a date range
   */
  async generateReport(options: { 
    startDate: Date; 
    endDate: Date; 
    userId?: string;
    ragSystemId?: string;
  }) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { startDate, endDate, userId, ragSystemId } = options;
        
        // Build the match stage for the aggregation
        const matchStage: any = {
          recordedAt: { $gte: startDate, $lte: endDate }
        };
        
        // If we need to filter by userId or ragSystemId, we need to use a pipeline with lookup
        const pipeline: any[] = [];
        
        if (userId || ragSystemId) {
          // First lookup to get the conversation
          pipeline.push({
            $lookup: {
              from: 'Conversation',
              localField: 'conversation',
              foreignField: '_id',
              as: 'conversationData'
            }
          });
          
          pipeline.push({ $unwind: '$conversationData' });
          
          // Add user filter if needed
          if (userId) {
            pipeline.push({
              $match: {
                'conversationData.user': new mongoose.Types.ObjectId(userId)
              }
            });
          }
          
          // Add ragSystem filter if needed
          if (ragSystemId) {
            pipeline.push({
              $match: {
                'conversationData.ragSystem': new mongoose.Types.ObjectId(ragSystemId)
              }
            });
          }
        }
        
        // Add date filter
        pipeline.push({ $match: { recordedAt: matchStage.recordedAt } });
        
        // Add grouping for the report
        pipeline.push({
          $group: {
            _id: {
              year: { $year: '$recordedAt' },
              month: { $month: '$recordedAt' },
              day: { $dayOfMonth: '$recordedAt' }
            },
            totalPromptTokens: { $sum: '$promptTokens' },
            totalCompletionTokens: { $sum: '$completionTokens' },
            totalTokens: { $sum: '$totalTokens' },
            totalCost: { $sum: '$costEstimated' },
            requestCount: { $sum: 1 }
          }
        });
        
        // Sort by date
        pipeline.push({
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        });
        
        // Execute the aggregation
        const report = await this.model.aggregate(pipeline);
        
        // Format the results to be more user-friendly
        return report.map(day => ({
          date: new Date(day._id.year, day._id.month - 1, day._id.day),
          totalPromptTokens: day.totalPromptTokens,
          totalCompletionTokens: day.totalCompletionTokens,
          totalTokens: day.totalTokens,
          totalCost: day.totalCost,
          requestCount: day.requestCount
        }));
      });
    } catch (error) {
      return this.handleError(error, 'generateReport');
    }
  }
}

// Create a singleton instance
export const usageModel = new UsageModel();

// Export the model
export default usageModel;