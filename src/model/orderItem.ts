import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem extends Document {
  itemType: 'Product' | 'Bundle';
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // The price at the time of the order
}

// Order Item Schema
const OrderItemSchema = new Schema<IOrderItem>({
  itemType: {
    type: String,
    required: true,
    enum: ['Product', 'Bundle'],
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType', // Dynamic reference to Product or Bundle collection
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Create and export the OrderItem model
export const OrderItem = mongoose.model<IOrderItem>(
  'OrderItem',
  OrderItemSchema,
  'OrderItem',
);
