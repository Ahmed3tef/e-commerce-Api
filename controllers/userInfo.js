import {
  refactorAndSaveImage,
  uploadSingleImage,
} from '../middlewares/uploadImages.js';

import { UserModel } from '../models/user.js';
import ApiError from '../utils/ApiError.js';

import { getOneHandler } from './crud-handlres.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// upload single image
export const createUserImage = uploadSingleImage('image');

// image processing
export const resizeUserImage = refactorAndSaveImage('users');

// get one User
export const setParamsId = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// update User

export const updateUserData = asyncHandler(async (req, res, next) => {
  const id = req.user._id;

  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.body.image,
    },
    {
      new: true,
    }
  );
  if (!user) return next(new ApiError(`User not found.`, 404));

  res.status(200).json({ data: user });
});

export const updateUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

export const deactivateUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});
