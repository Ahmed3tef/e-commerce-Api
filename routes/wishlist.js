import { Router } from 'express';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';
import {
  addProductToWishlist,
  getUserWishlist,
  removeProductFromWishlist,
} from '../controllers/wishlist.js';
import { productWishlistValidation } from '../utils/validations/wishlist.js';

const router = Router();

// must be valid logged in user and only user can access this route
router.use(tokenProtection, accessAllowedTo('user'));

router
  .route('/')
  .get(getUserWishlist)
  .post(productWishlistValidation, addProductToWishlist);

router.delete(
  '/:productId',
  productWishlistValidation,
  removeProductFromWishlist
);

export default router;
