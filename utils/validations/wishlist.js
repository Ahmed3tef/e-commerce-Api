import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';

export const productWishlistValidation = [
  // check searches everywhere : params, body, headers
  check('productId')
    .notEmpty()
    .withMessage('Product id is required.')
    .isMongoId()
    .withMessage('Invalid Product id'),
  validationMiddleware,
];
