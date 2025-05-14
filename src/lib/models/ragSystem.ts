import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';
import { UserDocument } from './user';

// Define the interface for the document
export interface RagSystemDocument extends Document {
  user: mongoose.Types.ObjectId | string | UserDocument;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * RAG System model class
 */
export class RagSystemModel extends BaseModel<RagSystemDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<RagSystemDocument>(
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        description: { type: String },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        collection: 'RagSystem', // Explicitly set the collection name
      }
    );
    
    super('RagSystem', schema);
  }
  
  /**
   * Find multiple RAG systems with optional filtering and sorting
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
        const systems = await query.lean();
        
        // Format results
        return systems.map(system => this.formatDocument(system));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find RAG systems for a specific user
   */
  async findByUserId(userId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { user: userId }
    };
    
    return this.findMany(queryOptions);
  }
  
  /**
   * Find a single RAG system by ID
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
        
        const system = await query.lean();
        
        if (!system) return null;
        
        return this.formatDocument(system);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Create a new RAG system
   */
  async create(options: CreateOptions<RagSystemDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const system = new this.model(options.data);
        await system.save();
        
        return this.formatDocument(system);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Update a RAG system
   */
  async update(options: UpdateOptions<RagSystemDocument>) {
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
          throw new Error('RAG System not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a RAG system
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const system = await this.model.findByIdAndDelete(id).lean();
        
        if (!system) {
          throw new Error('RAG System not found');
        }
        
        return this.formatDocument(system);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
}

// Create a singleton instance
export const ragSystemModel = new RagSystemModel();

// Export the model
export default ragSystemModel;