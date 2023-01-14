import { Router } from 'express';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';
import { addToCart,applyCoupon,updateCartItemQuantity } from '../controllers/cart.js';

const router = Router();

// must be valid logged in user and only user can access this route
router.use(tokenProtection, accessAllowedTo('user'));

router.route('/').post(addToCart);
// .get(getUserWishlist)

// router.delete(
//   '/:productId',
//   productWishlistValidation,
//   removeProductFromWishlist
// );
router.patch('/applyCoupon', applyCoupon);
router.patch('/:itemId', updateCartItemQuantity);
export default router;
