import slugify from 'slugify';
import { BrandModel } from '../models/brand.js';

// الدالة دي بتخيليني اما اعمل اويت للرسبونس بتاع المونجو سرفر لما يحصل ايرور ف هي هترميه تلقائي ل اكسبرس
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';

// get all cats
export const getBrands = asyncHandler(async (req, res, next) => {
  // pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;
  const brands = await BrandModel.find({}).skip(skip).limit(limit); // by {} it returns all the data
  res.status(200).json({ status: 'success', data: brands });
});

// get one cat
export const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);
  if (!brand) return next(new ApiError(`brand not found.`, 404));
  // return res.status(404).send({ message: 'Brand not found.'' });
  res.status(200).json({ data: brand });
});

// create cat
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brand = await BrandModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({ status: 'success', data: brand });

  // could also be then catch like that

  // BrandModel.create({
  //   name,
  //   slug: slugify(name),
  // })
  //   .then(Brand =>
  //     res.status(201).send({ status: 'success', data: brand })
  //   )
  //   .catch(err => res.status(400).json({ err }));

  // could also be in try catch blocks
});

// update cat

export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const brand = await BrandModel.findOneAndUpdate(
    { _id: id }, // find by what ?
    { name, slug: slugify(name) }, // what to update
    { new: true } // get back the new updated brand (if not set it returns the old one).
  );
  if (!brand) return next(new ApiError(`Brand not found.`, 404));

  res.status(200).json({ data: brand });
});

// update cat

export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await BrandModel.findOneAndDelete(id);
  if (!brand) return next(new ApiError(`Brand not found.`, 404));
  res.status(200).json({ message: 'deleted' });
});
