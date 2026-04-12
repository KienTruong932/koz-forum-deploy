import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  thread_id: { type: Schema.Types.ObjectId, ref: 'Thread', required: true },
  author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

PostSchema.index({ content: 'text' });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
