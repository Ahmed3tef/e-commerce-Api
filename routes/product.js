import { Router } from 'express';

import {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} from '../utils/validations/product.js';
import {
  createProduct,
  createProductImage,
  deleteProduct,
  getProduct,
  getProducts,
  resizeProductImage,
  updateProduct,
} from '../controllers/product.js';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

import reviewRoutes from './review.js';

const router = Router();

// POST /products/1L2J3NK1J2N3KJ12/reviews
// GET /products/1L2J3NK1J2N3KJ12/reviews
// GET /products/1L2J3NK1J2N3KJ12/reviews/2j3n4kj2n3k4j
router.use('/:productId/reviews', reviewRoutes);

router.get('/', getProducts);

router
  .route('/one/:id')
  .get(getProductValidator, getProduct)
  .patch(
    tokenProtection,
    accessAllowedTo('admin', 'manager'),
    createProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    tokenProtection,
    accessAllowedTo('admin'),
    deleteProductValidator,
    deleteProduct
  );

router.post(
  '/create',
  tokenProtection,
  accessAllowedTo('admin', 'manager'),
  createProductImage,
  resizeProductImage,
  createProductValidator,
  createProduct
);

export default router;
