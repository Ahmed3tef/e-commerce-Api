import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.js';

export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet => add product to wishlist only if product does not exist.
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Product successfully added to your wishlist.',
    data: user.wishlist,
  });
});

export const removeProductFromWishlist = asyncHandler(
  async (req, res, next) => {
    // $pull => add product to wishlist only if product does not exist.
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Product successfully removed to your wishlist.',
      data: user.wishlist,
    });
  }
);

export const getUserWishlist = asyncHandler(async (req, res, next) => {
  // $pull => add product to wishlist only if product does not exist.
  const user = await UserModel.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
