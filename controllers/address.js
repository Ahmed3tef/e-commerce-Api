import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.js';

export const addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet => add address to addresses only if address does not exist.
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'address successfully added to your addresses.',
    data: user.addresses,
  });
});

export const removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => add address to addresses only if address does not exist.
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'address successfully removed from your addresses.',
    data: user.addresses,
  });
});

export const getUserAddresses = asyncHandler(async (req, res, next) => {
  // $pull => add address to addresses only if address does not exist.
  const user = await UserModel.findById(req.user._id).populate('addresses');

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: user.addresses,
  });
});
