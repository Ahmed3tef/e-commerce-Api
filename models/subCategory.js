import { Schema, model } from 'mongoose';

// 1- create schema
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'category must have a name'],
      unique: [true, 'Category name must be unique'],
      minlength: [3, 'Too short name'],
      maxlength: [32, 'Too long name'],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Category',
      required: [true, 'category id is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const SubCategoryModel = model('SubCategory', subCategorySchema);
