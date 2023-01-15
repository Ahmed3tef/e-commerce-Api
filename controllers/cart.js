import asyncHandler from 'express-async-handler';
import { CartModel } from '../models/cart.js';
import { ProductModel } from '../models/product.js';
import ApiError from '../utils/ApiError.js';

const calcTotalPriceAndQuantity = cart => {
  let totalPrice = 0;
  let totalQuantity = 0;
  cart?.cartItems?.forEach(item => {
    totalPrice += item.price * item.quantity;
    totalQuantity += item.quantity;
  });
  cart.totalPrice = totalPrice;
  cart.totalQuantity = totalQuantity;
};
import { CouponModel } from '../models/coupon.js';

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

  calcTotalPriceAndQuantity(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'product added successfully',
    data: cart,
  });
});

export const getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError('Cart not found for this user', 404));
  res.status(200).json({ status: 'success', data: cart });
});

export const removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      // itemId not productId
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  calcTotalPriceAndQuantity(cart);
  await cart.save();
  res.status(200).json({ status: 'success', data: cart });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });

  res
    .status(200)
    .json({ status: 'success', message: 'cart deleted successfully' });
});

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = CartModel.findOne({ user: req.user._id });

  if (!cart) return next(new ApiError('no cart found for this user'), 404);

  const itemIndex = cart.cartItems.findIndex(
    item => item._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError('there is no item for this id', 404));
  }

  calcTotalPriceAndQuantity(cart);
  await cart.save();

  res.status(200).json({ status: 'success', data: cart });
});

export const applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) get coupon based on coupon name
  const coupon = CouponModel.findOne({
    name: req.body.coupon,
    expiryDate: { $gt: Date.now() },
  });

  if (!coupon) return next(new ApiError('Coupon is invalid or expired.', 404));

  // 2) get cart based on user ID

  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError('no cart found for this user'), 404);

  const totalPrice = cart.totalPrice;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      totalPriceAfterDiscount,
      discountValue: coupon.discount,
    },
  });
});
