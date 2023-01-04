import {
  refactorAndSaveImage,
  uploadSingleImage,
} from '../middlewares/uploadImages.js';
import { UserModel } from '../models/user.js';

import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlres.js';

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

export const updateUser = updateHandler(UserModel, 'User');

// delete User (delete user is to make him inactive not ot delete him.)

export const deleteUser = deleteHandler(UserModel, 'User');
