import { CategoryModel } from '../models/category.js';

import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlers.js';

import {
  refactorAndSaveImage,
  uploadSingleImage,
} from '../middlewares/uploadImages.js';

// upload single image
export const createCategoryImage = uploadSingleImage('image');

// image processing
export const resizeCategoryImage = refactorAndSaveImage('categories');

// get all cats
export const getCategories = getAllHandler(CategoryModel);

// get one cat
export const getCategory = getOneHandler(CategoryModel, 'Category');

// create cat

// export const createCategory = asyncHandler(async (req, res, next) => {
//   const { name } = req.body;

//   const category = await CategoryModel.create({
//     name,
//     slug: slugify(name),
//   });
//   res.status(201).json({ status: 'success', data: category });

//   // could also be then catch like that

//   // CategoryModel.create({
//   //   name,
//   //   slug: slugify(name),
//   // })
//   //   .then(category =>
//   //     res.status(201).send({ status: 'success', data: category })
//   //   )
//   //   .catch(err => res.status(400).json({ err }));

//   // could also be in try catch blocks
// });
export const createCategory = createHandler(CategoryModel);

// update cat

export const updateCategory = updateHandler(CategoryModel, 'Category');

// update cat

export const deleteCategory = deleteHandler(CategoryModel, 'Category');
