import mongoose, { Document, Schema } from 'mongoose';

interface IProductCategory extends Document {
  categoryId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema: Schema<IProductCategory> = new Schema({
  categoryId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema,'ProductCategory');
