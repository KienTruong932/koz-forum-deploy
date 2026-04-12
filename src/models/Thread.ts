import mongoose, { Schema } from 'mongoose';
import { ThreadStatus } from '@/lib/enums';

const ThreadSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  author_id: { type: Schema.Types.ObjectId, ref: 'User' },
  view_count: { type: Number, default: 0 },
  status: { type: String, enum: Object.values(ThreadStatus), default: ThreadStatus.ACTIVE },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

ThreadSchema.index({ title: 'text' });

export default mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);
