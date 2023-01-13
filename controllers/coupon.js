import { CouponModel } from '../models/coupon.js';
import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlers.js';

// get all brends
export const getAllCoupons = getAllHandler(CouponModel);

// get one Coupon
export const getCoupon = getOneHandler(CouponModel, 'Coupon');

// create Coupon
export const createCoupon = createHandler(CouponModel);

// update Coupon

export const updateCoupon = updateHandler(CouponModel, 'Coupon');

// update Coupon

export const deleteCoupon = deleteHandler(CouponModel, 'Coupon');
