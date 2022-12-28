import slugify from 'slugify';
// import { CategoryModel } from '../models/category.js';

import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { ProductModel } from '../models/product.js';

export const getProducts = asyncHandler(async (req, res, next) => {
  // 1- filtering
  const queryObject = { ...req.query };
  const excludesFields = ['sort', 'limit', 'page', 'fields'];
  excludesFields.forEach(field => delete queryObject[field]);

  // apply filtering with less or greater
  // هنا انا بقوله لو جه ف الركوست كويري القيم دي المفروض هي جاية مفهاش ال$  ف انا هحطها عشان انا محتاجها ف مونجو هي اللي هتفلتر الحاجة ليا
  // هنحوله من اوبجكت ل سترنج عشان نقدر نتعامل معاه وبعد كدا هنعمل عليه عملية اضافة الرمز $ وبعدين هنحوله تاني ل اوبجكت ونمرره للفايند وبكدا هنكون فلترنا

  let queryStr = JSON.stringify(queryObject).replace(
    /\b(gt|gte|lt|lte)\b/g,
    match => `$${match}`
  );
  // 2- pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  let mongooseQuery = ProductModel.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate(['category', 'subcategory', 'brand']);

  // 3- sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    mongooseQuery = mongooseQuery.sort(sortBy);
  }

  // 4- select fields:
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select('-__v');
  }

  // 5- search
  if (req.query.keyword) {
    // هيكون جايلي كلام معين انا عايز اخده وادور ف الاسم والوصف بتاع المنتج
    const query = {};
    query.$or = [
      {
        // options  i بتتعامل مع الكلام الصغير زي الكبير small and capital equals
        title: { $regex: req.query.keyword, options: 'i' },
      },
      {
        description: { $regex: req.query.keyword, options: 'i' },
      },
    ];
    // كل حاجة انت عايز تدور فيها هتديها اوبجكت واسم الفيلد و الاوبشنين دول

    mongooseQuery = mongooseQuery.find(query);
  }

  const products = await mongooseQuery;

  res.status(200).json({ status: 'success', data: products });
});

// export const getCategoryProducts = asyncHandler(async (req, res, next) => {
//   console.log(req.query);
//   const { categoryId } = req.query;
//   if (!categoryId) return next(new ApiError(`Category id is required.`, 401));

//   const page = +req.query.page || 1;
//   const limit = +req.query.limit || 5;
//   const skip = (page - 1) * limit;

//   const products = await ProductModel.find({ category: categoryId })
//     .skip(skip)
//     .limit(limit)
//     .populate({ path: 'category', select: 'name' });

//   res.status(200).json({ status: 'success', data: products });
// });

export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id).populate([
    'category',
    'subcategory',
    'brand',
  ]);
  if (!product) return next(new ApiError(`Product not found.`, 404));
  res.status(200).json({ data: product });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);

  const product = await ProductModel.create(req.body);

  res.status(201).json({ status: 'success', data: product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) return next(new ApiError(`Product not found.`, 404));

  res.status(200).json({ data: product });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findOneAndDelete(id);
  if (!product) return next(new ApiError(`Product not found.`, 404));
  res.status(200).json({ message: 'deleted' });
});
