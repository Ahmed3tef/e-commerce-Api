import { Router } from 'express';

import {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from '../controllers/auth.js';
import {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyCodeValidation,
  resetPasswordValidation,
} from '../utils/validations/auth.js';

const router = Router();

router.post('/signup', signupValidation, signup);

router.post('/login', loginValidation, login);

router.post('/forgotPassword', forgotPasswordValidation, forgotPassword);

router.post('/verifyResetCode', verifyCodeValidation, verifyResetCode);

router.patch('/resetPassword', resetPasswordValidation, resetPassword);

export default router;
