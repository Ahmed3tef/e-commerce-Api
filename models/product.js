import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      unique: [true, 'Product name must be unique'],
      minlength: [3, 'Too short name'],
      // maxlength: [50, 'Too long name'],
    },

    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Product description must be at least 20 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
      max: [100000, 'Too long product price'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    discountPrice: Number,
    mainImage: {
      type: String,
      required: [true, 'Product must have at least one image.'],
    },
    images: [String],
    colors: [String],
    category: {
      type: Schema.ObjectId,
      required: [true, 'category Id is required'],
      ref: 'Category',
    },
    subcategory: {
      type: Schema.ObjectId,
      required: [true, 'subcategory Id is required'],
      ref: 'SubCategory',
    },
    brand: {
      type: Schema.ObjectId,
      ref: 'Brand',
    },
    avgRating: {
      type: Number,
      default: 0,
      max: [5, 'rating must be 5 or below'],
      min: [0, 'rating must be less than or equal to 0'],
    },
    ratings: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

export const ProductModel = model('Product', productSchema);
