import mongoose, { Document, Schema } from 'mongoose';

interface IProductCategory extends Document {
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema: Schema<IProductCategory> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProductCategory>(
  'ProductCategory',
  ProductCategorySchema,
  'ProductCategory',
);
