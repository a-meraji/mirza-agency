import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';

// Define the interface for the document
export interface AvailableAppointmentDocument extends Document {
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // Duration in minutes
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AvailableAppointment model class
 */
export class AvailableAppointmentModel extends BaseModel<AvailableAppointmentDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<AvailableAppointmentDocument>(
      {
        date: { type: Date, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        duration: { type: Number, required: true },
        isBooked: { type: Boolean, default: false },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
      }
    );
    
    super('AvailableAppointment', schema);
  }
  
  /**
   * Find multiple appointments with optional filtering and sorting
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
        const appointments = await query.lean();
        
        // Format results
        const formattedAppointments = await Promise.all(
          appointments.map(async (appointment: any) => {
            const result = this.formatDocument(appointment);
            
            // Include related booking if requested
            if (include.booking) {
              const BookingModel = mongoose.models.Booking;
              if (BookingModel) {
                const booking = await BookingModel.findOne({ appointmentId: result.id }).lean();
                if (booking) {
                  result.booking = {
                    ...booking,
                    id: booking._id.toString(),
                  };
                } else {
                  result.booking = null;
                }
              }
            }
            
            return result;
          })
        );
        
        return formattedAppointments;
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find a single appointment by ID
   */
  async findById(options: FindByIdOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id, include = {} } = options;
        
        const appointment = await this.model.findById(id).lean();
        
        if (!appointment) return null;
        
        const result = this.formatDocument(appointment);
        
        // Include related booking if requested
        if (include.booking) {
          const BookingModel = mongoose.models.Booking;
          if (BookingModel) {
            const booking = await BookingModel.findOne({ appointmentId: id }).lean();
            if (booking) {
              result.booking = {
                ...booking,
                id: booking._id.toString(),
              };
            } else {
              result.booking = null;
            }
          }
        }
        
        return result;
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  /**
   * Create a new appointment
   */
  async create(options: CreateOptions<AvailableAppointmentDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const appointment = new this.model(options.data);
        await appointment.save();
        
        return this.formatDocument(appointment);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Update an appointment
   */
  async update(options: UpdateOptions<AvailableAppointmentDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id, data } = options;
        
        // Get the where clause from options, which might be in a different format
        // depending on if it's coming from the REST API or from the booking transaction
        let whereId;
        if (options.where && options.where.id) {
          // If this format is used: { where: { id: ... }, data: ... }
          whereId = options.where.id;
        } else {
          // If this format is used: { id: ..., data: ... }
          whereId = id;
        }
        
        // Log the ID we're trying to update
        console.log(`Attempting to update appointment with id: ${whereId}`);
        
        // Try to handle both object ID and string formats
        let appointmentId;
        try {
          if (typeof whereId === 'string') {
            // Try to create a MongoDB ObjectId from the string ID
            try {
              appointmentId = new mongoose.Types.ObjectId(whereId);
            } catch (convError) {
              console.log(`ID ${whereId} is not a valid ObjectId, using as-is`);
              appointmentId = whereId; // Fallback to using as is
            }
          } else {
            appointmentId = whereId;
          }
        } catch (err) {
          console.error(`Error converting ID: ${whereId}`, err);
          appointmentId = whereId; // Fallback to using as is
        }
        
        // Try to find the appointment first to confirm it exists
        const exists = await this.model.findById(appointmentId).lean();
        if (!exists) {
          console.error(`Appointment with ID ${whereId} not found before update`);
          throw new Error(`Appointment not found: ${whereId}`);
        }
        
        // Perform the update with the properly formatted ID
        const updated = await this.model.findByIdAndUpdate(
          appointmentId,
          { $set: { ...data, updatedAt: new Date() } },
          { new: true } // Return the updated document
        ).lean();
        
        if (!updated) {
          console.error(`Update failed for appointment with ID ${whereId}`);
          throw new Error(`Update failed for appointment: ${whereId}`);
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      console.error(`Error in update for ID: ${options.id || (options.where?.id)}`, error);
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete an appointment
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id } = options;
        
        const appointment = await this.model.findByIdAndDelete(id).lean();
        
        if (!appointment) {
          throw new Error('Appointment not found');
        }
        
        return this.formatDocument(appointment);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
  
  /**
   * Find a single appointment by unique criteria (similar to Prisma's findUnique)
   */
  async findUnique(options: { where: Record<string, any>, include?: Record<string, boolean> }) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where, include = {} } = options;
        
        // Log the query for debugging
        console.log(`findUnique query:`, JSON.stringify(where, null, 2));
        
        // Handle ID conversion if needed
        let query = { ...where };
        
        if (where.id) {
          try {
            // Convert string ID to ObjectId if valid
            if (typeof where.id === 'string') {
              // Check if it's a valid ObjectId
              try {
                const objectId = new mongoose.Types.ObjectId(where.id);
                console.log(`Converting string ID to ObjectId: ${where.id}`);
                query = { 
                  ...where,
                  _id: objectId,
                };
                delete query.id; // Remove the string id from query
              } catch (error) {
                console.log(`ID ${where.id} is not a valid ObjectId, using as-is`);
              }
            }
          } catch (err) {
            console.error(`Error converting ID in findUnique: ${where.id}`, err);
            // Keep the original ID if conversion fails
          }
        }
        
        // If the query has an _id, use findById
        if (query._id) {
          const appointment = await this.model.findById(query._id).lean();
          
          if (!appointment) {
            console.log(`No appointment found with _id: ${query._id}`);
            return null;
          }
          
          const result = this.formatDocument(appointment);
          
          // Include related booking if requested
          if (include.booking) {
            const BookingModel = mongoose.models.Booking;
            if (BookingModel) {
              const booking = await BookingModel.findOne({ appointmentId: result.id }).lean();
              if (booking) {
                result.booking = {
                  ...booking,
                  id: booking._id.toString(),
                };
              } else {
                result.booking = null;
              }
            }
          }
          
          return result;
        } else {
          // Otherwise, use findOne with the query
          console.log(`Using findOne with query:`, JSON.stringify(query, null, 2));
          const appointment = await this.model.findOne(query).lean();
          
          if (!appointment) {
            console.log(`No appointment found with query:`, JSON.stringify(query, null, 2));
            return null;
          }
          
          const result = this.formatDocument(appointment);
          
          // Include related booking if requested
          if (include.booking) {
            const BookingModel = mongoose.models.Booking;
            if (BookingModel) {
              const booking = await BookingModel.findOne({ appointmentId: result.id }).lean();
              if (booking) {
                result.booking = {
                  ...booking,
                  id: booking._id.toString(),
                };
              } else {
                result.booking = null;
              }
            }
          }
          
          return result;
        }
      });
    } catch (error) {
      console.error(`Error in findUnique:`, error);
      return this.handleError(error, 'findUnique');
    }
  }
}

// Create a singleton instance
export const availableAppointmentModel = new AvailableAppointmentModel();

// Export the model
export default availableAppointmentModel; 