import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';

export const getBrandValidation = [
  // check searches everywhere : params, body, headers
  check('id').isMongoId().withMessage('Invalid Brand id'),
  validationMiddleware,
];

// عشان احنا بنشيك بس علي الاي دي ف اانا عملت كدا لكن ف الطبيعي احنا هنعمل لكل واحدة فاليديشن
export const updateBrandValidation = getBrandValidation;
export const deleteBrandValidation = getBrandValidation;

export const createBrandValidation = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required.')
    .isLength({ min: 3 })
    .withMessage('name is too short')
    .isLength({ max: 30 })
    .withMessage('name is too long.'),
  validationMiddleware,
];
