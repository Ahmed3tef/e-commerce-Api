import { Router } from 'express';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';
import { createCashOrder } from '../controllers/order.js';

const router = Router();

// must be valid logged in user and only user can access this route
router.use(tokenProtection, accessAllowedTo('user'));

router.route('/:cartId').post(createCashOrder);

export default router;
