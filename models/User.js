import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['superAdmin', 'admin'],
    default: 'admin',
  },
});

// Check if the model is already defined to avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
