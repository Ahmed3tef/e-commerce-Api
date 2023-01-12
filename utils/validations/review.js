import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';
import { ReviewModel } from '../../models/reviews.js';

export const getReviewValidation = [
  check('id').isMongoId().withMessage('Invalid review id'),
  validationMiddleware,
];

export const deleteReviewValidation = [
  check('id')
    .isMongoId()
    .withMessage('Invalid review id')
    .custom((val, { req }) => {
      ReviewModel.findById(val).then(review => {
        if (!review)
          return Promise.reject(new Error(`no review found with this id.`));
        if (req.user._id.toString() !== review.user._id.toString())
          return Promise.reject(
            new Error(`You are not allowed to perform this action.`)
          );
      });
    }),

  validationMiddleware,
];
export const updateReviewValidation = [
  check('id')
    .isMongoId()
    .withMessage('Invalid review id')
    .custom((val, { req }) => {
      if (req.user.role === 'user') {
        ReviewModel.findById(val).then(review => {
          if (!review)
            return Promise.reject(new Error(`no review found with this id.`));
          // هنا بقوله لو اليوزر اللي عايز يعمل الديليت مش هو اليوزر اللي عامل لوجن .. فيما معناه ان اليوزر اللي داخل هنا عندي هو اللي لازم يكون عامل الريفيو والا مش هيعرف يمسحها
          if (req.user._id.toString() !== review.user._id.toString())
            return Promise.reject(
              new Error(`user can't make more than one review on a product.`)
            );
        });
        // كدا كدا لازم هيكون عندي توكن بدخل بيها .. حالة اليوزر احنا عملناها واللي باقي هيكون ادمن ومانجر ف الاتنين دول كدا ممكن يمسحوا  الريفيو عادي .. دي كدا زي النكست ف الميدل وير
      }
      return true;
    }),

  validationMiddleware,
];

export const createReviewValidation = [
  check('title').optional().trim(),
  check('comment').optional().trim(),

  check('rating')
    .notEmpty()
    .withMessage('rating number is required.')
    .isFloat({ min: 1, max: 5 })
    .withMessage('rating number must be between 1 and 5'),

  check('user')
    .notEmpty()
    .withMessage('user id is required.')
    .isMongoId()
    .withMessage('user id must be valid mongodb id.')
    .custom((val, { req }) =>
      ReviewModel.findOne({
        product: req.body.product,
        user: req.user._id, // could also be val
      }).then(review => {
        if (review)
          return Promise.reject(
            new Error(`user can't make more than one review on a product.`)
          );
      })
    ),

  check('product')
    .notEmpty()
    .withMessage('product id is required.')
    .isMongoId()
    .withMessage('product id must be valid mongodb id.'),
  validationMiddleware,
];
