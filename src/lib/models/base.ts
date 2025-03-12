import mongoose, { Document, Model, Schema } from 'mongoose';
import { connectToDatabase } from '../db';
import { DatabaseService } from '../services/database';

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
}

/**
 * Common interface for query options
 */
export interface QueryOptions {
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>;
  include?: Record<string, boolean>;
  limit?: number;
  skip?: number;
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