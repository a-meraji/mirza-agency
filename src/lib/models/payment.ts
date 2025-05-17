import mongoose, { Document, Schema } from 'mongoose';
import { BaseModel, QueryOptions, FindByIdOptions, CreateOptions, UpdateOptions, DeleteOptions } from './base';
import { DatabaseService } from '../services/database';
import { UserDocument } from './user';

// Payment document interface
export interface PaymentDocument extends Document {
  user: mongoose.Types.ObjectId | string | UserDocument;
  amount: number;
  currency: 'dollar' | 'rial';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment model class
 */
export class PaymentModel extends BaseModel<PaymentDocument> {
  constructor() {
    const schema = new Schema<PaymentDocument>(
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        amount: { type: Number, required: true },
        currency: { type: String, enum: ['dollar', 'rial'], required: true, default: 'dollar' },
      },
      {
        timestamps: true,
        collection: 'Payment',
      }
    );
    super('Payment', schema);
  }

  /**
   * Find payments for a specific user
   */
  async findByUserId(userId: string, options: Omit<QueryOptions, 'where'> = {}) {
    const queryOptions = {
      ...options,
      where: { user: userId }
    };
    return this.findMany(queryOptions);
  }

  /**
   * Find a single payment by ID
   */
  async findById(options: FindByIdOptions) {
    try {
      await this.ensureConnection();
      return await DatabaseService.executeWithRetry(async () => {
        const { id, include = {} } = options;
        let query = this.model.findById(id);
        if (include.user) query = query.populate('user');
        const payment = await query.lean();
        if (!payment) return null;
        return this.formatDocument(payment);
      });
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }

  /**
   * Create a new payment (admin only)
   */
  async create(options: CreateOptions<PaymentDocument>) {
    // Admin check should be enforced in controller/service
    try {
      await this.ensureConnection();
      return await DatabaseService.executeWithRetry(async () => {
        const payment = new this.model(options.data);
        await payment.save();
        return this.formatDocument(payment);
      });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }

  /**
   * Update a payment (admin only)
   */
  async update(options: UpdateOptions<PaymentDocument>) {
    // Admin check should be enforced in controller/service
    try {
      await this.ensureConnection();
      return await DatabaseService.executeWithRetry(async () => {
        const { id, data } = options;
        const updated = await this.model.findByIdAndUpdate(
          id,
          { $set: { ...data, updatedAt: new Date() } },
          { new: true }
        ).lean();
        if (!updated) throw new Error('Payment not found');
        return this.formatDocument(updated);
      });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }
}

// Singleton instance
export const paymentModel = new PaymentModel();
export default paymentModel; 