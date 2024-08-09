import mongoose, { Document, Schema } from 'mongoose';
export interface IDiscount extends Document {
  discountId: string;
  adminId: string;
  percentage: number;
  description?: string;
  validFrom: Date;
  validTo: Date;
  createAt: Date;
  updateAt: Date;
}

const DiscountSchema: Schema<IDiscount> = new Schema({
  discountId: { type: String, required: true, unique: true },
  adminId: { type: String, required: true },
  percentage: { type: Number, required: true },
  description: { type: String },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export const discount = mongoose.model(
  'adminDiscount',
  DiscountSchema,
  'adminDiscount',
);
