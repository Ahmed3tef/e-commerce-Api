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
    .isLength({ min: 3 })
    .withMessage('name is too short')
    .isLength({ max: 30 })
    .withMessage('name is too long.')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('categoryId')
    .notEmpty()
    .withMessage('category id is required.')
    .isMongoId()
    .withMessage('category id is required.'),
  validationMiddleware,
];
