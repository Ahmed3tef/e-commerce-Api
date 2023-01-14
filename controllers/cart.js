import asyncHandler from 'express-async-handler';
import { CartModel } from '../models/cart.js';
import { ProductModel } from '../models/product.js';

export const addToCart = asyncHandler(async (req, res, next) => {
  // 1- if cart is empty, create cart
  const { productId, variant } = req.body;
  let cart = await CartModel.findOne({ user: req.user._id });
  const product = await ProductModel.findById(productId);
  if (!cart) {
    cart = await CartModel.create({
      cartItems: [
        {
          product: productId,
          variant,
          price: product?.price,
        },
      ],
      user: req.user._id,
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      item => item.product.toString() === productId && variant === item.variant
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        variant,
        price: product.price,
      });
    }
  }

  let totalPrice = 0;
  let totalQuantity = 0;
  cart.cartItems.forEach(item => {
    totalPrice += item.price * item.quantity;
    totalQuantity += item.quantity;
  });
  cart.totalPrice = totalPrice;
  cart.totalQuantity = totalQuantity;
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'product added successfully',
    data: cart,
  });
});
