import mongoose, { Schema } from 'mongoose';
import { UserStatus, Gender, Role } from '@/lib/enums';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  display_name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
  avatar: { type: String },
  role: { type: String, enum: Object.values(Role), default: Role.MEMBER },
  gender: { type: String, enum: Object.values(Gender), default: Gender.OTHER},
  phonenumber: { type: String },
  bio: { type: String, default: '' },
  deleted_at: { type: Date },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

UserSchema.index({ username: 'text' });

export default mongoose.models.User || mongoose.model('User', UserSchema);
