import mongoose from 'mongoose';

const PlatformUserReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  totalUsers: { type: Number, required: true },
  totalSellers: { type: Number, required: true },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
});

export default mongoose.model(
  'PlatformUserReportSchema',
  PlatformUserReportSchema,
  'PlatformUserReportSchema',
);
