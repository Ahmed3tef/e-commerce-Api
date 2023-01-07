import { Router } from 'express';

import {
  createSubCategory,
  deleteSubCategory,
  getCategorySubCategories,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
} from '../controllers/subCategory.js';
import {
  createSubCategoryValidation,
  deleteSubCategoryValidation,
  getSubCategoryValidation,
  updateSubCategoryValidation,
} from '../utils/validations/subCategory.js';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

const router = Router();

router.get('/', getSubCategories);

router.get('/fromCategory', getCategorySubCategories);

router
  .route('/one/:id')
  .get(getSubCategoryValidation, getSubCategory)
  .patch(
    tokenProtection,
    accessAllowedTo('admin', 'manager'),
    updateSubCategoryValidation,
    updateSubCategory
  )
  .delete(
    tokenProtection,
    accessAllowedTo('admin'),
    deleteSubCategoryValidation,
    deleteSubCategory
  );

router.post(
  '/create',
  tokenProtection,
  accessAllowedTo('admin', 'manager'),
  createSubCategoryValidation,
  createSubCategory
);

export default router;
