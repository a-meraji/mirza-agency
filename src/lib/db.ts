import mongoose from 'mongoose';

// Define mongooseConnection global variable
declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    isConnecting: boolean;
    lastConnectionAttempt: number;
    retryCount: number;
    lastError: Error | null;
  } | undefined;
}

// Initialize the global connection object if it doesn't exist
if (!global.mongooseConnection) {
  global.mongooseConnection = {
    conn: null,
    promise: null,
    isConnecting: false,
    lastConnectionAttempt: 0,
    retryCount: 0,
    lastError: null
  };
}

/**
 * A simplified database connection utility
 * - Ensures only one connection is maintained
 * - Properly handles disconnections and reconnections
 * - Provides consistent error handling
 */
export async function connectToDatabase() {
  // Validate environment variables
  if (!process.env.DATABASE_URL) {
    throw new Error('Please define the DATABASE_URL environment variable');
  }
  
  // Check for credential components in the connection string
  const connectionString = process.env.DATABASE_URL;
  const hasCredentials = connectionString.includes('@');
  if (!hasCredentials) {
    console.warn('Connection string may be missing credentials. Format should be mongodb+srv://username:password@cluster...');
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

  // Check for repeated authentication failures
  if (
    global.mongooseConnection.lastError && 
    global.mongooseConnection.lastError.message.includes('authentication failed') &&
    global.mongooseConnection.retryCount > 3
  ) {
    console.error('Multiple authentication failures detected. Please check your credentials in .env');
    throw new Error('MongoDB authentication failed repeatedly. Please verify your credentials.');
  }

  // Connection options with better timeout and retry settings
  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    family: 4,
    retryWrites: true,
    retryReads: true,
    authSource: 'admin', // Explicitly set auth source
    authMechanism: 'SCRAM-SHA-1', // Explicitly set auth mechanism
  };

  // Clear existing listeners to prevent duplicates
  mongoose.connection.removeAllListeners();

  // Set up connection event handlers
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
    global.mongooseConnection.isConnecting = false;
    global.mongooseConnection.retryCount = 0; // Reset retry count on successful connection
    global.mongooseConnection.lastError = null;
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    global.mongooseConnection.isConnecting = false;
    global.mongooseConnection.lastError = err;
    
    // Check for authentication errors specifically
    if (err.message && err.message.includes('authentication failed')) {
      console.error('Authentication failed. Please check your MongoDB username and password in .env');
      global.mongooseConnection.retryCount += 1;
    }
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
    
    // Enhanced error handling for common issues
    if (error instanceof Error) {
      global.mongooseConnection.lastError = error;
      
      if (error.message.includes('authentication failed')) {
        console.error('Authentication error: Check your DATABASE_URL credentials');
        global.mongooseConnection.retryCount += 1;
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('Network error: Cannot resolve MongoDB host. Check your network or DATABASE_URL');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('Connection refused: MongoDB server may be down or not accepting connections');
      } else if (error.message.includes('timed out')) {
        console.error('Connection timeout: MongoDB server took too long to respond');
      }
    }
    
    global.mongooseConnection.isConnecting = false;
    global.mongooseConnection.promise = null;
    throw error;
  }
}

// Export the mongoose instance for direct use when needed
export { mongoose }; 