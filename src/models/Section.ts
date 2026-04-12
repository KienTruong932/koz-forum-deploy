import mongoose, { Schema } from 'mongoose';

const SectionSchema = new Schema({
  name: { type: String, required: true },
  display_order: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

export default mongoose.models.Section || mongoose.model('Section', SectionSchema);
