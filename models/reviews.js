import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      minlength: [10, 'Too short name'],
      maxlength: [200, 'Too long name'],
    },
    title: {
      type: String,
      maxlength: [60, 'Too long name'],
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating'],
      min: [0, 'min rating value is 0.0'],
      max: [5, 'max rating value is 5.0'],
      default: 0,
    },
    user: {
      type: Schema.ObjectId,
      required: [true, 'user Id is required'],
      ref: 'User',
    },
    product: {
      type: Schema.ObjectId,
      required: [true, 'user Id is required'],
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel = model('Review', reviewSchema);
