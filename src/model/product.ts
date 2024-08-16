import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  adminId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount?: mongoose.Schema.Types.ObjectId;
  discountedPrice?: number;
  blocked: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema = new Schema<IProduct>({
  productId: { type: String, required: true, unique: true },
  adminId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  discount: { type: mongoose.Schema.Types.ObjectId, ref: 'adminDiscount' },
  discountedPrice: { type: Number },
  blocked: { type: Boolean, default: false },
  category: { type: String, ref: 'ProductCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model<Document>(
  'Product',
  ProductSchema,
  'Product',
);
