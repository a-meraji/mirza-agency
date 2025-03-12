import mongoose from 'mongoose';

// Global is used here to maintain a cached connection across hot reloads
declare global {
  let mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    isConnecting: boolean;
    lastConnectionAttempt: number;
  };
}

if (!global.mongooseConnection) {
  global.mongooseConnection = {
    conn: null,
    promise: null,
    isConnecting: false,
    lastConnectionAttempt: 0
  };
}

/**
 * A simplified database connection utility
 * - Ensures only one connection is maintained
 * - Properly handles disconnections and reconnections
 * - Provides consistent error handling
 */
export async function connectToDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please define the DATABASE_URL environment variable');
  }

  // If we have an existing connection that is connected, return it
  if (mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return mongoose;
  }

  // Reset connection if it's in a bad state
  if (mongoose.connection.readyState === 2) { // Connecting
    const now = Date.now();
    if (now - global.mongooseConnection.lastConnectionAttempt > 30000) {
      console.log('Connection has been in connecting state too long, resetting');
      try {
        await mongoose.connection.close();
        global.mongooseConnection.conn = null;
        global.mongooseConnection.promise = null;
        global.mongooseConnection.isConnecting = false;
      } catch (err) {
        console.error('Error closing stale connection:', err);
      }
    } else {
      console.log('Connection is currently connecting, waiting...');
    }
  } else if (mongoose.connection.readyState === 3) { // Disconnecting
    console.log('Connection is disconnecting, waiting for completion before reconnecting');
    try {
      await mongoose.connection.close();
      global.mongooseConnection.conn = null;
      global.mongooseConnection.promise = null;
      global.mongooseConnection.isConnecting = false;
    } catch (err) {
      console.error('Error closing disconnecting connection:', err);
    }
  }

  // Don't create a new connection if one is in progress
  if (global.mongooseConnection.isConnecting && global.mongooseConnection.promise) {
    console.log('Waiting for existing connection process to complete');
    try {
      await global.mongooseConnection.promise;
      return mongoose;
    } catch (error) {
      console.error('Connection attempt failed, will try again:', error);
      global.mongooseConnection.isConnecting = false;
      global.mongooseConnection.promise = null;
    }
  }

  // Connection options
  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    family: 4,
  };

  // Clear existing listeners to prevent duplicates
  mongoose.connection.removeAllListeners();

  // Set up connection event handlers
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
    global.mongooseConnection.isConnecting = false;
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    global.mongooseConnection.isConnecting = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    global.mongooseConnection.conn = null;
    global.mongooseConnection.promise = null;
    global.mongooseConnection.isConnecting = false;
  });

  // Start the connection process
  console.log('Creating new database connection');
  global.mongooseConnection.isConnecting = true;
  global.mongooseConnection.lastConnectionAttempt = Date.now();

  try {
    global.mongooseConnection.promise = mongoose.connect(process.env.DATABASE_URL, opts);
    global.mongooseConnection.conn = await global.mongooseConnection.promise;
    console.log('MongoDB connection established');
    return mongoose;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    global.mongooseConnection.isConnecting = false;
    global.mongooseConnection.promise = null;
    throw error;
  }
}

// Export the mongoose instance for direct use when needed
export { mongoose }; 