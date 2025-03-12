import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';

// Define the interface for the document
export interface BlogDocument extends Document {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  ogImage?: string; // Open Graph image URL for social sharing
  createdAt: Date;
  updatedAt: Date;
}

// Define the interface for findUnique options
export interface FindUniqueOptions {
  where: { id: string } | { slug: string };
  include?: Record<string, boolean>;
}

/**
 * Blog model class
 */
export class BlogModel extends BaseModel<BlogDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<BlogDocument>(
      {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        date: { type: String, required: true },
        tags: { type: [String], default: [] },
        description: { type: String, required: true },
        ogImage: { type: String, required: false }, // OG image URL field
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
      }
    );
    
    super('Blog', schema);
  }
  
  /**
   * Find multiple blog posts with optional filtering and sorting
   */
  async findMany(options: QueryOptions = {}) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where = {}, orderBy = {}, include = {}, limit, skip } = options;
        
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
        const blogs = await query.lean();
        
        // Format results
        const formattedBlogs = blogs.map((blog: any) => this.formatDocument(blog));
        
        return formattedBlogs;
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find a single blog post by ID
   */
  async findById(options: FindByIdOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const blog = await this.model.findById(id).lean();
        
        if (!blog) return null;
        
        return this.formatDocument(blog);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Create a new blog post
   */
  async create(options: CreateOptions<BlogDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const blog = new this.model(options.data);
        await blog.save();
        
        return this.formatDocument(blog);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Update a blog post
   */
  async update(options: UpdateOptions<BlogDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id, data } = options;
        
        // Get the where clause from options, which might be in a different format
        let whereId;
        if (options.where && options.where.id) {
          // If this format is used: { where: { id: ... }, data: ... }
          whereId = options.where.id;
        } else {
          // If this format is used: { id: ..., data: ... }
          whereId = id;
        }
        
        // Log the ID we're trying to update
        console.log(`Attempting to update blog post with id: ${whereId}`);
        
        const updated = await this.model.findByIdAndUpdate(
          whereId,
          { $set: { ...data, updatedAt: new Date() } },
          { new: true } // Return the updated document
        ).lean();
        
        if (!updated) {
          console.error(`Update failed for blog post with ID ${whereId}`);
          throw new Error(`Update failed for blog post: ${whereId}`);
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      console.error(`Error in update for ID: ${options.id || (options.where?.id)}`, error);
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a blog post
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        // Extract ID from options
        const whereId = options.where?.id || options.id;
        
        // Log the ID we're trying to delete
        console.log(`Attempting to delete blog post with id: ${whereId}`);
        
        const blog = await this.model.findByIdAndDelete(whereId).lean();
        
        if (!blog) {
          console.error(`Delete failed for blog post with ID ${whereId}`);
          throw new Error(`Delete failed for blog post: ${whereId}`);
        }
        
        return this.formatDocument(blog);
      });
    } catch (error) {
      console.error(`Error in delete for ID: ${options.id || (options.where?.id)}`, error);
      return this.handleError(error, 'delete');
    }
  }
  
  /**
   * Find a single blog post by unique criteria (id or slug)
   */
  async findUnique(options: FindUniqueOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where } = options;
        
        // Log the query for debugging
        console.log(`findUnique blog query:`, JSON.stringify(where, null, 2));
        
        let blog;
        
        if ('id' in where) {
          blog = await this.model.findById(where.id).lean();
        } else if ('slug' in where) {
          blog = await this.model.findOne({ slug: where.slug }).lean();
        }
        
        if (!blog) {
          console.log(`No blog post found with criteria:`, JSON.stringify(where, null, 2));
          return null;
        }
        
        return this.formatDocument(blog);
      });
    } catch (error) {
      console.error(`Error in findUnique:`, error);
      return this.handleError(error, 'findUnique');
    }
  }
}

// Create a singleton instance
export const blogModel = new BlogModel();

// Export the model
export default blogModel; 