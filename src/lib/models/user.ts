import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';

// Define the interface for the document
export interface UserDocument extends Document {
  email: string;
  password: string;
  name?: string;
  role: string;
  apiKey:string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User model class
 */
export class UserModel extends BaseModel<UserDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<UserDocument>(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String },
        role: { type: String, required: true, default: 'user' },
        apiKey: { type: String, required: true, unique: true }
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        collection: 'User', // Explicitly set the collection name to match what's in the database
      }
    );
    
    super('User', schema);
  }
  
  /**
   * Find multiple users with optional filtering and sorting
   */
  async findMany(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, orderBy = {}, limit, skip } = options;
        
        // Build query
        let query = this.model.find(where);
        
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
        const users = await query.lean();
        
        // Format results
        return users.map(user => this.formatDocument(user));
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find a single user by ID
   */
  async findById(options: FindByIdOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const user = await this.model.findById(id).lean();
        
        if (!user) return null;
        
        return this.formatDocument(user);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Find a single user by email
   */
  async findByEmail(email: string) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        console.log('Finding user by email:', email);
        
        const user = await this.model.findOne({ email }).lean();
        
        if (!user) {
          console.log('User not found with Mongoose model, trying direct MongoDB query...');
          // Try direct MongoDB query as a fallback
          if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
            const db = mongoose.connection.db;
            const directUser = await db.collection('User').findOne({ email });
            
            if (directUser && typeof directUser === 'object' && '_id' in directUser) {
              console.log('User found with direct query but not with Mongoose model');
              return {
                ...directUser,
                id: directUser._id.toString(),
              };
            }
          }
          
          console.log('User not found with direct query either');
          return null;
        }
        
        console.log('User found with Mongoose model');
        return this.formatDocument(user);
      });
    } catch (error) {
      return this.handleError(error, 'findByEmail');
    }
  }
  
  /**
   * Create a new user
   */
  async create(options: CreateOptions<UserDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const user = new this.model(options.data);
        await user.save();
        
        return this.formatDocument(user);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Update a user
   */
  async update(options: UpdateOptions<UserDocument>) {
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
          throw new Error('User not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a user
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const user = await this.model.findByIdAndDelete(id).lean();
        
        if (!user) {
          throw new Error('User not found');
        }
        
        return this.formatDocument(user);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
}

// Create a singleton instance
export const userModel = new UserModel();

// Export the model
export default userModel; 