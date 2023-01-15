import { Router } from 'express';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';
import {
  addToCart,
  clearCart,
  getUserCart,
  removeCartItem,
  applyCoupon,
  updateCartItemQuantity,
} from '../controllers/cart.js';

const router = Router();

// must be valid logged in user and only user can access this route
router.use(tokenProtection, accessAllowedTo('user'));

router.route('/').post(addToCart).get(getUserCart).delete(clearCart);

router.patch('/applyCoupon', applyCoupon);

router.route('/:itemId').delete(removeCartItem).patch(updateCartItemQuantity);

export default router;
