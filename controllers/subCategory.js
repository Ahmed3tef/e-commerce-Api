import slugify from 'slugify';
// import { CategoryModel } from '../models/category.js';

import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { SubCategoryModel } from '../models/subCategory.js';

export const getSubCategories = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  let filterObj = {};
  if (categoryId) filterObj = { category: categoryId };

  const subCategories = await SubCategoryModel.find({ filterObj })
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name' });

  res.status(200).json({ status: 'success', data: subCategories });
});

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

export const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);
  if (!subCategory) return next(new ApiError(`subCategory not found.`, 404));
  res.status(200).json({ data: subCategory });
});

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId } = req.body;

  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category: categoryId,
  });

  res.status(201).json({ status: 'success', data: subCategory });
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!subCategory) return next(new ApiError(`subCategory not found.`, 404));

  res.status(200).json({ data: subCategory });
});

export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findOneAndDelete(id);
  if (!subCategory) return next(new ApiError(`subCategory not found.`, 404));
  res.status(200).json({ message: 'deleted' });
});
