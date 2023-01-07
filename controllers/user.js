import {
  refactorAndSaveImage,
  uploadSingleImage,
} from '../middlewares/uploadImages.js';
import { UserModel } from '../models/user.js';
import ApiError from '../utils/ApiError.js';

import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlres.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
// upload single image
export const createUserImage = uploadSingleImage('image');

// image processing
export const resizeUserImage = refactorAndSaveImage('users');

// get all brends
export const getUsers = getAllHandler(UserModel);

// get one User
export const getUser = getOneHandler(UserModel, 'User');

// create User
export const createUser = createHandler(UserModel);

// update User

export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.body.image,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!user) return next(new ApiError(`User not found.`, 404));

  res.status(200).json({ data: user });
});

export const updateUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) return next(new ApiError(`User not found.`, 404));

  res.status(200).json({ data: user });
});
// delete User (delete user is to make him inactive not ot delete him.)

export const deleteUser = deleteHandler(UserModel, 'User');
