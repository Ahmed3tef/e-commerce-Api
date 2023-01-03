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

const router = Router();

router.get('/', getProducts);

router
  .route('/one/:id')
  .get(getProductValidator, getProduct)
  .patch(
    createProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

router.post(
  '/create',
  createProductImage,
  resizeProductImage,
  createProductValidator,
  createProduct
);

export default router;
