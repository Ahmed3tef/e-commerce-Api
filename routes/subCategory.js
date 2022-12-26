import { Router } from 'express';

import {
  createSubCategory,
  deleteSubCategory,
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

const router = Router();

router.get('/', getSubCategories);

router
  .route('/one/:id')
  .get(getSubCategoryValidation, getSubCategory)
  .patch(updateSubCategoryValidation, updateSubCategory)
  .delete(deleteSubCategoryValidation, deleteSubCategory);

router.post('/create', createSubCategoryValidation, createSubCategory);

export default router;
