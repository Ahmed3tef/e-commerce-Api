import { Router } from 'express';

import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
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
  .patch(updateBrandValidation, updateBrand)
  .delete(deleteBrandValidation, deleteBrand);

router.post('/create', createBrandValidation, createBrand);

export default router;
