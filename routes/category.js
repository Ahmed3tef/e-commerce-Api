import { Router } from 'express';
import {
  createCategory,
  createCategoryImage,
  deleteCategory,
  getCategories,
  getCategory,
  resizeCategoryImage,
  updateCategory,
} from '../controllers/category.js';

import {
  createCategoryValidation,
  deleteCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation,
} from '../utils/validations/category.js';

import subCategoryRoutes from './subCategory.js';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

const router = Router();

router.use('/:categoryId/subcategories', subCategoryRoutes);

router.get('/', getCategories);

router
  .route('/one/:id')
  .get(getCategoryValidation, getCategory)
  .patch(
    tokenProtection,
    accessAllowedTo('admin', 'manager'),
    createCategoryImage,
    resizeCategoryImage,
    updateCategoryValidation,
    updateCategory
  )
  .delete(
    tokenProtection,
    accessAllowedTo('admin'), // only admin can delete
    deleteCategoryValidation,
    deleteCategory
  );

router.post(
  '/create',
  tokenProtection,
  accessAllowedTo('admin', 'manager'),
  createCategoryImage,
  resizeCategoryImage,
  createCategoryValidation,
  createCategory
);

export default router;
