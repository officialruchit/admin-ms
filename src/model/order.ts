import mongoose, { Schema, Document } from 'mongoose';
import { IOrderItem } from './orderItem';

export interface IAddress extends Document {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  totalAmount: number;
  paymentMethod:
    | 'credit_card'
    | 'paypal'
    | 'bank_transfer'
    | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'pending' | 'processed' | 'shipped' | 'delivered' | 'cancelled';
  address: IAddress;
  paymentIntentId?: string; // Payment gateway ID
  createdAt: Date;
  updatedAt: Date;
}

// Address Schema
const AddressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
});

// Order Schema
const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  address: { type: AddressSchema, required: true },
  paymentIntentId: { type: String }, // To store payment intent ID for payment tracking
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Order model
export const Order = mongoose.model<IOrder>('Order', OrderSchema);
