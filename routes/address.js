import { Router } from 'express';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

import {
  addAddress,
  getUserAddresses,
  removeAddress,
} from '../controllers/address.js';
import {
  createAddressValidation,
  deleteAddressValidation,
} from '../utils/validations/address.js';

const router = Router();

// must be valid logged in user and only user can access this route
router.use(tokenProtection, accessAllowedTo('user'));

router
  .route('/')
  .get(getUserAddresses)
  .post(createAddressValidation, addAddress);

router.delete('/:addressId', deleteAddressValidation, removeAddress);

export default router;
