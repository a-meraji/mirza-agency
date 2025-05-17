import { availableAppointmentModel } from './availableAppointment';
import { bookingModel } from './booking';
import { userModel } from './user';
import { blogModel } from './blog';
import { ragSystemModel } from './ragSystem';
import { conversationModel } from './conversation';
import { messageModel } from './message';
import { usageModel } from './usage';
import { logModel } from './log';
import { paymentModel } from './payment';
import { DatabaseService } from '../services/database';

/**
 * Database client that provides access to all models and database operations
 * Similar to Prisma client structure for easy migration
 */
export const db = {
  // Original models
  availableAppointment: availableAppointmentModel,
  booking: bookingModel,
  user: userModel,
  blog: blogModel,
  
  // New RAG-related models
  ragSystem: ragSystemModel,
  conversation: conversationModel,
  message: messageModel,
  usage: usageModel,
  log: logModel,
  payment: paymentModel,
  
  // Transaction support
  $transaction: async (operations: Promise<any>[]) => {
    // Convert array of promises to array of functions that return promises
    const operationFunctions = operations.map(
      operation => async () => await operation
    );
    return DatabaseService.transaction(operationFunctions);
  }
};

// Export individual models
export {
  // Original models
  availableAppointmentModel,
  bookingModel,
  userModel,
  blogModel,
  
  // New RAG-related models
  ragSystemModel,
  conversationModel,
  messageModel,
  usageModel,
  logModel,
  paymentModel
};

// Default export with named variable
const models = {
  // Original models
  availableAppointmentModel,
  bookingModel,
  userModel,
  blogModel,
  
  // New RAG-related models
  ragSystemModel,
  conversationModel,
  messageModel,
  usageModel,
  logModel,
  paymentModel,
  
  // Database client
  db
};

export default models;