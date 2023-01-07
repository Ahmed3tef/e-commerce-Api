import { Router } from 'express';

import { signup, login } from '../controllers/auth.js';
import {
  signupValidation,
  loginValidation,
} from '../utils/validations/auth.js';

const router = Router();

router.post('/signup', signupValidation, signup);

router.post('/login', loginValidation, login);

export default router;
