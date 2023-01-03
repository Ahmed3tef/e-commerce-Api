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

const router = Router();

router.get('/', getBrands);

router
  .route('/one/:id')
  .get(getBrandValidation, getBrand)
  .patch(createBrandImage, resizeBrandImage, updateBrandValidation, updateBrand)
  .delete(deleteBrandValidation, deleteBrand);

router.post(
  '/create',
  createBrandImage,
  resizeBrandImage,
  createBrandValidation,
  createBrand
);

export default router;
