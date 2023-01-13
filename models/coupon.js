import { Schema, model } from 'mongoose';

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'coupon must have a name'],
      unique: [true, 'coupon name must be unique'],
      minlength: [3, 'Too short name'],
      maxlength: [15, 'Too long name'],
    },

    expiryDate: {
      type: Date,
      required: [true, 'coupon must have an expiryDate'],
    },
    quantity: {
      type: Number,
      required: [true, 'coupon must have a quantity'],
      default: 10,
    },
    discount: {
      type: Number,
      required: [true, 'coupon must have a discount'],
    },
  },
  {
    timestamps: true,
  }
);

export const CouponModel = model('Coupon', couponSchema);
