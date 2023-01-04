import { Schema, model } from 'mongoose';
import { renameImage } from '../utils/renameRequestImages.js';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'brand must have a name'],
      unique: [true, 'brand name must be unique'],
      minlength: [3, 'Too short name'],
      maxlength: [32, 'Too long name'],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

renameImage(brandSchema);

export const BrandModel = model('Brand', brandSchema);
