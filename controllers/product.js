import {
  refactorAndSaveImage,
  uploadMultipleImages,
} from '../middlewares/uploadImages.js';
import { ProductModel } from '../models/product.js';

import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlres.js';

// export const getProducts = asyncHandler(async (req, res, next) => {
//   // // 1- filtering
//   // const queryObject = { ...req.query };
//   // const excludesFields = ['sort', 'limit', 'page', 'fields'];
//   // excludesFields.forEach(field => delete queryObject[field]);

//   // // apply filtering with less or greater
//   // // هنا انا بقوله لو جه ف الركوست كويري القيم دي المفروض هي جاية مفهاش ال$  ف انا هحطها عشان انا محتاجها ف مونجو هي اللي هتفلتر الحاجة ليا
//   // // هنحوله من اوبجكت ل سترنج عشان نقدر نتعامل معاه وبعد كدا هنعمل عليه عملية اضافة الرمز $ وبعدين هنحوله تاني ل اوبجكت ونمرره للفايند وبكدا هنكون فلترنا

//   // let queryStr = JSON.stringify(queryObject).replace(
//   //   /\b(gt|gte|lt|lte)\b/g,
//   //   match => `$${match}`
//   // );
//   // // 2- pagination
//   // const page = +req.query.page || 1;
//   // const limit = +req.query.limit || 5;
//   // const skip = (page - 1) * limit;

//   // let mongooseQuery = ProductModel.find(JSON.parse(queryStr))
//   //   .skip(skip)
//   //   .limit(limit)
//   //   .populate(['category', 'subcategory', 'brand']);

//   // // 3- sorting
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   mongooseQuery = mongooseQuery.sort(sortBy);
//   // }

//   // // 4- select fields:
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   mongooseQuery = mongooseQuery.select(fields);
//   // } else {
//   //   mongooseQuery = mongooseQuery.select('-__v');
//   // }

//   // // 5- search
//   // if (req.query.keyword) {
//   //   // هيكون جايلي كلام معين انا عايز اخده وادور ف الاسم والوصف بتاع المنتج
//   //   const query = {};
//   //   query.$or = [
//   //     {
//   //       // options  i بتتعامل مع الكلام الصغير زي الكبير small and capital equals
//   //       title: { $regex: req.query.keyword, options: 'i' },
//   //     },
//   //     {
//   //       description: { $regex: req.query.keyword, options: 'i' },
//   //     },
//   //   ];
//   //   // كل حاجة انت عايز تدور فيها هتديها اوبجكت واسم الفيلد و الاوبشنين دول

//   //   mongooseQuery = mongooseQuery.find(query);
//   // }

//   // بدل الكلام اللي فوق دا كله احنا اخدناه ف كلاس عشان نقدر نستخدمه ف اكتر من مكان تاني ودا بقا شكل الكود الجديد

//   const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
//     .paginate()
//     .sort()
//     .search()
//     .filter()
//     .limitFields();

//   const products = await apiFeatures.mongooseQuery.populate([
//     'category',
//     'subcategory',
//     'brand',
//   ]);

//   res.status(200).json({ status: 'success', data: products });
// });

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

export const createProductImage = uploadMultipleImages([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 4 },
]);

// image processing
export const resizeProductImage = refactorAndSaveImage('products');

export const getProducts = getAllHandler(ProductModel);
export const getProduct = getOneHandler(ProductModel);

export const createProduct = createHandler(ProductModel, 'Product');

export const updateProduct = updateHandler(ProductModel, 'Product');

export const deleteProduct = deleteHandler(ProductModel, 'Product');
