import mongoose, { Schema } from 'mongoose';

const LikeSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

LikeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model('Like', LikeSchema);
