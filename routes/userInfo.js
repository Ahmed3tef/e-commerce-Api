import { Router } from 'express';

import {
  createUserImage,
  deactivateUser,
  resizeUserImage,
  setParamsId,
  updateUserPassword,
} from '../controllers/userInfo.js';

import {
  updateUserDataValidation,
  updateUserPasswordValidation,
} from '../utils/validations/userInfo.js';
import { tokenProtection } from '../controllers/auth.js';
import { updateUserData } from '../controllers/userInfo.js';
import { getUser } from '../controllers/user.js';

const router = Router();

// gate middleware to access the ones after it بدل ما اكتبهم ف كل واحدة فيهم
// token is required in headers to access the routes
router.use(tokenProtection);

router.patch(
  '/changePassword',
  updateUserPasswordValidation,
  updateUserPassword
);

router
  .route('/')
  .get(setParamsId, getUser)
  .delete(deactivateUser)
  .patch(
    createUserImage,
    resizeUserImage,
    updateUserDataValidation,
    updateUserData
  );

export default router;
