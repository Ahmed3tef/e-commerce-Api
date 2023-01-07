import { Router } from 'express';

import { signup, login, forgotPassword } from '../controllers/auth.js';
import {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
} from '../utils/validations/auth.js';

const router = Router();

router.post('/signup', signupValidation, signup);

router.post('/login', loginValidation, login);

router.post('/forgotPassword', forgotPasswordValidation, forgotPassword);

export default router;
