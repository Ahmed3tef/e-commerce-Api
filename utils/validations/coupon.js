import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';
import { UserModel } from '../../models/user.js';
import { CouponModel } from '../../models/coupon.js';

export const createCouponValidation = [
  check('name')
    .notEmpty()
    .withMessage('Coupon alias is required.')
    .isLength({ min: 2 })
    .withMessage('alias is too short')
    .isLength({ max: 40 })
    .withMessage('alias is too long.')
    .custom(async (val, { req }) => {
      const coupon = await CouponModel.findOne({ name: val });
      if (coupon)
        throw new Error(
          `Coupon name must be unique, (${val}) was added before`
        );

      // return true;
    }),

  check('expiryDate').notEmpty().withMessage('expiryDate is required.'),

  check('quantity')
    .notEmpty()
    .withMessage('quantity is required.')
    .isNumeric()
    .withMessage('Discount must be a valid number'),

  check('discount')
    .notEmpty()
    .withMessage('Coupon phone is re required.')
    .isNumeric()
    .withMessage('Discount must be a valid number'),
  validationMiddleware,
];

export const updateCouponValidation = [
  check('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('alias is too short')
    .isLength({ max: 40 })
    .withMessage('alias is too long.')
    .custom(async (val, { req }) => {
      CouponModel.findOne({ name: val }).then(coupon => {
        if (coupon) {
          return Promise.reject(
            new Error(`Coupon name must be unique, ${val} was added before`)
          );
        }
      });
    }),

  check('expiryDate').optional(),
  check('quantity')
    .optional()
    .isNumeric()
    .withMessage('Discount must be a valid number'),

  check('discount')
    .optional()
    .isNumeric()
    .withMessage('Discount must be a valid number'),
  validationMiddleware,
];

export const getCouponValidation = [
  check('id').isMongoId().withMessage('Invalid Coupon id format'),
  validationMiddleware,
];

export const deleteCouponValidation = [
  check('id').isMongoId().withMessage('Invalid Coupon id format'),
  validationMiddleware,
];
