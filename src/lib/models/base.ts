import mongoose, { Document, Model, Schema } from 'mongoose';
import { DatabaseService } from '../services/database';

/**
 * Common interface for query options
 */
export interface QueryOptions {
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
  include?: Record<string, boolean>;
  select?: Record<string, number>; // For projections like { _id: 1 }
  limit?: number;
  skip?: number;
  sort?: Record<string, number>; // For sorting like { createdAt: -1 }
}

/**
 * Common interface for find by ID options
 */
export interface FindByIdOptions {
  id: string;
  include?: Record<string, boolean>;
}

/**
 * Common interface for create options
 */
export interface CreateOptions<T> {
  data: Partial<T>;
}

/**
 * Common interface for update options
 */
export interface UpdateOptions<T> {
  id: string;
  data: Partial<T>;
}

/**
 * Common interface for delete options
 */
export interface DeleteOptions {
  id: string;
}

/**
 * Base model class with common CRUD operations
 */
export abstract class BaseModel<T extends Document> {
  protected model: Model<T>;
  protected modelName: string;
  
  constructor(modelName: string, schema: Schema) {
    this.modelName = modelName;
    
    // Check if model already exists to prevent overwrite warnings
    this.model = mongoose.models[modelName] as Model<T> || 
      mongoose.model<T>(modelName, schema);
  }
  
  /**
   * Ensure database connection is established
   */
  protected async ensureConnection() {
    await DatabaseService.ensureConnection();
  }
  
  /**
   * Format a document for output
   */
  protected formatDocument(doc: any) {
    if (!doc) return null;
    
    // Convert _id to id
    const formatted = { ...doc };
    
    if (formatted._id) {
      formatted.id = formatted._id.toString();
      delete formatted._id;
    }
    
    // Handle nested documents
    for (const [key, value] of Object.entries(formatted)) {
      if (value && typeof value === 'object' && '_id' in value) {
        formatted[key] = this.formatDocument(value);
      }
    }
    
    return formatted;
  }
  
  /**
   * Handle errors in model operations
   */
  protected handleError(error: unknown, operation: string) {
    console.error(`Error in ${this.modelName}.${operation}:`, error);
    throw error;
  }
  
  /**
   * Find multiple documents with optional filtering and sorting
   */
  async findMany(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, orderBy = {}, limit, skip, include = {} } = options;
        
        // Build query
        let query = this.model.find(where);
        
        // Handle includes/population
        for (const [key, value] of Object.entries(include)) {
          if (value) {
            query = query.populate(key);
          }
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
        }
        
        // Apply pagination
        if (skip) query = query.skip(skip);
        if (limit) query = query.limit(limit);
        
        // Execute query
        const results = await query.lean();
        
        // Format results
        return results.map(doc => this.formatDocument(doc));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Count documents matching a filter
   */
  async count(filter: Record<string, any> = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        return await this.model.countDocuments(filter);
      });
    } catch (error) {
      return this.handleError(error, 'count');
    }
  }

  /**
   * Find a single document by criteria
   */
  async findOne(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, include = {} } = options;
        
        // Build query
        let query = this.model.findOne(where);
        
        // Handle includes/population
        for (const [key, value] of Object.entries(include)) {
          if (value) {
            query = query.populate(key);
          }
        }
        
        const doc = await query.lean();
        
        if (!doc) return null;
        
        return this.formatDocument(doc);
      });
    } catch (error) {
      return this.handleError(error, 'findOne');
    }
  }
} 