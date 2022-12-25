import mongoose, { Schema, model } from 'mongoose';

// 1- create schema
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'category must have a name'],
      unique: [true, 'Category name must be unique'],
      minlength: [3, 'Too short name'],
      maxlength: [32, 'Too long name'],
    },
    // slug => cat name = A and B so slug will be a-and-b for the url (shopping.com/a-and-b)
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

// 2- create model by passing the schema to a key named for one doc in collection

export const CategoryModel = model('Category', categorySchema);
