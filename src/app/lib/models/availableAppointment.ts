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
        
        const updated = await this.model.findByIdAndUpdate(
          id,
          { $set: { ...data, updatedAt: new Date() } },
          { new: true } // Return the updated document
        ).lean();
        
        if (!updated) {
          throw new Error('Appointment not found');
        }
        
        return this.formatDocument(updated);
      });
    } catch (error) {
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
}

// Create a singleton instance
export const availableAppointmentModel = new AvailableAppointmentModel();

// Export the model
export default availableAppointmentModel; 