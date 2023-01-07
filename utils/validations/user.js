import { check, body } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';
import { UserModel } from '../../models/user.js';
import bcrypt from 'bcryptjs';
export const createUserValidation = [
  check('name')
    .notEmpty()
    .withMessage('User required')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Too short User name'),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .custom(val =>
      UserModel.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('E-mail already used'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required')
    .trim(),

  check('phone')
    .notEmpty()
    .trim()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('image').optional(),
  check('role').optional(),

  validationMiddleware,
];

export const getUserValidation = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validationMiddleware,
];

export const updateUserValidation = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name').optional().trim(),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .custom(val =>
      UserModel.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .trim()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('image').optional(),
  check('role').optional(),
  validationMiddleware,
];

export const updateUserPasswordValidation = [
  check('id').isMongoId().withMessage('Invalid User id'),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('password confirmation is required')
    .trim(),
  check('currentPassword')
    .notEmpty()
    .withMessage('please enter your current password')
    .trim(),
  check('password')
    .notEmpty()
    .withMessage('password is required')
    .trim()
    .isLength({ min: 8 })
    .withMessage('password is too short')
    .custom(async (password, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error('User not found');
      }
      const currentPasswordIsCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!currentPasswordIsCorrect)
        throw new Error('current password is incorrect');

      if (password !== req.body.passwordConfirm) {
        throw new Error('Password confirmation incorrect');
      }

      if (password === req.body.currentPassword) {
        throw new Error('new password should not be equal to current password');
      }
      return true;
    }),
  validationMiddleware,
];
