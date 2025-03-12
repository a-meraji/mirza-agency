import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';

// Define the interface for the document
export interface BookingDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  selectedServices?: string[];
  appointmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the interface for findUnique options
export interface FindUniqueOptions {
  where: { id: string };
  include?: Record<string, boolean>;
}

/**
 * Booking model class
 */
export class BookingModel extends BaseModel<BookingDocument> {
  constructor() {
    // Define the schema
    const schema = new Schema<BookingDocument>(
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        notes: { type: String },
        selectedServices: { type: [String] },
        appointmentId: { 
          type: String, 
          required: true,
          ref: 'AvailableAppointment'
        },
      },
      {
        timestamps: true, // Automatically add createdAt and updatedAt fields
      }
    );
    
    super('Booking', schema);
  }
  
  /**
   * Find multiple bookings with optional filtering and sorting
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
        const bookings = await query.lean();
        
        // Format results
        const formattedBookings = await Promise.all(
          bookings.map(async (booking: any) => {
            const result = this.formatDocument(booking);
            
            // Include related appointment if requested
            if (include.availableAppointment) {
              const AppointmentModel = mongoose.models.AvailableAppointment;
              if (AppointmentModel) {
                const appointment = await AppointmentModel.findById(booking.appointmentId).lean();
                if (appointment) {
                  result.availableAppointment = {
                    ...appointment,
                    id: appointment._id.toString(),
                  };
                } else {
                  result.availableAppointment = null;
                }
              }
            }
            
            return result;
          })
        );
        
        return formattedBookings;
      });
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
  
  /**
   * Find a single booking by ID
   */
  async findById(options: FindByIdOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { id, include = {} } = options;
        
        const booking = await this.model.findById(id).lean();
        
        if (!booking) return null;
        
        const result = this.formatDocument(booking);
        
        // Include related appointment if requested
        if (include.availableAppointment) {
          const AppointmentModel = mongoose.models.AvailableAppointment;
          if (AppointmentModel) {
            const appointment = await AppointmentModel.findById(booking.appointmentId).lean();
            if (appointment) {
              result.availableAppointment = {
                ...appointment,
                id: appointment._id.toString(),
              };
            } else {
              result.availableAppointment = null;
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
   * Create a new booking
   */
  async create(options: CreateOptions<BookingDocument>) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const booking = new this.model(options.data);
        await booking.save();
        
        return this.formatDocument(booking);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }
  
  /**
   * Update a booking
   */
  async update(options: UpdateOptions<BookingDocument>) {
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
        console.log(`Attempting to update booking with id: ${whereId}`);
        
        // Try to handle both object ID and string formats
        let bookingId;
        try {
          if (typeof whereId === 'string') {
            // Try to create a MongoDB ObjectId from the string ID
            try {
              bookingId = new mongoose.Types.ObjectId(whereId);
            } catch (convError) {
              console.log(`ID ${whereId} is not a valid ObjectId, using as-is`);
              bookingId = whereId; // Fallback to using as is
            }
          } else {
            bookingId = whereId;
          }
        } catch (err) {
          console.error(`Error converting ID: ${whereId}`, err);
          bookingId = whereId; // Fallback to using as is
        }
        
        // Try to find the booking first to confirm it exists
        const exists = await this.model.findById(bookingId).lean();
        if (!exists) {
          console.error(`Booking with ID ${whereId} not found before update`);
          throw new Error(`Booking not found: ${whereId}`);
        }
        
        // Perform the update with the properly formatted ID
        const updated = await this.model.findByIdAndUpdate(
          bookingId,
          { $set: { ...data, updatedAt: new Date() } },
          { new: true } // Return the updated document
        ).lean();
        
        if (!updated) {
          console.error(`Update failed for booking with ID ${whereId}`);
          throw new Error(`Update failed for booking: ${whereId}`);
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
      console.error(`Error in update for ID: ${options.id || (options.where?.id)}`, error);
      return this.handleError(error, 'update');
    }
  }
  
  /**
   * Delete a booking
   */
  async delete(options: DeleteOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        // Extract ID from options
        const whereId = options.where?.id || options.id;
        
        // Log the ID we're trying to delete
        console.log(`Attempting to delete booking with id: ${whereId}`);
        
        // Try to handle both object ID and string formats
        let bookingId;
        try {
          if (typeof whereId === 'string') {
            // Try to create a MongoDB ObjectId from the string ID
            try {
              bookingId = new mongoose.Types.ObjectId(whereId);
            } catch (convError) {
              console.log(`ID ${whereId} is not a valid ObjectId, using as-is`);
              bookingId = whereId; // Fallback to using as is
            }
          } else {
            bookingId = whereId;
          }
        } catch (err) {
          console.error(`Error converting ID: ${whereId}`, err);
          bookingId = whereId; // Fallback to using as is
        }
        
        // Try to find the booking first to confirm it exists
        const exists = await this.model.findById(bookingId).lean();
        if (!exists) {
          console.error(`Booking with ID ${whereId} not found before delete`);
          throw new Error(`Booking not found: ${whereId}`);
        }
        
        // Perform the delete with the properly formatted ID
        const booking = await this.model.findByIdAndDelete(bookingId).lean();
        
        if (!booking) {
          console.error(`Delete failed for booking with ID ${whereId}`);
          throw new Error(`Delete failed for booking: ${whereId}`);
        }
        
        return this.formatDocument(booking);
      });
    } catch (error) {
      console.error(`Error in delete for ID: ${options.id || (options.where?.id)}`, error);
      return this.handleError(error, 'delete');
    }
  }
  
  /**
   * Find a single booking by unique criteria
   */
  async findUnique(options: FindUniqueOptions) {
    try {
      await this.ensureConnection();
      
      return await DatabaseService.executeWithRetry(async () => {
        const { where, include = {} } = options;
        
        // Log the query for debugging
        console.log(`findUnique booking query:`, JSON.stringify(where, null, 2));
        
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
          const booking = await this.model.findById(query._id).lean();
          
          if (!booking) {
            console.log(`No booking found with _id: ${query._id}`);
            return null;
          }
          
          const result = this.formatDocument(booking);
          
          // Include related appointment if requested
          if (include.availableAppointment) {
            const AppointmentModel = mongoose.models.AvailableAppointment;
            if (AppointmentModel) {
              const appointment = await AppointmentModel.findById(booking.appointmentId).lean();
              if (appointment) {
                result.availableAppointment = {
                  ...appointment,
                  id: appointment._id.toString(),
                };
              } else {
                result.availableAppointment = null;
              }
            }
          }
          
          return result;
        } else {
          // Otherwise, use findOne with the query
          console.log(`Using findOne with query:`, JSON.stringify(query, null, 2));
          const booking = await this.model.findOne(query).lean();
          
          if (!booking) {
            console.log(`No booking found with query:`, JSON.stringify(query, null, 2));
            return null;
          }
          
          const result = this.formatDocument(booking);
          
          // Include related appointment if requested
          if (include.availableAppointment) {
            const AppointmentModel = mongoose.models.AvailableAppointment;
            if (AppointmentModel) {
              const appointment = await AppointmentModel.findById(booking.appointmentId).lean();
              if (appointment) {
                result.availableAppointment = {
                  ...appointment,
                  id: appointment._id.toString(),
                };
              } else {
                result.availableAppointment = null;
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
export const bookingModel = new BookingModel();

// Export the model
export default bookingModel; 