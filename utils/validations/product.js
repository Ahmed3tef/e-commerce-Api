import { check, body } from 'express-validator';
import slugify from 'slugify';
import { CategoryModel } from '../../models/category.js';
import { SubCategoryModel } from '../../models/subCategory.js';
import { validationMiddleware } from '../../middlewares/validation.js';

export const createProductValidator = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Product required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),
  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product quantity must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .isLength({ max: 20 })
    .withMessage('To long price'),
  check('discountPrice')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray()
    .withMessage('Colors should be array of string'),
  check('mainImage').notEmpty().withMessage('Product mainImage is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),
  check('category')
    .notEmpty()
    .withMessage('Product must be belong to a category')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(categoryId =>
      CategoryModel.findById(categoryId).then(category => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),

  check('subcategory')
    .notEmpty()
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(subcategoryId =>
      SubCategoryModel.findById(subcategoryId).then(subcategory => {
        if (!subcategory) {
          return Promise.reject(
            new Error(`No subcategory for this id: ${subcategoryId}`)
          );
        }
      })
    ),
  // .custom((val, { req }) =>
  //   SubCategory.find({ category: req.body.category }).then(subcategories => {
  //     const subCategoriesIdsInDB = [];
  //     subcategories.forEach(subCategory => {
  //       subCategoriesIdsInDB.push(subCategory._id.toString());
  //     });
  //     // check if subcategories ids in db include subcategories in req.body (true)
  //     const checker = (target, arr) => target.every(v => arr.includes(v));
  //     if (!checker(val, subCategoriesIdsInDB)) {
  //       return Promise.reject(
  //         new Error(`subcategories not belong to category`)
  //       );
  //     }
  //   })
  // )
  check('brand').optional().isMongoId().withMessage('Invalid ID formate'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),

  validationMiddleware,
];

export const getProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validationMiddleware,
];

export const updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

export const deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validationMiddleware,
];
