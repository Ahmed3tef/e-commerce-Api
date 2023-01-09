import { Router } from 'express';

import {
  createBrandValidation,
  deleteBrandValidation,
  getBrandValidation,
  updateBrandValidation,
} from '../utils/validations/brand.js';

import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from '../controllers/review.js';

const router = Router();

router.get('/', getReviews);

router.use(tokenProtection);

router
  .route('/one/:id')
  .get(getReview)
  .patch(accessAllowedTo('user'), updateReview)
  .delete(accessAllowedTo('admin'), deleteReview);

router.post('/create', accessAllowedTo('user'), createReview);

export default router;
