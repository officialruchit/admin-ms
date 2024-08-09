import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
  productId: string;
  adminId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount: number;
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
  discount: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false },
  category: { type: String, ref: 'ProductCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model<Document>('Product', ProductSchema, 'Product');
export default Product;
