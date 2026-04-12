import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String },
  display_order: { type: Number, default: 0 },
  section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
