import { Router } from 'express';

import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from '../controllers/review.js';

import {
  createReviewValidation,
  deleteReviewValidation,
  getReviewValidation,
  updateReviewValidation,
} from '../utils/validations/review.js';

const router = Router();

router.get('/', getReviews);

router.use(tokenProtection);

router
  .route('/one/:id')
  .get(getReviewValidation, getReview)
  .patch(accessAllowedTo('user'), updateReviewValidation, updateReview)
  .delete(
    accessAllowedTo('admin', 'user'),
    deleteReviewValidation,
    deleteReview
  );

router.post(
  '/create',
  accessAllowedTo('user'),
  createReviewValidation,
  createReview
);

export default router;
