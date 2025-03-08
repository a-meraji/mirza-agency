import mongoose from 'mongoose';

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your MongoDB connection string to .env.local');
}

const MONGODB_URI = process.env.DATABASE_URL;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global as any;

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with proper error handling and connection management
 */
async function dbConnect() {
  // If we have an existing connection and it's valid, return it
  if (cached.mongoose.conn) {
    if (mongoose.connection.readyState === 1) {
      return cached.mongoose.conn;
    } else {
      console.log('MongoDB connection lost, reconnecting...');
      cached.mongoose.conn = null;
      cached.mongoose.promise = null;
    }
  }

  // If no existing connection or promise, create a new one
  if (!cached.mongoose.promise) {
    // Modern MongoDB connection options
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 90000,
      connectTimeoutMS: 60000,
      maxPoolSize: 10,
      family: 4,
      // Heartbeat to keep connection alive
      heartbeatFrequencyMS: 10000,
    };

    console.log('Connecting to MongoDB...');
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Only reset if this is our cached connection
      if (mongoose.connection === cached.mongoose.conn) {
        cached.mongoose.conn = null;
        cached.mongoose.promise = null;
      }
    });
    
    // Create the connection promise
    cached.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
  }
  
  try {
    // Wait for the connection to be established
    cached.mongoose.conn = await cached.mongoose.promise;
    console.log('MongoDB connection established');
    return cached.mongoose.conn;
  } catch (error) {
    // Reset the promise on error
    cached.mongoose.promise = null;
    
    // Detailed error logging
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      console.error(`MongoDB connection error details: ${error.message}`);
      if ('stack' in error) {
        console.error(`Stack trace: ${error.stack}`);
      }
    }
    
    throw error;
  }
}

export default dbConnect; 