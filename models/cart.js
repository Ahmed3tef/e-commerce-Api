import { Schema, model } from 'mongoose';

const cartSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
    },

    cartItems: [
      {
        product: {
          type: Schema.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        variant: String,
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    totalQuantity: Number,
  },
  {
    timestamps: true,
  }
);

export const CartModel = model('Cart', cartSchema);
