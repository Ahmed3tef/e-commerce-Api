import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';
import slugify from 'slugify';

export const getCategoryValidation = [
  // check searches everywhere : params, body, headers
  check('id').isMongoId().withMessage('Invalid category id'),
  validationMiddleware,
];

// عشان احنا بنشيك بس علي الاي دي ف اانا عملت كدا لكن ف الطبيعي احنا هنعمل لكل واحدة فاليديشن
export const updateCategoryValidation = getCategoryValidation;
export const deleteCategoryValidation = getCategoryValidation;

export const createCategoryValidation = [
  check('name')
    .notEmpty()
    .withMessage('category name is required.')
    .isLength({ min: 3 })
    .withMessage('name is too short')
    .isLength({ max: 30 })
    .withMessage('name is too long.')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validationMiddleware,
];
