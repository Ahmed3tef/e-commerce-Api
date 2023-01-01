import { CategoryModel } from '../models/category.js';
import { v4 as uuid4 } from 'uuid';
import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlres.js';

import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// create storage configration.

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/categories');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `category-${uuid4}-${Date.now()}.${ext}`;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    // cb is like next in express, first arg is the error second is response
    cb(null, true);
  } else {
    cb(new ApiError('only images are allowed', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
export const createCategoryImage = upload.single('image');
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
