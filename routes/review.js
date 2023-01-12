import { Router } from 'express';

import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
  setProductIdAndUserId,
  createFilterObjForNested,
} from '../controllers/review.js';

import {
  createReviewValidation,
  deleteReviewValidation,
  getReviewValidation,
  updateReviewValidation,
} from '../utils/validations/review.js';

const router = Router({ mergeParams: true });
// الحاجات اللي جاية علي النستد راوت من  البرودكت هتعدي ف المين راوت بتاع ال getall ف هنحط قبله ميدلوير عشان نشوف لو في productId ولا لا

router.get('/', createFilterObjForNested, getReviews);

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
  setProductIdAndUserId,
  createReviewValidation,
  createReview
);

export default router;
