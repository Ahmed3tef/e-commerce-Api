import { Router } from 'express';

import {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} from '../utils/validations/product.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/product.js';

const router = Router();

router.get('/', getProducts);

router
  .route('/one/:id')
  .get(getProductValidator, getProduct)
  .patch(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

router.post('/create', createProductValidator, createProduct);

export default router;
