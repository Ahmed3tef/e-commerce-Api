import {
  refactorAndSaveImage,
  uploadSingleImage,
} from '../middlewares/uploadImages.js';
import { BrandModel } from '../models/brand.js';

import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlers.js';

// upload single image
export const createBrandImage = uploadSingleImage('image');

// image processing
export const resizeBrandImage = refactorAndSaveImage('brands');

// get all brends
export const getBrands = getAllHandler(BrandModel);

// get one brand
export const getBrand = getOneHandler(BrandModel, 'Brand');

// create brand
export const createBrand = createHandler(BrandModel);

// export const createBrand = asyncHandler(async (req, res, next) => {
//   const { name } = req.body;

//   const brand = await BrandModel.create({
//     name,
//     slug: slugify(name),
//   });
//   res.status(201).json({ status: 'success', data: brand });

//   // could also be then brendch like that

//   // BrandModel.create({
//   //   name,
//   //   slug: slugify(name),
//   // })
//   //   .then(Brand =>
//   //     res.status(201).send({ status: 'success', data: brand })
//   //   )
//   //   .brendch(err => res.status(400).json({ err }));

//   // could also be in try brendch blocks
// });

// update brand

export const updateBrand = updateHandler(BrandModel, 'Brand');

// update brand

export const deleteBrand = deleteHandler(BrandModel, 'Brand');
