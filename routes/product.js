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

router.get('/', getProducts);

router.get('/:ProductId/reviews', reviewRoutes);

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
