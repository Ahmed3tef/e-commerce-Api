import { Router } from 'express';

import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from '../controllers/coupon.js';
import {
  createCouponValidation,
  deleteCouponValidation,
  getCouponValidation,
  updateCouponValidation,
} from '../utils/validations/coupon.js';

const router = Router();

router.use(tokenProtection, accessAllowedTo('admin', 'manager'));

router.get('/', getAllCoupons);

router
  .route('/one/:id')
  .get(getCouponValidation, getCoupon)
  .patch(updateCouponValidation, updateCoupon)
  .delete(deleteCouponValidation, deleteCoupon);

router.post('/create', createCouponValidation, createCoupon);

export default router;
