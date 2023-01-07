import { Router } from 'express';

import {
  createUser,
  createUserImage,
  deleteUser,
  getUser,
  getUsers,
  resizeUserImage,
  updateUser,
  updateUserPassword,
} from '../controllers/user.js';

import {
  createUserValidation,
  // deleteUserValidation,
  getUserValidation,
  updateUserValidation,
  updateUserPasswordValidation,
} from '../utils/validations/user.js';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

const router = Router();

// الجزء المتعلق بالمستخدمين ف الغالب بيظهر بس للادمن

router.get('/', tokenProtection, accessAllowedTo('admin', 'manager'), getUsers);

router.patch(
  '/changePassword/:id',
  tokenProtection,
  accessAllowedTo('admin', 'manager'),
  updateUserPasswordValidation,
  updateUserPassword
);

router
  .route('/one/:id')
  .get(tokenProtection, accessAllowedTo('admin'), getUserValidation, getUser)
  .patch(
    tokenProtection,
    accessAllowedTo('admin'),
    createUserImage,
    resizeUserImage,
    updateUserValidation,
    updateUser
  )
  .delete(tokenProtection, accessAllowedTo('admin'), deleteUser);

router.post(
  '/create',
  tokenProtection,
  accessAllowedTo('admin'),
  createUserImage,
  createUserValidation,
  resizeUserImage,
  createUser
);

export default router;
