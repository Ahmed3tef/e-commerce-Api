import slugify from 'slugify';
import { CategoryModel } from '../models/category.js';

// الدالة دي بتخيليني اما اعمل اويت للرسبونس بتاع المونجو سرفر لما يحصل ايرور ف هي هترميه تلقائي ل اكسبرس
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';

// get all cats
export const getCategories = asyncHandler(async (req, res, next) => {
  // pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit); // by {} it returns all the data
  res.status(200).json({ status: 'success', data: categories });
});

// get one cat
export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) return next(new ApiError(`Category not found`, 404));

  // return res.status(404).send({ message: 'Category not found.'' });
  res.status(200).json({ data: category });
});

// create cat
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) return next(new ApiError(`Category name is required.`, 404));
  const category = await CategoryModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({ status: 'success', data: category });

  // could also be then catch like that

  // CategoryModel.create({
  //   name,
  //   slug: slugify(name),
  // })
  //   .then(category =>
  //     res.status(201).send({ status: 'success', data: category })
  //   )
  //   .catch(err => res.status(400).json({ err }));

  // could also be in try catch blocks
});

// update cat

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) return next(new ApiError(`Category name is required.`, 404));
  if (!id) return next(new ApiError(`Category id is required.`, 404));

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id }, // find by what ?
    { name, slug: slugify(name) }, // what to update
    { new: true } // get back the new updated category (if not set it returns the old one).
  );
  if (!category) return next(new ApiError(`Category not found.`, 404));

  res.status(200).json({ data: category });
});

// update cat

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findOneAndDelete(id);
  if (!category) return next(new ApiError(`Category not found.`, 404));
  res.status(200).json({ message: 'deleted' });
});
