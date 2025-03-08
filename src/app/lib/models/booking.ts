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
        
        const updated = await this.model.findByIdAndUpdate(
          id,
          { $set: { ...data, updatedAt: new Date() } },
          { new: true } // Return the updated document
        ).lean();
        
        if (!updated) {
          throw new Error('Booking not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
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
        const { id } = options;
        
        const booking = await this.model.findByIdAndDelete(id).lean();
        
        if (!booking) {
          throw new Error('Booking not found');
        }
        
        return this.formatDocument(booking);
      });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }
}

// Create a singleton instance
export const bookingModel = new BookingModel();

// Export the model
export default bookingModel; 