import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { CartModel } from '../models/cart.js';
import { OrderModel } from '../models/order.js';
import { ProductModel } from '../models/product.js';
import { getAllHandler, getOneHandler } from './crud-handlers.js';
import Stripe from 'stripe';

export const calcOrderPrice = async cartId => {
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1)
  const cart = await CartModel.findById(cartId);
  if (!cart) return next(new ApiError('Cart not found', 404));

  // 2)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  return { cart, totalOrderPrice };
};

export const createCashOrder = asyncHandler(async (req, res, next) => {
  // 1) get cart depend on cartId (from params)
  // 2) get order price depend on cart price (check if coupon applied)
  // 3) create cash order (default)
  // 4) after create order, get sold products to decrement its quantity and increment its sold quantity
  // 5) clear cart depend on cartId

  // 1), 2)
  const { cartId } = req.query;

  const { cart, totalOrderPrice } = await calcOrderPrice(cartId);

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

// filter orders to get user's orders if role = 'user'

export const filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id };
  next();
});

// get all orders

export const getAllOrders = getAllHandler(OrderModel, 'Orders');

// get one order
export const getOneOrder = getOneHandler(OrderModel, 'Order');

// allowed only to admin and manager
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) return next(new ApiError('No order found', 404));

  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(201).json({
    status: 'success',
    data: updatedOrder,
  });
});

// allowed only to admin and manager
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) return next(new ApiError('No order found', 404));

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  res.status(201).json({
    status: 'success',
    data: updatedOrder,
  });
});

export const payWithCard = asyncHandler(async (req, res, next) => {
  // 1) get cart depend on cartId (from params)
  // 2) get order price depend on cart price (check if coupon applied)
  // 3) connect to stripe with session.

  // 1, 2)
  const { cartId } = req.query;
  const { cart, totalOrderPrice } = await calcOrderPrice(cartId);

  // 3)

  const session = await Stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell

        name: req.user.name,
        quantity: 1,
        amount: totalOrderPrice,
        currency: 'egp',
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}//${req.get('host')}/orders`,
    cancel_url: `${req.protocol}//${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ status: 'success', session });
});
