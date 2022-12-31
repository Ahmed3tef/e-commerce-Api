import slugify from 'slugify';
// import { CategoryModel } from '../models/category.js';

import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { SubCategoryModel } from '../models/subCategory.js';
import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlres.js';

export const getSubCategories = getAllHandler(SubCategoryModel);

export const getCategorySubCategories = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const { categoryId } = req.query;
  if (!categoryId) return next(new ApiError(`Category id is required.`, 401));

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategoryModel.find({ category: categoryId })
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name' });

  res.status(200).json({ status: 'success', data: subCategories });
});

export const getSubCategory = getOneHandler(SubCategoryModel, 'SubCategory');

export const createSubCategory = createHandler(SubCategoryModel);

export const updateSubCategory = updateHandler(SubCategoryModel, 'SubCategory');

export const deleteSubCategory = deleteHandler(SubCategoryModel, 'SubCategory');
