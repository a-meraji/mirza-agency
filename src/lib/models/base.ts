import mongoose, { Document, Model, Schema } from 'mongoose';
import { connectToDatabase } from '../db';
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
  id?: string;
  where?: { id: string };
  data: Partial<T>;
}

/**
 * Common interface for delete options
 */
export interface DeleteOptions {
  id?: string;
  where?: { id: string };
}

/**
 * Base model class that provides common functionality for all models
 */
export abstract class BaseModel<T extends Document> {
  protected model: Model<T>;
  protected modelName: string;
  protected schema: Schema<T>;

  constructor(modelName: string, schema: Schema<T>) {
    this.modelName = modelName;
    this.schema = schema;
    
    // Initialize the model
    this.model = this.getModel();
  }

  /**
   * Get or create the Mongoose model
   */
  protected getModel(): Model<T> {
    return (mongoose.models[this.modelName] as Model<T>) || 
           mongoose.model<T>(this.modelName, this.schema);
  }

  /**
   * Ensure database connection before any operation
   */
  protected async ensureConnection() {
    // Use the simplified database connection utility
    await connectToDatabase();
    
    // Make sure model is initialized
    if (!this.model) {
      this.model = this.getModel();
    }
  }

  /**
   * Format document to include string ID
   */
  protected formatDocument(doc: any): any {
    if (!doc) return null;
    
    const formatted = doc._doc ? { ...doc._doc } : { ...doc };
    
    // Convert _id to string id
    if (formatted._id) {
      formatted.id = formatted._id.toString();
    }
    
    return formatted;
  }

  /**
   * Handle errors consistently
   */
  protected handleError(error: any, operation: string): never {
    console.error(`Error in ${this.modelName}.${operation}:`, error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(`Validation error in ${this.modelName}: ${error.message}`);
    }
    
    if (error instanceof mongoose.Error.CastError) {
      throw new Error(`Invalid ID format for ${this.modelName}`);
    }
    
    throw error;
  }
  
  /**
   * Find many documents
   */
  async findMany(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, include = {}, skip = 0, limit = 100, orderBy, sort, select } = options;
        
        // Build the query
        let query = this.model.find(where);
        
        // Handle pagination
        if (skip) query = query.skip(skip);
        if (limit) query = query.limit(limit);
        
        // Handle sorting
        if (sort) {
          query = query.sort(sort);
        } else if (orderBy) {
          const sortCriteria: Record<string, number> = {};
          
          if (Array.isArray(orderBy)) {
            orderBy.forEach(criteria => {
              Object.entries(criteria).forEach(([field, direction]) => {
                sortCriteria[field] = direction === 'asc' ? 1 : -1;
              });
            });
          } else {
            Object.entries(orderBy).forEach(([field, direction]) => {
              sortCriteria[field] = direction === 'asc' ? 1 : -1;
            });
          }
          
          query = query.sort(sortCriteria);
        }
        
        // Handle includes/population
        Object.entries(include).forEach(([field, shouldInclude]) => {
          if (shouldInclude) {
            query = query.populate(field);
          }
        });
        
        // Handle field selection
        if (select) {
          query = query.select(select);
        }
        
        const results = await query.lean();
        
        // Format the results
        return results.map(doc => this.formatDocument(doc));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find a single document
   */
  async findOne(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, include = {} } = options;
        
        // Build the query
        let query = this.model.findOne(where);
        
        // Handle includes/population
        Object.entries(include).forEach(([field, shouldInclude]) => {
          if (shouldInclude) {
            query = query.populate(field);
          }
        });
        
        const doc = await query.lean();
        
        if (!doc) return null;
        
        // Format the document
        return this.formatDocument(doc);
      });
    } catch (error) {
      return this.handleError(error, 'findOne');
    }
  }
  
  /**
   * Count documents
   */
  async count(where: Record<string, any> = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        return await this.model.countDocuments(where);
      });
    } catch (error) {
      return this.handleError(error, 'count');
    }
  }
} 