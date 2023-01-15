import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { CartModel } from '../models/cart.js';
import { OrderModel } from '../models/order.js';
import { ProductModel } from '../models/product.js';

export const createCashOrder = asyncHandler(async (req, res, next) => {
  // 1) get cart depend on cartId (from params)
  // 2) get order price depend on cart price (check if coupon applied)
  // 3) create cash order (default)
  // 4) after create order, get sold products to decrement its quantity and increment its sold quantity
  // 5) clear cart depend on cartId

  const taxPrice = 0;
  const shippingPrice = 0;

  // 1)
  const { cartId } = req.params;
  const cart = await CartModel.findById(cartId);
  if (!cart) return next(new ApiError('Cart not found', 404));

  // 2)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3)
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4)
  if (order) {
    const bulkOptions = cart.cartItems.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { sold: +item.quantity, quantity: -item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOptions);

    // 5)
    await CartModel.findByIdAndDelete(cartId);
  }

  res.status(201).json({
    status: 'success',
    data: order,
  });
});