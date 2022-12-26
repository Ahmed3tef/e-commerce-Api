import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/category.js';

import {
  createCategoryValidation,
  deleteCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation,
} from '../utils/validations/category.js';

const router = Router();

router.get('/', getCategories);

router
  .route('/one/:id')
  .get(getCategoryValidation, getCategory)
  .patch(updateCategoryValidation, updateCategory)
  .delete(deleteCategoryValidation, deleteCategory);

router.post('/create', createCategoryValidation, createCategory);

export default router;
