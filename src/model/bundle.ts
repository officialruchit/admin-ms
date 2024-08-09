import mongoose, { Document, Schema } from 'mongoose';

interface IBundleProduct extends Document {
  bundleId: string;
  adminId: string;
  name: string;
  description: string;
  products: mongoose.Types.ObjectId[];
  discount: number;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BundleProductSchema: Schema<IBundleProduct> = new Schema({
  bundleId: { type: String, required: true, unique: true },
  adminId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  discount: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BundleProduct = mongoose.model<Document>(
  'BundleProduct',
  BundleProductSchema,
  'BundleProduct',
);
export { BundleProduct, IBundleProduct };
