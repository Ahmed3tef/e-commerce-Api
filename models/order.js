import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
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
    taxPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: Number,
    shippingPrice: {
      type: Number,
      default: 20,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card'],
      default: 'cash',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
    },
  },
  {
    timestamps: true,
  }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name image phone email' }).populate({
    path: 'cartItems.product',
    select: 'name description price avgRating',
  });
});

export const OrderModel = model('Order', orderSchema);
