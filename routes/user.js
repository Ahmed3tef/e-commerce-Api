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

// gate middleware to access the ones after it بدل ما اكتبهم ف كل واحدة فيهم
router.use(tokenProtection, accessAllowedTo('admin'));

router
  .route('/one/:id')
  .get(tokenProtection, accessAllowedTo('admin'), getUserValidation, getUser)
  .patch(createUserImage, resizeUserImage, updateUserValidation, updateUser)
  .delete(deleteUser);

router.post(
  '/create',
  createUserImage,
  createUserValidation,
  resizeUserImage,
  createUser
);

export default router;
