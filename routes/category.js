import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/category.js';

const router = Router();

router.get('/', getCategories);
router
  .route('/one/:id')
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);
router.post('/create', createCategory);

export default router;
