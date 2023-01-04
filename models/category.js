import { Schema, model } from 'mongoose';
import { renameImage } from '../utils/renameRequestImages.js';

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

// // add url link to our images when getting them from database
// // init doesn't work with create req
// const setImageUrl = doc => {
//   if (doc.image) {
//     const imageUrl = `${process.env.BASE_URL}/${doc.image}`;
//     doc.image = imageUrl;
//   }
// };
// categorySchema.post('init', doc => {
//   setImageUrl(doc);
// });

// categorySchema.post('save', doc => {
//   setImageUrl(doc);
// });
renameImage(categorySchema);

// 2- create model by passing the schema to a key named for one doc in collection

export const CategoryModel = model('Category', categorySchema);
