import { availableAppointmentModel } from './availableAppointment';
import { bookingModel } from './booking';
import { userModel } from './user';
import { DatabaseService } from '../services/database';

/**
 * Database client that provides access to all models and database operations
 * Similar to Prisma client structure for easy migration
 */
export const db = {
  // Models
  availableAppointment: availableAppointmentModel,
  booking: bookingModel,
  user: userModel,
  
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
  availableAppointmentModel,
  bookingModel,
  userModel
};

// Default export with named variable
const models = {
  availableAppointmentModel,
  bookingModel,
  userModel,
  db
};

export default models; 