import mongoose from 'mongoose';
import dbConnect from '../mongodb';

/**
 * Database service for handling transactions and other database operations
 */
export class DatabaseService {
  /**
   * Execute a transaction with proper error handling
   * @param operations Array of operations to execute in a transaction
   * @returns Results of the operations
   */
  static async transaction<T>(operations: (() => Promise<T>)[]): Promise<T[]> {
    await dbConnect();
    
    // Check if connection is valid
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection is not ready for transaction');
    }
    
    // For MongoDB 4.2+, we can use native transactions
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const results: T[] = [];
      
      for (const operation of operations) {
        try {
          const result = await operation();
          results.push(result);
        } catch (error) {
          // If any operation fails, abort the transaction
          await session.abortTransaction();
          session.endSession();
          throw error;
        }
      }
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      return results;
    } catch (error) {
      // Make sure to abort and end session on error
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error aborting transaction:', abortError);
      }
      
      session.endSession();
      throw error;
    }
  }
  
  /**
   * Execute operations in sequence (fallback for environments without transaction support)
   * @param operations Array of operations to execute in sequence
   * @returns Results of the operations
   */
  static async executeInSequence<T>(operations: (() => Promise<T>)[]): Promise<T[]> {
    await dbConnect();
    
    const results: T[] = [];
    
    for (const operation of operations) {
      const result = await operation();
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Execute a database operation with retry logic
   * @param operation Function to execute
   * @param maxRetries Maximum number of retries
   * @param delay Initial delay between retries (ms)
   * @returns Result of the operation
   */
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Ensure DB connection before each attempt
        await dbConnect();
        
        // Check MongoDB connection state
        if (mongoose.connection.readyState !== 1) {
          console.log(`MongoDB not connected (state: ${mongoose.connection.readyState}), reconnecting...`);
          await dbConnect();
        }
        
        return await operation();
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);
        
        // If this is a connection error, try to reconnect
        if (
          error instanceof mongoose.Error.MongooseServerSelectionError ||
          (error instanceof Error && error.message.includes('buffering timed out'))
        ) {
          console.log('Connection error detected, forcing reconnection...');
          try {
            // Force reconnection
            await mongoose.connection.close();
            await dbConnect();
          } catch (reconnectError) {
            console.error('Error during reconnection:', reconnectError);
          }
        }
        
        if (attempt < maxRetries) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          // Increase delay for next retry (exponential backoff)
          delay *= 2;
        }
      }
    }
    
    throw lastError;
  }
} 