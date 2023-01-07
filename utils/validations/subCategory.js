import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';
import slugify from 'slugify';

export const getSubCategoryValidation = [
  check('id').isMongoId().withMessage('Invalid category id'),
  validationMiddleware,
];

export const updateSubCategoryValidation = getSubCategoryValidation;
export const deleteSubCategoryValidation = getSubCategoryValidation;

export const createSubCategoryValidation = [
  check('name')
    .notEmpty()
    .withMessage('subCategory name is required.')
    .trim()
    .isLength({ min: 3 })
    .withMessage('name is too short')
    .isLength({ max: 30 })
    .withMessage('name is too long.')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('category')
    .notEmpty()
    .withMessage('category id is required.')
    .trim()
    .isMongoId()
    .withMessage('category id is required.'),
  validationMiddleware,
];
