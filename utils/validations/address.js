import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validation.js';
import { UserModel } from '../../models/user.js';

export const createAddressValidation = [
  check('alias')
    .notEmpty()
    .withMessage('Address alias is required.')
    .isLength({ min: 2 })
    .withMessage('alias is too short')
    .isLength({ max: 40 })
    .withMessage('alias is too long.')
    .custom(async (val, { req }) => {
      // Validate the address alias.
      const userAddresses = await UserModel.findById(req.user._id).select(
        'addresses'
      );
      if (userAddresses.addresses) {
        const aliasFound = userAddresses.addresses.find(
          address => val.toLowerCase() === address.alias.toLowerCase()
        );
        if (aliasFound)
          throw new Error(
            'This alias was added before, please enter another value'
          );
      }
      return true;
    }),

  check('city')
    .notEmpty()
    .withMessage('city is required.')
    .isLength({ min: 2 })
    .withMessage('city is too short')
    .isLength({ max: 40 })
    .withMessage('city is too long.'),

  check('government')
    .notEmpty()
    .withMessage('government is required.')
    .isLength({ min: 2 })
    .withMessage('government is too short')
    .isLength({ max: 40 })
    .withMessage('government is too long.'),

  check('phone')
    .notEmpty()
    .withMessage('Address phone is re required.')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('details')
    .optional()
    .isLength({ max: 250 })
    .withMessage('alias is too long.'),
  validationMiddleware,
];

export const getAddressValidation = [
  check('addressId').isMongoId().withMessage('Invalid Address id format'),
  validationMiddleware,
];

export const deleteAddressValidation = [
  check('addressId').isMongoId().withMessage('Invalid Address id format'),
  validationMiddleware,
];
