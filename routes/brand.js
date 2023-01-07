import { Router } from 'express';

import {
  createBrand,
  createBrandImage,
  deleteBrand,
  getBrand,
  getBrands,
  resizeBrandImage,
  updateBrand,
} from '../controllers/brand.js';

import {
  createBrandValidation,
  deleteBrandValidation,
  getBrandValidation,
  updateBrandValidation,
} from '../utils/validations/brand.js';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';

const router = Router();

router.get('/', getBrands);

router
  .route('/one/:id')
  .get(getBrandValidation, getBrand)
  .patch(
    tokenProtection,
    accessAllowedTo('admin', 'manager'),
    createBrandImage,
    resizeBrandImage,
    updateBrandValidation,
    updateBrand
  )
  .delete(
    tokenProtection,
    accessAllowedTo('admin'),
    deleteBrandValidation,
    deleteBrand
  );

router.post(
  '/create',
  tokenProtection,
  accessAllowedTo('admin', 'manager'),
  createBrandImage,
  resizeBrandImage,
  createBrandValidation,
  createBrand
);

export default router;
