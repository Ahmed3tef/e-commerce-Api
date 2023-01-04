import { Schema, model } from 'mongoose';
import { renameImage } from '../utils/renameRequestImages.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'user must have a name'],
      minlength: [3, 'Too short name'],
      maxlength: [32, 'Too long name'],
    },
    image: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'user must have a valid email address'],
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'user must have a valid phone number'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required.'],
      minlength: [6, 'Too short password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

renameImage(userSchema);

export const UserModel = model('User', userSchema);
